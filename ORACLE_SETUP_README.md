# Configuración de Oracle Database para FormPIR

Este documento contiene las instrucciones para configurar completamente la base de datos Oracle para el sistema FormPIR.

## 📋 Requisitos Previos

1. **Oracle Database** instalado y ejecutándose
   - Oracle Database XE 21c (recomendado)
   - Oracle Database 19c o superior
   
2. **Credenciales de administrador**
   - Acceso al usuario `SYS` con permisos de DBA
   - Conocer la contraseña del usuario `SYS`

3. **Python y Django** configurados
   - Python 3.8 o superior
   - Django 5.2.3 o superior
   - Dependencias instaladas desde `requirement.txt`

## 🚀 Instalación Rápida

### Opción 1: Script de PowerShell (Recomendado)

```powershell
# Ejecutar con permisos de administrador
.\setup_oracle.ps1
```

### Opción 2: Script de Batch

```cmd
# Ejecutar desde CMD como administrador
setup_oracle.bat
```

### Opción 3: Ejecución Manual

```cmd
# Conectar como SYS
sqlplus sys/tu_contraseña@localhost:1521/XE as sysdba

# Ejecutar el script
@setup_oracle_database.sql
```

## 📁 Archivos Incluidos

| Archivo | Descripción |
|---------|-------------|
| `setup_oracle_database.sql` | Script SQL principal para crear usuario y tablas |
| `setup_oracle.ps1` | Script de PowerShell automatizado |
| `setup_oracle.bat` | Script de Batch alternativo |
| `ORACLE_SETUP_README.md` | Este archivo de documentación |

## 🔧 Configuración Detallada

### 1. Usuario y Permisos

El script crea automáticamente:

- **Usuario**: `FORM_PIR`
- **Contraseña**: `dess123`
- **Tablespace**: `USERS` (con cuota ilimitada)
- **Permisos**: DBA, CONNECT, RESOURCE, y permisos específicos

### 2. Tablas Creadas

| Tabla | Propósito |
|-------|-----------|
| `AC_TPIR_FORMULARIO_GLOBAL` | Datos principales del formulario |
| `AC_TPIR_ESTRUCTURA_NUEVA` | Información de estructuras nuevas |
| `AC_ESTRUCTURA_RETIRADA` | Información de estructuras retiradas |
| `AC_PROYECTO_INFO` | Datos del proyecto |

### 3. Secuencias y Triggers

- **Secuencias**: Auto-incremento para IDs primarios
- **Triggers**: Gestión automática de IDs y timestamps
- **Índices**: Optimización para consultas frecuentes

## ⚙️ Configuración de Django

Después de ejecutar el script, verifique su archivo `.env`:

```env
# Database Oracle Configuration
DB_ENGINE=django.db.backends.oracle
DB_NAME=XE
DB_USER=FORM_PIR
DB_PASSWORD=dess123
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE_NAME=XE

# Oracle Schema Configuration
ORACLE_SCHEMA=FORM_PIR
ORACLE_USER=FORM_PIR
ORACLE_PASSWORD=dess123
```

## 🧪 Verificación de la Instalación

### 1. Comandos de Django

```bash
# Ejecutar migraciones
python manage.py migrate

# Diagnosticar conexión Oracle
python manage.py diagnose_oracle

# Probar conexión
python manage.py test_oracle

# Crear tablas específicas (si es necesario)
python manage.py create_oracle_tables
```

### 2. Verificación Manual en Oracle

```sql
-- Conectar como FORM_PIR
sqlplus FORM_PIR/dess123@localhost:1521/XE

-- Verificar tablas
SELECT table_name FROM user_tables ORDER BY table_name;

-- Verificar secuencias
SELECT sequence_name FROM user_sequences ORDER BY sequence_name;

-- Verificar datos de prueba
SELECT COUNT(*) FROM AC_TPIR_FORMULARIO_GLOBAL;
```

## 🛠️ Solución de Problemas

### Error: "ORA-01017: invalid username/password"

**Solución:**
1. Verificar que Oracle esté ejecutándose
2. Comprobar la contraseña del usuario SYS
3. Verificar el estado del listener: `lsnrctl status`

