from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Muestra información detallada del usuario admin en Oracle'

    def handle(self, *args, **options):
        try:
            with connection.cursor() as cursor:
                # Consultar información del usuario admin
                cursor.execute("""
                    SELECT 
                        username,
                        email,
                        first_name,
                        last_name,
                        is_superuser,
                        is_staff,
                        is_active,
                        rol,
                        date_joined,
                        last_login
                    FROM FORMS_CUSTOMUSER 
                    WHERE username = 'admin'
                """)
                
                admin_data = cursor.fetchone()
                
                if admin_data:
                    self.stdout.write(self.style.SUCCESS('INFORMACIÓN DEL USUARIO ADMIN:'))
                    self.stdout.write(f'Tabla: FORMS_CUSTOMUSER')
                    self.stdout.write(f'Username: {admin_data[0]}')
                    self.stdout.write(f'Email: {admin_data[1]}')
                    self.stdout.write(f'Nombre: {admin_data[2]}')
                    self.stdout.write(f'Apellido: {admin_data[3]}')
                    self.stdout.write(f'Es Superusuario: {bool(admin_data[4])}')
                    self.stdout.write(f'Es Staff: {bool(admin_data[5])}')
                    self.stdout.write(f'Está Activo: {bool(admin_data[6])}')
                    self.stdout.write(f'Rol: {admin_data[7]}')
                    self.stdout.write(f'Fecha de Creación: {admin_data[8]}')
                    self.stdout.write(f'Último Login: {admin_data[9]}')
                else:
                    self.stdout.write(self.style.ERROR('Usuario admin no encontrado'))
                
                # Mostrar estructura de la tabla
                self.stdout.write(self.style.SUCCESS('\nESTRUCTURA DE LA TABLA FORMS_CUSTOMUSER:'))
                cursor.execute("""
                    SELECT column_name, data_type, data_length, nullable
                    FROM user_tab_columns 
                    WHERE table_name = 'FORMS_CUSTOMUSER'
                    ORDER BY column_id
                """)
                
                columns = cursor.fetchall()
                for col in columns:
                    nullable = "NULL" if col[3] == 'Y' else "NOT NULL"
                    self.stdout.write(f'  {col[0]}: {col[1]}({col[2]}) {nullable}')
                
                # Contar total de usuarios
                cursor.execute("SELECT COUNT(*) FROM FORMS_CUSTOMUSER")
                total_users = cursor.fetchone()[0]
                self.stdout.write(self.style.SUCCESS(f'\nTotal de usuarios en el sistema: {total_users}'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error consultando información: {e}'))
