/**
 * AutoCompletion Utils - Utilidades centralizadas para autocompletado
 * Evita duplicación de código y centraliza lógica común
 */

class AutoCompletionUtils {
    /**
     * Obtiene elemento usando cache DOM con fallbacks inteligentes
     */
    static getElement(elementId, sectionPrefix = '') {
        if (!window.domCache) {
            console.warn('DOMCache no disponible, usando búsqueda directa');
            return document.getElementById(sectionPrefix ? `${sectionPrefix}_${elementId}` : elementId);
        }

        // Intentar con prefijo primero si se proporciona
        if (sectionPrefix) {
            const elementWithPrefix = window.domCache.getElement(`${sectionPrefix}_${elementId}`);
            if (elementWithPrefix) return elementWithPrefix;
        }

        // Fallback a elemento sin prefijo
        return window.domCache.getElement(elementId);
    }

    /**
     * Obtiene múltiples elementos de una sección
     */
    static getElements(elementIds, sectionPrefix = '') {
        const elements = {};
        elementIds.forEach(id => {
            elements[id] = this.getElement(id, sectionPrefix);
        });
        return elements;
    }

    /**
     * Actualiza estado visual de un campo (éxito, error, neutro)
     */
    static updateFieldVisualState(field, state, value = null) {
        if (!field) return false;

        // Remover todas las clases de estado
        field.classList.remove(
            "bg-green-50", "border-green-300",    // Éxito
            "bg-red-50", "border-red-300",        // Error
            "bg-blue-50", "border-blue-300",      // Info
            "bg-yellow-50", "border-yellow-300",  // Advertencia
            "bg-gray-100", "text-gray-500", "cursor-not-allowed"  // Deshabilitado
        );

        // Aplicar estado correspondiente
        switch (state) {
            case 'success':
                field.classList.add("bg-green-50", "border-green-300");
                field.disabled = false;
                break;
                
            case 'error':
                field.classList.add("bg-red-50", "border-red-300");
                field.disabled = false;
                break;
                
            case 'info':
                field.classList.add("bg-blue-50", "border-blue-300");
                field.disabled = false;
                break;
                
            case 'warning':
                field.classList.add("bg-yellow-50", "border-yellow-300");
                field.disabled = false;
                break;
                
            case 'disabled':
                field.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
                field.disabled = true;
                break;
                
            case 'neutral':
            default:
                field.disabled = false;
                break;
        }

        // Actualizar valor si se proporciona
        if (value !== null) {
            field.value = value;
        }

        return true;
    }

    /**
     * Limpia y configura opciones de un select
     */
    static populateSelect(selectElement, options, placeholder = "Seleccionar") {
        if (!selectElement) return false;

        // Limpiar opciones existentes
        selectElement.innerHTML = `<option value="">${placeholder}</option>`;

        // Agregar nuevas opciones
        options.forEach(option => {
            const optionElement = document.createElement("option");
            
            if (typeof option === 'string') {
                optionElement.value = option;
                optionElement.textContent = option;
            } else if (typeof option === 'object') {
                optionElement.value = option.value || option.codigo || option.id;
                optionElement.textContent = option.text || option.nombre || option.descripcion || option.value;
                
                // Agregar datos adicionales como atributos
                if (option.data) {
                    Object.keys(option.data).forEach(key => {
                        optionElement.dataset[key] = option.data[key];
                    });
                }
            }
            
            selectElement.appendChild(optionElement);
        });

        return true;
    }

    /**
     * Limpia campos dependientes
     */
    static clearDependentFields(fieldIds, sectionPrefix = '') {
        const clearedFields = [];
        
        fieldIds.forEach(fieldId => {
            const field = this.getElement(fieldId, sectionPrefix);
            if (field) {
                if (field.tagName === 'SELECT') {
                    field.innerHTML = '<option value="">Seleccionar</option>';
                } else {
                    field.value = '';
                }
                
                // Resetear estado visual
                this.updateFieldVisualState(field, 'neutral');
                clearedFields.push(fieldId);
            }
        });

        console.log(`🧹 Campos dependientes limpiados:`, clearedFields);
        return clearedFields;
    }

    /**
     * Configura campo como de solo lectura con valor autocompletado
     */
    static setReadOnlyWithValue(field, value, placeholder = null) {
        if (!field) return false;

        field.value = value;
        field.disabled = true;
        this.updateFieldVisualState(field, 'success');
        
        if (placeholder) {
            field.placeholder = placeholder;
        }

        return true;
    }

