from django.core.management.base import BaseCommand
from forms.models import CustomUser

class Command(BaseCommand):
    help = 'Actualiza el rol del usuario admin a administrador'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Nombre de usuario a actualizar')
        parser.add_argument('--rol', type=str, default='admin', 
                          choices=['admin', 'contratista', 'ejecutor', 'gestion', 'planeacion'],
                          help='Nuevo rol para el usuario')

    def handle(self, *args, **options):
        username = options['username']
        nuevo_rol = options['rol']
        
        try:
            user = CustomUser.objects.get(username=username)
            rol_anterior = user.rol
            user.rol = nuevo_rol
            user.save()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Usuario {username} actualizado exitosamente:\n'
                    f'  Rol anterior: {rol_anterior}\n'
                    f'  Rol nuevo: {nuevo_rol}'
                )
            )
            
        except CustomUser.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'Usuario {username} no encontrado')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error actualizando usuario: {e}')
            )
