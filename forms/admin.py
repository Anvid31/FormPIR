from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import CustomUser, FormularioGlobal

# Personalizar el admin site
admin.site.site_header = "Administración FormPIR"
admin.site.site_title = "FormPIR Admin"
admin.site.index_title = "Panel de Administración - Sistema FormPIR"

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """Admin para gestión completa de usuarios"""
    
    # Campos a mostrar en la lista
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_rol_display', 'is_active_badge', 'activo_badge', 'date_joined')
    list_filter = ('rol', 'is_active', 'activo', 'date_joined', 'regional_asignada')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_per_page = 25
    
    # Acciones personalizadas
    actions = ['activar_usuarios', 'desactivar_usuarios', 'marcar_eliminados', 'marcar_activos', 'asignar_rol_contratista', 'asignar_rol_ejecutor']
    
    # Configuración de campos en el formulario
    fieldsets = UserAdmin.fieldsets + (
        ('Información del Sistema FormPIR', {
            'fields': ('rol', 'equipo_contratista', 'regional_asignada', 'departamento_asignado', 'activo'),
            'description': 'Configuración específica para el sistema FormPIR'
        }),
    )
    
    def get_rol_display(self, obj):
        colors = {
            'admin': '#dc3545',
            'contratista': '#fd7e14',
            'ejecutor': '#007bff',
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
    
    def is_active_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color: #28a745; font-weight: bold;">✓ Activo</span>')
        else:
            return format_html('<span style="color: #dc3545; font-weight: bold;">✗ Inactivo</span>')
    is_active_badge.short_description = 'Django Active'
    
    def activo_badge(self, obj):
        if obj.activo:
            return format_html('<span style="color: #28a745;">🟢 1</span>')
        else:
            return format_html('<span style="color: #dc3545;">🔴 0</span>')
    activo_badge.short_description = 'Sistema (1/0)'
    
    # Acciones personalizadas
    def activar_usuarios(self, request, queryset):
        """Activar usuarios seleccionados en Django"""
        queryset.update(is_active=True)
        self.message_user(request, f"{queryset.count()} usuarios activados en Django.")
    activar_usuarios.short_description = "✅ Activar en Django (is_active=True)"
    
    def desactivar_usuarios(self, request, queryset):
        """Desactivar usuarios seleccionados en Django"""
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} usuarios desactivados en Django.")
    desactivar_usuarios.short_description = "❌ Desactivar en Django (is_active=False)"
    
    def marcar_eliminados(self, request, queryset):
        """Marcar usuarios como eliminados (soft delete)"""
        queryset.update(activo=False)
        self.message_user(request, f"{queryset.count()} usuarios marcados como eliminados (activo=0).")
    marcar_eliminados.short_description = "🗑️ Eliminar lógicamente (activo=0)"
    
    def marcar_activos(self, request, queryset):
        """Marcar usuarios como activos"""
        queryset.update(activo=True)
        self.message_user(request, f"{queryset.count()} usuarios marcados como activos (activo=1).")
    marcar_activos.short_description = "🔄 Restaurar (activo=1)"
    
    def asignar_rol_contratista(self, request, queryset):
        """Asignar rol contratista"""
        queryset.update(rol='contratista')
        self.message_user(request, f"{queryset.count()} usuarios asignados como contratistas.")
    asignar_rol_contratista.short_description = "👷 Asignar rol: Contratista"
    
    def asignar_rol_ejecutor(self, request, queryset):
        """Asignar rol ejecutor"""
        queryset.update(rol='ejecutor')
        self.message_user(request, f"{queryset.count()} usuarios asignados como ejecutores.")
    asignar_rol_ejecutor.short_description = "🔧 Asignar rol: Ejecutor"

