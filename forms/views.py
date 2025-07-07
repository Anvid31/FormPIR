from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.contrib import messages
from datetime import datetime
import json
import os
from decimal import Decimal, InvalidOperation

from .models import FormularioGlobal, EstructuraNueva, EstructuraRetirada, ProyectoInfo

class FormularioView(View):
    template_name = 'forms/form.html'

    def get(self, request, form_id=None):
        if form_id:
            formulario = get_object_or_404(FormularioGlobal, id=form_id)
        else:
            # No crear automáticamente, solo mostrar formulario vacío
            formulario = None
            form_id = None

        # Guardar el ID del formulario en la sesión
        request.session['form_id'] = form_id
        
        context = {
            'form_id': form_id,
            'formulario': formulario
        }
        return render(request, self.template_name, context)

    @method_decorator(csrf_exempt)
    def post(self, request):
        try:
            data = json.loads(request.body)
            form_id = data.get('form_id')
            
            if not form_id:
                return JsonResponse({
                    'status': 'error',
                    'message': 'form_id es requerido'
                }, status=400)

            formulario = get_object_or_404(FormularioGlobal, id=form_id)
            
            # Actualizar el formulario con los datos recibidos
            for key, value in data.items():
                if hasattr(formulario, key):
                    setattr(formulario, key, value)
            
            formulario.save()

            return JsonResponse({
                'status': 'success',
                'message': 'Formulario actualizado correctamente'
            })

        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)

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
                return JsonResponse(self.serialize_formulario(formulario))
            
            formularios = FormularioGlobal.objects.all().order_by('-created_at')
            return JsonResponse({
                'formularios': [self.serialize_formulario(f) for f in formularios]
            })
        
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    
    def serialize_formulario(self, formulario):
        """Serializar formulario para JSON"""
        estructuras_nuevas = EstructuraNueva.objects.filter(formulario=formulario)
        estructuras_retiradas = EstructuraRetirada.objects.filter(formulario=formulario)
        proyecto = ProyectoInfo.objects.filter(formulario=formulario).first()

        return {
            'id': formulario.id,
            'trabajo': formulario.trabajo,
            'municipio': formulario.municipio,
            'regional': formulario.regional,
            'alimentador': formulario.alimentador,
            'circuito': formulario.circuito,
            'created_at': formulario.created_at.isoformat(),
            'estructuras_nuevas': [{
                'id': e.id,
                'cod_est': e.cod_est,
                'apoyo': e.apoyo,
                'material': e.material,
                'altura': str(e.altura) if e.altura else None,
                'tipo_red': e.tipo_red,
                'poblacion': e.poblacion,
                'disposicion': e.disposicion,
                'kgf': str(e.kgf) if e.kgf else None
            } for e in estructuras_nuevas],
            'estructuras_retiradas': [{
                'id': e.id,
                'cod_est': e.cod_est,
                'apoyo': e.apoyo,
                'material': e.material,
                'altura': str(e.altura) if e.altura else None,
                'tipo_red': e.tipo_red,
                'punto': e.punto
            } for e in estructuras_retiradas],
            'proyecto': {
                'nombre': proyecto.nombre,
                'ot_mano_obra': proyecto.ot_mano_obra,
                'ot_materia': proyecto.ot_materia,
                'contrato': proyecto.contrato,
                'pro_terc': proyecto.pro_terc
            } if proyecto else None
        }

