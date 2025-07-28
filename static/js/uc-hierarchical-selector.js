/**
 * Componente de Selector Jerárquico de UC
 * Implementa la interfaz dinámica para selección de Uni    getCategoryIcon(category) {
        const icons = {
            postes: '🏗️',
            postes_peso: '⚖️',
            estructuras: '🏢',
            alta_tension: '⚡',
            transformadores: '🔌',
            conductores: '🔗',
            equipos: '🛡️'
        };
        return icons[category] || '📦';
    }uctivas
 */

class UCHierarchicalSelector {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.options = {
            onSelectionChange: options.onSelectionChange || (() => {}),
            onComplete: options.onComplete || (() => {}),
            showPreview: options.showPreview !== false,
            categoryFilter: options.categoryFilter || null, // Nuevo: filtro de categorías
            ...options
        };
        
        this.currentCategory = null;
        this.currentSelections = {};
        this.currentStep = 0;
        this.categoryFilter = options.categoryFilter || null;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error(`Container with id '${this.containerId}' not found`);
            return;
        }
        
        this.render();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="uc-hierarchical-selector">
                <div class="uc-selector-header">
                    <h3>Selector de Unidad Constructiva</h3>
                    <div class="uc-progress-bar">
                        <div class="uc-progress-fill" style="width: 0%"></div>
                    </div>
                </div>
                
                <div class="uc-category-selection" id="uc-category-selection">
                    ${this.renderCategorySelection()}
                </div>
                
                <div class="uc-level-selection" id="uc-level-selection" style="display: none;">
                    <!-- Los niveles se cargarán dinámicamente -->
                </div>
                
                <div class="uc-preview" id="uc-preview" style="display: none;">
                    <h4>Vista Previa:</h4>
                    <div class="uc-preview-content">
                        <span class="uc-code"></span>
                        <span class="uc-description"></span>
                    </div>
                </div>
                
                <div class="uc-actions">
                    <button class="btn btn-secondary" id="uc-back-btn" style="display: none;">
                        ← Atrás
                    </button>
                    <button class="btn btn-primary" id="uc-next-btn" style="display: none;">
                        Siguiente →
                    </button>
                    <button class="btn btn-success" id="uc-complete-btn" style="display: none;">
                        Confirmar Selección
                    </button>
                </div>
            </div>
        `;
        
        this.attachEventListeners();
    }
    
    renderCategorySelection() {
        if (!window.UC_HIERARCHICAL_STRUCTURE) {
            return '<div class="error">Sistema UC no disponible. Verifica que los archivos JavaScript se hayan cargado correctamente.</div>';
        }
        
        console.log(`🔍 [${this.containerId}] Aplicando filtro de categorías:`, this.categoryFilter);
        console.log(`📦 [${this.containerId}] Estructura UC disponible:`, Object.keys(window.UC_HIERARCHICAL_STRUCTURE));
        
        // Aplicar filtro de categorías si está definido
        const categories = this.categoryFilter 
            ? Object.entries(window.UC_HIERARCHICAL_STRUCTURE).filter(([key]) => {
                const isIncluded = this.categoryFilter.includes(key);
                console.log(`   - [${this.containerId}] ${key}: ${isIncluded ? 'INCLUIDO' : 'EXCLUIDO'}`);
                return isIncluded;
              })
            : Object.entries(window.UC_HIERARCHICAL_STRUCTURE);
        
        console.log(`✅ [${this.containerId}] Categorías filtradas:`, categories.map(([key]) => key));
        
        return `
            <div class="uc-categories">
                <h4>Selecciona el tipo de unidad constructiva:</h4>
                <div class="uc-category-grid">
                    ${categories.map(([key, config]) => `
                        <div class="uc-category-card" data-category="${key}">
                            <div class="uc-category-icon">
                                ${this.getCategoryIcon(config.category)}
                            </div>
                            <h5>${config.label}</h5>
                            <p>${this.getCategoryDescription(config.category)}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    getCategoryIcon(category) {
        const icons = {
            postes: '🗼',
            postes_peso: '⚖️',
            estructuras: '🏗️',
            alta_tension: '⚡',
            transformadores: '🔌',
            conductores: '�',  // Cambiar a icono de cadena/conexión
            equipos: '🛡️'      // Cambiar a icono de escudo/protección
        };
        return icons[category] || '📦';
    }
    
    getCategoryDescription(category) {
        const descriptions = {
            postes: 'Postes básicos con diferentes materiales y configuraciones',
            postes_peso: 'Postes con especificaciones de peso específicas',
            estructuras: 'Estructuras avanzadas y configuraciones complejas',
            alta_tension: 'Estructuras para líneas de alta tensión',
            transformadores: 'Transformadores de diferentes tipos y potencias',
            conductores: 'Cables y conductores eléctricos',
            equipos: 'Equipos de protección y control'
        };
        return descriptions[category] || 'Unidades constructivas especializadas';
    }
    
    attachEventListeners() {
        // Selección de categoría
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.uc-category-card')) {
                const category = e.target.closest('.uc-category-card').dataset.category;
                this.selectCategory(category);
            }
        });
        
        // Botones de navegación
        document.getElementById('uc-back-btn')?.addEventListener('click', () => {
            this.goBack();
        });
        
        document.getElementById('uc-next-btn')?.addEventListener('click', () => {
            this.goNext();
        });
        
        document.getElementById('uc-complete-btn')?.addEventListener('click', () => {
            this.completeSelection();
        });
    }
    
    selectCategory(category) {
        this.currentCategory = category;
        this.currentSelections = {};
        this.currentStep = 0;
        
        // Ocultar selección de categoría
        document.getElementById('uc-category-selection').style.display = 'none';
        
        // Mostrar selección de niveles
        const levelContainer = document.getElementById('uc-level-selection');
        levelContainer.style.display = 'block';
        
        this.renderCurrentLevel();
        this.updateNavigation();
        this.updateProgress();
    }
    
    renderCurrentLevel() {
        if (!this.currentCategory || !window.UC_HIERARCHICAL_STRUCTURE) return;
        
        const categoryConfig = window.UC_HIERARCHICAL_STRUCTURE[this.currentCategory];
        if (!categoryConfig || !categoryConfig.levels) return;
        
        const levels = Object.keys(categoryConfig.levels);
        const currentLevelKey = levels[this.currentStep];
        const currentLevel = categoryConfig.levels[currentLevelKey];
        
        if (!currentLevel) return;
        
        const levelContainer = document.getElementById('uc-level-selection');
        levelContainer.innerHTML = `
            <div class="uc-level">
                <h4>${currentLevel.label}</h4>
                <div class="uc-options-grid">
                    ${Object.entries(currentLevel.options).map(([key, label]) => `
                        <div class="uc-option-card" data-value="${key}" data-level="${currentLevelKey}">
                            <span>${label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Remover listeners anteriores y agregar uno nuevo
        levelContainer.replaceWith(levelContainer.cloneNode(true));
        const newLevelContainer = document.getElementById('uc-level-selection');
        
        newLevelContainer.addEventListener('click', (e) => {
            if (e.target.closest('.uc-option-card')) {
                const card = e.target.closest('.uc-option-card');
                const value = card.dataset.value;
                const level = card.dataset.level;
                console.log(`Click detectado - Nivel: ${level}, Valor: ${value}`);
                this.selectOption(level, value);
            }
        });
    }
    
    selectOption(levelKey, value) {
        console.log(`Seleccionando nivel: ${levelKey}, valor: ${value}`);
        
        // Prevenir selecciones duplicadas
        if (this.currentSelections[levelKey] === value) {
            console.log('Selección duplicada ignorada');
            return;
        }
        
        this.currentSelections[levelKey] = value;
        console.log('Selecciones actuales:', this.currentSelections);
        
        // Marcar opción como seleccionada
        document.querySelectorAll('.uc-option-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const targetCard = document.querySelector(`[data-value="${value}"][data-level="${levelKey}"]`);
        if (targetCard) {
            targetCard.classList.add('selected');
        }
        
        this.updatePreview();
        this.updateNavigation();
        this.options.onSelectionChange(this.currentSelections, this.currentCategory);
        
        // Auto-avanzar al siguiente nivel después de un pequeño delay
        setTimeout(() => {
            if (window.UC_HIERARCHICAL_STRUCTURE && this.currentCategory) {
                const categoryConfig = window.UC_HIERARCHICAL_STRUCTURE[this.currentCategory];
                if (categoryConfig && categoryConfig.levels) {
                    const levels = Object.keys(categoryConfig.levels);
                    const isComplete = levels.every(level => this.currentSelections[level]);
                    
                    if (!isComplete && this.currentStep < levels.length - 1) {
                        this.goNext();
                    }
                }
            }
        }, 300);
    }
    
    updatePreview() {
        if (!this.options.showPreview) return;
        
        const previewContainer = document.getElementById('uc-preview');
        if (!this.currentCategory || !window.UC_HIERARCHICAL_STRUCTURE) {
            previewContainer.style.display = 'none';
            return;
        }
        
        const categoryConfig = window.UC_HIERARCHICAL_STRUCTURE[this.currentCategory];
        if (!categoryConfig || !categoryConfig.levels) {
            previewContainer.style.display = 'none';
            return;
        }
        
        const levels = Object.keys(categoryConfig.levels);
        
        // Verificar si tenemos todas las selecciones
        const isComplete = levels.every(level => this.currentSelections[level]);
        
        if (Object.keys(this.currentSelections).length > 0) {
            previewContainer.style.display = 'block';
            
            let previewText = 'Seleccionando: ';
            Object.entries(this.currentSelections).forEach(([level, value]) => {
                const levelConfig = categoryConfig.levels[level];
                if (levelConfig && levelConfig.options && levelConfig.options[value]) {
                    previewText += `${levelConfig.label}: ${levelConfig.options[value]}, `;
                }
            });
            
            previewText = previewText.slice(0, -2); // Remover última coma
            
            if (isComplete && window.UC_CODE_GENERATOR && window.getUCCodeFromSelections) {
                // Generar descripción completa y buscar código
                const description = window.UC_CODE_GENERATOR[this.currentCategory](this.currentSelections);
                const code = window.getUCCodeFromSelections(this.currentCategory, this.currentSelections);
                
                document.querySelector('.uc-code').textContent = code || 'Código no encontrado';
                document.querySelector('.uc-description').textContent = description;
            } else {
                document.querySelector('.uc-code').textContent = '';
                document.querySelector('.uc-description').textContent = previewText;
            }
        } else {
            previewContainer.style.display = 'none';
        }
    }
    
    updateNavigation() {
        if (!this.currentCategory || !window.UC_HIERARCHICAL_STRUCTURE) return;
        
        const categoryConfig = window.UC_HIERARCHICAL_STRUCTURE[this.currentCategory];
        if (!categoryConfig || !categoryConfig.levels) return;
        
        const levels = Object.keys(categoryConfig.levels);
        const isComplete = levels.every(level => this.currentSelections[level]);
        const hasSelection = this.currentSelections[levels[this.currentStep]];
        
        // Botón Atrás
        const backBtn = document.getElementById('uc-back-btn');
        backBtn.style.display = this.currentStep > 0 || this.currentCategory ? 'inline-block' : 'none';
        
        // Botón Siguiente
        const nextBtn = document.getElementById('uc-next-btn');
        nextBtn.style.display = hasSelection && !isComplete && this.currentStep < levels.length - 1 ? 'inline-block' : 'none';
        
        // Botón Completar
        const completeBtn = document.getElementById('uc-complete-btn');
        completeBtn.style.display = isComplete ? 'inline-block' : 'none';
    }
    
    updateProgress() {
        if (!this.currentCategory || !window.UC_HIERARCHICAL_STRUCTURE) return;
        
        const categoryConfig = window.UC_HIERARCHICAL_STRUCTURE[this.currentCategory];
        if (!categoryConfig || !categoryConfig.levels) return;
        
        const levels = Object.keys(categoryConfig.levels);
        const completedLevels = Object.keys(this.currentSelections).length;
        const progress = (completedLevels / levels.length) * 100;
        
        document.querySelector('.uc-progress-fill').style.width = `${progress}%`;
    }
    
    goBack() {
        if (this.currentStep > 0) {
            this.currentStep--;
            if (window.UC_HIERARCHICAL_STRUCTURE && this.currentCategory) {
                const categoryConfig = window.UC_HIERARCHICAL_STRUCTURE[this.currentCategory];
                if (categoryConfig && categoryConfig.levels) {
                    const levels = Object.keys(categoryConfig.levels);
                    const currentLevelKey = levels[this.currentStep];
                    delete this.currentSelections[currentLevelKey];
                }
            }
            this.renderCurrentLevel();
        } else {
            // Volver a selección de categoría
            this.currentCategory = null;
            this.currentSelections = {};
            this.currentStep = 0;
            document.getElementById('uc-category-selection').style.display = 'block';
            document.getElementById('uc-level-selection').style.display = 'none';
            document.getElementById('uc-preview').style.display = 'none';
        }
        
        this.updateNavigation();
        this.updateProgress();
        this.updatePreview();
    }
    
    goNext() {
        if (!this.currentCategory || !window.UC_HIERARCHICAL_STRUCTURE) return;
        
        const categoryConfig = window.UC_HIERARCHICAL_STRUCTURE[this.currentCategory];
        if (!categoryConfig || !categoryConfig.levels) return;
        
        const levels = Object.keys(categoryConfig.levels);
        if (this.currentStep < levels.length - 1) {
            this.currentStep++;
            this.renderCurrentLevel();
            this.updateNavigation();
        }
    }
    
    completeSelection() {
        console.log('Completando selección...');
        console.log('Categoría actual:', this.currentCategory);
        console.log('Selecciones actuales:', this.currentSelections);
        
        if (!this.currentCategory || !window.UC_HIERARCHICAL_STRUCTURE) {
            console.error('Faltan datos básicos');
            return;
        }
        
        const categoryConfig = window.UC_HIERARCHICAL_STRUCTURE[this.currentCategory];
        if (!categoryConfig || !categoryConfig.levels) {
            console.error('Configuración de categoría no válida');
            return;
        }
        
        const levels = Object.keys(categoryConfig.levels);
        const isComplete = levels.every(level => this.currentSelections[level]);
        
        console.log('Niveles requeridos:', levels);
        console.log('¿Selección completa?', isComplete);
        
        if (isComplete && window.UC_CODE_GENERATOR && window.getUCCodeFromSelections) {
            console.log('Generando descripción y código...');
            const description = window.UC_CODE_GENERATOR[this.currentCategory](this.currentSelections);
            const code = window.getUCCodeFromSelections(this.currentCategory, this.currentSelections);
            
            console.log('Descripción generada:', description);
            console.log('Código encontrado:', code);
            
            const result = {
                category: this.currentCategory,
                selections: this.currentSelections,
                code: code,
                description: description,
                fullDescription: categoryConfig.label
            };
            
            this.options.onComplete(result);
        }
    }
    
    // Método público para establecer una selección programáticamente
    setSelection(category, selections) {
        this.currentCategory = category;
        this.currentSelections = selections;
        this.selectCategory(category);
        
        // Simular selecciones para completar el flujo
        Object.entries(selections).forEach(([level, value]) => {
            this.selectOption(level, value);
        });
    }
    
    // Método público para obtener la selección actual
    getCurrentSelection() {
        if (!this.currentCategory || !window.UC_CODE_GENERATOR || !window.getUCCodeFromSelections) return null;
        
        const description = window.UC_CODE_GENERATOR[this.currentCategory](this.currentSelections);
        const code = window.getUCCodeFromSelections(this.currentCategory, this.currentSelections);
        
        return {
            category: this.currentCategory,
            selections: this.currentSelections,
            code: code,
            description: description
        };
    }
    
    // Método público para resetear el selector
    reset() {
        this.currentCategory = null;
        this.currentSelections = {};
        this.currentStep = 0;
        this.render();
    }
}

// Estilos CSS para el selector jerárquico
const UC_HIERARCHICAL_STYLES = `
<style>
.uc-hierarchical-selector {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.uc-selector-header {
    margin-bottom: 20px;
}

.uc-selector-header h3 {
    margin: 0 0 10px 0;
    color: #333;
}

.uc-progress-bar {
    width: 100%;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
}

.uc-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #45a049);
    transition: width 0.3s ease;
}

.uc-category-grid, .uc-options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 15px;
}

.uc-category-card, .uc-option-card {
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    background: #fafafa;
}

.uc-category-card:hover, .uc-option-card:hover {
    border-color: #4CAF50;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.uc-category-card.selected, .uc-option-card.selected {
    border-color: #4CAF50;
    background: #e8f5e8;
}

.uc-category-icon {
    font-size: 2em;
    margin-bottom: 10px;
}

.uc-category-card h5 {
    margin: 10px 0 5px 0;
    color: #333;
    font-size: 1.1em;
}

.uc-category-card p {
    margin: 0;
    color: #666;
    font-size: 0.9em;
}

.uc-option-card span {
    font-weight: 500;
    color: #333;
}

.uc-level {
    margin-bottom: 20px;
}

.uc-level h4 {
    margin: 0 0 15px 0;
    color: #333;
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 5px;
}

.uc-preview {
    margin: 20px 0;
    padding: 15px;
    background: #f0f8ff;
    border: 1px solid #b3d9ff;
    border-radius: 6px;
}

.uc-preview h4 {
    margin: 0 0 10px 0;
    color: #2c5aa0;
}

.uc-preview-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.uc-code {
    font-weight: bold;
    color: #d63384;
    font-family: monospace;
}

.uc-description {
    color: #333;
    font-style: italic;
}

.uc-actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
}

.uc-actions .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #545b62;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover {
    background: #0056b3;
}

.btn-success {
    background: #28a745;
    color: white;
}

.btn-success:hover {
    background: #1e7e34;
}

@media (max-width: 600px) {
    .uc-category-grid, .uc-options-grid {
        grid-template-columns: 1fr;
    }
    
    .uc-actions {
        flex-direction: column;
    }
}
</style>
`;

// Inyectar estilos si no existen
if (!document.querySelector('#uc-hierarchical-styles')) {
    document.head.insertAdjacentHTML('beforeend', UC_HIERARCHICAL_STYLES.replace('<style>', '<style id="uc-hierarchical-styles">'));
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.UCHierarchicalSelector = UCHierarchicalSelector;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UCHierarchicalSelector;
}
