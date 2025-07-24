"""
Manejadores de errores personalizados para FormPIR
"""
from django.shortcuts import render
from django.http import HttpResponseServerError, HttpResponseNotFound, HttpResponseForbidden
import logging

logger = logging.getLogger(__name__)

def handler404(request, exception):
    """Página de error 404 personalizada"""
    logger.warning(f"Error 404: {request.path} - {exception}")
    return HttpResponseNotFound(
        render(request, 'errors/404.html', {
            'request_path': request.path
        })
    )

def handler500(request):
    """Página de error 500 personalizada"""
    logger.error(f"Error 500 en: {request.path}")
    return HttpResponseServerError(
        render(request, 'errors/500.html')
    )

def handler403(request, exception):
    """Página de error 403 personalizada"""
    logger.warning(f"Error 403: {request.path} - {exception}")
    return HttpResponseForbidden(
        render(request, 'errors/403.html')
    )
