from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth import logout, authenticate, login
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from django.db import connection, transaction
from .models import FormularioGlobal, CustomUser
from django.contrib.auth.forms import AuthenticationForm

def crear_formulario_oracle_safe(user, **kwargs):
    """
    Función helper para crear formularios de manera segura en Oracle
    Maneja el problema de ID nulo en secuencias Oracle usando un enfoque directo
    """
    try:
        # Si estamos usando Oracle, usar SQL directo para evitar problemas con Django ORM
        if connection.vendor == 'oracle':
            with transaction.atomic():
                cursor = connection.cursor()
                
                # Obtener el siguiente ID de la secuencia
                cursor.execute("SELECT FORMS_FORMULARIO_SEQ.NEXTVAL FROM dual")
                next_id = cursor.fetchone()[0]
                print(f"Oracle: Obtenido ID {next_id} desde secuencia")
                
                # Insertar directamente usando SQL
                insert_sql = """
                INSERT INTO FORMS_FORMULARIO 
                (ID, TRABAJO, MUNICIPIO, REGIONAL, DIRECCION, ESTADO_ACTUAL, CREADO_POR_ID, ACTIVO, CREATED_AT, UPDATED_AT)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, SYSDATE, SYSDATE)
                """
                
                cursor.execute(insert_sql, [
                    next_id,
                    kwargs.get('trabajo', '')[:200] or None,  # Limitar longitud y manejar strings vacíos
                    kwargs.get('municipio', '')[:100] or None,
                    kwargs.get('regional', '')[:100] or None, 
                    kwargs.get('direccion', '')[:200] or None,
                    'contratista',  # Estado por defecto
                    user.id if user else None,  # Manejar el caso de usuario None
                    1  # activo = True
                ])
                
                print(f"✅ Formulario insertado directamente en Oracle con ID: {next_id}")
                
                # Recuperar el objeto usando Django ORM
                formulario = FormularioGlobal.objects.get(id=next_id)
                return formulario
        else:
            # Para otros motores de BD, usar Django ORM normal
            formulario = FormularioGlobal.objects.create(
                trabajo=kwargs.get('trabajo', ''),
                municipio=kwargs.get('municipio', ''),
                regional=kwargs.get('regional', ''),
                direccion=kwargs.get('direccion', ''),
                creado_por=user,
                **{k: v for k, v in kwargs.items() if k not in ['trabajo', 'municipio', 'regional', 'direccion']}
            )
            print(f"✅ Formulario creado con Django ORM, ID: {formulario.id}")
            return formulario
            
    except Exception as e:
        print(f"❌ Error al crear formulario: {e}")
        print(f"   Tipo de error: {type(e).__name__}")
        raise

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
        
        # Iteraciones temporales en sesión
        iteraciones_temporales = request.session.get('iteraciones_temporales', {})
        stats['iteraciones_temporales'] = sum(len(lista) for lista in iteraciones_temporales.values())
        
        # Formularios recientes del contratista
        mis_formularios_recientes = mis_formularios.order_by('-updated_at')[:10]
        
        context = {
            'user': user,
            'stats': stats,
            'mis_formularios_recientes': mis_formularios_recientes,
            'iteraciones_temporales': iteraciones_temporales,
            'secciones_disponibles': [
                ('estructuras', 'Estructuras', 'fas fa-building'),
                ('conductores', 'Conductores', 'fas fa-bolt'),
                ('equipos', 'Equipos', 'fas fa-tools'),
                ('transformador', 'Transformador', 'fas fa-battery-three-quarters')
            ],
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
                'iteraciones_temporales': 0,
            },
            'mis_formularios_recientes': [],
            'iteraciones_temporales': {},
            'secciones_disponibles': [
                ('estructuras', 'Estructuras', 'fas fa-building'),
                ('conductores', 'Conductores', 'fas fa-bolt'),
                ('equipos', 'Equipos', 'fas fa-tools'),
                ('transformador', 'Transformador', 'fas fa-battery-three-quarters')
            ],
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
        try:
            formulario = crear_formulario_oracle_safe(
                user=request.user,
                trabajo=request.POST.get('trabajo', ''),
                municipio=request.POST.get('municipio', ''),
                regional=request.POST.get('regional', ''),
                direccion=request.POST.get('direccion', '')
            )
            messages.success(request, f'Formulario {formulario.get_numero_formulario()} creado exitosamente')
            return redirect('forms:lista')
        except Exception as e:
            messages.error(request, f'Error al crear formulario: {str(e)}')
            return redirect('forms:crear_formulario')
    
    return render(request, 'forms/form_modular.html')