### Error: "ORA-12541: TNS:no listener"

**Solución:**
1. Iniciar el listener: `lsnrctl start`
2. Verificar el estado: `lsnrctl status`
3. Comprobar que el puerto 1521 esté disponible

### Error: "TNS:could not resolve the connect identifier"

**Solución:**
1. Verificar el archivo `tnsnames.ora`
2. Usar la cadena de conexión completa: `host:port/service_name`
3. Verificar que el servicio XE esté disponible

### Error en Django: "cx_Oracle.DatabaseError"

**Solución:**
1. Instalar Oracle Instant Client
2. Configurar variables de entorno `ORACLE_HOME` y `PATH`
3. Verificar la configuración en `settings.py`

## 📊 Estructura de la Base de Datos

### Tabla Principal: AC_TPIR_FORMULARIO_GLOBAL

```sql
AC_ID_PIR              NUMBER          PK (Auto-incremento)
AC_TRABAJO_PIR         VARCHAR2(100)   NOT NULL
AC_MUNICIPIO_PIR       VARCHAR2(100)   NOT NULL
AC_NUMERO_X_PIR        NUMBER(15,6)    Coordenada X
AC_NUMERO_Y_PIR        NUMBER(15,6)    Coordenada Y
AC_NUMERO_Z_PIR        NUMBER(15,6)    Coordenada Z
AC_REGIONAL_PIR        VARCHAR2(100)   
AC_DIRECCION_PIR       VARCHAR2(200)   
AC_ALIMENTADOR_PIR     VARCHAR2(100)   
AC_BARRIO_VEREDA_PIR   VARCHAR2(100)   
AC_NIVEL_TENSION_PIR   VARCHAR2(50)    
AC_CIRCUITO_PIR        VARCHAR2(100)   
AC_ARCHIVO_CAD         BLOB            Archivo CAD
AC_CREATED_AT_PIR      DATE            DEFAULT SYSDATE
AC_UPDATED_AT_PIR      DATE            DEFAULT SYSDATE
```

### Relaciones

```
AC_TPIR_FORMULARIO_GLOBAL (1) → (N) AC_TPIR_ESTRUCTURA_NUEVA
AC_TPIR_FORMULARIO_GLOBAL (1) → (N) AC_ESTRUCTURA_RETIRADA
AC_TPIR_FORMULARIO_GLOBAL (1) → (N) AC_PROYECTO_INFO
```

## 🔄 Mantenimiento

### Respaldo de Datos

```bash
# Exportar datos
expdp FORM_PIR/dess123@XE directory=DATA_PUMP_DIR dumpfile=formpir_backup.dmp

# Importar datos
impdp FORM_PIR/dess123@XE directory=DATA_PUMP_DIR dumpfile=formpir_backup.dmp
```

### Reiniciar Secuencias

```sql
-- Si necesita reiniciar las secuencias
ALTER SEQUENCE AC_FORM_SEQ RESTART START WITH 1;
ALTER SEQUENCE AC_EST_NUEVA_SEQ RESTART START WITH 1;
ALTER SEQUENCE AC_EST_RET_SEQ RESTART START WITH 1;
ALTER SEQUENCE AC_PROY_SEQ_PIR RESTART START WITH 1;
```

## 📞 Soporte

Si encuentra problemas durante la instalación:

1. Revisar los logs de Oracle: `$ORACLE_HOME/diag/rdbms/xe/XE/trace/`
2. Verificar el archivo `alert_XE.log`
3. Ejecutar `python manage.py diagnose_oracle` para diagnóstico automático
4. Consultar la documentación oficial de Oracle Database

## 📝 Notas Importantes

- **Seguridad**: Cambiar la contraseña por defecto `dess123` en producción
- **Tablespace**: Considerar crear un tablespace específico para producción
- **Backups**: Implementar una estrategia de respaldo regular
- **Monitoreo**: Configurar alertas para el espacio de tablespace
- **Performance**: Revisar y ajustar los índices según el uso real

---

**Versión**: 1.0  
**Fecha**: Julio 2025  
**Sistema**: FormPIR - Formularios para Postes
