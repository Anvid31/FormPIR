from django.core.management.base import BaseCommand
from forms.models import CustomUser

class Command(BaseCommand):
    help = 'Muestra usuarios pendientes de activación por el administrador'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('USUARIOS PENDIENTES DE ACTIVACIÓN'))
        self.stdout.write('=' * 60)
        
        # Usuarios pendientes (registrados pero inactivos)
        pendientes = CustomUser.objects.filter(is_active=False, activo=True)
        
        if pendientes.exists():
            self.stdout.write(f'📋 {pendientes.count()} usuario(s) esperando activación:\n')
            
            for user in pendientes:
                self.stdout.write(f'👤 Usuario: {user.username}')
                self.stdout.write(f'   📧 Email: {user.email}')
                self.stdout.write(f'   👨‍👩‍👧‍👦 Nombre: {user.first_name} {user.last_name}')
                self.stdout.write(f'   🎭 Rol actual: {user.get_rol_display()}')
                self.stdout.write(f'   📅 Registrado: {user.date_joined.strftime("%d/%m/%Y %H:%M")}')
                self.stdout.write(f'   🔒 Estado Django: {"Inactivo" if not user.is_active else "Activo"}')
                self.stdout.write('   ' + '-' * 40)
                
        else:
            self.stdout.write('✅ No hay usuarios pendientes de activación')
            
        # Usuarios activos por rol
        self.stdout.write('\n📊 RESUMEN DE USUARIOS ACTIVOS:')
        for rol_key, rol_name in CustomUser.ROLE_CHOICES:
            count = CustomUser.objects.filter(rol=rol_key, is_active=True, activo=True).count()
            self.stdout.write(f'   {rol_name}: {count}')
            
        # Instrucciones para el admin
        self.stdout.write('\n🔧 INSTRUCCIONES PARA EL ADMIN:')
        self.stdout.write('1. Ir a: http://127.0.0.1:8000/admin/forms/customuser/')
        self.stdout.write('2. Filtrar por "is_active = No"')
        self.stdout.write('3. Seleccionar usuarios a activar')
        self.stdout.write('4. Cambiar rol si es necesario')
        self.stdout.write('5. Usar acción "Activar usuarios seleccionados"')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Revisar usuarios pendientes en el admin'))
