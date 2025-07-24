from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from django.shortcuts import redirect

# Personalizar el admin por defecto
admin.site.site_header = "Administración DESS"
admin.site.site_title = "DESS Admin"
admin.site.index_title = "Panel de Administración del Sistema DESS"

# Vista para redirigir admin login a nuestro login personalizado
def admin_login_redirect(request):
    return redirect('forms:login')

urlpatterns = [
    path('admin/login/', admin_login_redirect),  # Redirigir admin login a nuestro login
    path('admin/', admin.site.urls),
    path('', include('forms.urls')),
]

# Archivos estáticos en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Manejadores de errores personalizados
handler404 = 'dess.error_handlers.handler404'
handler500 = 'dess.error_handlers.handler500'
handler403 = 'dess.error_handlers.handler403'
