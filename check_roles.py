#!/usr/bin/env python
import os
import django

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dess.settings')
django.setup()

from forms.models import CustomUser

print("Usuarios actuales y sus roles:")
for user in CustomUser.objects.all():
    rol_display = dict(CustomUser.ROLE_CHOICES).get(user.rol, 'Rol desconocido')
    print(f"- {user.username}: rol='{user.rol}' ({rol_display})")
