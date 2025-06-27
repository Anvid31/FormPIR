"""
WebSocket consumers for real-time form updates
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from .models import Formulario, FormularioItem
from django.utils import timezone
import oracledb


class FormConsumer(AsyncWebsocketConsumer):
    """Consumer para manejar actualizaciones de formulario específico"""
    
    async def connect(self):
        self.form_id = self.scope['url_route']['kwargs']['form_id']
        self.form_group_name = f'form_{self.form_id}'

        # Join form group
        await self.channel_layer.group_add(
            self.form_group_name,
            self.channel_name
        )

        await self.accept()
        
        # Enviar datos iniciales del formulario
        initial_data = await self.get_form_data()
        await self.send(text_data=json.dumps({
            'type': 'initial_data',
            'data': initial_data
        }))

    async def disconnect(self, close_code):
        # Leave form group
        await self.channel_layer.group_discard(
            self.form_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json['type']
            
            if message_type == 'form_update':
                # Actualizar formulario
                await self.handle_form_update(text_data_json['data'])
            elif message_type == 'add_item':
                # Agregar nuevo item
                await self.handle_add_item(text_data_json['data'])
            elif message_type == 'update_item':
                # Actualizar item existente
                await self.handle_update_item(text_data_json['data'])
            elif message_type == 'delete_item':
                # Eliminar item
                await self.handle_delete_item(text_data_json['data'])
            elif message_type == 'validate_uc':
                # Validar UC en tiempo real
                await self.handle_validate_uc(text_data_json['data'])
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Formato de mensaje inválido'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error procesando mensaje: {str(e)}'
            }))

    async def handle_form_update(self, data):
        """Manejar actualización de campos del formulario"""
        try:
            # Actualizar formulario en la base de datos
            form_data = await self.update_form_in_db(data)
            
            # Notificar a todos los conectados al grupo
            await self.channel_layer.group_send(
                self.form_group_name,
                {
                    'type': 'form_updated',
                    'data': form_data
                }
            )
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error actualizando formulario: {str(e)}'
            }))

    async def handle_add_item(self, data):
        """Manejar adición de nuevo item"""
        try:
            # Validar UC antes de agregar
            uc_validation = await self.validate_uc_in_db(data.get('uc', ''))
            
            if not uc_validation['valid']:
                await self.send(text_data=json.dumps({
                    'type': 'validation_error',
                    'field': 'uc',
                    'message': uc_validation['message']
                }))
                return
            
            # Agregar item a la base de datos
            item_data = await self.add_item_to_db(data)
            
            # Notificar a todos los conectados
            await self.channel_layer.group_send(
                self.form_group_name,
                {
                    'type': 'item_added',
                    'data': item_data
                }
            )
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error agregando item: {str(e)}'
            }))

    async def handle_update_item(self, data):
        """Manejar actualización de item existente"""
        try:
            item_data = await self.update_item_in_db(data)
            
            await self.channel_layer.group_send(
                self.form_group_name,
                {
                    'type': 'item_updated',
                    'data': item_data
                }
            )
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error actualizando item: {str(e)}'
            }))

    async def handle_delete_item(self, data):
        """Manejar eliminación de item"""
        try:
            await self.delete_item_from_db(data['item_id'])
            
            await self.channel_layer.group_send(
                self.form_group_name,
                {
                    'type': 'item_deleted',
                    'data': {'item_id': data['item_id']}
                }
            )
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error eliminando item: {str(e)}'
            }))

    async def handle_validate_uc(self, data):
        """Validar UC en tiempo real"""
        try:
            validation = await self.validate_uc_in_db(data.get('uc', ''))
            
            await self.send(text_data=json.dumps({
                'type': 'uc_validation',
                'valid': validation['valid'],
                'message': validation['message'],
                'uc': data.get('uc', '')
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error validando UC: {str(e)}'
            }))

    # Event handlers para mensajes del grupo
    async def form_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'form_updated',
            'data': event['data']
        }))

    async def item_added(self, event):
        await self.send(text_data=json.dumps({
            'type': 'item_added',
            'data': event['data']
        }))

    async def item_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'item_updated',
            'data': event['data']
        }))

    async def item_deleted(self, event):
        await self.send(text_data=json.dumps({
            'type': 'item_deleted',
            'data': event['data']
        }))

    # Database operations
    @database_sync_to_async
    def get_form_data(self):
        """Obtener datos iniciales del formulario"""
        try:
            formulario = Formulario.objects.get(id=self.form_id)
            items = FormularioItem.objects.filter(formulario=formulario)
            
            return {
                'formulario': {
                    'id': formulario.id,
                    'conductor': formulario.conductor,
                    'supervisor': formulario.supervisor,
                    'fecha': formulario.fecha.isoformat() if formulario.fecha else None,
                    'archivo_cad': formulario.archivo_cad,
                },
                'items': [
                    {
                        'id': item.id,
                        'bid': item.bid,
                        'card': item.card,
                        'uc': item.uc,
                        'attribute': item.attribute,
                        'material': item.material,
                        'foto_path': item.foto_path,
                    } for item in items
                ]
            }
        except Formulario.DoesNotExist:
            return {'formulario': None, 'items': []}

    @database_sync_to_async
    def update_form_in_db(self, data):
        """Actualizar formulario en Oracle"""
        formulario, created = Formulario.objects.get_or_create(
            id=self.form_id,
            defaults={
                'conductor': data.get('conductor', ''),
                'supervisor': data.get('supervisor', ''),
                'fecha': timezone.now(),
                'archivo_cad': data.get('archivo_cad', ''),
            }
        )
        
        if not created:
            # Actualizar campos existentes
            for field in ['conductor', 'supervisor', 'archivo_cad']:
                if field in data:
                    setattr(formulario, field, data[field])
            formulario.save()
        
        return {
            'id': formulario.id,
            'conductor': formulario.conductor,
            'supervisor': formulario.supervisor,
            'fecha': formulario.fecha.isoformat(),
            'archivo_cad': formulario.archivo_cad,
        }

    @database_sync_to_async
    def add_item_to_db(self, data):
        """Agregar item a Oracle"""
        formulario = Formulario.objects.get(id=self.form_id)
        
        item = FormularioItem.objects.create(
            formulario=formulario,
            bid=data.get('bid', ''),
            card=data.get('card', ''),
            uc=data.get('uc', ''),
            attribute=data.get('attribute', ''),
            material=data.get('material', ''),
            foto_path=data.get('foto_path', ''),
        )
        
        return {
            'id': item.id,
            'bid': item.bid,
            'card': item.card,
            'uc': item.uc,
            'attribute': item.attribute,
            'material': item.material,
            'foto_path': item.foto_path,
        }

    @database_sync_to_async
    def update_item_in_db(self, data):
        """Actualizar item en Oracle"""
        item = FormularioItem.objects.get(id=data['id'])
        
        for field in ['bid', 'card', 'uc', 'attribute', 'material', 'foto_path']:
            if field in data:
                setattr(item, field, data[field])
        
        item.save()
        
        return {
            'id': item.id,
            'bid': item.bid,
            'card': item.card,
            'uc': item.uc,
            'attribute': item.attribute,
            'material': item.material,
            'foto_path': item.foto_path,
        }

    @database_sync_to_async
    def delete_item_from_db(self, item_id):
        """Eliminar item de Oracle"""
        FormularioItem.objects.filter(id=item_id).delete()

    @database_sync_to_async
    def validate_uc_in_db(self, uc_code):
        """Validar UC contra base de datos Oracle"""
        if not uc_code:
            return {'valid': False, 'message': 'UC requerido'}
        
        # Aquí puedes agregar validación personalizada contra Oracle
        # Por ejemplo, verificar si el UC existe en una tabla de referencia
        
        # Validación básica de formato
        if not uc_code.startswith('N1P'):
            return {'valid': False, 'message': 'UC debe comenzar con N1P'}
        
        if len(uc_code) < 4:
            return {'valid': False, 'message': 'UC debe tener al menos 4 caracteres'}
        
        return {'valid': True, 'message': 'UC válido'}


class FormDataConsumer(AsyncWebsocketConsumer):
    """Consumer para datos generales de formularios (listado, estadísticas, etc.)"""
    
    async def connect(self):
        self.group_name = 'form_data'
        
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Enviar estadísticas iniciales
        stats = await self.get_form_statistics()
        await self.send(text_data=json.dumps({
            'type': 'statistics',
            'data': stats
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json['type']
            
            if message_type == 'get_statistics':
                stats = await self.get_form_statistics()
                await self.send(text_data=json.dumps({
                    'type': 'statistics',
                    'data': stats
                }))
                
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Error: {str(e)}'
            }))

    @database_sync_to_async
    def get_form_statistics(self):
        """Obtener estadísticas de formularios"""
        try:
            total_forms = Formulario.objects.count()
            total_items = FormularioItem.objects.count()
            
            return {
                'total_forms': total_forms,
                'total_items': total_items,
                'timestamp': timezone.now().isoformat()
            }
        except Exception as e:
            return {
                'total_forms': 0,
                'total_items': 0,
                'error': str(e),
                'timestamp': timezone.now().isoformat()
            }
