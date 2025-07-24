#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dess.settings')
django.setup()

from django.db import connection

# SQL para crear la tabla de iteraciones
sql_create_table = """
CREATE TABLE "formulario_iteraciones" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "session_key" VARCHAR(40) NOT NULL,
    "formulario_id" VARCHAR(50) NULL,
    "usuario_id" NUMBER(19) NULL,
    "seccion" NVARCHAR2(20) NOT NULL,
    "estado" NVARCHAR2(10) DEFAULT 'temporal' NOT NULL,
    "numero_iteracion" NUMBER(11) DEFAULT 1 NOT NULL,
    "nombre_proyecto" NVARCHAR2(200) NOT NULL,
    "banco_proyecto" NVARCHAR2(100) NULL,
    "contrato" NVARCHAR2(200) NULL,
    "municipio" NVARCHAR2(100) NULL,
    "departamento" NVARCHAR2(100) NULL,
    "regional" NVARCHAR2(100) NULL,
    "latitud_inicial" NUMBER(12,8) NULL,
    "longitud_inicial" NUMBER(12,8) NULL,
    "latitud_final" NUMBER(12,8) NULL,
    "longitud_final" NUMBER(12,8) NULL,
    "direccion" NVARCHAR2(200) NULL,
    "cantidad" NUMBER(11) DEFAULT 1 NOT NULL,
    "datos_especificos" CLOB DEFAULT '{}' NOT NULL,
    "fecha_creacion" TIMESTAMP NOT NULL,
    "fecha_actualizacion" TIMESTAMP NOT NULL,
    CONSTRAINT "formulario_iteraciones_pk" PRIMARY KEY ("id"),
    CONSTRAINT "formulario_iteraciones_fk_usuario" FOREIGN KEY ("usuario_id") REFERENCES "FORMS_CUSTOMUSER" ("id")
)
"""

sql_create_sequence = """
CREATE SEQUENCE "formulario_iteraciones_seq"
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE
"""

sql_create_trigger = """
CREATE OR REPLACE TRIGGER "formulario_iteraciones_trig"
    BEFORE INSERT ON "formulario_iteraciones"
    FOR EACH ROW
BEGIN
    IF :NEW."id" IS NULL THEN
        SELECT "formulario_iteraciones_seq".NEXTVAL INTO :NEW."id" FROM dual;
    END IF;
END;
"""

sql_create_unique_index = """
CREATE UNIQUE INDEX "formulario_iter_unique" 
ON "formulario_iteraciones" ("session_key", "seccion", "numero_iteracion", "estado")
"""

sql_create_indices = """
CREATE INDEX "formulario_iter_session_idx" ON "formulario_iteraciones" ("session_key")
"""

try:
    with connection.cursor() as cursor:
        print("Verificando si la tabla ya existe...")
        cursor.execute("SELECT count(*) FROM user_tables WHERE table_name = 'formulario_iteraciones'")
        exists = cursor.fetchone()[0] > 0
        
        if exists:
            print("ℹ️  Tabla formulario_iteraciones ya existe")
        else:
            print("Creando tabla formulario_iteraciones...")
            cursor.execute(sql_create_table)
            
            print("Creando secuencia...")
            cursor.execute(sql_create_sequence)
            
            print("Creando trigger...")
            cursor.execute(sql_create_trigger)
            
            print("Creando índices...")
            cursor.execute(sql_create_unique_index)
            cursor.execute(sql_create_indices)
        
    print("✅ Tabla formulario_iteraciones lista para usar!")
    
    # Verificar que la tabla existe
    with connection.cursor() as cursor:
        cursor.execute("SELECT count(*) FROM user_tables WHERE table_name = 'formulario_iteraciones'")
        result = cursor.fetchone()[0] > 0
        if result:
            print("✅ Verificación: Tabla existe en la base de datos")
        else:
            print("❌ Error: Tabla no se pudo crear")

except Exception as e:
    print(f"❌ Error: {e}")
