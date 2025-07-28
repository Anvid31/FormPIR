from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views

app_name = 'forms'

urlpatterns = [
    # Rutas principales
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('lista/', views.lista_formularios, name='lista'),
    path('crear/', views.crear_estructuras, name='crear'),
    
    # Rutas para secciones separadas
    path('crear/estructuras/', views.crear_estructuras, name='crear_estructuras'),
    path('crear/conductores/', views.crear_conductores, name='crear_conductores'),
    path('crear/equipos/', views.crear_equipos, name='crear_equipos'),
    path('crear/transformadores/', views.crear_transformadores, name='crear_transformadores'),
    
    # API de iteraciones
    path('iteraciones/', include('forms.urls_iteraciones')),
    
    # Debug UC
    path('debug-uc/', views.debug_uc_django, name='debug_uc_django'),
    
    # ===============================
    # RUTAS ESPECÍFICAS DEL CONTRATISTA
    # ===============================
    path('contratista/', views.contratista_dashboard, name='contratista_dashboard'),
    path('contratista/formularios/', views.contratista_formularios, name='contratista_formularios'),
    path('contratista/nuevo/', views.contratista_nuevo_formulario, name='contratista_nuevo_formulario'),
    path('contratista/seccion/<str:seccion>/', views.contratista_formulario_seccion, name='contratista_formulario_seccion'),
    path('contratista/finalizar/', views.contratista_finalizar_formulario, name='contratista_finalizar_formulario'),
    
    # Rutas específicas para administrador
    path('panel/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('panel/usuarios/', views.admin_users_list, name='admin_users_list'),
    path('panel/formularios/', views.admin_formularios_list, name='admin_formularios_list'),
    path('panel/formularios/<int:formulario_id>/cambiar-estado/', views.admin_cambiar_estado_formulario, name='admin_cambiar_estado_formulario'),
    path('panel/formularios/<int:formulario_id>/eliminar/', views.admin_eliminar_formulario, name='admin_eliminar_formulario'),
    path('panel/formularios/<int:formulario_id>/restaurar/', views.admin_restaurar_formulario, name='admin_restaurar_formulario'),
    
    # Rutas para administración de usuarios
    path('panel/usuarios/<int:user_id>/toggle/', views.admin_toggle_user, name='admin_toggle_user'),
    path('panel/usuarios/<int:user_id>/change-role/', views.admin_change_user_role, name='admin_change_user_role'),
    path('panel/usuarios/<int:user_id>/delete/', views.admin_delete_user, name='admin_delete_user'),
    
    # Rutas de autenticación
    path('login/', views.custom_login, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.custom_logout, name='logout'),
]
