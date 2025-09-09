// autocompletion.js - Sistema de autocompletado del formulario DESS
// Versión 2.0 - Refactorizado para usar utilidades centralizadas

// Variables globales para los elementos del DOM
let ucSelect, descripcionUc;

// Variable para rastrear interacción del usuario
window.userHasInteracted = false;

// Función para marcar que el usuario ha interactuado
function markUserInteraction() {
  if (!window.userHasInteracted) {
    window.userHasInteracted = true;
  }
}

// Función para inicializar el autocompletado
function initializeAutocompletion() {
  // Buscar elementos con diferentes IDs según la sección usando utilidades
  ucSelect = window.ACUtils?.getElement("uc_nueva") || window.ACUtils?.getElement("uc_codigo");
  descripcionUc = window.ACUtils?.getElement("descripcion_uc");

  // Llenar el select de UC con el mapping completo si es un select
  if (ucSelect && ucSelect.tagName === 'SELECT' && typeof UC_MAPPING !== 'undefined') {
    const ucOptions = Object.entries(UC_MAPPING).map(([codigo, descripcion]) => ({
      value: codigo,
      text: codigo
    }));
    
    window.ACUtils?.populateSelect(ucSelect, ucOptions, "Seleccionar UC");
  }

  // Inicializar estados de campos autocompletados como deshabilitados
  initializeDisabledFields();
}

// Función para inicializar campos autocompletados como deshabilitados
function initializeDisabledFields() {
  const fieldsToDisable = ["regional", "departamento", "alimentador"];
  const placeholders = {
    "regional": "Se autocompletará según contrato o municipio",
    "departamento": "Se autocompletará según el municipio"
  };

  fieldsToDisable.forEach(fieldId => {
    const field = window.ACUtils?.getElement(fieldId);
    if (field) {
      window.ACUtils?.updateFieldVisualState(field, 'disabled');
      if (placeholders[fieldId]) {
        field.placeholder = placeholders[fieldId];
      }
    }
  });
}

// Auto-completar UC - Sistema simplificado usando selector UC jerárquico
function autoCompleteUC() {
  const ucField = findElementInCurrentSection("uc") || findElementInCurrentSection("uc_nueva");
  if (ucField) {
  }
  
  return; // Salir temprano - el selector jerárquico maneja todo
}

// Función simplificada - Los campos individuales fueron eliminados
function toggleStructureFields() {

  return; // Salir temprano - el selector jerárquico maneja todo
}

// Función para mostrar/ocultar campos SIN ejecutar autocompletado automático - SIMPLIFICADA
function toggleStructureFieldsWithoutAutoComplete() {
  
  // Los campos individuales ya no existen, no hay nada que ocultar/mostrar
  return; // Salir temprano - el selector jerárquico maneja todo
}

// Función simplificada - Los campos individuales de apoyo fueron eliminados
function updateApoyoOptions(allowedOptions = null) {
  
  // El campo apoyo_nueva ya no existe
  return; // Salir temprano - el selector jerárquico maneja todo
}

// Función universal para encontrar elementos en la sección activa
function findElementInCurrentSection(elementId) {
  // Primero intentar búsqueda global por ID (para compatibilidad con estructuras)
  let element = document.getElementById(elementId);
  if (element) {
    return element;
  }
  
  // Si no se encuentra globalmente, buscar en la sección activa
  const currentSection = window.currentStep || 'estructuras';
  
  // Buscar en sección con atributo data-form-section
  const activeSection = document.querySelector(`[data-form-section="${currentSection}"]`);
  if (activeSection) {
    element = activeSection.querySelector(`#${elementId}`);
    if (element) {
      return element;
    }
    
    // También buscar por name attribute como respaldo
    element = activeSection.querySelector(`[name="${elementId}"]`);
    if (element) {
      return element;
    }
  }
  
  // Buscar en cualquier contenedor activo visible
  const visibleContainers = document.querySelectorAll('[id*="form"], [class*="form"], [data-step], .active');
  
  for (const container of visibleContainers) {
    if (container.style.display !== 'none' && !container.hidden) {
      element = container.querySelector(`#${elementId}`);
      if (element) {
        return element;
      }
      
      element = container.querySelector(`[name="${elementId}"]`);
      if (element) {
        return element;
      }
    }
  }
  
  return null;
}

