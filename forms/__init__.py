# forms/__init__.py

# Aplicar parches para Oracle al cargar la aplicación
try:
    from django.db import connection
    if connection.vendor == 'oracle':
        from .oracle_backend_patch import apply_oracle_patches
        apply_oracle_patches()
except Exception as e:
    # Si hay algún error durante la aplicación de parches, no fallar la carga
    import logging
    logging.getLogger(__name__).warning(f"No se pudieron aplicar parches Oracle: {e}")

default_app_config = 'forms.apps.FormsConfig'