-- =====================================================
-- Consultas de ejemplo para FormPIR
-- Sistema de Formularios para Postes
-- =====================================================

-- Conectar a la base de datos usando Command Palette > SQLTools: Connect
-- Seleccionar conexión: FormPIR - Oracle Database

-- =====================================================
-- 1. VERIFICACIÓN DE CONEXIÓN
-- =====================================================

-- Verificar usuario actual y información del sistema
SELECT 
    USER as "Usuario Actual",
    SYS_CONTEXT('USERENV', 'SESSION_USER') as "Usuario Sesión",
    SYS_CONTEXT('USERENV', 'CURRENT_SCHEMA') as "Esquema Actual",
    SYS_CONTEXT('USERENV', 'DB_NAME') as "Base de Datos",
    TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI:SS') as "Fecha y Hora"
FROM DUAL;

-- =====================================================
-- 2. EXPLORACIÓN DE TABLAS
-- =====================================================

-- Listar todas las tablas del proyecto
SELECT 
    table_name as "Tabla",
    num_rows as "Filas",
    tablespace_name as "Tablespace"
FROM user_tables 
WHERE table_name LIKE 'AC_%' 
ORDER BY table_name;

-- Verificar estructura de la tabla principal
DESCRIBE AC_TPIR_FORMULARIO_GLOBAL;

-- Ver columnas de todas las tablas
SELECT 
    table_name as "Tabla",
    column_name as "Columna",
    data_type as "Tipo",
    data_length as "Longitud",
    nullable as "Nulo"
FROM user_tab_columns
WHERE table_name LIKE 'AC_%'
ORDER BY table_name, column_id;

-- =====================================================
-- 3. CONSULTAS BÁSICAS DE DATOS
-- =====================================================

-- Consultar todos los formularios
SELECT 
    AC_ID_PIR as "ID",
    AC_TRABAJO_PIR as "Trabajo",
    AC_MUNICIPIO_PIR as "Municipio",
    AC_REGIONAL_PIR as "Regional",
    AC_DIRECCION_PIR as "Dirección",
    AC_NIVEL_TENSION_PIR as "Nivel Tensión",
    TO_CHAR(AC_CREATED_AT_PIR, 'DD/MM/YYYY HH24:MI:SS') as "Fecha Creación"
FROM AC_TPIR_FORMULARIO_GLOBAL
ORDER BY AC_ID_PIR;

-- Consultar estructuras nuevas
SELECT 
    AC_ID_PIR as "ID",
    AC_FORMULARIO_ID_PIR as "ID Formulario",
    AC_COD_EST_PIR as "Código Estructura",
    AC_MATERIAL_PIR as "Material",
    AC_ALTURA_PIR as "Altura (m)",
    AC_TIPO_RED_PIR as "Tipo Red",
    AC_POBLACION_PIR as "Población"
FROM AC_TPIR_ESTRUCTURA_NUEVA
ORDER BY AC_ID_PIR;

-- Consultar información de proyectos
SELECT 
    AC_ID_PIR as "ID",
    AC_FORMULARIO_ID_PIR as "ID Formulario",
    AC_NOMBRE_PIR as "Nombre Proyecto",
    AC_CONTRATO_PIR as "Contrato",
    AC_PRO_TERC_PIR as "Proveedor Tercero"
FROM AC_PROYECTO_INFO
ORDER BY AC_ID_PIR;

-- =====================================================
-- 4. CONSULTAS CON JOINS
-- =====================================================

-- Consulta completa con todas las tablas relacionadas
SELECT 
    f.AC_ID_PIR as "ID Formulario",
    f.AC_TRABAJO_PIR as "Trabajo",
    f.AC_MUNICIPIO_PIR as "Municipio",
    f.AC_REGIONAL_PIR as "Regional",
    e.AC_COD_EST_PIR as "Código Estructura",
    e.AC_MATERIAL_PIR as "Material",
    e.AC_ALTURA_PIR as "Altura",
    p.AC_NOMBRE_PIR as "Proyecto",
    p.AC_CONTRATO_PIR as "Contrato"
FROM AC_TPIR_FORMULARIO_GLOBAL f
LEFT JOIN AC_TPIR_ESTRUCTURA_NUEVA e ON f.AC_ID_PIR = e.AC_FORMULARIO_ID_PIR
LEFT JOIN AC_PROYECTO_INFO p ON f.AC_ID_PIR = p.AC_FORMULARIO_ID_PIR
ORDER BY f.AC_ID_PIR;

-- Formularios con sus estructuras nuevas
SELECT 
    f.AC_TRABAJO_PIR as "Trabajo",
    f.AC_MUNICIPIO_PIR as "Municipio",
    COUNT(e.AC_ID_PIR) as "Estructuras Nuevas"
