from django.shortcuts import render, get_object_or_404
from django.views.generic import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
import uuid
from datetime import datetime

from .models import Formulario, FormularioItem, FormularioGlobal, ItemFormulario

class FormularioView(View):
    template_name = 'forms/form.html'

    def get(self, request):
        # Generar un ID único para el formulario si no existe
        form_id = request.session.get('form_id')
        if not form_id:
            form_id = str(uuid.uuid4())
            request.session['form_id'] = form_id
        
        context = {
            'form_id': form_id,
        }
        return render(request, self.template_name, context)

    @method_decorator(csrf_exempt)
    def post(self, request):
        try:
            # Obtener o crear formulario global
            form_id = request.session.get('form_id', str(uuid.uuid4()))
            
            # Recopilar todos los datos del formulario
            form_data = {}
            
            # Información general
            general_fields = [
                'trabajo', 'municipio', 'numero_x', 'regional', 'direccion', 'numero_y',
                'alimentador', 'barrio_vereda', 'numero_z', 'nivel_tension', 'circuito'
            ]
            
            # Estructura nueva
            estructura_nueva_fields = [
                'cod_est_nueva', 'apoyo_nueva', 'material_nueva', 'altura_nueva',
                'poblacion_nueva', 'disposicion_nueva', 'kgf_nueva', 'tipo_red_nueva'
            ]
            
            # Estructura retirada
            estructura_retirada_fields = [
                'cod_est_retirada', 'apoyo_retirada', 'material_retirada', 'altura_retirada',
                'poblacion_retirada', 'kgf_retirada', 'disposicion_retirada', 
                'punto_retirada', 'tipo_red_retirada'
            ]
            
            # Información del proyecto
            proyecto_fields = [
                'nombre', 'ot_mano_obra', 'ot_materia', 'contrato', 'pro_terc', 'movil',
                'instalados', 'pendientes'
            ]
            
            # UC
            uc_fields = ['uc_codigo', 'descripcion_uc']
            
            # Archivos
            archivo_fields = ['archivo_cad']
            
            all_fields = (general_fields + estructura_nueva_fields + 
                         estructura_retirada_fields + proyecto_fields + 
                         uc_fields + archivo_fields)
            
            for field in all_fields:
                value = request.POST.get(field, '')
                if field in ['numero_x', 'numero_y', 'numero_z', 'instalados', 'pendientes']:
                    form_data[field] = int(value) if value else None
                else:
                    form_data[field] = value

            # Crear o actualizar formulario global
            formulario_global, created = FormularioGlobal.objects.update_or_create(
                id=form_id,
                defaults={**form_data, 'estado': 'completado'}
            )

            # Notificar via WebSocket
            channel_layer = get_channel_layer()
            if channel_layer:
                async_to_sync(channel_layer.group_send)(
                    f'form_{form_id}',
                    {
                        'type': 'form_submitted',
                        'data': {
                            'form_id': form_id,
                            'status': 'completed',
                            'message': 'Formulario enviado exitosamente'
                        }
                    }
                )

            return JsonResponse({
                'status': 'success',
                'form_id': form_id,
                'message': 'Formulario guardado exitosamente'
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error', 
                'message': str(e)
            }, status=400)

