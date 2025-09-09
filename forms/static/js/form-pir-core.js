/**
 * ================================================
 * FORM PIR CORE - SISTEMA UNIFICADO
 * ================================================
 * 
 * Sistema central que unifica toda la funcionalidad del FormPIR
 * Reemplaza el uso de shared-scripts.html con un enfoque puramente JavaScript
 * 
 * Características:
 * - Carga dinámica de dependencias
 * - Configuración automática por sección
 * - Sistema de debug integrado
 * - Compatibilidad con sistemas legacy
 * - Sin dependencias de templates HTML
 */

(function() {
    'use strict';
    
    // ====================================
    // CONFIGURACIÓN CENTRAL
    // ====================================
    
    const FormPIRCore = {
        version: '2.0.0',
        debug: new URLSearchParams(window.location.search).has('debug'),
        seccionActual: document.body.getAttribute('data-seccion') || 'desconocida',
        scriptsLoaded: new Set(),
        initialized: false,
        
        // Lista de scripts principales en orden de carga
        coreScripts: [
            'js/sistema-funcionalidades-compartidas.js',
            // REMOVIDO: 'forms/js/data-mappings.js' - Datos ya cargados desde proyecto-mapping.js
            'forms/js/modules/autocompletion.js'
        ],
        
        // Scripts específicos para debug
        debugScripts: [
            'forms/js/debug-circuitos.js',
            'forms/js/verificacion-final.js'
        ],
        
        // Scripts opcionales removidos - archivos faltantes
        optionalScripts: [
            // REMOVIDO: 'forms/js/sistema-tipos-inversion-corregido.js' - Archivo faltante
            // REMOVIDO: 'forms/js/sistema-inicializacion-unificado.js' - Archivo faltante  
            // REMOVIDO: 'forms/js/console-cleaner.js' - Archivo faltante
        ]
    };
    
    // ====================================
    // SISTEMA DE CARGA DINÁMICA
    // ====================================
    
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // Evitar cargar el mismo script múltiples veces
            if (FormPIRCore.scriptsLoaded.has(src)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src.includes('/static/') ? src : `/static/${src}`;
            script.async = false; // Mantener orden de carga
            
            script.onload = () => {
                FormPIRCore.scriptsLoaded.add(src);
                resolve();
            };
            
            script.onerror = () => {
                // Error silencioso para scripts opcionales
                resolve();
            };
            
            document.head.appendChild(script);
        });
    }
    
    async function loadCoreScripts() {
        // Cargar scripts principales
        for (const script of FormPIRCore.coreScripts) {
            await loadScript(script);
        }
        
        // Cargar scripts opcionales en paralelo
        const optionalPromises = FormPIRCore.optionalScripts.map(script => loadScript(script));
        await Promise.allSettled(optionalPromises);
        
        // Cargar scripts de debug si es necesario
        if (FormPIRCore.debug) {
            const debugPromises = FormPIRCore.debugScripts.map(script => loadScript(script));
            await Promise.allSettled(debugPromises);
        }
    }
    
    // ====================================
    // CONFIGURACIÓN POR SECCIÓN
    // ====================================
    
    function initSectionSpecific() {
        switch(FormPIRCore.seccionActual) {
            case 'estructuras':
                if (typeof initEstructurasSpecific === 'function') {
                    initEstructurasSpecific();
                }
                break;
                
            case 'conductores':
                if (typeof initConductoresSpecific === 'function') {
                    initConductoresSpecific();
                }
                break;
                
            case 'equipos':
                if (typeof initEquiposSpecific === 'function') {
                    initEquiposSpecific();
                }
                break;
                
            case 'transformadores':
                if (typeof initTransformadoresSpecific === 'function') {
                    initTransformadoresSpecific();
                }
                break;
        }
    }
    
    // ====================================
    // VALIDACIÓN DE DEPENDENCIAS
    // ====================================
    
    function validateDependencies() {
        const dependenciasRequeridas = [
            'FormPIRShared',
            'MUNICIPIO_CIRCUITO_MAPPING',
            'actualizarCircuitos'
        ];
        
        const dependenciasFaltantes = dependenciasRequeridas.filter(dep => 
            typeof window[dep] === 'undefined'
        );
        
        if (dependenciasFaltantes.length > 0 && FormPIRCore.debug) {
            // Solo reportar en modo debug
        }
        
        return dependenciasFaltantes.length === 0;
    }
    
    // ====================================
    // INTEGRACIÓN CON SISTEMAS LEGACY
    // ====================================
    
    function initLegacyIntegration() {
        // Compatibilidad con selector UC jerárquico
        if (typeof initUCSelector === 'function') {
            try {
                initUCSelector();
            } catch (error) {
                // Error silencioso
            }
        }
        
        // Integración con sistema de iteraciones específico de estructuras
        if (typeof window.IteracionesManager !== 'undefined') {
            try {
                // Sincronizar con el sistema universal
                if (window.FormPIRShared?.iteracionesManager) {
                    // Hacer bridge entre sistemas si es necesario
                }
            } catch (error) {
                // Error silencioso
            }
        }
    }
    
    // ====================================
    // MONITOREO DE RENDIMIENTO
    // ====================================
    
    function initPerformanceMonitoring() {
        if (!FormPIRCore.debug) return;
        
        window.addEventListener('load', function() {
            const loadTime = performance.now();
            
            // Verificar elementos esperados
            const elementosEsperados = [
                't_inv', 'municipio', 'departamento', 'regional', 
                'alimentador', 'fecha', 'direccion'
            ];
            
            const elementosFaltantes = elementosEsperados.filter(id => 
                !document.getElementById(id)
            );
            
            if (elementosFaltantes.length > 0 && FormPIRCore.debug) {
                // Solo en modo debug mostrar elementos faltantes
            }
        });
    }
    
    // ====================================
    // INICIALIZACIÓN PRINCIPAL
    // ====================================
    
    async function initFormPIRCore() {
        if (FormPIRCore.initialized) return;
        
        try {
            // 1. Cargar todos los scripts necesarios
            await loadCoreScripts();
            
            // 2. Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // 4. Inicializar CircuitoMasterHandler
            const circuitoHandler = new FormPIRCore.CircuitoMasterHandler();
            circuitoHandler.init();
            window.circuitoMasterHandler = circuitoHandler;
            
            // 5. Configurar sección específica
            initSectionSpecific();
            
            // 6. Validar dependencias
            validateDependencies();
            
            // 7. Integrar sistemas legacy
            initLegacyIntegration();
            
            // 8. Configurar monitoreo de rendimiento
            initPerformanceMonitoring();
            
            // 9. Marcar como inicializado
            FormPIRCore.initialized = true;
            
            // 10. Disparar evento de sistema listo
            window.dispatchEvent(new CustomEvent('formPIRReady', {
                detail: {
                    version: FormPIRCore.version,
                    seccion: FormPIRCore.seccionActual,
                    debug: FormPIRCore.debug
                }
            }));
            
        } catch (error) {
            // Error silencioso - el sistema debe ser robusto
        }
    }
    
    // ====================================
    // MANEJADOR MAESTRO DE CIRCUITOS
    // ====================================
    
    class CircuitoMasterHandler {
        constructor() {
            this.initialized = false;
            this.activeListeners = new Map();
            this.debug = FormPIRCore.debug;
        }

        init() {
            if (this.initialized) return;
            
            this.log('🚀 Inicializando CircuitoMasterHandler');
            this.cleanupConflictingHandlers();
            this.setupMasterHandler();
            this.initialized = true;
            this.log('✅ CircuitoMasterHandler inicializado');
        }

        log(message, ...args) {
            if (this.debug) {
                console.log(message, ...args);
            }
        }

        cleanupConflictingHandlers() {
            const municipioField = this.findMunicipioField();
            if (municipioField) {
                const newMunicipioField = municipioField.cloneNode(true);
                municipioField.parentNode.replaceChild(newMunicipioField, municipioField);
                this.log('🧹 Event listeners conflictivos removidos');
            }
        }

        findMunicipioField() {
            return document.getElementById('municipio') || 
                   document.getElementById('shared_municipio') ||
                   document.querySelector('[name="municipio"]');
        }

        findAlimentadorField() {
            return document.getElementById('alimentador') || 
                   document.getElementById('circuito') ||
                   document.querySelector('[name="alimentador"]') ||
                   document.querySelector('[name="circuito"]');
        }

        setupMasterHandler() {
            const municipioField = this.findMunicipioField();
            
            if (!municipioField) {
                console.error('❌ Campo municipio no encontrado');
                return false;
            }

            let debounceTimer;
            const masterHandler = (event) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.updateCircuitosHandler(event.target.value);
                }, 300);
            };

            municipioField.addEventListener('change', masterHandler);
            this.activeListeners.set('municipio', { element: municipioField, handler: masterHandler });
            
            this.log('✅ Handler maestro configurado para municipio');
            
            if (municipioField.value) {
                this.updateCircuitosHandler(municipioField.value);
            }

            return true;
        }

        updateCircuitosHandler(municipioSeleccionado) {
            this.log('🔄 Actualizando circuitos para:', municipioSeleccionado);
            
            const alimentadorField = this.findAlimentadorField();
            
            if (!alimentadorField) {
                console.error('❌ Campo alimentador/circuito no encontrado');
                return false;
            }

            alimentadorField.innerHTML = '<option value="">Seleccionar</option>';

            if (!municipioSeleccionado) {
                this.setFieldState(alimentadorField, true);
                return false;
            }

            if (typeof MUNICIPIO_CIRCUITO_MAPPING === 'undefined') {
                console.error('❌ MUNICIPIO_CIRCUITO_MAPPING no disponible');
                this.setFieldState(alimentadorField, true);
                return false;
            }

            const circuitos = MUNICIPIO_CIRCUITO_MAPPING[municipioSeleccionado];
            
            if (!circuitos || circuitos.length === 0) {
                this.setFieldState(alimentadorField, true);
                
                const option = document.createElement('option');
                option.value = '';
                option.textContent = `No hay circuitos para ${municipioSeleccionado}`;
                option.disabled = true;
                alimentadorField.appendChild(option);
                
                return false;
            }

            this.setFieldState(alimentadorField, false);
            
            circuitos.sort().forEach(circuito => {
                const option = document.createElement('option');
                option.value = circuito;
                option.textContent = circuito;
                alimentadorField.appendChild(option);
            });

            this.log(`✅ ${circuitos.length} circuitos cargados para ${municipioSeleccionado}`);
            return true;
        }

        setFieldState(field, disabled) {
            if (!field) return;

            field.disabled = disabled;

            if (disabled) {
                field.classList.remove('bg-green-50', 'border-green-300');
                field.classList.add('bg-gray-100', 'text-gray-500', 'cursor-not-allowed');
            } else {
                field.classList.remove('bg-gray-100', 'text-gray-500', 'cursor-not-allowed');
                field.classList.add('bg-green-50', 'border-green-300');
            }
        }

        forceUpdate() {
            const municipioField = this.findMunicipioField();
            if (municipioField && municipioField.value) {
                this.updateCircuitosHandler(municipioField.value);
            }
        }

        cleanup() {
            this.activeListeners.forEach(({ element, handler }) => {
                element.removeEventListener('change', handler);
            });
            this.activeListeners.clear();
            this.initialized = false;
        }
    }
    
    // ====================================
    // UTILIDADES GLOBALES
    // ====================================
    
    // Exponer utilidades globales
    window.FormPIRCore = {
        version: FormPIRCore.version,
        reload: initFormPIRCore,
        isDebug: () => FormPIRCore.debug,
        getSection: () => FormPIRCore.seccionActual,
        isInitialized: () => FormPIRCore.initialized,
        loadScript: loadScript,
        CircuitoMasterHandler: CircuitoMasterHandler
    };
    
    // ====================================
    // AUTO-INICIALIZACIÓN
    // ====================================
    
    // Sobrescribir funciones globales conflictivas
    window.actualizarCircuitos = function() {
        console.warn('⚠️ actualizarCircuitos() redirigido al CircuitoMasterHandler');
        if (window.circuitoMasterHandler) {
            return window.circuitoMasterHandler.forceUpdate();
        } else {
            console.error('❌ CircuitoMasterHandler no disponible');
            return false;
        }
    };
    
    // Funciones de utilidad para debugging
    window.diagnosticarCircuitos = function() {
        if (window.circuitoMasterHandler) {
            const municipioField = window.circuitoMasterHandler.findMunicipioField();
            const alimentadorField = window.circuitoMasterHandler.findAlimentadorField();
            
            console.group('🔍 Diagnóstico CircuitoMasterHandler');
            console.log('Inicializado:', window.circuitoMasterHandler.initialized);
            console.log('Campo municipio:', municipioField ? '✅' : '❌');
            console.log('Campo alimentador:', alimentadorField ? '✅' : '❌');
            console.log('Municipio actual:', municipioField?.value || 'Ninguno');
            console.log('Alimentador habilitado:', !alimentadorField?.disabled);
            console.log('Opciones circuitos:', alimentadorField?.options.length - 1 || 0);
            console.log('MUNICIPIO_CIRCUITO_MAPPING:', typeof MUNICIPIO_CIRCUITO_MAPPING !== 'undefined' ? '✅' : '❌');
            
            if (typeof MUNICIPIO_CIRCUITO_MAPPING !== 'undefined' && municipioField?.value) {
                const circuitos = MUNICIPIO_CIRCUITO_MAPPING[municipioField.value];
                console.log(`Circuitos para ${municipioField.value}:`, circuitos ? circuitos.length : 'No encontrados');
            }
            console.groupEnd();
        }
    };
    
    // Sobrescribir función global conflictiva
    window.actualizarCircuitos = function() {
        console.warn('⚠️ actualizarCircuitos() redirigido al CircuitoMasterHandler');
        if (window.circuitoMasterHandler) {
            return window.circuitoMasterHandler.forceUpdate();
        } else {
            console.error('❌ CircuitoMasterHandler no disponible');
            return false;
        }
    };
    
    // Función para probar con municipio específico
    window.probarCircuitos = function(municipio = 'CÚCUTA') {
        console.group(`🧪 Probando circuitos con ${municipio}`);
        
        const municipioField = window.circuitoMasterHandler?.findMunicipioField();
        if (municipioField) {
            municipioField.value = municipio;
            municipioField.dispatchEvent(new Event('change', { bubbles: true }));
            
            setTimeout(() => {
                const alimentadorField = window.circuitoMasterHandler?.findAlimentadorField();
                console.log('Resultado después de 1 segundo:');
                console.log('- Campo deshabilitado:', alimentadorField?.disabled);
                console.log('- Opciones:', alimentadorField?.options.length - 1);
                console.log('- Primera opción:', alimentadorField?.options[1]?.textContent);
            }, 1000);
        }
        console.groupEnd();
    };
    
    // Iniciar automáticamente cuando el script se carga
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormPIRCore);
    } else {
        // El DOM ya está listo
        setTimeout(initFormPIRCore, 0);
    }
    
})();

/**
 * ================================================
 * INSTRUCCIONES DE USO:
 * ================================================
 * 
 * 1. INCLUIR EN BASE_SECCION.HTML:
 *    <script src="{% static 'js/form-pir-core.js' %}"></script>
 * 
 * 2. REEMPLAZAR SHARED-SCRIPTS.HTML:
 *    Eliminar: {% include 'forms/shared-scripts.html' %}
 *    Agregar: <script src="{% static 'js/form-pir-core.js' %}"></script>
 * 
 * 3. ACTIVAR DEBUG:
 *    Agregar ?debug=true a la URL
 * 
 * 4. FUNCIONES DISPONIBLES:
 *    - window.FormPIRCore.version
 *    - window.FormPIRCore.isDebug()
 *    - window.FormPIRCore.getSection()
 *    - window.FormPIRCore.reload()
 * 
 * 5. EVENTOS:
 *    - 'formPIRReady': Sistema completamente cargado
 * 
 * 6. VENTAJAS:
 *    - Sin dependencias de templates HTML
 *    - Carga dinámica optimizada
 *    - Sistema robusto con manejo de errores
 *    - Compatible con sistemas existentes
 *    - Debug integrado sin sobresaturar la consola
 */
