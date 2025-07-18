from django.core.management.base import BaseCommand
from django.db import connection
from forms.models import CustomUser

class Command(BaseCommand):
    help = 'Verifica y muestra los usuarios en la base de datos'

    def handle(self, *args, **options):
        # Verificar usuarios en la tabla FORMS_CUSTOMUSER
        try:
            users = CustomUser.objects.all()
            self.stdout.write(self.style.SUCCESS('Usuarios en FORMS_CUSTOMUSER:'))
            for user in users:
                self.stdout.write(f'  - {user.username} ({user.email}) - Rol: {user.rol} - Admin: {user.is_superuser}')
            
            if not users.exists():
                self.stdout.write(self.style.WARNING('No hay usuarios en FORMS_CUSTOMUSER'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error accediendo a CustomUser: {e}'))
        
        # Verificar con consulta directa
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT username, email, is_superuser, rol FROM FORMS_CUSTOMUSER")
                rows = cursor.fetchall()
                
                self.stdout.write(self.style.SUCCESS('\nConsulta directa a FORMS_CUSTOMUSER:'))
                for row in rows:
                    self.stdout.write(f'  - {row[0]} ({row[1]}) - Admin: {row[2]} - Rol: {row[3]}')
                    
                if not rows:
                    self.stdout.write(self.style.WARNING('No hay datos en FORMS_CUSTOMUSER'))
                    
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error en consulta directa: {e}'))