FROM AC_TPIR_FORMULARIO_GLOBAL f
LEFT JOIN AC_TPIR_ESTRUCTURA_NUEVA e ON f.AC_ID_PIR = e.AC_FORMULARIO_ID_PIR
GROUP BY f.AC_ID_PIR, f.AC_TRABAJO_PIR, f.AC_MUNICIPIO_PIR
ORDER BY f.AC_TRABAJO_PIR;

-- =====================================================
-- 5. ESTADÍSTICAS Y RESÚMENES
-- =====================================================

-- Resumen de registros por tabla
SELECT 
    'Formularios' as "Tipo",
    COUNT(*) as "Cantidad"
FROM AC_TPIR_FORMULARIO_GLOBAL
UNION ALL
SELECT 
    'Estructuras Nuevas' as "Tipo",
    COUNT(*) as "Cantidad"
FROM AC_TPIR_ESTRUCTURA_NUEVA
UNION ALL
SELECT 
    'Estructuras Retiradas' as "Tipo",
    COUNT(*) as "Cantidad"
FROM AC_ESTRUCTURA_RETIRADA
UNION ALL
SELECT 
    'Proyectos' as "Tipo",
    COUNT(*) as "Cantidad"
FROM AC_PROYECTO_INFO;

-- Estadísticas por municipio
SELECT 
    AC_MUNICIPIO_PIR as "Municipio",
    COUNT(*) as "Formularios",
    AVG(AC_NUMERO_X_PIR) as "Promedio X",
    AVG(AC_NUMERO_Y_PIR) as "Promedio Y"
FROM AC_TPIR_FORMULARIO_GLOBAL
WHERE AC_NUMERO_X_PIR IS NOT NULL
GROUP BY AC_MUNICIPIO_PIR
ORDER BY COUNT(*) DESC;

-- Distribución de materiales en estructuras nuevas
SELECT 
    AC_MATERIAL_PIR as "Material",
    COUNT(*) as "Cantidad",
    AVG(AC_ALTURA_PIR) as "Altura Promedio"
FROM AC_TPIR_ESTRUCTURA_NUEVA
WHERE AC_MATERIAL_PIR IS NOT NULL
GROUP BY AC_MATERIAL_PIR
ORDER BY COUNT(*) DESC;

-- =====================================================
-- 6. INSERCIÓN DE DATOS DE PRUEBA
-- =====================================================

-- Insertar nuevo formulario
INSERT INTO AC_TPIR_FORMULARIO_GLOBAL (
    AC_TRABAJO_PIR,
    AC_MUNICIPIO_PIR,
    AC_NUMERO_X_PIR,
    AC_REGIONAL_PIR,
    AC_DIRECCION_PIR,
    AC_NUMERO_Y_PIR,
    AC_ALIMENTADOR_PIR,
    AC_BARRIO_VEREDA_PIR,
    AC_NIVEL_TENSION_PIR,
    AC_CIRCUITO_PIR
) VALUES (
    'Instalación Poste Prueba VS Code',
    'Cali',
    3.451647,
    'Valle',
    'Avenida 6N # 25-67',
    -76.531985,
    'ALM-CAL-01',
    'San Fernando',
    '13.2 kV',
    'CTO-CAL-01'
);

-- Confirmar inserción
COMMIT;

-- Ver el último registro insertado
SELECT * FROM AC_TPIR_FORMULARIO_GLOBAL 
WHERE AC_ID_PIR = (SELECT MAX(AC_ID_PIR) FROM AC_TPIR_FORMULARIO_GLOBAL);

-- Insertar estructura nueva para el formulario recién creado
INSERT INTO AC_TPIR_ESTRUCTURA_NUEVA (
    AC_FORMULARIO_ID_PIR,
    AC_COD_EST_PIR,
    AC_APOYO_PIR,
    AC_MATERIAL_PIR,
    AC_ALTURA_PIR,
    AC_TIPO_RED_PIR,
    AC_DISPOSICION_PIR,
    AC_KGF_PIR,
    AC_POBLACION_PIR
) VALUES (
    (SELECT MAX(AC_ID_PIR) FROM AC_TPIR_FORMULARIO_GLOBAL),
    'EST-VS-001',
    'Poste Metálico',
    'Acero Galvanizado',
    14.0,
    'Aérea',
    'Vertical',
    2000.00,
    'Urbana'
);

-- Confirmar inserción
COMMIT;

-- =====================================================
-- 7. CONSULTAS DE MANTENIMIENTO
-- =====================================================

-- Verificar integridad referencial
SELECT 
    'Estructuras nuevas huérfanas' as "Verificación",
    COUNT(*) as "Cantidad"
