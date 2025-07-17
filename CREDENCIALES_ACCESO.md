# 🔐 Credenciales de Acceso - Sistema DESS

## 📋 Información General del Sistema

**Sistema:** DESS - Sistema de Gestión de Formularios PIR  
**Versión:** 2.0  
**Framework:** Django 5.2.3  
**Base de Datos:** Oracle XE  
**Fecha de Creación:** Julio 2025  

---

## 🌐 URLs de Acceso

- **Panel de Administración:** `http://localhost:8000/admin/`
- **Sistema Principal:** `http://localhost:8000/`
- **Documentación API:** `http://localhost:8000/api/docs/` *(si está habilitada)*

---

## 👥 Usuarios del Sistema

### 🔴 ADMINISTRADORES

#### Administrador Principal
- **Usuario:** `admin_dess`
- **Contraseña:** `AdminDESS2025`
- **Email:** `admin@dess.gov.co`
- **Nombre:** Administrador Sistema
- **Rol:** Administrador
- **Permisos:** Acceso completo al sistema
- **Regional:** Nacional
- **Departamento:** Nacional
- **Estado:** ✅ Activo

---

### 🟢 EQUIPOS CONTRATISTAS

#### Contratista Principal (Ya Creado)
- **Usuario:** `contratista1`
- **Contraseña:** `ContratistaDESS2025`
- **Email:** `contratista1@dess.gov.co`
- **Nombre:** Carlos Mendoza
- **Rol:** Contratista
- **Equipo:** Equipo Norte
- **Regional:** Norte
- **Departamento:** Antioquia
- **Estado:** ✅ Activo

#### Contratista Regional Norte
- **Usuario:** `contratista_norte`
- **Contraseña:** `ContratistaNorte2025`
- **Email:** `contratista.norte@dess.gov.co`
- **Nombre:** Juan Carlos Pérez
- **Rol:** Contratista
- **Equipo:** Equipo Norte
- **Regional:** Norte
- **Departamento:** Antioquia
- **Estado:** ✅ Activo

#### Contratista Regional Sur
- **Usuario:** `contratista_sur`
- **Contraseña:** `ContratistaSur2025`
- **Email:** `contratista.sur@dess.gov.co`
- **Nombre:** María Elena Rodríguez
- **Rol:** Contratista
- **Equipo:** Equipo Sur
- **Regional:** Sur
- **Departamento:** Valle del Cauca
- **Estado:** ✅ Activo

---

### 🟡 INTERVENTORES/EJECUTORES

#### Interventor Principal
- **Usuario:** `interventor1`
- **Contraseña:** `Interventor2025`
- **Email:** `interventor1@dess.gov.co`
- **Nombre:** Ana Patricia Gómez
- **Rol:** Ejecutor/Interventor
- **Regional:** Norte
- **Departamento:** Antioquia
- **Estado:** ✅ Activo

---

### 🔵 ÁREA DE GESTIÓN

#### Coordinador de Gestión
- **Usuario:** `gestion1`
- **Contraseña:** `Gestion2025`
- **Email:** `gestion1@dess.gov.co`
- **Nombre:** Luis Fernando Martínez
- **Rol:** Gestión
- **Permisos:** Staff (acceso a admin)
- **Regional:** Nacional
- **Departamento:** Nacional
- **Estado:** ✅ Activo

---

### 🟣 ÁREA DE PLANEACIÓN

#### Coordinador de Planeación
- **Usuario:** `planeacion1`
- **Contraseña:** `Planeacion2025`
- **Email:** `planeacion1@dess.gov.co`
- **Nombre:** Sandra Patricia López
- **Rol:** Planeación
- **Permisos:** Staff (acceso a admin)
- **Regional:** Nacional
- **Departamento:** Nacional
- **Estado:** ✅ Activo

---

## 🔧 Comandos de Gestión

### Crear todos los usuarios de demostración
```bash
python crear_usuarios_demo.py
```

### Iniciar servidor de desarrollo
```bash
python manage.py runserver
```

### Acceder al shell de Django
```bash
python manage.py shell
```

### Crear migraciones
```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 📊 Distribución por Roles

| Rol | Cantidad | Descripción |
|-----|----------|-------------|
| **Administrador** | 1 | Acceso completo al sistema |
| **Contratista** | 3 | Equipos de trabajo regionales |
| **Interventor** | 1 | Supervisión y control |
| **Gestión** | 1 | Coordinación administrativa |
| **Planeación** | 1 | Planificación estratégica |
| **TOTAL** | **7** | Usuarios del sistema |

---

## 🌍 Distribución Regional

### Regional Norte
- **Departamento:** Antioquia
- **Usuarios:** contratista1, contratista_norte, interventor1
- **Equipos:** Equipo Norte

### Regional Sur  
- **Departamento:** Valle del Cauca
- **Usuarios:** contratista_sur
- **Equipos:** Equipo Sur

### Nacional
- **Departamento:** Nacional
- **Usuarios:** admin_dess, gestion1, planeacion1
- **Equipos:** Administración central

---

## ⚠️ Notas de Seguridad

1. **Cambio de Contraseñas:** Se recomienda cambiar todas las contraseñas en producción
2. **Acceso Admin:** Solo usuarios con `is_staff=True` pueden acceder al panel de administración
3. **Superusuarios:** Solo `admin_dess` tiene permisos de superusuario
4. **Logs de Acceso:** El sistema registra la fecha del último acceso de cada usuario

---

## 📞 Soporte Técnico

**Desarrollador:** Sistema DESS  
**Email:** soporte@dess.gov.co  
**Documentación:** Ver README.md del proyecto  
**Repositorio:** FormPIR (GitHub)

---

## 📝 Historial de Cambios

| Fecha | Versión | Cambio |
|-------|---------|---------|
| 16/07/2025 | 1.0 | Creación inicial del documento |
| 16/07/2025 | 1.1 | Usuario contratista1 creado exitosamente |
| 16/07/2025 | 1.2 | Todos los usuarios del sistema creados y activos |

---

*Documento generado automáticamente por el sistema DESS*  
*Última actualización: 16 de julio de 2025*
