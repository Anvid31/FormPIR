/**
 * ================================================
 * SISTEMA DE FUNCIONALIDADES COMPARTIDAS 
 * FormPIR - Todas las Secciones
 * ================================================
 * 
 * Este archivo unifica todas las funcionalidades que 
 * deben estar disponibles en las 4 secciones del formulario:
 * - Estructuras
 * - Conductores  
 * - Equipos
 * - Transformadores
 */

// ====================================
// 1. CONFIGURACIÓN GLOBAL
// ====================================

window.FormPIRShared = window.FormPIRShared || {
    debug: new URLSearchParams(window.location.search).has('debug'),
    seccionActual: document.body.getAttribute('data-seccion') || 'desconocida',
    iteraciones: [],
    initialized: false
};

// ====================================
// 2. SISTEMA DE LOGGING INTELIGENTE
// ====================================

// Usar log local solo si no existe globalmente
const logLocal = window.log || {
    info: (...args) => {
        if (window.FormPIRShared.debug) {
            console.log(`[FormPIR-${window.FormPIRShared.seccionActual}] ℹ️`, ...args);
        }
    },
    warn: (...args) => {
        if (window.FormPIRShared.debug) {
            console.warn(`[FormPIR-${window.FormPIRShared.seccionActual}] ⚠️`, ...args);
        }
    },
    error: (...args) => {
        console.error(`[FormPIR-${window.FormPIRShared.seccionActual}] ❌`, ...args);
    },
    success: (...args) => {
        if (window.FormPIRShared.debug) {
            console.log(`[FormPIR-${window.FormPIRShared.seccionActual}] ✅`, ...args);
        }
    },
    debug: (...args) => {
        if (window.FormPIRShared.debug) {
            console.debug(`[FormPIR-${window.FormPIRShared.seccionActual}] 🔍`, ...args);
        }
    }
};

// ====================================
// 3. VALIDACIÓN DE TIPOS DE INVERSIÓN
// ====================================

class TiposInversionManager {
    constructor() {
        this.tipoSelect = null;
        this.montajeContainer = null;
        this.desmanteladoContainer = null;
        this.structureField = null;
        this.coordinateFields = [];
        
        this.init();
    }

    init() {
        // Buscar elementos en la página
        this.tipoSelect = document.getElementById('t_inv');
        this.montajeContainer = document.getElementById('montaje_integral_container');
        this.desmanteladoContainer = document.getElementById('desmantelado_container');
        this.structureField = document.getElementById('estructura_retirada_campo');
        
        // Campos de coordenadas
        this.coordinateFields = [
            document.getElementById('longitud'),
            document.getElementById('latitud'),
            document.getElementById('longitud_final'),
            document.getElementById('latitud_final')
        ].filter(Boolean);

        if (this.tipoSelect) {
            this.tipoSelect.addEventListener('change', () => this.handleTipoInversion());
            logLocal.success('TiposInversionManager inicializado');
        } else {
            logLocal.warn('Selector de tipo de inversión no encontrado');
        }

        // Configurar checkboxes
        this.setupCheckboxes();
    }

    handleTipoInversion() {
        const tipo = this.tipoSelect?.value;
        logLocal.info('Tipo de inversión seleccionado:', tipo);

        // Reglas para tipos I y III
        const esReemplazo = tipo === 'I' || tipo === 'III';
        const esNuevo = tipo === 'II' || tipo === 'IV';

        // Manejar campo de estructura retirada
        if (this.structureField) {
            if (esReemplazo) {
                this.structureField.disabled = false;
                this.structureField.required = true;
                this.structureField.classList.remove('bg-gray-100', 'cursor-not-allowed');
                this.structureField.classList.add('bg-white');
                logLocal.info('Campo estructura retirada habilitado');
            } else {
                this.structureField.disabled = true;
                this.structureField.required = false;
                this.structureField.value = '';
                this.structureField.classList.add('bg-gray-100', 'cursor-not-allowed');
                this.structureField.classList.remove('bg-white');
                logLocal.info('Campo estructura retirada deshabilitado');
            }
        }

        // Manejar coordenadas - deshabilitar para tipos I y III
        this.coordinateFields.forEach(field => {
            if (esReemplazo) {
                field.disabled = true;
                field.required = false;
                field.value = '';
                field.classList.add('bg-gray-100', 'cursor-not-allowed');
                field.classList.remove('bg-white');
            } else {
                field.disabled = false;
                field.required = true;
                field.classList.remove('bg-gray-100', 'cursor-not-allowed');
                field.classList.add('bg-white');
            }
        });

        // Mostrar contenedor de desmantelado para tipos I y III
        if (this.desmanteladoContainer) {
            this.desmanteladoContainer.style.display = esReemplazo ? 'flex' : 'none';
        }

        logLocal.info(`Reglas aplicadas: esReemplazo=${esReemplazo}, esNuevo=${esNuevo}`);
    }

