from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password, make_password
from .models import CustomUser

class OracleAuthBackend(BaseBackend):
    """
    Backend de autenticación personalizado para Oracle DB
    Maneja contraseñas en texto plano almacenadas en Oracle (solo desarrollo)
    """
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Buscar usuario en Oracle
            user = CustomUser.objects.get(username=username)
            
            # Verificar si está activo
            if not user.is_active:
                return None
            
            # Para desarrollo: comparar contraseña directamente con la almacenada en Oracle
            if user.password == password:
                # Actualizar con hash de Django para futuras autenticaciones
                user.password = make_password(password)
                user.save()
                return user
            
            # Si ya tiene hash de Django, usar verificación normal
            elif check_password(password, user.password):
                return user
                
        except CustomUser.DoesNotExist:
            return None
        
        return None
    
    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return None
