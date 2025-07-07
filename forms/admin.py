from django.contrib import admin
from .models import FormularioGlobal, EstructuraNueva, EstructuraRetirada, ProyectoInfo

@admin.register(FormularioGlobal)
class FormularioGlobalAdmin(admin.ModelAdmin):
    list_display = ('id', 'trabajo', 'municipio', 'regional', 'alimentador', 'circuito', 'created_at')
    list_filter = ('created_at', 'regional', 'nivel_tension')
    search_fields = ('trabajo', 'municipio', 'alimentador', 'circuito')
    date_hierarchy = 'created_at'
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return ['created_at']
        return []

@admin.register(EstructuraNueva)
class EstructuraNuevaAdmin(admin.ModelAdmin):
    list_display = ('id', 'formulario', 'cod_est', 'apoyo', 'material', 'altura', 'tipo_red')
    list_filter = ('material', 'tipo_red', 'created_at')
    search_fields = ('cod_est', 'apoyo', 'material')
    raw_id_fields = ('formulario',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('formulario')

@admin.register(EstructuraRetirada)
class EstructuraRetiradaAdmin(admin.ModelAdmin):
    list_display = ('id', 'formulario', 'cod_est', 'apoyo', 'material', 'altura', 'tipo_red', 'punto')
    list_filter = ('material', 'tipo_red', 'created_at')
    search_fields = ('cod_est', 'apoyo', 'material', 'punto')
    raw_id_fields = ('formulario',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('formulario')

@admin.register(ProyectoInfo)
class ProyectoInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'formulario', 'nombre', 'ot_mano_obra', 'ot_materia', 'contrato', 'pro_terc')
    list_filter = ('created_at',)
    search_fields = ('nombre', 'contrato', 'ot_mano_obra', 'ot_materia')
    raw_id_fields = ('formulario',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('formulario')
