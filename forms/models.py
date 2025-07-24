from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    """Usuario personalizado con roles para el sistema semáforo"""
    
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('contratista', 'Contratista'),
        ('ejecutor', 'Ejecutor/Interventor'), 
        ('gestion', 'Gestión'),
        ('planeacion', 'Planeación'),
    ]
    
    # Campos adicionales
    rol = models.CharField(max_length=20, choices=ROLE_CHOICES, default='contratista')
    equipo_contratista = models.CharField(max_length=100, blank=True, null=True)
    regional_asignada = models.CharField(max_length=100, blank=True, null=True)
    departamento_asignado = models.CharField(max_length=100, blank=True, null=True)
    fecha_ultimo_acceso = models.DateTimeField(auto_now=True, null=True, blank=True)
    activo = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'FORMS_CUSTOMUSER'
    
    def __str__(self):
        return f"{self.username} - {self.get_rol_display()}"

class FormularioGlobal(models.Model):
    """Formulario principal del sistema semáforo"""
    
    ESTADO_CHOICES = [
        ('contratista', 'Contratista'),
        ('interventor', 'Interventor'),
        ('gestion', 'Gestión'),
        ('finalizado', 'Finalizado'),
    ]
    
    # Campos básicos
    trabajo = models.CharField(max_length=200, blank=True, null=True)
    municipio = models.CharField(max_length=100, blank=True, null=True)
    regional = models.CharField(max_length=100, blank=True, null=True)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    alimentador = models.CharField(max_length=100, blank=True, null=True)
    barrio_vereda = models.CharField(max_length=100, blank=True, null=True)
    nivel_tension = models.CharField(max_length=50, blank=True, null=True)
    circuito = models.CharField(max_length=100, blank=True, null=True)
    
    # Campos de tipos de inversión - TEMPORALMENTE COMENTADOS HASTA MIGRACIÓN
    # montaje_integral = models.BooleanField(default=False, help_text="Montaje integral - Deshabilita campos UC")
    # desmantelado = models.BooleanField(default=False, help_text="Desmantelado - Solo estructura retirada habilitada")
    
    # Sistema semáforo
    estado_actual = models.CharField(max_length=30, choices=ESTADO_CHOICES, default='contratista')
    creado_por = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    
    # Eliminación lógica
    activo = models.BooleanField(default=True, help_text="1=Activo, 0=Eliminado")
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'FORMS_FORMULARIO'
        ordering = ['-updated_at']

    def __str__(self):
        return f"Formulario {self.id} - {self.trabajo or 'Sin trabajo'}"
    
    def get_numero_formulario(self):
        return f"F{self.id:06d}"
    
    def get_estados_validos(self):
        """Obtiene los estados válidos según el flujo del semáforo"""
        flujo_estados = {
            'contratista': ['interventor'],  # Solo puede avanzar a interventor
            'interventor': ['contratista', 'gestion'],  # Puede regresar a contratista o avanzar a gestión
            'gestion': ['interventor', 'finalizado'],  # Puede regresar a interventor o finalizar
            'finalizado': ['gestion'],  # Solo puede regresar a gestión
        }
        estados_validos = flujo_estados.get(self.estado_actual, [])
        
        # Convertir a formato compatible con choices
        return [(estado, dict(self.ESTADO_CHOICES)[estado]) for estado in estados_validos]


class FormularioIteracion(models.Model):
    """
    Tabla para almacenar iteraciones temporales y definitivas
    desde cualquiera de las 4 secciones del formulario
    """
    
    # Estados de la iteración
    ESTADO_CHOICES = [
        ('temporal', 'Temporal'),
        ('definitivo', 'Definitivo'),
        ('eliminado', 'Eliminado'),
    ]
    
    SECCION_CHOICES = [
        ('estructuras', 'Estructuras'),
        ('conductores', 'Conductores'),
        ('equipos', 'Equipos'),
        ('transformador', 'Transformador'),
    ]
    
    # Identificación
    session_key = models.CharField(max_length=40, help_text="Clave de sesión para iteraciones temporales")
    formulario_id = models.CharField(max_length=50, null=True, blank=True, help_text="ID definitivo del formulario")
    usuario = models.ForeignKey('CustomUser', on_delete=models.CASCADE, null=True, blank=True)
    
    # Metadata de la iteración
    seccion = models.CharField(max_length=20, choices=SECCION_CHOICES)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='temporal')
    numero_iteracion = models.IntegerField(default=1)
    
    # Información del proyecto (común a todas las secciones)
    nombre_proyecto = models.CharField(max_length=200)
    banco_proyecto = models.CharField(max_length=100, blank=True)
    contrato = models.CharField(max_length=200, blank=True)
    municipio = models.CharField(max_length=100, blank=True)
    departamento = models.CharField(max_length=100, blank=True)
    regional = models.CharField(max_length=100, blank=True)
    
    # Información técnica básica (común)
    latitud_inicial = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    longitud_inicial = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    latitud_final = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    longitud_final = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    direccion = models.CharField(max_length=200, blank=True)
    cantidad = models.IntegerField(default=1)
    
    # Campos específicos por sección (JSON para flexibilidad)
    datos_especificos = models.JSONField(default=dict, help_text="Datos específicos de cada sección")
    
    # Campos de auditoría
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'formulario_iteraciones'
        ordering = ['seccion', 'numero_iteracion']
        unique_together = [('session_key', 'seccion', 'numero_iteracion', 'estado')]
    
    def __str__(self):
        return f"{self.seccion.title()} - Iter. {self.numero_iteracion} ({self.estado})"
    
    @classmethod
    def get_iteraciones_temporales(cls, session_key, seccion=None):
        """Obtener iteraciones temporales por sesión"""
        queryset = cls.objects.filter(session_key=session_key, estado='temporal')
        if seccion:
            queryset = queryset.filter(seccion=seccion)
        return queryset.order_by('seccion', 'numero_iteracion')
    
    @classmethod
    def convertir_a_definitivo(cls, session_key, formulario_id, usuario=None):
        """Convertir todas las iteraciones temporales a definitivas"""
        iteraciones = cls.objects.filter(session_key=session_key, estado='temporal')
        count = iteraciones.update(
            estado='definitivo',
            formulario_id=formulario_id,
            usuario=usuario,
            fecha_actualizacion=timezone.now()
        )
        return count
    
    def to_dict(self):
        """Convertir a diccionario para JSON"""
        return {
            'id': self.id,
            'seccion': self.seccion,
            'numero_iteracion': self.numero_iteracion,
            'nombre_proyecto': self.nombre_proyecto,
            'banco_proyecto': self.banco_proyecto,
            'contrato': self.contrato,
            'municipio': self.municipio,
            'departamento': self.departamento,
            'regional': self.regional,
            'latitud_inicial': float(self.latitud_inicial) if self.latitud_inicial else None,
            'longitud_inicial': float(self.longitud_inicial) if self.longitud_inicial else None,
            'latitud_final': float(self.latitud_final) if self.latitud_final else None,
            'longitud_final': float(self.longitud_final) if self.longitud_final else None,
            'direccion': self.direccion,
            'cantidad': self.cantidad,
            'datos_especificos': self.datos_especificos,
            'estado': self.estado,
            'fecha_creacion': self.fecha_creacion.isoformat(),
        }
