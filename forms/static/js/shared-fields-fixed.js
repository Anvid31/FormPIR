/**
 * Sistema de Campos Compartidos entre Secciones - VERSIÓN CORREGIDA
 * Sincroniza automáticamente los campos de "Información del Proyecto" y "Documentos y Archivos"
 * entre todas las secciones (estructuras, conductores, equipos, transformadores)
 */
class SharedFieldsManager {
    constructor() {
        this.sharedData = {};
        this.init();
    }

    init() {
        console.log('🔄 Inicializando SharedFieldsManager...');
        this.setupEventListeners();
        this.loadFromStorage();
        this.setupFileHandlers();
        this.setupAutocompletion();
        
        // Aplicar datos existentes inmediatamente
        setTimeout(() => {
            this.applySharedData();
            this.syncExistingValues();
        }, 500);
        
        console.log('✅ SharedFieldsManager inicializado correctamente');
    }

    setupEventListeners() {
        // Escuchar cambios en campos compartidos
        document.addEventListener('change', (event) => {
            if (event.target.classList.contains('shared-field') || 
                event.target.getAttribute('data-sync-field')) {
                this.syncField(event.target);
            }
        });

        document.addEventListener('input', (event) => {
            if (event.target.classList.contains('shared-field') || 
                event.target.getAttribute('data-sync-field')) {
                this.syncField(event.target);
            }
        });

        // Escuchar cambios en archivos compartidos
        document.addEventListener('change', (event) => {
            if (event.target.classList.contains('shared-file') || 
                (event.target.type === 'file' && event.target.getAttribute('data-sync-field'))) {
                this.syncFile(event.target);
            }
        });

        // Escuchar cuando se cambia de sección
        document.addEventListener('sectionChanged', () => {
            setTimeout(() => {
                this.applySharedData();
                this.syncExistingValues();
            }, 100);
        });
    }

    syncField(sourceElement) {
        const fieldName = sourceElement.getAttribute('data-sync-field') || sourceElement.name;
        const value = sourceElement.value;

        if (!fieldName) {
            console.warn('⚠️ Campo sin data-sync-field o name:', sourceElement);
            return;
        }

        console.log(`🔄 Sincronizando campo: ${fieldName} = "${value}"`);

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
        // Buscar todos los campos relacionados por diferentes métodos
        const selectors = [
            `[name="${fieldName}"]`,
            `[data-sync-field="${fieldName}"]`,
            `#${fieldName}`,
            `#shared_${fieldName}`
        ];

        selectors.forEach(selector => {
            const targetFields = document.querySelectorAll(selector);
            targetFields.forEach(field => {
                if (field !== sourceElement && field.type !== 'file') {
                    field.value = value;
                    
                    // Aplicar estilos de sincronización
                    if (value) {
                        field.classList.add('bg-green-50', 'border-green-300');
                    } else {
                        field.classList.remove('bg-green-50', 'border-green-300');
                    }
                    
                    // Disparar evento change para autocompletados
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    console.log(`✅ Campo sincronizado: ${selector} = "${value}"`);
                }
            });
        });
    }

    showSyncEffect(element) {
        element.classList.add('syncing');
        setTimeout(() => {
            element.classList.remove('syncing');
        }, 300);
    }

    syncFile(sourceElement) {
        const fieldName = sourceElement.getAttribute('data-sync-field');
        const files = sourceElement.files;

        if (!fieldName) return;

        console.log(`📁 Sincronizando archivo: ${fieldName}`);

        if (files.length > 0) {
            const file = files[0];
            
            // Guardar información del archivo
            this.sharedData[fieldName + '_file'] = {
                name: file.name,
                size: file.size,
                type: file.type
            };

            // Mostrar preview en la sección actual
            this.showFilePreview(sourceElement, file);

            // Sincronizar con otros inputs de archivo
            const targetInputs = document.querySelectorAll(`[data-sync-field="${fieldName}"]`);
            targetInputs.forEach(input => {
                if (input !== sourceElement && input.type === 'file') {
                    try {
                        // Crear un nuevo DataTransfer para transferir archivos
                        const dt = new DataTransfer();
                        dt.items.add(file);
                        input.files = dt.files;
                        
                        // Mostrar preview en otras secciones también
                        this.showFilePreview(input, file);
                        
                        console.log(`✅ Archivo sincronizado en: ${input.id}`);
                    } catch (error) {
                        console.warn('⚠️ Error sincronizando archivo:', error);
                    }
                }
            });

            this.saveToStorage();
        } else {
            // Archivo removido
            delete this.sharedData[fieldName + '_file'];
            this.hideFilePreview(fieldName);
            this.saveToStorage();
        }
    }

