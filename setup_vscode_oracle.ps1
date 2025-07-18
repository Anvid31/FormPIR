# =====================================================
# Script para configurar conexión Oracle en VS Code
# FormPIR - Sistema de Formularios para Postes
# =====================================================

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Configurando conexión Oracle en VS Code" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# Verificar que VS Code esté instalado
try {
    $vscodeVersion = & code --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ VS Code encontrado: $($vscodeVersion[0])" -ForegroundColor Green
    } else {
        throw "VS Code no encontrado"
    }
} catch {
    Write-Host "❌ VS Code no encontrado en PATH" -ForegroundColor Red
    Write-Host "Por favor, instale VS Code o añádalo al PATH del sistema" -ForegroundColor Yellow
    exit 1
}

# Verificar extensiones instaladas
Write-Host ""
Write-Host "Verificando extensiones instaladas..." -ForegroundColor Yellow

$extensions = & code --list-extensions
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
        Write-Host "✓ $ext está instalada" -ForegroundColor Green
    } else {
        Write-Host "⚠ $ext no está instalada" -ForegroundColor Yellow
    }
}

if ($installedOracleExts.Count -eq 0) {
    Write-Host ""
    Write-Host "Instalando extensiones necesarias..." -ForegroundColor Yellow
    
    # Intentar instalar SQLTools
    Write-Host "Instalando SQLTools..." -ForegroundColor Cyan
    & code --install-extension mtxr.sqltools
    
    # Intentar instalar SQLTools Oracle Driver
    Write-Host "Instalando SQLTools Oracle Driver..." -ForegroundColor Cyan
    & code --install-extension mtxr.sqltools-driver-oracle
    
    Write-Host "✓ Extensiones instaladas" -ForegroundColor Green
}

# Crear configuración de conexión
Write-Host ""
Write-Host "Creando configuración de conexión..." -ForegroundColor Yellow

$settingsPath = ".vscode\settings.json"
$connectionConfig = @{
    "sqltools.connections" = @(
        @{
            "name" = "FormPIR - Oracle Database"
            "driver" = "Oracle"
            "server" = "localhost"
            "port" = 1521
            "database" = "XE"
            "username" = "FORM_PIR"
            "password" = "dess123"
            "connectionTimeout" = 30
            "requestTimeout" = 120
            "schema" = "FORM_PIR"
        }
    )
    "oracledevtools.connections" = @(
        @{
            "name" = "FormPIR - Oracle"
            "host" = "localhost"
            "port" = 1521
            "serviceName" = "XE"
            "username" = "FORM_PIR"
            "password" = "dess123"
            "schema" = "FORM_PIR"
        }
    )
    "files.associations" = @{
        "*.sql" = "oraclesql"
        "*.pks" = "oraclesql"
        "*.pkb" = "oraclesql"
    }
}

# Crear directorio .vscode si no existe
if (-not (Test-Path ".vscode")) {
    New-Item -ItemType Directory -Path ".vscode" | Out-Null
}

# Guardar configuración
$connectionConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath $settingsPath -Encoding UTF8

Write-Host "✓ Configuración guardada en $settingsPath" -ForegroundColor Green

# Crear archivo de consultas de ejemplo
Write-Host ""
Write-Host "Creando archivo de consultas de ejemplo..." -ForegroundColor Yellow

$exampleQueries = @"
-- =====================================================
-- Consultas de ejemplo para FormPIR
-- =====================================================

-- Conectar a la base de datos (usar Command Palette > SQLTools: Connect)
-- Conexión: FormPIR - Oracle Database

-- 1. Verificar conexión
SELECT USER as current_user, SYSDATE as current_time FROM DUAL;

-- 2. Listar todas las tablas
SELECT table_name FROM user_tables WHERE table_name LIKE 'AC_%' ORDER BY table_name;

-- 3. Consultar formularios
SELECT 
    AC_ID_PIR,
    AC_TRABAJO_PIR,
    AC_MUNICIPIO_PIR,
    AC_REGIONAL_PIR,
    TO_CHAR(AC_CREATED_AT_PIR, 'DD/MM/YYYY HH24:MI:SS') as fecha_creacion
FROM AC_TPIR_FORMULARIO_GLOBAL
ORDER BY AC_ID_PIR;

