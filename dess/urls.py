from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views

# Personalizar el admin por defecto
admin.site.site_header = "Administración DESS"
admin.site.site_title = "DESS Admin"
admin.site.index_title = "Panel de Administración del Sistema DESS"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('forms.urls')),
]

# Archivos estáticos en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
