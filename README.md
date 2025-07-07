# Sistema de Formularios DESS - Oracle Database

## 🚀 Descripción

Sistema web desarrollado con Django para la gestión de formularios de estructuras eléctricas (postes) con integración directa a base de datos Oracle. Diseñado para facilitar el registro, seguimiento y administración de trabajos de infraestructura eléctrica.

## ✨ Características Principales

- **� Formularios Estructurados**: Gestión completa de estructuras nuevas y retiradas
- **🔍 Autocompletado UC**: Sistema inteligente de sugerencias para códigos UC
- **🗄️ Oracle Database**: Integración nativa con Oracle para persistencia empresarial
- **📱 Responsive**: Interface adaptable a diferentes dispositivos
- **🔒 Validaciones**: Validación completa de campos y datos
- **📋 Lista de Formularios**: Vista completa de todos los formularios registrados
- **⚡ HTTP Tradicional**: Sin dependencias de WebSocket para máxima compatibilidad

## 🛠️ Tecnologías Utilizadas

- **Backend**: Django 5.2+, Django REST Framework
- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Base de Datos**: Oracle Database
- **Deployment**: Gunicorn (WSGI Server)

## 📋 Requisitos

- Python 3.8+
- Oracle Database (11g+)
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
DB_SERVICE_NAME=XE
DB_USER=C##DESS_USER
DB_PASSWORD=dess123

# Django
SECRET_KEY=tu_clave_secreta_muy_segura
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 5. Crear tablas en Oracle

```bash
python manage.py create_oracle_tables
```

### 6. Aplicar migraciones Django (opcional)

```bash
python manage.py migrate
```

### 7. Crear superusuario (opcional)

```bash
python manage.py createsuperuser
```

### 8. Iniciar servidor

```bash
# Desarrollo
python manage.py runserver

# Producción
gunicorn dess.wsgi:application
```

## 🌐 Uso

1. **Formulario Principal**: `http://localhost:8000/` - Crear nuevo formulario
2. **Lista de Formularios**: `http://localhost:8000/list/` - Ver formularios registrados
3. **Admin Panel**: `http://localhost:8000/admin/` - Administración (requiere superusuario)

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **AC_FORMULARIO_GLOBAL_PIR**: Información general del trabajo
- **AC_ESTRUCTURA_NUEVA_PIR**: Datos de estructuras nuevas instaladas
- **AC_ESTRUCTURA_RETIRADA_PIR**: Datos de estructuras retiradas
- **AC_PROYECTO_INFO_PIR**: Información del proyecto y contrato

### Preparado para Expansión

El sistema está diseñado para agregar fácilmente nuevas tablas:

```python
# En models.py - ejemplo para nueva tabla
class NuevaTabla(models.Model):
    formulario = models.ForeignKey(FormularioGlobal, on_delete=models.CASCADE)
    # ... otros campos
    
    class Meta:
        db_table = 'AC_NUEVA_TABLA_PIR'
```

## 🔧 Comandos de Gestión

```bash
# Crear tablas Oracle
python manage.py create_oracle_tables

# Recrear tablas (elimina datos existentes)
python manage.py create_oracle_tables --drop

# Verificar conexión Oracle
python test_oracle.py
```

## 📁 Estructura del Proyecto

```
forms/
├── management/commands/
│   └── create_oracle_tables.py    # Comando para crear tablas
├── templates/forms/
│   ├── form.html                  # Formulario principal
│   ├── list.html                  # Lista de formularios
│   └── success.html               # Página de éxito
├── static/js/
│   └── uc-mapping.js              # Autocompletado UC
├── models.py                      # Modelos Django-Oracle
├── views.py                       # Lógica de vistas
└── urls.py                        # Configuración de URLs
```

## 🔄 Flujo de Trabajo

1. **Llenar Formulario**: Usuario completa campos obligatorios
2. **Validación**: Sistema valida datos en frontend y backend
3. **Guardar**: Datos se almacenan en Oracle via HTTP POST
4. **Confirmación**: Página de éxito muestra resultado
5. **Gestión**: Lista de formularios para seguimiento

## 🎯 Características del Autocompletado UC

- **Base de Datos**: Mapping completo de códigos UC
- **Búsqueda Inteligente**: Filtrado por código y descripción
- **Interfaz Intuitiva**: Sugerencias en tiempo real

## 🔒 Seguridad

- CSRF Protection habilitado
- Validación de datos en backend
- Configuración de cabeceras de seguridad
- Variables de entorno para credenciales

## 📈 Rendimiento

- Consultas optimizadas con `select_related`
- Paginación preparada para grandes conjuntos de datos
- Índices en campos clave de Oracle

## 🚀 Despliegue en Producción

1. Configurar variables de entorno de producción
2. Usar Gunicorn como servidor WSGI
3. Configurar proxy reverso (Nginx)
4. Configurar respaldos de base de datos

## 🤝 Desarrollo

### Agregar Nueva Tabla

1. **Crear modelo** en `models.py`
2. **Agregar tabla** al comando `create_oracle_tables.py`
3. **Actualizar vista** `submit_form` en `views.py`
4. **Modificar formulario** HTML según necesidades

### Estructura Extensible

El sistema utiliza un patrón modular que permite:
- Agregar nuevos tipos de formularios
- Extender campos existentes
- Integrar nuevas validaciones
- Personalizar flujos de trabajo
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
└── manage.py                # Archivo Principal

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
