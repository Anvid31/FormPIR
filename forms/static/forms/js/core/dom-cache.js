/**
 * Cache simple para elementos DOM
 * Elimina los warnings de "DOMCache no disponible"
 */

class DOMCache {
    constructor() {
        this.cache = {};
        this.currentSection = 'unknown';
    }
    
    /**
     * Obtiene un elemento del cache o del DOM
     */
    get(id) {
        if (!this.cache[id]) {
            this.cache[id] = document.getElementById(id);
        }
        return this.cache[id];
    }
    
    /**
     * Obtiene elemento con prefijo de sección
     */
    getElement(id, sectionPrefix = '') {
        // Intentar con prefijo primero si se proporciona
        if (sectionPrefix) {
            const elementWithPrefix = this.get(`${sectionPrefix}_${id}`);
            if (elementWithPrefix) return elementWithPrefix;
        }
        
        // Fallback a elemento sin prefijo
        return this.get(id);
    }
    
    /**
     * Limpia el cache completo
     */
    clear() {
        this.cache = {};
        if (window.logger) window.logger.log('🧹 DOMCache limpiado');
    }
    
    /**
     * Elimina un elemento específico del cache
     */
    remove(id) {
        delete this.cache[id];
    }
    
    /**
     * Obtiene estadísticas del cache
     */
    getStats() {
        const cachedElements = Object.keys(this.cache).length;
        const validElements = Object.values(this.cache).filter(el => el !== null).length;
        
        return {
            total: cachedElements,
            valid: validElements,
            invalid: cachedElements - validElements,
            currentSection: this.currentSection
        };
    }
    
    /**
     * Pre-cachea elementos comunes
     */
    preCache(elementIds) {
        const cached = [];
        elementIds.forEach(id => {
            const element = this.get(id);
            if (element) {
                cached.push(id);
            }
        });
        if (window.logger) window.logger.log('📦 Pre-cache completado:', cached.length, 'elementos');
        return cached;
    }
    
    /**
     * Actualiza la sección actual
     */
    setCurrentSection(section) {
        this.currentSection = section;
        if (window.logger) window.logger.log('📍 Sección actual actualizada:', section);
    }
}

// Crear instancia global
window.DOMCache = new DOMCache();

// También crear la interfaz que esperan las utilidades
window.domCache = {
    getElement: (id, sectionPrefix = '') => window.DOMCache.getElement(id, sectionPrefix),
    currentSection: 'unknown'
};

// Auto-detectar sección actual
function detectCurrentSection() {
    const body = document.body;
    const section = body.dataset.section || 
                   body.getAttribute('data-section') ||
                   (window.location.pathname.includes('estructuras') ? 'estructuras' :
                    window.location.pathname.includes('conductores') ? 'conductores' :
                    window.location.pathname.includes('equipos') ? 'equipos' :
                    window.location.pathname.includes('transformador') ? 'transformador' : 'unknown');
    
    window.DOMCache.setCurrentSection(section);
    window.domCache.currentSection = section;
    
    return section;
}

// Pre-cachear elementos comunes de formularios
function preCacheCommonElements() {
    const commonElements = [
        'nombre', 'banco_proyecto', 'contrato', 'municipio', 
        'departamento', 'regional', 'direccion', 'alimentador',
        't_inv', 'fecha', 'latitud', 'longitud'
    ];
    
    return window.DOMCache.preCache(commonElements);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        detectCurrentSection();
        preCacheCommonElements();
    });
} else {
    detectCurrentSection();
    preCacheCommonElements();
}

// Escuchar cambios de sección
document.addEventListener('sectionChanged', (event) => {
    if (event.detail && event.detail.section) {
        window.DOMCache.setCurrentSection(event.detail.section);
        window.domCache.currentSection = event.detail.section;
    }
});

if (window.logger) window.logger.log('💾 DOMCache inicializado correctamente');