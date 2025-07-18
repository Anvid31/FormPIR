from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth import logout, authenticate, login
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from .models import FormularioGlobal, CustomUser
from django.contrib.auth.forms import AuthenticationForm

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
            'pendientes': mis_formularios.filter(estado_actual='contratista').count(),
            'enviados': mis_formularios.filter(estado_actual='interventor').count(),
            'devueltos': mis_formularios.filter(estado_actual='devuelto').count(),
            'completados': mis_formularios.filter(estado_actual='finalizado').count(),
        }
        
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
                'pendientes': 0,
                'enviados': 0,
                'devueltos': 0,
                'completados': 0,
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

def custom_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('forms:home')
    else:
        form = AuthenticationForm()
    return render(request, 'forms/login.html', {'form': form})

def home(request):
    """Vista home - redirige a dashboard si está autenticado"""
    if request.user.is_authenticated:
        return redirect('forms:dashboard')
    # Fix: Use the correct URL pattern name for login
    return redirect('admin:login')  # or redirect to a custom login page

@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    """Dashboard específico para administradores"""
    try:
        # Estadísticas generales
        total_formularios = FormularioGlobal.objects.filter(activo=True).count()
        total_usuarios = CustomUser.objects.filter(is_active=True, activo=True).count()
        usuarios_pendientes = CustomUser.objects.filter(is_active=False, activo=True).count()
        formularios_eliminados = FormularioGlobal.objects.filter(activo=False).count()
        
        # Estadísticas por estado de formularios (solo activos)
        formularios_activos = FormularioGlobal.objects.filter(activo=True)
        
        # Usuarios por rol (solo activos)
        usuarios_por_rol = {}
        for rol_key, rol_name in CustomUser.ROLE_CHOICES:
            count = CustomUser.objects.filter(rol=rol_key, is_active=True, activo=True).count()
            usuarios_por_rol[rol_name] = count
        
        stats = {
            'total_formularios': total_formularios,
            'total_usuarios': total_usuarios,
            'usuarios_pendientes': usuarios_pendientes,
            'formularios_eliminados': formularios_eliminados,
            'contratista': formularios_activos.filter(estado_actual='contratista').count(),
            'interventor': formularios_activos.filter(estado_actual='interventor').count(),
            'gestion': formularios_activos.filter(estado_actual='gestion').count(),
            'finalizado': formularios_activos.filter(estado_actual='finalizado').count(),
            'usuarios_por_rol': usuarios_por_rol
        }
        
        # Formularios recientes (solo activos)
        formularios_recientes = FormularioGlobal.objects.filter(activo=True).order_by('-created_at')[:10]
        
        context = {
            'user': request.user,
            'stats': stats,
            'formularios_recientes': formularios_recientes,
            'tables_exist': True
        }
        
        print(f"Debug - Stats: {stats}")  # Debug
        print(f"Debug - Usuarios por rol: {usuarios_por_rol}")  # Debug
        
    except Exception as e:
        print(f"Error en admin_dashboard: {e}")  # Debug
        context = {
            'user': request.user,
            'stats': {
                'total_formularios': 0,
                'total_usuarios': 0,
                'usuarios_pendientes': 0,
                'formularios_eliminados': 0,
                'contratista': 0,
                'interventor': 0,
                'gestion': 0,
                'finalizado': 0,
                'usuarios_por_rol': {}
            },
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
    
    # Filtros opcionales
    search_query = request.GET.get('search')
    activo_filter = request.GET.get('activo')
    rol_filter = request.GET.get('rol')
    
    if search_query:
        usuarios = usuarios.filter(
            Q(username__icontains=search_query) | 
            Q(first_name__icontains=search_query) | 
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query)
        )
    
    if activo_filter:
        usuarios = usuarios.filter(is_active=(activo_filter == '1'))
    
    if rol_filter:
        usuarios = usuarios.filter(rol=rol_filter)
    
    # Estadísticas por rol
    usuarios_por_rol = {}
    for rol in ['Administrador', 'Contratista', 'Ejecutor/Interventor', 'Gestión', 'Planeación']:
        usuarios_por_rol[rol] = CustomUser.objects.filter(rol=rol).count()
    
    context = {
        'usuarios': usuarios,
        'usuarios_por_rol': usuarios_por_rol,
    }
    
    return render(request, 'admin/users_list.html', context)

