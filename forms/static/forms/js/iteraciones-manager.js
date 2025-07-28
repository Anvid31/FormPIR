/**
 * DESS - Sistema de Iteraciones Temporales/Definitivas
 * Maneja la tabla compartida entre las 4 secciones
 */

class IteracionesManager {
    constructor() {
        this.iteraciones = [];
        this.seccionActual = 'estructuras';
        this.apiBase = `${window.location.protocol}//${window.location.host}/iteraciones`;
        this.init();
    }

    init() {
        console.log('🔄 Inicializando IteracionesManager...');
        this.cargarIteracionesTemporales();
        this.configurarEventos();
        this.actualizarTabla();
    }

    /**
     * Configurar eventos globales
     */
    configurarEventos() {
        // Botón agregar iteración (presente en todas las secciones)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-agregar-iteracion')) {
                e.preventDefault();
                this.agregarIteracion();
            }
        });

        // Botones eliminar iteración
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-eliminar-iteracion')) {
                e.preventDefault();
                const iteracionId = e.target.dataset.iteracionId;
                this.eliminarIteracion(iteracionId);
            }
        });

        // Hook para cambio de sección
        document.addEventListener('seccionCambiada', (e) => {
            this.seccionActual = e.detail.seccion;
            this.actualizarTabla();
        });

        // Finalizar iteraciones al enviar formulario
        const form = document.getElementById('mainForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.finalizarIteraciones();
            });
        }
    }

    /**
     * Obtener datos del formulario actual
     */
    obtenerDatosFormulario() {
        console.log(`📋 Obteniendo datos del formulario para sección: ${this.seccionActual}`);
        
        const datos = {
            seccion: this.seccionActual,
            // Información del proyecto (común a todas las secciones)
            nombre_proyecto: this.obtenerValorCampo('nombre'),
            banco_proyecto: this.obtenerValorCampo('banco_proyecto'),
            contrato: this.obtenerValorCampo('contrato'),
            municipio: this.obtenerValorCampo('municipio'),
            departamento: this.obtenerValorCampo('departamento'),
            regional: this.obtenerValorCampo('regional'),
            
            // Coordenadas
            latitud_inicial: this.obtenerValorCampo('latitud'),
            longitud_inicial: this.obtenerValorCampo('longitud'),
            latitud_final: this.obtenerValorCampo('latitud_final'),
            longitud_final: this.obtenerValorCampo('longitud_final'),
            
            // Otros campos comunes
            direccion: this.obtenerValorCampo('direccion'),
            cantidad: this.obtenerValorCampo('cantidad') || 1,
            
            // Datos específicos por sección
            datos_especificos: this.obtenerDatosEspecificos()
        };

        // Log de debugging para identificar problemas
        console.log('📊 Datos obtenidos del formulario:');
        Object.entries(datos).forEach(([key, value]) => {
            if (typeof value === 'string' && value.length > 50) {
                console.warn(`⚠️ Campo ${key} tiene valor muy largo:`, value.substring(0, 100) + '...');
            } else {
                console.log(`  ${key}:`, value);
            }
        });

        return datos;
    }

    /**
     * Obtener valor de campo por ID (intenta diferentes variaciones)
     */
    obtenerValorCampo(id) {
        // Intentar ID directo
        let elemento = document.getElementById(id);
        if (elemento) {
            return this.extraerValorElemento(elemento);
        }

        // Intentar con prefijo de sección
        elemento = document.getElementById(`${this.seccionActual}_${id}`);
        if (elemento) {
            return this.extraerValorElemento(elemento);
        }

        return '';
    }

    /**
     * Extraer valor correcto según el tipo de elemento
     */
    extraerValorElemento(elemento) {
        if (!elemento) return '';

        // Para elementos SELECT, siempre usar .value
        if (elemento.tagName === 'SELECT') {
            return elemento.value || '';
        }

        // Para elementos INPUT, usar .value
        if (elemento.tagName === 'INPUT') {
            return elemento.value || '';
        }

        // Para elementos TEXTAREA, usar .value
        if (elemento.tagName === 'TEXTAREA') {
            return elemento.value || '';
        }

        // Para otros elementos, usar textContent pero filtrar
        const textContent = elemento.textContent || '';
        
        // Si el textContent es muy largo (más de 100 caracteres), probablemente es concatenación incorrecta
        if (textContent.length > 100) {
            console.warn(`⚠️ Texto muy largo para campo ${elemento.id}: "${textContent.substring(0, 50)}..."`);
            return '';
        }

        return textContent.trim();
    }

    /**
     * Obtener datos específicos según la sección actual
     */
    obtenerDatosEspecificos() {
        const especificos = {};

        switch (this.seccionActual) {
            case 'estructuras':
                // Campos reales que existen en el formulario de estructuras
                especificos.fecha = this.obtenerValorCampo('fecha');
                especificos.t_inv = this.obtenerValorCampo('t_inv');
                especificos.alimentador = this.obtenerValorCampo('alimentador');
                especificos.estructura_retirada_campo = this.obtenerValorCampo('estructura_retirada_campo');
                especificos.numero_conductores = this.obtenerValorCampo('numero_conductores');
                especificos.montaje_integral = document.getElementById('montaje_integral_checkbox')?.checked || false;
                especificos.desmantelado = document.getElementById('desmantelado_checkbox')?.checked || false;
                
                // Intentar obtener datos del selector UC si está disponible
                if (window.ucSelector && window.ucSelector.currentSelections) {
                    especificos.uc_selecciones = window.ucSelector.currentSelections;
                    especificos.uc_codigo = window.ucSelector.getSelectedCode ? window.ucSelector.getSelectedCode() : '';
                }
                
                console.log('📊 Datos específicos de estructuras:', especificos);
                break;

            case 'conductores':
                // Campos tradicionales de conductor
                especificos.tipo_conductor_n1 = this.obtenerValorCampo('tipo_conductor_n1');
                especificos.calibre_conductor_n1 = this.obtenerValorCampo('calibre_conductor_n1');
                especificos.tipo_conductor_n2_n3 = this.obtenerValorCampo('tipo_conductor_n2_n3');
                especificos.calibre_conductor_n2_n3 = this.obtenerValorCampo('calibre_conductor_n2_n3');
                especificos.longitud_conductor = this.obtenerValorCampo('longitud_conductor');
                
                // Nuevos campos UC Conductor
                especificos.uc_conductor = this.obtenerValorCampo('uc_conductor');
                especificos.descripcion_uc_conductor = this.obtenerValorCampo('descripcion_uc_conductor');
                
                // Intentar obtener datos del selector UC Conductor si está disponible
                if (window.ucConductorSelector && window.ucConductorSelector.getCurrentSelection) {
                    const seleccionUC = window.ucConductorSelector.getCurrentSelection();
                    if (seleccionUC) {
                        especificos.uc_conductor_selecciones = seleccionUC;
                        especificos.uc_conductor_jerarquia = seleccionUC.hierarchy || {};
                    }
                }
                
                console.log('📊 Datos específicos de conductores (con UC):', especificos);
                break;

            case 'equipos':
                // Campos tradicionales de equipo
                especificos.tipo_equipo = this.obtenerValorCampo('tipo_equipo');
                especificos.marca_equipo = this.obtenerValorCampo('marca_equipo');
                especificos.modelo_equipo = this.obtenerValorCampo('modelo_equipo');
                especificos.serie_equipo = this.obtenerValorCampo('serie_equipo');
                especificos.voltaje_operacion = this.obtenerValorCampo('voltaje_operacion');
                
                // Nuevos campos UC Equipo
                especificos.uc_equipo = this.obtenerValorCampo('uc_equipo');
                especificos.descripcion_uc_equipo = this.obtenerValorCampo('descripcion_uc_equipo');
                
                // Intentar obtener datos del selector UC Equipo si está disponible
                if (window.ucEquipoSelector && window.ucEquipoSelector.getCurrentSelection) {
                    const seleccionUC = window.ucEquipoSelector.getCurrentSelection();
                    if (seleccionUC) {
                        especificos.uc_equipo_selecciones = seleccionUC;
                        especificos.uc_equipo_jerarquia = seleccionUC.hierarchy || {};
                    }
                }
                
                console.log('📊 Datos específicos de equipos (con UC):', especificos);
                break;

            case 'transformador':
                // Campos tradicionales de transformador
                especificos.potencia_transformador = this.obtenerValorCampo('potencia_transformador');
                especificos.tipo_transformador = this.obtenerValorCampo('tipo_transformador');
                especificos.marca_transformador = this.obtenerValorCampo('marca_transformador');
                especificos.relacion_transformacion = this.obtenerValorCampo('relacion_transformacion');
                especificos.conexion_transformador = this.obtenerValorCampo('conexion_transformador');
                
                // Nuevos campos UC Transformador jerárquico
                especificos.uc_transformador_jerarquico = this.obtenerValorCampo('uc_transformador_jerarquico');
                especificos.descripcion_uc_transformador_jerarquico = this.obtenerValorCampo('descripcion_uc_transformador_jerarquico');
                
                // Campos UC Transformador tradicional (sistema existente)
                especificos.uc_transformador_resultado = this.obtenerValorCampo('uc_transformador_resultado');
                especificos.descripcion_transformador_resultado = this.obtenerValorCampo('descripcion_transformador_resultado');
                
                // Intentar obtener datos del selector UC Transformador si está disponible
                if (window.ucTransformadorSelector && window.ucTransformadorSelector.getCurrentSelection) {
                    const seleccionUC = window.ucTransformadorSelector.getCurrentSelection();
                    if (seleccionUC) {
                        especificos.uc_transformador_selecciones = seleccionUC;
                        especificos.uc_transformador_jerarquia = seleccionUC.hierarchy || {};
                    }
                }
                
                console.log('📊 Datos específicos de transformadores (con UC):', especificos);
                break;
        }

        return especificos;
    }

    /**
     * Agregar nueva iteración temporal
     */
    async agregarIteracion() {
        try {
            console.log(`📝 Agregando iteración a ${this.seccionActual}...`);

            const datos = this.obtenerDatosFormulario();
            
            // Validar datos mínimos
            if (!datos.nombre_proyecto) {
                this.mostrarMensaje('error', 'Selecciona un proyecto antes de agregar la iteración');
                return;
            }

            const response = await fetch(`${this.apiBase}/agregar/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCsrfToken()
                },
                body: JSON.stringify(datos)
            });

            const result = await response.json();

            if (result.success) {
                this.iteraciones.push(result.iteracion);
                this.actualizarTabla();
                this.actualizarEstadisticas();
                this.mostrarMensaje('success', result.message);
                this.limpiarFormulario(); // Opcional
            } else {
                this.mostrarMensaje('error', result.error || 'Error al agregar iteración');
            }

        } catch (error) {
            console.error('Error agregando iteración:', error);
            this.mostrarMensaje('error', 'Error de conexión al agregar iteración');
        }
    }

    /**
     * Eliminar iteración temporal
     */
    async eliminarIteracion(iteracionId) {
        try {
            console.log(`🗑️ Eliminando iteración ${iteracionId}...`);

            const response = await fetch(`${this.apiBase}/eliminar/${iteracionId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': this.getCsrfToken()
                }
            });

            const result = await response.json();

            if (result.success) {
                // Remover de la lista local
                this.iteraciones = this.iteraciones.filter(iter => iter.id != iteracionId);
                this.actualizarTabla();
                this.actualizarEstadisticas();
                this.mostrarMensaje('success', result.message);
            } else {
                this.mostrarMensaje('error', result.error || 'Error al eliminar iteración');
            }

        } catch (error) {
            console.error('Error eliminando iteración:', error);
            this.mostrarMensaje('error', 'Error de conexión al eliminar iteración');
        }
    }

    /**
     * Cargar iteraciones temporales existentes
     */
    async cargarIteracionesTemporales() {
        try {
            console.log('📋 Cargando iteraciones temporales...');
            const url = `${this.apiBase}/listar/`;
            console.log('🔗 URL completa:', url);

            const response = await fetch(url);
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                console.error('❌ Response no ok:', response.status, response.statusText);
                return;
            }

            const result = await response.json();
            console.log('📄 Response data:', result);

            if (result.success) {
                // Convertir el objeto agrupado por sección a array plano
                this.iteraciones = [];
                Object.keys(result.iteraciones_por_seccion).forEach(seccion => {
                    this.iteraciones.push(...result.iteraciones_por_seccion[seccion]);
                });

                this.actualizarTabla();
                this.actualizarEstadisticas();
                console.log(`✅ ${result.total} iteraciones cargadas`);
            }

        } catch (error) {
            console.error('Error cargando iteraciones:', error);
        }
    }

    /**
     * Finalizar iteraciones (convertir a definitivas)
     */
    async finalizarIteraciones() {
        try {
            if (this.iteraciones.length === 0) {
                this.mostrarMensaje('warning', 'No hay iteraciones para guardar');
                return;
            }

            console.log('💾 Finalizando iteraciones...');

            const formularioId = `FORM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const response = await fetch(`${this.apiBase}/finalizar/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCsrfToken()
                },
                body: JSON.stringify({
                    formulario_id: formularioId
                })
            });

            const result = await response.json();

            if (result.success) {
                this.mostrarMensaje('success', result.message);
                this.iteraciones = [];
                this.actualizarTabla();
                this.actualizarEstadisticas();
                
                // Redirigir o continuar según sea necesario
                setTimeout(() => {
                    window.location.href = '/forms/lista/';
                }, 2000);
            } else {
                this.mostrarMensaje('error', result.error || 'Error al finalizar iteraciones');
            }

        } catch (error) {
            console.error('Error finalizando iteraciones:', error);
            this.mostrarMensaje('error', 'Error de conexión al finalizar iteraciones');
        }
    }

    /**
     * Actualizar tabla de iteraciones - Versión DOM segura
     */
    actualizarTabla() {
        const tabla = document.getElementById('iterationTableBody');
        if (!tabla) {
            console.warn('Tabla de iteraciones no encontrada con ID: iterationTableBody');
            return;
        }

        console.log(`📊 Actualizando tabla con ${this.iteraciones.length} iteraciones`);

        // Limpiar tabla
        tabla.innerHTML = '';

        if (this.iteraciones.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 11;
            td.className = 'px-6 py-4 text-center text-gray-500';
            
            // Crear el contenido con icono
            const icon = document.createElement('i');
            icon.className = 'fas fa-inbox text-2xl mb-2';
            
            const br = document.createElement('br');
            const texto = document.createTextNode('No hay iteraciones agregadas');
            
            td.appendChild(icon);
            td.appendChild(br);
            td.appendChild(texto);
            
            tr.appendChild(td);
            tabla.appendChild(tr);
            return;
        }

        // Crear filas usando createElement para máxima seguridad
        this.iteraciones.forEach((iter, index) => {
            const datos = iter.datos_especificos || {};
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';

            // Helper para crear celdas estándar
            const crearCelda = (contenido) => {
                const td = document.createElement('td');
                td.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
                td.textContent = contenido || '-';
                return td;
            };

            // Helper para obtener valor seguro de objeto anidado
            const obtenerValorSeguro = (obj, prop) => {
                try {
                    return obj && obj[prop] ? obj[prop] : '-';
                } catch (e) {
                    return '-';
                }
            };

            // Estructura Retirada (4 columnas)
            tr.appendChild(crearCelda(datos.estructura_retirada_material));
            tr.appendChild(crearCelda(datos.estructura_retirada_altura));
            tr.appendChild(crearCelda(datos.estructura_retirada_apoyo));
            tr.appendChild(crearCelda(datos.estructura_retirada_uc || iter.estructura_retirada_campo));

            // Estructura Nueva (7 columnas)
            tr.appendChild(crearCelda(datos.material_nueva || obtenerValorSeguro(datos.uc_selecciones, 'material')));
            tr.appendChild(crearCelda(datos.altura_nueva || obtenerValorSeguro(datos.uc_selecciones, 'altura')));
            tr.appendChild(crearCelda(datos.poblacion_nueva || obtenerValorSeguro(datos.uc_selecciones, 'poblacion')));
            tr.appendChild(crearCelda(datos.disposicion_nueva || obtenerValorSeguro(datos.uc_selecciones, 'disposicion')));
            tr.appendChild(crearCelda(datos.tipo_red_nueva || obtenerValorSeguro(datos.uc_selecciones, 'tipo_red')));
            tr.appendChild(crearCelda(datos.uc_codigo));
            
            // Columna de fotos
            const fotosCount = iter.fotos_count || 0;
            tr.appendChild(crearCelda(fotosCount + ' fotos'));

            // Columna de acciones con botón
            const tdAccion = document.createElement('td');
            tdAccion.className = 'px-6 py-4 whitespace-nowrap text-sm font-medium';
            
            const boton = document.createElement('button');
            boton.className = 'btn-eliminar-iteracion text-red-600 hover:text-red-900';
            boton.setAttribute('data-iteracion-id', iter.id);
            boton.title = 'Eliminar iteración';
            
            const icono = document.createElement('i');
            icono.className = 'fas fa-trash-alt';
            
            boton.appendChild(icono);
            tdAccion.appendChild(boton);
            tr.appendChild(tdAccion);

            // Agregar fila completa a la tabla
            tabla.appendChild(tr);

            console.log(`✅ Fila ${index + 1} agregada:`, {
                id: iter.id,
                estructura_retirada: iter.estructura_retirada_campo,
                uc_codigo: datos.uc_codigo
            });
        });

        console.log('✅ Tabla actualizada correctamente con createElement');
    }

    /**
     * Obtener color de badge según sección
     */
    getSeccionColor(seccion) {
        const colores = {
            estructuras: 'bg-blue-100 text-blue-800',
            conductores: 'bg-yellow-100 text-yellow-800',
            equipos: 'bg-green-100 text-green-800',
            transformador: 'bg-purple-100 text-purple-800'
        };
        return colores[seccion] || 'bg-gray-100 text-gray-800';
    }

    /**
     * Actualizar estadísticas
     */
    async actualizarEstadisticas() {
        try {
            const response = await fetch(`${this.apiBase}/estadisticas/`);
            const result = await response.json();

            if (result.success) {
                const stats = result.estadisticas;
                this.actualizarContadoresUI(stats);
            }

        } catch (error) {
            console.error('Error actualizando estadísticas:', error);
        }
    }

    /**
     * Actualizar contadores en la UI
     */
    actualizarContadoresUI(stats) {
        Object.keys(stats).forEach(seccion => {
            const contador = document.getElementById(`contador-${seccion}`);
            if (contador) {
                contador.textContent = stats[seccion];
            }
        });
    }

    /**
     * Mostrar mensaje al usuario
     */
    mostrarMensaje(tipo, mensaje) {
        // Crear elemento de mensaje
        const mensajeEl = document.createElement('div');
        mensajeEl.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${this.getMensajeColor(tipo)}`;
        mensajeEl.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${this.getMensajeIcon(tipo)} mr-2"></i>
                <span>${mensaje}</span>
            </div>
        `;

        document.body.appendChild(mensajeEl);

        // Auto-remover después de 3 segundos
        setTimeout(() => {
            mensajeEl.remove();
        }, 3000);

        console.log(`${tipo.toUpperCase()}: ${mensaje}`);
    }

    getMensajeColor(tipo) {
        const colores = {
            success: 'bg-green-100 text-green-800 border border-green-200',
            error: 'bg-red-100 text-red-800 border border-red-200',
            warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            info: 'bg-blue-100 text-blue-800 border border-blue-200'
        };
        return colores[tipo] || colores.info;
    }

    getMensajeIcon(tipo) {
        const iconos = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        return iconos[tipo] || iconos.info;
    }

    /**
     * Limpiar formulario después de agregar iteración
     */
    limpiarFormulario() {
        // Solo limpiar campos específicos, mantener información del proyecto
        const camposLimpiar = ['direccion', 'latitud_inicial', 'longitud_inicial', 
                              'latitud_final', 'longitud_final'];
        
        camposLimpiar.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento && elemento.type !== 'select-one') {
                elemento.value = '';
            }
        });
    }

    /**
     * Obtener token CSRF
     */
    getCsrfToken() {
        const token = document.querySelector('[name=csrfmiddlewaretoken]');
        return token ? token.value : '';
    }

    /**
     * Cambiar sección actual
     */
    setSectionActual(seccion) {
        this.seccionActual = seccion;
        this.actualizarTabla();
        
        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('seccionCambiada', {
            detail: { seccion }
        }));
    }
}

// Crear instancia global
window.iteracionesManager = new IteracionesManager();

// Funciones de ayuda globales
window.agregarIteracion = () => window.iteracionesManager.agregarIteracion();
window.eliminarIteracion = (id) => window.iteracionesManager.eliminarIteracion(id);

console.log('✅ Sistema de Iteraciones cargado correctamente');