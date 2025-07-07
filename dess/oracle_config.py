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
            logger.info("Using Oracle thin mode (no client installation required)")
        except Exception as e:
            logger.error(f"Oracle client initialization failed: {e}")
    
    @staticmethod
    def get_connection_string():
        """Get the Oracle connection string from environment variables."""
        host = config('DB_HOST', default='localhost')
        port = config('DB_PORT', default='1521')
        service = config('DB_SERVICE_NAME', default='XEPDB1')
        return f"{host}:{port}/{service}"
    
    @staticmethod
    def get_django_connection_string():
        """Get Oracle connection string exactly as Django expects it."""
        host = config('DB_HOST', default='localhost')
        port = config('DB_PORT', default='1521')
        service_name = config('DB_SERVICE_NAME', default='XEPDB1')
        
        # Django Oracle backend expects this format in the NAME field
        return f"{host}:{port}/{service_name}"
    
    @staticmethod
    def test_connection():
        """Test Oracle database connection."""
        try:
            user = config('DB_USER', default='system')
            password = config('DB_PASSWORD', default='')
            dsn = OracleConfig.get_connection_string()
            
            with oracledb.connect(user=user, password=password, dsn=dsn) as connection:
                with connection.cursor() as cursor:
                    cursor.execute("SELECT 1 FROM DUAL")
                    result = cursor.fetchone()
                    logger.info(f"Oracle connection test successful: {result}")
                    return True
        except Exception as e:
            logger.error(f"Oracle connection test failed: {e}")
            return 
    
    @staticmethod
    def get_oracle_version():
        """Get Oracle database version."""
        try:
            user = config('DB_USER', default='system')
            password = config('DB_PASSWORD', default='')
            dsn = OracleConfig.get_connection_string()
            
            with oracledb.connect(user=user, password=password, dsn=dsn) as connection:
                with connection.cursor() as cursor:
                    cursor.execute("SELECT BANNER FROM V$VERSION WHERE ROWNUM = 1")
                    version = cursor.fetchone()
                    return version[0] if version else "Unknown"
        except Exception as e:
            logger.error(f"Failed to get Oracle version: {e}")
            return "Error retrieving version"
    
    @staticmethod
    def get_database_info():
        """Get comprehensive Oracle database information."""
        try:
            user = config('DB_USER', default='system')
            password = config('DB_PASSWORD', default='')
            dsn = OracleConfig.get_connection_string()
            
            info = {}
            with oracledb.connect(user=user, password=password, dsn=dsn) as connection:
                with connection.cursor() as cursor:
                    # Database version
                    cursor.execute("SELECT BANNER FROM V$VERSION WHERE ROWNUM = 1")
                    version = cursor.fetchone()
                    info['version'] = version[0] if version else "Unknown"
                    
                    # Current user
                    cursor.execute("SELECT USER FROM DUAL")
                    current_user = cursor.fetchone()
                    info['current_user'] = current_user[0] if current_user else "Unknown"
                    
                    # Database name
                    cursor.execute("SELECT NAME FROM V$DATABASE")
                    db_name = cursor.fetchone()
                    info['database_name'] = db_name[0] if db_name else "Unknown"
                    
                    # Instance name
                    cursor.execute("SELECT INSTANCE_NAME FROM V$INSTANCE")
                    instance = cursor.fetchone()
                    info['instance_name'] = instance[0] if instance else "Unknown"
                    
            return info
        except Exception as e:
            logger.error(f"Failed to get database info: {e}")
            return {'error': str(e)}