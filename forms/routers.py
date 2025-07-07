"""
Database router para dirigir consultas de modelos de formularios a Oracle
"""

class FormularioRouter:
    """
    Router para dirigir consultas de modelos de formularios a la base de datos Oracle
    """
    
    # Apps que usan Oracle
    oracle_apps = {'forms'}
    
    # Modelos que usan Oracle
    oracle_models = {
        'formularioglobal', 
        'estructuranueva', 
        'estructuraretirada', 
        'proyectoinfo'
    }
    
    def db_for_read(self, model, **hints):
        """Sugerir la base de datos para leer objetos de tipo model."""
        if model._meta.app_label in self.oracle_apps:
            return 'oracle'
        return 'default'
    
    def db_for_write(self, model, **hints):
        """Sugerir la base de datos para escribir objetos de tipo model."""
        if model._meta.app_label in self.oracle_apps:
            return 'oracle'
        return 'default'
    
    def allow_relation(self, obj1, obj2, **hints):
        """Permitir relaciones si los modelos están en la misma app."""
        db_list = ('default', 'oracle')
        if obj1._state.db in db_list and obj2._state.db in db_list:
            return True
        return None
    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Asegurar que ciertas apps migren solo a ciertas bases de datos."""
        if app_label in self.oracle_apps:
            return db == 'oracle'
        elif db == 'oracle':
            return False
        return db == 'default'
