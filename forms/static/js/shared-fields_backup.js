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
        console.log('🔧 Configurando autocompletado de contratos centralizado...');
        
        const sharedNombreField = document.getElementById('shared_nombre');
        if (sharedNombreField) {
            const contratosHandler = () => {
                const proyectoSeleccionado = sharedNombreField.value;
                console.log('🎯 Proyecto seleccionado (centralizado):', proyectoSeleccionado);
                
                if (!proyectoSeleccionado) {
                    console.log('⚠️ No hay proyecto seleccionado');
                    return;
                }
                
                // 1. Sincronizar al campo oculto para compatibilidad
                const hiddenNombre = document.getElementById('nombre');
                if (hiddenNombre) {
                    hiddenNombre.value = proyectoSeleccionado;
                }
                
                // 2. Ejecutar autocompletado de banco primero
                if (typeof window.autoCompleteBanco === 'function') {
                    console.log('🏦 Ejecutando autoCompleteBanco centralizado...');
                    window.autoCompleteBanco();
                    
                    // Sincronizar banco
                    setTimeout(() => {
                        const bancoOculto = document.getElementById('banco_proyecto');
                        const bancoCompartido = document.getElementById('shared_banco_proyecto');
                        
                        if (bancoOculto && bancoCompartido) {
                            bancoCompartido.value = bancoOculto.value;
                            console.log('✅ Banco sincronizado centralmente:', bancoOculto.value);
                        }
                    }, 100);
                }
                
                // 3. Cargar contratos usando PROYECTO_COMPLETO_MAPPING
                setTimeout(() => {
                    console.log('📋 Iniciando carga de contratos centralizada...');
                    const contratos = this.cargarContratosDesdeMapping(proyectoSeleccionado);
                    console.log('📋 Contratos obtenidos centralmente:', contratos);
                    
                    if (contratos.length > 0) {
                        // Actualizar campo compartido
                        const contratoCompartido = document.getElementById('shared_contrato');
                        if (contratoCompartido) {
                            this.actualizarSelectContratos(contratoCompartido, contratos);
                            console.log('✅ Campo compartido actualizado');
                        }
                        
                        // Actualizar campo oculto también
                        const contratoOculto = document.getElementById('contrato');
                        if (contratoOculto) {
                            this.actualizarSelectContratos(contratoOculto, contratos);
                            console.log('✅ Campo oculto actualizado');
                        }
                    } else {
                        console.warn('⚠️ No hay contratos disponibles para este proyecto');
                    }
                }, 200);
            };
            
            // Agregar event listener
            sharedNombreField.addEventListener('change', contratosHandler);
            
            // Si ya hay un valor al cargar, procesarlo
            if (sharedNombreField.value) {
                console.log('🔄 Proyecto ya seleccionado al inicializar:', sharedNombreField.value);
                setTimeout(contratosHandler, 500);
            }
            
            console.log('✅ Autocompletado de contratos centralizado configurado');
        } else {
            console.error('❌ Campo shared_nombre no encontrado para autocompletado centralizado');
        }
    }

    // Función helper para cargar contratos desde PROYECTO_COMPLETO_MAPPING
    cargarContratosDesdeMapping(nombreProyecto) {
        console.log('🔍 Buscando contratos centralmente para proyecto:', nombreProyecto);
        
        // Verificar que el mapeo esté disponible
        if (!window.PROYECTO_COMPLETO_MAPPING) {
            console.error('❌ PROYECTO_COMPLETO_MAPPING no está disponible centralmente');
            return [];
        }
        
        const proyectoData = window.PROYECTO_COMPLETO_MAPPING[nombreProyecto];
        if (!proyectoData) {
            console.warn('⚠️ Proyecto no encontrado en mapeo central:', nombreProyecto);
            return [];
        }
        
        console.log('✅ Datos del proyecto encontrados centralmente:', proyectoData);
        return proyectoData.contratos || [];
    }

    // Función helper para actualizar select de contratos
    actualizarSelectContratos(selectElement, contratos) {
        console.log('📋 Actualizando select centralmente con:', contratos);
        
        // Limpiar opciones existentes excepto la primera
        selectElement.innerHTML = '<option value="">Seleccionar contrato</option>';
        
        // Agregar nuevas opciones
        contratos.forEach(contrato => {
            const option = document.createElement('option');
            option.value = contrato.codigo;
            option.textContent = `${contrato.codigo} - ${contrato.contratista} (${contrato.regional})`;
            selectElement.appendChild(option);
            
            console.log(`✅ Contrato agregado centralmente: ${contrato.codigo} - ${contrato.contratista}`);
        });
        
        // Habilitar el campo
        selectElement.disabled = false;
        selectElement.classList.remove('bg-gray-50');
        selectElement.classList.add('bg-green-50', 'border-green-300');
        
        console.log(`✅ Select actualizado centralmente con ${contratos.length} contratos`);
    }
    connectMunicipioAutocompletion() {
        console.log('🔧 Configurando autocompletado de municipios centralizado...');
        
        const sharedContratoField = document.getElementById('shared_contrato');
        if (sharedContratoField) {
            const municipiosHandler = () => {
                const contratoSeleccionado = sharedContratoField.value;
                console.log('📄 Contrato seleccionado centralmente:', contratoSeleccionado);
                
                if (!contratoSeleccionado) {
                    console.log('⚠️ No hay contrato seleccionado');
                    return;
                }
                
                // 1. Sincronizar al campo oculto para compatibilidad
                const hiddenContrato = document.getElementById('contrato');
                if (hiddenContrato) {
                    hiddenContrato.value = contratoSeleccionado;
                    console.log('✅ Contrato sincronizado al campo oculto');
                }
                
                // 2. Ejecutar autocompletado de regional
                setTimeout(() => {
                    if (typeof window.autoCompleteRegional === 'function') {
                        window.autoCompleteRegional();
                        console.log('✅ Regional actualizada centralmente');
                    }
                    
                    // 3. Ejecutar autocompletado de municipios
                    setTimeout(() => {
                        if (typeof window.actualizarMunicipiosPorContrato === 'function') {
                            window.actualizarMunicipiosPorContrato();
                            console.log('✅ Municipios actualizados centralmente por contrato');
                        } else if (typeof window.actualizarMunicipios === 'function') {
                            window.actualizarMunicipios();
                            console.log('✅ Municipios actualizados centralmente');
                        }
                    }, 200);
                }, 200);
            };
            
            sharedContratoField.addEventListener('change', municipiosHandler);
            console.log('✅ Autocompletado de municipios centralizado configurado');
        } else {
            console.error('❌ Campo shared_contrato no encontrado para autocompletado centralizado');
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