-- 4. Consultar estructuras nuevas
SELECT 
    e.AC_ID_PIR,
    e.AC_COD_EST_PIR,
    e.AC_MATERIAL_PIR,
    e.AC_ALTURA_PIR,
    f.AC_TRABAJO_PIR
FROM AC_TPIR_ESTRUCTURA_NUEVA e
JOIN AC_TPIR_FORMULARIO_GLOBAL f ON e.AC_FORMULARIO_ID_PIR = f.AC_ID_PIR
ORDER BY e.AC_ID_PIR;

-- 5. Resumen de datos
SELECT 
    'Formularios' as tipo,
    COUNT(*) as cantidad
FROM AC_TPIR_FORMULARIO_GLOBAL
UNION ALL
SELECT 
    'Estructuras Nuevas' as tipo,
    COUNT(*) as cantidad
FROM AC_TPIR_ESTRUCTURA_NUEVA
UNION ALL
SELECT 
    'Estructuras Retiradas' as tipo,
    COUNT(*) as cantidad
FROM AC_ESTRUCTURA_RETIRADA
UNION ALL
SELECT 
    'Proyectos' as tipo,
    COUNT(*) as cantidad
FROM AC_PROYECTO_INFO;

-- 6. Insertar nuevo formulario de prueba
INSERT INTO AC_TPIR_FORMULARIO_GLOBAL (
    AC_TRABAJO_PIR,
    AC_MUNICIPIO_PIR,
    AC_REGIONAL_PIR,
    AC_DIRECCION_PIR,
    AC_NIVEL_TENSION_PIR
) VALUES (
    'Prueba desde VS Code',
    'Medellín',
    'Antioquia',
    'Carrera 70 # 50-23',
    '11.4 kV'
);

-- 7. Verificar último registro insertado
SELECT * FROM AC_TPIR_FORMULARIO_GLOBAL 
WHERE AC_ID_PIR = (SELECT MAX(AC_ID_PIR) FROM AC_TPIR_FORMULARIO_GLOBAL);

-- 8. Consulta con JOIN completo
SELECT 
    f.AC_ID_PIR,
    f.AC_TRABAJO_PIR,
    f.AC_MUNICIPIO_PIR,
    e.AC_COD_EST_PIR,
    e.AC_MATERIAL_PIR,
    p.AC_NOMBRE_PIR
FROM AC_TPIR_FORMULARIO_GLOBAL f
LEFT JOIN AC_TPIR_ESTRUCTURA_NUEVA e ON f.AC_ID_PIR = e.AC_FORMULARIO_ID_PIR
LEFT JOIN AC_PROYECTO_INFO p ON f.AC_ID_PIR = p.AC_FORMULARIO_ID_PIR
ORDER BY f.AC_ID_PIR;
"@

$exampleQueries | Out-File -FilePath "oracle_queries_examples.sql" -Encoding UTF8

Write-Host "✓ Archivo de consultas creado: oracle_queries_examples.sql" -ForegroundColor Green

# Instrucciones finales
Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "✓ CONFIGURACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abrir VS Code en este directorio:" -ForegroundColor White
Write-Host "   code ." -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Abrir Command Palette (Ctrl+Shift+P) y buscar:" -ForegroundColor White
Write-Host "   > SQLTools: Connect" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Seleccionar la conexión:" -ForegroundColor White
Write-Host "   FormPIR - Oracle Database" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Abrir el archivo de consultas:" -ForegroundColor White
Write-Host "   oracle_queries_examples.sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Ejecutar consultas usando:" -ForegroundColor White
Write-Host "   Ctrl+E, E (ejecutar consulta)" -ForegroundColor Cyan
Write-Host "   Ctrl+E, R (ejecutar consulta seleccionada)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credenciales de conexión:" -ForegroundColor Yellow
Write-Host "- Host: localhost" -ForegroundColor White
Write-Host "- Puerto: 1521" -ForegroundColor White
Write-Host "- Database: XE" -ForegroundColor White
Write-Host "- Usuario: FORM_PIR" -ForegroundColor White
Write-Host "- Contraseña: dess123" -ForegroundColor White
Write-Host ""
Write-Host "Archivos creados:" -ForegroundColor Yellow
Write-Host "- .vscode/settings.json (configuración de conexión)" -ForegroundColor White
Write-Host "- oracle_queries_examples.sql (consultas de ejemplo)" -ForegroundColor White
Write-Host "- verify_oracle_connection.sql (script de verificación)" -ForegroundColor White
Write-Host ""
