from django.core.management.base import BaseCommand
from forms.models import CustomUser

class Command(BaseCommand):
    help = 'Muestra todos los roles definidos en el sistema'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('ROLES IDENTIFICADOS EN EL PROYECTO FORMPIR:'))
        self.stdout.write('=' * 50)
        
        # Mostrar roles desde el modelo
        roles = CustomUser.ROLE_CHOICES
        
        for i, (rol_key, rol_name) in enumerate(roles, 1):
            self.stdout.write(f'{i}. {rol_key.upper()} - "{rol_name}"')
            
            # Agregar descripción de funcionalidad
            if rol_key == 'admin':
                self.stdout.write('   🔧 Funcionalidad: Administrador del sistema completo')
                self.stdout.write('   📊 Dashboard: /panel/dashboard/')
                self.stdout.write('   ✅ Permisos: Todos los permisos, gestión de usuarios')
                
            elif rol_key == 'contratista':
                self.stdout.write('   🏗️ Funcionalidad: Crea y gestiona formularios')
                self.stdout.write('   📊 Dashboard: /dashboard/ (contratista_dashboard)')
                self.stdout.write('   ✅ Permisos: Crear formularios, ver sus propios formularios')
                
            elif rol_key == 'ejecutor':
                self.stdout.write('   👷 Funcionalidad: Ejecutor/Interventor que revisa formularios')
                self.stdout.write('   📊 Dashboard: /dashboard/ (ejecutor_dashboard)')
                self.stdout.write('   ✅ Permisos: Revisar y validar formularios')
                
            elif rol_key == 'gestion':
                self.stdout.write('   📋 Funcionalidad: Personal de gestión y seguimiento')
                self.stdout.write('   📊 Dashboard: /dashboard/ (gestion_dashboard)')
                self.stdout.write('   ✅ Permisos: Gestión y seguimiento de procesos')
                
            elif rol_key == 'planeacion':
                self.stdout.write('   📈 Funcionalidad: Personal de planeación estratégica')
                self.stdout.write('   📊 Dashboard: /dashboard/ (planeacion_dashboard)')
                self.stdout.write('   ✅ Permisos: Planificación y análisis')
                
            self.stdout.write('')
        
        self.stdout.write(self.style.SUCCESS(f'TOTAL DE ROLES: {len(roles)}'))
        
        # Mostrar templates identificados
        self.stdout.write(self.style.SUCCESS('\nTEMPLATES ESPECÍFICOS POR ROL:'))
        self.stdout.write('- admin/dashboard.html (Administrador)')
        self.stdout.write('- contratista/dashboard.html (Contratista)')
        self.stdout.write('- interventor/dashboard.html (Ejecutor/Interventor)')
        self.stdout.write('- gestion/dashboard.html (Gestión)')
        self.stdout.write('- planeacion/dashboard.html (Planeación)')
        
        # Sistema de estados de formularios
        self.stdout.write(self.style.SUCCESS('\nFLUJO DE ESTADOS DE FORMULARIOS:'))
        self.stdout.write('1. contratista → Contratista crea el formulario')
        self.stdout.write('2. interventor → Interventor/Ejecutor revisa')
        self.stdout.write('3. gestion → Gestión actualiza/procesa')
        self.stdout.write('4. finalizado → Proceso completado')
