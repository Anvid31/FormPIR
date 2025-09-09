/**
 * SISTEMA DE INICIALIZACIÓN UNIFICADO
 * Versión 1.0 - Evita conflictos entre sistemas múltiples
 * 
 * FUNCIONES:
 * - Inicializa sistemas en orden correcto
 * - Evita duplicaciones y conflictos
 * - Proporciona debugging centralizado
 */

class SistemaInicializacionUnificado {
    constructor() {
        this.sistemasActivos = {};
        this.seccionActual = this.detectarSeccion();
        this.debugMode = window.location.search.includes('debug=true');
        this.inicializar();
    }

    detectarSeccion() {
        const path = window.location.pathname;
        if (path.includes('estructuras')) return 'estructuras';
        if (path.includes('conductores')) return 'conductores';
        if (path.includes('equipos')) return 'equipos';
        if (path.includes('transformador') || path.includes('transformadores')) return 'transformador';
        return null;
    }

    inicializar() {
        
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.ejecutarInicializacion();
            });
        } else {
            // DOM ya está listo, esperar un poco más para otros scripts
            setTimeout(() => {
                this.ejecutarInicializacion();
            }, 1500);
        }
    }

    ejecutarInicializacion() {
        try {
            // 1. Limpiar sistemas conflictivos
            this.limpiarSistemasConflictivos();
            
            // 2. Inicializar sistemas en orden
            this.inicializarTiposInversion();
            this.inicializarIteraciones();
            this.inicializarAutocompletados();
            this.inicializarSharedFields();
            this.inicializarDebugTools();
            
            // 3. Configurar monitoreo
            this.configurarMonitoreoGlobal();
            
            // 4. Ejecutar verificaciones
            this.verificarInicializacion();
            

            
        } catch (error) {
            console.error('❌ Error en inicialización del sistema:', error);

            
        }
    }

    limpiarSistemasConflictivos() {
        
        // Desactivar sistema universal de iteraciones
        if (window.sistemaIteracionesUniversalInstance) {
            window.sistemaIteracionesUniversalInstance = null;
        }
        
    }

    inicializarTiposInversion() {
        if (this.debugMode) console.log('🎯 Inicializando Sistema de Tipos de Inversión...');
        
        try {
            if (typeof SistemaTiposInversionCorregido !== 'undefined') {
                window.sistemaTiposInversionCorregido = new SistemaTiposInversionCorregido();
                this.sistemasActivos.tiposInversion = true;
                if (this.debugMode) console.log('✅ Sistema de Tipos de Inversión Corregido activo');
            } else if (typeof SistemaTiposInversion !== 'undefined') {
                window.sistemaTiposInversion = new SistemaTiposInversion();
                this.sistemasActivos.tiposInversion = true;
                if (this.debugMode) console.log('✅ Sistema de Tipos de Inversión (original) activo');
            } else {
                if (this.debugMode) console.warn('⚠️ No se encontró clase de Tipos de Inversión');
            }
        } catch (error) {
            console.error('❌ Error inicializando Tipos de Inversión:', error);
        }
    }

    inicializarIteraciones() {
        if (this.debugMode) console.log('🔄 Inicializando Sistema de Iteraciones...');
        
        try {
            if (typeof SistemaIteracionesCompartidasFinal !== 'undefined') {
                window.sistemaIteracionesCompartidas = new SistemaIteracionesCompartidasFinal();
                if (window.sistemaIteracionesCompartidas.inicializar) {
                    window.sistemaIteracionesCompartidas.inicializar();
                }
                this.sistemasActivos.iteraciones = true;
                if (this.debugMode) console.log('✅ Sistema de Iteraciones Compartidas activo');
            } else {
                if (this.debugMode) console.warn('⚠️ No se encontró clase de Iteraciones Compartidas');
            }
        } catch (error) {
            console.error('❌ Error inicializando Iteraciones:', error);
        }
    }

    inicializarAutocompletados() {
        if (this.debugMode) console.log('📝 Configurando Autocompletados...');
        
        try {
            // Asegurar que la función actualizarCircuitos esté conectada al municipio
            const municipioField = document.getElementById('municipio') || 
                                 document.querySelector('[name="municipio"]');
            
            if (municipioField) {
                // Remover listeners anteriores clonando el elemento
                const nuevoMunicipio = municipioField.cloneNode(true);
                municipioField.parentNode.replaceChild(nuevoMunicipio, municipioField);
                
                // Agregar nuevo listener
                nuevoMunicipio.addEventListener('change', () => {
                    if (this.debugMode) console.log('🔄 Municipio cambió, actualizando circuitos...');
                    if (typeof actualizarCircuitos === 'function') {
                        actualizarCircuitos();
                    } else {
                        console.error('❌ Función actualizarCircuitos no disponible');
                    }
                });
                
                this.sistemasActivos.autocompletados = true;
            } 
        } catch (error) {
            console.error('❌ Error configurando autocompletados:', error);
        }
    }

    inicializarSharedFields() {        
        try {
            if (typeof SharedFieldsManager !== 'undefined') {
                window.sharedFieldsManager = new SharedFieldsManager();
                this.sistemasActivos.sharedFields = true;
            }
        } catch (error) {
            console.error('❌ Error inicializando Shared Fields:', error);
        }
    }

    inicializarDebugTools() {
        if (this.debugMode) console.log('🛠️ Inicializando Herramientas de Debug...');
        
        try {
            // El debug de circuitos se inicializa automáticamente
            this.sistemasActivos.debugTools = true;
            if (this.debugMode) console.log('✅ Debug Tools disponibles');
        } catch (error) {
            console.error('❌ Error inicializando Debug Tools:', error);
        }
    }

    configurarMonitoreoGlobal() {
        if (this.debugMode) console.log('👀 Configurando monitoreo global...');
        
        // Monitorear errores globales
        window.addEventListener('error', (event) => {
            if (event.message.includes('FormPIR') || event.filename.includes('forms')) {
                console.error('🚨 Error del sistema FormPIR:', event.message);
            }
        });
        
        // Monitorear cambios en campos críticos
        const camposCriticos = ['municipio', 'alimentador', 't_inv', 'montaje_integral', 'desmantelado'];
        camposCriticos.forEach(campoId => {
            const campo = document.getElementById(campoId) || document.querySelector(`[name="${campoId}"]`);
            if (campo) {
                campo.addEventListener('change', (e) => {

                });
            }
        });
    }

    

    // Método para reiniciar sistemas
    reiniciarSistemas() {
        this.limpiarSistemasConflictivos();
        setTimeout(() => {
            this.ejecutarInicializacion();
        }, 1000);
    }

    // Método para obtener estado del sistema
    obtenerEstado() {
        return {
            seccion: this.seccionActual,
            sistemasActivos: this.sistemasActivos,
            timestamp: new Date().toISOString()
        };
    }
}


// Inicializar automáticamente
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que otros scripts se carguen
    setTimeout(() => {
        window.sistemaUnificado = new SistemaInicializacionUnificado();
        
        // Hacer disponibles funciones globales
        window.testSistemaCompleto = testSistemaCompleto;
        window.reiniciarSistemas = () => window.sistemaUnificado.reiniciarSistemas();
        window.estadoSistema = () => window.sistemaUnificado.obtenerEstado();
        
    }, 2000);
});

// Exportar para uso global
window.SistemaInicializacionUnificado = SistemaInicializacionUnificado;
