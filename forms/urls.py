from django.urls import path
from .views import FormularioView, FormularioAPIView, FormularioListView, submit_form

urlpatterns = [
    # Vista principal del formulario
    path('', FormularioView.as_view(), name='form'),
    path('forms/', FormularioView.as_view(), name='form_alt'),
    path('forms/<int:form_id>/', FormularioView.as_view(), name='form_detail'),
    
    # Lista de formularios
    path('list/', FormularioListView.as_view(), name='form_list'),
    
    # API REST para operaciones CRUD
    path('api/form/', FormularioAPIView.as_view(), name='formulario_api'),
    path('api/form/<int:form_id>/', FormularioAPIView.as_view(), name='formulario_api_detail'),
    
    # Endpoint para guardar formulario completo
    path('submit/', submit_form, name='submit_form'),
]
