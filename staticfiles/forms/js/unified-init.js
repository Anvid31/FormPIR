/**
 * Sistema Unificado de Inicialización - FormPIR
 * Consolida la inicialización de todos los módulos JavaScript
 * Elimina duplicación y mejora el mantenimiento
 */

class UnifiedSystemInit {
    constructor() {
        this.modules = new Map();
        this.initialized = false;
        this.currentSection = null;
        this.debug = window.DEBUG || false;
    }

    log(message, type = 'info') {
        if (this.debug) {
            const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '✅';
            console.log(`${prefix} [UnifiedSystem] ${message}`);
        }
    }

    async init() {
        try {
            this.log('🚀 Iniciando sistema unificado...');
            
            // 1. Detectar sección actual
            this.currentSection = window.CURRENT_SECTION || this.detectSection();
            this.log(`Sección detectada: ${this.currentSection}`);

            // 2. Inicializar módulos base
            await this.initializeBaseModules();

            // 3. Configurar autocompletados
            await this.setupAutocompletion();

            // 4. Integrar selector UC
            await this.integrateUCSelector();

            // 5. Configurar eventos globales
            this.setupGlobalEvents();

            this.initialized = true;
            this.log('Sistema unificado inicializado correctamente');

        } catch (error) {
            this.log(`Error en inicialización: ${error.message}`, 'error');
            console.error('Error completo:', error);
        }
    }

    detectSection() {
        // 1. Buscar en atributos de datos
        const sectionElement = document.querySelector('[data-form-section]');
        if (sectionElement) {
            return sectionElement.dataset.formSection;
        }

        // 2. Buscar en URL
        const path = window.location.pathname;
        if (path.includes('estructuras')) return 'estructuras';
        if (path.includes('conductores')) return 'conductores';
        if (path.includes('transformadores')) return 'transformadores';
        if (path.includes('equipos')) return 'equipos';

        // 3. Default
        return 'estructuras';
    }

    async initializeBaseModules() {
        // Inicializar cache de elementos si está disponible
        if (window.DOMCache && typeof window.DOMCache === 'function') {
            if (!window.domCache) {
                window.domCache = new window.DOMCache();
            }
            this.modules.set('domCache', window.domCache);
            this.log('Cache DOM inicializado');
        }

        // Inicializar manager de iteraciones si está disponible
        if (window.IteracionesManager) {
            if (!window.iteracionesManager) {
                window.iteracionesManager = new window.IteracionesManager();
            }
            if (window.iteracionesManager.init) {
                await window.iteracionesManager.init();
            }
            this.modules.set('iteraciones', window.iteracionesManager);
            this.log('Manager de iteraciones inicializado');
        }

        // Inicializar autocompletados si están disponibles
        if (typeof window.initializeAutocompletion === 'function') {
            window.initializeAutocompletion();
            this.log('Autocompletados legacy inicializados');
        }
    }

    async setupAutocompletion() {
        // Configuración específica por sección
        const configs = {
            estructuras: {
                fields: ['nombre', 'banco_proyecto', 'contrato', 'municipio'],
                handlers: {
                    nombre: ['autoCompleteBanco', 'actualizarContratos'],
                    municipio: ['autoCompleteDepartamento', 'actualizarCircuitos'],
                    contrato: ['autoCompleteRegional']
                }
            },
            conductores: {
                fields: ['nombre', 'banco_proyecto', 'contrato', 'municipio'],
                handlers: {
                    nombre: ['autoCompleteBanco', 'actualizarContratos'],
                    municipio: ['autoCompleteDepartamento']
                }
            },
            transformadores: {
                fields: ['nombre', 'banco_proyecto', 'contrato'],
                handlers: {
                    nombre: ['autoCompleteBanco'],
                    contrato: ['autoCompleteRegional']
                }
            },
            equipos: {
                fields: ['nombre', 'banco_proyecto'],
                handlers: {
                    nombre: ['autoCompleteBanco']
                }
            }
        };

        const config = configs[this.currentSection];
        if (config) {
            this.attachAutocompletionHandlers(config);
            this.log(`Autocompletados configurados para ${this.currentSection}`);
        }
    }

