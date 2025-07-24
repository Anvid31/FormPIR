#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dess.settings')
django.setup()

from django.db import connection

def check_table_structure():
    """Verificar la estructura de la tabla FORMS_CUSTOMUSER"""
    cursor = connection.cursor()
    
    try:
        # Verificar si la tabla existe
        cursor.execute("""
            SELECT table_name 
            FROM all_tables 
            WHERE table_name IN ('FORMS_CUSTOMUSER', 'forms_customuser')
        """)
        tables = cursor.fetchall()
        print(f"Tablas encontradas: {tables}")
        
        # Buscar la tabla correcta
        table_name = None
        for table in tables:
            if table[0].upper() in ['FORMS_CUSTOMUSER', 'forms_customuser'.upper()]:
                table_name = table[0]
                break
        
        if not table_name:
            print("No se encontró la tabla FORMS_CUSTOMUSER")
            return
        
        print(f"\nUsando tabla: {table_name}")
        
        # Obtener columnas
        cursor.execute(f"""
            SELECT column_name, data_type, nullable, data_default
            FROM all_tab_columns 
            WHERE table_name = '{table_name}' 
            ORDER BY column_id
        """)
        
        columns = cursor.fetchall()
        print(f"\nColumnas actuales en {table_name}:")
        for col in columns:
            print(f"- {col[0]}: {col[1]} (Nullable: {col[2]}, Default: {col[3]})")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()

if __name__ == "__main__":
    check_table_structure()
