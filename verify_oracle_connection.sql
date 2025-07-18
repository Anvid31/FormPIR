-- =====================================================
-- Script de verificación de conexión Oracle
-- FormPIR - Sistema de Formularios para Postes
-- =====================================================

-- Verificar la conexión y el usuario actual
SELECT 
    USER as "Usuario Actual",
    SYS_CONTEXT('USERENV', 'SESSION_USER') as "Usuario Sesión",
    SYS_CONTEXT('USERENV', 'CURRENT_SCHEMA') as "Esquema Actual",
    SYS_CONTEXT('USERENV', 'DB_NAME') as "Base de Datos",
    SYS_CONTEXT('USERENV', 'SERVER_HOST') as "Servidor",
    TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI:SS') as "Fecha y Hora"
FROM DUAL;

-- =====================================================
-- Verificar tablas del esquema FORM_PIR
-- =====================================================

PROMPT
PROMPT Tablas en el esquema FORM_PIR:
PROMPT =====================================

SELECT 
    TABLE_NAME as "Tabla",
    NUM_ROWS as "Filas",
    TABLESPACE_NAME as "Tablespace",
    STATUS as "Estado"
FROM USER_TABLES
WHERE TABLE_NAME LIKE 'AC_%'
ORDER BY TABLE_NAME;

-- =====================================================
-- Verificar secuencias
-- =====================================================

PROMPT
PROMPT Secuencias en el esquema FORM_PIR:
PROMPT ===================================

SELECT 
    SEQUENCE_NAME as "Secuencia",
    LAST_NUMBER as "Último Número",
    INCREMENT_BY as "Incremento",
    CACHE_SIZE as "Cache"
FROM USER_SEQUENCES
WHERE SEQUENCE_NAME LIKE 'AC_%'
ORDER BY SEQUENCE_NAME;

-- =====================================================
-- Verificar triggers
-- =====================================================

PROMPT
PROMPT Triggers en el esquema FORM_PIR:
PROMPT ================================

SELECT 
    TRIGGER_NAME as "Trigger",
    TABLE_NAME as "Tabla",
    STATUS as "Estado",
    TRIGGER_TYPE as "Tipo"
FROM USER_TRIGGERS
WHERE TRIGGER_NAME LIKE 'TRG_%'
ORDER BY TABLE_NAME, TRIGGER_NAME;

-- =====================================================
-- Verificar índices
-- =====================================================

PROMPT
PROMPT Índices en el esquema FORM_PIR:
PROMPT ===============================

SELECT 
    INDEX_NAME as "Índice",
    TABLE_NAME as "Tabla",
    UNIQUENESS as "Único",
    STATUS as "Estado"
FROM USER_INDEXES
WHERE TABLE_NAME LIKE 'AC_%'
ORDER BY TABLE_NAME, INDEX_NAME;

-- =====================================================
-- Verificar restricciones (constraints)
-- =====================================================

PROMPT
PROMPT Restricciones en el esquema FORM_PIR:
PROMPT =====================================

SELECT 
    CONSTRAINT_NAME as "Restricción",
    TABLE_NAME as "Tabla",
    CONSTRAINT_TYPE as "Tipo",
    STATUS as "Estado"
FROM USER_CONSTRAINTS
WHERE TABLE_NAME LIKE 'AC_%'
ORDER BY TABLE_NAME, CONSTRAINT_TYPE;

-- =====================================================
-- Verificar datos de prueba
-- =====================================================

PROMPT
PROMPT Datos de prueba en las tablas:
PROMPT ==============================

-- Formulario Global
SELECT 'AC_TPIR_FORMULARIO_GLOBAL' as "Tabla", COUNT(*) as "Registros" FROM AC_TPIR_FORMULARIO_GLOBAL
UNION ALL
SELECT 'AC_TPIR_ESTRUCTURA_NUEVA' as "Tabla", COUNT(*) as "Registros" FROM AC_TPIR_ESTRUCTURA_NUEVA
UNION ALL
SELECT 'AC_ESTRUCTURA_RETIRADA' as "Tabla", COUNT(*) as "Registros" FROM AC_ESTRUCTURA_RETIRADA
UNION ALL
SELECT 'AC_PROYECTO_INFO' as "Tabla", COUNT(*) as "Registros" FROM AC_PROYECTO_INFO
ORDER BY "Tabla";

-- =====================================================
-- Consulta detallada de datos de prueba
-- =====================================================

PROMPT
PROMPT Datos del formulario de prueba:
PROMPT ===============================

SELECT 
    AC_ID_PIR as "ID",
    AC_TRABAJO_PIR as "Trabajo",
    AC_MUNICIPIO_PIR as "Municipio",
    AC_REGIONAL_PIR as "Regional",
    TO_CHAR(AC_CREATED_AT_PIR, 'DD/MM/YYYY HH24:MI:SS') as "Fecha Creación"
FROM AC_TPIR_FORMULARIO_GLOBAL
ORDER BY AC_ID_PIR;

PROMPT
PROMPT Estructuras nuevas:
PROMPT ==================

SELECT 
    AC_ID_PIR as "ID",
    AC_FORMULARIO_ID_PIR as "Form ID",
    AC_COD_EST_PIR as "Código",
    AC_MATERIAL_PIR as "Material",
    AC_ALTURA_PIR as "Altura"
FROM AC_TPIR_ESTRUCTURA_NUEVA
ORDER BY AC_ID_PIR;

PROMPT
PROMPT Información de proyectos:
PROMPT ========================

SELECT 
    AC_ID_PIR as "ID",
    AC_FORMULARIO_ID_PIR as "Form ID",
    AC_NOMBRE_PIR as "Nombre Proyecto",
    AC_CONTRATO_PIR as "Contrato"
FROM AC_PROYECTO_INFO
ORDER BY AC_ID_PIR;

-- =====================================================
-- Verificar permisos del usuario
-- =====================================================

PROMPT
PROMPT Permisos del usuario FORM_PIR:
PROMPT ==============================

SELECT 
    PRIVILEGE as "Permiso",
    ADMIN_OPTION as "Admin"
FROM USER_SYS_PRIVS
ORDER BY PRIVILEGE;

-- =====================================================
-- Información del sistema
-- =====================================================

PROMPT
PROMPT Información del sistema Oracle:
PROMPT ===============================

SELECT 
    BANNER as "Versión Oracle"
FROM V$VERSION
WHERE BANNER LIKE 'Oracle%';

-- Espacio en tablespace
SELECT 
    TABLESPACE_NAME as "Tablespace",
    ROUND(BYTES/1024/1024, 2) as "MB Usados",
    ROUND(MAX_BYTES/1024/1024, 2) as "MB Máximos"
FROM USER_TS_QUOTAS
WHERE TABLESPACE_NAME = 'USERS';

PROMPT
PROMPT =====================================================
PROMPT ✓ VERIFICACIÓN COMPLETADA
PROMPT =====================================================