    showFilePreview(input, file) {
        const fieldName = input.getAttribute('data-sync-field');
        
        // Buscar elementos de preview por diferentes patrones
        const previewSelectors = [
            `#${fieldName}_preview`,
            `#shared_${fieldName}_preview`,
            `#preview_${fieldName}`,
            `[data-preview-for="${fieldName}"]`
        ];

        const filenameSelectors = [
            `#${fieldName}_filename`,
            `#shared_${fieldName}_filename`,
            `#filename_${fieldName}`,
            `[data-filename-for="${fieldName}"]`
        ];

        let preview = null, filename = null;

        // Buscar elementos de preview
        for (const selector of previewSelectors) {
            preview = document.querySelector(selector);
            if (preview) break;
        }

        for (const selector of filenameSelectors) {
            filename = document.querySelector(selector);
            if (filename) break;
        }

        if (preview && filename) {
            filename.textContent = file.name;
            preview.classList.remove('hidden');
            console.log(`✅ Preview mostrado para: ${fieldName}`);
        } else {
            console.warn(`⚠️ No se encontraron elementos de preview para: ${fieldName}`);
        }
    }

    hideFilePreview(fieldName) {
        const previewSelectors = [
            `#${fieldName}_preview`,
            `#shared_${fieldName}_preview`,
            `#preview_${fieldName}`,
            `[data-preview-for="${fieldName}"]`
        ];

        previewSelectors.forEach(selector => {
            const preview = document.querySelector(selector);
            if (preview) {
                preview.classList.add('hidden');
            }
        });
    }

    syncExistingValues() {
        console.log('🔄 Sincronizando valores existentes...');
        
        // Buscar campos con valores y sincronizarlos
        const fieldsWithData = document.querySelectorAll('[data-sync-field], .shared-field');
        fieldsWithData.forEach(field => {
            if (field.value && field.value.trim() !== '') {
                const fieldName = field.getAttribute('data-sync-field') || field.name;
                if (fieldName) {
                    this.sharedData[fieldName] = field.value;
                    this.syncToOtherSections(fieldName, field.value, field);
                }
            }
        });
    }

    saveToStorage() {
        try {
            localStorage.setItem('shared_form_data', JSON.stringify(this.sharedData));
            console.log('💾 Datos guardados en localStorage:', Object.keys(this.sharedData));
        } catch (error) {
            console.warn('⚠️ No se pudieron guardar los datos compartidos:', error);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('shared_form_data');
            if (saved) {
                this.sharedData = JSON.parse(saved);
                console.log('📥 Datos cargados desde localStorage:', Object.keys(this.sharedData));
                
                // Aplicar datos después de cargar
                setTimeout(() => {
                    this.applySharedData();
                }, 100);
            }
        } catch (error) {
            console.warn('⚠️ No se pudieron cargar los datos compartidos:', error);
            this.sharedData = {};
        }
    }

    applySharedData() {
        console.log('📤 Aplicando datos compartidos a campos...');
        
        Object.keys(this.sharedData).forEach(fieldName => {
            const value = this.sharedData[fieldName];
            
            // Ignorar datos de archivos
            if (fieldName.endsWith('_file')) return;
            
            // Buscar campos para este fieldName
            const selectors = [
                `[data-sync-field="${fieldName}"]`,
                `[name="${fieldName}"]`,
                `#${fieldName}`,
                `#shared_${fieldName}`
            ];

            selectors.forEach(selector => {
                const fields = document.querySelectorAll(selector);
                fields.forEach(field => {
                    if (field.type !== 'file' && field.value !== value) {
                        field.value = value;
                        
                        // Aplicar estilos si tiene valor
                        if (value) {
                            field.classList.add('bg-green-50', 'border-green-300');
                        }
                        
                        console.log(`✅ Valor aplicado: ${selector} = "${value}"`);
                    }
                });
            });
        });

        // Aplicar archivos guardados
        Object.keys(this.sharedData).forEach(key => {
            if (key.endsWith('_file')) {
                const fieldName = key.replace('_file', '');
                const fileInfo = this.sharedData[key];
                
                // Mostrar preview para archivos existentes
                const inputs = document.querySelectorAll(`[data-sync-field="${fieldName}"]`);
                inputs.forEach(input => {
                    if (input.type === 'file' && fileInfo) {
                        // Crear un objeto file temporal para preview
                        const tempFile = new File([], fileInfo.name, { type: fileInfo.type });
                        this.showFilePreview(input, tempFile);
                    }
                });
            }
        });
    }