class FormularioSubmitView(View):
    """Vista para enviar formulario completo directamente a la base de datos sin WebSocket"""
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request):
        """Procesar envío del formulario completo"""
        try:
            # Crear o obtener el formulario global
            formulario = FormularioGlobal()
            
            # Mapear datos del formulario global
            formulario.trabajo = request.POST.get('eps', '')
            formulario.municipio = request.POST.get('municipio', '')
            formulario.numero_x = self.parse_int(request.POST.get('numero_x'))
            formulario.regional = request.POST.get('regional', '')
            formulario.direccion = request.POST.get('direccion', '')
            formulario.numero_y = self.parse_int(request.POST.get('numero_y'))
            formulario.alimentador = request.POST.get('alimentador', '')
            formulario.barrio_vereda = request.POST.get('barrio_vereda', '')
            formulario.numero_z = self.parse_int(request.POST.get('numero_z'))
            formulario.nivel_tension = request.POST.get('nivel_tension', '')
            formulario.circuito = request.POST.get('circuito', '')
            
            # Guardar formulario global
            formulario.save()
            
            # Procesar estructura nueva
            self.process_estructura_nueva(request, formulario)
            
            # Procesar estructura retirada
            self.process_estructura_retirada(request, formulario)
            
            # Procesar información del proyecto
            self.process_proyecto_info(request, formulario)
            
            # Procesar archivos de documentos
            self.process_document_files(request, formulario)
            
            return JsonResponse({
                'success': True,
                'message': 'Formulario guardado exitosamente',
                'formulario_id': formulario.id
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    def process_estructura_nueva(self, request, formulario):
        """Procesar estructura nueva"""
        cod_est_nueva = request.POST.get('cod_est_nueva')
        if cod_est_nueva:
            estructura_nueva = EstructuraNueva()
            estructura_nueva.formulario = formulario
            estructura_nueva.cod_est = cod_est_nueva
            estructura_nueva.apoyo = request.POST.get('apoyo_nueva', '')
            estructura_nueva.material = request.POST.get('material_nueva', '')
            estructura_nueva.altura = self.parse_decimal(request.POST.get('altura_nueva'))
            estructura_nueva.tipo_red = request.POST.get('tipo_red_nueva', '')
            
            # Procesar fotos de estructura nueva (guardar localmente)
            if 'fotos_nueva' in request.FILES:
                fotos = request.FILES.getlist('fotos_nueva')
                for i, foto in enumerate(fotos):
                    self.save_image_locally(foto, f'estructura_nueva_{formulario.id}_{i}')
            
            estructura_nueva.save()
    
    def process_estructura_retirada(self, request, formulario):
        """Procesar estructura retirada"""
        cod_est_retirada = request.POST.get('cod_est_retirada')
        if cod_est_retirada:
            estructura_retirada = EstructuraRetirada()
            estructura_retirada.formulario = formulario
            estructura_retirada.cod_est = cod_est_retirada
            estructura_retirada.apoyo = request.POST.get('apoyo_retirada', '')
            estructura_retirada.material = request.POST.get('material_retirada', '')
            estructura_retirada.altura = self.parse_decimal(request.POST.get('altura_retirada'))
            estructura_retirada.tipo_red = request.POST.get('tipo_red_retirada', '')
            estructura_retirada.punto = request.POST.get('punto_retirada', '')
            estructura_retirada.save()
    
    def process_proyecto_info(self, request, formulario):
        """Procesar información del proyecto"""
        nombre_proyecto = request.POST.get('nombre')
        if nombre_proyecto:
            proyecto = ProyectoInfo()
            proyecto.formulario = formulario
            proyecto.nombre = nombre_proyecto
            proyecto.ot_mano_obra = request.POST.get('ot_mano_obra', '')
            proyecto.ot_materia = request.POST.get('ot_materia', '')
            proyecto.contrato = request.POST.get('contrato', '')
            proyecto.pro_terc = request.POST.get('pro_terc', '')
            proyecto.save()
    
    def process_document_files(self, request, formulario):
        """Procesar archivos de documentos"""
        if 'archivo_cad' in request.FILES:
            archivo_cad = request.FILES['archivo_cad']
            self.save_file_locally(archivo_cad, f'cad_formulario_{formulario.id}')
        
        if 'archivo_kmz' in request.FILES:
            archivo_kmz = request.FILES['archivo_kmz']
            self.save_file_locally(archivo_kmz, f'kmz_formulario_{formulario.id}')
    
    def parse_int(self, value):
        """Convertir string a int de manera segura"""
        try:
            return int(value) if value else None
        except (ValueError, TypeError):
            return None
    
    def parse_decimal(self, value):
        """Convertir string a decimal de manera segura"""
        try:
            return Decimal(value) if value else None
        except (ValueError, TypeError, InvalidOperation):
            return None
    
    def save_file_locally(self, file, filename_prefix):
        """Guardar archivo en el directorio media local"""
        try:
            # Crear directorio si no existe
            media_dir = os.path.join(settings.MEDIA_ROOT, 'documentos')
            os.makedirs(media_dir, exist_ok=True)
            
            # Generar nombre único
            ext = os.path.splitext(file.name)[1]
            filename = f"{filename_prefix}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{ext}"
            filepath = os.path.join(media_dir, filename)
            
            # Guardar archivo
            with open(filepath, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            
            return filename
        except Exception as e:
            print(f"Error guardando archivo {filename_prefix}: {str(e)}")
            return None
    
    def save_image_locally(self, image, filename_prefix):
        """Guardar imagen en el directorio media local"""
        try:
            # Crear directorio si no existe
            media_dir = os.path.join(settings.MEDIA_ROOT, 'estructuras')
            os.makedirs(media_dir, exist_ok=True)
            
            # Generar nombre único
            ext = os.path.splitext(image.name)[1]
            filename = f"{filename_prefix}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{ext}"
            filepath = os.path.join(media_dir, filename)
            
            # Guardar imagen
            with open(filepath, 'wb+') as destination:
                for chunk in image.chunks():
                    destination.write(chunk)
            
            return filename
        except Exception as e:
            print(f"Error guardando imagen {filename_prefix}: {str(e)}")
            return None

class FormularioListView(View):
    """Vista para listar todos los formularios guardados"""
    template_name = 'forms/list.html'
    
    def get(self, request):
        formularios = FormularioGlobal.objects.all().order_by('-created_at')
        
        # Obtener información adicional de cada formulario
        formularios_data = []
        for formulario in formularios:
            estructuras_nuevas = EstructuraNueva.objects.filter(formulario=formulario).count()
            estructuras_retiradas = EstructuraRetirada.objects.filter(formulario=formulario).count()
            proyecto = ProyectoInfo.objects.filter(formulario=formulario).first()
            
            formularios_data.append({
                'formulario': formulario,
                'estructuras_nuevas': estructuras_nuevas,
                'estructuras_retiradas': estructuras_retiradas,
                'proyecto': proyecto
            })
        
        context = {
            'formularios': formularios_data
        }
        return render(request, self.template_name, context)

# Vista para envío del formulario completo
@method_decorator(csrf_exempt)
def submit_form(request):
    """
    Maneja el envío completo del formulario con todos los datos
    """
    if request.method != 'POST':
        return redirect('form')
    
    try:
        # Crear un nuevo formulario global con los campos correctos del modelo
        formulario = FormularioGlobal.objects.create(
            trabajo=request.POST.get('cod_usuario'),  # Mapear cod_usuario a trabajo
            municipio=request.POST.get('municipio'),
            numero_x=int(request.POST.get('numero_x', 0)) if request.POST.get('numero_x') else None,
            regional=request.POST.get('regional'),
            direccion=request.POST.get('direccion'),
            numero_y=int(request.POST.get('numero_y', 0)) if request.POST.get('numero_y') else None,
            alimentador=request.POST.get('alimentador'),
            barrio_vereda=request.POST.get('barrio_vereda'),
            numero_z=int(request.POST.get('numero_z', 0)) if request.POST.get('numero_z') else None,
            nivel_tension=request.POST.get('nivel_tension'),
            circuito=request.POST.get('circuito'),
        )
        
        estructura_nueva_creada = False
        estructura_retirada_creada = False
        proyecto_info_creado = False
        
        # Crear estructura nueva si hay datos
        if request.POST.get('cod_est_nueva'):
            estructura_nueva = EstructuraNueva.objects.create(
                formulario=formulario,
                cod_est=request.POST.get('cod_est_nueva'),
                apoyo=request.POST.get('apoyo_nueva'),
                material=request.POST.get('material_nueva'),
                altura=float(request.POST.get('altura_nueva', 0)) if request.POST.get('altura_nueva') else None,
                tipo_red=request.POST.get('tipo_red_nueva'),
                poblacion=request.POST.get('poblacion_nueva'),
                disposicion=request.POST.get('disposicion_nueva'),
                kgf=float(request.POST.get('kgf_nueva', 0)) if request.POST.get('kgf_nueva') else None,
            )
            estructura_nueva_creada = True
        
        # Crear estructura retirada si hay datos
        if request.POST.get('cod_est_retirada'):
            EstructuraRetirada.objects.create(
                formulario=formulario,
                cod_est=request.POST.get('cod_est_retirada'),
                apoyo=request.POST.get('apoyo_retirada'),
                material=request.POST.get('material_retirada'),
                altura=float(request.POST.get('altura_retirada', 0)) if request.POST.get('altura_retirada') else None,
                tipo_red=request.POST.get('tipo_red_retirada'),
                punto=request.POST.get('punto_retirada'),
            )
            estructura_retirada_creada = True
        
        # Crear información del proyecto
        if request.POST.get('nombre'):
            ProyectoInfo.objects.create(
                formulario=formulario,
                nombre=request.POST.get('nombre'),
                ot_mano_obra=request.POST.get('ot_mano_obra'),
                ot_materia=request.POST.get('ot_materia'),
                contrato=request.POST.get('contrato'),
                pro_terc=request.POST.get('pro_terc'),
            )
            proyecto_info_creado = True
        
        # Guardar archivos localmente si existen
        if 'fotos_nueva' in request.FILES:
            for i, foto in enumerate(request.FILES.getlist('fotos_nueva')):
                save_image_locally(foto, f'estructura_nueva_{formulario.id}_{i}')
        
        if 'archivo_cad' in request.FILES:
            save_file_locally(request.FILES['archivo_cad'], f'cad_formulario_{formulario.id}')
        
        if 'archivo_kmz' in request.FILES:
            save_file_locally(request.FILES['archivo_kmz'], f'kmz_formulario_{formulario.id}')
        
        # Redirigir a página de éxito con información
        context = {
            'form_id': formulario.id,
            'timestamp': formulario.created_at,
            'estructura_nueva': estructura_nueva_creada,
            'estructura_retirada': estructura_retirada_creada,
            'proyecto_info': proyecto_info_creado,
        }
        
        return render(request, 'forms/success.html', context)
        
    except Exception as e:
        messages.error(request, f'Error al guardar formulario: {str(e)}')
        return redirect('form')


def save_file_locally(file, filename_prefix):
    """Función auxiliar para guardar archivos en media local"""
    try:
        media_dir = os.path.join(settings.MEDIA_ROOT, 'documentos')
        os.makedirs(media_dir, exist_ok=True)
        
        ext = os.path.splitext(file.name)[1]
        filename = f"{filename_prefix}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{ext}"
        filepath = os.path.join(media_dir, filename)
        
        with open(filepath, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        
        return filename
    except Exception as e:
        print(f"Error guardando archivo {filename_prefix}: {str(e)}")
        return None


def save_image_locally(image, filename_prefix):
    """Función auxiliar para guardar imágenes en media local"""
    try:
        media_dir = os.path.join(settings.MEDIA_ROOT, 'estructuras')
        os.makedirs(media_dir, exist_ok=True)
        
        ext = os.path.splitext(image.name)[1]
        filename = f"{filename_prefix}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{ext}"
        filepath = os.path.join(media_dir, filename)
        
        with open(filepath, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        
        return filename
    except Exception as e:
        print(f"Error guardando imagen {filename_prefix}: {str(e)}")
        return None
