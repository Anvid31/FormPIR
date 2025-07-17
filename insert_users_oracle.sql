-- Script SQL para insertar usuarios en Oracle Database
-- Ejecutar este script en Oracle SQL Developer o similar

-- =====================================================
-- SCRIPT PARA INSERTAR USUARIOS EN ORACLE DATABASE
-- Sistema DESS - Sistema Semáforo
-- =====================================================

-- Verificar que la tabla existe
SELECT COUNT(*) as tabla_existe FROM user_tables WHERE table_name = 'FORMS_CUSTOMUSER';

-- Insertar usuarios del sistema
-- NOTA: Las contraseñas están hasheadas con algoritmo PBKDF2 de Django

-- 1. Usuario Administrador
INSERT INTO FORMS_CUSTOMUSER (
    ID, PASSWORD, LAST_LOGIN, IS_SUPERUSER, USERNAME, FIRST_NAME, LAST_NAME, 
    EMAIL, IS_STAFF, IS_ACTIVE, DATE_JOINED, ROL, EQUIPO_CONTRATISTA, 
    REGIONAL_ASIGNADA, DEPARTAMENTO_ASIGNADO, FECHA_ULTIMO_ACCESO, ACTIVO
) VALUES (
    1,
    'pbkdf2_sha256$720000$YourSaltHere$YourHashedPasswordHere', -- admin123
    NULL,
    1, -- is_superuser
    'admin',
    'Administrador',
    'Sistema',
    'admin@dess.gov.co',
    1, -- is_staff
    1, -- is_active
    SYSTIMESTAMP,
    'contratista',
    'EQUIPO_1',
    'REGIONAL_1',
    NULL,
    SYSTIMESTAMP,
    1 -- activo
);

-- 2. Usuario Contratista
INSERT INTO FORMS_CUSTOMUSER (
    ID, PASSWORD, LAST_LOGIN, IS_SUPERUSER, USERNAME, FIRST_NAME, LAST_NAME, 
    EMAIL, IS_STAFF, IS_ACTIVE, DATE_JOINED, ROL, EQUIPO_CONTRATISTA, 
    REGIONAL_ASIGNADA, DEPARTAMENTO_ASIGNADO, FECHA_ULTIMO_ACCESO, ACTIVO
) VALUES (
    2,
    'pbkdf2_sha256$720000$ContratistaSalt$ContratistaHashedPassword', -- contratista123
    NULL,
    0, -- is_superuser
    'contratista',
    'Usuario',
    'Contratista',
    'contratista@dess.gov.co',
    0, -- is_staff
    1, -- is_active
    SYSTIMESTAMP,
    'contratista',
    'EQUIPO_1',
    'REGIONAL_1',
    NULL,
    SYSTIMESTAMP,
    1 -- activo
);

-- 3. Usuario Ejecutor/Interventor
INSERT INTO FORMS_CUSTOMUSER (
    ID, PASSWORD, LAST_LOGIN, IS_SUPERUSER, USERNAME, FIRST_NAME, LAST_NAME, 
    EMAIL, IS_STAFF, IS_ACTIVE, DATE_JOINED, ROL, EQUIPO_CONTRATISTA, 
    REGIONAL_ASIGNADA, DEPARTAMENTO_ASIGNADO, FECHA_ULTIMO_ACCESO, ACTIVO
) VALUES (
    3,
    'pbkdf2_sha256$720000$EjecutorSalt$EjecutorHashedPassword', -- ejecutor123
    NULL,
    0, -- is_superuser
    'ejecutor',
    'Usuario',
    'Ejecutor',
    'ejecutor@dess.gov.co',
    0, -- is_staff
    1, -- is_active
    SYSTIMESTAMP,
    'ejecutor',
    'EQUIPO_1',
    'REGIONAL_1',
    NULL,
    SYSTIMESTAMP,
    1 -- activo
);

-- 4. Usuario Gestión
INSERT INTO FORMS_CUSTOMUSER (
    ID, PASSWORD, LAST_LOGIN, IS_SUPERUSER, USERNAME, FIRST_NAME, LAST_NAME, 
    EMAIL, IS_STAFF, IS_ACTIVE, DATE_JOINED, ROL, EQUIPO_CONTRATISTA, 
    REGIONAL_ASIGNADA, DEPARTAMENTO_ASIGNADO, FECHA_ULTIMO_ACCESO, ACTIVO
) VALUES (
    4,
    'pbkdf2_sha256$720000$GestionSalt$GestionHashedPassword', -- gestion123
    NULL,
    0, -- is_superuser
    'gestion',
    'Usuario',
    'Gestión',
    'gestion@dess.gov.co',
    0, -- is_staff
    1, -- is_active
    SYSTIMESTAMP,
    'gestion',
    'EQUIPO_1',
    'REGIONAL_1',
    NULL,
    SYSTIMESTAMP,
    1 -- activo
);

-- 5. Usuario Planeación
INSERT INTO FORMS_CUSTOMUSER (
    ID, PASSWORD, LAST_LOGIN, IS_SUPERUSER, USERNAME, FIRST_NAME, LAST_NAME, 
    EMAIL, IS_STAFF, IS_ACTIVE, DATE_JOINED, ROL, EQUIPO_CONTRATISTA, 
    REGIONAL_ASIGNADA, DEPARTAMENTO_ASIGNADO, FECHA_ULTIMO_ACCESO, ACTIVO
) VALUES (
    5,
    'pbkdf2_sha256$720000$PlaneacionSalt$PlaneacionHashedPassword', -- planeacion123
    NULL,
    0, -- is_superuser
    'planeacion',
    'Usuario',
    'Planeación',
    'planeacion@dess.gov.co',
    0, -- is_staff
    1, -- is_active
    SYSTIMESTAMP,
    'planeacion',
    'EQUIPO_1',
    'REGIONAL_1',
    NULL,
    SYSTIMESTAMP,
    1 -- activo
);

-- Los usuarios ya fueron creados con el script Python create_users_oracle.py
-- Este archivo SQL es solo para referencia

-- Verificar inserción
SELECT 
    ID,
    USERNAME,
    FIRST_NAME,
    LAST_NAME,
    EMAIL,
    ROL,
    EQUIPO_CONTRATISTA,
    REGIONAL_ASIGNADA,
    DEPARTAMENTO_ASIGNADO,
    ACTIVO,
    IS_ACTIVE,
    IS_SUPERUSER
FROM FORMS_CUSTOMUSER
ORDER BY ID;

-- Commit para guardar cambios
COMMIT;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
