/**
 * Sistema Semáforo DESS - JavaScript
 * Manejo de estados, filtros y acciones en tiempo real
 */

class SistemaSemaforo {
    constructor() {
        this.init();
    }

    init() {
        // Configuración CSRF para Django
        this.setupCSRF();
        
        // Inicializar componentes
        this.initEventListeners();
        this.initAutoRefresh();
        this.initFilterSystem();
        this.initModalSystem();
        
        console.log('Sistema Semáforo inicializado');
    }

    setupCSRF() {
        // Obtener token CSRF de Django
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value ||
                         document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        if (csrfToken) {
            // Configurar CSRF para todas las peticiones AJAX
            const originalFetch = window.fetch;
            window.fetch = function(url, options = {}) {
                if (options.method && options.method.toUpperCase() !== 'GET') {
                    options.headers = options.headers || {};
                    options.headers['X-CSRFToken'] = csrfToken;
                }
                return originalFetch(url, options);
            };
        }
    }

    initEventListeners() {
        // Botones de cambio de estado
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-cambiar-estado')) {
                this.handleCambiarEstado(e);
            }
            
            if (e.target.matches('.btn-revision-rapida')) {
                this.handleRevisionRapida(e);
            }
            
            if (e.target.matches('.btn-validar-datos')) {
                this.handleValidarDatos(e);
            }
        });

        // Filtros en tiempo real
        const filtros = document.querySelectorAll('.filtro-tiempo-real');
        filtros.forEach(filtro => {
            filtro.addEventListener('change', () => {
                this.aplicarFiltros();
            });
        });

        // Búsqueda en tiempo real
        const campoBusqueda = document.getElementById('busqueda-global');
        if (campoBusqueda) {
            let timeout;
            campoBusqueda.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.buscarFormularios(e.target.value);
                }, 500);
            });
        }
    }

    initAutoRefresh() {
        // Auto-refresh cada 2 minutos en dashboards
        if (document.body.classList.contains('dashboard-page')) {
            setInterval(() => {
                this.actualizarEstadisticas();
            }, 120000);
        }
    }

    initFilterSystem() {
        // Sistema de filtros avanzados
        const btnFiltrosAvanzados = document.getElementById('btn-filtros-avanzados');
        if (btnFiltrosAvanzados) {
            btnFiltrosAvanzados.addEventListener('click', () => {
                this.toggleFiltrosAvanzados();
            });
        }
    }

    initModalSystem() {
        // Sistema de modales para confirmaciones
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            // Cerrar modal al hacer click fuera
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.cerrarModal(modal);
                }
            });
        });

        // Botones de cerrar modal
        document.addEventListener('click', (e) => {
            if (e.target.matches('.cerrar-modal')) {
                const modal = e.target.closest('.modal');
                this.cerrarModal(modal);
            }
        });
    }

    async handleCambiarEstado(e) {
        e.preventDefault();
        
        const formularioId = e.target.dataset.formularioId;
        const estadoNuevo = e.target.dataset.estadoNuevo;
        const estadoActual = e.target.dataset.estadoActual;

        // Mostrar modal de confirmación
        const confirmacion = await this.mostrarModalConfirmacion(
            `¿Confirmar cambio de estado?`,
            `El formulario #${formularioId} pasará de "${this.getEstadoNombre(estadoActual)}" a "${this.getEstadoNombre(estadoNuevo)}"`
        );

        if (!confirmacion) return;

        // Mostrar loading
        this.mostrarLoading(e.target);

        try {
            const response = await fetch(`/api/formulario/${formularioId}/cambiar-estado/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    estado_nuevo: estadoNuevo,
                    observaciones: ''
                })
            });

            const data = await response.json();

            if (data.success) {
                this.mostrarNotificacion('Estado cambiado exitosamente', 'success');
                this.actualizarElementoFormulario(formularioId, data.formulario);
            } else {
                this.mostrarNotificacion(data.error || 'Error al cambiar estado', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('Error de conexión', 'error');
        } finally {
            this.ocultarLoading(e.target);
        }
    }

    async handleRevisionRapida(e) {
        e.preventDefault();
        
        const formularioId = e.target.dataset.formularioId;
        
        try {
            const response = await fetch(`/api/formulario/${formularioId}/revision-rapida/`, {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                this.mostrarModalRevision(data.revision);
            } else {
                this.mostrarNotificacion('Error en revisión rápida', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('Error de conexión', 'error');
        }
    }

    async handleValidarDatos(e) {
        e.preventDefault();
        
        const formularioId = e.target.dataset.formularioId;
        
        this.mostrarLoading(e.target);

        try {
            const response = await fetch(`/api/formulario/${formularioId}/validar-datos/`, {
                method: 'POST'
            });

            const data = await response.json();

            if (data.success) {
                this.mostrarModalValidacion(data.validacion);
            } else {
                this.mostrarNotificacion('Error en validación', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('Error de conexión', 'error');
        } finally {
            this.ocultarLoading(e.target);
        }
    }

    async actualizarEstadisticas() {
        try {
            const response = await fetch('/api/estadisticas/');
            const data = await response.json();

            if (data.success) {
                this.actualizarElementosEstadisticas(data.stats);
            }
        } catch (error) {
            console.error('Error actualizando estadísticas:', error);
        }
    }

    aplicarFiltros() {
        const filtros = {};
        
        // Recopilar valores de filtros
        const elementos = document.querySelectorAll('.filtro-tiempo-real');
        elementos.forEach(el => {
            if (el.value) {
                filtros[el.name] = el.value;
            }
        });

        // Aplicar filtros a la tabla
        this.filtrarTablaFormularios(filtros);
    }

    filtrarTablaFormularios(filtros) {
        const filas = document.querySelectorAll('.formulario-row');
        
        filas.forEach(fila => {
            let mostrar = true;

            // Aplicar cada filtro
            Object.keys(filtros).forEach(filtro => {
                const valor = filtros[filtro];
                const celda = fila.querySelector(`[data-${filtro}]`);
                
                if (celda && !celda.textContent.toLowerCase().includes(valor.toLowerCase())) {
                    mostrar = false;
                }
            });

            fila.style.display = mostrar ? '' : 'none';
        });

        this.actualizarContadorResultados();
    }

    async buscarFormularios(termino) {
        if (!termino || termino.length < 2) {
            this.limpiarBusqueda();
            return;
        }

        try {
            const response = await fetch(`/api/buscar-formularios/?q=${encodeURIComponent(termino)}`);
            const data = await response.json();

            if (data.success) {
                this.mostrarResultadosBusqueda(data.formularios);
            }
        } catch (error) {
            console.error('Error en búsqueda:', error);
        }
    }

    mostrarLoading(elemento) {
        elemento.disabled = true;
        elemento.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    }

    ocultarLoading(elemento) {
        elemento.disabled = false;
        // Restaurar texto original (guardado en data-original-text)
        const textoOriginal = elemento.dataset.originalText || 'Acción';
        elemento.innerHTML = textoOriginal;
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.innerHTML = `
            <div class="notificacion-content">
                <i class="fas fa-${this.getIconoNotificacion(tipo)}"></i>
                <span>${mensaje}</span>
                <button class="btn-cerrar-notificacion">&times;</button>
            </div>
        `;

        // Agregar al DOM
        document.body.appendChild(notificacion);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            notificacion.remove();
        }, 5000);

        // Permitir cerrar manualmente
        notificacion.querySelector('.btn-cerrar-notificacion').addEventListener('click', () => {
            notificacion.remove();
        });
    }

    async mostrarModalConfirmacion(titulo, mensaje) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal modal-confirmacion';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${titulo}</h3>
                    </div>
                    <div class="modal-body">
                        <p>${mensaje}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-accion="cancelar">Cancelar</button>
                        <button class="btn btn-primary" data-accion="confirmar">Confirmar</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target.dataset.accion === 'confirmar') {
                    resolve(true);
                    modal.remove();
                } else if (e.target.dataset.accion === 'cancelar' || e.target === modal) {
                    resolve(false);
                    modal.remove();
                }
            });
        });
    }

    getEstadoNombre(estado) {
        const nombres = {
            'contratista': 'Contratista',
            'interventor': 'Interventor',
            'gestion_actualizando': 'Gestión Actualizando',
            'gestion_actualizado': 'Gestión Actualizado'
        };
        return nombres[estado] || estado;
    }

    getIconoNotificacion(tipo) {
        const iconos = {
            'success': 'check-circle',
            'error': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return iconos[tipo] || 'info-circle';
    }

    actualizarElementoFormulario(formularioId, datosFormulario) {
        const fila = document.querySelector(`[data-formulario-id="${formularioId}"]`);
        if (fila) {
            // Actualizar badge de estado
            const badge = fila.querySelector('.badge-estado');
            if (badge) {
                badge.className = `badge estado-${datosFormulario.estado_actual}`;
                badge.textContent = this.getEstadoNombre(datosFormulario.estado_actual);
            }

            // Actualizar fecha de modificación
            const fechaModif = fila.querySelector('.fecha-modificacion');
            if (fechaModif) {
                fechaModif.textContent = 'Hace unos momentos';
            }
        }

        // Actualizar estadísticas generales
        this.actualizarEstadisticas();
    }

    actualizarElementosEstadisticas(stats) {
        Object.keys(stats).forEach(key => {
            const elemento = document.querySelector(`[data-stat="${key}"]`);
            if (elemento) {
                elemento.textContent = stats[key];
            }
        });
    }
}

// Inicializar sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaSemaforo = new SistemaSemaforo();
});

// Funciones de utilidad globales
window.SemaforoUtils = {
    formatearFecha: (fecha) => {
        return new Date(fecha).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    exportarDatos: async (tipo) => {
        try {
            const response = await fetch(`/api/reportes/${tipo}/`);
            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte-${tipo}-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exportando datos:', error);
        }
    }
};
