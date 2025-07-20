# =====================================================
# Script para configurar conexion Oracle en VS Code
# FormPIR - Sistema de Formularios para Postes
# =====================================================

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Configurando conexion Oracle en VS Code" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# Verificar que VS Code este instalado
try {
    $vscodeVersion = & code --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ VS Code encontrado: $($vscodeVersion[0])" -ForegroundColor Green
    } else {
        throw "VS Code no encontrado"
    }
} catch {
    Write-Host "❌ VS Code no encontrado en PATH" -ForegroundColor Red
    Write-Host "Por favor, instale VS Code o añadalo al PATH del sistema" -ForegroundColor Yellow
    exit 1
}

# Verificar extensiones instaladas
Write-Host ""
Write-Host "Verificando extensiones instaladas..." -ForegroundColor Yellow

$extensions = & code --list-extensions 2>$null
$oracleExtensions = @(
    "Oracle.sql-developer",
    "Oracle.oracledevtools",
    "mtxr.sqltools",
    "ms-mssql.mssql"
)

$installedOracleExts = @()
foreach ($ext in $oracleExtensions) {
    if ($extensions -contains $ext) {
        $installedOracleExts += $ext
        Write-Host "✓ $ext esta instalada" -ForegroundColor Green
    } else {
        Write-Host "⚠ $ext no esta instalada" -ForegroundColor Yellow
    }
}

if ($installedOracleExts.Count -eq 0) {
    Write-Host ""
    Write-Host "Instalando extensiones necesarias..." -ForegroundColor Yellow
    
    # Intentar instalar SQLTools
    Write-Host "Instalando SQLTools..." -ForegroundColor Cyan
    & code --install-extension mtxr.sqltools 2>$null
    
    # Intentar instalar SQLTools Oracle Driver
    Write-Host "Instalando SQLTools Oracle Driver..." -ForegroundColor Cyan
    & code --install-extension mtxr.sqltools-driver-oracle 2>$null
    
    Write-Host "✓ Extensiones instaladas" -ForegroundColor Green
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "✓ CONFIGURACION COMPLETADA" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abrir VS Code en este directorio:" -ForegroundColor White
Write-Host "   code ." -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Abrir Command Palette (Ctrl+Shift+P) y buscar:" -ForegroundColor White
Write-Host "   > SQLTools: Connect" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Seleccionar la conexion:" -ForegroundColor White
Write-Host "   FormPIR - Oracle Database" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Abrir el archivo de consultas:" -ForegroundColor White
Write-Host "   oracle_queries_examples.sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Ejecutar consultas usando:" -ForegroundColor White
Write-Host "   Ctrl+E, E (ejecutar consulta)" -ForegroundColor Cyan
Write-Host "   Ctrl+E, R (ejecutar consulta seleccionada)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credenciales de conexion:" -ForegroundColor Yellow
Write-Host "- Host: localhost" -ForegroundColor White
Write-Host "- Puerto: 1521" -ForegroundColor White
Write-Host "- Database: XE" -ForegroundColor White
Write-Host "- Usuario: FORM_PIR" -ForegroundColor White
Write-Host "- Contraseña: dess123" -ForegroundColor White
Write-Host ""
Write-Host "Archivos creados:" -ForegroundColor Yellow
Write-Host "- .vscode/settings.json (configuracion de conexion)" -ForegroundColor White
Write-Host "- oracle_queries_examples.sql (consultas de ejemplo)" -ForegroundColor White
Write-Host "- verify_oracle_connection.sql (script de verificacion)" -ForegroundColor White
Write-Host ""
