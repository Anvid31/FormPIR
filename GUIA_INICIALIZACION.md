# Guía de Inicialización del Proyecto FormPIR

## Prerrequisitos

1. **Python 3.9 o superior**
2. **Oracle Database** (configurado y corriendo)
3. **Oracle Instant Client** (para conexión a Oracle)

## Pasos para iniciar el proyecto

### 1. Verificar la estructura del proyecto
Tu proyecto Django FormPIR está configurado para trabajar con Oracle Database y tiene la siguiente estructura:
- `forms/` - Aplicación principal con modelos, vistas y templates
- `dess/` - Configuración del proyecto Django
- `static/` - Archivos estáticos (CSS, JS)
- `templates/` - Templates HTML

### 2. Configurar entorno virtual
```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows)
venv\Scripts\activate

# Activar entorno virtual (Linux/Mac)
source venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirement.txt
```

### 4. Configurar variables de entorno
El archivo `.env` ya está configurado con:
- Configuración de base de datos Oracle
- Configuración de Django
- Configuración de archivos estáticos

### 5. Configurar Oracle Database
Asegúrate de que:
- Oracle Database esté ejecutándose
- El usuario `FORM_PIR` tenga los permisos necesarios
- La base de datos `XE` esté accesible

### 6. Aplicar migraciones
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Crear superusuario
```bash
python manage.py createsuperuser
```

### 8. Recopilar archivos estáticos
```bash
python manage.py collectstatic
```

### 9. Ejecutar servidor de desarrollo
```bash
python manage.py runserver
```

## Acceso a la aplicación

- **URL principal**: http://localhost:8000
- **Panel de administración**: http://localhost:8000/admin/
- **Login**: http://localhost:8000/login/

## Roles del sistema

El proyecto tiene configurados los siguientes roles:
- **admin**: Administrador del sistema
- **contratista**: Contratista que crea formularios
- **ejecutor**: Ejecutor/Interventor que revisa formularios
- **gestion**: Personal de gestión
- **planeacion**: Personal de planeación

## Solución de problemas comunes

### Error de conexión a Oracle
- Verificar que Oracle Database esté ejecutándose
- Verificar credenciales en el archivo `.env`
- Instalar Oracle Instant Client

### Error de migraciones
- Verificar que el usuario tenga permisos para crear tablas
- Ejecutar `python manage.py migrate --run-syncdb`

### Error de archivos estáticos
- Verificar configuración de `STATIC_URL` y `STATIC_ROOT`
- Ejecutar `python manage.py collectstatic --clear`

## Siguientes pasos

1. Configurar usuarios iniciales
2. Probar la funcionalidad de formularios
3. Configurar el entorno de producción
4. Implementar pruebas automatizadas
