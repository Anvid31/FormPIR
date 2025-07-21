# forms/urls_iteraciones.py - URLs para iteraciones

from django.urls import path
from . import views_iteraciones

app_name = 'iteraciones'

urlpatterns = [
    # API para iteraciones temporales
    path('agregar/', views_iteraciones.agregar_iteracion_temporal, name='agregar_temporal'),
    path('listar/', views_iteraciones.listar_iteraciones_temporales, name='listar_temporales'),
    path('eliminar/<int:iteracion_id>/', views_iteraciones.eliminar_iteracion_temporal, name='eliminar_temporal'),
    path('finalizar/', views_iteraciones.finalizar_iteraciones, name='finalizar'),
    path('estadisticas/', views_iteraciones.estadisticas_iteraciones, name='estadisticas'),
]
