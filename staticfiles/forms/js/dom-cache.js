/**
 * DOM Cache System - Sistema de cache para elementos DOM
 * Evita búsquedas repetitivas y mejora el rendimiento
 */

class DOMCache {
    constructor() {
        this.cache = new Map();
        this.currentSection = null;
        this.observers = new Map();
        this.debug = false;
    }

    /**
     * Establece la sección actual y limpia cache relevante
     */
    setCurrentSection(section) {
        if (this.currentSection !== section) {
            const oldSection = this.currentSection;
            this.currentSection = section;
            
            // Limpiar cache de sección anterior
            if (oldSection) {
                this.clearSectionCache(oldSection);
            }
            
            this.log(`📍 Sección cambiada: ${oldSection} → ${section}`);
        }
    }

    /**
     * Obtiene un elemento con cache inteligente
     */
    getElement(elementId, forceRefresh = false) {
        const key = this.generateKey(elementId);
        
        if (!forceRefresh && this.cache.has(key)) {
            const cachedElement = this.cache.get(key);
            // Verificar que el elemento aún está en el DOM
            if (cachedElement && document.contains(cachedElement)) {
                this.log(`💾 Cache hit: ${elementId}`);
                return cachedElement;
            } else {
                // Elemento removido del DOM, limpiar cache
                this.cache.delete(key);
                this.log(`🗑️ Cache invalidado: ${elementId}`);
            }
        }

        const element = this.findElement(elementId);
        if (element) {
            this.cache.set(key, element);
            this.log(`🔍 Elemento encontrado y cacheado: ${elementId}`);
        } else {
            this.log(`❌ Elemento no encontrado: ${elementId}`);
        }
        
        return element;
    }

    /**
     * Búsqueda inteligente de elementos por sección
     */
    findElement(elementId) {
        // 1. Búsqueda en sección actual
        if (this.currentSection) {
            const sectionElement = document.querySelector(`[data-form-section="${this.currentSection}"]`);
            if (sectionElement) {
                let element = sectionElement.querySelector(`#${elementId}`);
                if (element) return element;
                
                // También buscar por name attribute
                element = sectionElement.querySelector(`[name="${elementId}"]`);
                if (element) return element;
            }
        }
        
        // 2. Búsqueda global por ID
        let element = document.getElementById(elementId);
        if (element) return element;
        
        // 3. Búsqueda global por name
        element = document.querySelector(`[name="${elementId}"]`);
        if (element) return element;
        
        // 4. Búsqueda en contenedores visibles
        const visibleContainers = document.querySelectorAll('.active, [style*="display: block"], [style*="display: flex"]');
        for (const container of visibleContainers) {
            element = container.querySelector(`#${elementId}, [name="${elementId}"]`);
            if (element) return element;
        }
        
        return null;
    }

    /**
     * Obtiene múltiples elementos de una vez
     */
    getElements(elementIds, forceRefresh = false) {
        const elements = {};
        elementIds.forEach(id => {
            elements[id] = this.getElement(id, forceRefresh);
        });
        return elements;
    }

    /**
     * Invalida cache para un elemento específico
     */
    invalidateElement(elementId) {
        const key = this.generateKey(elementId);
        const wasDeleted = this.cache.delete(key);
        if (wasDeleted) {
            this.log(`🗑️ Cache invalidado manualmente: ${elementId}`);
        }
        return wasDeleted;
    }

    /**
     * Limpia cache de una sección específica
     */
    clearSectionCache(section) {
        const keysToDelete = [];
        for (const key of this.cache.keys()) {
            if (key.startsWith(`${section}_`)) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => this.cache.delete(key));
        this.log(`🧹 Cache limpiado para sección: ${section} (${keysToDelete.length} elementos)`);
    }

    /**
     * Limpia todo el cache
     */
    clearCache() {
        const size = this.cache.size;
        this.cache.clear();
        this.log(`🧹 Cache completamente limpiado (${size} elementos)`);
    }

    /**
     * Genera clave única para el cache
     */
    generateKey(elementId) {
        return `${this.currentSection || 'global'}_${elementId}`;
    }

    /**
     * Observa cambios en el DOM para invalidar cache automáticamente
     */
    startDOMObserver() {
        if (this.domObserver) {
            this.stopDOMObserver();
        }

        this.domObserver = new MutationObserver((mutations) => {
            let shouldClearCache = false;
            
            mutations.forEach(mutation => {
                // Si se añaden o quitan nodos, limpiar cache
                if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                    shouldClearCache = true;
                }
                
                // Si cambian atributos importantes, limpiar cache
                if (mutation.type === 'attributes' && ['id', 'name', 'data-form-section'].includes(mutation.attributeName)) {
                    shouldClearCache = true;
                }
            });
            
            if (shouldClearCache) {
                this.clearCache();
                this.log('🔄 Cache limpiado por cambios DOM');
            }
        });

        this.domObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['id', 'name', 'data-form-section']
        });

        this.log('👁️ Observador DOM iniciado');
    }

    /**
     * Detiene observación del DOM
     */
    stopDOMObserver() {
        if (this.domObserver) {
            this.domObserver.disconnect();
            this.domObserver = null;
            this.log('👁️ Observador DOM detenido');
        }
    }

    /**
     * Obtiene estadísticas del cache
     */
    getStats() {
        return {
            size: this.cache.size,
            currentSection: this.currentSection,
            keys: Array.from(this.cache.keys())
        };
    }

    /**
     * Habilita/deshabilita logging
     */
    setDebug(enabled) {
        this.debug = enabled;
    }

    /**
     * Logging interno
     */
    log(message) {
        if (this.debug) {
            console.log(`[DOMCache] ${message}`);
        }
    }

    /**
     * Limpieza al destruir la instancia
     */
    destroy() {
        this.stopDOMObserver();
        this.clearCache();
        this.log('💥 DOMCache destruido');
    }
}

// Crear instancia global
window.domCache = new DOMCache();

// Inicializar observador DOM automáticamente
document.addEventListener('DOMContentLoaded', () => {
    window.domCache.startDOMObserver();
    console.log('🚀 DOMCache inicializado');
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOMCache;
}
