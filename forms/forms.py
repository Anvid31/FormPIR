from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser, FormularioGlobal

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(
        required=True, 
        widget=forms.EmailInput(attrs={
            "class": "form-input",
            "placeholder": "correo@ejemplo.com"
        })
    )
    first_name = forms.CharField(
        max_length=30, 
        required=True, 
        widget=forms.TextInput(attrs={
            "class": "form-input",
            "placeholder": "Ingrese sus nombres"
        })
    )
    last_name = forms.CharField(
        max_length=30, 
        required=True, 
        widget=forms.TextInput(attrs={
            "class": "form-input",
            "placeholder": "Ingrese sus apellidos"
        })
    )
    
    # Campo de rol solo visible para administradores
    rol = forms.ChoiceField(
        choices=[('', '-- Seleccionar rol --')] + CustomUser.ROLE_CHOICES,
        required=False,
        widget=forms.Select(attrs={
            "class": "form-input"
        })
    )

    class Meta:
        model = CustomUser
        fields = ("username", "email", "first_name", "last_name", "password1", "password2", "rol")
        
    def __init__(self, *args, **kwargs):
        # Recibir parámetro para saber si es creación por admin
        self.is_admin_creation = kwargs.pop('is_admin_creation', False)
        super().__init__(*args, **kwargs)
        
        self.fields["username"].widget.attrs.update({
            "class": "form-input",
            "placeholder": "Nombre de usuario"
        })
        self.fields["password1"].widget.attrs.update({
            "class": "form-input",
            "placeholder": "Contraseña segura",
            "autocomplete": "new-password"
        })
        self.fields["password2"].widget.attrs.update({
            "class": "form-input",
            "placeholder": "Confirme su contraseña",
            "autocomplete": "new-password"
        })
        
        # Configurar el campo de rol según el contexto
        if self.is_admin_creation:
            # Admin puede seleccionar rol y el usuario se activa inmediatamente
            self.fields["rol"].required = True
            self.fields["rol"].help_text = "Seleccione el rol que tendrá el usuario en el sistema"
        else:
            # Auto-registro: ocultar campo de rol
            self.fields.pop('rol', None)
        
        # Mejorar mensajes de ayuda
        self.fields["username"].help_text = "Requerido. 150 caracteres o menos. Solo letras, dígitos y @/./+/-/_"
        self.fields["password1"].help_text = "Su contraseña debe tener al menos 8 caracteres."
        self.fields["password2"].help_text = "Ingrese la misma contraseña para verificación."
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        
        if self.is_admin_creation:
            # Usuario creado por admin: activo inmediatamente con rol asignado
            user.is_active = True
            user.rol = self.cleaned_data.get("rol", "")
        else:
            # Auto-registro: inactivo hasta que admin lo active y asigne rol
            user.is_active = False
            user.rol = ""  # Sin rol hasta que admin lo asigne
            
        if commit:
            user.save()
        return user
