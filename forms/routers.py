"""
Database router para dirigir consultas de modelos de formularios a Oracle
"""

class FormularioRouter:
    """
    Router para dirigir consultas de modelos de formularios a Oracle
    y modelos de autenticación a SQLite/PostgreSQL
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
    
    # Modelos que usan base de datos por defecto (auth, sessions, etc.)
    default_models = {
        'historialestado'
    }
    
    # Modelos de usuarios que van a Oracle
    oracle_user_models = {
        'customuser'
    }
    
    def db_for_read(self, model, **hints):
        """Sugerir la base de datos para leer objetos de tipo model."""
        model_name = model._meta.model_name.lower()
        
        # Modelos de autenticación van a default
        if model_name in self.default_models:
            return 'default'
            
        # Modelos de usuarios van a Oracle
        if model_name in self.oracle_user_models:
            return 'oracle'
            
        # Modelos de formularios van a Oracle
        if model._meta.app_label in self.oracle_apps and model_name in self.oracle_models:
            return 'oracle'
            
        return 'default'
    
    def db_for_write(self, model, **hints):
        """Sugerir la base de datos para escribir objetos de tipo model."""
        model_name = model._meta.model_name.lower()
        
        # Modelos de autenticación van a default
        if model_name in self.default_models:
            return 'default'
            
        # Modelos de usuarios van a Oracle
        if model_name in self.oracle_user_models:
            return 'oracle'
            
        # Modelos de formularios van a Oracle
        if model._meta.app_label in self.oracle_apps and model_name in self.oracle_models:
            return 'oracle'
        return 'default'
    
    def allow_relation(self, obj1, obj2, **hints):
        """Permitir relaciones si los modelos están en el mismo app."""
        db_set = {'default', 'oracle'}
        if obj1._state.db in db_set and obj2._state.db in db_set:
            return True
        return None
    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Asegurar que ciertos modelos se migren a la base de datos correcta."""
        if model_name:
            model_name = model_name.lower()
            
        # Modelos de autenticación van a default
        if model_name in self.default_models:
            return db == 'default'
            
        # Modelos de usuarios van a Oracle
        if model_name in self.oracle_user_models:
            return db == 'oracle'
            
        # Modelos de formularios van a Oracle
        if app_label == 'forms':
            if model_name in self.oracle_models:
                return db == 'oracle'
            else:
                return db == 'default'
                
        # Otros modelos van a default
        return db == 'default'
