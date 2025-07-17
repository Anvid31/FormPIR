from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth import logout
from django.views.decorators.http import require_http_methods
from .models import FormularioGlobal, CustomUser

def is_admin(user):
    """Verificar si el usuario es administrador"""
    return user.is_authenticated and user.rol == 'admin'

@login_required
def dashboard(request):
    """Dashboard principal según el rol del usuario"""
    user = request.user
    
    # Redirigir según el rol
    if user.rol == 'admin':
        return redirect('forms:admin_dashboard')
    elif user.rol == 'contratista':
        return contratista_dashboard(request)
    elif user.rol == 'ejecutor':
        return ejecutor_dashboard(request)
    elif user.rol == 'gestion':
        return gestion_dashboard(request)
    elif user.rol == 'planeacion':
        return planeacion_dashboard(request)
    else:
        return render(request, 'forms/dashboard.html', {'user': user})

@login_required
def contratista_dashboard(request):
    """Dashboard específico para contratistas"""
    user = request.user
    
    # Solo permitir acceso a contratistas
    if user.rol != 'contratista':
        messages.error(request, 'No tienes permisos para acceder a esta página.')
        return redirect('forms:dashboard')
    
    try:
        # Formularios del contratista actual
        mis_formularios = FormularioGlobal.objects.filter(creado_por=user)
        
        # Estadísticas específicas del contratista
        stats = {
            'mis_formularios': mis_formularios.count(),
            'en_trabajo': mis_formularios.filter(estado_actual='contratista').count(),
            'en_revision': mis_formularios.filter(estado_actual='interventor').count(),
            'actualizando': mis_formularios.filter(estado_actual='gestion').count(),
            'completados': mis_formularios.filter(estado_actual='finalizado').count(),
            'pendientes': mis_formularios.filter(estado_actual='contratista').count(),
        }
        
        # Calcular porcentaje de completados
        if stats['mis_formularios'] > 0:
            stats['porcentaje_completado'] = round((stats['completados'] / stats['mis_formularios']) * 100, 1)
        else:
            stats['porcentaje_completado'] = 0
        
        # Formularios recientes del contratista
        mis_formularios_recientes = mis_formularios.order_by('-updated_at')[:10]
        
        context = {
            'user': user,
            'stats': stats,
            'mis_formularios_recientes': mis_formularios_recientes,
            'tables_exist': True
        }
        
    except Exception as e:
        context = {
            'user': user,
            'stats': {
                'mis_formularios': 0,
                'en_trabajo': 0,
                'en_revision': 0,
                'actualizando': 0,
                'completados': 0,
                'pendientes': 0,
                'porcentaje_completado': 0
            },
            'mis_formularios_recientes': [],
            'tables_exist': False,
            'error_message': str(e)
        }
    
    return render(request, 'contratista/dashboard.html', context)

@login_required
def ejecutor_dashboard(request):
    """Dashboard específico para ejecutores/interventores"""
    user = request.user
    if user.rol != 'ejecutor':
        messages.error(request, 'No tienes permisos para acceder a esta página.')
        return redirect('forms:dashboard')
    
    context = {'user': user}
    return render(request, 'interventor/dashboard.html', context)

@login_required
def gestion_dashboard(request):
    """Dashboard específico para gestión"""
    user = request.user
    if user.rol != 'gestion':
        messages.error(request, 'No tienes permisos para acceder a esta página.')
        return redirect('forms:dashboard')
    
    context = {'user': user}
    return render(request, 'gestion/dashboard.html', context)

@login_required
def planeacion_dashboard(request):
    """Dashboard específico para planeación"""
    user = request.user
    if user.rol != 'planeacion':
        messages.error(request, 'No tienes permisos para acceder a esta página.')
        return redirect('forms:dashboard')
    
    context = {'user': user}
    return render(request, 'planeacion/dashboard.html', context)

@login_required
def lista_formularios(request):
    """Lista de formularios"""
    formularios = FormularioGlobal.objects.all()
    return render(request, 'forms/list.html', {'formularios': formularios})

