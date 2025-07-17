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
    
    # Rutas de autenticación
    path('login/', auth_views.LoginView.as_view(
        template_name='auth/login.html',
        redirect_authenticated_user=True,
        next_page='/dashboard/'
    ), name='login'),
    path('logout/', views.custom_logout, name='logout'),
]
