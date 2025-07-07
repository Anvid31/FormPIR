"""
Comando personalizado para inicializar las tablas de Oracle con la estructura requerida.
"""
from django.core.management.base import BaseCommand, CommandError
from django.db import connection
from decouple import config
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Inicializa las tablas de Oracle con la estructura requerida'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Forzar la recreación de las tablas (DROP si existen)',
        )

    def handle(self, *args, **options):
        force = options['force']
        schema_name = config('ORACLE_SCHEMA', default='C##DESS_USER')
        
        # Definición de las tablas
        tables_sql = {
            f'{schema_name}.AC_FORMULARIO_GLOBAL_PIR': f"""
            CREATE TABLE {schema_name}.AC_FORMULARIO_GLOBAL_PIR (
                AC_ID_PIR NUMBER PRIMARY KEY,
                AC_TRABAJO_PIR VARCHAR2(100),
                AC_MUNICIPIO_PIR VARCHAR2(100),
                AC_PROYECTO_PIR VARCHAR2(100),
                AC_SOLICITANTE_PIR VARCHAR2(100),
                AC_CORREO_PIR VARCHAR2(100),
                AC_FECHA_PIR DATE,
                AC_ARCHIVO_CAD_PIR CLOB,
                AC_ESTADO_PIR VARCHAR2(20) DEFAULT 'PENDIENTE'
            )""",
            f'{schema_name}.AC_ESTRUCTURA_NUEVA_PIR': f"""
            CREATE TABLE {schema_name}.AC_ESTRUCTURA_NUEVA_PIR (
                AC_ID_PIR NUMBER PRIMARY KEY,
                AC_FORMULARIO_ID_PIR NUMBER,
                AC_TIPO_EST_PIR VARCHAR2(50),
                AC_ALTURA_PIR NUMBER,
                AC_MATERIAL_PIR VARCHAR2(50),
                AC_TENSION_PIR NUMBER,
                AC_CONDUCTOR_PIR VARCHAR2(50),
                AC_COORD_X_PIR NUMBER(10,6),
                AC_COORD_Y_PIR NUMBER(10,6),
                CONSTRAINT FK_FORM_EST_NUEVA FOREIGN KEY (AC_FORMULARIO_ID_PIR)
                    REFERENCES {schema_name}.AC_FORMULARIO_GLOBAL_PIR(AC_ID_PIR)
            )""",
            f'{schema_name}.AC_ESTRUCTURA_RETIRADA_PIR': f"""
            CREATE TABLE {schema_name}.AC_ESTRUCTURA_RETIRADA_PIR (
                AC_ID_PIR NUMBER PRIMARY KEY,
                AC_FORMULARIO_ID_PIR NUMBER,
                AC_TIPO_EST_PIR VARCHAR2(50),
                AC_ALTURA_PIR NUMBER,
                AC_MATERIAL_PIR VARCHAR2(50),
                AC_TENSION_PIR NUMBER,
                AC_CONDUCTOR_PIR VARCHAR2(50),
                AC_COORD_X_PIR NUMBER(10,6),
                AC_COORD_Y_PIR NUMBER(10,6),
                CONSTRAINT FK_FORM_EST_RET FOREIGN KEY (AC_FORMULARIO_ID_PIR)
                    REFERENCES {schema_name}.AC_FORMULARIO_GLOBAL_PIR(AC_ID_PIR)
            )""",
            f'{schema_name}.AC_PROYECTO_INFO_PIR': f"""
            CREATE TABLE {schema_name}.AC_PROYECTO_INFO_PIR (
                AC_ID_PIR NUMBER PRIMARY KEY,
                AC_FORMULARIO_ID_PIR NUMBER,
                AC_TIPO_PIR VARCHAR2(50),
                AC_DESCRIPCION_PIR CLOB,
                AC_FECHA_INI_PIR DATE,
                AC_FECHA_FIN_PIR DATE,
                CONSTRAINT FK_FORM_PROY FOREIGN KEY (AC_FORMULARIO_ID_PIR)
                    REFERENCES {schema_name}.AC_FORMULARIO_GLOBAL_PIR(AC_ID_PIR)
            )"""
        }

        # Definición de las secuencias
        sequences_sql = {
            f'{schema_name}.AC_FORM_SEQ_PIR': f"CREATE SEQUENCE {schema_name}.AC_FORM_SEQ_PIR START WITH 1 INCREMENT BY 1",
            f'{schema_name}.AC_EST_NUEVA_SEQ_PIR': f"CREATE SEQUENCE {schema_name}.AC_EST_NUEVA_SEQ_PIR START WITH 1 INCREMENT BY 1",
            f'{schema_name}.AC_EST_RET_SEQ_PIR': f"CREATE SEQUENCE {schema_name}.AC_EST_RET_SEQ_PIR START WITH 1 INCREMENT BY 1",
            f'{schema_name}.AC_PROY_SEQ_PIR': f"CREATE SEQUENCE {schema_name}.AC_PROY_SEQ_PIR START WITH 1 INCREMENT BY 1"
        }

        # Definición de los triggers
        triggers_sql = {
            f'{schema_name}.TRG_FORM_ID': f"""
            CREATE OR REPLACE TRIGGER {schema_name}.TRG_FORM_ID
            BEFORE INSERT ON {schema_name}.AC_FORMULARIO_GLOBAL_PIR
            FOR EACH ROW
            BEGIN
                SELECT {schema_name}.AC_FORM_SEQ_PIR.NEXTVAL
                INTO :NEW.AC_ID_PIR
                FROM DUAL;
            END;
            """,
            f'{schema_name}.TRG_EST_NUEVA_ID': f"""
            CREATE OR REPLACE TRIGGER {schema_name}.TRG_EST_NUEVA_ID
            BEFORE INSERT ON {schema_name}.AC_ESTRUCTURA_NUEVA_PIR
            FOR EACH ROW
            BEGIN
                SELECT {schema_name}.AC_EST_NUEVA_SEQ_PIR.NEXTVAL
                INTO :NEW.AC_ID_PIR
                FROM DUAL;
            END;
            """,
            f'{schema_name}.TRG_EST_RET_ID': f"""
            CREATE OR REPLACE TRIGGER {schema_name}.TRG_EST_RET_ID
            BEFORE INSERT ON {schema_name}.AC_ESTRUCTURA_RETIRADA_PIR
            FOR EACH ROW
            BEGIN
                SELECT {schema_name}.AC_EST_RET_SEQ_PIR.NEXTVAL
                INTO :NEW.AC_ID_PIR
                FROM DUAL;
            END;
            """,
            f'{schema_name}.TRG_PROY_ID': f"""
            CREATE OR REPLACE TRIGGER {schema_name}.TRG_PROY_ID
            BEFORE INSERT ON {schema_name}.AC_PROYECTO_INFO_PIR
            FOR EACH ROW
            BEGIN
                SELECT {schema_name}.AC_PROY_SEQ_PIR.NEXTVAL
                INTO :NEW.AC_ID_PIR
                FROM DUAL;
            END;
            """
        }

        with connection.cursor() as cursor:
            try:
                self.stdout.write('Creando tablas...')

                # Si force es True, intentar eliminar las tablas existentes
                if force:
                    for table_name in reversed(list(tables_sql.keys())):
                        try:
                            cursor.execute(f"DROP TABLE {table_name} CASCADE CONSTRAINTS")
                            self.stdout.write(f'  ✓ Tabla {table_name} eliminada')
                        except Exception as e:
                            self.stdout.write(f'  ℹ Tabla {table_name} no existe o no se pudo eliminar')

                    for seq_name in sequences_sql.keys():
                        try:
                            cursor.execute(f"DROP SEQUENCE {seq_name}")
                            self.stdout.write(f'  ✓ Secuencia {seq_name} eliminada')
                        except Exception as e:
                            self.stdout.write(f'  ℹ Secuencia {seq_name} no existe o no se pudo eliminar')

                # Crear tablas
                for table_name, sql in tables_sql.items():
                    try:
                        cursor.execute(sql)
                        self.stdout.write(f'  ✓ Tabla {table_name} creada')
                    except Exception as e:
                        error_msg = str(e)
                        self.stdout.write(f'Error al crear tabla {table_name}: {error_msg}')
                        if hasattr(e, 'context'):
                            self.stdout.write(f'Help: {e.context.get("help")}')
                        raise CommandError(error_msg)

                # Crear secuencias
                for seq_name, sql in sequences_sql.items():
                    try:
                        cursor.execute(sql)
                        self.stdout.write(f'  ✓ Secuencia {seq_name} creada')
                    except Exception as e:
                        error_msg = str(e)
                        self.stdout.write(f'Error al crear secuencia {seq_name}: {error_msg}')
                        if hasattr(e, 'context'):
                            self.stdout.write(f'Help: {e.context.get("help")}')
                        raise CommandError(error_msg)

                # Crear triggers
                for trig_name, sql in triggers_sql.items():
                    try:
                        cursor.execute(sql)
                        self.stdout.write(f'  ✓ Trigger {trig_name} creado')
                    except Exception as e:
                        error_msg = str(e)
                        self.stdout.write(f'Error al crear trigger {trig_name}: {error_msg}')
                        if hasattr(e, 'context'):
                            self.stdout.write(f'Help: {e.context.get("help")}')
                        raise CommandError(error_msg)

                connection.commit()
                self.stdout.write(self.style.SUCCESS('✓ Base de datos inicializada con éxito'))

            except Exception as e:
                error_msg = str(e)
                self.stdout.write(f'Error durante la inicialización de la base de datos: {error_msg}')
                if hasattr(e, 'context'):
                    self.stdout.write(f'Help: {e.context.get("help")}')
                raise CommandError(error_msg)
