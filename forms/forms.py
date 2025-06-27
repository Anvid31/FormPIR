from django import forms
from .models import Formulario, FormularioItem

class FormularioForm(forms.ModelForm):
    class Meta:
        model = Formulario
        fields = ['conductor', 'supervisor', 'fecha', 'archivo_cad']
        widgets = {
            'fecha': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'archivo_cad': forms.TextInput(attrs={'placeholder': 'nombre_archivo.dwg'})
        }

class FormularioItemForm(forms.ModelForm):
    class Meta:
        model = FormularioItem
        fields = ['bid', 'card', 'uc', 'attribute', 'material', 'foto_path']
        widgets = {
            'foto_path': forms.TextInput(attrs={'placeholder': 'ruta/foto.jpg'})
        }