@login_required
def crear_estructuras(request):
    """Vista para la sección de Estructuras"""
    if request.method == 'POST':
        try:
            # Manejar envío del formulario de estructuras
            formulario = crear_formulario_oracle_safe(
                user=request.user,
                trabajo=request.POST.get('trabajo', ''),
                municipio=request.POST.get('municipio', ''),
                regional=request.POST.get('regional', ''),
                direccion=request.POST.get('direccion', '')
            )
            
            # Procesar archivos si existen
            if 'archivo_cad' in request.FILES:
                formulario.archivo_autocad = request.FILES['archivo_cad']
                
            if 'archivo_kmz' in request.FILES:
                formulario.archivo_kmz = request.FILES['archivo_kmz']
                
            # Guardar el formulario con los archivos
            formulario.save()
            
            messages.success(request, f'Formulario de Estructuras {formulario.get_numero_formulario()} creado exitosamente')
            return redirect('forms:lista')
            
        except Exception as e:
            messages.error(request, f'Error al crear formulario de estructuras: {str(e)}')
            # No redirigir, mostrar el formulario con el error
    
    context = {
        'seccion': 'estructuras',
        'titulo': 'Estructuras',
        'icono': 'fas fa-building'
    }
    return render(request, 'forms/secciones/estructuras.html', context)

@login_required
def crear_conductores(request):
    """Vista para la sección de Conductores"""
    if request.method == 'POST':
        try:
            # Manejar envío del formulario de conductores
            formulario = crear_formulario_oracle_safe(
                user=request.user,
                trabajo=request.POST.get('trabajo', ''),
                municipio=request.POST.get('municipio', ''),
                regional=request.POST.get('regional', ''),
                direccion=request.POST.get('direccion', '')
            )
            
            # Procesar archivos si existen
            if 'archivo_cad' in request.FILES:
                formulario.archivo_autocad = request.FILES['archivo_cad']
                
            if 'archivo_kmz' in request.FILES:
                formulario.archivo_kmz = request.FILES['archivo_kmz']
                
            # Guardar el formulario con los archivos
            formulario.save()
            
            messages.success(request, f'Formulario de Conductores {formulario.get_numero_formulario()} creado exitosamente')
            return redirect('forms:lista')
            
        except Exception as e:
            messages.error(request, f'Error al crear formulario de conductores: {str(e)}')
    
    context = {
        'seccion': 'conductores',
        'titulo': 'Conductores',
        'icono': 'fas fa-bolt'
    }
    return render(request, 'forms/secciones/conductores.html', context)

@login_required
def crear_equipos(request):
    """Vista para la sección de Equipos"""
    if request.method == 'POST':
        try:
            # Manejar envío del formulario de equipos
            formulario = crear_formulario_oracle_safe(
                user=request.user,
                trabajo=request.POST.get('trabajo', ''),
                municipio=request.POST.get('municipio', ''),
                regional=request.POST.get('regional', ''),
                direccion=request.POST.get('direccion', '')
            )
            
            # Procesar archivos si existen
            if 'archivo_cad' in request.FILES:
                formulario.archivo_autocad = request.FILES['archivo_cad']
                
            if 'archivo_kmz' in request.FILES:
                formulario.archivo_kmz = request.FILES['archivo_kmz']
                
            # Guardar el formulario con los archivos
            formulario.save()
            
            messages.success(request, f'Formulario de Equipos {formulario.get_numero_formulario()} creado exitosamente')
            return redirect('forms:lista')
            
        except Exception as e:
            messages.error(request, f'Error al crear formulario de equipos: {str(e)}')
    
    context = {
        'seccion': 'equipos',
        'titulo': 'Equipos',
        'icono': 'fas fa-shield-alt'
    }
    return render(request, 'forms/secciones/equipos.html', context)

@login_required
def crear_transformadores(request):
    """Vista para la sección de Transformadores"""
    if request.method == 'POST':
        try:
            # Manejar envío del formulario de transformadores
            formulario = crear_formulario_oracle_safe(
                user=request.user,
                trabajo=request.POST.get('trabajo', ''),
                municipio=request.POST.get('municipio', ''),
                regional=request.POST.get('regional', ''),
                direccion=request.POST.get('direccion', '')
            )
            
            # Procesar archivos si existen
            if 'archivo_cad' in request.FILES:
                formulario.archivo_autocad = request.FILES['archivo_cad']
                
            if 'archivo_kmz' in request.FILES:
                formulario.archivo_kmz = request.FILES['archivo_kmz']
                
            # Guardar el formulario con los archivos
            formulario.save()
            
            messages.success(request, f'Formulario de Transformadores {formulario.get_numero_formulario()} creado exitosamente')
            return redirect('forms:lista')
            
        except Exception as e:
            messages.error(request, f'Error al crear formulario de transformadores: {str(e)}')
    
    context = {
        'seccion': 'transformadores',
        'titulo': 'Transformadores',
        'icono': 'fas fa-microchip'
    }
    return render(request, 'forms/secciones/transformadores.html', context)