    /**
     * Valida que los campos requeridos tengan valores
     */
    static validateRequiredFields(fieldIds, sectionPrefix = '') {
        const validation = {
            isValid: true,
            missingFields: [],
            validFields: []
        };

        fieldIds.forEach(fieldId => {
            const field = this.getElement(fieldId, sectionPrefix);
            if (field) {
                const value = field.value?.trim();
                if (!value || value === '') {
                    validation.missingFields.push(fieldId);
                    this.updateFieldVisualState(field, 'error');
                } else {
                    validation.validFields.push(fieldId);
                    this.updateFieldVisualState(field, 'success');
                }
            }
        });

        validation.isValid = validation.missingFields.length === 0;
        
        return validation;
    }

    /**
     * Debounce para funciones que se ejecutan frecuentemente
     */
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    /**
     * Throttle para funciones que necesitan ejecutarse regularmente
     */
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Configura event listeners de manera inteligente
     */
    static setupEventListeners(elements, eventType, handler, options = {}) {
        const { 
            debounceWait = 0, 
            throttleLimit = 0, 
            removeExisting = true,
            sectionPrefix = ''
        } = options;

        let finalHandler = handler;

        // Aplicar debounce si se especifica
        if (debounceWait > 0) {
            finalHandler = this.debounce(handler, debounceWait);
        }

        // Aplicar throttle si se especifica
        if (throttleLimit > 0) {
            finalHandler = this.throttle(handler, throttleLimit);
        }

        const configuredElements = [];

        elements.forEach(elementId => {
            const element = this.getElement(elementId, sectionPrefix);
            if (element) {
                // Remover listener existente si se solicita
                if (removeExisting) {
                    element.removeEventListener(eventType, finalHandler);
                }
                
                element.addEventListener(eventType, finalHandler);
                configuredElements.push(elementId);
            }
        });

        return configuredElements;
    }

    /**
     * Obtiene datos de mapping de manera segura
     */
    static getMappingData(mappingName, key = null) {
        const mappings = {
            'proyectos': window.PROYECTO_COMPLETO_MAPPING,
            'municipios': window.MUNICIPIO_MAPPING,
            'circuitos': window.MUNICIPIO_CIRCUITO_MAPPING,
            'uc_codes': window.UC_MAPPING
        };

        const mapping = mappings[mappingName];
        if (!mapping) {
            console.warn(`⚠️ Mapping '${mappingName}' no encontrado`);
            return null;
        }

        if (key) {
            return mapping[key] || null;
        }

        return mapping;
    }

    /**
     * Busca opciones filtradas en un mapping
     */
    static filterMappingOptions(mappingName, filterField, filterValue) {
        const mapping = this.getMappingData(mappingName);
        if (!mapping) return [];

        return Object.entries(mapping).filter(([key, data]) => {
            if (typeof data === 'object' && data[filterField]) {
                return data[filterField] === filterValue;
            }
            return false;
        }).map(([key, data]) => ({
            value: key,
            text: key,
            data: data
        }));
    }

    /**
     * Registra interacción del usuario para evitar autocompletados prematuros
     */
    static markUserInteraction(source = 'unknown') {
        if (!window.userHasInteracted) {
            window.userHasInteracted = true;
            console.log(`👆 Primera interacción del usuario detectada desde: ${source}`);
        }
    }

    /**
     * Obtiene información de la sección actual
     */
    static getCurrentSection() {
        return window.domCache?.currentSection || window.currentStep || 'unknown';
    }

    /**
     * Ejecuta callback solo si el usuario ha interactuado
     */
    static executeIfUserInteracted(callback, fallbackMessage = 'Esperando interacción del usuario') {
        if (window.userHasInteracted) {
            return callback();
        } else {
            console.log(`🚫 ${fallbackMessage}`);
            return null;
        }
    }

    /**
     * Utilidad para logging consistente
     */
    static log(message, data = null, level = 'info') {
        const prefix = `[AutoComplete:${this.getCurrentSection()}]`;
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
}

// Exponer globalmente
window.AutoCompletionUtils = AutoCompletionUtils;

// Crear alias más corto para uso frecuente
window.ACUtils = AutoCompletionUtils;

console.log('🛠️ AutoCompletionUtils cargado');

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoCompletionUtils;
}
