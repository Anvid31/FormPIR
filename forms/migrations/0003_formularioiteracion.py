from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('forms', '0002_formularioglobal_activo'),
    ]

    operations = [
        migrations.CreateModel(
            name='FormularioIteracion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_key', models.CharField(help_text='Clave de sesión para iteraciones temporales', max_length=40)),
                ('formulario_id', models.CharField(blank=True, help_text='ID definitivo del formulario', max_length=50, null=True)),
                ('seccion', models.CharField(choices=[('estructuras', 'Estructuras'), ('conductores', 'Conductores'), ('equipos', 'Equipos'), ('transformador', 'Transformador')], max_length=20)),
                ('estado', models.CharField(choices=[('temporal', 'Temporal'), ('definitivo', 'Definitivo'), ('eliminado', 'Eliminado')], default='temporal', max_length=10)),
                ('numero_iteracion', models.IntegerField(default=1)),
                ('nombre_proyecto', models.CharField(max_length=200)),
                ('banco_proyecto', models.CharField(blank=True, max_length=100)),
                ('contrato', models.CharField(blank=True, max_length=200)),
                ('municipio', models.CharField(blank=True, max_length=100)),
                ('departamento', models.CharField(blank=True, max_length=100)),
                ('regional', models.CharField(blank=True, max_length=100)),
                ('latitud_inicial', models.DecimalField(blank=True, decimal_places=8, max_digits=12, null=True)),
                ('longitud_inicial', models.DecimalField(blank=True, decimal_places=8, max_digits=12, null=True)),
                ('latitud_final', models.DecimalField(blank=True, decimal_places=8, max_digits=12, null=True)),
                ('longitud_final', models.DecimalField(blank=True, decimal_places=8, max_digits=12, null=True)),
                ('direccion', models.CharField(blank=True, max_length=200)),
                ('cantidad', models.IntegerField(default=1)),
                ('datos_especificos', models.JSONField(default=dict, help_text='Datos específicos de cada sección')),
                ('fecha_creacion', models.DateTimeField(default=django.utils.timezone.now)),
                ('fecha_actualizacion', models.DateTimeField(auto_now=True)),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'formulario_iteraciones',
                'ordering': ['seccion', 'numero_iteracion'],
            },
        ),
        migrations.AddConstraint(
            model_name='formularioiteracion',
            constraint=models.UniqueConstraint(fields=('session_key', 'seccion', 'numero_iteracion', 'estado'), name='unique_iteracion_per_session'),
        ),
    ]
