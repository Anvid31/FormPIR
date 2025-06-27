"""
WebSocket routing configuration for forms app
"""

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/form/(?P<form_id>\w+)/$', consumers.FormConsumer.as_asgi()),
    re_path(r'ws/form-data/$', consumers.FormDataConsumer.as_asgi()),
]
