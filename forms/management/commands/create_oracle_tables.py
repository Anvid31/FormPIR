"""
Comando para crear las tablas de Oracle necesarias para el formulario de postes
"""
from django.core.management.base import BaseCommand
from django.db import connection
from decouple import config
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Crea las tablas de Oracle necesarias para el formulario de postes'

    def add_arguments(self, parser):
        parser.add_argument(
            '--drop',
            action='store_true',
            help='Elimina las tablas existentes antes de crearlas',
        )

    def handle(self, *args, **options):
        drop_tables = options['drop']
        
        try:
            with connection.cursor() as cursor:
                # Tablas a crear
                tables_sql = [
                    # Tabla principal del formulario
                    """
                    CREATE TABLE AC_FORMULARIO_GLOBAL_PIR (
                        AC_ID_PIR NUMBER PRIMARY KEY,
                        AC_TRABAJO_PIR VARCHAR2(100),
                        AC_MUNICIPIO_PIR VARCHAR2(100),
                        AC_NUMERO_X_PIR NUMBER,
                        AC_REGIONAL_PIR VARCHAR2(100),
                        AC_DIRECCION_PIR VARCHAR2(200),
                        AC_NUMERO_Y_PIR NUMBER,
                        AC_ALIMENTADOR_PIR VARCHAR2(100),
                        AC_BARRIO_VEREDA_PIR VARCHAR2(100),
                        AC_NUMERO_Z_PIR NUMBER,
                        AC_NIVEL_TENSION_PIR VARCHAR2(50),
                        AC_CIRCUITO_PIR VARCHAR2(100),
                        AC_CREATED_AT_PIR DATE DEFAULT SYSDATE,
                        AC_UPDATED_AT_PIR DATE DEFAULT SYSDATE
                    )
                    """,
                    
                    # Tabla de estructura nueva (postes)
                    """
                    CREATE TABLE AC_ESTRUCTURA_NUEVA_PIR (
                        AC_ID_PIR NUMBER PRIMARY KEY,
                        AC_FORMULARIO_ID_PIR NUMBER,
                        AC_COD_EST_PIR VARCHAR2(50),
                        AC_APOYO_PIR VARCHAR2(50),
                        AC_MATERIAL_PIR VARCHAR2(50),
                        AC_ALTURA_PIR NUMBER(5,2),
                        AC_TIPO_RED_PIR VARCHAR2(50),
                        AC_DISPOSICION_PIR VARCHAR2(50),
                        AC_KGF_PIR NUMBER(10,2),
                        AC_POBLACION_PIR VARCHAR2(50),
                        AC_CREATED_AT_PIR DATE DEFAULT SYSDATE,
                        AC_UPDATED_AT_PIR DATE DEFAULT SYSDATE,
                        CONSTRAINT FK_EST_NUEVA_FORM FOREIGN KEY (AC_FORMULARIO_ID_PIR) 
                        REFERENCES AC_FORMULARIO_GLOBAL_PIR(AC_ID_PIR)
                    )
                    """,
                    
                    # Tabla de estructura retirada
                    """
                    CREATE TABLE AC_ESTRUCTURA_RETIRADA_PIR (
                        AC_ID_PIR NUMBER PRIMARY KEY,
                        AC_FORMULARIO_ID_PIR NUMBER,
                        AC_COD_EST_PIR VARCHAR2(50),
                        AC_APOYO_PIR VARCHAR2(50),
                        AC_MATERIAL_PIR VARCHAR2(50),
                        AC_ALTURA_PIR NUMBER(5,2),
                        AC_TIPO_RED_PIR VARCHAR2(50),
                        AC_PUNTO_PIR VARCHAR2(100),
                        AC_CREATED_AT_PIR DATE DEFAULT SYSDATE,
                        AC_UPDATED_AT_PIR DATE DEFAULT SYSDATE,
                        CONSTRAINT FK_EST_RETIRADA_FORM FOREIGN KEY (AC_FORMULARIO_ID_PIR) 
                        REFERENCES AC_FORMULARIO_GLOBAL_PIR(AC_ID_PIR)
                    )
                    """,
                    
                    # Tabla de información del proyecto
                    """
                    CREATE TABLE AC_PROYECTO_INFO_PIR (
                        AC_ID_PIR NUMBER PRIMARY KEY,
                        AC_FORMULARIO_ID_PIR NUMBER,
                        AC_NOMBRE_PIR VARCHAR2(200),
                        AC_OT_MANO_OBRA_PIR VARCHAR2(100),
                        AC_OT_MATERIA_PIR VARCHAR2(100),
                        AC_CONTRATO_PIR VARCHAR2(100),
                        AC_PRO_TERC_PIR VARCHAR2(100),
                        AC_CREATED_AT_PIR DATE DEFAULT SYSDATE,
                        AC_UPDATED_AT_PIR DATE DEFAULT SYSDATE,
                        CONSTRAINT FK_PROYECTO_FORM FOREIGN KEY (AC_FORMULARIO_ID_PIR) 
                        REFERENCES AC_FORMULARIO_GLOBAL_PIR(AC_ID_PIR)
                    )
                    """
                ]
                
                # Secuencias para los IDs
                sequences_sql = [
                    "CREATE SEQUENCE AC_FORM_SEQ_PIR START WITH 1 INCREMENT BY 1",
                    "CREATE SEQUENCE AC_EST_NUEVA_SEQ_PIR START WITH 1 INCREMENT BY 1",
                    "CREATE SEQUENCE AC_EST_RET_SEQ_PIR START WITH 1 INCREMENT BY 1",
                    "CREATE SEQUENCE AC_PROY_SEQ_PIR START WITH 1 INCREMENT BY 1"
                ]
                
                # Triggers para auto-incremento
                triggers_sql = [
                    """
                    CREATE OR REPLACE TRIGGER AC_FORM_TRG_PIR
                    BEFORE INSERT ON AC_FORMULARIO_GLOBAL_PIR
                    FOR EACH ROW
                    BEGIN
                        SELECT AC_FORM_SEQ_PIR.NEXTVAL INTO :NEW.AC_ID_PIR FROM DUAL;
                    END;
                    """,
                    
                    """
                    CREATE OR REPLACE TRIGGER AC_EST_NUEVA_TRG_PIR
                    BEFORE INSERT ON AC_ESTRUCTURA_NUEVA_PIR
                    FOR EACH ROW
                    BEGIN
                        SELECT AC_EST_NUEVA_SEQ_PIR.NEXTVAL INTO :NEW.AC_ID_PIR FROM DUAL;
                    END;
                    """,
                    
                    """
                    CREATE OR REPLACE TRIGGER AC_EST_RET_TRG_PIR
                    BEFORE INSERT ON AC_ESTRUCTURA_RETIRADA_PIR
                    FOR EACH ROW
                    BEGIN
                        SELECT AC_EST_RET_SEQ_PIR.NEXTVAL INTO :NEW.AC_ID_PIR FROM DUAL;
                    END;
                    """,
                    
                    """
                    CREATE OR REPLACE TRIGGER AC_PROY_TRG_PIR
                    BEFORE INSERT ON AC_PROYECTO_INFO_PIR
                    FOR EACH ROW
                    BEGIN
                        SELECT AC_PROY_SEQ_PIR.NEXTVAL INTO :NEW.AC_ID_PIR FROM DUAL;
                    END;
                    """
                ]
                
                # Si se solicita, eliminar tablas existentes
                if drop_tables:
                    self.stdout.write('Eliminando tablas existentes...')
                    drop_tables_sql = [
                        "DROP TABLE AC_PROYECTO_INFO_PIR",
                        "DROP TABLE AC_ESTRUCTURA_RETIRADA_PIR", 
                        "DROP TABLE AC_ESTRUCTURA_NUEVA_PIR",
                        "DROP TABLE AC_FORMULARIO_GLOBAL_PIR",
                        "DROP SEQUENCE AC_FORM_SEQ_PIR",
                        "DROP SEQUENCE AC_EST_NUEVA_SEQ_PIR",
                        "DROP SEQUENCE AC_EST_RET_SEQ_PIR",
                        "DROP SEQUENCE AC_PROY_SEQ_PIR"
                    ]
                    
                    for sql in drop_tables_sql:
                        try:
                            cursor.execute(sql)
                            self.stdout.write(f'✓ Eliminado: {sql.split()[2]}')
                        except Exception as e:
                            self.stdout.write(f'⚠ No se pudo eliminar: {str(e)}')
                
                # Crear tablas
                self.stdout.write('Creando tablas...')
                for i, sql in enumerate(tables_sql, 1):
                    try:
                        cursor.execute(sql)
                        table_name = sql.split()[2]
                        self.stdout.write(f'✓ Tabla creada: {table_name}')
                    except Exception as e:
                        self.stdout.write(f'✗ Error creando tabla {i}: {str(e)}')
                        continue
                
                # Crear secuencias
                self.stdout.write('Creando secuencias...')
                for sql in sequences_sql:
                    try:
                        cursor.execute(sql)
                        seq_name = sql.split()[2]
                        self.stdout.write(f'✓ Secuencia creada: {seq_name}')
                    except Exception as e:
                        self.stdout.write(f'⚠ Error creando secuencia: {str(e)}')
                
                # Crear triggers
                self.stdout.write('Creando triggers...')
                for sql in triggers_sql:
                    try:
                        cursor.execute(sql)
                        trigger_name = sql.split()[4]
                        self.stdout.write(f'✓ Trigger creado: {trigger_name}')
                    except Exception as e:
                        self.stdout.write(f'⚠ Error creando trigger: {str(e)}')
                
                self.stdout.write(self.style.SUCCESS('✓ Tablas de Oracle creadas exitosamente'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error general: {str(e)}'))
            raise
