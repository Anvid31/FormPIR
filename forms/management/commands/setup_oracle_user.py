"""
Comando para configurar el usuario de Oracle y sus permisos
"""
from django.core.management.base import BaseCommand, CommandError
import oracledb
from decouple import config
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Configura el usuario de Oracle y sus permisos'

    def handle(self, *args, **options):
        connection = None
        cursor = None
        try:
            # Conectar directamente usando oracledb
            dsn = f"{config('DB_HOST')}:{config('DB_PORT')}/{config('DB_SERVICE_NAME')}"
            self.stdout.write(f'Conectando a Oracle como {config("DB_USER")}...')
            connection = oracledb.connect(
                user=config('DB_USER'),
                password=config('DB_PASSWORD'),
                dsn=dsn
            )
            cursor = connection.cursor()
            self.stdout.write('✓ Conexión establecida')

            # Verificar si el usuario existe
            cursor.execute("""
                SELECT COUNT(*) 
                FROM DBA_USERS 
                WHERE USERNAME = config('ORACLE_USER', default='FORM_PIR')
            """)
            user_exists = cursor.fetchone()[0] > 0

            if not user_exists:
                self.stdout.write('Creando usuario {config("ORACLE_USER", default="FORM_PIR")}...')
                # Crear el usuario si no existe usando el prefijo C## para usuarios comunes
                cursor.execute("""
                    CREATE USER {config('ORACLE_USER', default='FORM_PIR')} IDENTIFIED BY {config('ORACLE_PASSWORD', default='dess123')}
                    DEFAULT TABLESPACE USERS
                    TEMPORARY TABLESPACE TEMP
                    QUOTA UNLIMITED ON USERS
                """)
                self.stdout.write('  ✓ Usuario C##DESS_USER creado')

            # Otorgar los permisos necesarios
            self.stdout.write('Otorgando permisos...')
            permissions = [
                "CREATE SESSION",
                "CREATE TABLE",
                "CREATE SEQUENCE",
                "CREATE PROCEDURE",
                "CREATE TRIGGER",
                "CREATE ANY INDEX",
                "CREATE ANY TRIGGER",
                "CREATE ANY PROCEDURE",
                "ALTER ANY TABLE",
                "ALTER ANY SEQUENCE",
                "ALTER ANY TRIGGER",
                "ALTER ANY PROCEDURE",
                "DROP ANY TABLE",
                "DROP ANY SEQUENCE",
                "DROP ANY TRIGGER",
                "DROP ANY PROCEDURE",
                "SELECT ANY TABLE",
                "INSERT ANY TABLE",
                "UPDATE ANY TABLE",
                "DELETE ANY TABLE",
            ]

            for permission in permissions:
                try:
                    cursor.execute(f"GRANT {permission} TO {config('ORACLE_USER', default='FORM_PIR')}")
                    self.stdout.write(f'  ✓ Permiso {permission} otorgado')
                except oracledb.DatabaseError as e:
                    self.stdout.write(f'  ❌ Error al otorgar {permission}: {str(e)}')

            connection.commit()
            self.stdout.write(self.style.SUCCESS('✓ Configuración de usuario completada'))

        except oracledb.DatabaseError as e:
            self.stdout.write(f'Error de base de datos Oracle: {str(e)}')
            if hasattr(e, 'context'):
                self.stdout.write(f'Help: {e.context.get("help")}')
            raise CommandError(str(e))
        except Exception as e:
            self.stdout.write(f'Error inesperado: {str(e)}')
            raise CommandError(str(e))
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
