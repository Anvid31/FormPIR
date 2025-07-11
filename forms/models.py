from django.db import models
from django.utils import timezone

class FormularioGlobal(models.Model):
    """Modelo para la tabla AC_FORMULARIO_GLOBAL_PIR"""
    id = models.AutoField(db_column='AC_ID_PIR', primary_key=True)
    trabajo = models.CharField(db_column='AC_TRABAJO_PIR', max_length=100, blank=True, null=True)
    municipio = models.CharField(db_column='AC_MUNICIPIO_PIR', max_length=100, blank=True, null=True)
    numero_x = models.IntegerField(db_column='AC_NUMERO_X_PIR', null=True, blank=True)
    regional = models.CharField(db_column='AC_REGIONAL_PIR', max_length=100, blank=True, null=True)
    direccion = models.CharField(db_column='AC_DIRECCION_PIR', max_length=200, blank=True, null=True)
    numero_y = models.IntegerField(db_column='AC_NUMERO_Y_PIR', null=True, blank=True)
    alimentador = models.CharField(db_column='AC_ALIMENTADOR_PIR', max_length=100, blank=True, null=True)
    barrio_vereda = models.CharField(db_column='AC_BARRIO_VEREDA_PIR', max_length=100, blank=True, null=True)
    numero_z = models.IntegerField(db_column='AC_NUMERO_Z_PIR', null=True, blank=True)
    nivel_tension = models.CharField(db_column='AC_NIVEL_TENSION_PIR', max_length=50, blank=True, null=True)
    circuito = models.CharField(db_column='AC_CIRCUITO_PIR', max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(db_column='AC_CREATED_AT_PIR', default=timezone.now)
    updated_at = models.DateTimeField(db_column='AC_UPDATED_AT_PIR', auto_now=True)

    class Meta:
        db_table = 'AC_FORMULARIO_GLOBAL_PIR'
        managed = False  # False para Oracle (tablas ya existen)

    def __str__(self):
        return f"Formulario {self.id} - {self.trabajo or 'Sin trabajo'}"

class EstructuraNueva(models.Model):
    """Modelo para la tabla AC_ESTRUCTURA_NUEVA_PIR"""
    id = models.AutoField(db_column='AC_ID_PIR', primary_key=True)
    formulario = models.ForeignKey(FormularioGlobal, models.CASCADE, db_column='AC_FORMULARIO_ID_PIR')
    cod_est = models.CharField(db_column='AC_COD_EST_PIR', max_length=50, blank=True, null=True)
    apoyo = models.CharField(db_column='AC_APOYO_PIR', max_length=50, blank=True, null=True)
    material = models.CharField(db_column='AC_MATERIAL_PIR', max_length=50, blank=True, null=True)
    altura = models.DecimalField(db_column='AC_ALTURA_PIR', max_digits=5, decimal_places=2, blank=True, null=True)
    tipo_red = models.CharField(db_column='AC_TIPO_RED_PIR', max_length=50, blank=True, null=True)
    poblacion = models.CharField(db_column='AC_POBLACION_PIR', max_length=50, blank=True, null=True)
    disposicion = models.CharField(db_column='AC_DISPOSICION_PIR', max_length=50, blank=True, null=True)
    kgf = models.DecimalField(db_column='AC_KGF_PIR', max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(db_column='AC_CREATED_AT_PIR', default=timezone.now)
    updated_at = models.DateTimeField(db_column='AC_UPDATED_AT_PIR', auto_now=True)

    class Meta:
        db_table = 'AC_ESTRUCTURA_NUEVA_PIR'
        managed = False  # False para Oracle (tablas ya existen)

    def __str__(self):
        return f"Estructura Nueva {self.cod_est} - Formulario {self.formulario_id}"

class EstructuraRetirada(models.Model):
    """Modelo para la tabla AC_ESTRUCTURA_RETIRADA_PIR"""
    id = models.AutoField(db_column='AC_ID_PIR', primary_key=True)
    formulario = models.ForeignKey(FormularioGlobal, models.CASCADE, db_column='AC_FORMULARIO_ID_PIR')
    cod_est = models.CharField(db_column='AC_COD_EST_PIR', max_length=50, blank=True, null=True)
    apoyo = models.CharField(db_column='AC_APOYO_PIR', max_length=50, blank=True, null=True)
    material = models.CharField(db_column='AC_MATERIAL_PIR', max_length=50, blank=True, null=True)
    altura = models.DecimalField(db_column='AC_ALTURA_PIR', max_digits=5, decimal_places=2, blank=True, null=True)
    tipo_red = models.CharField(db_column='AC_TIPO_RED_PIR', max_length=50, blank=True, null=True)
    punto = models.CharField(db_column='AC_PUNTO_PIR', max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(db_column='AC_CREATED_AT_PIR', default=timezone.now)
    updated_at = models.DateTimeField(db_column='AC_UPDATED_AT_PIR', auto_now=True)

    class Meta:
        db_table = 'AC_ESTRUCTURA_RETIRADA_PIR'
        managed = False  # False para Oracle (tablas ya existen)

    def __str__(self):
        return f"Estructura Retirada {self.cod_est} - Formulario {self.formulario_id}"

class ProyectoInfo(models.Model):
    """Modelo para la tabla AC_PROYECTO_INFO_PIR"""
    id = models.AutoField(db_column='AC_ID_PIR', primary_key=True)
    formulario = models.OneToOneField(FormularioGlobal, models.CASCADE, db_column='AC_FORMULARIO_ID_PIR')
    nombre = models.CharField(db_column='AC_NOMBRE_PIR', max_length=200)
    ot_mano_obra = models.CharField(db_column='AC_OT_MANO_OBRA_PIR', max_length=50, blank=True, null=True)
    ot_materia = models.CharField(db_column='AC_OT_MATERIA_PIR', max_length=50, blank=True, null=True)
    contrato = models.CharField(db_column='AC_CONTRATO_PIR', max_length=50, blank=True, null=True)
    pro_terc = models.CharField(db_column='AC_PRO_TERC_PIR', max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(db_column='AC_CREATED_AT_PIR', default=timezone.now)
    updated_at = models.DateTimeField(db_column='AC_UPDATED_AT_PIR', auto_now=True)

    class Meta:
        db_table = 'AC_PROYECTO_INFO_PIR'
        managed = False  # False para Oracle (tablas ya existen)

    def __str__(self):
        return f"Proyecto {self.nombre} - Formulario {self.formulario_id}"
