/**
 * App Initializer - Sistema de inicialización centralizado
 * Evita múltiples inicializaciones y maneja dependencias correctamente
 */

// Flag global para prevenir múltiples inicializaciones
window.APP_INITIALIZED = window.APP_INITIALIZED || false;

class AppInitializer {
    constructor() {
        // Verificar si ya está inicializado globalmente
        if (window.APP_INITIALIZED) {
            console.log('⚠️ AppInitializer ya inicializado globalmente, saltando...');
            return;
        }
        
        // Marcar como inicializado
        window.APP_INITIALIZED = true;
        
        this.initialized = new Set();
        this.currentSection = null;
        this.dependencies = new Map();
        this.debug = false;
        
        // Configuración de dependencias por sección
        this.sectionConfigs = {
            estructuras: {
                dependencies: ['dom-cache', 'autocompletion-utils', 'data-mappings'],
                initializers: ['autocompletion', 'structure-fields'],
                eventListeners: ['estructura-fields']
            },
            conductores: {
                dependencies: ['dom-cache', 'autocompletion-utils'],
                initializers: ['autocompletion'],
                eventListeners: ['conductor-fields']
            },
            equipos: {
                dependencies: ['dom-cache', 'autocompletion-utils'],
                initializers: ['autocompletion'],
                eventListeners: ['equipo-fields']
            },
            transformadores: {
                dependencies: ['dom-cache', 'autocompletion-utils', 'transformador-autocompletado'],
                initializers: ['autocompletion', 'transformador-specific'],
                eventListeners: ['transformador-fields']
            }
        };
    }

