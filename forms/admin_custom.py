from django.contrib import admin
from django.db.models import Count, Q
from django.template.response import TemplateResponse
from django.urls import path
from django.utils.html import format_html
from .models import CustomUser, FormularioGlobal

# Sobrescribir AdminSite para personalizar el contexto
class CustomAdminSite(admin.AdminSite):
    site_header = "Administración DESS"
    site_title = "DESS Admin"
    index_title = "Panel de Administración"
    
    def index(self, request, extra_context=None):
        """
        Display the main admin index page, which lists all of the installed
        apps that have been registered in this site.
        """
        extra_context = extra_context or {}
        
        # Agregar estadísticas al contexto
        extra_context.update({
            'users_count': CustomUser.objects.count(),
            'forms_count': FormularioGlobal.objects.count(),
            'admin_count': CustomUser.objects.filter(rol='admin').count(),
            'active_count': CustomUser.objects.filter(is_active=True).count(),
            'pending_count': FormularioGlobal.objects.filter(estado_actual='contratista').count(),
            'completed_count': FormularioGlobal.objects.filter(estado_actual='completado').count(),
        })
        
        return super().index(request, extra_context)

# Crear instancia personalizada del admin site
admin_site = CustomAdminSite(name='custom_admin')

@admin.register(CustomUser, site=admin_site)
class CustomUserAdmin(admin.ModelAdmin):
    """Administración de usuarios personalizados"""
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_rol_display', 'is_active_badge', 'date_joined')
    list_filter = ('rol', 'is_active', 'is_staff', 'regional_asignada', 'equipo_contratista')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_per_page = 25
    date_hierarchy = 'date_joined'
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('username', 'password', 'email', 'first_name', 'last_name')
        }),
        ('Permisos', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',),
        }),
        ('Información DESS', {
            'fields': ('rol', 'equipo_contratista', 'regional_asignada', 'departamento_asignado', 'activo'),
            'description': 'Configuración específica para el sistema DESS'
        }),
        ('Fechas Importantes', {
            'fields': ('last_login', 'date_joined', 'fecha_ultimo_acceso'),
            'classes': ('collapse',),
        }),
    )
    
    readonly_fields = ('date_joined', 'last_login')
    
    def get_rol_display(self, obj):
        colors = {
            'admin': '#dc3545',
            'contratista': '#fd7e14',
            'ejecutor': '#007bff',
            'interventor': '#6610f2',
            'gestion': '#6f42c1',
            'planeacion': '#e83e8c'
        }
        color = colors.get(obj.rol, '#6c757d')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_rol_display()
        )
    get_rol_display.short_description = 'Rol'
    get_rol_display.admin_order_field = 'rol'
    
    def is_active_badge(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="color: #28a745; font-weight: bold;">✓ Activo</span>'
            )
        else:
            return format_html(
                '<span style="color: #dc3545; font-weight: bold;">✗ Inactivo</span>'
            )
    is_active_badge.short_description = 'Estado'
    is_active_badge.admin_order_field = 'is_active'
    
    def changelist_view(self, request, extra_context=None):
        # Agregar estadísticas específicas a la lista de usuarios
        extra_context = extra_context or {}
        extra_context.update({
            'admin_count': CustomUser.objects.filter(rol='admin').count(),
            'active_count': CustomUser.objects.filter(is_active=True).count(),
        })
        return super().changelist_view(request, extra_context)

@admin.register(FormularioGlobal, site=admin_site)
class FormularioGlobalAdmin(admin.ModelAdmin):
    """Administración de formularios"""
    list_display = ('get_numero_formulario', 'trabajo_truncated', 'municipio', 'regional', 'estado_badge', 'creado_por', 'created_at_formatted')
    list_filter = ('estado_actual', 'regional', 'created_at', 'creado_por__rol')
    search_fields = ('trabajo', 'municipio', 'direccion', 'circuito', 'alimentador')
    date_hierarchy = 'created_at'
    list_per_page = 25
    raw_id_fields = ('creado_por',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('trabajo', 'creado_por', 'estado_actual')
        }),
        ('Ubicación', {
            'fields': ('municipio', 'regional', 'direccion', 'barrio_vereda'),
            'description': 'Información de ubicación del trabajo'
        }),
        ('Detalles Técnicos', {
            'fields': ('alimentador', 'circuito', 'nivel_tension'),
            'classes': ('collapse',),
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    
    def get_numero_formulario(self, obj):
        return format_html(
            '<strong style="color: #2E8B57;">F{:06d}</strong>',
            obj.id
        )
    get_numero_formulario.short_description = 'N° Formulario'
    get_numero_formulario.admin_order_field = 'id'
    
    def trabajo_truncated(self, obj):
        if len(obj.trabajo) > 50:
            return obj.trabajo[:47] + '...'
        return obj.trabajo
    trabajo_truncated.short_description = 'Trabajo'
    trabajo_truncated.admin_order_field = 'trabajo'
    
    def estado_badge(self, obj):
        colors = {
            'contratista': '#fd7e14',
            'interventor': '#007bff', 
            'ejecutor': '#6610f2',
            'gestion': '#6f42c1',
            'completado': '#28a745',
            'cancelado': '#dc3545'
        }
        color = colors.get(obj.estado_actual, '#6c757d')
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: bold;">{}</span>',
            color,
            obj.get_estado_actual_display()
        )
    estado_badge.short_description = 'Estado'
    estado_badge.admin_order_field = 'estado_actual'
    
    def created_at_formatted(self, obj):
        return obj.created_at.strftime('%d/%m/%Y %H:%M')
    created_at_formatted.short_description = 'Fecha Creación'
    created_at_formatted.admin_order_field = 'created_at'
    
    def changelist_view(self, request, extra_context=None):
        # Agregar estadísticas específicas a la lista de formularios
        extra_context = extra_context or {}
        extra_context.update({
            'pending_count': FormularioGlobal.objects.filter(estado_actual='contratista').count(),
            'completed_count': FormularioGlobal.objects.filter(estado_actual='completado').count(),
        })
        return super().changelist_view(request, extra_context)

# Registrar también en el admin por defecto para compatibilidad
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(FormularioGlobal, FormularioGlobalAdmin)

# Personalizar el admin por defecto
admin.site.site_header = "Administración DESS"
admin.site.site_title = "DESS Admin"
admin.site.index_title = "Panel de Administración"
