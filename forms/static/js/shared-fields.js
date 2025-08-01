/**
 * Sistema de Campos Compartidos entre Secciones
 * Sincroniza automáticamente los campos de "Información del Proyecto" y "Documentos y Archivos"
 * entre todas las secciones (estructuras, conductores, equipos, transformadores)
 */
class SharedFieldsManager {
    constructor() {
        this.sharedData = {};
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.loadFromStorage();
        this.setupFileHandlers();
        this.setupAutocompletion();
    }
    setupEventListeners() {
        // Escuchar cambios en campos compartidos
        document.addEventListener('change', (event) => {
            if (event.target.classList.contains('shared-field')) {
                this.syncField(event.target);
            }
        });
        document.addEventListener('input', (event) => {
            if (event.target.classList.contains('shared-field')) {
                this.syncField(event.target);
            }
        });
        // Escuchar cambios en archivos compartidos
        document.addEventListener('change', (event) => {
            if (event.target.classList.contains('shared-file')) {
                this.syncFile(event.target);
            }
        });
    }
    syncField(sourceElement) {
        const fieldName = sourceElement.getAttribute('data-sync-field');
        const value = sourceElement.value;
        // Efecto visual de sincronización
        this.showSyncEffect(sourceElement);
        // Guardar en datos compartidos
        this.sharedData[fieldName] = value;
        // Sincronizar con campos en otras secciones
        this.syncToOtherSections(fieldName, value, sourceElement);
        // Guardar en localStorage
        this.saveToStorage();
    }
    syncToOtherSections(fieldName, value, sourceElement) {
        // Buscar campos con el mismo nombre en otras secciones
        const targetFields = document.querySelectorAll(`[name="${fieldName}"]`);
        targetFields.forEach(field => {
            if (field !== sourceElement) {
                if (field.type === 'file') {
                    // Los archivos requieren manejo especial
                    return;
                }
                field.value = value;
                // Disparar evento change para que otros scripts respondan
                field.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        // También sincronizar campos con data-sync-field (para compatibilidad)
        const syncFields = document.querySelectorAll(`[data-sync-field="${fieldName}"]`);
        syncFields.forEach(field => {
            if (field !== sourceElement && field.type !== 'file') {
                field.value = value;
                field.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
    showSyncEffect(element) {
        // Agregar clase de sincronización
        element.classList.add('syncing');
        // Remover después de la animación
        setTimeout(() => {
            element.classList.remove('syncing');
        }, 300);
    }
    syncFile(sourceElement) {
        const fieldName = sourceElement.getAttribute('data-sync-field');
        const files = sourceElement.files;
        if (files.length > 0) {
            // Mostrar preview en la sección actual
            this.showFilePreview(sourceElement, files[0]);
            // Sincronizar con otros inputs de archivo
            const targetInputs = document.querySelectorAll(`[data-sync-field="${fieldName}"]`);
            targetInputs.forEach(input => {
                if (input !== sourceElement) {
                    // Crear un nuevo DataTransfer para transferir archivos
                    const dt = new DataTransfer();
                    Array.from(files).forEach(file => dt.items.add(file));
                    input.files = dt.files;
                    // Mostrar preview en otras secciones también
                    this.showFilePreview(input, files[0]);
                }
            });
        }
    }
    showFilePreview(input, file) {
        const fieldName = input.getAttribute('data-sync-field');
        let previewId, filenameId;
        if (input.id.startsWith('shared_')) {
            previewId = `shared_${fieldName}_preview`;
            filenameId = `shared_${fieldName}_filename`;
        } else {
            previewId = `${fieldName}_preview`;
            filenameId = `${fieldName}_filename`;
        }
        const preview = document.getElementById(previewId);
        const filename = document.getElementById(filenameId);
        if (preview && filename) {
            filename.textContent = file.name;
            preview.classList.remove('hidden');
        }
    }
    saveToStorage() {
        try {
            localStorage.setItem('shared_form_data', JSON.stringify(this.sharedData));
        } catch (error) {
            console.warn('⚠️ No se pudieron guardar los datos compartidos:', error);
        }
    }
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('shared_form_data');
            if (saved) {
                this.sharedData = JSON.parse(saved);
                // Aplicar datos guardados a los campos
                this.applySharedData();
            }
        } catch (error) {
            console.warn('⚠️ No se pudieron cargar los datos compartidos:', error);
            this.sharedData = {};
        }
    }
    applySharedData() {
        Object.keys(this.sharedData).forEach(fieldName => {
            const value = this.sharedData[fieldName];
            const fields = document.querySelectorAll(`[data-sync-field="${fieldName}"]`);
            fields.forEach(field => {
                if (field.type !== 'file') {
                    field.value = value;
                }
            });
        });
    }
    setupFileHandlers() {
        // Configurar manejadores para archivos CAD
        const cadInputs = document.querySelectorAll('[data-sync-field="archivo_cad"]');
        cadInputs.forEach(input => {
            input.addEventListener('change', (event) => {
                if (event.target.files.length > 0) {
                    this.handleFileUpload(event.target, 'cad');
                    this.syncFile(event.target);
                }
            });
        });
        // Configurar manejadores para archivos KMZ
        const kmzInputs = document.querySelectorAll('[data-sync-field="archivo_kmz"]');
        kmzInputs.forEach(input => {
            input.addEventListener('change', (event) => {
                if (event.target.files.length > 0) {
                    this.handleFileUpload(event.target, 'kmz');
                    this.syncFile(event.target);
                }
            });
        });
    }
    handleFileUpload(input, type) {
        const file = input.files[0];
        // Validar tamaño
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert(`El archivo es demasiado grande. Máximo permitido: 10MB`);
            input.value = '';
            return;
        }
        // Validar tipo
        const validTypes = {
            'cad': ['.dwg', '.dxf', '.dws'],
            'kmz': ['.kmz']
        };
        const fileName = file.name.toLowerCase();
        const isValidType = validTypes[type].some(ext => fileName.endsWith(ext));
        if (!isValidType) {
            alert(`Tipo de archivo no válido. Tipos permitidos: ${validTypes[type].join(', ')}`);
            input.value = '';
            return;
        }
        
        // Mostrar preview del archivo
        this.showFilePreview(input, file);
    }
    clearSharedData() {
        this.sharedData = {};
        localStorage.removeItem('shared_form_data');
        // Limpiar todos los campos compartidos
        const sharedFields = document.querySelectorAll('.shared-field');
        sharedFields.forEach(field => {
            if (field.type !== 'file') {
                field.value = '';
            } else {
                field.value = '';
                // Ocultar previews
                const fieldName = field.getAttribute('data-sync-field');
                const preview = document.getElementById(`${fieldName}_preview`) || 
                               document.getElementById(`shared_${fieldName}_preview`);
                if (preview) {
                    preview.classList.add('hidden');
                }
            }
        });
    }
    setupAutocompletion() {
        // Esperar a que los scripts de autocompletado estén disponibles
        setTimeout(() => {
            this.detectAndConnectAutocompletions();
        }, 200);
    }
    detectAndConnectAutocompletions() {
        // Lista de autocompletados conocidos
        const knownAutocompletions = [
            'autoCompleteBanco',
            'actualizarContratos', 
            'actualizarMunicipios',
            'actualizarRegional',
            'autoCompleteDepartamento'
        ];
        const availableAutocompletions = [];
        knownAutocompletions.forEach(func => {
            if (typeof window[func] === 'function') {
                availableAutocompletions.push(func);
            }
        });
        if (availableAutocompletions.length > 0) {
            this.connectAutocompletionHandlers(availableAutocompletions);
        } else {
        }
    }
    connectAutocompletionHandlers(availableAutocompletions) {
        // 1. Autocompletado de Banco (proyecto -> banco)
        if (availableAutocompletions.includes('autoCompleteBanco')) {
            this.connectBancoAutocompletion();
        }
        // 2. Autocompletado de Contratos (proyecto -> contratos)  
        if (availableAutocompletions.includes('actualizarContratos')) {
            this.connectContratosAutocompletion();
        }
        // 3. Autocompletado de Municipios (contrato -> municipios)
        if (availableAutocompletions.includes('actualizarMunicipios')) {
            this.connectMunicipioAutocompletion();
        }
        // 4. Autocompletado de Regional (varios campos -> regional)
        if (availableAutocompletions.includes('actualizarRegional')) {
            this.connectRegionalAutocompletion();
        }
        // 5. Autocompletado de Departamento (municipio -> departamento)
        if (availableAutocompletions.includes('autoCompleteDepartamento')) {
            this.connectDepartamentoAutocompletion();
        }
    }
    connectBancoAutocompletion() {
        const sharedNombreField = document.getElementById('shared_nombre');
        if (sharedNombreField) {
            const bancoHandler = () => {
                // 1. Copiar valor al campo oculto para compatibilidad
                const hiddenNombre = document.getElementById('nombre');
                if (hiddenNombre) {
                    hiddenNombre.value = sharedNombreField.value;
                }
                // 2. Ejecutar autocompletado original
                window.autoCompleteBanco();
                // 3. Copiar resultado de vuelta al campo compartido y sincronizar
                setTimeout(() => {
                    const bancoField = document.getElementById('banco_proyecto');
                    const sharedBancoField = document.getElementById('shared_banco_proyecto');
                    if (bancoField && sharedBancoField && bancoField.value !== sharedBancoField.value) {
                        sharedBancoField.value = bancoField.value;
                        this.syncField(sharedBancoField);
                    }
                }, 100);
            };
            sharedNombreField.addEventListener('change', bancoHandler);
            sharedNombreField.addEventListener('input', bancoHandler);
        }
    }
    connectContratosAutocompletion() {
        const sharedNombreField = document.getElementById('shared_nombre');
        if (sharedNombreField && typeof window.actualizarContratos === 'function') {
            const contratosHandler = () => {
                // Copiar a campo oculto para compatibilidad
                const hiddenNombre = document.getElementById('nombre');
                if (hiddenNombre) {
                    hiddenNombre.value = sharedNombreField.value;
                }
                
                // Ejecutar autocompletado de contratos
                window.actualizarContratos();
                
                // Sincronizar resultado del campo oculto al shared
                setTimeout(() => {
                    const contratoField = document.getElementById('contrato');
                    const sharedContratoField = document.getElementById('shared_contrato');
                    
                    if (contratoField && sharedContratoField) {
                        // Copiar todas las opciones del campo oculto al compartido
                        sharedContratoField.innerHTML = contratoField.innerHTML;
                        
                        // Si el campo oculto tiene un valor seleccionado, sincronizarlo
                        if (contratoField.value) {
                            sharedContratoField.value = contratoField.value;
                        }
                        
                        // Disparar evento de sincronización para otros campos
                        sharedContratoField.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }, 150);
            };
            
            // Agregar event listener para cuando cambie el nombre del proyecto
            sharedNombreField.addEventListener('change', contratosHandler);
        }
    }
    connectMunicipioAutocompletion() {
        const sharedContratoField = document.getElementById('shared_contrato');
        if (sharedContratoField) {
            const municipiosHandler = () => {
                // Copiar a campo oculto
                const hiddenContrato = document.getElementById('contrato');
                if (hiddenContrato) {
                    hiddenContrato.value = sharedContratoField.value;
                }
                // Ejecutar autocompletado
                window.actualizarMunicipios();
                // Sincronizar municipios disponibles
                setTimeout(() => {
                    const municipioField = document.querySelector('select[name="municipio"]');
                    if (municipioField) {
                    }
                }, 100);
            };
            sharedContratoField.addEventListener('change', municipiosHandler);
        }
    }
    connectRegionalAutocompletion() {
        // Regional puede depender de varios campos
        const fieldsToWatch = ['municipio', 'contrato'];
        fieldsToWatch.forEach(fieldName => {
            const field = document.querySelector(`select[name="${fieldName}"], input[name="${fieldName}"]`);
            if (field) {
                field.addEventListener('change', () => {
                    window.actualizarRegional();
                });
            }
        });
    }
    connectDepartamentoAutocompletion() {
        const municipioField = document.querySelector('select[name="municipio"]');
        if (municipioField) {
            municipioField.addEventListener('change', () => {
                window.autoCompleteDepartamento();
            });
        }
    }
    clearSharedData() {
        localStorage.removeItem('sharedFieldsData');
    }
}
// Función global para remover archivos compartidos
window.removeSharedFile = function(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = '';
        const fieldName = input.getAttribute('data-sync-field');
        // Ocultar preview
        const preview = document.getElementById(`shared_${fieldName}_preview`);
        if (preview) {
            preview.classList.add('hidden');
        }
        // Limpiar archivos en otras secciones también
        const otherInputs = document.querySelectorAll(`[data-sync-field="${fieldName}"]`);
        otherInputs.forEach(otherInput => {
            if (otherInput !== input) {
                otherInput.value = '';
                const otherPreview = document.getElementById(`${fieldName}_preview`);
                if (otherPreview) {
                    otherPreview.classList.add('hidden');
                }
            }
        });
    }
};
// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.sharedFieldsManager = new SharedFieldsManager();
});
// Exportar para uso externo
window.SharedFieldsManager = SharedFieldsManager;