    setupCheckboxes() {
        // Checkbox Montaje Integral
        const montajeCheckbox = document.getElementById('montaje_integral_checkbox');
        if (montajeCheckbox) {
            montajeCheckbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                logLocal.info('Montaje integral:', isChecked ? 'activado' : 'desactivado');
                
                if (isChecked) {
                    this.disableUCFields();
                    this.showMontajeHelp(true);
                } else {
                    this.enableUCFields();
                    this.showMontajeHelp(false);
                }
            });
        }

        // Checkbox Desmantelado
        const desmanteladoCheckbox = document.getElementById('desmantelado_checkbox');
        if (desmanteladoCheckbox) {
            desmanteladoCheckbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                logLocal.info('Desmantelado:', isChecked ? 'activado' : 'desactivado');
                
                if (isChecked) {
                    this.disableAllExceptBasic();
                    this.showDesmanteladoHelp(true);
                } else {
                    this.enableAllFields();
                    this.showDesmanteladoHelp(false);
                }
            });
        }
    }

    disableUCFields() {
        // Deshabilitar campos relacionados con UC
        const ucFields = document.querySelectorAll('[id*="uc"], .uc-field');
        ucFields.forEach(field => {
            if (field.type !== 'hidden') {
                field.disabled = true;
                field.classList.add('bg-gray-100', 'cursor-not-allowed');
            }
        });
    }

    enableUCFields() {
        // Habilitar campos relacionados con UC
        const ucFields = document.querySelectorAll('[id*="uc"], .uc-field');
        ucFields.forEach(field => {
            if (field.type !== 'hidden') {
                field.disabled = false;
                field.classList.remove('bg-gray-100', 'cursor-not-allowed');
                field.classList.add('bg-white');
            }
        });
    }

    disableAllExceptBasic() {
        // Deshabilitar todo excepto información básica y estructura retirada
        const allInputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
        const basicFields = ['nombre', 'banco_proyecto', 'contrato', 'estructura_retirada_campo'];
        
        allInputs.forEach(field => {
            if (!basicFields.includes(field.id) && !field.closest('.shared-project-info, .shared-documents')) {
                field.disabled = true;
                field.classList.add('bg-gray-100', 'cursor-not-allowed');
            }
        });
    }

    enableAllFields() {
        // Habilitar todos los campos
        const allInputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
        allInputs.forEach(field => {
            field.disabled = false;
            field.classList.remove('bg-gray-100', 'cursor-not-allowed');
            field.classList.add('bg-white');
        });
        
        // Reaplicar reglas de tipo de inversión
        this.handleTipoInversion();
    }

    showMontajeHelp(show) {
        const help = document.getElementById('montaje_integral_help');
        if (help) {
            help.style.display = show ? 'block' : 'none';
        }
    }

    showDesmanteladoHelp(show) {
        const help = document.getElementById('desmantelado_help');
        if (help) {
            help.style.display = show ? 'block' : 'none';
        }
    }
}

// ====================================
// 4. SISTEMA DE AUTOCOMPLETADO
// ====================================

class AutocompletadoManager {
    constructor() {
        this.municipioSelect = null;
        this.departamentoField = null;
        this.regionalField = null;
        this.circuitoSelect = null;
        
        this.init();
    }

    init() {
        this.municipioSelect = document.getElementById('municipio');
        this.departamentoField = document.getElementById('departamento');
        this.regionalField = document.getElementById('regional');
        this.circuitoSelect = document.getElementById('alimentador');

        if (this.municipioSelect) {
            this.municipioSelect.addEventListener('change', () => this.handleMunicipioChange());
            logLocal.success('AutocompletadoManager inicializado');
        }
    }

