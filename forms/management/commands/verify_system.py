from django.core.management.base import BaseCommand
from forms.models import CustomUser, FormularioGlobal

class Command(BaseCommand):
    help = 'Verifica qué funcionalidades específicas fallan'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('VERIFICANDO FUNCIONALIDADES ESPECÍFICAS...'))
        self.stdout.write('=' * 60)
        
        # 1. Verificar que todas las vistas están definidas
        self.stdout.write('1. VISTAS DEFINIDAS:')
        try:
            from forms import views
            
            vistas_requeridas = [
                'dashboard', 'contratista_dashboard', 'ejecutor_dashboard', 
                'gestion_dashboard', 'planeacion_dashboard', 'admin_dashboard',
                'lista_formularios', 'crear_formulario', 'custom_login', 'custom_logout'
            ]
            
            for vista in vistas_requeridas:
                if hasattr(views, vista):
                    self.stdout.write(f'   ✅ {vista}')
                else:
                    self.stdout.write(f'   ❌ {vista} - NO ENCONTRADA')
                    
        except Exception as e:
            self.stdout.write(f'   ❌ Error importando vistas: {e}')
        
        # 2. Verificar templates existen
        self.stdout.write('\n2. TEMPLATES REQUERIDOS:')
        import os
        
        templates_requeridos = [
            'admin/dashboard.html',
            'contratista/dashboard.html', 
            'interventor/dashboard.html',
            'gestion/dashboard.html',
            'forms/dashboard.html',
            'auth/login.html',
            'forms/form_modular.html'
        ]
        
        base_path = 'forms/templates'
        
        for template in templates_requeridos:
            template_path = os.path.join(base_path, template)
            if os.path.exists(template_path):
                self.stdout.write(f'   ✅ {template}')
            else:
                self.stdout.write(f'   ❌ {template} - NO EXISTE')
        
        # 3. Verificar URLs están configuradas
        self.stdout.write('\n3. CONFIGURACIÓN URLs:')
        try:
            from django.urls import reverse
            
            urls_requeridas = [
                ('forms:dashboard', 'Dashboard principal'),
                ('forms:admin_dashboard', 'Dashboard admin'),
                ('forms:lista', 'Lista formularios'),
                ('forms:crear_formulario', 'Crear formulario'),
                ('forms:login', 'Login'),
                ('forms:logout', 'Logout'),
            ]
            
            for url_name, descripcion in urls_requeridas:
                try:
                    url = reverse(url_name)
                    self.stdout.write(f'   ✅ {descripcion} ({url_name}): {url}')
                except Exception as e:
                    self.stdout.write(f'   ❌ {descripcion} ({url_name}): {e}')
                    
        except Exception as e:
            self.stdout.write(f'   ❌ Error verificando URLs: {e}')
        
        # 4. Estado de formularios en BD
        self.stdout.write('\n4. ESTADO BASE DE DATOS:')
        try:
            formularios = FormularioGlobal.objects.all()
            self.stdout.write(f'   📊 Total formularios: {formularios.count()}')
            
            if formularios.exists():
                for form in formularios[:3]:  # Mostrar primeros 3
                    self.stdout.write(f'      - {form.get_numero_formulario()}: {form.trabajo} ({form.estado_actual})')
            else:
                self.stdout.write('      (No hay formularios)')
                
        except Exception as e:
            self.stdout.write(f'   ❌ Error accediendo formularios: {e}')
        
        # 5. Usuarios por rol
        self.stdout.write('\n5. USUARIOS POR ROL:')
        try:
            for rol, nombre in CustomUser.ROLE_CHOICES:
                count = CustomUser.objects.filter(rol=rol).count()
                self.stdout.write(f'   👤 {nombre}: {count} usuario(s)')
                
        except Exception as e:
            self.stdout.write(f'   ❌ Error contando usuarios: {e}')
            
        self.stdout.write('\n' + '=' * 60)
        self.stdout.write(self.style.SUCCESS('VERIFICACIÓN COMPLETADA'))
