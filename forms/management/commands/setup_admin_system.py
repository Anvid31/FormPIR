from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from forms.models import CustomUser, FormularioGlobal

User = get_user_model()

class Command(BaseCommand):
    help = 'Configura el sistema inicial - Admin completo y verificación de funcionalidades'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('CONFIGURACIÓN INICIAL DEL SISTEMA FORMPIR'))
        self.stdout.write('=' * 60)
        
        # 1. Verificar/Crear usuario admin principal
        self.stdout.write('\n1. CONFIGURACIÓN DEL ADMINISTRADOR:')
        try:
            admin_user = CustomUser.objects.get(username='admin')
            # Asegurar que tiene todos los permisos
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.is_active = True
            admin_user.activo = True
            admin_user.rol = 'admin'
            admin_user.save()
            self.stdout.write(f'   ✓ Usuario admin actualizado: {admin_user.username}')
        except CustomUser.DoesNotExist:
            self.stdout.write('   ⚠️ Usuario admin no encontrado')
            
        # 2. Mostrar estadísticas del sistema
        self.stdout.write('\n2. ESTADÍSTICAS DEL SISTEMA:')
        total_usuarios = CustomUser.objects.count()
        usuarios_activos = CustomUser.objects.filter(is_active=True, activo=True).count()
        usuarios_inactivos = CustomUser.objects.filter(is_active=False).count()
        usuarios_eliminados = CustomUser.objects.filter(activo=False).count()
        
        self.stdout.write(f'   👥 Total usuarios: {total_usuarios}')
        self.stdout.write(f'   ✅ Usuarios activos: {usuarios_activos}')
        self.stdout.write(f'   ❌ Usuarios inactivos Django: {usuarios_inactivos}')
        self.stdout.write(f'   🗑️ Usuarios eliminados lógicamente: {usuarios_eliminados}')
        
        # 3. Estadísticas de formularios
        total_formularios = FormularioGlobal.objects.count()
        formularios_activos = FormularioGlobal.objects.filter(activo=True).count()
        formularios_eliminados = FormularioGlobal.objects.filter(activo=False).count()
        
        self.stdout.write(f'\n   📋 Total formularios: {total_formularios}')
        self.stdout.write(f'   ✅ Formularios activos: {formularios_activos}')
        self.stdout.write(f'   🗑️ Formularios eliminados lógicamente: {formularios_eliminados}')
        
        # 4. Mostrar formularios por estado
        if total_formularios > 0:
            self.stdout.write('\n3. FORMULARIOS POR ESTADO:')
            estados = FormularioGlobal.objects.filter(activo=True).values_list('estado_actual', flat=True)
            for estado in ['contratista', 'interventor', 'gestion', 'finalizado']:
                count = estados.filter(estado_actual=estado).count() if hasattr(estados, 'filter') else list(estados).count(estado)
                self.stdout.write(f'   📊 {estado.title()}: {count}')
        
        # 5. Mostrar usuarios por rol
        self.stdout.write('\n4. USUARIOS POR ROL:')
        for rol_key, rol_name in CustomUser.ROLE_CHOICES:
            count = CustomUser.objects.filter(rol=rol_key, activo=True).count()
            self.stdout.write(f'   👤 {rol_name}: {count}')
            
        # 6. Instrucciones para el admin
        self.stdout.write('\n5. FUNCIONALIDADES DEL ADMIN:')
        self.stdout.write('   🌐 Acceder: http://127.0.0.1:8000/admin/')
        self.stdout.write('   👤 Gestión usuarios: Activar/Desactivar/Eliminar lógicamente')
        self.stdout.write('   📋 Gestión formularios: Cambiar estados/Eliminar lógicamente')
        self.stdout.write('   🔄 Acciones masivas: Seleccionar múltiples registros')
        self.stdout.write('   📊 Filtros: Por rol, estado, fecha, etc.')
        
        self.stdout.write('\n6. ELIMINACIÓN LÓGICA:')
        self.stdout.write('   • Usuarios: Campo "activo" (1=visible, 0=eliminado)')
        self.stdout.write('   • Formularios: Campo "activo" (1=visible, 0=eliminado)')
        self.stdout.write('   • Los registros NO se borran de la BD')
        self.stdout.write('   • Se pueden restaurar cambiando activo=1')
        
        self.stdout.write('\n7. FLUJO DE USUARIOS:')
        self.stdout.write('   1. Usuario se registra → is_active=False (inactivo)')
        self.stdout.write('   2. Admin asigna rol → Puede usar acciones masivas')
        self.stdout.write('   3. Admin activa usuario → is_active=True')
        self.stdout.write('   4. Usuario puede trabajar en el sistema')
        
        self.stdout.write(self.style.SUCCESS('\n✅ SISTEMA CONFIGURADO Y LISTO'))
