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
            latitud_inicial: this.obtenerValorCampo('latitud_inicial'),
            longitud_inicial: this.obtenerValorCampo('longitud_inicial'),
            latitud_final: this.obtenerValorCampo('latitud_final'),
            longitud_final: this.obtenerValorCampo('longitud_final'),
            
            // Otros campos comunes
            direccion: this.obtenerValorCampo('direccion'),
            cantidad: this.obtenerValorCampo('cantidad') || 1,
            
            // Datos específicos por sección
            datos_especificos: this.obtenerDatosEspecificos()
        };

        return datos;
    }

    /**
     * Obtener valor de campo por ID (intenta diferentes variaciones)
     */
    obtenerValorCampo(id) {
        // Intentar ID directo
        let elemento = document.getElementById(id);
        if (elemento) return elemento.value || elemento.textContent;

        // Intentar con prefijo de sección
        elemento = document.getElementById(`${this.seccionActual}_${id}`);
        if (elemento) return elemento.value || elemento.textContent;

        return '';
    }

    /**
     * Obtener datos específicos según la sección actual
     */
    obtenerDatosEspecificos() {
        const especificos = {};

        switch (this.seccionActual) {
            case 'estructuras':
                especificos.material_nueva = this.obtenerValorCampo('material_nueva');
                especificos.altura_nueva = this.obtenerValorCampo('altura_nueva');
                especificos.poblacion_nueva = this.obtenerValorCampo('poblacion_nueva');
                especificos.disposicion_nueva = this.obtenerValorCampo('disposicion_nueva');
                especificos.tipo_red_nueva = this.obtenerValorCampo('tipo_red_nueva');
                especificos.uc_codigo = this.obtenerValorCampo('uc_codigo');
                break;

            case 'conductores':
                especificos.tipo_conductor_n1 = this.obtenerValorCampo('tipo_conductor_n1');
                especificos.calibre_conductor_n1 = this.obtenerValorCampo('calibre_conductor_n1');
                especificos.tipo_conductor_n2_n3 = this.obtenerValorCampo('tipo_conductor_n2_n3');
                especificos.calibre_conductor_n2_n3 = this.obtenerValorCampo('calibre_conductor_n2_n3');
                especificos.longitud_conductor = this.obtenerValorCampo('longitud_conductor');
                break;

            case 'equipos':
                especificos.tipo_equipo = this.obtenerValorCampo('tipo_equipo');
                especificos.marca_equipo = this.obtenerValorCampo('marca_equipo');
                especificos.modelo_equipo = this.obtenerValorCampo('modelo_equipo');
                especificos.serie_equipo = this.obtenerValorCampo('serie_equipo');
                especificos.voltaje_operacion = this.obtenerValorCampo('voltaje_operacion');
                break;

            case 'transformador':
                especificos.potencia_transformador = this.obtenerValorCampo('potencia_transformador');
                especificos.tipo_transformador = this.obtenerValorCampo('tipo_transformador');
                especificos.marca_transformador = this.obtenerValorCampo('marca_transformador');
                especificos.relacion_transformacion = this.obtenerValorCampo('relacion_transformacion');
                especificos.conexion_transformador = this.obtenerValorCampo('conexion_transformador');
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
     * Actualizar tabla de iteraciones
     */
    actualizarTabla() {
        const tabla = document.getElementById('tabla-iteraciones-body');
        if (!tabla) {
            console.warn('Tabla de iteraciones no encontrada');
            return;
        }

        if (this.iteraciones.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4 text-gray-500">
                        <i class="fas fa-inbox text-2xl mb-2"></i><br>
                        No hay iteraciones agregadas
                    </td>
                </tr>
            `;
            return;
        }

        tabla.innerHTML = this.iteraciones.map(iter => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 border-b">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${this.getSeccionColor(iter.seccion)}">
                        ${iter.seccion.charAt(0).toUpperCase() + iter.seccion.slice(1)}
                    </span>
                </td>
                <td class="px-4 py-3 border-b">${iter.numero_iteracion}</td>
                <td class="px-4 py-3 border-b text-sm">${iter.nombre_proyecto}</td>
                <td class="px-4 py-3 border-b text-sm">${iter.municipio}</td>
                <td class="px-4 py-3 border-b text-sm">${iter.direccion || '-'}</td>
                <td class="px-4 py-3 border-b text-center">${iter.cantidad}</td>
                <td class="px-4 py-3 border-b text-xs text-gray-500">
                    ${new Date(iter.fecha_creacion).toLocaleString('es-CO')}
                </td>
                <td class="px-4 py-3 border-b text-center">
                    <button 
                        class="btn-eliminar-iteracion text-red-600 hover:text-red-800 p-1"
                        data-iteracion-id="${iter.id}"
                        title="Eliminar iteración">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
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
