# forms/oracle_backend_patch.py - Parche para corregir problemas del backend Oracle de Django

import logging
from django.db import connection

logger = logging.getLogger(__name__)

def patch_oracle_backend():
    """
    Aplica parches necesarios para el backend Oracle de Django
    Corrige problemas conocidos con secuencias
    """
    
    if connection.vendor != 'oracle':
        logger.info("Oracle backend patch: No se requiere, no es Oracle")
        return
    
    # Parche para la función last_insert_id que está generando SQL inválido
    original_last_insert_id = connection.ops.last_insert_id
    
    def patched_last_insert_id(cursor, table_name, pk_name):
        """
        Versión parcheada de last_insert_id que maneja secuencias correctamente
        """
        try:
            # Intentar obtener el nombre de la secuencia
            sq_name = connection.ops._get_sequence_name(table_name)
            if sq_name:
                # Formar correctamente la consulta SQL para obtener CURRVAL
                sql = f"SELECT {sq_name}.CURRVAL FROM dual"
                logger.debug(f"Oracle patch: Ejecutando {sql}")
                cursor.execute(sql)
                row = cursor.fetchone()
                if row:
                    return row[0]
            
            # Si no funciona, devolver None
            logger.warning(f"Oracle patch: No se pudo obtener last_insert_id para {table_name}")
            return None
            
        except Exception as e:
            logger.error(f"Oracle patch: Error en last_insert_id: {e}")
            # Intentar llamar a la función original como fallback
            try:
                return original_last_insert_id(cursor, table_name, pk_name)
            except:
                return None
    
    # Aplicar el parche
    connection.ops.last_insert_id = patched_last_insert_id
    logger.info("Oracle backend patch: Aplicado correctamente")

def patch_sequence_name():
    """
    Parche adicional para el manejo de nombres de secuencia
    """
    if connection.vendor != 'oracle':
        return
    
    original_get_sequence_name = connection.ops._get_sequence_name
    
    def patched_get_sequence_name(table_name):
        """
        Versión parcheada que maneja nombres de secuencia conocidos
        """
        # Mapeo específico para nuestras tablas conocidas
        sequence_mapping = {
            'FORMS_FORMULARIO': 'FORMS_FORMULARIO_SEQ',
            'FORMS_FORMULARIOGLOBAL': 'FORMS_FORMULARIOGLOBAL_AC_ID_PIR_SEQ',
            'FORMS_CUSTOMUSER': 'FORMS_CUSTOMUSER_SEQ',
        }
        
        if table_name in sequence_mapping:
            logger.debug(f"Oracle patch: Usando secuencia mapeada {sequence_mapping[table_name]} para {table_name}")
            return sequence_mapping[table_name]
        
        # Para otras tablas, usar la función original
        try:
            return original_get_sequence_name(table_name)
        except:
            # Si falla, generar un nombre estándar
            return f"{table_name}_SEQ"
    
    # Aplicar el parche
    connection.ops._get_sequence_name = patched_get_sequence_name
    logger.info("Oracle sequence patch: Aplicado correctamente")

# Función principal para aplicar todos los parches
def apply_oracle_patches():
    """
    Aplica todos los parches necesarios para Oracle
    """
    logger.info("Aplicando parches para Oracle...")
    patch_oracle_backend()
    patch_sequence_name()
    logger.info("Parches Oracle aplicados exitosamente")
