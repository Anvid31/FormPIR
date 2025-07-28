/**
 * Inicialización Principal de la Aplicación FormPIR
 * Controla la carga y coordinación de todos los módulos
 */

class App {
    constructor() {
        this.modules = new Map();
        this.initialized = false;
    }
    
    async init() {
        if (this.initialized) return;
        
        try {
            // 1. Inicializar logger
            window.logger?.info('Iniciando aplicación FormPIR');
            
            // 2. Detectar sección actual
            const seccion = document.body?.dataset?.section || 'estructuras';
            window.CURRENT_SECTION = seccion;
            
            // 3. Inicializar módulos
            await this.initializeModules();
            
            // 4. Configurar eventos globales
            this.setupGlobalEvents();
            
            this.initialized = true;
            window.logger?.info('Aplicación iniciada correctamente');
            
        } catch (error) {
            window.logger?.error('Error iniciando aplicación:', error);
        }
    }
    
    async initializeModules() {
        // Tipos de inversión
        if (document.getElementById('t_inv')) {
            window.tiposInversion = new TiposInversion();
            this.modules.set('tiposInversion', window.tiposInversion);
        }
        
        // Manager de iteraciones
        if (typeof IteracionesManager !== 'undefined') {
            window.iteracionesManager = new IteracionesManager();
            await window.iteracionesManager.init();
            this.modules.set('iteraciones', window.iteracionesManager);
        }
        
        // Transformador autocompletado
        if (document.getElementById('tipo_transformador')) {
            window.transformadorAutocompletado = new TransformadorAutocompletado();
            this.modules.set('transformador', window.transformadorAutocompletado);
        }
        
        // Selector UC si existe
        if (document.getElementById('uc-selector-content') && window.UCHierarchicalSelector) {
            window.ucSelector = new UCHierarchicalSelector({
                container: document.getElementById('uc-selector-content'),
                onSelect: (data) => this.handleUCSelection(data)
            });
            this.modules.set('ucSelector', window.ucSelector);
        }
    }
    
    handleUCSelection(data) {
        const ucCodigo = document.getElementById('uc_nueva');
        const ucDescripcion = document.getElementById('descripcion_uc');
        
        if (ucCodigo) ucCodigo.value = data.code || '';
        if (ucDescripcion) ucDescripcion.value = data.description || '';
        
        window.logger?.info('UC seleccionada:', data.code);
    }
    
    setupGlobalEvents() {
        // Prevenir envío accidental del formulario
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'form-total') {
                e.preventDefault();
                this.handleFormSubmit();
            }
        });
        
        // Validación de coordenadas
        document.querySelectorAll('[id*="latitud"], [id*="longitud"]').forEach(input => {
            input.addEventListener('change', (e) => this.validateCoordinate(e.target));
        });
    }
    
    validateCoordinate(input) {
        const value = parseFloat(input.value);
        const isLatitude = input.id.includes('latitud');
        
        if (isLatitude && (value < -90 || value > 90)) {
            input.setCustomValidity('Latitud debe estar entre -90 y 90');
        } else if (!isLatitude && (value < -180 || value > 180)) {
            input.setCustomValidity('Longitud debe estar entre -180 y 180');
        } else {
            input.setCustomValidity('');
        }
    }
    
    async handleFormSubmit() {
        window.logger?.info('Enviando formulario...');
        // Implementar lógica de envío del formulario
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
});
