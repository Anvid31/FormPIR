"""
Comando simplificado para probar la conexión a Oracle
"""
from django.core.management.base import BaseCommand
import oracledb
from decouple import config

class Command(BaseCommand):
    help = 'Prueba la conexión a Oracle'

    def handle(self, *args, **options):
        try:
            # Configuración desde .env
            user = config('ORACLE_USER', default='C##DESS_USER')
            password = config('ORACLE_PASSWORD', default='dess123')
            host = config('DB_HOST', default='localhost')
            port = config('DB_PORT', default='1521')
            service = config('DB_SERVICE_NAME', default='XE')
            
            dsn = f"{host}:{port}/{service}"
            
            self.stdout.write(f'Intentando conectar a Oracle...')
            self.stdout.write(f'Usuario: {user}')
            self.stdout.write(f'DSN: {dsn}')
            
            # Probar conexión
            with oracledb.connect(user=user, password=password, dsn=dsn) as connection:
                with connection.cursor() as cursor:
                    cursor.execute("SELECT 'Conexión exitosa' FROM DUAL")
                    result = cursor.fetchone()
                    self.stdout.write(self.style.SUCCESS(f'✓ Oracle: {result[0]}'))
                    
                    # Verificar si existen nuestras tablas
                    cursor.execute("""
                        SELECT table_name 
                        FROM user_tables 
                        WHERE table_name LIKE 'AC_%PIR'
                        ORDER BY table_name
                    """)
                    tables = cursor.fetchall()
                    
                    if tables:
                        self.stdout.write('✓ Tablas encontradas:')
                        for table in tables:
                            self.stdout.write(f'  - {table[0]}')
                    else:
                        self.stdout.write(self.style.WARNING('⚠ No se encontraron tablas AC_*_PIR'))
                        self.stdout.write('Ejecuta: python manage.py create_oracle_tables')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Error conectando a Oracle: {str(e)}'))
            self.stdout.write('Verifica que:')
            self.stdout.write('1. Oracle esté ejecutándose')
            self.stdout.write('2. El usuario C##DESS_USER exista')
            self.stdout.write('3. Las credenciales en .env sean correctas')
