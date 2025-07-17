from django.db.models import Count, Q
from .models import CustomUser, FormularioGlobal

def admin_context(request):
    """
    Procesador de contexto para agregar estadísticas al admin
    """
    if not request.path.startswith('/admin/'):
        return {}
    
    try:
        # Estadísticas de usuarios
        users_stats = {
            'users_count': CustomUser.objects.count(),
            'admin_count': CustomUser.objects.filter(rol='admin').count(),
            'active_count': CustomUser.objects.filter(is_active=True).count(),
            'staff_count': CustomUser.objects.filter(is_staff=True).count(),
        }
        
        # Estadísticas de formularios
        forms_stats = {
            'forms_count': FormularioGlobal.objects.count(),
            'pending_count': FormularioGlobal.objects.filter(estado_actual='contratista').count(),
            'in_review_count': FormularioGlobal.objects.filter(estado_actual='interventor').count(),
            'completed_count': FormularioGlobal.objects.filter(estado_actual='completado').count(),
        }
        
        # Estadísticas por rol
        role_stats = CustomUser.objects.values('rol').annotate(
            count=Count('id')
        ).order_by('rol')
        
        # Estadísticas por estado de formulario
        state_stats = FormularioGlobal.objects.values('estado_actual').annotate(
            count=Count('id')
        ).order_by('estado_actual')
        
        # Actividad reciente
        recent_users = CustomUser.objects.filter(
            fecha_ultimo_acceso__isnull=False
        ).order_by('-fecha_ultimo_acceso')[:5]
        
        recent_forms = FormularioGlobal.objects.order_by('-created_at')[:5]
        
        return {
            'admin_users_stats': users_stats,
            'admin_forms_stats': forms_stats,
            'admin_role_stats': role_stats,
            'admin_state_stats': state_stats,
            'admin_recent_users': recent_users,
            'admin_recent_forms': recent_forms,
        }
        
    except Exception as e:
        # En caso de error (ej. tablas no existen), retornar valores por defecto
        return {
            'admin_users_stats': {
                'users_count': 0,
                'admin_count': 0,
                'active_count': 0,
                'staff_count': 0,
            },
            'admin_forms_stats': {
                'forms_count': 0,
                'pending_count': 0,
                'in_review_count': 0,
                'completed_count': 0,
            },
            'admin_role_stats': [],
            'admin_state_stats': [],
            'admin_recent_users': [],
            'admin_recent_forms': [],
        }
