from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Diagnostica problemas de visualización en Oracle/DBeaver'

    def handle(self, *args, **options):
        cursor = connection.cursor()
        
        print("=" * 60)
        print("DIAGNÓSTICO DE ORACLE - VISUALIZACIÓN DE DATOS")
        print("=" * 60)
        
        # 1. Información de conexión
        print("\n1. INFORMACIÓN DE CONEXIÓN:")
        db_settings = connection.settings_dict
        print(f"   Usuario: {db_settings.get('USER', 'No definido')}")
        print(f"   Host: {db_settings.get('HOST', 'No definido')}")
        print(f"   Puerto: {db_settings.get('PORT', 'No definido')}")
        print(f"   Service Name: {db_settings.get('NAME', 'No definido')}")
        
        # 2. Información de sesión
        print("\n2. INFORMACIÓN DE SESIÓN:")
        cursor.execute("SELECT USER FROM DUAL")
        current_user = cursor.fetchone()[0]
        print(f"   Usuario actual: {current_user}")
        
        cursor.execute("SELECT SYS_CONTEXT('USERENV','SESSION_USER') FROM DUAL")
        session_user = cursor.fetchone()[0]
        print(f"   Usuario de sesión: {session_user}")
        
        cursor.execute("SELECT SYS_CONTEXT('USERENV','CURRENT_SCHEMA') FROM DUAL")
        current_schema = cursor.fetchone()[0]
        print(f"   Esquema actual: {current_schema}")
        
        # 3. Verificar autocommit
        print("\n3. CONFIGURACIÓN DE TRANSACCIONES:")
        print(f"   Autocommit Django: {connection.get_autocommit()}")
        
        # 4. Listar todas las tablas accesibles
        print("\n4. TABLAS ACCESIBLES:")
        cursor.execute("""
            SELECT table_name, owner 
            FROM all_tables 
            WHERE table_name LIKE 'AC_%PIR' 
            ORDER BY owner, table_name
        """)
        tables = cursor.fetchall()
        for table_name, owner in tables:
            print(f"   {owner}.{table_name}")
        
        # 5. Verificar datos en nuestras tablas específicas
        print("\n5. DATOS EN TABLAS PRINCIPALES:")
        tables_to_check = [
            'AC_FORMULARIO_GLOBAL_PIR',
            'AC_ESTRUCTURA_NUEVA_PIR'
        ]
        
        for table in tables_to_check:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"   {table}: {count} registros")
                
                if count > 0:
                    # Mostrar algunos datos de muestra
                    cursor.execute(f"""
                        SELECT * FROM (
                            SELECT * FROM {table} ORDER BY 1 DESC
                        ) WHERE ROWNUM <= 2
                    """)
                    rows = cursor.fetchall()
                    columns = [desc[0] for desc in cursor.description]
                    print(f"     Columnas: {', '.join(columns[:5])}...")
                    for row in rows:
                        print(f"     Muestra: {row[:3]}...")
                        
            except Exception as e:
                print(f"   {table}: ERROR - {e}")
        
        # 6. Verificar permisos
        print("\n6. PERMISOS EN TABLAS:")
        for table in tables_to_check:
            try:
                cursor.execute(f"""
                    SELECT privilege, grantee, grantor 
                    FROM user_tab_privs 
                    WHERE table_name = '{table}'
                """)
                privs = cursor.fetchall()
                if privs:
                    print(f"   {table}: {len(privs)} permisos")
                    for priv, grantee, grantor in privs[:2]:
                        print(f"     {priv} de {grantor} a {grantee}")
                else:
                    print(f"   {table}: Sin permisos específicos visibles")
            except Exception as e:
                print(f"   {table}: Error verificando permisos - {e}")
        
        # 7. Información de commit
        print("\n7. ESTADO DE TRANSACCIONES:")
        try:
            cursor.execute("SELECT * FROM v$transaction")
            transactions = cursor.fetchall()
            print(f"   Transacciones activas: {len(transactions)}")
        except:
            print("   No se puede acceder a v$transaction")
        
        # 8. Ejecutar commit explícito
        print("\n8. EJECUTANDO COMMIT EXPLÍCITO...")
        try:
            cursor.execute("COMMIT")
            print("   ✓ Commit ejecutado exitosamente")
        except Exception as e:
            print(f"   ✗ Error en commit: {e}")
        
        print("\n" + "=" * 60)
        print("INSTRUCCIONES PARA DBEAVER:")
        print("=" * 60)
        print("1. Haz clic derecho en la conexión → Refresh")
        print("2. Haz clic derecho en la tabla → Refresh")
        print("3. Verifica que no hay filtros activos (icono de embudo)")
        print("4. Asegúrate de estar en el esquema correcto (DESS_USER)")
        print("5. Si sigue sin funcionar, desconecta y reconecta DBeaver")
        print("6. Verifica la configuración de autocommit en DBeaver")