    handleMunicipioChange() {
        const municipio = this.municipioSelect?.value;
        if (!municipio) return;

        logLocal.info('Municipio seleccionado:', municipio);

        // Actualizar departamento y regional
        this.updateDepartamentoRegional(municipio);
        
        // Actualizar circuitos
        this.updateCircuitos(municipio);
    }

    updateDepartamentoRegional(municipio) {
        // Esta función se conectaría con los mapeos de datos
        if (typeof window.actualizarCircuitos === 'function') {
            window.actualizarCircuitos();
        }
    }

    updateCircuitos(municipio) {
        if (!this.circuitoSelect) return;

        // Limpiar opciones actuales
        this.circuitoSelect.innerHTML = '<option value="">Seleccionar</option>';

        // Buscar circuitos para el municipio
        if (window.MUNICIPIO_CIRCUITO_MAPPING && window.MUNICIPIO_CIRCUITO_MAPPING[municipio]) {
            const circuitos = window.MUNICIPIO_CIRCUITO_MAPPING[municipio];
            circuitos.forEach(circuito => {
                const option = document.createElement('option');
                option.value = circuito;
                option.textContent = circuito;
                this.circuitoSelect.appendChild(option);
            });
            
            // Habilitar el select
            this.circuitoSelect.disabled = false;
            this.circuitoSelect.classList.remove('bg-gray-100', 'cursor-not-allowed');
            this.circuitoSelect.classList.add('bg-white');
            
            logLocal.success(`${circuitos.length} circuitos cargados para ${municipio}`);
        } else {
            logLocal.warn(`No se encontraron circuitos para ${municipio}`);
            this.circuitoSelect.disabled = true;
            this.circuitoSelect.classList.add('bg-gray-100', 'cursor-not-allowed');
        }
    }
}

// ====================================
// 5. SISTEMA DE ITERACIONES UNIVERSAL
// ====================================

class IteracionesUniversalManager {
    constructor() {
        this.iteraciones = [];
        this.seccion = window.FormPIRShared.seccionActual;
        
        this.init();
    }

    init() {
        logLocal.info('Inicializando sistema de iteraciones universal');
        
        // Configurar botones si existen
        this.setupButtons();
        
        // Configurar tabla si existe
        this.setupTable();
        
        logLocal.success('IteracionesUniversalManager inicializado');
    }

    setupButtons() {
        const btnAgregar = document.getElementById('agregarIteracion');
        if (btnAgregar) {
            btnAgregar.addEventListener('click', () => this.agregarIteracion());
        }
    }

    setupTable() {
        this.renderTable();
    }

    agregarIteracion() {
        const datos = this.capturarDatos();
        
        if (this.validarDatos(datos)) {
            this.iteraciones.push(datos);
            this.renderTable();
            this.limpiarFormulario();
            this.mostrarMensaje('Iteración agregada correctamente', 'success');
            logLocal.success('Iteración agregada:', datos);
        } else {
            this.mostrarMensaje('Por favor complete los campos requeridos', 'error');
        }
    }

    capturarDatos() {
        // Capturar datos específicos según la sección
        const base = {
            fecha: document.getElementById('fecha')?.value || '',
            tipo_inversion: document.getElementById('t_inv')?.value || '',
            municipio: document.getElementById('municipio')?.value || '',
            direccion: document.getElementById('direccion')?.value || '',
            cantidad: 1,
            fotos: this.capturarFotos()
        };

        // Datos específicos por sección
        switch (this.seccion) {
            case 'estructuras':
                return { ...base, ...this.capturarDatosEstructuras() };
            case 'conductores':
                return { ...base, ...this.capturarDatosConductores() };
            case 'equipos':
                return { ...base, ...this.capturarDatosEquipos() };
            case 'transformadores':
                return { ...base, ...this.capturarDatosTransformadores() };
            default:
                return base;
        }
    }

    capturarDatosEstructuras() {
        return {
            estructura_retirada: document.getElementById('estructura_retirada_campo')?.value || '',
            uc_codigo: document.getElementById('uc_nueva')?.value || '',
            uc_descripcion: document.getElementById('descripcion_uc')?.value || ''
        };
    }

