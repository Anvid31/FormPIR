/**
 * Mapeo de Proyectos con sus Bancos y Contratos
 * Datos actualizados según especificaciones del cliente
 */

// Importar datos de municipios desde data-mappings.js si está disponible
// o definir localmente para asegurar funcionamiento
window.MUNICIPIO_MAPPING = window.MUNICIPIO_MAPPING || {
  // BOLIVAR (1 municipio)
  MORALES: { departamento: "BOLIVAR", regional: "AGUACHICA" },
  
  // CESAR (7 municipios)
  AGUACHICA: { departamento: "CESAR", regional: "AGUACHICA" },
  GAMARRA: { departamento: "CESAR", regional: "AGUACHICA" },
  GONZALEZ: { departamento: "CESAR", regional: "OCAÑA" },
  "LA GLORIA": { departamento: "CESAR", regional: "AGUACHICA" },
  PAILITAS: { departamento: "CESAR", regional: "AGUACHICA" },
  PELAYA: { departamento: "CESAR", regional: "AGUACHICA" },
  "RIO DE ORO": { departamento: "CESAR", regional: "OCAÑA" },
  
  // NORTE DE SANTANDER (37 municipios)
  ÁBREGO: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  ARBOLEDAS: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  BOCHALEMA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  BUCARASICA: { departamento: "NORTE DE SANTANDER", regional: "TIBU" },
  CÁCHIRA: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  CÁCOTA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  CHINÁCOTA: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  CHITAGÁ: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  CONVENCIÓN: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  CÚCUTA: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  CUCUTILLA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  DURANIA: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  "EL CARMEN": { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  "EL TARRA": { departamento: "NORTE DE SANTANDER", regional: "TIBU" },
  "EL ZULIA": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  GRAMALOTE: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  HACARÍ: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  HERRÁN: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  "LA ESPERANZA": { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  "LA PLAYA": { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  LABATECA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  "LOS PATIOS": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  LOURDES: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  MUTISCUA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  OCAÑA: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  PAMPLONA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  PAMPLONITA: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  "PUERTO SANTANDER": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  RAGONVALIA: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  SALAZAR: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  "SAN CALIXTO": { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  "SAN CAYETANO": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  SANTIAGO: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  SARDINATA: { departamento: "NORTE DE SANTANDER", regional: "TIBU" },
  SILOS: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  TEORAMA: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  TIBÚ: { departamento: "NORTE DE SANTANDER", regional: "TIBU" },
  TOLEDO: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  "VILLA DEL ROSARIO": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  "VILLA CARO": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  
  // SANTANDER (3 municipios)
  CONCEPCION: { departamento: "SANTANDER", regional: "PAMPLONA" },
  "SAN ALBERTO": { departamento: "SANTANDER", regional: "OCAÑA" },
  "SAN MARTIN": { departamento: "SANTANDER", regional: "OCAÑA" }
};

window.PROYECTO_COMPLETO_MAPPING = {
    'Automatización de redes distribución CENS': {
        banco: 'NEG0719TYD',
        contratos: []  // Se llenarán dinámicamente desde el backend
    },
    'Compra de bien futuro': {
        banco: 'NEG9996TYD',
        contratos: []
    },
    'Electrificación Rural CENS': {
        banco: 'NEG0721TYD',
        contratos: []
    },
    'Expansión redes de distribución CENS': {
        banco: 'NEG0720TYD',
        contratos: [
            {
                codigo: 'CW321301',
                contratista: 'INGESSA',
                regional: 'CÚCUTA Y PAMPLONA'
            },
            {
                codigo: 'CW324382',
                contratista: 'ENECON',
                regional: 'OCAÑA Y AGUACHICA'
            }
        ]
    },
    'Gestión y control pérdidas de energía - CENS': {
        banco: 'PEI0144TYD',
        contratos: []
    },
    'Mantenimiento redes de distribución': {
        banco: 'NEG1175TYD',
        contratos: []
    },
    'Mantenimiento redes de distribución - MIT': {
        banco: 'NEG1175MIT',
        contratos: []
    },
    'Normalización subestación Sevilla 115/34.5 kV e interconexión a 115 kV': {
        banco: 'PEI0342TYD',
        contratos: []
    },
    'Nueva línea INSC77 - Guaduas 34.5 kV': {
        banco: 'PEI1293DIS',
        contratos: []
    },
    'Nuevo Alimentador Gabarra': {
        banco: 'PEI1197TYD',
        contratos: []
    },
    'Reconfiguración Planta Zulia 13.8kV': {
        banco: 'PEI1198TYD',
        contratos: []
    },
    'Reposición redes de distribución CENS': {
        banco: 'NEG0717TYD',
        contratos: [
            {
                codigo: 'CW321301',
                contratista: 'INGESSA',
                regional: 'CÚCUTA Y PAMPLONA'
            },
            {
                codigo: 'CW324382',
                contratista: 'ENECON',
                regional: 'OCAÑA Y AGUACHICA'
            }
        ]
    },
    'Reposición transformadores distribución CENS': {
        banco: 'NEG0718TYD',
        contratos: []
    },
    'Repotenciación de líneas CENS 115 kV': {
        banco: 'PEI0553TYD',
        contratos: []
    },
    'Reposición subestaciones y líneas CENS': {
        banco: 'NEG0716TYD',
        contratos: []
    },
    'Expansión y normalización de subestaciones media tensión.': {
        banco: 'NEG1176TYD',
        contratos: []
    },
    'Nueva subestación La Playa 34.5/13.8 kV': {
        banco: 'PEI0569TYDCE',
        contratos: []
    },
    'Gestión de Activos CENS': {
        banco: 'SGACENSTYD',
        contratos: []
    },
    'Activos de Uso propiedad de Terceros': {
        banco: 'NEG0720TYD',
        contratos: []
    }
};

// Función para manejar cambio de contrato y autocompletar regional
function handleContratoChange() {
    const contratoField = document.getElementById('contrato');
    const regionalField = document.getElementById('regional');
    const nombreField = document.getElementById('nombre');
    
    if (!contratoField || !regionalField || !nombreField) {
        console.warn('⚠️ No se encontraron los campos necesarios para autocompletar regional');
        return;
    }
    
    const contratoSeleccionado = contratoField.value;
    const nombreProyecto = nombreField.value;
    
    console.log('📄 Procesando cambio de contrato:', contratoSeleccionado);
    
    if (contratoSeleccionado && contratoSeleccionado !== '' && nombreProyecto && window.PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
        const contratos = window.PROYECTO_COMPLETO_MAPPING[nombreProyecto].contratos;
        const contratoData = contratos.find(contrato => contrato.codigo === contratoSeleccionado);
        
        if (contratoData && contratoData.regional) {
            // Autocompletar regional
            regionalField.value = contratoData.regional;
            regionalField.disabled = true;
            regionalField.classList.add("bg-green-50", "border-green-300", "text-gray-700");
            regionalField.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");
            
            console.log('✅ Regional autocompletada:', contratoData.regional);
            console.log('🏢 Contratista:', contratoData.contratista);
        } else {
            // Limpiar regional si no se encuentra
            regionalField.value = "";
            regionalField.disabled = true;
            regionalField.classList.remove("bg-green-50", "border-green-300", "text-gray-700");
            regionalField.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
            
            console.log('⚠️ No se encontró regional para el contrato:', contratoSeleccionado);
        }
    } else {
        // Limpiar regional si no hay contrato válido
        regionalField.value = "";
        regionalField.disabled = true;
        regionalField.classList.remove("bg-green-50", "border-green-300", "text-gray-700");
        regionalField.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
    }
}

// Función para actualizar municipios basado en la regional del contrato
function actualizarMunicipios() {
    const contratoField = document.getElementById('contrato');
    const municipioField = document.getElementById('municipio');
    const nombreField = document.getElementById('nombre');
    
    if (!contratoField || !municipioField || !nombreField) {
        console.warn('⚠️ No se encontraron los campos necesarios para actualizar municipios');
        return;
    }
    
    const contratoSeleccionado = contratoField.value;
    const nombreProyecto = nombreField.value;
    
    console.log('🏙️ Actualizando municipios para contrato:', contratoSeleccionado);
    
    // Limpiar opciones existentes
    municipioField.innerHTML = '<option value="">Seleccionar municipio</option>';
    
    if (contratoSeleccionado && contratoSeleccionado !== '' && nombreProyecto && window.PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
        const contratos = window.PROYECTO_COMPLETO_MAPPING[nombreProyecto].contratos;
        const contratoData = contratos.find(contrato => contrato.codigo === contratoSeleccionado);
        
        if (contratoData && contratoData.regional && window.MUNICIPIO_MAPPING) {
            const regionalDelContrato = contratoData.regional;
            
            // Filtrar municipios por la regional del contrato
            const municipiosFiltrados = Object.keys(window.MUNICIPIO_MAPPING).filter(municipio => {
                const datosM = window.MUNICIPIO_MAPPING[municipio];
                
                // Manejar variaciones de nombres de regionales
                if (regionalDelContrato === "CÚCUTA Y PAMPLONA") {
                    return datosM.regional === "CUCUTA" || datosM.regional === "PAMPLONA";
                } else if (regionalDelContrato === "OCAÑA Y AGUACHICA") {
                    return datosM.regional === "OCAÑA" || datosM.regional === "AGUACHICA";
                } else {
                    return datosM.regional === regionalDelContrato || 
                           datosM.regional === regionalDelContrato.replace("Ú", "U");
                }
            });
            
            // Agregar municipios filtrados al select
            municipiosFiltrados.sort().forEach(municipio => {
                const option = document.createElement('option');
                option.value = municipio;
                option.textContent = municipio;
                option.dataset.departamento = window.MUNICIPIO_MAPPING[municipio].departamento;
                option.dataset.regional = window.MUNICIPIO_MAPPING[municipio].regional;
                municipioField.appendChild(option);
            });
            
            // Habilitar el campo
            municipioField.disabled = false;
            municipioField.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");
            municipioField.classList.add("bg-blue-50", "border-blue-300");
            
            console.log('✅ Municipios actualizados:', municipiosFiltrados.length, 'municipios disponibles');
        } else {
            // Deshabilitar si no hay datos
            municipioField.disabled = true;
            municipioField.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
            municipioField.classList.remove("bg-blue-50", "border-blue-300");
            
            console.log('⚠️ No se encontró regional para el contrato:', contratoSeleccionado);
        }
    } else {
        // Deshabilitar si no hay contrato válido
        municipioField.disabled = true;
        municipioField.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
        municipioField.classList.remove("bg-blue-50", "border-blue-300");
    }
}

// Función para autocompletar banco del proyecto
function autoCompleteBanco() {
    const nombreField = document.getElementById('nombre');
    const bancoField = document.getElementById('banco_proyecto');
    
    if (!nombreField || !bancoField) {
        console.warn('⚠️ No se encontraron los campos nombre o banco_proyecto');
        return;
    }
    
    const nombreProyecto = nombreField.value.trim();
    
    // NO autocompletar si el campo está vacío o es la opción por defecto
    if (!nombreProyecto || nombreProyecto === '' || nombreProyecto === 'Seleccionar proyecto') {
        console.log('🏦 Campo proyecto vacío o por defecto - no autocompletando');
        // Limpiar el banco si no hay proyecto seleccionado
        bancoField.value = "";
        bancoField.classList.remove("bg-green-50", "border-green-300", "text-gray-700");
        bancoField.disabled = false;
        return;
    }
    
    console.log('🏦 Autocompletando banco para proyecto:', nombreProyecto);
    
    if (nombreProyecto && window.PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
        const proyectoData = window.PROYECTO_COMPLETO_MAPPING[nombreProyecto];
        const banco = proyectoData.banco;
        
        // Autocompletar el banco
        bancoField.value = banco;
        bancoField.classList.add("bg-green-50", "border-green-300", "text-gray-700");
        bancoField.disabled = true;
        
        console.log('✅ Banco autocompletado:', banco);
        
        // Actualizar contratos después del banco
        actualizarContratos();
        
        // Evento personalizado para notificar el cambio
        document.dispatchEvent(new CustomEvent('bancoAutocompletado', {
            detail: { proyecto: nombreProyecto, banco: banco }
        }));
        
    } else {
        // Limpiar si no hay mapeo
        bancoField.value = "";
        bancoField.classList.remove("bg-green-50", "border-green-300", "text-gray-700");
        bancoField.disabled = false;
        
        console.log('⚠️ No se encontró mapeo para el proyecto:', nombreProyecto);
    }
}

// Función para actualizar contratos (placeholder - se llenará desde el backend)
function actualizarContratos() {
    const contratoField = document.getElementById('contrato');
    const nombreField = document.getElementById('nombre');
    
    if (!contratoField || !nombreField) return;
    
    const nombreProyecto = nombreField.value;
    
    if (nombreProyecto && window.PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
        const contratos = window.PROYECTO_COMPLETO_MAPPING[nombreProyecto].contratos;
        
        // Limpiar opciones existentes
        contratoField.innerHTML = '<option value="">Seleccionar contrato</option>';
        
        // Agregar contratos si existen
        if (contratos && contratos.length > 0) {
            contratos.forEach(contrato => {
                const option = document.createElement('option');
                option.value = contrato.codigo;
                option.textContent = contrato.codigo;
                option.dataset.contratista = contrato.contratista;
                option.dataset.regional = contrato.regional;
                contratoField.appendChild(option);
            });
            
            contratoField.disabled = false;
            console.log('✅ Contratos actualizados:', contratos.length);
            
            // Configurar event listener para autocompletar regional
            contratoField.removeEventListener('change', handleContratoChange);
            contratoField.addEventListener('change', handleContratoChange);
            
            // También actualizar municipios cuando se selecciona contrato
            contratoField.removeEventListener('change', actualizarMunicipios);
            contratoField.addEventListener('change', actualizarMunicipios);
        } else {
            // Si no hay contratos definidos, habilitar para selección manual
            contratoField.disabled = false;
            console.log('⚠️ No hay contratos definidos para este proyecto');
        }
    }
}

// Hacer funciones disponibles globalmente
window.autoCompleteBanco = autoCompleteBanco;
window.actualizarContratos = actualizarContratos;
window.handleContratoChange = handleContratoChange;
window.actualizarMunicipios = actualizarMunicipios;

// Log de inicialización
console.log('✅ PROYECTO_COMPLETO_MAPPING cargado con', Object.keys(window.PROYECTO_COMPLETO_MAPPING).length, 'proyectos');
console.log('📋 Proyectos disponibles:', Object.keys(window.PROYECTO_COMPLETO_MAPPING));