class FormularioAPIView(View):
    """API para operaciones CRUD del formulario"""
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, form_id=None):
        """Obtener datos del formulario"""
        try:
            if form_id:
                formulario = get_object_or_404(FormularioGlobal, id=form_id)
                items = ItemFormulario.objects.filter(formulario=formulario)
                
                return JsonResponse({
                    'status': 'success',
                    'data': {
                        'formulario': self.serialize_formulario(formulario),
                        'items': [self.serialize_item(item) for item in items]
                    }
                })
            else:
                # Listar todos los formularios
                formularios = FormularioGlobal.objects.all()[:50]  # Límite de 50
                return JsonResponse({
                    'status': 'success',
                    'data': [self.serialize_formulario(f) for f in formularios]
                })
                
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)
    
    def post(self, request):
        """Crear nuevo formulario"""
        try:
            data = json.loads(request.body)
            form_id = str(uuid.uuid4())
            
            formulario = FormularioGlobal.objects.create(
                id=form_id,
                **data.get('formulario', {})
            )
            
            # Notificar via WebSocket
            self.notify_form_change(form_id, 'created', formulario)
            
            return JsonResponse({
                'status': 'success',
                'form_id': form_id,
                'data': self.serialize_formulario(formulario)
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)
    
    def put(self, request, form_id):
        """Actualizar formulario"""
        try:
            data = json.loads(request.body)
            formulario = get_object_or_404(FormularioGlobal, id=form_id)
            
            # Actualizar campos
            for field, value in data.get('formulario', {}).items():
                if hasattr(formulario, field):
                    setattr(formulario, field, value)
            
            formulario.save()
            
            # Notificar via WebSocket
            self.notify_form_change(form_id, 'updated', formulario)
            
            return JsonResponse({
                'status': 'success',
                'data': self.serialize_formulario(formulario)
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)
    
    def delete(self, request, form_id):
        """Eliminar formulario"""
        try:
            formulario = get_object_or_404(FormularioGlobal, id=form_id)
            formulario.delete()
            
            # Notificar via WebSocket
            self.notify_form_change(form_id, 'deleted', None)
            
            return JsonResponse({
                'status': 'success',
                'message': 'Formulario eliminado'
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)
    
    def serialize_formulario(self, formulario):
        """Serializar formulario para JSON"""
        return {
            'id': formulario.id,
            'trabajo': formulario.trabajo,
            'municipio': formulario.municipio,
            'numero_x': formulario.numero_x,
            'regional': formulario.regional,
            'direccion': formulario.direccion,
            'numero_y': formulario.numero_y,
            'alimentador': formulario.alimentador,
            'barrio_vereda': formulario.barrio_vereda,
            'numero_z': formulario.numero_z,
            'nivel_tension': formulario.nivel_tension,
            'circuito': formulario.circuito,
            'cod_est_nueva': formulario.cod_est_nueva,
            'apoyo_nueva': formulario.apoyo_nueva,
            'material_nueva': formulario.material_nueva,
            'altura_nueva': formulario.altura_nueva,
            'poblacion_nueva': formulario.poblacion_nueva,
            'disposicion_nueva': formulario.disposicion_nueva,
            'kgf_nueva': formulario.kgf_nueva,
            'tipo_red_nueva': formulario.tipo_red_nueva,
            'cod_est_retirada': formulario.cod_est_retirada,
            'apoyo_retirada': formulario.apoyo_retirada,
            'material_retirada': formulario.material_retirada,
            'altura_retirada': formulario.altura_retirada,
            'poblacion_retirada': formulario.poblacion_retirada,
            'kgf_retirada': formulario.kgf_retirada,
            'disposicion_retirada': formulario.disposicion_retirada,
            'punto_retirada': formulario.punto_retirada,
            'tipo_red_retirada': formulario.tipo_red_retirada,
            'nombre': formulario.nombre,
            'ot_mano_obra': formulario.ot_mano_obra,
            'ot_materia': formulario.ot_materia,
            'contrato': formulario.contrato,
            'pro_terc': formulario.pro_terc,
            'movil': formulario.movil,
            'instalados': formulario.instalados,
            'pendientes': formulario.pendientes,
            'uc_codigo': formulario.uc_codigo,
            'descripcion_uc': formulario.descripcion_uc,
            'archivo_cad': formulario.archivo_cad,
            'fecha_creacion': formulario.fecha_creacion.isoformat(),
            'fecha_actualizacion': formulario.fecha_actualizacion.isoformat(),
            'estado': formulario.estado,
        }
    
    def serialize_item(self, item):
        """Serializar item para JSON"""
        return {
            'id': item.id,
            'campo_1': item.campo_1,
            'campo_2': item.campo_2,
            'campo_3': item.campo_3,
            'campo_4': item.campo_4,
            'campo_5': item.campo_5,
            'foto_path': item.foto_path,
            'fecha_creacion': item.fecha_creacion.isoformat(),
            'orden': item.orden,
        }
    
    def notify_form_change(self, form_id, action, formulario):
        """Notificar cambios via WebSocket"""
        try:
            channel_layer = get_channel_layer()
            if channel_layer:
                data = None
                if formulario:
                    data = self.serialize_formulario(formulario)
                
                async_to_sync(channel_layer.group_send)(
                    f'form_{form_id}',
                    {
                        'type': 'form_changed',
                        'action': action,
                        'data': data
                    }
                )
        except Exception as e:
            print(f"Error notificando cambio via WebSocket: {e}")

# Mantener vista original para compatibilidad
class FormularioLegacyView(View):
    template_name = 'forms/form.html'

    def get(self, request):
        return render(request, self.template_name)

    @method_decorator(csrf_exempt)
    def post(self, request):
        try:
            # Crear el formulario
            formulario = Formulario.objects.create(
                conductor=request.POST.get('conductor'),
                supervisor=request.POST.get('supervisor'),
                fecha=datetime.now(),  # Oracle DATE con tiempo
                archivo_cad=request.POST.get('archivo_cad')
            )

            # Procesar los items
            items_json = json.loads(request.POST.get('items', '[]'))
            for item_data in items_json:
                FormularioItem.objects.create(
                    formulario=formulario,
                    bid=item_data['bid'],
                    card=item_data['card'],
                    uc=item_data.get('uc', ''),
                    attribute=item_data['attribute'],
                    material=item_data['material'],
                    foto_path=item_data.get('foto_path', '')
                )

            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