// Función para actualizar contratos según proyecto seleccionado
function actualizarContratos() {
  // Buscar elementos usando búsqueda directa primero, luego universal
  const nombreField = document.getElementById("nombre") || findElementInCurrentSection("nombre");
  const contratoSelect = document.getElementById("contrato") || findElementInCurrentSection("contrato");
  
  if (!nombreField || !contratoSelect) {
    return;
  }
  
  const nombreProyecto = nombreField.value;

  // Limpiar opciones existentes (excepto la primera)
  contratoSelect.innerHTML =
    '<option value="">Seleccionar contrato</option>';

  if (nombreProyecto && typeof window.PROYECTO_COMPLETO_MAPPING !== 'undefined' && window.PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
    const contratos = window.PROYECTO_COMPLETO_MAPPING[nombreProyecto].contratos;

    // Agregar opciones de contratos
    contratos.forEach((contrato) => {
      const option = document.createElement("option");
      option.value = contrato.codigo;
      option.textContent = contrato.codigo;
      option.dataset.contratista = contrato.contratista;
      option.dataset.regional = contrato.regional;
      contratoSelect.appendChild(option);
    });

    // Agregar indicador visual
    contratoSelect.classList.add("bg-green-50", "border-green-300");
  } else {
    // Usar contratos genéricos si no hay mapeo específico
    const contratosGenericos = ["Por definir"];

    contratosGenericos.forEach((contrato) => {
      const option = document.createElement("option");
      option.value = contrato;
      option.textContent = contrato;
      contratoSelect.appendChild(option);
    });

    // Remover indicador visual
    contratoSelect.classList.remove("bg-green-50", "border-green-300");
  }

  // Limpiar selects dependientes usando búsqueda híbrida
  const municipioSelect = document.getElementById("municipio") || findElementInCurrentSection("municipio");
  const alimentadorSelect = document.getElementById("alimentador") || findElementInCurrentSection("alimentador");
  const departamentoInput = document.getElementById("departamento") || findElementInCurrentSection("departamento");
  const regionalInput = document.getElementById("regional") || findElementInCurrentSection("regional");
  
  if (municipioSelect) {
    municipioSelect.innerHTML = '<option value="">Seleccionar municipio</option>';
    municipioSelect.classList.remove("bg-blue-50", "border-blue-300");
  }
  
  if (alimentadorSelect) {
    alimentadorSelect.innerHTML = '<option value="">Seleccionar alimentador</option>';
    alimentadorSelect.classList.remove("bg-yellow-50", "border-yellow-300");
    alimentadorSelect.classList.add("bg-gray-100", "text-gray-500");
    alimentadorSelect.classList.remove("bg-green-50", "border-green-300");
  }

  if (departamentoInput) {
    departamentoInput.value = "";
    departamentoInput.disabled = true;
    departamentoInput.classList.remove("bg-green-50", "border-green-300");
    departamentoInput.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
  }
  
  if (regionalInput) {
    regionalInput.value = "";
    regionalInput.disabled = true;
    regionalInput.classList.remove("bg-green-50", "border-green-300");
    regionalInput.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
  }

  // Actualizar regional y municipios según el contrato por defecto (si hay uno)
  setTimeout(() => {
    if (contratoSelect.value) {
      autoCompleteRegional();
    }
  }, 100);
}

// Función para autocompletar banco del proyecto
function autoCompleteBanco() {
  // Buscar elementos usando búsqueda híbrida
  const nombreField = document.getElementById("nombre") || findElementInCurrentSection("nombre");
  const bancoProyecto = document.getElementById("banco_proyecto") || findElementInCurrentSection("banco_proyecto");
  
  if (!nombreField || !bancoProyecto) {
    return;
  }

  const nombreProyecto = nombreField.value;

  if (nombreProyecto && typeof window.PROYECTO_COMPLETO_MAPPING !== 'undefined' && window.PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
    const proyectoData = window.PROYECTO_COMPLETO_MAPPING[nombreProyecto];
    const banco = proyectoData.banco;
    
    bancoProyecto.value = banco;
    bancoProyecto.disabled = true;
    bancoProyecto.classList.add("bg-green-50", "border-green-300", "text-gray-700");
    
  } else {
    bancoProyecto.value = "";
    bancoProyecto.classList.remove("bg-green-50", "border-green-300");
  }

  // Actualizar contratos después del banco
  actualizarContratos();
}

// Función para autocompletar regional basado en contrato seleccionado
function autoCompleteRegional() {
  const contratoField = findElementInCurrentSection("contrato");
  const regionalInput = findElementInCurrentSection("regional");
  const nombreField = findElementInCurrentSection("nombre");
  
  if (!contratoField || !regionalInput || !nombreField) return;
  
  const contratoSeleccionado = contratoField.value;
  const nombreProyecto = nombreField.value;


  if (contratoSeleccionado && contratoSeleccionado !== "Por definir") {
    // Buscar la regional del contrato seleccionado
    let regionalDelContrato = null;

    if (nombreProyecto && typeof PROYECTO_COMPLETO_MAPPING !== 'undefined' && PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
      const contratos = PROYECTO_COMPLETO_MAPPING[nombreProyecto].contratos;
      const contratoData = contratos.find(
        (c) => c.codigo === contratoSeleccionado
      );
      if (contratoData && contratoData.regional !== "Por definir") {
        regionalDelContrato = contratoData.regional;
      }
    }

    if (regionalDelContrato) {
      // Autocompletar regional y habilitarlo visualmente
      regionalInput.value = regionalDelContrato;
      regionalInput.disabled = true; // Solo lectura, autocompletado
      regionalInput.classList.add("bg-green-50", "border-green-300");
      regionalInput.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");
    } else {
      // Limpiar y deshabilitar regional si no se encuentra
      regionalInput.value = "";
      regionalInput.disabled = true;
      regionalInput.classList.remove("bg-green-50", "border-green-300");
      regionalInput.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
    }
  } else {
    // Limpiar y deshabilitar regional si no hay contrato válido
    regionalInput.value = "";
    regionalInput.disabled = true;
    regionalInput.classList.remove("bg-green-50", "border-green-300");
    regionalInput.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
  }

  // Actualizar municipios después de autocompletar regional
  actualizarMunicipiosPorContrato();
}