    /**
     * Inicializa una sección específica
     */
    async initializeSection(sectionName) {
        if (this.initialized.has(sectionName)) {
            this.log(`⚠️ Sección ${sectionName} ya inicializada`);
            return { success: true, message: 'Already initialized' };
        }

        this.log(`🚀 Inicializando sección: ${sectionName}`);
        
        try {
            // 1. Establecer sección actual
            this.setCurrentSection(sectionName);
            
            // 2. Verificar dependencias
            await this.checkDependencies(sectionName);
            
            // 3. Ejecutar inicializadores en orden
            await this.runInitializers(sectionName);
            
            // 4. Configurar event listeners
            this.setupEventListeners(sectionName);
            
            // 5. Marcar como inicializada
            this.initialized.add(sectionName);
            
            this.log(`✅ Sección ${sectionName} inicializada correctamente`);
            return { success: true, message: 'Initialized successfully' };
            
        } catch (error) {
            this.log(`❌ Error inicializando sección ${sectionName}:`, error, 'error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Establece la sección actual
     */
    setCurrentSection(sectionName) {
        this.currentSection = sectionName;
        window.CURRENT_SECTION = sectionName;
        
        // Actualizar DOM cache si está disponible
        if (window.domCache) {
            window.domCache.setCurrentSection(sectionName);
        }
        
        this.log(`📍 Sección actual establecida: ${sectionName}`);
    }

    /**
     * Verifica que las dependencias estén cargadas
     */
    async checkDependencies(sectionName) {
        const config = this.sectionConfigs[sectionName];
        if (!config || !config.dependencies) return;

        const missingDependencies = [];

        for (const dep of config.dependencies) {
            const isAvailable = await this.isDependencyAvailable(dep);
            if (!isAvailable) {
                missingDependencies.push(dep);
            }
        }

        if (missingDependencies.length > 0) {
            throw new Error(`Dependencias faltantes: ${missingDependencies.join(', ')}`);
        }

        this.log(`✅ Dependencias verificadas para ${sectionName}`);
    }

    /**
     * Verifica si una dependencia está disponible
     */
    async isDependencyAvailable(dependency) {
        const dependencyChecks = {
            'dom-cache': () => window.domCache,
            'autocompletion-utils': () => window.AutoCompletionUtils || window.ACUtils,
            'data-mappings': () => window.DESS_MAPPINGS && window.MappingManager,
            'transformador-autocompletado': () => window.TransformadorAutocompletado,
            'uc-mapping': () => window.UC_MAPPING
        };

        const checker = dependencyChecks[dependency];
        if (!checker) {
            this.log(`⚠️ Verificador desconocido para dependencia: ${dependency}`, null, 'warn');
            return true; // Asumir disponible si no conocemos cómo verificar
        }

        const isAvailable = checker();
        this.log(`${isAvailable ? '✅' : '❌'} Dependencia ${dependency}: ${isAvailable ? 'disponible' : 'faltante'}`);
        
        return isAvailable;
    }

    /**
     * Ejecuta inicializadores específicos de la sección
     */
    async runInitializers(sectionName) {
        const config = this.sectionConfigs[sectionName];
        if (!config || !config.initializers) return;

        for (const initializer of config.initializers) {
            await this.runInitializer(initializer, sectionName);
        }
    }

    /**
     * Ejecuta un inicializador específico
     */
    async runInitializer(initializerName, sectionName) {
        const initializers = {
            'autocompletion': this.initializeAutocompletion.bind(this),
            'structure-fields': this.initializeStructureFields.bind(this),
            'transformador-specific': this.initializeTransformadorSpecific.bind(this)
        };

        const initializer = initializers[initializerName];
        if (initializer) {
            try {
                await initializer(sectionName);
                this.log(`✅ Inicializador ${initializerName} ejecutado`);
            } catch (error) {
                this.log(`❌ Error en inicializador ${initializerName}:`, error, 'error');
                throw error;
            }
        } else {
            this.log(`⚠️ Inicializador desconocido: ${initializerName}`, null, 'warn');
        }
    }

    /**
     * Configura event listeners para la sección
     */
    setupEventListeners(sectionName) {
        const config = this.sectionConfigs[sectionName];
        if (!config || !config.eventListeners) return;

        config.eventListeners.forEach(listenerType => {
            this.setupSpecificEventListeners(listenerType, sectionName);
        });
    }

    /**
     * Configura event listeners específicos
     */
    setupSpecificEventListeners(listenerType, sectionName) {
        const listenerConfigs = {
            'estructura-fields': {
                fields: ["material_nueva", "altura_nueva", "poblacion_nueva", "disposicion_nueva", 
                        "tipo_red_nueva", "apoyo_nueva", "peso_nueva", "configuracion_nueva"],
                event: 'change',
                handler: () => {
                    markUserInteraction();
                    if (typeof autoCompleteUC === 'function') {
                        autoCompleteUC();
                    }
                },
                debounce: 300
            },
            'conductor-fields': {
                fields: ["tipo_conductor", "calibre", "nivel_tension_conductor"],
                event: 'change',
                handler: () => {
                    markUserInteraction();
                    // Aquí iría lógica específica de conductores
                },
                debounce: 300
            },
            'transformador-fields': {
                fields: ["potencia_transformador", "tipo_transformador"],
                event: 'change',
                handler: () => {
                    markUserInteraction();
                    if (window.TransformadorAutocompletado) {
                        // Lógica específica de transformadores
                    }
                },
                debounce: 300
            }
        };

        const config = listenerConfigs[listenerType];
        if (config && window.ACUtils) {
            window.ACUtils.setupEventListeners(
                config.fields,
                config.event,
                config.handler,
                {
                    debounceWait: config.debounce,
                    removeExisting: true,
                    sectionPrefix: ''
                }
            );
            
            this.log(`🎯 Event listeners configurados: ${listenerType}`);
        }
    }

    /**
     * Inicializadores específicos
     */
    async initializeAutocompletion(sectionName) {
        if (typeof initializeAutocompletion === 'function' && !this.initialized.has('autocompletion')) {
            initializeAutocompletion();
            this.initialized.add('autocompletion');
        }
    }

    async initializeStructureFields(sectionName) {
        if (typeof updateApoyoOptions === 'function') {
            updateApoyoOptions();
        }
        
        if (typeof toggleStructureFieldsWithoutAutoComplete === 'function') {
            toggleStructureFieldsWithoutAutoComplete();
        }
    }

    async initializeTransformadorSpecific(sectionName) {
        if (typeof TransformadorAutocompletado !== 'undefined' && !this.initialized.has('transformador')) {
            new TransformadorAutocompletado();
            this.initialized.add('transformador');
        }
    }

    /**
     * Reinicializa una sección (útil para cambios dinámicos)
     */
    async reinitializeSection(sectionName) {
        this.log(`🔄 Reinicializando sección: ${sectionName}`);
        
        // Remover de inicializados
        this.initialized.delete(sectionName);
        
        // Limpiar cache DOM si está disponible
        if (window.domCache) {
            window.domCache.clearSectionCache(sectionName);
        }
        
        // Reinicializar
        return await this.initializeSection(sectionName);
    }

    /**
     * Obtiene el estado de inicialización
     */
    getInitializationStatus() {
        return {
            currentSection: this.currentSection,
            initializedSections: Array.from(this.initialized),
            availableSections: Object.keys(this.sectionConfigs)
        };
    }

    /**
     * Habilita/deshabilita debug
     */
    setDebug(enabled) {
        this.debug = enabled;
        this.log(`🐛 Debug ${enabled ? 'habilitado' : 'deshabilitado'}`);
    }

    /**
     * Logging interno
     */
    log(message, data = null, level = 'info') {
        if (!this.debug && level === 'debug') return;
        
        const prefix = `[AppInit:${this.currentSection || 'global'}]`;
        const fullMessage = `${prefix} ${message}`;
        
        switch (level) {
            case 'error':
                console.error(fullMessage, data);
                break;
            case 'warn':
                console.warn(fullMessage, data);
                break;
            case 'debug':
                console.debug(fullMessage, data);
                break;
            default:
                console.log(fullMessage, data);
        }
    }

    /**
     * Limpieza al destruir
     */
    destroy() {
        this.initialized.clear();
        this.dependencies.clear();
        this.currentSection = null;
        this.log('💥 AppInitializer destruido');
    }
}

// Crear instancia global
window.appInitializer = new AppInitializer();

// Auto-inicialización para compatibilidad
document.addEventListener('DOMContentLoaded', () => {
    // Dar tiempo para que se carguen todas las dependencias
    setTimeout(() => {
        const currentSection = window.CURRENT_SECTION || 'estructuras';
        window.appInitializer.initializeSection(currentSection);
    }, 1500);
});

console.log('🚀 AppInitializer cargado');

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppInitializer;
}
