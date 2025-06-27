# Sistema de Formularios en Tiempo Real - DESS

## 🚀 Descripción

Sistema web desarrollado con Django que permite la gestión de formularios con actualizaciones en tiempo real utilizando WebSockets (Django Channels) y base de datos Oracle. Ideal para entornos colaborativos donde múltiples usuarios necesitan trabajar simultáneamente en el mismo formulario.

## ✨ Características Principales

- **🔄 Tiempo Real**: Sincronización automática entre usuarios usando WebSockets
- **📊 Interface Dinámica**: Tabla interactiva con agregar/editar/eliminar en vivo
- **🔍 Autocompletado UC**: Sistema inteligente de sugerencias para códigos UC
- **🗄️ Oracle Database**: Integración completa con Oracle para persistencia empresarial
- **📱 Responsive**: Interface adaptable a diferentes dispositivos
- **🔒 Validaciones**: Validación en tiempo real de campos y datos

## 🛠️ Tecnologías Utilizadas

- **Backend**: Django 5.2+, Django Channels, Django REST Framework
- **Frontend**: HTML5, Bootstrap 5, JavaScript (WebSockets)
- **Base de Datos**: Oracle Database
- **WebSockets**: Django Channels con Redis (producción) / InMemory (desarrollo)
- **Deployment**: Daphne (ASGI Server)

## 📋 Requisitos

- Python 3.8+
- Oracle Database (11g+)
- Redis (para producción)
- Cliente Oracle (Instant Client)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd "formPreview V2"
```

### 2. Crear entorno virtual

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirement.txt
```

### 4. Configurar variables de entorno

Crear archivo `.env` basado en `.env.example`:

```env
# Base de Datos Oracle
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE_NAME=XEPDB1
DB_USER=tu_usuario
DB_PASSWORD=tu_password

# Redis (producción)
REDIS_URL=redis://localhost:6379

# Django
SECRET_KEY=tu_clave_secreta_muy_segura
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 5. Aplicar migraciones

```bash
python manage.py migrate
```

### 6. Ejecutar pruebas del sistema (opcional)

```bash
python test_sistema.py
```

### 7. Iniciar servidor

```bash
# Desarrollo
python manage.py runserver

# Producción
daphne -b 0.0.0.0 -p 8000 dess.asgi:application
```

## 🌐 Uso

1. **Acceder al formulario**: `http://localhost:8000/forms/`
2. **Completar campos**: Usar autocompletado UC y validaciones en tiempo real
3. **Agregar elementos**: Los elementos aparecen instantáneamente en la tabla
4. **Colaboración**: Múltiples usuarios pueden trabajar simultáneamente

## 📁 Estructura del Proyecto

formPreview V2/
├── dess/                      # Configuración Django
│   ├── settings.py           # Configuración principal
│   ├── asgi.py              # Configuración ASGI/WebSockets
│   └── urls.py              # URLs principales
├── forms/                    # Aplicación principal
│   ├── models.py            # Modelos de datos
│   ├── views.py             # Vistas y APIs
│   ├── consumers.py         # Consumers WebSocket
│   ├── routing.py           # Rutas WebSocket
│   ├── urls.py              # URLs de la app
│   └── templates/forms/
│       └── form.html        # Interface principal
├── .env                     # Variables de entorno
├── requirement.txt          # Dependencias

## 🔧 APIs Disponibles

### REST API

- `GET /api/formularios/` - Listar formularios
- `POST /api/formularios/` - Crear formulario
- `GET /api/formularios/{id}/` - Obtener formulario
- `PUT /api/formularios/{id}/` - Actualizar formulario
- `DELETE /api/formularios/{id}/` - Eliminar formulario

### WebSocket Endpoints

- `ws://localhost:8000/ws/form/{form_id}/` - Conexión a formulario específico
- `ws://localhost:8000/ws/form-data/` - Datos globales en tiempo real

## 🐛 Resolución de Problemas

### WebSocket no conecta

- Verificar que Redis esté ejecutándose (producción)
- Comprobar configuración ASGI
- Revisar logs del servidor

### Error de conexión a Oracle

- Verificar credenciales en `.env`
- Comprobar que Oracle esté ejecutándose
- Ejecutar `python manage.py migrate`

### Problemas de dependencias

- Ejecutar `python test_sistema.py` para diagnóstico
- Reinstalar dependencias: `pip install -r requirement.txt`

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push al branch (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto es privado, solo se sube para llevar trazabilidad general y está destinado para uso interno de CIM&DESS.

**Desarrollado con ❤️ para DESS - 2025**
