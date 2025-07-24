@echo off
echo ========================================
echo CONFIGURANDO BASE DE DATOS ORACLE
echo ========================================
echo.

echo 1. Creando tablas en Oracle...
python manage.py create_tables

echo.
echo 2. Aplicando migraciones falsas...
python manage.py migrate --fake-initial

echo.
echo 3. Creando superusuario...
python manage.py createsuperuser --username admin --email admin@example.com

echo.
echo ========================================
echo CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Ahora puedes iniciar el servidor con:
echo python manage.py runserver
echo.
pause
