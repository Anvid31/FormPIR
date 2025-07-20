# =====================================================
# Script de PowerShell para configurar Oracle Database
# FormPIR - Sistema de Formularios para Postes
# =====================================================

param(
    [string]$OracleHome = "C:\app\oracle\product\21c\dbhomeXE",
    [string]$DatabaseName = "XE",
    [string]$SysPassword = "oracle",
    [string]$Host = "localhost",
    [int]$Port = 1521
)

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Configuración de Oracle Database para FormPIR" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# Verificar que Oracle esté instalado
$sqlplusPath = "$OracleHome\bin\sqlplus.exe"
if (-not (Test-Path $sqlplusPath)) {
    Write-Host "❌ Error: No se encontró SQL*Plus en $sqlplusPath" -ForegroundColor Red
    Write-Host "Por favor, verifique la instalación de Oracle o ajuste el parámetro OracleHome" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ SQL*Plus encontrado en: $sqlplusPath" -ForegroundColor Green

# Verificar que el archivo SQL existe
$scriptPath = Join-Path $PSScriptRoot "setup_oracle_database.sql"
if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ Error: No se encontró el archivo setup_oracle_database.sql" -ForegroundColor Red
    Write-Host "Archivo esperado en: $scriptPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Script SQL encontrado: $scriptPath" -ForegroundColor Green

# Configurar variables de entorno de Oracle
$env:ORACLE_HOME = $OracleHome
$env:PATH = "$OracleHome\bin;$env:PATH"

Write-Host ""
Write-Host "Configuración:" -ForegroundColor Yellow
Write-Host "- Oracle Home: $OracleHome" -ForegroundColor White
Write-Host "- Base de datos: $DatabaseName" -ForegroundColor White
Write-Host "- Host: $Host" -ForegroundColor White
Write-Host "- Puerto: $Port" -ForegroundColor White
Write-Host ""

# Solicitar contraseña si no se proporciona
if (-not $SysPassword) {
    $securePassword = Read-Host "Ingrese la contraseña del usuario SYS" -AsSecureString
    $SysPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    )
}

# Construir la cadena de conexión
$connectionString = "sys/$SysPassword@$Host`:$Port/$DatabaseName as sysdba"

Write-Host "Conectando a Oracle como SYS..." -ForegroundColor Yellow

try {
    # Ejecutar el script SQL
    $arguments = @(
        "-S",  # Modo silencioso
        $connectionString,
        "@$scriptPath"
    )
    
    Write-Host "Ejecutando script de configuración..." -ForegroundColor Yellow
    Write-Host "Esto puede tomar varios minutos..." -ForegroundColor Yellow
    Write-Host ""
    
    $process = Start-Process -FilePath $sqlplusPath -ArgumentList $arguments -Wait -PassThru -NoNewWindow
    
    if ($process.ExitCode -eq 0) {
        Write-Host ""
        Write-Host "✓ Script ejecutado exitosamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "======================================================" -ForegroundColor Green
        Write-Host "CONFIGURACIÓN COMPLETADA" -ForegroundColor Green
        Write-Host "======================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Credenciales de acceso:" -ForegroundColor Yellow
        Write-Host "- Usuario: FORM_PIR" -ForegroundColor White
        Write-Host "- Contraseña: dess123" -ForegroundColor White
        Write-Host "- Host: $Host" -ForegroundColor White
        Write-Host "- Puerto: $Port" -ForegroundColor White
        Write-Host "- Servicio: $DatabaseName" -ForegroundColor White
        Write-Host ""
        Write-Host "Cadena de conexión para Django:" -ForegroundColor Yellow
        Write-Host "HOST: $Host" -ForegroundColor White
        Write-Host "PORT: $Port" -ForegroundColor White
        Write-Host "SERVICE_NAME: $DatabaseName" -ForegroundColor White
        Write-Host "USER: FORM_PIR" -ForegroundColor White
        Write-Host "PASSWORD: dess123" -ForegroundColor White
        Write-Host ""
        Write-Host "Próximos pasos:" -ForegroundColor Yellow
        Write-Host "1. Verificar que el archivo .env tenga la configuración correcta" -ForegroundColor White
        Write-Host "2. Ejecutar: python manage.py migrate" -ForegroundColor White
        Write-Host "3. Ejecutar: python manage.py test_oracle" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Error durante la ejecución del script" -ForegroundColor Red
        Write-Host "Código de salida: $($process.ExitCode)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Posibles causas:" -ForegroundColor Yellow
        Write-Host "- Contraseña de SYS incorrecta" -ForegroundColor White
        Write-Host "- Oracle Database no está ejecutándose" -ForegroundColor White
        Write-Host "- Problemas de conectividad" -ForegroundColor White
        Write-Host "- Permisos insuficientes" -ForegroundColor White
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error inesperado: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Para verificar la instalación, puede ejecutar:" -ForegroundColor Cyan
Write-Host "python manage.py diagnose_oracle" -ForegroundColor White
Write-Host ""