// Función para actualizar municipios por contrato
function actualizarMunicipiosPorContrato() {
  const contratoField = findElementInCurrentSection("contrato");
  const municipioSelect = findElementInCurrentSection("municipio");
  const nombreField = findElementInCurrentSection("nombre");
  
  if (!contratoField || !municipioSelect || !nombreField) return;
  
  const contratoSeleccionado = contratoField.value;
  const nombreProyecto = nombreField.value;

  // Log para depuración
  console.log("ActualizarMunicipiosPorContrato - Contrato seleccionado:", contratoSeleccionado);

  // Limpiar opciones existentes (excepto la primera)
  municipioSelect.innerHTML =
    '<option value="">Seleccionar municipio</option>';

  if (contratoSeleccionado && contratoSeleccionado !== "Por definir") {
    // Buscar la regional del contrato seleccionado
    let regionalDelContrato = null;

    if (nombreProyecto && typeof PROYECTO_COMPLETO_MAPPING !== 'undefined' && PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
      const contratos = PROYECTO_COMPLETO_MAPPING[nombreProyecto].contratos;
      const contratoData = contratos.find(
        (c) => c.codigo === contratoSeleccionado
      );
      if (contratoData && contratoData.regional !== "Por definir") {
        regionalDelContrato = contratoData.regional;
      }
    }


    if (regionalDelContrato && typeof MUNICIPIO_MAPPING !== 'undefined') {
      // Filtrar municipios por la regional del contrato
      const municipiosFiltrados = Object.keys(MUNICIPIO_MAPPING).filter(
        (municipio) => {
          const datosM = MUNICIPIO_MAPPING[municipio];
          // Comparar regional, considerando variaciones como "CÚCUTA Y PAMPLONA" = "CUCUTA" + "PAMPLONA"
          if (regionalDelContrato === "CÚCUTA Y PAMPLONA") {
            return (
              datosM.regional === "CUCUTA" ||
              datosM.regional === "PAMPLONA"
            );
          } else if (regionalDelContrato === "OCAÑA Y AGUACHICA") {
            return (
              datosM.regional === "OCAÑA" ||
              datosM.regional === "AGUACHICA"
            );
          } else {
            return datosM.regional === regionalDelContrato;
          }
        }
      );

      if (municipiosFiltrados.length > 0) {
        // Agregar municipios filtrados al select
        municipiosFiltrados.forEach((municipio) => {
          const option = document.createElement("option");
          option.value = municipio;
          option.textContent = municipio;
          municipioSelect.appendChild(option);
        });

  // Agregar indicador visual
  municipioSelect.classList.add("bg-blue-50", "border-blue-300");
  // Log para depuración
  console.log(`Municipios filtrados para la regional ${regionalDelContrato}:`, municipiosFiltrados.length, "opciones disponibles");
      } else {
        // No hay municipios para esta regional
        const option = document.createElement("option");
        option.value = "";
        option.textContent = `No hay municipios disponibles para la regional ${regionalDelContrato}`;
        option.disabled = true;
        municipioSelect.appendChild(option);

  municipioSelect.classList.add("bg-red-50", "border-red-300");
  // Log para depuración
  console.log(`No se encontraron municipios para la regional ${regionalDelContrato}`);
      }
    } else {
      // Si no hay regional específica, mostrar todos los municipios
      if (typeof MUNICIPIO_MAPPING !== 'undefined') {
        Object.keys(MUNICIPIO_MAPPING).forEach((municipio) => {
          const option = document.createElement("option");
          option.value = municipio;
          option.textContent = municipio;
          municipioSelect.appendChild(option);
        });
      }

      // Remover indicador visual
      municipioSelect.classList.remove(
        "bg-blue-50",
        "border-blue-300",
        "bg-red-50",
        "border-red-300"
      );
      // Log para depuración
      console.log("Mostrando todos los municipios (sin filtro de regional)");
    }
  } else {
    // Si el contrato es "Por definir" o no hay contrato, mostrar todos los municipios
    if (typeof MUNICIPIO_MAPPING !== 'undefined') {
      Object.keys(MUNICIPIO_MAPPING).forEach((municipio) => {
        const option = document.createElement("option");
        option.value = municipio;
        option.textContent = municipio;
        municipioSelect.appendChild(option);
      });
    }

    // Remover indicador visual
    municipioSelect.classList.remove(
      "bg-blue-50",
      "border-blue-300",
      "bg-red-50",
      "border-red-300"
    );
    // Log para depuración
    console.log("Mostrando todos los municipios (contrato 'Por definir' o no seleccionado)");
  }

  // Limpiar selects dependientes
  const alimentadorSelect = findElementInCurrentSection("alimentador");
  if (alimentadorSelect) {
    alimentadorSelect.innerHTML = '<option value="">Seleccionar alimentador</option>';
    alimentadorSelect.classList.remove("bg-yellow-50", "border-yellow-300");
  }
}

// Función para actualizar circuitos según municipio seleccionado
// DESACTIVADA - Redirigida al CircuitoMasterHandler para evitar conflictos
function actualizarCircuitos() {
  console.warn('⚠️ actualizarCircuitos() redirigido al CircuitoMasterHandler');
  if (window.circuitoMasterHandler) {
    return window.circuitoMasterHandler.forceUpdate();
  } else {
    console.error('❌ CircuitoMasterHandler no disponible');
    return false;
  }
}

