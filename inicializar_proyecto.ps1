# ===============================================
# Script de Inicialización del Proyecto FormPIR
# ===============================================

# Verificar que Python esté instalado
Write-Host "Verificando Python..." -ForegroundColor Green
python --version

# Verificar que Oracle Client esté instalado
Write-Host "Verificando Oracle Client..." -ForegroundColor Green
try {
    python -c "import oracledb; print('Oracle Client: OK')"
} catch {
    Write-Host "Oracle Client no encontrado. Instalando..." -ForegroundColor Yellow
    pip install oracledb
}

# Crear entorno virtual si no existe
if (!(Test-Path "venv")) {
    Write-Host "Creando entorno virtual..." -ForegroundColor Green
    python -m venv venv
}

# Activar entorno virtual
Write-Host "Activando entorno virtual..." -ForegroundColor Green
& "venv\Scripts\Activate.ps1"

# Instalar dependencias
Write-Host "Instalando dependencias..." -ForegroundColor Green
pip install -r requirement.txt

# Verificar configuración de base de datos
Write-Host "Verificando conexión a Oracle..." -ForegroundColor Green
python manage.py check --database default

# Crear migraciones
Write-Host "Creando migraciones..." -ForegroundColor Green
python manage.py makemigrations

# Aplicar migraciones
Write-Host "Aplicando migraciones..." -ForegroundColor Green
python manage.py migrate

# Crear superusuario
Write-Host "Para crear un superusuario, ejecuta:" -ForegroundColor Yellow
Write-Host "python manage.py createsuperuser" -ForegroundColor Yellow

# Recopilar archivos estáticos
Write-Host "Recopilando archivos estáticos..." -ForegroundColor Green
python manage.py collectstatic --noinput

Write-Host "¡Proyecto inicializado correctamente!" -ForegroundColor Green
Write-Host "Para iniciar el servidor, ejecuta:" -ForegroundColor Yellow
Write-Host "python manage.py runserver" -ForegroundColor Yellow
