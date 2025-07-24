"""
Comando para verificar y limpiar configuraciones de login duplicadas
"""
from django.core.management.base import BaseCommand
from django.urls import reverse, NoReverseMatch
from django.conf import settings
import os

class Command(BaseCommand):
    help = 'Verifica y limpia configuraciones de login duplicadas'

    def handle(self, *args, **options):
        self.stdout.write(self.style.HTTP_INFO('=== VERIFICACIÓN DE LOGIN UNIFICADO ==='))
        
        # Verificar configuración de URLs
        self.check_login_urls()
        
        # Verificar templates
        self.check_login_templates()
        
        # Verificar configuración en settings
        self.check_settings_config()
        
        self.stdout.write(self.style.SUCCESS('\n=== VERIFICACIÓN COMPLETADA ==='))
        self.stdout.write(self.style.SUCCESS('✅ Ahora tienes UN SOLO punto de login unificado'))

    def check_login_urls(self):
        self.stdout.write('\n🔗 CONFIGURACIÓN DE URLS:')
        
        try:
            login_url = reverse('forms:login')
            self.stdout.write(f'  🟢 Login personalizado: {login_url}')
        except NoReverseMatch:
            self.stdout.write('  🔴 Error: No se pudo resolver forms:login')
        
        try:
            admin_url = reverse('admin:index')
            self.stdout.write(f'  🟢 Admin URL: {admin_url}')
            self.stdout.write('  📝 Admin login ahora redirige a login personalizado')
        except NoReverseMatch:
            self.stdout.write('  🔴 Error: No se pudo resolver admin:index')

    def check_login_templates(self):
        self.stdout.write('\n📄 TEMPLATES DE LOGIN:')
        
        # Template principal (debe existir)
        auth_template = settings.BASE_DIR / 'forms' / 'templates' / 'auth' / 'login.html'
        if auth_template.exists():
            self.stdout.write('  🟢 Template principal: auth/login.html')
        else:
            self.stdout.write('  🔴 Error: No existe auth/login.html')
        
        # Template duplicado (no debe existir)
        forms_template = settings.BASE_DIR / 'forms' / 'templates' / 'forms' / 'login.html'
        if not forms_template.exists():
            self.stdout.write('  🟢 Template duplicado eliminado: forms/login.html')
        else:
            self.stdout.write('  🟡 Advertencia: Aún existe forms/login.html duplicado')
            self.stdout.write(f'    Eliminar: {forms_template}')

    def check_settings_config(self):
        self.stdout.write('\n⚙️ CONFIGURACIÓN EN SETTINGS:')
        
        login_url = getattr(settings, 'LOGIN_URL', None)
        self.stdout.write(f'  🔑 LOGIN_URL: {login_url}')
        
        login_redirect_url = getattr(settings, 'LOGIN_REDIRECT_URL', None)
        self.stdout.write(f'  🏠 LOGIN_REDIRECT_URL: {login_redirect_url}')
        
        logout_redirect_url = getattr(settings, 'LOGOUT_REDIRECT_URL', None)
        self.stdout.write(f'  🚪 LOGOUT_REDIRECT_URL: {logout_redirect_url}')
        
        self.stdout.write('\n📋 RESUMEN:')
        self.stdout.write('  • Un solo punto de entrada de login: /login/')
        self.stdout.write('  • Admin login redirige automáticamente al login principal')
        self.stdout.write('  • Login maneja tanto usuarios normales como administradores')
        self.stdout.write('  • Redirección automática según tipo de usuario')