// Función para autocompletar departamento y regional basado en municipio
function autoCompleteDepartamento() {
  const municipioField = findElementInCurrentSection("municipio");
  const departamentoInput = findElementInCurrentSection("departamento");
  const regionalInput = findElementInCurrentSection("regional");
  
  if (!municipioField || !departamentoInput || !regionalInput) return;
  
  const municipioSeleccionado = municipioField.value;


  if (
    municipioSeleccionado &&
    typeof MUNICIPIO_MAPPING !== 'undefined' &&
    MUNICIPIO_MAPPING[municipioSeleccionado]
  ) {
    const datos = MUNICIPIO_MAPPING[municipioSeleccionado];

    // Autocompletar departamento y marcarlo como solo lectura
    departamentoInput.value = datos.departamento;
    departamentoInput.disabled = true; // Solo lectura, autocompletado
    departamentoInput.classList.add("bg-green-50", "border-green-300");
    departamentoInput.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");

    // Autocompletar regional y marcarlo como solo lectura
    regionalInput.value = datos.regional;
    regionalInput.disabled = true; // Solo lectura, autocompletado
    regionalInput.classList.add("bg-green-50", "border-green-300");
    regionalInput.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");

  // Log para depuración
  console.log("Departamento autocompletado:", municipioSeleccionado, "->", datos.departamento);
  console.log("Regional autocompletada:", municipioSeleccionado, "->", datos.regional);
  } else {
    // Limpiar y deshabilitar departamento y regional si no hay mapeo
    departamentoInput.value = "";
    departamentoInput.disabled = true;
    departamentoInput.classList.remove("bg-green-50", "border-green-300");
    departamentoInput.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");

    regionalInput.value = "";
    regionalInput.disabled = true;
    regionalInput.classList.remove("bg-green-50", "border-green-300");
    regionalInput.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");

  // No hacer nada si municipioSeleccionado pero no hay mapeo
  }

  // Actualizar circuitos después del municipio
  actualizarCircuitos();
}

// Función para autocompletar departamento y regional basado en municipio (OBSOLETA - mantener por compatibilidad)
function autoCompleteMunicipio() {
  // Esta función ahora solo llama a autoCompleteDepartamento para mantener compatibilidad
  autoCompleteDepartamento();
}

// Función simplificada - Campo altura_nueva eliminado
function actualizarAlturasPorTension() {
  
  // El campo altura_nueva ya no existe
  return; // Salir temprano - el selector jerárquico maneja todo
}

// =============================================================================
// FUNCIONES DE CONTROL DE FORMULARIO
// =============================================================================

/**
 * FUNCIONES DE CONTROL DE FORMULARIO COMPARTIDAS
 * Solo funciones de habilitación/deshabilitación de secciones
 */

/**
 * Deshabilitar/habilitar TODO el formulario (versión simplificada)
 */
function deshabilitarFormularioCompleto(deshabilitar) {
  const formulario = document.getElementById("form-total");
  if (!formulario) return;
  
  const campos = formulario.querySelectorAll("input, select, textarea, button");
  
  campos.forEach(campo => {
    // SOLO mantener habilitado el checkbox de desmantelado
    if (campo.id === "desmantelado_checkbox") {
      return;
    }
    
    // SOLO mantener habilitado estructura retirada si tiene el atributo especial
    if (campo.getAttribute('data-keep-enabled') === 'true') {
      return;
    }
    
    // Deshabilitar TODO lo demás
    campo.disabled = deshabilitar;
    
    if (deshabilitar) {
      campo.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
    } else {
      campo.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
    }
  });
  
  // Aplicar overlay visual al formulario
  if (deshabilitar) {
    formulario.classList.add("desmantelado-activo");
  } else {
    formulario.classList.remove("desmantelado-activo");
  }
}

/**
 * Deshabilitar/habilitar Sección: Información del Proyecto
 */
function deshabilitarSeccionInformacionProyecto(deshabilitar) {
  const campos = [
    'nombre', 'banco', 'contrato', 'regional', 'municipio', 
    'departamento', 'direccion', 'circuito'
  ];
  
  campos.forEach(campoId => {
    const campo = document.getElementById(campoId);
    if (campo) {
      campo.disabled = deshabilitar;
      if (deshabilitar) {
        campo.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
      } else {
        campo.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
      }
    }
  });
  
}

/**
 * Deshabilitar/habilitar Sección: Documentos y Archivos
 */
function deshabilitarSeccionDocumentosArchivos(deshabilitar) {
  const campos = [
    'archivo_cad', 'archivo_kmz', 'fotos'
  ];
  
  campos.forEach(campoId => {
    const campo = document.getElementById(campoId);
    if (campo) {
      campo.disabled = deshabilitar;
      if (deshabilitar) {
        campo.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
      } else {
        campo.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
      }
    }
  });
  
  // También deshabilitar los controles de archivos
  const fileContainers = document.querySelectorAll('.file-upload-container');
  fileContainers.forEach(container => {
    if (deshabilitar) {
      container.classList.add('disabled', 'opacity-50', 'cursor-not-allowed');
    } else {
      container.classList.remove('disabled', 'opacity-50', 'cursor-not-allowed');
    }
  });
  
}

/**
 * Deshabilitar/habilitar Sección: Información Técnica (EXCEPTO estructura retirada)
 */
