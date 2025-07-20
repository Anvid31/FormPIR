from django.core.management.base import BaseCommand
from django.test import Client
from django.contrib.auth import authenticate
from forms.models import CustomUser, FormularioGlobal

class Command(BaseCommand):
    help = 'Prueba las funcionalidades básicas del sistema'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('PROBANDO FUNCIONALIDADES BÁSICAS...'))
        self.stdout.write('=' * 50)
        
        # 1. Probar autenticación
        self.stdout.write('1. PROBANDO AUTENTICACIÓN:')
        try:
            # Probar login con admin
            user = authenticate(username='admin', password='admin123')
            if user:
                self.stdout.write(f'   ✅ Login admin: OK')
            else:
                self.stdout.write(f'   ❌ Login admin: FALLO')
            
            # Probar login con contratista
            user = authenticate(username='contratista', password='contratista123')
            if user:
                self.stdout.write(f'   ✅ Login contratista: OK')
            else:
                self.stdout.write(f'   ❌ Login contratista: FALLO')
        except Exception as e:
            self.stdout.write(f'   ❌ Error en autenticación: {e}')
        
        # 2. Probar modelos
        self.stdout.write('\n2. PROBANDO MODELOS:')
        try:
            # Contar usuarios
            users_count = CustomUser.objects.count()
            self.stdout.write(f'   ✅ Usuarios en BD: {users_count}')
            
            # Contar formularios
            forms_count = FormularioGlobal.objects.count()
            self.stdout.write(f'   ✅ Formularios en BD: {forms_count}')
            
            # Probar creación de formulario
            admin_user = CustomUser.objects.get(username='admin')
            test_form = FormularioGlobal.objects.create(
                trabajo='Trabajo de prueba',
                municipio='Municipio test',
                regional='Regional test',
                direccion='Dirección test',
                creado_por=admin_user
            )
            self.stdout.write(f'   ✅ Formulario creado: {test_form.get_numero_formulario()}')
            
        except Exception as e:
            self.stdout.write(f'   ❌ Error en modelos: {e}')
        
        # 3. Probar URLs básicas
        self.stdout.write('\n3. PROBANDO URLs:')
        client = Client()
        
        urls_to_test = [
            ('/', 'Home'),
            ('/admin/', 'Admin'),
            ('/login/', 'Login'),
        ]
        
        for url, name in urls_to_test:
            try:
                response = client.get(url)
                status = '✅' if response.status_code < 400 else '❌'
                self.stdout.write(f'   {status} {name} ({url}): {response.status_code}')
            except Exception as e:
                self.stdout.write(f'   ❌ {name} ({url}): Error - {e}')
        
        # 4. Probar dashboards por rol
        self.stdout.write('\n4. PROBANDO DASHBOARDS POR ROL:')
        
        roles = ['admin', 'contratista', 'ejecutor', 'gestion', 'planeacion']
        
        for rol in roles:
            try:
                user = CustomUser.objects.get(username=rol)
                client.force_login(user)
                response = client.get('/dashboard/')
                status = '✅' if response.status_code < 400 else '❌'
                self.stdout.write(f'   {status} Dashboard {rol}: {response.status_code}')
            except Exception as e:
                self.stdout.write(f'   ❌ Dashboard {rol}: Error - {e}')
        
        self.stdout.write('\n' + '=' * 50)
        self.stdout.write(self.style.SUCCESS('PRUEBA COMPLETADA'))