    attachAutocompletionHandlers(config) {
        Object.entries(config.handlers).forEach(([fieldId, handlers]) => {
            const element = this.getElement(fieldId);
            if (element) {
                handlers.forEach(handlerName => {
                    if (typeof window[handlerName] === 'function') {
                        element.addEventListener('change', window[handlerName]);
                        this.log(`Handler ${handlerName} asociado a ${fieldId}`);
                    }
                });
            }
        });
    }

    async integrateUCSelector() {
        const container = document.getElementById('uc-hierarchical-selector');
        const trigger = document.getElementById('uc-selector-trigger');
        
        if (container && trigger && window.UCHierarchicalSelector) {
            // Inicializar el selector UC jerárquico
            const selector = new UCHierarchicalSelector({
                container: container,
                section: this.currentSection,
                onSelect: (ucData) => this.handleUCSelection(ucData),
                onClose: () => this.hideUCSelector()
            });

            // Configurar evento del trigger
            trigger.addEventListener('click', () => {
                this.showUCSelector();
            });

            this.modules.set('ucSelector', selector);
            this.log('Selector UC jerárquico integrado');
        } else {
            this.log('Selector UC no disponible o elementos no encontrados', 'warn');
        }
    }

    showUCSelector() {
        const selector = document.getElementById('uc-hierarchical-selector');
        if (selector) {
            selector.style.display = 'block';
            // Cambiar icono del trigger
            const icon = document.querySelector('#uc-selector-trigger .fa-chevron-down');
            if (icon) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        }
    }

    hideUCSelector() {
        const selector = document.getElementById('uc-hierarchical-selector');
        if (selector) {
            selector.style.display = 'none';
            // Cambiar icono del trigger
            const icon = document.querySelector('#uc-selector-trigger .fa-chevron-up');
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        }
    }

    handleUCSelection(ucData) {
        // Actualizar campos del formulario
        const ucField = this.getElement('uc_nueva');
        const displayText = document.getElementById('uc-display-text');
        const displayDescription = document.getElementById('uc-display-description');
        const displayCode = document.getElementById('uc-display-code');

        if (ucField && ucData) {
            // Actualizar campo oculto
            ucField.value = ucData.codigo;

            // Actualizar visualización
            if (displayText) {
                displayText.textContent = ucData.descripcion || 'UC Seleccionado';
                displayText.classList.add('text-green-600', 'font-semibold');
            }

            if (displayDescription) {
                displayDescription.textContent = ucData.descripcion_completa || '';
                displayDescription.style.display = 'block';
            }

            if (displayCode) {
                displayCode.textContent = ucData.codigo;
                displayCode.style.display = 'inline-block';
                displayCode.classList.remove('bg-blue-100', 'text-blue-800');
                displayCode.classList.add('bg-green-100', 'text-green-800');
            }

            this.log(`UC seleccionado: ${ucData.codigo}`);
        }

        // Ocultar selector después de selección
        this.hideUCSelector();
    }

    setupGlobalEvents() {
        // Evento para cerrar selector UC al hacer clic fuera
        document.addEventListener('click', (event) => {
            const container = document.getElementById('uc-selector-container');
            const selector = document.getElementById('uc-hierarchical-selector');
            
            if (container && selector && selector.style.display === 'block') {
                if (!container.contains(event.target)) {
                    this.hideUCSelector();
                }
            }
        });

        // Tecla ESC para cerrar selector
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.hideUCSelector();
            }
        });

        this.log('Eventos globales configurados');
    }

    getElement(id) {
        // Usar cache DOM si está disponible
        if (this.modules.has('domCache')) {
            return this.modules.get('domCache').getElement(id);
        }
        
        // Fallback a búsqueda directa
        return document.getElementById(id);
    }

    // Método para reinicializar si es necesario
    async reinitialize() {
        this.initialized = false;
        this.modules.clear();
        await this.init();
    }

    // Método para obtener estado del sistema
    getStatus() {
        return {
            initialized: this.initialized,
            section: this.currentSection,
            modules: Array.from(this.modules.keys()),
            debug: this.debug
        };
    }
}

// Inicialización automática cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    // Crear instancia global del sistema
    window.unifiedSystem = new UnifiedSystemInit();
    
    // Inicializar el sistema
    await window.unifiedSystem.init();
    
    // Exponer estado en consola si está en modo debug
    if (window.DEBUG) {
        console.log('🔍 Estado del sistema:', window.unifiedSystem.getStatus());
    }
});

// Exponer para uso manual si es necesario
window.UnifiedSystemInit = UnifiedSystemInit;