def custom_login(request):
    """Vista de login personalizada que maneja tanto usuarios normales como admin"""
    if request.user.is_authenticated:
        return redirect('forms:dashboard')
    
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                
                # Redirigir según el parámetro 'next' o el rol del usuario
                next_url = request.GET.get('next')
                if next_url:
                    return redirect(next_url)
                elif user.is_staff and '/admin/' in request.META.get('HTTP_REFERER', ''):
                    return redirect('/admin/')
                else:
                    return redirect('forms:dashboard')
    else:
        form = AuthenticationForm()
    
    return render(request, 'auth/login.html', {'form': form})

def home(request):
    """Vista home - redirige a dashboard si está autenticado"""
    if request.user.is_authenticated:
        return redirect('forms:dashboard')
    # Redirigir a nuestro login personalizado
    return redirect('forms:login')

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
    for rol_key, rol_name in CustomUser.ROLE_CHOICES:
        usuarios_por_rol[rol_name] = CustomUser.objects.filter(rol=rol_key).count()
    
    # Agregar estadística para usuarios sin rol
    usuarios_sin_rol = CustomUser.objects.filter(Q(rol='') | Q(rol__isnull=True)).count()
    if usuarios_sin_rol > 0:
        usuarios_por_rol['Sin rol asignado'] = usuarios_sin_rol
    
    context = {
        'usuarios': usuarios,
        'usuarios_por_rol': usuarios_por_rol,
        'role_choices': CustomUser.ROLE_CHOICES,
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
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def admin_toggle_user(request, user_id):
    """Activar/desactivar usuario (solo admin)"""
    user = get_object_or_404(CustomUser, id=user_id)
    
    try:
        # Cambiar estado de activación
        user.is_active = not user.is_active
        user.save()
        
        estado = "activado" if user.is_active else "desactivado"
        messages.success(request, f'Usuario {user.username} {estado} exitosamente.')
        
        return JsonResponse({
            'success': True, 
            'message': f'Usuario {estado}',
            'is_active': user.is_active,
            'estado_display': 'Activo' if user.is_active else 'Inactivo'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'error': f'Error al cambiar estado del usuario: {str(e)}'
        })

@login_required
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def admin_change_user_role(request, user_id):
    """Cambiar rol de usuario (solo admin)"""
    user = get_object_or_404(CustomUser, id=user_id)
    nuevo_rol = request.POST.get('nuevo_rol')
    
    print(f"DEBUG - Cambio de rol solicitado:")
    print(f"  - Usuario ID: {user_id}")
    print(f"  - Usuario: {user.username}")
    print(f"  - Rol actual: '{user.rol}' (vacío: {not user.rol})")
    print(f"  - Nuevo rol: '{nuevo_rol}'")
    print(f"  - POST data: {request.POST}")
    
    try:
        # Validar que el nuevo rol sea válido
        roles_validos = [choice[0] for choice in CustomUser.ROLE_CHOICES]
        print(f"  - Roles válidos: {roles_validos}")
        
        if nuevo_rol not in roles_validos:
            print(f"  - ERROR: Rol no válido")
            return JsonResponse({'success': False, 'error': 'Rol no válido'})
        
        # No permitir cambiar el propio rol si es admin
        if user == request.user and user.rol == 'admin' and nuevo_rol != 'admin':
            print(f"  - ERROR: No puede cambiar su propio rol de admin")
            return JsonResponse({'success': False, 'error': 'No puedes cambiar tu propio rol de administrador'})
        
        rol_anterior = user.rol or 'sin_rol'  # Manejar rol vacío
        user.rol = nuevo_rol
        
        # Si el usuario no tenía rol asignado y ahora se le asigna uno, activarlo automáticamente
        if not rol_anterior or rol_anterior == 'sin_rol':
            user.is_active = True
            print(f"  - Usuario activado automáticamente al asignar primer rol")
        
        user.save()
        
        print(f"  - SUCCESS: Rol cambiado de '{rol_anterior}' a '{nuevo_rol}'")
        
        # Mensaje personalizado para usuarios sin rol previo
        if rol_anterior == 'sin_rol':
            mensaje = f'Rol "{dict(CustomUser.ROLE_CHOICES)[nuevo_rol]}" asignado al usuario {user.username} (activado automáticamente)'
        else:
            rol_anterior_display = dict(CustomUser.ROLE_CHOICES).get(rol_anterior, 'Sin rol')
            mensaje = f'Rol del usuario {user.username} cambiado de "{rol_anterior_display}" a "{dict(CustomUser.ROLE_CHOICES)[nuevo_rol]}"'
        
        messages.success(request, mensaje)
        
        return JsonResponse({
            'success': True,
            'message': f'Rol asignado correctamente',
            'nuevo_rol': nuevo_rol,
            'nuevo_rol_display': dict(CustomUser.ROLE_CHOICES)[nuevo_rol],
            'usuario_activado': not bool(rol_anterior) or rol_anterior == 'sin_rol'
        })
        
    except Exception as e:
        print(f"  - EXCEPTION: {str(e)}")
        return JsonResponse({
            'success': False, 
            'error': f'Error al cambiar rol: {str(e)}'
        })

@login_required
@user_passes_test(is_admin)
@require_http_methods(["POST"])
def admin_delete_user(request, user_id):
    """Eliminación lógica de usuario (solo admin)"""
    user = get_object_or_404(CustomUser, id=user_id)
    
    try:
        # No permitir eliminar al usuario actual
        if user == request.user:
            return JsonResponse({'success': False, 'error': 'No puedes eliminarte a ti mismo'})
        
        # Eliminación lógica
        user.activo = False
        user.is_active = False
        user.save()
        
        messages.warning(request, f'Usuario {user.username} eliminado lógicamente.')
        
        return JsonResponse({
            'success': True, 
            'message': 'Usuario eliminado'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'error': f'Error al eliminar usuario: {str(e)}'
        })

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
    
    # Detectar si es un administrador quien está creando el usuario
    is_admin_creation = request.user.is_authenticated and (request.user.is_staff or request.user.rol == 'admin')
    
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, is_admin_creation=is_admin_creation)
        if form.is_valid():
            user = form.save()
            
            if is_admin_creation:
                messages.success(request, 
                    f'Usuario {user.username} creado exitosamente con rol {user.get_rol_display()}.')
                return redirect('forms:admin_users_list')
            else:
                messages.success(request, 
                    f'Usuario {user.username} registrado exitosamente. '
                    'Su cuenta será activada por un administrador pronto.')
                return redirect('forms:login')
        else:
            messages.error(request, 'Por favor corrige los errores en el formulario.')
    else:
        form = CustomUserCreationForm(is_admin_creation=is_admin_creation)
    
    # Determinar el título y contexto según quién está creando
    if is_admin_creation:
        context = {
            'form': form,
            'title': 'Crear Nuevo Usuario',
            'is_admin_creation': True
        }
    else:
        context = {
            'form': form,
            'title': 'Registro de Usuario',
            'is_admin_creation': False
        }
    
    return render(request, 'forms/register.html', context)