    capturarDatosConductores() {
        return {
            tipo_conductor: document.querySelector('[name="tipo_conductor"]')?.value || '',
            calibre: document.querySelector('[name="calibre"]')?.value || '',
            longitud: document.querySelector('[name="longitud_conductor"]')?.value || ''
        };
    }

    capturarDatosEquipos() {
        return {
            tipo_equipo: document.querySelector('[name="tipo_equipo"]')?.value || '',
            marca: document.querySelector('[name="marca"]')?.value || '',
            modelo: document.querySelector('[name="modelo"]')?.value || ''
        };
    }

    capturarDatosTransformadores() {
        return {
            potencia: document.querySelector('[name="potencia"]')?.value || '',
            tipo_transformador: document.querySelector('[name="tipo_transformador"]')?.value || '',
            tension_primaria: document.querySelector('[name="tension_primaria"]')?.value || '',
            tension_secundaria: document.querySelector('[name="tension_secundaria"]')?.value || ''
        };
    }

    capturarFotos() {
        const fotosInput = document.getElementById('fotos');
        const fotos = [];
        
        if (fotosInput?.files) {
            for (let i = 0; i < fotosInput.files.length; i++) {
                fotos.push(fotosInput.files[i].name);
            }
        }
        
        return fotos;
    }

    validarDatos(datos) {
        // Validaciones básicas
        if (!datos.fecha || !datos.tipo_inversion || !datos.municipio) {
            return false;
        }
        
        // Validaciones específicas por sección
        switch (this.seccion) {
            case 'estructuras':
                return this.validarEstructuras(datos);
            case 'conductores':
                return this.validarConductores(datos);
            case 'equipos':
                return this.validarEquipos(datos);
            case 'transformadores':
                return this.validarTransformadores(datos);
            default:
                return true;
        }
    }

    validarEstructuras(datos) {
        const tiposReemplazo = ['I', 'III'];
        if (tiposReemplazo.includes(datos.tipo_inversion)) {
            return !!datos.estructura_retirada;
        }
        return !!datos.uc_codigo || !!datos.uc_descripcion;
    }

    validarConductores(datos) {
        return !!(datos.tipo_conductor && datos.calibre);
    }

    validarEquipos(datos) {
        return !!datos.tipo_equipo;
    }

    validarTransformadores(datos) {
        return !!(datos.potencia && datos.tipo_transformador);
    }

    renderTable() {
        const tbody = document.getElementById('iterationTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.iteraciones.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="8" class="px-6 py-4 text-center text-gray-500 italic">
                    No hay iteraciones agregadas para ${this.seccion}.
                </td>
            `;
            tbody.appendChild(row);
            return;
        }

        this.iteraciones.forEach((iter, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = this.generateRowHTML(iter, idx);
            tbody.appendChild(row);
        });
    }

    generateRowHTML(iter, idx) {
        // HTML base para todas las secciones
        const baseColumns = `
            <td class="px-6 py-4">${iter.fecha || '-'}</td>
            <td class="px-6 py-4">${iter.tipo_inversion || '-'}</td>
            <td class="px-6 py-4">${iter.municipio || '-'}</td>
            <td class="px-6 py-4">${iter.cantidad || 1}</td>
        `;

        // Columnas específicas por sección
        let specificColumns = '';
        switch (this.seccion) {
            case 'estructuras':
                specificColumns = `
                    <td class="px-6 py-4">${iter.estructura_retirada || '-'}</td>
                    <td class="px-6 py-4">${iter.uc_codigo || '-'}</td>
                `;
                break;
            case 'conductores':
                specificColumns = `
                    <td class="px-6 py-4">${iter.tipo_conductor || '-'}</td>
                    <td class="px-6 py-4">${iter.calibre || '-'}</td>
                `;
                break;
            case 'equipos':
                specificColumns = `
                    <td class="px-6 py-4">${iter.tipo_equipo || '-'}</td>
                    <td class="px-6 py-4">${iter.marca || '-'}</td>
                `;
                break;
            case 'transformadores':
                specificColumns = `
                    <td class="px-6 py-4">${iter.potencia || '-'}</td>
                    <td class="px-6 py-4">${iter.tipo_transformador || '-'}</td>
                `;
                break;
        }

        const fotosColumn = `
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    iter.fotos.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }">
                    ${iter.fotos.length}
                </span>
            </td>
        `;

        const actionColumn = `
            <td class="px-6 py-4">
                <button type="button" class="text-red-600 hover:text-red-800 transition-colors" 
                        onclick="window.FormPIRShared.iteracionesManager.eliminarIteracion(${idx})" 
                        title="Eliminar iteración">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        return baseColumns + specificColumns + fotosColumn + actionColumn;
    }

