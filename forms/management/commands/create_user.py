from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from forms.models import CustomUser

class Command(BaseCommand):
    help = 'Crea un nuevo usuario en el sistema'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Nombre de usuario')
        parser.add_argument('email', type=str, help='Email del usuario')
        parser.add_argument('--password', type=str, default='123456', help='Contraseña (default: 123456)')
        parser.add_argument('--rol', type=str, default='contratista',
                          choices=['admin', 'contratista', 'ejecutor', 'gestion', 'planeacion'],
                          help='Rol del usuario (default: contratista)')
        parser.add_argument('--superuser', action='store_true', help='Crear como superusuario')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        rol = options['rol']
        is_superuser = options['superuser']
        
        # Verificar si el usuario ya existe
        if CustomUser.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.ERROR(f'El usuario {username} ya existe')
            )
            return
        
        try:
            user = CustomUser.objects.create(
                username=username,
                email=email,
                password=make_password(password),
                rol=rol,
                is_superuser=is_superuser,
                is_staff=is_superuser or rol == 'admin',
                is_active=True
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Usuario creado exitosamente:\n'
                    f'  Username: {username}\n'
                    f'  Email: {email}\n'
                    f'  Rol: {rol}\n'
                    f'  Superusuario: {is_superuser}\n'
                    f'  Contraseña: {password}'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creando usuario: {e}')
            )
