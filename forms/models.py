from django.db import models

class FormularioGlobal(models.Model):
    """Modelo para almacenar toda la información del formulario"""
    
    # Información General
    trabajo = models.CharField(max_length=100, blank=True)
    municipio = models.CharField(max_length=100, blank=True)
    numero_x = models.IntegerField(null=True, blank=True)
    regional = models.CharField(max_length=100, blank=True)
    direccion = models.CharField(max_length=200, blank=True)
    numero_y = models.IntegerField(null=True, blank=True)
    alimentador = models.CharField(max_length=100, blank=True)
    barrio_vereda = models.CharField(max_length=100, blank=True)
    numero_z = models.IntegerField(null=True, blank=True)
    nivel_tension = models.CharField(max_length=50, blank=True)
    circuito = models.CharField(max_length=100, blank=True)
    
    # Estructura Nueva
    cod_est_nueva = models.CharField(max_length=50, blank=True)
    apoyo_nueva = models.CharField(max_length=50, blank=True)
    material_nueva = models.CharField(max_length=50, blank=True)
    altura_nueva = models.CharField(max_length=20, blank=True)
    poblacion_nueva = models.CharField(max_length=50, blank=True)
    disposicion_nueva = models.CharField(max_length=50, blank=True)
    kgf_nueva = models.CharField(max_length=20, blank=True)
    tipo_red_nueva = models.CharField(max_length=50, blank=True)
    
    # Estructura Retirada
    cod_est_retirada = models.CharField(max_length=50, blank=True)
    apoyo_retirada = models.CharField(max_length=50, blank=True)
    material_retirada = models.CharField(max_length=50, blank=True)
    altura_retirada = models.CharField(max_length=20, blank=True)
    poblacion_retirada = models.CharField(max_length=50, blank=True)
    kgf_retirada = models.CharField(max_length=20, blank=True)
    disposicion_retirada = models.CharField(max_length=50, blank=True)
    punto_retirada = models.CharField(max_length=100, blank=True)
    tipo_red_retirada = models.CharField(max_length=50, blank=True)
    
    # Información del Proyecto
    nombre = models.CharField(max_length=100, blank=True)
    ot_mano_obra = models.CharField(max_length=100, blank=True)
    ot_materia = models.CharField(max_length=100, blank=True)
    contrato = models.CharField(max_length=100, blank=True)
    pro_terc = models.CharField(max_length=100, blank=True)
    movil = models.CharField(max_length=100, blank=True)
    instalados = models.IntegerField(null=True, blank=True)
    pendientes = models.IntegerField(null=True, blank=True)
    
    # UC Generado
    uc_codigo = models.CharField(max_length=50, blank=True)
    descripcion_uc = models.CharField(max_length=200, blank=True)
    
    # Archivos
    archivo_cad = models.CharField(max_length=500, blank=True)
    
    # Metadata
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    estado = models.CharField(max_length=20, default='borrador')  # borrador, completado, enviado
    
    class Meta:
        db_table = 'FORMULARIO_GLOBAL'
        
    def __str__(self):
        return f"Formulario {self.id} - {self.nombre} - {self.fecha_creacion.strftime('%d/%m/%Y')}"

class ItemFormulario(models.Model):
    """Modelo para items dinámicos del formulario"""
    formulario = models.ForeignKey(
        FormularioGlobal, 
        related_name='items', 
        on_delete=models.CASCADE,
        db_column='FORMULARIO_ID'
    )
    
    # Campos del item
    campo_1 = models.CharField(max_length=100, blank=True)
    campo_2 = models.CharField(max_length=100, blank=True)
    campo_3 = models.CharField(max_length=100, blank=True)
    campo_4 = models.CharField(max_length=100, blank=True)
    campo_5 = models.CharField(max_length=100, blank=True)
    
    # Archivos asociados
    foto_path = models.CharField(max_length=500, blank=True)
    
    # Metadata
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    orden = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'ITEM_FORMULARIO'
        ordering = ['orden', 'fecha_creacion']
        
    def __str__(self):
        return f"Item {self.id} - Formulario {self.formulario.id}"

# Mantener modelos originales para compatibilidad
class Formulario(models.Model):
    """Modelo para tabla FORMULARIO en Oracle"""
    conductor = models.CharField(max_length=100)
    supervisor = models.CharField(max_length=100) 
    fecha = models.DateTimeField()  # Oracle DATE incluye tiempo
    archivo_cad = models.CharField(max_length=500, null=True, blank=True)

    class Meta:
        db_table = 'FORMULARIO'  # Mapear a tabla Oracle existente
        
    def __str__(self):
        return f"Formulario {self.conductor} - {self.fecha.strftime('%d/%m/%Y')}"

class FormularioItem(models.Model):
    """Modelo para tabla FORMULARIO_ITEM en Oracle"""
    formulario = models.ForeignKey(
        Formulario, 
        related_name='items', 
        on_delete=models.CASCADE,
        db_column='FORMULARIO_ID'  # Mapear a columna Oracle existente
    )
    bid = models.CharField(max_length=50)
    card = models.CharField(max_length=50)
    uc = models.CharField(max_length=50, null=True, blank=True)
    attribute = models.CharField(max_length=100)
    material = models.CharField(max_length=100)
    foto_path = models.CharField(max_length=500, null=True, blank=True)

    class Meta:
        db_table = 'FORMULARIO_ITEM'  # Mapear a tabla Oracle existente
        
    def __str__(self):
        return f"Item {self.bid} - {self.card}"
