from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from forms.models import CustomUser

class Command(BaseCommand):
    help = 'Crea usuarios de prueba para todos los roles del sistema'

    def handle(self, *args, **options):
        # Definir usuarios por rol (sin admin porque ya existe)
        usuarios_rol = [
            {
                'username': 'contratista',
                'password': 'contratista123',
                'rol': 'contratista',
                'is_superuser': False,
                'is_staff': False
            },
            {
                'username': 'ejecutor',
                'password': 'ejecutor123',
                'rol': 'ejecutor',
                'is_superuser': False,
                'is_staff': False
            },
            {
                'username': 'gestion',
                'password': 'gestion123',
                'rol': 'gestion',
                'is_superuser': False,
                'is_staff': False
            },
            {
                'username': 'planeacion',
                'password': 'planeacion123',
                'rol': 'planeacion',
                'is_superuser': False,
                'is_staff': False
            }
        ]
        
        self.stdout.write(self.style.SUCCESS('CREANDO USUARIOS PARA CADA ROL...'))
        self.stdout.write('=' * 50)
        
        for usuario_data in usuarios_rol:
            username = usuario_data['username']
            
            # Verificar si ya existe
            if CustomUser.objects.filter(username=username).exists():
                # Actualizar usuario existente
                user = CustomUser.objects.get(username=username)
                user.password = make_password(usuario_data['password'])
                user.rol = usuario_data['rol']
                user.is_superuser = usuario_data['is_superuser']
                user.is_staff = usuario_data['is_staff']
                user.is_active = True
                user.save()
                
                self.stdout.write(
                    self.style.WARNING(f'ACTUALIZADO: {username}')
                )
            else:
                # Crear nuevo usuario
                user = CustomUser.objects.create(
                    username=username,
                    password=make_password(usuario_data['password']),
                    rol=usuario_data['rol'],
                    is_superuser=usuario_data['is_superuser'],
                    is_staff=usuario_data['is_staff'],
                    is_active=True
                )
                
                self.stdout.write(
                    self.style.SUCCESS(f'CREADO: {username}')
                )
            
            # Mostrar información básica
            self.stdout.write(f'   Usuario: {username}')
            self.stdout.write(f'   Password: {usuario_data["password"]}')
            self.stdout.write(f'   Rol: {usuario_data["rol"]}')
            self.stdout.write('')
        
        # Mostrar resumen
        total_users = CustomUser.objects.count()
        self.stdout.write(self.style.SUCCESS(f'TOTAL DE USUARIOS: {total_users}'))
        
        self.stdout.write(self.style.SUCCESS('\nCREDENCIALES:'))
        self.stdout.write('admin / admin123 (ya existía)')
        for usuario_data in usuarios_rol:
            self.stdout.write(f'{usuario_data["username"]} / {usuario_data["password"]}')