def form_selector(request):
    """Vista para el selector de secciones"""
    return render(request, 'forms/form_selector.html')


# ===============================
# VISTAS ESPECÍFICAS DEL CONTRATISTA
# ===============================

@login_required
def contratista_formularios(request):
    """Lista de formularios del contratista"""
    if request.user.rol != 'contratista':
        messages.error(request, 'No tienes permisos para acceder a esta página.')
        return redirect('forms:dashboard')
    
    try:
        formularios = FormularioGlobal.objects.filter(creado_por=request.user).order_by('-created_at')
        
        # Filtros
        estado_filtro = request.GET.get('estado')
        if estado_filtro:
            formularios = formularios.filter(estado_actual=estado_filtro)
        
        context = {
            'formularios': formularios,
            'estado_filtro': estado_filtro,
            'estados_disponibles': [
                ('contratista', 'En Proceso'),
                ('interventor', 'Enviado a Interventor'),
                ('devuelto', 'Devuelto'),
                ('finalizado', 'Finalizado')
            ]
        }
        
    except Exception as e:
        context = {
            'formularios': [],
            'error_message': str(e)
        }
    
    return render(request, 'contratista/formularios_lista.html', context)

@login_required
def contratista_nuevo_formulario(request):
    """Crear nuevo formulario - Contratista"""
    if request.user.rol != 'contratista':
        messages.error(request, 'No tienes permisos para acceder a esta página.')
        return redirect('forms:dashboard')
    
    # Limpiar iteraciones temporales si es necesario
    if request.GET.get('limpiar') == '1':
        request.session.pop('iteraciones_temporales', None)
        messages.success(request, 'Sesión limpiada. Puedes comenzar un nuevo formulario.')
        return redirect('forms:contratista_nuevo_formulario')
    
    # Verificar si hay iteraciones temporales
    iteraciones_temporales = request.session.get('iteraciones_temporales', {})
    
    context = {
        'iteraciones_temporales': iteraciones_temporales,
        'tiene_iteraciones': bool(iteraciones_temporales),
        'secciones_disponibles': [
            ('estructuras', 'Estructuras', 'fas fa-building', 'Postes, estructuras de soporte'),
            ('conductores', 'Conductores', 'fas fa-bolt', 'Cables, conductores eléctricos'),
            ('equipos', 'Equipos', 'fas fa-tools', 'Equipos de medición y protección'),
            ('transformador', 'Transformador', 'fas fa-battery-three-quarters', 'Transformadores de distribución')
        ]
    }
    
    return render(request, 'contratista/nuevo_formulario.html', context)

