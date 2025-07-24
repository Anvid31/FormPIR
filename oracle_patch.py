"""
Parche para usar oracledb en lugar de cx_Oracle con Django.
Este archivo debe ser importado antes de que Django intente cargar el backend de Oracle.
"""
import sys
import oracledb

# Crear un alias para que Django piense que cx_Oracle está disponible
sys.modules['cx_Oracle'] = oracledb

# También crear alias para las funciones y clases que Django espera
oracledb.Error = oracledb.Error
oracledb.IntegrityError = oracledb.IntegrityError
oracledb.DatabaseError = oracledb.DatabaseError
oracledb.OperationalError = oracledb.OperationalError
oracledb.InterfaceError = oracledb.InterfaceError
oracledb.InternalError = oracledb.InternalError
oracledb.ProgrammingError = oracledb.ProgrammingError
oracledb.NotSupportedError = oracledb.NotSupportedError

# Configuración para modo thin (sin Oracle Client)
try:
    oracledb.init_oracle_client(lib_dir=None)
except Exception:
    # Ya está inicializado o no es necesario
    pass

print("Oracle DB configurado como reemplazo de cx_Oracle")
