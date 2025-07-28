# forms/oracle_models_patch.py - Parche para manejar secuencias Oracle correctamente

from django.db import models, connection
from django.utils import timezone

class OracleAutoFieldMixin:
    """Mixin para manejar campos auto-incrementales en Oracle"""
    
    def save(self, *args, **kwargs):
        # Si es una nueva instancia (pk is None) y estamos usando Oracle
        if not self.pk and connection.vendor == 'oracle':
            try:
                # Intentar obtener el siguiente valor de la secuencia
                cursor = connection.cursor()
                
                # Nombre de la secuencia basado en el nombre de la tabla
                sequence_name = f"{self._meta.db_table}_SEQ"
                
                # Verificar si la secuencia existe
                cursor.execute(
                    "SELECT sequence_name FROM user_sequences WHERE sequence_name = %s",
                    [sequence_name]
                )
                
                if cursor.fetchone():
                    # La secuencia existe, obtener el siguiente valor
                    cursor.execute(f"SELECT {sequence_name}.NEXTVAL FROM dual")
                    next_id = cursor.fetchone()[0]
                    self.pk = next_id
                    print(f"Oracle: Asignando ID {next_id} usando secuencia {sequence_name}")
                else:
                    print(f"Oracle: Secuencia {sequence_name} no encontrada, usando auto-increment normal")
                    
            except Exception as e:
                print(f"Oracle: Error al obtener ID de secuencia: {e}")
                # Continuar con el comportamiento normal
                pass
        
        super().save(*args, **kwargs)

# Extender FormularioGlobal con el mixin
def patch_formulario_global():
    """Aplicar parche al modelo FormularioGlobal para Oracle"""
    from .models import FormularioGlobal
    
    # Crear una nueva clase que herede de OracleAutoFieldMixin
    class PatchedFormularioGlobal(OracleAutoFieldMixin, FormularioGlobal):
        class Meta:
            proxy = True
    
    return PatchedFormularioGlobal