@login_required
def crear_formulario(request):
    """Crear nuevo formulario"""
    if request.method == 'POST':
        formulario = FormularioGlobal.objects.create(
            trabajo=request.POST.get('trabajo', ''),
            municipio=request.POST.get('municipio', ''),
            regional=request.POST.get('regional', ''),
            direccion=request.POST.get('direccion', ''),
            creado_por=request.user
        )
        messages.success(request, f'Formulario {formulario.get_numero_formulario()} creado exitosamente')
        return redirect('forms:lista')
    
    return render(request, 'forms/form_modular.html')

def home(request):
    """Vista home - redirige a dashboard si está autenticado"""
    if request.user.is_authenticated:
        return redirect('forms:dashboard')
    return redirect('login')

@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    """Dashboard específico para administradores"""
    try:
        # Estadísticas generales
        total_formularios = FormularioGlobal.objects.count()
        total_usuarios = CustomUser.objects.filter(is_active=True).count()
        
        # Estadísticas por estado de formularios
        stats = {
            'contratista': FormularioGlobal.objects.filter(estado_actual='contratista').count(),
            'interventor': FormularioGlobal.objects.filter(estado_actual='interventor').count(),
            'gestion': FormularioGlobal.objects.filter(estado_actual='gestion').count(),
            'finalizado': FormularioGlobal.objects.filter(estado_actual='finalizado').count(),
        }
        
        # Usuarios por rol
        usuarios_por_rol = {}
        for rol, nombre in CustomUser.ROLE_CHOICES:
            usuarios_por_rol[rol] = CustomUser.objects.filter(rol=rol, is_active=True).count()
        
        # Usuarios recientes
        usuarios_recientes = CustomUser.objects.filter(is_active=True).order_by('-date_joined')[:10]
        
        # Formularios recientes (todos los estados)
        formularios_recientes = FormularioGlobal.objects.all().order_by('-created_at')[:20]
        
        context = {
            'user': request.user,
            'total_formularios': total_formularios,
            'total_usuarios': total_usuarios,
            'stats': stats,
            'usuarios_por_rol': usuarios_por_rol,
            'usuarios_recientes': usuarios_recientes,
            'formularios_recientes': formularios_recientes,
            'tables_exist': True
        }
        
    except Exception as e:
        context = {
            'user': request.user,
            'total_formularios': 0,
            'total_usuarios': 0,
            'stats': {'contratista': 0, 'interventor': 0, 'gestion': 0, 'finalizado': 0},
            'usuarios_por_rol': {},
            'usuarios_recientes': [],
            'formularios_recientes': [],
            'tables_exist': False,
            'error_message': str(e)
        }
    
    return render(request, 'admin/dashboard.html', context)

@login_required
@user_passes_test(is_admin)
def admin_users_list(request):
    """Lista de usuarios para administrador"""
    usuarios = CustomUser.objects.all().order_by('rol', 'username')
    return render(request, 'admin/users_list.html', {'usuarios': usuarios})

@login_required
@user_passes_test(is_admin)
def admin_formularios_list(request):
    """Lista completa de formularios para administrador"""
    formularios = FormularioGlobal.objects.all().order_by('-created_at')
    
    # Filtros opcionales
    estado_filter = request.GET.get('estado')
    if estado_filter:
        formularios = formularios.filter(estado_actual=estado_filter)
    
    return render(request, 'admin/formularios_list.html', {
        'formularios': formularios,
        'estado_filter': estado_filter
    })

@require_http_methods(["GET", "POST"])
def custom_logout(request):
    """Vista personalizada de logout"""
    print(f"Logout request: {request.method} from {request.user}")
    if request.user.is_authenticated:
        username = request.user.username
        logout(request)
        messages.success(request, f'Sesión cerrada correctamente para {username}')
        print(f"Usuario {username} ha cerrado sesión exitosamente")
    else:
        print("Usuario no autenticado intentando logout")
    
    return redirect('forms:login')