function deshabilitarSeccionInformacionTecnica(deshabilitar) {
  const seccion = document.getElementById('seccion-informacion-tecnica');
  if (!seccion) return;
  
  const campos = seccion.querySelectorAll('input, select, textarea, button');
  
  campos.forEach(campo => {
    // NO deshabilitar estructura retirada
    if (campo.id === 'estructura_retirada_campo') {
      return;
    }
    
    // NO deshabilitar el checkbox de desmantelado
    if (campo.id === 'desmantelado_checkbox') {
      return;
    }
    
    campo.disabled = deshabilitar;
    if (deshabilitar) {
      campo.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
    } else {
      campo.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
    }
  });
  
}

/**
 * Deshabilitar/habilitar Sección: Información de Estructuras
 */
function deshabilitarSeccionInformacionEstructuras(deshabilitar) {
  const seccion = document.getElementById('seccion-informacion-estructuras');
  if (!seccion) {
    console.warn('⚠️ No se encontró la sección seccion-informacion-estructuras');
    return;
  }
  
  // Buscar TODOS los campos en la sección
  const campos = seccion.querySelectorAll('input, select, textarea, button, .uc-card, .btn, .form-control');
  
  campos.forEach(campo => {
    // NO deshabilitar estructura retirada (aunque esté en esta sección)
    if (campo.id === 'estructura_retirada_campo') {
      return;
    }
    
    // NO deshabilitar el checkbox de desmantelado (aunque esté en esta sección)
    if (campo.id === 'desmantelado_checkbox') {
      return;
    }
    
    // Deshabilitar/habilitar el campo
    campo.disabled = deshabilitar;
    if (deshabilitar) {
      campo.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
      // También agregar pointer-events: none para elementos que no sean form controls
      campo.style.pointerEvents = 'none';
    } else {
      campo.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
      campo.style.pointerEvents = '';
    }
    
  });
  
  // También buscar y deshabilitar las tarjetas UC (Unidad Constructiva)
  const ucCards = seccion.querySelectorAll('.uc-card, [data-uc-type], .nivel-card');
  ucCards.forEach(card => {
    if (deshabilitar) {
      card.classList.add('opacity-50', 'pointer-events-none', 'cursor-not-allowed');
      card.style.filter = 'grayscale(70%)';
    } else {
      card.classList.remove('opacity-50', 'pointer-events-none', 'cursor-not-allowed');
      card.style.filter = '';
    }
  });
  
  // Deshabilitar toda la sección visualmente
  if (deshabilitar) {
    seccion.classList.add('opacity-75');
    seccion.style.filter = 'grayscale(50%)';
    seccion.style.pointerEvents = 'none';
    // Agregar un overlay visual
    seccion.style.position = 'relative';
    if (!seccion.querySelector('.section-disabled-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'section-disabled-overlay';
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.1);
        z-index: 10;
        pointer-events: none;
      `;
      seccion.appendChild(overlay);
    }
  } else {
    seccion.classList.remove('opacity-75');
    seccion.style.filter = '';
    seccion.style.pointerEvents = '';
    // Remover overlay
    const overlay = seccion.querySelector('.section-disabled-overlay');
    if (overlay) {
      overlay.remove();
    }
  }
  
}

/**
 * Deshabilita/habilita los campos de coordenadas (longitud y latitud)
 * Recibe prefijo de sección opcional para formularios modulares
 */
function habilitarDeshabilitarCoordenadas(deshabilitar, seccionPrefix = '') {
  // Construir IDs según si hay prefijo de sección
  const longitudId = seccionPrefix ? `${seccionPrefix}_longitud` : "longitud";
  const latitudId = seccionPrefix ? `${seccionPrefix}_latitud` : "latitud";
  const longitudFinalId = seccionPrefix ? `${seccionPrefix}_longitud_final` : "longitud_final";
  const latitudFinalId = seccionPrefix ? `${seccionPrefix}_latitud_final` : "latitud_final";
  
  const longitud = document.getElementById(longitudId);
  const latitud = document.getElementById(latitudId);
  const longitudFinal = document.getElementById(longitudFinalId);
  const latitudFinal = document.getElementById(latitudFinalId);
  
  // También deshabilitar los labels para indicación visual
  const longitudLabelId = seccionPrefix ? `${seccionPrefix}_longitud_label` : "longitud_label";
  const latitudLabelId = seccionPrefix ? `${seccionPrefix}_latitud_label` : "latitud_label";
  const longitudFinalLabelId = seccionPrefix ? `${seccionPrefix}_longitud_final_label` : "longitud_final_label";
  const latitudFinalLabelId = seccionPrefix ? `${seccionPrefix}_latitud_final_label` : "latitud_final_label";
  
  const longitudLabel = document.getElementById(longitudLabelId);
  const latitudLabel = document.getElementById(latitudLabelId);
  const longitudFinalLabel = document.getElementById(longitudFinalLabelId);
  const latitudFinalLabel = document.getElementById(latitudFinalLabelId);
  
  [longitud, latitud, longitudFinal, latitudFinal].forEach(campo => {
    if (campo) {
      campo.disabled = deshabilitar;
      if (deshabilitar) {
        campo.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
        campo.value = ""; // Limpiar el campo
      } else {
        campo.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");
      }
    }
  });
  
  // Aplicar estilos a los labels también
  [longitudLabel, latitudLabel, longitudFinalLabel, latitudFinalLabel].forEach(label => {
    if (label) {
      if (deshabilitar) {
        label.classList.add("text-gray-400");
      } else {
        label.classList.remove("text-gray-400");
      }
    }
  });
  
}

/**
 * Deshabilita/habilita la sección de información de estructuras
 * Recibe prefijo de sección opcional para formularios modulares
 */
function deshabilitarInformacionEstructuras(deshabilitar, seccionPrefix = '') {
  const seccionId = seccionPrefix ? `${seccionPrefix}-seccion-informacion-estructuras` : "seccion-informacion-estructuras";
  const seccionEstructuras = document.getElementById(seccionId);
  if (seccionEstructuras) {
    const elements = seccionEstructuras.querySelectorAll("input, select, textarea");
    elements.forEach(el => {
      // No deshabilitar los checkboxes de control ni el campo estructura retirada
      const esCheckboxControl = el.id && (el.id.includes('montaje_integral_checkbox') || el.id.includes('desmantelado_checkbox'));
      const esEstructuraRetirada = el.id && el.id.includes('estructura_retirada_campo');
      
      if (esCheckboxControl || esEstructuraRetirada) {
        return;
      }
      
      el.disabled = deshabilitar;
      if (deshabilitar) {
        el.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
      } else {
        el.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");
      }
    });
    
  }
}

/**
 * Deshabilita/habilita la sección de información técnica
 * Recibe prefijo de sección opcional para formularios modulares
 */
function deshabilitarInformacionTecnica(deshabilitar, seccionPrefix = '') {
  const seccionId = seccionPrefix ? `${seccionPrefix}-seccion-informacion-tecnica` : "seccion-informacion-tecnica";
  const seccionTecnica = document.getElementById(seccionId);
  if (seccionTecnica) {
    const elements = seccionTecnica.querySelectorAll("input, select, textarea");
    elements.forEach(el => {
      // No deshabilitar los checkboxes de control
      const esCheckboxControl = el.id && (el.id.includes('montaje_integral_checkbox') || el.id.includes('desmantelado_checkbox'));
      
      if (esCheckboxControl) {
        return;
      }
      
      el.disabled = deshabilitar;
      if (deshabilitar) {
        el.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
      } else {
        el.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");
      }
    });
    
  }
}

/**
 * Deshabilita/habilita el formulario de UC
 */
function deshabilitarFormularioUC(deshabilitar) {
  const formUC = document.getElementById("form-uc");
  if (formUC) {
    const elements = formUC.querySelectorAll("input, select, textarea, button");
    elements.forEach(el => {
      // No deshabilitar los botones de control
      if (el.id === "montaje_integral_btn" || el.id === "desmantelado_btn") {
        return;
      }
      
      el.disabled = deshabilitar;
      if (deshabilitar) {
        el.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
      } else {
        el.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");
      }
    });
    
  }
}

/**
 * Mostrar/ocultar botón Montaje Integral según tipo de inversión
 * Solo aparece para tipos II y IV y gestiona coordenadas
 * Recibe prefijo de sección opcional para formularios modulares
 */
// Exponer funciones globalmente
window.autoCompleteUC = autoCompleteUC;
window.actualizarContratos = actualizarContratos;
window.autoCompleteBanco = autoCompleteBanco;
window.autoCompleteRegional = autoCompleteRegional;
window.actualizarMunicipiosPorContrato = actualizarMunicipiosPorContrato;
window.actualizarCircuitos = actualizarCircuitos;
window.autoCompleteMunicipio = autoCompleteMunicipio;
window.autoCompleteDepartamento = autoCompleteDepartamento;
window.actualizarAlturasPorTension = actualizarAlturasPorTension;
window.habilitarDeshabilitarCoordenadas = habilitarDeshabilitarCoordenadas;
window.initializeAutocompletion = initializeAutocompletion;
window.initializeDisabledFields = initializeDisabledFields;

// Inicializar event listeners para autocompletado UC cuando se cargue el DOM
document.addEventListener("DOMContentLoaded", function() {
  // Dar tiempo para que se carguen todos los scripts y elementos
  setTimeout(() => {
    // Configurar listeners principales
    configurarListenersGlobales();
    
    // Inicializar estado inicial para estructuras - SIN ejecutar autocompletado
    updateApoyoOptions();
    toggleStructureFieldsWithoutAutoComplete();
    
    // Inicializar autocompletado
    initializeAutocompletion();
  }, 1000); // Dar más tiempo para la carga completa
});

// Función para configurar listeners globales que funcionen en cualquier sección
function configurarListenersGlobales() {
  // Event listeners para campos de estructura nueva
  const camposEstructura = [
    "material_nueva",
    "altura_nueva", 
    "poblacion_nueva",
    "disposicion_nueva",
    "tipo_red_nueva",
    "apoyo_nueva",
    "peso_nueva",
    "configuracion_nueva",
    "circuito_nueva",
    "linea_nueva"
  ];

  // Función con debounce para evitar ejecuciones excesivas
  let timeoutId = null;
  const debouncedAutoComplete = () => {
    // Marcar interacción del usuario
    markUserInteraction();
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      autoCompleteUC();
    }, 300); // 300ms de delay
  };

  // Configurar listeners para campos de estructura
  camposEstructura.forEach(campoId => {
    // Buscar elemento globalmente primero
    let elemento = document.getElementById(campoId);
    if (elemento) {
      // Remover listeners anteriores para evitar duplicados
      elemento.removeEventListener("change", debouncedAutoComplete);
      elemento.removeEventListener("input", debouncedAutoComplete);
      elemento.removeEventListener("blur", debouncedAutoComplete);
      
      // Agregar nuevos listeners con diferentes eventos
      elemento.addEventListener("change", debouncedAutoComplete);
      elemento.addEventListener("input", debouncedAutoComplete);
      elemento.addEventListener("blur", debouncedAutoComplete); // También al perder foco
      
    }
    
    // También configurar en secciones dinámicas
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        const elementoSeccion = findElementInCurrentSection(campoId);
        if (elementoSeccion && elementoSeccion !== elemento) {
          elementoSeccion.removeEventListener("change", debouncedAutoComplete);
          elementoSeccion.removeEventListener("input", debouncedAutoComplete);
          elementoSeccion.removeEventListener("blur", debouncedAutoComplete);
          elementoSeccion.addEventListener("change", debouncedAutoComplete);
          elementoSeccion.addEventListener("input", debouncedAutoComplete);
          elementoSeccion.addEventListener("blur", debouncedAutoComplete);
        }
      }, 500);
    });
  });

  // Event listeners especiales para nivel de tensión y apoyo
  const configurarNivelTension = () => {
    const nivelTension = findElementInCurrentSection("nivel_tension");
    if (nivelTension) {
      nivelTension.removeEventListener("change", handleNivelTensionChange);
      nivelTension.addEventListener("change", function() {
        markUserInteraction(); // Marcar interacción
        updateApoyoOptions();
        toggleStructureFields();
        debouncedAutoComplete();
      });
    }
  };
  
  const configurarApoyo = () => {
    // El campo apoyo_nueva ya no existe
  };

  // Configurar inmediatamente
  configurarNivelTension();
  configurarApoyo();
  
  // También configurar después de cambios de sección
  if (window.MutationObserver) {
    const observer = new MutationObserver(() => {
      configurarNivelTension();
      configurarApoyo();
      configurarAutocompletadosGlobales();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Función global para configurar autocompletados en cualquier sección
function configurarAutocompletadosGlobales() {
  
  // Buscar elementos con búsqueda híbrida
  const nombreField = document.getElementById("nombre") || findElementInCurrentSection("nombre");
  const bancoField = document.getElementById("banco_proyecto") || findElementInCurrentSection("banco_proyecto");
  const contratoField = document.getElementById("contrato") || findElementInCurrentSection("contrato");
  const municipioField = document.getElementById("municipio") || findElementInCurrentSection("municipio");

  // Configurar event listeners si existen los elementos
  if (nombreField) {
    // ⚠️ DESHABILITADO - Conflicto con autocompletion-estructuras.js
    // Los listeners de nombre son manejados por el módulo específico de estructuras
    // para evitar duplicación y ejecución automática no deseada
    /*
    // Remover listeners anteriores para evitar duplicados
    nombreField.removeEventListener('input', autoCompleteBanco);
    nombreField.removeEventListener('change', autoCompleteBanco);
    nombreField.removeEventListener('change', actualizarContratos);
    
    // Agregar nuevos listeners
    nombreField.addEventListener('input', autoCompleteBanco);
    nombreField.addEventListener('change', autoCompleteBanco);
    nombreField.addEventListener('change', actualizarContratos);
    */
  }

  if (contratoField) {
    // Remover listeners anteriores
    contratoField.removeEventListener('change', handleContratoChange);
    contratoField.removeEventListener('change', autoCompleteRegional);
    contratoField.removeEventListener('change', actualizarMunicipiosPorContrato);
    
    // Agregar nuevos listeners
    contratoField.addEventListener('change', handleContratoChange);
    contratoField.addEventListener('change', autoCompleteRegional);
    contratoField.addEventListener('change', actualizarMunicipiosPorContrato);
  }

  if (municipioField) {
    // Remover listeners anteriores
    municipioField.removeEventListener('change', autoCompleteDepartamento);
    municipioField.removeEventListener('change', actualizarCircuitos);
    
    // Agregar nuevos listeners
    municipioField.addEventListener('change', autoCompleteDepartamento);
    municipioField.addEventListener('change', actualizarCircuitos);
  }

  // Configurar listeners para campos específicos de estructuras
  configurarListenersEstructuras();
}

// Función auxiliar para manejar cambios en contrato
function handleContratoChange() {
  autoCompleteRegional();
  actualizarMunicipiosPorContrato();
}

// Función para configurar listeners específicos de estructuras
function configurarListenersEstructuras() {
  // Ya no necesitamos configurar campos de estructura individuales
  // El selector UC jerárquico maneja toda la configuración automáticamente
  
  // Los campos individuales ya no existen, solo comentamos para referencia
  // const camposEstructura = [
  //   "material_nueva", "altura_nueva", "poblacion_nueva", "disposicion_nueva",
  //   "tipo_red_nueva", "apoyo_nueva", "peso_nueva", "configuracion_nueva",
  //   "circuito_nueva", "linea_nueva"
  // ];

  return; // Salir temprano ya que no hay campos que configurar
}

// Funciones auxiliares simplificadas - Los campos individuales fueron eliminados
function handleNivelTensionChange() {
  // updateApoyoOptions(); // Campo apoyo_nueva eliminado
  // toggleStructureFields(); // Campos individuales eliminados
  // autoCompleteUC(); // Función simplificada
}

function handleApoyoChange() {
  // toggleStructureFields(); // Campos individuales eliminados
  // autoCompleteUC(); // Función simplificada
}

// Función para inicializar autocompletados manualmente en cualquier sección
function inicializarAutocompletadosEnSeccion(seccionActual = null) {
  // Actualizar currentStep si se proporciona
  if (seccionActual) {
    window.currentStep = seccionActual;
  }
  
  // Configurar listeners globales
  configurarListenersGlobales();
  
  // Configurar autocompletados
  configurarAutocompletadosGlobales();
  
  // Inicializar campos deshabilitados
  initializeDisabledFields();
  
  // Para la sección de estructuras, configurar campos específicos
  const currentSection = window.currentStep || 'estructuras';
  if (currentSection === 'estructuras') {
    updateApoyoOptions();
    toggleStructureFields();
  }
  
}

// Función de diagnóstico para debugging
function diagnosticarAutocompletado() {
  const campos = [
    "material_nueva", "altura_nueva", "poblacion_nueva", "disposicion_nueva",
    "tipo_red_nueva", "apoyo_nueva", "peso_nueva", "configuracion_nueva",
    "circuito_nueva", "linea_nueva", "nivel_tension", "uc", "uc_nueva"
  ];
  
  let encontrados = 0;
  campos.forEach(campoId => {
    const elemento = document.getElementById(campoId);
    if (elemento) encontrados++;
  });
  
  
  // Intentar autocompletado
  autoCompleteUC();
}

// Exponer funciones para uso global
window.findElementInCurrentSection = findElementInCurrentSection;
window.configurarAutocompletadosGlobales = configurarAutocompletadosGlobales;
window.configurarListenersEstructuras = configurarListenersEstructuras;
window.inicializarAutocompletadosEnSeccion = inicializarAutocompletadosEnSeccion;
window.handleContratoChange = handleContratoChange;
window.handleNivelTensionChange = handleNivelTensionChange;
window.handleApoyoChange = handleApoyoChange;
window.diagnosticarAutocompletado = diagnosticarAutocompletado;

// Función mejorada para validar datos reales del usuario
function validarDatosUsuario() {
  const camposEstructura = [
    "material_nueva", "altura_nueva", "poblacion_nueva", "disposicion_nueva",
    "tipo_red_nueva", "apoyo_nueva", "peso_nueva", "configuracion_nueva",
    "circuito_nueva", "linea_nueva"
  ];
  
  let camposConDatos = 0;
  const estadoCampos = {};
  
  camposEstructura.forEach(campoId => {
    const elemento = document.getElementById(campoId) || findElementInCurrentSection(campoId);
    if (elemento && elemento.value && elemento.value.trim() !== '') {
      camposConDatos++;
      estadoCampos[campoId] = elemento.value.trim();
    }
  });
  
  return { camposConDatos, estadoCampos };
}

// Función manual para testing - expuesta globalmente
window.testAutoCompleteUC = function() {
  // Marcar que el usuario ha interactuado
  window.userHasInteracted = true;
  
  const validacion = validarDatosUsuario();
  
  if (validacion.camposConDatos >= 3) {
    autoCompleteUC();
  } else {
  }
};

// Función para forzar el autocompletado independientemente de validaciones
window.forceAutoCompleteUC = function() {
  autoCompleteUC();
};

// Protección adicional para estructura retirada cuando desmantelado está activo
document.addEventListener('DOMContentLoaded', function() {
  // Monitor continuo para proteger estructura retirada
  setInterval(() => {
if (window.SistemaTiposInversion?.estado?.desmanteladoActivo) {
    const estructuraRetirada = document.getElementById("estructura_retirada_campo");
    if (estructuraRetirada && estructuraRetirada.disabled) {
        estructuraRetirada.disabled = false;
        estructuraRetirada.readOnly = false;
        estructuraRetirada.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
        estructuraRetirada.classList.add("bg-yellow-50", "border-yellow-300", "font-semibold");
    }
}
  }, 1000);
});

// Event listener para mantener focus en estructura retirada
document.addEventListener('click', function(e) {
  if (window.SistemaTiposInversion?.estado?.desmanteladoActivo) {
    const estructuraRetirada = document.getElementById("estructura_retirada_campo");
    
    // Si clickean en cualquier lugar y desmantelado está activo
    if (estructuraRetirada) {
      // Forzar que siempre esté habilitado
      if (estructuraRetirada.disabled || estructuraRetirada.readOnly) {
        estructuraRetirada.disabled = false;
        estructuraRetirada.readOnly = false;
      }
      
      // Si clickean fuera del campo estructura retirada y del checkbox desmantelado,
      // mostrar mensaje visual (opcional - no forzar focus para mejor UX)
      if (!estructuraRetirada.contains(e.target) && 
          !e.target.closest('#desmantelado_container')) {
        
        // Destacar visualmente el campo disponible
        estructuraRetirada.style.animation = 'pulse 1s ease-in-out';
        setTimeout(() => {
          if (estructuraRetirada.style) {
            estructuraRetirada.style.animation = '';
          }
        }, 1000);
      }
    }
  }
});

// Prevenir que otros scripts deshabiliten el campo
Object.defineProperty(HTMLInputElement.prototype, 'disabled', {
  set: function(value) {
    if (this.id === 'estructura_retirada_campo' && 
        this.getAttribute('data-keep-enabled') === 'true') {
      // No permitir deshabilitar si tiene el atributo especial
      return;
    }
    // Para otros elementos, comportamiento normal
    this.setAttribute('disabled', value ? '' : null);
  },
  get: function() {
    return this.hasAttribute('disabled');
  }
});

window.validarDatosUsuario = validarDatosUsuario;
