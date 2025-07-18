from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Lista las tablas existentes en Oracle'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute("SELECT table_name FROM user_tables ORDER BY table_name")
            tables = cursor.fetchall()
            
            self.stdout.write(self.style.SUCCESS('Tablas existentes en Oracle:'))
            for table in tables:
                self.stdout.write(f'  - {table[0]}')
            
            if not tables:
                self.stdout.write(self.style.WARNING('No se encontraron tablas.'))
