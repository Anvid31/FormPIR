from django.urls import path
from .views import FormularioView, FormularioAPIView, FormularioLegacyView

urlpatterns = [
    path('', FormularioView.as_view(), name='form'),
    path('submit/', FormularioView.as_view(), name='submit'),
    path('legacy/', FormularioLegacyView.as_view(), name='formulario_legacy'),
    path('api/form/', FormularioAPIView.as_view(), name='formulario_api'),
    path('api/form/<str:form_id>/', FormularioAPIView.as_view(), name='formulario_api_detail'),
]
