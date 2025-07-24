#!/usr/bin/env python
import os
import django

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dess.settings')
django.setup()

from django.db import connection
from forms.models import CustomUser

print("Verificando tablas en base de datos...")
print(f"Django busca la tabla: {CustomUser._meta.db_table}")

cursor = connection.cursor()

# Verificar diferentes variaciones del nombre
table_variations = [
    'customuser',
    'CUSTOMUSER', 
    'forms_customuser',
    'FORMS_CUSTOMUSER',
    '"customuser"',
    '"CUSTOMUSER"',
    '"forms_customuser"',
    '"FORMS_CUSTOMUSER"'
]

for table_name in table_variations:
    try:
        cursor.execute(f'SELECT COUNT(*) FROM {table_name}')
        result = cursor.fetchone()
        print(f'✓ La tabla {table_name} existe y tiene {result[0]} registros')
        break
    except Exception as e:
        print(f'✗ Error accediendo a {table_name}: {str(e)[:50]}...')

# También verificar qué tablas existen realmente
print("\nListando todas las tablas del usuario actual:")
try:
    cursor.execute("SELECT table_name FROM user_tables ORDER BY table_name")
    tables = cursor.fetchall()
    for table in tables:
        print(f"  - {table[0]}")
except Exception as e:
    print(f"Error listando tablas: {e}")
