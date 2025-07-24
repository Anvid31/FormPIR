"""
Comando para verificar la configuración del sistema FormPIR
"""
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.cache import cache
from django.db import connection
import logging
import os

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Verifica la configuración del sistema FormPIR'

    def handle(self, *args, **options):
        self.stdout.write(self.style.HTTP_INFO('=== VERIFICACIÓN DEL SISTEMA FORMPIR ==='))
        
        # Verificar configuración básica
        self.check_basic_config()
        
        # Verificar base de datos
        self.check_database()
        
        # Verificar cache
        self.check_cache()
        
        # Verificar logging
        self.check_logging()
        
        # Verificar seguridad
        self.check_security()
        
        self.stdout.write(self.style.SUCCESS('\n=== VERIFICACIÓN COMPLETADA ==='))

    def check_basic_config(self):
        self.stdout.write('\n📋 CONFIGURACIÓN BÁSICA:')
        
        # DEBUG
        debug_status = '🔴 ACTIVADO' if settings.DEBUG else '🟢 DESACTIVADO'
        self.stdout.write(f'  DEBUG: {debug_status}')
        
        # SECRET_KEY
        secret_ok = '🟢 CONFIGURADO' if settings.SECRET_KEY else '🔴 NO CONFIGURADO'
        self.stdout.write(f'  SECRET_KEY: {secret_ok}')
        
        # ALLOWED_HOSTS
        hosts_ok = '🟢 CONFIGURADO' if settings.ALLOWED_HOSTS else '🔴 NO CONFIGURADO'
        self.stdout.write(f'  ALLOWED_HOSTS: {hosts_ok}')

    def check_database(self):
        self.stdout.write('\n🗄️ BASE DE DATOS:')
        
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1 FROM DUAL")
                result = cursor.fetchone()
                if result:
                    self.stdout.write('  🟢 Conexión Oracle: EXITOSA')
                    
                    # Verificar tabla de usuarios
                    cursor.execute("SELECT COUNT(*) FROM FORMS_CUSTOMUSER")
                    user_count = cursor.fetchone()[0]
                    self.stdout.write(f'  👥 Usuarios en sistema: {user_count}')
                    
        except Exception as e:
            self.stdout.write(f'  🔴 Error en base de datos: {e}')

    def check_cache(self):
        self.stdout.write('\n⚡ CACHE:')
        
        try:
            cache.set('test_key', 'test_value', 30)
            value = cache.get('test_key')
            if value == 'test_value':
                self.stdout.write('  🟢 Cache: FUNCIONANDO')
            else:
                self.stdout.write('  🔴 Cache: ERROR')
        except Exception as e:
            self.stdout.write(f'  🔴 Error en cache: {e}')

    def check_logging(self):
        self.stdout.write('\n📊 LOGGING:')
        
        logs_dir = settings.BASE_DIR / 'logs'
        if logs_dir.exists():
            self.stdout.write('  🟢 Directorio de logs: EXISTE')
            
            # Probar logging
            try:
                logger.info('Test de logging desde comando de verificación')
                self.stdout.write('  🟢 Sistema de logging: FUNCIONANDO')
            except Exception as e:
                self.stdout.write(f'  🔴 Error en logging: {e}')
        else:
            self.stdout.write('  🔴 Directorio de logs: NO EXISTE')

    def check_security(self):
        self.stdout.write('\n🔒 SEGURIDAD:')
        
        # HTTPS settings
        ssl_redirect = getattr(settings, 'SECURE_SSL_REDIRECT', False)
        ssl_status = '🟢 ACTIVADO' if ssl_redirect else '🟡 DESACTIVADO (OK para desarrollo)'
        self.stdout.write(f'  SSL Redirect: {ssl_status}')
        
        # Session security
        session_secure = getattr(settings, 'SESSION_COOKIE_SECURE', False)
        session_status = '🟢 ACTIVADO' if session_secure else '🟡 DESACTIVADO (OK para desarrollo)'
        self.stdout.write(f'  Session Cookie Secure: {session_status}')
        
        # CSRF
        csrf_secure = getattr(settings, 'CSRF_COOKIE_SECURE', False)
        csrf_status = '🟢 ACTIVADO' if csrf_secure else '🟡 DESACTIVADO (OK para desarrollo)'
        self.stdout.write(f'  CSRF Cookie Secure: {csrf_status}')
        
        # X-Frame-Options
        x_frame = getattr(settings, 'X_FRAME_OPTIONS', None)
        frame_status = '🟢 CONFIGURADO' if x_frame else '🔴 NO CONFIGURADO'
        self.stdout.write(f'  X-Frame-Options: {frame_status}')
