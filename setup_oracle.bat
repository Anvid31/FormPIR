@echo off
REM =====================================================
REM Script de configuración para Oracle Database
REM FormPIR - Sistema de Formularios para Postes
REM =====================================================

setlocal enabledelayedexpansion

echo ======================================================
echo Configuración de Oracle Database para FormPIR
echo ======================================================

REM Configuración por defecto
set ORACLE_HOME=C:\app\oracle\product\21c\dbhomeXE
set DATABASE_NAME=XE
set HOST=localhost
set PORT=1521

REM Verificar argumentos de línea de comandos
if "%1"=="--help" goto :help
if "%1"=="-h" goto :help

REM Configurar variables de entorno
set PATH=%ORACLE_HOME%\bin;%PATH%

REM Verificar que SQL*Plus esté disponible
if not exist "%ORACLE_HOME%\bin\sqlplus.exe" (
    echo ❌ Error: No se encontró SQL*Plus en %ORACLE_HOME%\bin\sqlplus.exe
    echo Por favor, verifique la instalación de Oracle
    echo.
    echo Para especificar una ruta diferente, edite la variable ORACLE_HOME en este script
    pause
    exit /b 1
)

echo ✓ SQL*Plus encontrado en: %ORACLE_HOME%\bin\sqlplus.exe

REM Verificar que el archivo SQL existe
if not exist "setup_oracle_database.sql" (
    echo ❌ Error: No se encontró el archivo setup_oracle_database.sql
    echo Asegúrese de que el archivo esté en el mismo directorio que este script
    pause
    exit /b 1
)

echo ✓ Script SQL encontrado: setup_oracle_database.sql
echo.

echo Configuración:
echo - Oracle Home: %ORACLE_HOME%
echo - Base de datos: %DATABASE_NAME%
echo - Host: %HOST%
echo - Puerto: %PORT%
echo.

REM Solicitar contraseña del usuario SYS
set /p SYS_PASSWORD=Ingrese la contraseña del usuario SYS: 

if "%SYS_PASSWORD%"=="" (
    echo ❌ Error: Debe proporcionar la contraseña del usuario SYS
    pause
    exit /b 1
)

echo.
echo Conectando a Oracle como SYS...
echo Ejecutando script de configuración...
echo Esto puede tomar varios minutos...
echo.

REM Ejecutar el script SQL
sqlplus -S sys/%SYS_PASSWORD%@%HOST%:%PORT%/%DATABASE_NAME% as sysdba @setup_oracle_database.sql

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================
    echo ✓ CONFIGURACIÓN COMPLETADA EXITOSAMENTE
    echo ======================================================
    echo.
    echo Credenciales de acceso:
    echo - Usuario: FORM_PIR
    echo - Contraseña: dess123
    echo - Host: %HOST%
    echo - Puerto: %PORT%
    echo - Servicio: %DATABASE_NAME%
    echo.
    echo Configuración para Django (.env):
    echo DB_HOST=%HOST%
    echo DB_PORT=%PORT%
    echo DB_SERVICE_NAME=%DATABASE_NAME%
    echo DB_USER=FORM_PIR
    echo DB_PASSWORD=dess123
    echo.
    echo Próximos pasos:
    echo 1. Verificar la configuración en el archivo .env
    echo 2. Ejecutar: python manage.py migrate
    echo 3. Ejecutar: python manage.py test_oracle
    echo.
    echo Para verificar la instalación:
    echo python manage.py diagnose_oracle
    echo.
) else (
    echo.
    echo ❌ Error durante la ejecución del script
    echo.
    echo Posibles causas:
    echo - Contraseña de SYS incorrecta
    echo - Oracle Database no está ejecutándose
    echo - Problemas de conectividad
    echo - Permisos insuficientes
    echo.
    echo Para verificar el estado de Oracle:
    echo 1. Verificar que el servicio OracleServiceXE esté ejecutándose
    echo 2. Verificar que el listener esté activo: lsnrctl status
    echo 3. Intentar conectar manualmente: sqlplus sys/contraseña@XE as sysdba
)

echo.
pause
exit /b %ERRORLEVEL%

:help
echo.
echo Script de configuración de Oracle Database para FormPIR
echo.
echo Uso: setup_oracle.bat
echo.
echo Este script:
echo 1. Crea el usuario FORM_PIR con la contraseña dess123
echo 2. Crea todas las tablas necesarias para el sistema
echo 3. Configura secuencias y triggers automáticamente
echo 4. Inserta datos de prueba
echo.
echo Requisitos previos:
echo - Oracle Database XE instalado y ejecutándose
echo - Conocer la contraseña del usuario SYS
echo - Tener permisos de administrador
echo.
echo Variables que puede modificar en el script:
echo - ORACLE_HOME: Ruta de instalación de Oracle
echo - DATABASE_NAME: Nombre de la base de datos (default: XE)
echo - HOST: Servidor de base de datos (default: localhost)
echo - PORT: Puerto de Oracle (default: 1521)
echo.
exit /b 0
