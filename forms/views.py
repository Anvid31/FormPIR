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

        # Eliminar el uso de sesiones temporalmente
        # request.session['form_id'] = form_id
        
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

# Vista principal para envío del formulario completo
@csrf_exempt
def submit_form(request):
    """
    Maneja el envío completo del formulario con todos los datos guardando en Oracle
    """
    if request.method != 'POST':
        return redirect('form')
    
    try:
        # Debug: imprimir los datos recibidos
        print("=== DATOS RECIBIDOS DEL FORMULARIO ===")
        for key, value in request.POST.items():
            print(f"{key}: {value}")
        print("=== FIN DATOS ===")
        
        # Función auxiliar para convertir valores de manera segura
        def safe_int(value):
            try:
                return int(value) if value and value.strip() else None
            except (ValueError, TypeError):
                return None
        
        def safe_float(value):
            try:
                return float(value) if value and value.strip() else None
            except (ValueError, TypeError):
                return None
        
        # Crear un nuevo formulario global con mapeo correcto de campos
        formulario_data = {
            'trabajo': request.POST.get('cod_usuario', ''),  # Mapear cod_usuario a trabajo
            'municipio': request.POST.get('municipio', ''),
            'numero_x': safe_int(request.POST.get('numero_x')),
            'regional': request.POST.get('regional', ''),
            'direccion': request.POST.get('direccion', ''),
            'numero_y': safe_int(request.POST.get('numero_y')),
            'alimentador': request.POST.get('alimentador', ''),
            'barrio_vereda': request.POST.get('barrio_vereda', ''),
            'numero_z': safe_int(request.POST.get('numero_z')),
            'nivel_tension': request.POST.get('nivel_tension', ''),
            'circuito': request.POST.get('circuito', ''),
        }
        
        print(f"=== CREANDO FORMULARIO GLOBAL ===")
        print(f"Datos: {formulario_data}")
        
        formulario = FormularioGlobal.objects.create(**formulario_data)
        print(f"Formulario creado con ID: {formulario.id}")
        
        estructura_nueva_creada = False
        estructura_retirada_creada = False
        proyecto_info_creado = False
        
        # Crear estructura nueva si hay datos
        cod_est_nueva = request.POST.get('cod_est_nueva')
        if cod_est_nueva and cod_est_nueva.strip():
            print(f"=== CREANDO ESTRUCTURA NUEVA ===")
            estructura_nueva_data = {
                'formulario': formulario,
                'cod_est': cod_est_nueva.strip(),
                'apoyo': request.POST.get('apoyo_nueva', ''),
                'material': request.POST.get('material_nueva', ''),
                'altura': safe_float(request.POST.get('altura_nueva')),
                'tipo_red': request.POST.get('tipo_red_nueva', ''),
                'poblacion': request.POST.get('poblacion_nueva', ''),
                'disposicion': request.POST.get('disposicion_nueva', ''),
                'kgf': safe_float(request.POST.get('kgf_nueva')),
            }
            print(f"Datos estructura nueva: {estructura_nueva_data}")
            
            estructura_nueva = EstructuraNueva.objects.create(**estructura_nueva_data)
            print(f"Estructura nueva creada con ID: {estructura_nueva.id}")
            estructura_nueva_creada = True
        
        # Crear estructura retirada si hay datos
        cod_est_retirada = request.POST.get('cod_est_retirada')
        if cod_est_retirada and cod_est_retirada.strip():
            print(f"=== CREANDO ESTRUCTURA RETIRADA ===")
            estructura_retirada_data = {
                'formulario': formulario,
                'cod_est': cod_est_retirada.strip(),
                'apoyo': request.POST.get('apoyo_retirada', ''),
                'material': request.POST.get('material_retirada', ''),
                'altura': safe_float(request.POST.get('altura_retirada')),
                'tipo_red': request.POST.get('tipo_red_retirada', ''),
                'punto': request.POST.get('punto_retirada', ''),
            }
            print(f"Datos estructura retirada: {estructura_retirada_data}")
            
            EstructuraRetirada.objects.create(**estructura_retirada_data)
            estructura_retirada_creada = True
        
        # Crear información del proyecto
        nombre_proyecto = request.POST.get('nombre')
        if nombre_proyecto and nombre_proyecto.strip():
            print(f"=== CREANDO PROYECTO INFO ===")
            proyecto_data = {
                'formulario': formulario,
                'nombre': nombre_proyecto.strip(),
                'ot_mano_obra': request.POST.get('ot_mano_obra', ''),
                'ot_materia': request.POST.get('ot_materia', ''),
                'contrato': request.POST.get('contrato', ''),
                'pro_terc': request.POST.get('pro_terc', ''),
            }
            print(f"Datos proyecto: {proyecto_data}")
            
            ProyectoInfo.objects.create(**proyecto_data)
            proyecto_info_creado = True
        
        # Guardar archivos localmente si existen
        if 'fotos_nueva' in request.FILES:
            for i, foto in enumerate(request.FILES.getlist('fotos_nueva')):
                save_image_locally(foto, f'estructura_nueva_{formulario.id}_{i}')
        
        if 'archivo_cad' in request.FILES:
            save_file_locally(request.FILES['archivo_cad'], f'cad_formulario_{formulario.id}')
        
        if 'archivo_kmz' in request.FILES:
            save_file_locally(request.FILES['archivo_kmz'], f'kmz_formulario_{formulario.id}')
        
        print(f"=== FORMULARIO GUARDADO EXITOSAMENTE ===")
        print(f"ID: {formulario.id}")
        print(f"Estructura nueva: {estructura_nueva_creada}")
        print(f"Estructura retirada: {estructura_retirada_creada}")
        print(f"Proyecto info: {proyecto_info_creado}")
        
        # Redirigir a página de éxito con información
        context = {
            'form_id': formulario.id,
            'timestamp': formulario.created_at,
            'estructura_nueva': estructura_nueva_creada,
            'estructura_retirada': estructura_retirada_creada,
            'proyecto_info': proyecto_info_creado,
            'formulario': formulario,  # Añadir el objeto formulario para mostrar más detalles
        }
        
        return render(request, 'forms/success.html', context)
        
    except Exception as e:
        print(f"=== ERROR AL GUARDAR FORMULARIO ===")
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        
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
