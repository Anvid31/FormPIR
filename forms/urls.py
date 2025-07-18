from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = 'forms'

urlpatterns = [
    # Rutas principales
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('lista/', views.lista_formularios, name='lista'),
    path('crear/', views.crear_formulario, name='crear_formulario'),
    
    # Rutas específicas para administrador
    path('panel/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('panel/usuarios/', views.admin_users_list, name='admin_users_list'),
    path('panel/formularios/', views.admin_formularios_list, name='admin_formularios_list'),
    path('panel/formularios/<int:formulario_id>/cambiar-estado/', views.admin_cambiar_estado_formulario, name='admin_cambiar_estado_formulario'),
    path('panel/formularios/<int:formulario_id>/eliminar/', views.admin_eliminar_formulario, name='admin_eliminar_formulario'),
    path('panel/formularios/<int:formulario_id>/restaurar/', views.admin_restaurar_formulario, name='admin_restaurar_formulario'),
    
    # Rutas de autenticación
    path('login/', views.custom_login, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.custom_logout, name='logout'),
]
