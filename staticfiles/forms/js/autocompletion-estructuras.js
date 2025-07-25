/**
 * Autocompletado Simplificado para Estructuras
 * Sistema optimizado que solo maneja los campos que realmente existen
 * después de la integración del selector UC jerárquico
 */

(function() {
    'use strict';
    
    class AutocompletionEstructuras {
        constructor() {
            this.initialized = false;
            this.eventListeners = [];
        }
        
        init() {
            if (this.initialized) {
                console.log('⚠️ AutocompletionEstructuras ya inicializado');
                return;
            }
            
            console.log('🎯 Inicializando autocompletado simplificado para estructuras');
            
            // Solo configurar los campos que realmente existen
            this.setupProjectFields();
            this.setupCircuitoHandler();
            this.setupUCSelector();
            
            this.initialized = true;
            console.log('✅ AutocompletionEstructuras inicializado correctamente');
        }
        
        setupProjectFields() {
            console.log('📋 Configurando campos del proyecto');
            
            // Configurar autocompletado de banco basado en nombre del proyecto
            const nombreField = document.getElementById('nombre');
            if (nombreField) {
                const bancoHandler = () => {
                    console.log('🏦 Autocompletando banco para proyecto:', nombreField.value);
                    if (typeof autoCompleteBanco === 'function') {
                        autoCompleteBanco();
                    }
                };
                nombreField.addEventListener('change', bancoHandler);
                this.eventListeners.push({ element: nombreField, event: 'change', handler: bancoHandler });
                console.log('✅ Handler configurado para campo nombre');
            }
            
            // Configurar autocompletado basado en contrato
            const contratoField = document.getElementById('contrato');
            if (contratoField) {
                const contratoHandler = () => {
                    console.log('📄 Procesando cambio de contrato:', contratoField.value);
                    
                    // Autocompletar regional
                    if (typeof autoCompleteRegional === 'function') {
                        autoCompleteRegional();
                    }
                    
                    // Actualizar municipios disponibles
                    if (typeof actualizarMunicipiosPorContrato === 'function') {
                        actualizarMunicipiosPorContrato();
                    }
                };
                contratoField.addEventListener('change', contratoHandler);
                this.eventListeners.push({ element: contratoField, event: 'change', handler: contratoHandler });
                console.log('✅ Handler configurado para campo contrato');
            }
            
            // Configurar autocompletado basado en municipio
            const municipioField = document.getElementById('municipio');
            if (municipioField) {
                const municipioHandler = () => {
                    console.log('🏙️ Procesando cambio de municipio:', municipioField.value);
                    
                    // Autocompletar departamento
                    if (typeof autoCompleteDepartamento === 'function') {
                        autoCompleteDepartamento();
                    }
                    
                    // Actualizar circuitos disponibles
                    if (typeof actualizarCircuitos === 'function') {
                        actualizarCircuitos();
                    }
                };
                municipioField.addEventListener('change', municipioHandler);
                this.eventListeners.push({ element: municipioField, event: 'change', handler: municipioHandler });
                console.log('✅ Handler configurado para campo municipio');
            }
        }
        
        setupCircuitoHandler() {
            console.log('⚡ Configurando handler para circuito');
            
            const circuitoField = document.getElementById('circuito');
            if (circuitoField) {
                const circuitoHandler = () => {
                    console.log('⚡ Circuito seleccionado:', circuitoField.value);
                    
                    // Marcar interacción del usuario si existe la función
                    if (typeof markUserInteraction === 'function') {
                        markUserInteraction();
                    }
                    
                    // Aquí se puede agregar lógica adicional si es necesaria
                    // Por ejemplo, validaciones específicas del circuito
                };
                circuitoField.addEventListener('change', circuitoHandler);
                this.eventListeners.push({ element: circuitoField, event: 'change', handler: circuitoHandler });
                console.log('✅ Handler configurado para campo circuito');
            }
        }
        
        setupUCSelector() {
            console.log('🔧 Configurando integración con selector UC jerárquico');
            
            // Verificar que el selector UC jerárquico esté disponible
            const ucSelector = document.querySelector('.uc-hierarchical-selector');
            if (ucSelector) {
                console.log('✅ Selector UC jerárquico detectado y activo');
                
                // Escuchar eventos personalizados del selector UC
                document.addEventListener('ucSelected', (event) => {
                    console.log('🎯 UC seleccionado desde selector jerárquico:', event.detail);
                    
                    // Actualizar campo UC oculto si existe
                    const ucField = document.getElementById('uc') || document.getElementById('uc_nueva');
                    if (ucField && event.detail.code) {
                        ucField.value = event.detail.code;
                        console.log('📝 Campo UC actualizado:', event.detail.code);
                    }
                });
                
                // Escuchar cambios en la configuración del selector
                document.addEventListener('ucConfigChanged', (event) => {
                    console.log('⚙️ Configuración UC cambiada:', event.detail);
                });
            }
        }
        
        // Método para limpiar event listeners
        cleanup() {
            console.log('🧹 Limpiando event listeners de AutocompletionEstructuras');
            
            this.eventListeners.forEach(({ element, event, handler }) => {
                element.removeEventListener(event, handler);
            });
            
            this.eventListeners = [];
            this.initialized = false;
            
            console.log('✅ Cleanup completado');
        }
        
        // Método para reinicializar si es necesario
        reinit() {
            console.log('🔄 Reinicializando AutocompletionEstructuras');
            this.cleanup();
            this.init();
        }
        
        // Método para verificar estado
        getStatus() {
            return {
                initialized: this.initialized,
                listenersCount: this.eventListeners.length,
                hasUCSelector: !!document.querySelector('.uc-hierarchical-selector')
            };
        }
    }
    
    // Exponer la clase globalmente
    window.AutocompletionEstructuras = AutocompletionEstructuras;
    
    // Función de inicialización automática
    function initAutocompletionEstructuras() {
        // Solo inicializar si estamos en la sección de estructuras
        if (window.CURRENT_SECTION === 'estructuras' || 
            document.querySelector('[data-form-section="estructuras"]')) {
            
            console.log('🚀 Inicializando AutocompletionEstructuras automáticamente');
            
            // Crear instancia global si no existe
            if (!window.autocompletionEstructuras) {
                window.autocompletionEstructuras = new AutocompletionEstructuras();
            }
            
            // Inicializar
            window.autocompletionEstructuras.init();
        }
    }
    
    // Auto-inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutocompletionEstructuras);
    } else {
        // DOM ya está listo, inicializar inmediatamente
        initAutocompletionEstructuras();
    }
    
    // También escuchar cambios de sección si existe el sistema de navegación
    document.addEventListener('sectionChanged', (event) => {
        if (event.detail.section === 'estructuras') {
            console.log('📍 Cambio a sección estructuras detectado');
            initAutocompletionEstructuras();
        }
    });
    
    console.log('📦 Módulo AutocompletionEstructuras cargado');
    
})();