@admin.register(FormularioGlobal)
class FormularioGlobalAdmin(admin.ModelAdmin):
    """Admin para gestión completa de formularios"""
    
    # Campos a mostrar en la lista
    list_display = ('get_numero_formulario', 'trabajo_truncated', 'municipio', 'estado_actual', 'creado_por', 'activo_badge', 'created_at_formatted')
    list_filter = ('estado_actual', 'activo', 'municipio', 'regional', 'created_at', 'creado_por__rol')
    search_fields = ('trabajo', 'municipio', 'direccion', 'creado_por__username')
    list_per_page = 25
    
    # Campos editables directamente en la lista
    list_editable = ('estado_actual',)
    
    # Acciones personalizadas para cambio de estados
    actions = [
        'cambiar_a_contratista', 'cambiar_a_interventor', 'cambiar_a_gestion', 'cambiar_a_finalizado',
        'marcar_eliminados', 'marcar_activos'
    ]
    
    # Organización de campos en el formulario
    fieldsets = (
        ('Información Básica', {
            'fields': ('trabajo', 'municipio', 'regional', 'direccion', 'creado_por')
        }),
        ('Información Técnica', {
            'fields': ('alimentador', 'barrio_vereda', 'nivel_tension', 'circuito'),
            'classes': ('collapse',)
        }),
        ('Control de Estado', {
            'fields': ('estado_actual', 'activo'),
            'description': 'Control del estado del formulario y eliminación lógica'
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def get_numero_formulario(self, obj):
        """Mostrar número de formulario"""
        return format_html('<strong style="color: #2E8B57;">F{:06d}</strong>', obj.id)
    get_numero_formulario.short_description = 'N° Formulario'
    
    def trabajo_truncated(self, obj):
        if obj.trabajo and len(obj.trabajo) > 40:
            return obj.trabajo[:37] + '...'
        return obj.trabajo or 'Sin trabajo'
    trabajo_truncated.short_description = 'Trabajo'
    
    def estado_badge(self, obj):
        colors = {
            'contratista': '#fd7e14',
            'interventor': '#007bff', 
            'gestion': '#6f42c1',
            'finalizado': '#28a745'
        }
        color = colors.get(obj.estado_actual, '#6c757d')
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: bold;">{}</span>',
            color,
            obj.get_estado_actual_display()
        )
    estado_badge.short_description = 'Estado'
    
    def activo_badge(self, obj):
        if obj.activo:
            return format_html('<span style="color: #28a745;">🟢 1</span>')
        else:
            return format_html('<span style="color: #dc3545;">🔴 0</span>')
    activo_badge.short_description = 'Activo (1/0)'
    
    def created_at_formatted(self, obj):
        return obj.created_at.strftime('%d/%m/%Y %H:%M')
    created_at_formatted.short_description = 'Fecha Creación'
    
    # Acciones para cambiar estados
    def cambiar_a_contratista(self, request, queryset):
        queryset.update(estado_actual='contratista')
        self.message_user(request, f"{queryset.count()} formularios enviados a Contratista.")
    cambiar_a_contratista.short_description = "📋 Enviar a Contratista"
    
    def cambiar_a_interventor(self, request, queryset):
        queryset.update(estado_actual='interventor')
        self.message_user(request, f"{queryset.count()} formularios enviados a Interventor.")
    cambiar_a_interventor.short_description = "🔍 Enviar a Interventor"
    
    def cambiar_a_gestion(self, request, queryset):
        queryset.update(estado_actual='gestion')
        self.message_user(request, f"{queryset.count()} formularios enviados a Gestión.")
    cambiar_a_gestion.short_description = "📊 Enviar a Gestión"
    
    def cambiar_a_finalizado(self, request, queryset):
        queryset.update(estado_actual='finalizado')
        self.message_user(request, f"{queryset.count()} formularios finalizados.")
    cambiar_a_finalizado.short_description = "✅ Finalizar formularios"
    
    def marcar_eliminados(self, request, queryset):
        """Marcar formularios como eliminados (soft delete)"""
        queryset.update(activo=False)
        self.message_user(request, f"{queryset.count()} formularios marcados como eliminados (activo=0).")
    marcar_eliminados.short_description = "🗑️ Eliminar lógicamente (activo=0)"
    
    def marcar_activos(self, request, queryset):
        """Marcar formularios como activos"""
        queryset.update(activo=True)
        self.message_user(request, f"{queryset.count()} formularios marcados como activos (activo=1).")
    marcar_activos.short_description = "🔄 Restaurar (activo=1)"
