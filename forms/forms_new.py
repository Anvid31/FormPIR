from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser, FormularioGlobal

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(
        required=True, 
        widget=forms.EmailInput(attrs={
            "class": "form-control",
            "placeholder": "correo@ejemplo.com"
        })
    )
    first_name = forms.CharField(
        max_length=30, 
        required=True, 
        widget=forms.TextInput(attrs={
            "class": "form-control",
            "placeholder": "Ingrese sus nombres"
        })
    )
    last_name = forms.CharField(
        max_length=30, 
        required=True, 
        widget=forms.TextInput(attrs={
            "class": "form-control",
            "placeholder": "Ingrese sus apellidos"
        })
    )

    class Meta:
        model = CustomUser
        fields = ("username", "email", "first_name", "last_name", "password1", "password2")
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Nombre de usuario"
        })
        self.fields["password1"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Contraseña segura"
        })
        self.fields["password2"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Confirme su contraseña"
        })
        
        # Mejorar mensajes de ayuda
        self.fields["username"].help_text = "Requerido. 150 caracteres o menos. Solo letras, dígitos y @/./+/-/_"
        self.fields["password1"].help_text = "Su contraseña debe tener al menos 8 caracteres."
        self.fields["password2"].help_text = "Ingrese la misma contraseña para verificación."
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        user.is_active = False
        user.rol = "contratista"
        if commit:
            user.save()
        return user
