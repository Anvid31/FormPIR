from django.contrib import admin
from .models import Formulario, FormularioItem

@admin.register(Formulario)
class FormularioAdmin(admin.ModelAdmin):
    list_display = ('conductor', 'supervisor', 'fecha', 'archivo_cad')
    list_filter = ('fecha', 'supervisor')
    search_fields = ('conductor', 'supervisor')
    date_hierarchy = 'fecha'
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return ['fecha']
        return []

@admin.register(FormularioItem)
class FormularioItemAdmin(admin.ModelAdmin):
    list_display = ('formulario', 'bid', 'card', 'uc', 'attribute', 'material')
    list_filter = ('formulario__fecha', 'material', 'attribute')
    search_fields = ('bid', 'card', 'uc', 'material')
    raw_id_fields = ('formulario',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('formulario')