@login_required
@user_passes_test(is_admin)
def admin_formularios_list(request):
    """Lista completa de formularios para administrador"""
    formularios = FormularioGlobal.objects.all().order_by('-created_at')
    
    # Filtros opcionales
    estado_filter = request.GET.get('estado')
    activo_filter = request.GET.get('activo')
    search_query = request.GET.get('search')
    
    if estado_filter:
        formularios = formularios.filter(estado_actual=estado_filter)
    
    if activo_filter:
        if activo_filter == '1':
            formularios = formularios.filter(activo=True)
        elif activo_filter == '0':
            formularios = formularios.filter(activo=False)
    
    if search_query:
        formularios = formularios.filter(
            Q(trabajo__icontains=search_query) |
            Q(municipio__icontains=search_query) |
            Q(id__icontains=search_query)
        )
    
    # Estadísticas para la vista
    stats = {
        'total': FormularioGlobal.objects.count(),
        'activos': FormularioGlobal.objects.filter(activo=True).count(),
        'eliminados': FormularioGlobal.objects.filter(activo=False).count(),
        'contratista': FormularioGlobal.objects.filter(estado_actual='contratista', activo=True).count(),
        'interventor': FormularioGlobal.objects.filter(estado_actual='interventor', activo=True).count(),
        'gestion': FormularioGlobal.objects.filter(estado_actual='gestion', activo=True).count(),
        'finalizado': FormularioGlobal.objects.filter(estado_actual='finalizado', activo=True).count(),
    }
    
    return render(request, 'admin/formularios_list.html', {
        'formularios': formularios,
        'estado_filter': estado_filter,
        'activo_filter': activo_filter,
        'search_query': search_query,
        'stats': stats,
        'estados': FormularioGlobal.ESTADO_CHOICES,
    })

@login_required
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def admin_cambiar_estado_formulario(request, formulario_id):
    """Cambiar estado de un formulario (solo admin)"""
    formulario = get_object_or_404(FormularioGlobal, id=formulario_id)
    nuevo_estado = request.POST.get('nuevo_estado')
    
    # Validar que el nuevo estado sea válido
    estados_validos = [choice[0] for choice in FormularioGlobal.ESTADO_CHOICES]
    if nuevo_estado not in estados_validos:
        return JsonResponse({'success': False, 'error': 'Estado no válido'})
    
    # Validar flujo del semáforo - solo permitir transiciones válidas
    estados_validos_flujo = [estado[0] for estado in formulario.get_estados_validos()]
    if nuevo_estado not in estados_validos_flujo:
        estado_actual_display = dict(FormularioGlobal.ESTADO_CHOICES)[formulario.estado_actual]
        nuevo_estado_display = dict(FormularioGlobal.ESTADO_CHOICES)[nuevo_estado]
        return JsonResponse({
            'success': False, 
            'error': f'Transición no válida: No se puede cambiar de "{estado_actual_display}" a "{nuevo_estado_display}". Revise el flujo de estados.'
        })
    
    estado_anterior = formulario.estado_actual
    
    # Cambiar estado
    formulario.estado_actual = nuevo_estado
    formulario.save()
    
    messages.success(request, f'Estado del formulario #{formulario.get_numero_formulario()} cambiado de "{dict(FormularioGlobal.ESTADO_CHOICES)[estado_anterior]}" a "{dict(FormularioGlobal.ESTADO_CHOICES)[nuevo_estado]}"')
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True, 
            'nuevo_estado': nuevo_estado,
            'nuevo_estado_display': dict(FormularioGlobal.ESTADO_CHOICES)[nuevo_estado]
        })
    
    return redirect('forms:admin_formularios_list')

@login_required
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def admin_eliminar_formulario(request, formulario_id):
    """Eliminación lógica de formulario (solo admin)"""
    formulario = get_object_or_404(FormularioGlobal, id=formulario_id)
    
    # Eliminación lógica
    formulario.activo = False
    formulario.save()
    
    messages.warning(request, f'Formulario #{formulario.get_numero_formulario()} eliminado lógicamente. Puede restaurarlo desde la vista de eliminados.')
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'success': True, 'message': 'Formulario eliminado'})
    
    return redirect('forms:admin_formularios_list')

@login_required
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def admin_restaurar_formulario(request, formulario_id):
    """Restaurar formulario eliminado (solo admin)"""
    formulario = get_object_or_404(FormularioGlobal, id=formulario_id)
    
    # Restaurar
    formulario.activo = True
    formulario.save()
    
    messages.success(request, f'Formulario #{formulario.get_numero_formulario()} restaurado exitosamente.')
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'success': True, 'message': 'Formulario restaurado'})
    
    return redirect('forms:admin_formularios_list')

@login_required
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

def register_view(request):
    """Vista de registro de usuarios"""
    from .forms import CustomUserCreationForm
    
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, 
                f'Usuario {user.username} registrado exitosamente. '
                'Su cuenta será activada por un administrador pronto.')
            return redirect('forms:login')
        else:
            messages.error(request, 'Por favor corrige los errores en el formulario.')
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'forms/register.html', {'form': form})