    eliminarIteracion(idx) {
        this.iteraciones.splice(idx, 1);
        this.renderTable();
        this.mostrarMensaje('Iteración eliminada', 'info');
        logLocal.info('Iteración eliminada:', idx);
    }

    limpiarFormulario() {
        // Limpiar fotos
        const fotosInput = document.getElementById('fotos');
        if (fotosInput) {
            fotosInput.value = '';
            const preview = document.getElementById('preview');
            if (preview) preview.innerHTML = '';
        }
    }

    mostrarMensaje(mensaje, tipo = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };

        const mensajeEl = document.createElement('div');
        mensajeEl.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 transition-all duration-300 ${colors[tipo] || colors.info}`;
        mensajeEl.textContent = mensaje;

        document.body.appendChild(mensajeEl);

        setTimeout(() => {
            mensajeEl.remove();
        }, 3000);
    }

    // Método para serializar iteraciones antes del envío
    serializarParaEnvio() {
        return JSON.stringify(this.iteraciones);
    }
}

// ====================================
// 6. VALIDADOR DE COORDENADAS
// ====================================

class CoordinateValidator {
    constructor() {
        this.init();
    }

    init() {
        const coordFields = ['longitud', 'latitud', 'longitud_final', 'latitud_final'];
        
        coordFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', (e) => this.validateCoordinate(e.target));
                field.addEventListener('blur', (e) => this.validateCoordinate(e.target, true));
            }
        });

        logLocal.success('CoordinateValidator inicializado');
    }

    validateCoordinate(field, showMessage = false) {
        const value = parseFloat(field.value);
        const fieldType = field.id.includes('longitud') ? 'longitud' : 'latitud';
        
        let isValid = true;
        let message = '';

        if (isNaN(value)) {
            if (field.value !== '') {
                isValid = false;
                message = 'Debe ser un número válido';
            }
        } else {
            if (fieldType === 'longitud') {
                // Colombia: -79.0 a -66.8 (oeste)
                if (value < -79.0 || value > -66.8) {
                    isValid = false;
                    message = 'Longitud debe estar entre -79.0 y -66.8 (Colombia)';
                }
            } else { // latitud
                // Colombia: -4.2 a 15.5 (norte del ecuador)
                if (value < -4.2 || value > 15.5) {
                    isValid = false;
                    message = 'Latitud debe estar entre -4.2 y 15.5 (Colombia)';
                }
            }
        }

        // Aplicar estilos de validación
        if (isValid) {
            field.classList.remove('border-red-500', 'bg-red-50');
            field.classList.add('border-green-500');
        } else {
            field.classList.remove('border-green-500');
            field.classList.add('border-red-500', 'bg-red-50');
        }

        // Mostrar mensaje si es necesario
        if (showMessage && !isValid && message) {
            this.showValidationMessage(field, message);
        }

        return isValid;
    }

    showValidationMessage(field, message) {
        // Remover mensaje anterior si existe
        const existingMessage = field.parentElement.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Crear nuevo mensaje
        const messageEl = document.createElement('div');
        messageEl.className = 'validation-message text-xs text-red-600 mt-1';
        messageEl.textContent = message;
        
        field.parentElement.appendChild(messageEl);

        // Remover después de 5 segundos
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

// ====================================
// 7. INICIALIZADOR PRINCIPAL
// ====================================

class FormPIRInitializer {
    constructor() {
        this.managers = {};
        this.initialized = false;
    }

    init() {
        if (this.initialized) {
            logLocal.warn('Sistema ya inicializado');
            return;
        }

        logLocal.info('🚀 Inicializando Sistema de Funcionalidades Compartidas');

        // Detectar sección actual
        this.detectSection();

        // Inicializar managers
        this.managers.tiposInversion = new TiposInversionManager();
        this.managers.autocompletado = new AutocompletadoManager();
        this.managers.iteraciones = new IteracionesUniversalManager();
        this.managers.coordinates = new CoordinateValidator();

        // Registrar managers globalmente
        window.FormPIRShared.managers = this.managers;
        window.FormPIRShared.iteracionesManager = this.managers.iteraciones;

        // Configurar envío de formularios
        this.setupFormSubmission();

        this.initialized = true;
        window.FormPIRShared.initialized = true;

        logLocal.success('✅ Sistema de Funcionalidades Compartidas inicializado correctamente');
        
        // Evento personalizado para notificar que el sistema está listo
        window.dispatchEvent(new CustomEvent('formPIRReady', {
            detail: { managers: this.managers }
        }));
    }

    detectSection() {
        // Detectar sección basada en la URL o elementos presentes
        const path = window.location.pathname;
        
        if (path.includes('estructuras')) {
            window.FormPIRShared.seccionActual = 'estructuras';
        } else if (path.includes('conductores')) {
            window.FormPIRShared.seccionActual = 'conductores';
        } else if (path.includes('equipos')) {
            window.FormPIRShared.seccionActual = 'equipos';
        } else if (path.includes('transformador')) {
            window.FormPIRShared.seccionActual = 'transformadores';
        }

        // También establecer en el body para CSS/JS específico
        document.body.setAttribute('data-seccion', window.FormPIRShared.seccionActual);
        
        logLocal.info('Sección detectada:', window.FormPIRShared.seccionActual);
    }

    setupFormSubmission() {
        const forms = document.querySelectorAll('form[id*="form"]');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                logLocal.info('Preparando envío de formulario');
                
                // Serializar iteraciones
                const iteracionesField = document.getElementById('iteraciones_json');
                if (iteracionesField && this.managers.iteraciones) {
                    iteracionesField.value = this.managers.iteraciones.serializarParaEnvio();
                    logLocal.info('Iteraciones serializadas:', this.managers.iteraciones.iteraciones.length);
                }

                // Validaciones adicionales si es necesario
                if (this.managers.iteraciones.iteraciones.length === 0) {
                    const confirmar = confirm('No has agregado iteraciones. ¿Deseas continuar?');
                    if (!confirmar) {
                        e.preventDefault();
                        return false;
                    }
                }

                logLocal.success('Formulario listo para envío');
            });
        });
    }
}

// ====================================
// 8. AUTO-INICIALIZACIÓN
// ====================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const initializer = new FormPIRInitializer();
        initializer.init();
    });
} else {
    // DOM ya cargado
    const initializer = new FormPIRInitializer();
    initializer.init();
}

// ====================================
// 9. FUNCIONES GLOBALES DE COMPATIBILIDAD
// ====================================

// Funciones legacy para compatibilidad con código existente
window.handleTipoInversion = function() {
    if (window.FormPIRShared?.managers?.tiposInversion) {
        window.FormPIRShared.managers.tiposInversion.handleTipoInversion();
    }
};

window.toggleMontajeIntegral = function() {
    const checkbox = document.getElementById('montaje_integral_checkbox');
    if (checkbox && window.FormPIRShared?.managers?.tiposInversion) {
        window.FormPIRShared.managers.tiposInversion.setupCheckboxes();
    }
};

window.toggleDesmantelado = function() {
    const checkbox = document.getElementById('desmantelado_checkbox');
    if (checkbox && window.FormPIRShared?.managers?.tiposInversion) {
        window.FormPIRShared.managers.tiposInversion.setupCheckboxes();
    }
};

window.validateCoordinate = function(field, type) {
    if (window.FormPIRShared?.managers?.coordinates) {
        return window.FormPIRShared.managers.coordinates.validateCoordinate(field);
    }
};

// ====================================
// 10. EXPORTACIÓN
// ====================================

window.FormPIRShared = window.FormPIRShared || {};
window.FormPIRShared.TiposInversionManager = TiposInversionManager;
window.FormPIRShared.AutocompletadoManager = AutocompletadoManager;
window.FormPIRShared.IteracionesUniversalManager = IteracionesUniversalManager;
window.FormPIRShared.CoordinateValidator = CoordinateValidator;
window.FormPIRShared.FormPIRInitializer = FormPIRInitializer;
window.FormPIRShared.log = log;

logLocal.info('🎯 Sistema de Funcionalidades Compartidas cargado correctamente');