FROM AC_TPIR_ESTRUCTURA_NUEVA e
LEFT JOIN AC_TPIR_FORMULARIO_GLOBAL f ON e.AC_FORMULARIO_ID_PIR = f.AC_ID_PIR
WHERE f.AC_ID_PIR IS NULL
UNION ALL
SELECT 
    'Proyectos huérfanos' as "Verificación",
    COUNT(*) as "Cantidad"
FROM AC_PROYECTO_INFO p
LEFT JOIN AC_TPIR_FORMULARIO_GLOBAL f ON p.AC_FORMULARIO_ID_PIR = f.AC_ID_PIR
WHERE f.AC_ID_PIR IS NULL;

-- Verificar secuencias
SELECT 
    sequence_name as "Secuencia",
    last_number as "Último Número",
    increment_by as "Incremento"
FROM user_sequences
WHERE sequence_name LIKE 'AC_%'
ORDER BY sequence_name;

-- Verificar triggers
SELECT 
    trigger_name as "Trigger",
    table_name as "Tabla",
    status as "Estado"
FROM user_triggers
WHERE trigger_name LIKE 'TRG_%'
ORDER BY table_name;

-- =====================================================
-- 8. CONSULTAS AVANZADAS
-- =====================================================

-- Formularios con mayor cantidad de estructuras
SELECT 
    f.AC_TRABAJO_PIR as "Trabajo",
    f.AC_MUNICIPIO_PIR as "Municipio",
    COUNT(e.AC_ID_PIR) as "Estructuras",
    AVG(e.AC_ALTURA_PIR) as "Altura Promedio"
FROM AC_TPIR_FORMULARIO_GLOBAL f
LEFT JOIN AC_TPIR_ESTRUCTURA_NUEVA e ON f.AC_ID_PIR = e.AC_FORMULARIO_ID_PIR
GROUP BY f.AC_ID_PIR, f.AC_TRABAJO_PIR, f.AC_MUNICIPIO_PIR
HAVING COUNT(e.AC_ID_PIR) > 0
ORDER BY COUNT(e.AC_ID_PIR) DESC;

-- Buscar formularios por coordenadas (ejemplo de búsqueda geográfica)
SELECT 
    AC_ID_PIR as "ID",
    AC_TRABAJO_PIR as "Trabajo",
    AC_MUNICIPIO_PIR as "Municipio",
    AC_NUMERO_X_PIR as "Latitud",
    AC_NUMERO_Y_PIR as "Longitud",
    ROUND(
        SQRT(
            POWER(AC_NUMERO_X_PIR - 4.60971, 2) + 
            POWER(AC_NUMERO_Y_PIR - (-74.08175), 2)
        ) * 111000
    ) as "Distancia (m)"
FROM AC_TPIR_FORMULARIO_GLOBAL
WHERE AC_NUMERO_X_PIR IS NOT NULL 
  AND AC_NUMERO_Y_PIR IS NOT NULL
ORDER BY 
    SQRT(
        POWER(AC_NUMERO_X_PIR - 4.60971, 2) + 
        POWER(AC_NUMERO_Y_PIR - (-74.08175), 2)
    );

-- Análisis temporal de creación de formularios
SELECT 
    TO_CHAR(AC_CREATED_AT_PIR, 'YYYY-MM') as "Mes",
    COUNT(*) as "Formularios Creados"
FROM AC_TPIR_FORMULARIO_GLOBAL
GROUP BY TO_CHAR(AC_CREATED_AT_PIR, 'YYYY-MM')
ORDER BY TO_CHAR(AC_CREATED_AT_PIR, 'YYYY-MM');

-- =====================================================
-- 9. LIMPIEZA DE DATOS DE PRUEBA (OPCIONAL)
-- =====================================================

-- CUIDADO: Estas consultas eliminan datos
-- Descomentar solo si desea limpiar datos de prueba

-- DELETE FROM AC_TPIR_ESTRUCTURA_NUEVA 
-- WHERE AC_FORMULARIO_ID_PIR IN (
--     SELECT AC_ID_PIR FROM AC_TPIR_FORMULARIO_GLOBAL 
--     WHERE AC_TRABAJO_PIR LIKE '%Prueba%'
-- );

-- DELETE FROM AC_PROYECTO_INFO 
-- WHERE AC_FORMULARIO_ID_PIR IN (
--     SELECT AC_ID_PIR FROM AC_TPIR_FORMULARIO_GLOBAL 
--     WHERE AC_TRABAJO_PIR LIKE '%Prueba%'
-- );

-- DELETE FROM AC_TPIR_FORMULARIO_GLOBAL 
-- WHERE AC_TRABAJO_PIR LIKE '%Prueba%';

-- COMMIT;

-- =====================================================
-- FIN DE CONSULTAS DE EJEMPLO
-- =====================================================
