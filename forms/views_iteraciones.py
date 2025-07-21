# forms/views_iteraciones.py - Vistas para manejar iteraciones

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
# Implementación temporal sin base de datos
# from .models import FormularioIteracion

import json
from decimal import Decimal, InvalidOperation


@csrf_exempt
@require_http_methods(["POST"])
def agregar_iteracion_temporal(request):
    """
    Vista para agregar una iteración temporal usando sesiones Django
    """
    try:
        # Obtener datos del request
        data = json.loads(request.body)
        
        # Obtener iteraciones existentes de la sesión
        iteraciones = request.session.get('iteraciones_temporales', {})
        
        # Obtener seccion
        seccion = data.get('seccion', 'estructuras')
        
        # Inicializar sección si no existe
        if seccion not in iteraciones:
            iteraciones[seccion] = []
        
        # Generar ID único y número de iteración
        iteracion_id = len(iteraciones[seccion]) + 1
        numero_iteracion = len(iteraciones[seccion]) + 1
        
        # Crear objeto iteración
        iteracion_data = {
            'id': f"{seccion}_{iteracion_id}",
            'seccion': seccion,
            'numero_iteracion': numero_iteracion,
            'nombre_proyecto': data.get('nombre_proyecto', ''),
            'banco_proyecto': data.get('banco_proyecto', ''),
            'contrato': data.get('contrato', ''),
            'municipio': data.get('municipio', ''),
            'departamento': data.get('departamento', ''),
            'regional': data.get('regional', ''),
            'latitud_inicial': data.get('latitud_inicial'),
            'longitud_inicial': data.get('longitud_inicial'),
            'latitud_final': data.get('latitud_final'),
            'longitud_final': data.get('longitud_final'),
            'direccion': data.get('direccion', ''),
            'cantidad': int(data.get('cantidad', 1)),
            'datos_especificos': data.get('datos_especificos', {}),
            'fecha_creacion': data.get('fecha_creacion', ''),
        }
        
        # Agregar a la sesión
        iteraciones[seccion].append(iteracion_data)
        request.session['iteraciones_temporales'] = iteraciones
        request.session.modified = True
        
        return JsonResponse({
            'success': True,
            'iteracion': iteracion_data,
            'message': f'Iteración {numero_iteracion} agregada a {seccion.title()}'
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'JSON inválido'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Error interno: {str(e)}'
        }, status=500)


@require_http_methods(["GET"])
def listar_iteraciones_temporales(request):
    """
    Vista para listar todas las iteraciones temporales usando sesiones Django
    """
    try:
        # Obtener iteraciones de la sesión
        iteraciones = request.session.get('iteraciones_temporales', {})
        
        # Filtrar por sección si se especifica
        seccion_filtro = request.GET.get('seccion')
        if seccion_filtro and seccion_filtro in iteraciones:
            iteraciones_filtradas = {seccion_filtro: iteraciones[seccion_filtro]}
        else:
            iteraciones_filtradas = iteraciones
        
        # Contar total
        total = sum(len(lista) for lista in iteraciones_filtradas.values())
        
        return JsonResponse({
            'success': True,
            'iteraciones_por_seccion': iteraciones_filtradas,
            'total': total
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Error al listar iteraciones: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
def eliminar_iteracion_temporal(request, iteracion_id):
    """
    Vista para eliminar una iteración temporal usando sesiones Django
    """
    try:
        # Obtener iteraciones de la sesión
        iteraciones = request.session.get('iteraciones_temporales', {})
        
        # Buscar y eliminar la iteración
        eliminada = False
        seccion_encontrada = None
        numero_encontrado = None
        
        for seccion, lista_iteraciones in iteraciones.items():
            for i, iteracion in enumerate(lista_iteraciones):
                if iteracion.get('id') == iteracion_id:
                    seccion_encontrada = seccion
                    numero_encontrado = iteracion.get('numero_iteracion')
                    del lista_iteraciones[i]
                    eliminada = True
                    break
            if eliminada:
                break
        
        if not eliminada:
            return JsonResponse({
                'success': False,
                'error': 'Iteración no encontrada'
            }, status=404)
        
        # Guardar cambios en la sesión
        request.session['iteraciones_temporales'] = iteraciones
        request.session.modified = True
        
        return JsonResponse({
            'success': True,
            'message': f'Iteración {numero_encontrado} eliminada de {seccion_encontrada.title()}'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Error al eliminar iteración: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
@login_required
def finalizar_iteraciones(request):
    """
    Vista para marcar iteraciones como definitivas usando sesiones Django
    """
    try:
        data = json.loads(request.body)
        formulario_id = data.get('formulario_id')
        
        if not formulario_id:
            return JsonResponse({
                'success': False,
                'error': 'ID de formulario requerido'
            }, status=400)
        
        # Obtener iteraciones temporales
        iteraciones = request.session.get('iteraciones_temporales', {})
        
        # Contar total de iteraciones
        count = sum(len(lista) for lista in iteraciones.values())
        
        # Marcar como procesadas (limpiar la sesión)
        request.session['iteraciones_temporales'] = {}
        request.session.modified = True
        
        # En una implementación real, aquí guardarías en la base de datos
        # con el formulario_id y usuario
        
        return JsonResponse({
            'success': True,
            'message': f'{count} iteraciones guardadas definitivamente',
            'iteraciones_guardadas': count
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'JSON inválido'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Error al finalizar iteraciones: {str(e)}'
        }, status=500)


@require_http_methods(["GET"])
def estadisticas_iteraciones(request):
    """
    Vista para obtener estadísticas usando sesiones Django
    """
    try:
        # Obtener iteraciones de la sesión
        iteraciones = request.session.get('iteraciones_temporales', {})
        
        estadisticas = {
            'estructuras': len(iteraciones.get('estructuras', [])),
            'conductores': len(iteraciones.get('conductores', [])),
            'equipos': len(iteraciones.get('equipos', [])),
            'transformador': len(iteraciones.get('transformador', [])),
            'total': sum(len(lista) for lista in iteraciones.values())
        }
        
        return JsonResponse({
            'success': True,
            'estadisticas': estadisticas
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Error al obtener estadísticas: {str(e)}'
        }, status=500)