    setupFileHandlers() {
        // Configurar manejadores para archivos CAD
        document.addEventListener('change', (event) => {
            if (event.target.getAttribute('data-sync-field') === 'archivo_cad') {
                if (event.target.files.length > 0) {
                    this.handleFileUpload(event.target, 'cad');
                }
            }
        });

        // Configurar manejadores para archivos KMZ
        document.addEventListener('change', (event) => {
            if (event.target.getAttribute('data-sync-field') === 'archivo_kmz') {
                if (event.target.files.length > 0) {
                    this.handleFileUpload(event.target, 'kmz');
                }
            }
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
    }

    setupAutocompletion() {
        // Esperar a que los scripts de autocompletado estén disponibles
        setTimeout(() => {
            this.detectAndConnectAutocompletions();
        }, 1000);
    }

    detectAndConnectAutocompletions() {
        // Conectar autocompletados específicos
        this.connectBancoAutocompletion();
        this.connectContratosAutocompletion();
        this.connectMunicipioAutocompletion();
        this.connectRegionalAutocompletion();
        this.connectDepartamentoAutocompletion();
    }

    connectBancoAutocompletion() {
        const sharedNombreField = document.getElementById('shared_nombre');
        if (sharedNombreField) {
            const bancoHandler = () => {
                const proyectoSeleccionado = sharedNombreField.value;
                
                if (!proyectoSeleccionado) return;
                
                // Sincronizar al campo oculto
                const hiddenNombre = document.getElementById('nombre');
                if (hiddenNombre) {
                    hiddenNombre.value = proyectoSeleccionado;
                }
                
                // Ejecutar autocompletado
                if (typeof window.autoCompleteBanco === 'function') {
                    window.autoCompleteBanco();
                    
                    // Sincronizar banco
                    setTimeout(() => {
                        const bancoOculto = document.getElementById('banco_proyecto');
                        const bancoCompartido = document.getElementById('shared_banco_proyecto');
                        
                        if (bancoOculto && bancoCompartido) {
                            bancoCompartido.value = bancoOculto.value;
                            this.sharedData['banco_proyecto'] = bancoOculto.value;
                            this.saveToStorage();
                        }
                    }, 100);
                }
            };
            
            sharedNombreField.addEventListener('change', bancoHandler);
        }
    }

    connectContratosAutocompletion() {
        const sharedNombreField = document.getElementById('shared_nombre');
        if (sharedNombreField) {
            const contratosHandler = () => {
                const proyectoSeleccionado = sharedNombreField.value;
                
                if (!proyectoSeleccionado) return;
                
                // Sincronizar al campo oculto
                const hiddenNombre = document.getElementById('nombre');
                if (hiddenNombre) {
                    hiddenNombre.value = proyectoSeleccionado;
                }
                
                // Ejecutar autocompletado de banco
                if (typeof window.autoCompleteBanco === 'function') {
                    window.autoCompleteBanco();
                    
                    setTimeout(() => {
                        const bancoOculto = document.getElementById('banco_proyecto');
                        const bancoCompartido = document.getElementById('shared_banco_proyecto');
                        
                        if (bancoOculto && bancoCompartido) {
                            bancoCompartido.value = bancoOculto.value;
                        }
                    }, 100);
                }
                
                // Cargar contratos usando PROYECTO_COMPLETO_MAPPING
                setTimeout(() => {
                    const contratos = this.cargarContratosDesdeMapping(proyectoSeleccionado);
                    
                    if (contratos.length > 0) {
                        const contratoCompartido = document.getElementById('shared_contrato');
                        const contratoOculto = document.getElementById('contrato');
                        
                        if (contratoCompartido) {
                            this.actualizarSelectContratos(contratoCompartido, contratos);
                        }
                        
                        if (contratoOculto) {
                            this.actualizarSelectContratos(contratoOculto, contratos);
                        }
                    }
                }, 200);
            };
            
            sharedNombreField.addEventListener('change', contratosHandler);
        }
    }

    // Función helper para cargar contratos desde PROYECTO_COMPLETO_MAPPING
    cargarContratosDesdeMapping(nombreProyecto) {
        if (!window.PROYECTO_COMPLETO_MAPPING) {
            console.error('❌ PROYECTO_COMPLETO_MAPPING no está disponible centralmente');
            return [];
        }
        
        const proyectoData = window.PROYECTO_COMPLETO_MAPPING[nombreProyecto];
        if (!proyectoData) {
            console.warn('⚠️ Proyecto no encontrado en mapeo central:', nombreProyecto);
            return [];
        }
        
        return proyectoData.contratos || [];
    }

    // Función helper para actualizar select de contratos
    actualizarSelectContratos(selectElement, contratos) {
        selectElement.innerHTML = '<option value="">Seleccionar contrato</option>';
        
        contratos.forEach(contrato => {
            const option = document.createElement('option');
            option.value = contrato.codigo;
            option.textContent = `${contrato.codigo} - ${contrato.contratista}`;
            option.dataset.contratista = contrato.contratista;
            option.dataset.regional = contrato.regional;
            selectElement.appendChild(option);
        });
        
        selectElement.disabled = false;
        selectElement.classList.remove('bg-gray-50');
        selectElement.classList.add('bg-green-50', 'border-green-300');
    }

    connectMunicipioAutocompletion() {
        // Implementación simplificada
        const sharedContrato = document.getElementById('shared_contrato');
        if (sharedContrato) {
            sharedContrato.addEventListener('change', () => {
                // Sincronizar valor seleccionado
                const contratoSeleccionado = sharedContrato.value;
                this.sharedData['contrato'] = contratoSeleccionado;
                this.saveToStorage();
                
                // Aplicar a campo oculto
                const hiddenContrato = document.getElementById('contrato');
                if (hiddenContrato) {
                    hiddenContrato.value = contratoSeleccionado;
                }
            });
        }
    }

    connectRegionalAutocompletion() {
        // Placeholder para autocompletado regional
    }

    connectDepartamentoAutocompletion() {
        // Placeholder para autocompletado departamento
    }

    clearSharedData() {
        this.sharedData = {};
        localStorage.removeItem('shared_form_data');
        
        // Limpiar todos los campos compartidos
        const sharedFields = document.querySelectorAll('[data-sync-field], .shared-field');
        sharedFields.forEach(field => {
            if (field.type !== 'file') {
                field.value = '';
                field.classList.remove('bg-green-50', 'border-green-300');
            } else {
                field.value = '';
                const fieldName = field.getAttribute('data-sync-field');
                if (fieldName) {
                    this.hideFilePreview(fieldName);
                }
            }
        });
        
        console.log('🧹 Datos compartidos limpiados');
    }

    // Función de diagnóstico
    diagnosticar() {
        console.group('🔍 DIAGNÓSTICO SharedFieldsManager');
        console.log('📊 Datos compartidos:', this.sharedData);
        console.log('🎯 Campos encontrados:');
        
        const campos = ['nombre', 'banco_proyecto', 'contrato'];
        campos.forEach(campo => {
            const shared = document.getElementById(`shared_${campo}`);
            const hidden = document.getElementById(campo);
            console.log(`  ${campo}:`, {
                shared: shared ? shared.value : 'NO ENCONTRADO',
                hidden: hidden ? hidden.value : 'NO ENCONTRADO'
            });
        });
        
        console.groupEnd();
    }
}

// Función global para remover archivos compartidos
window.removeSharedFile = function(inputId) {
    const input = document.getElementById(inputId);
    if (input && window.sharedFieldsManager) {
        input.value = '';
        const fieldName = input.getAttribute('data-sync-field');
        if (fieldName) {
            delete window.sharedFieldsManager.sharedData[fieldName + '_file'];
            window.sharedFieldsManager.hideFilePreview(fieldName);
            window.sharedFieldsManager.saveToStorage();
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando SharedFieldsManager...');
    window.sharedFieldsManager = new SharedFieldsManager();
    
    // Función de diagnóstico global
    window.diagnosticarCamposCompartidos = () => {
        if (window.sharedFieldsManager) {
            window.sharedFieldsManager.diagnosticar();
        }
    };
});

// Exportar para uso externo
window.SharedFieldsManager = SharedFieldsManager;

console.log('📦 SharedFieldsManager cargado y listo');
