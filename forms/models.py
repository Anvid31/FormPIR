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
    fecha_ultimo_acceso = models.DateTimeField(auto_now=True)
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


