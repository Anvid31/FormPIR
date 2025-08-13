#!/usr/bin/env python
"""
Script para limpiar y sincronizar migraciones problemáticas
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dess.settings')
django.setup()

from django.db import connection
from django.apps import apps

def fix_migrations():
    cursor = connection.cursor()
    
    print("🔍 DIAGNÓSTICO COMPLETO Y REPARACIÓN")
    print("=" * 60)
    
    # 1. Ver todas las migraciones registradas
    print("📋 TODAS las migraciones registradas:")
    cursor.execute("SELECT app, name FROM django_migrations ORDER BY app, id")
    all_migrations = cursor.fetchall()
    for app, name in all_migrations:
        print(f"  - {app}.{name}")
    
    # 2. LIMPIAR COMPLETAMENTE todas las migraciones
    print(f"\n🧹 LIMPIEZA COMPLETA DE MIGRACIONES:")
    cursor.execute("DELETE FROM django_migrations")
    deleted_count = cursor.rowcount
    print(f"  ✅ Eliminadas {deleted_count} migraciones TODAS las apps")
    
    # 3. Confirmar cambios
    connection.commit()
    print("  ✅ Cambios confirmados en la base de datos")
    
    # 4. Verificar limpieza
    cursor.execute("SELECT COUNT(*) FROM django_migrations")
    remaining = cursor.fetchone()[0]
    print(f"  ✅ Migraciones restantes: {remaining}")
    
    print(f"\n✅ RESET COMPLETO TERMINADO")
    print("=" * 60)
    print("Ahora ejecuta EXACTAMENTE en este orden:")
    print("1. python manage.py migrate --fake-initial")
    print("2. python manage.py showmigrations (verificar)")
    print("3. python manage.py migrate (si hay pendientes)")
    print("4. python manage.py runserver (probar)")
    print("=" * 60)

if __name__ == "__main__":
    try:
        fix_migrations()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