@login_required
def contratista_formulario_seccion(request, seccion):
    """Formulario por sección específica"""
    if request.user.rol != 'contratista':
        messages.error(request, 'No tienes permisos para acceder a esta página.')
        return redirect('forms:dashboard')
    
    secciones_validas = ['estructuras', 'conductores', 'equipos', 'transformador']
    if seccion not in secciones_validas:
        messages.error(request, 'Sección no válida.')
        return redirect('forms:contratista_nuevo_formulario')
    
    # Obtener iteraciones de esta sección
    iteraciones_temporales = request.session.get('iteraciones_temporales', {})
    iteraciones_seccion = iteraciones_temporales.get(seccion, [])
    
    context = {
        'seccion': seccion,
        'seccion_titulo': seccion.title(),
        'iteraciones_seccion': iteraciones_seccion,
        'total_iteraciones': len(iteraciones_seccion)
    }
    
    # Template específico para cada sección
    template_map = {
        'estructuras': 'contratista/secciones/estructuras.html',
        'conductores': 'contratista/secciones/conductores.html',
        'equipos': 'contratista/secciones/equipos.html',
        'transformador': 'contratista/secciones/transformador.html'
    }
    
    return render(request, template_map.get(seccion), context)

@login_required
def contratista_finalizar_formulario(request):
    """Finalizar y enviar formulario"""
    if request.user.rol != 'contratista':
        messages.error(request, 'No tienes permisos para acceder a esta página.')
        return redirect('forms:dashboard')
    
    iteraciones_temporales = request.session.get('iteraciones_temporales', {})
    
    if not iteraciones_temporales:
        messages.error(request, 'No hay iteraciones para finalizar.')
        return redirect('forms:contratista_nuevo_formulario')
    
    if request.method == 'POST':
        try:
            # Crear formulario global
            formulario_data = {
                'trabajo': request.POST.get('trabajo', 'Formulario contratista'),
                'municipio': request.POST.get('municipio', ''),
                'departamento': request.POST.get('departamento', ''),
                'regional': request.POST.get('regional', ''),
                'direccion': request.POST.get('direccion', ''),
                'creado_por': request.user,
                'estado_actual': 'contratista'
            }
            
            # TODO: Aquí se crearía el formulario en la base de datos
            # y se convertirían las iteraciones temporales a definitivas
            
            # Por ahora, limpiar sesión
            request.session.pop('iteraciones_temporales', None)
            
            messages.success(request, 'Formulario creado exitosamente y enviado para revisión.')
            return redirect('forms:contratista_formularios')
            
        except Exception as e:
            messages.error(request, f'Error al crear formulario: {str(e)}')
    
    # Resumen de iteraciones
    resumen = {}
    total_iteraciones = 0
    
    for seccion, iteraciones in iteraciones_temporales.items():
        resumen[seccion] = {
            'cantidad': len(iteraciones),
            'titulo': seccion.title()
        }
        total_iteraciones += len(iteraciones)
    
    context = {
        'iteraciones_temporales': iteraciones_temporales,
        'resumen': resumen,
        'total_iteraciones': total_iteraciones
    }
    
    return render(request, 'contratista/finalizar_formulario.html', context)

def debug_uc_django(request):
    """Vista de debug para UC desde Django"""
    return render(request, 'forms/debug-uc-django.html')
