from django.apps import AppConfig


class FormsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'forms'
    
    def ready(self):
        """
        Código a ejecutar cuando Django ha cargado completamente la aplicación
        """
        # Aplicar parches para Oracle
        try:
            from django.db import connection
            if connection.vendor == 'oracle':
                from .oracle_backend_patch import apply_oracle_patches
                apply_oracle_patches()
                print("✅ Parches Oracle aplicados correctamente")
        except Exception as e:
            print(f"⚠️ Error aplicando parches Oracle: {e}")
