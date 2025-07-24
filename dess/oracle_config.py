"""
Oracle Database configuration utilities for DESS project using oracledb.
"""
import oracledb
from decouple import config
import logging

logger = logging.getLogger(__name__)

class OracleConfig:
    """Oracle database configuration manager."""
    
    @staticmethod
    def init_oracle_client():
        """Initialize Oracle client in thin mode."""
        try:
            # Using thin mode by default (no client installation required)
            oracledb.init_oracle_client(lib_dir=None)
            logger.info("Using Oracle thin mode (no client installation required)")
        except Exception as e:
            logger.error(f"Oracle client initialization failed: {e}")
    
    @staticmethod
    def get_connection_string():
        """Get the Oracle connection string from environment variables."""
        host = config('DB_HOST', default='localhost')
        port = config('DB_PORT', default='1521')
        service = config('DB_SERVICE_NAME', default='XE')
        return f"{host}:{port}/{service}"
    
    @staticmethod
    def get_django_connection_string():
        """Get Oracle connection string exactly as Django expects it."""
        host = config('DB_HOST', default='localhost')
        port = config('DB_PORT', default='1521')
        service_name = config('DB_SERVICE_NAME', default='XE')
        
        # Django Oracle backend expects this format in the NAME field
        return f"{host}:{port}/{service_name}"
    
    @staticmethod
    def test_connection():
        """Test Oracle database connection."""
        try:
            user = config('DB_USER', default='FORM_PIR')
            password = config('DB_PASSWORD', default='dess123')
            dsn = OracleConfig.get_connection_string()
            
            with oracledb.connect(user=user, password=password, dsn=dsn) as connection:
                with connection.cursor() as cursor:
                    cursor.execute("SELECT 1 FROM DUAL")
                    result = cursor.fetchone()
                    logger.info(f"Oracle connection test successful: {result}")
                    return True
        except Exception as e:
            logger.error(f"Oracle connection test failed: {e}")
            return False
    
    @staticmethod
    def get_oracle_version():
        """Get Oracle database version."""
        try:
            user = config('DB_USER', default='FORM_PIR')
            password = config('DB_PASSWORD', default='dess123')
            dsn = OracleConfig.get_connection_string()
            
            with oracledb.connect(user=user, password=password, dsn=dsn) as connection:
                with connection.cursor() as cursor:
                    cursor.execute("SELECT BANNER FROM V$VERSION WHERE ROWNUM = 1")
                    result = cursor.fetchone()
                    return result[0] if result else "Unknown"
        except Exception as e:
            logger.error(f"Failed to get Oracle version: {e}")
            return "Unknown"
    
    @staticmethod
    def get_database_info():
        """Get comprehensive Oracle database information."""
        try:
            user = config('DB_USER', default='FORM_PIR')
            password = config('DB_PASSWORD', default='dess123')
            dsn = OracleConfig.get_connection_string()
            
            with oracledb.connect(user=user, password=password, dsn=dsn) as connection:
                with connection.cursor() as cursor:
                    # Get database name
                    cursor.execute("SELECT NAME FROM V$DATABASE")
                    db_name = cursor.fetchone()[0]
                    
                    # Get instance name
                    cursor.execute("SELECT INSTANCE_NAME FROM V$INSTANCE")
                    instance_name = cursor.fetchone()[0]
                    
                    # Get tablespace info
                    cursor.execute("""
                        SELECT TABLESPACE_NAME, STATUS 
                        FROM USER_TABLESPACES
                    """)
                    tablespaces = cursor.fetchall()
                    
                    return {
                        'database_name': db_name,
                        'instance_name': instance_name,
                        'tablespaces': tablespaces,
                        'connection_string': dsn
                    }
        except Exception as e:
            logger.error(f"Failed to get database info: {e}")
            return None

# Initialize Oracle client when module is imported
OracleConfig.init_oracle_client()
