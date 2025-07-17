# forms.py - Formularios del Sistema Semáforo
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from .models import CustomUser, FormularioGlobal, EstructuraNueva, EstructuraRetirada, ProyectoInfo

# ==================== FORMULARIOS DE AUTENTICACIÓN ====================

class LoginForm(forms.Form):
    """Formulario de login personalizado"""
    username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Usuario',
            'autofocus': True
        }),
        label='Usuario'
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Contraseña'
        }),
        label='Contraseña'
    )

class CustomUserCreationForm(UserCreationForm):
    """Formulario para crear usuarios del sistema"""
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'class': 'form-control'})
    )
    first_name = forms.CharField(
        max_length=30,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        label='Nombres'
    )
    last_name = forms.CharField(
        max_length=30,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        label='Apellidos'
    )
    rol = forms.ChoiceField(
        choices=CustomUser.ROLE_CHOICES,
        widget=forms.Select(attrs={'class': 'form-control'}),
        label='Rol en el Sistema'
    )
    equipo_contratista = forms.ChoiceField(
        choices=[('', 'Seleccionar...')] + list(CustomUser.EQUIPO_CONTRATISTA_CHOICES),
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'}),
        label='Equipo Contratista'
    )
    regional_asignada = forms.ChoiceField(
        choices=[('', 'Seleccionar...')] + list(CustomUser.REGIONAL_CHOICES),
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'}),
        label='Regional Asignada'
    )
    departamento_asignado = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        label='Departamento Asignado'
    )

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name', 'password1', 'password2',
                 'rol', 'equipo_contratista', 'regional_asignada', 'departamento_asignado')

    def clean(self):
        cleaned_data = super().clean()
        rol = cleaned_data.get('rol')
        equipo_contratista = cleaned_data.get('equipo_contratista')

        if rol == 'contratista' and not equipo_contratista:
            raise ValidationError('Los usuarios contratistas deben tener un equipo asignado.')

        if rol != 'contratista' and equipo_contratista:
            cleaned_data['equipo_contratista'] = None

        return cleaned_data

# ==================== FORMULARIO PRINCIPAL DE FORMULARIOS ====================

class FormularioForm(forms.ModelForm):
    """Formulario principal para crear/editar formularios"""
    
    class Meta:
        model = FormularioGlobal
        fields = [
            'trabajo', 'municipio', 'numero_x', 'numero_y', 'regional',
            'direccion', 'alimentador', 'barrio_vereda', 'numero_z',
            'nivel_tension', 'circuito'
        ]
        widgets = {
            'trabajo': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Descripción del trabajo'
            }),
            'municipio': forms.Select(attrs={
                'class': 'form-select',
                'id': 'municipio'
            }),
            'numero_x': forms.NumberInput(attrs={
                'class': 'form-input',
                'placeholder': '1089777',
                'min': '800000',
                'max': '1300000',
                'step': '0.001'
            }),
            'numero_y': forms.NumberInput(attrs={
                'class': 'form-input',
                'placeholder': '1386035',
                'min': '1000000',
                'max': '1600000',
                'step': '0.001'
            }),
            'regional': forms.TextInput(attrs={
                'class': 'form-input bg-gray-50',
                'readonly': True
            }),
            'direccion': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Dirección completa'
            }),
            'alimentador': forms.Select(attrs={
                'class': 'form-select',
                'id': 'alimentador'
            }),
            'barrio_vereda': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Nombre del barrio o vereda'
            }),
            'numero_z': forms.NumberInput(attrs={
                'class': 'form-input',
                'placeholder': '0'
            }),
            'nivel_tension': forms.Select(attrs={
                'class': 'form-select'
            }),
            'circuito': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Circuito eléctrico'
            }),
        }

# ==================== FORMULARIOS DE CAMBIO DE ESTADO ====================

class CambioEstadoForm(forms.Form):
    """Formulario para cambio de estado en el workflow"""
    
    ESTADO_CHOICES = FormularioGlobal.ESTADO_CHOICES
    
    nuevo_estado = forms.ChoiceField(
        choices=ESTADO_CHOICES,
        widget=forms.Select(attrs={'class': 'form-select'}),
        label='Nuevo Estado'
    )
    comentario = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 3,
            'placeholder': 'Comentario opcional sobre el cambio de estado...'
        }),
        required=False,
        label='Comentario'
    )

# ==================== FORMULARIOS DE FILTROS ====================

class FiltroFormulariosForm(forms.Form):
    """Formulario para filtrar formularios en el dashboard"""
    
    estado = forms.ChoiceField(
        choices=[('', 'Todos los estados')] + list(FormularioGlobal.ESTADO_CHOICES),
        required=False,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    
    busqueda = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Buscar por ID, trabajo o municipio...'
        })
    )
