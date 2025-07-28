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
  console.log("⚠️ autoCompleteUC() llamado - Los campos individuales fueron eliminados");
  console.log("✅ El selector UC jerárquico maneja automáticamente la generación de códigos UC");
  
  // Los campos individuales ya no existen:
  // - material_nueva, altura_nueva, poblacion_nueva, disposicion_nueva
  // - tipo_red_nueva, apoyo_nueva, peso_nueva, configuracion_nueva
  // - circuito_nueva, linea_nueva
  
  // Solo verificar si existe el campo UC para log
  const ucField = findElementInCurrentSection("uc") || findElementInCurrentSection("uc_nueva");
  if (ucField) {
    console.log(`📍 Campo UC encontrado: ${ucField.id} con valor: ${ucField.value}`);
  }
  
  return; // Salir temprano - el selector jerárquico maneja todo
}

// Función simplificada - Los campos individuales fueron eliminados
function toggleStructureFields() {
  console.log("⚠️ toggleStructureFields() llamado - Campos individuales eliminados");
  console.log("✅ El selector UC jerárquico maneja automáticamente todas las opciones");
  
  // Los grupos de campos individuales ya no existen:
  // - peso_group, configuracion_group, circuito_group, linea_group
  // - poblacion_group, tipo_red_group
  // - Campos: apoyo_nueva, material_nueva, altura_nueva, etc.
  
  return; // Salir temprano - el selector jerárquico maneja todo
}

// Función para mostrar/ocultar campos SIN ejecutar autocompletado automático - SIMPLIFICADA
function toggleStructureFieldsWithoutAutoComplete() {
  console.log("⚠️ toggleStructureFieldsWithoutAutoComplete() llamado - Campos individuales eliminados");
  console.log("✅ El selector UC jerárquico maneja automáticamente todas las opciones");
  
  // Los campos individuales ya no existen, no hay nada que ocultar/mostrar
  return; // Salir temprano - el selector jerárquico maneja todo
}

// Función simplificada - Los campos individuales de apoyo fueron eliminados
function updateApoyoOptions(allowedOptions = null) {
  console.log("⚠️ updateApoyoOptions() llamado - Campo apoyo_nueva eliminado");
  console.log("✅ El selector UC jerárquico maneja automáticamente las opciones de apoyo");
  
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
    console.log("No se encontraron elementos nombre o contrato");
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
    alimentadorSelect.disabled = true;
    alimentadorSelect.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
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
    console.log("No se encontraron elementos nombre o banco_proyecto");
    return;
  }

  const nombreProyecto = nombreField.value;

  if (nombreProyecto && typeof window.PROYECTO_COMPLETO_MAPPING !== 'undefined' && window.PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
    const proyectoData = window.PROYECTO_COMPLETO_MAPPING[nombreProyecto];
    const banco = proyectoData.banco;
    
    bancoProyecto.value = banco;
    bancoProyecto.disabled = true;
    bancoProyecto.classList.add("bg-green-50", "border-green-300", "text-gray-700");
    
    console.log("Banco autocompletado:", banco);
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

  console.log("AutoCompleteRegional - Contrato seleccionado:", contratoSeleccionado);

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
      console.log(`Regional autocompletada para contrato ${contratoSeleccionado}:`, regionalDelContrato);
    } else {
      // Limpiar y deshabilitar regional si no se encuentra
      regionalInput.value = "";
      regionalInput.disabled = true;
      regionalInput.classList.remove("bg-green-50", "border-green-300");
      regionalInput.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
      console.log("No se encontró regional para contrato:", contratoSeleccionado);
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

  console.log(
    "ActualizarMunicipiosPorContrato - Contrato seleccionado:",
    contratoSeleccionado
  );

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

    console.log("Regional del contrato:", regionalDelContrato);

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

        console.log(
          `Municipios filtrados para la regional ${regionalDelContrato}:`,
          municipiosFiltrados.length,
          "opciones disponibles"
        );
      } else {
        // No hay municipios para esta regional
        const option = document.createElement("option");
        option.value = "";
        option.textContent = `No hay municipios disponibles para la regional ${regionalDelContrato}`;
        option.disabled = true;
        municipioSelect.appendChild(option);

        municipioSelect.classList.add("bg-red-50", "border-red-300");
        console.log(
          `No se encontraron municipios para la regional ${regionalDelContrato}`
        );
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

      console.log(
        "Mostrando todos los municipios (sin filtro de regional)"
      );
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

    console.log(
      "Mostrando todos los municipios (contrato 'Por definir' o no seleccionado)"
    );
  }

  // Limpiar selects dependientes
  const alimentadorSelect = findElementInCurrentSection("alimentador");
  if (alimentadorSelect) {
    alimentadorSelect.innerHTML = '<option value="">Seleccionar alimentador</option>';
    alimentadorSelect.classList.remove("bg-yellow-50", "border-yellow-300");
  }
}

// Función para actualizar circuitos según municipio seleccionado
function actualizarCircuitos() {
  const municipioField = findElementInCurrentSection("municipio");
  const alimentadorSelect = findElementInCurrentSection("alimentador");
  
  if (!municipioField || !alimentadorSelect) return;
  
  const municipioSeleccionado = municipioField.value;

  console.log(
    "ActualizarCircuitos - Municipio seleccionado:",
    municipioSeleccionado
  );

  // Limpiar opciones existentes (excepto la primera)
  alimentadorSelect.innerHTML = '<option value="">Seleccionar</option>';

  if (
    municipioSeleccionado &&
    typeof MUNICIPIO_CIRCUITO_MAPPING !== 'undefined' &&
    MUNICIPIO_CIRCUITO_MAPPING[municipioSeleccionado]
  ) {
    const circuitos = MUNICIPIO_CIRCUITO_MAPPING[municipioSeleccionado];

    // Habilitar el select y agregar opciones de circuitos ordenadas
    alimentadorSelect.disabled = false;
    alimentadorSelect.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");
    
    circuitos.sort().forEach((circuito) => {
      const option = document.createElement("option");
      option.value = circuito;
      option.textContent = circuito;
      alimentadorSelect.appendChild(option);
    });

    // Agregar indicador visual
    alimentadorSelect.classList.add("bg-green-50", "border-green-300");

    console.log(
      `Circuitos actualizados para ${municipioSeleccionado}:`,
      circuitos.length,
      "opciones disponibles"
    );
  } else {
    // Deshabilitar y limpiar si no hay circuitos
    alimentadorSelect.disabled = true;
    alimentadorSelect.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
    alimentadorSelect.classList.remove("bg-green-50", "border-green-300");

    if (municipioSeleccionado) {
      console.log(
        "No se encontraron circuitos para municipio:",
        municipioSeleccionado
      );

      // Agregar mensaje informativo
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No hay circuitos disponibles";
      option.disabled = true;
      alimentadorSelect.appendChild(option);
    } else {
      // Si no hay municipio seleccionado, deshabilitar completamente
      console.log("Sin municipio seleccionado - Circuitos deshabilitados");
    }
  }
}

// Función para autocompletar departamento y regional basado en municipio
function autoCompleteDepartamento() {
  const municipioField = findElementInCurrentSection("municipio");
  const departamentoInput = findElementInCurrentSection("departamento");
  const regionalInput = findElementInCurrentSection("regional");
  
  if (!municipioField || !departamentoInput || !regionalInput) return;
  
  const municipioSeleccionado = municipioField.value;

  console.log("AutoCompleteDepartamento - Municipio seleccionado:", municipioSeleccionado);

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

    console.log(
      "Departamento autocompletado:",
      municipioSeleccionado,
      "->",
      datos.departamento
    );
    console.log(
      "Regional autocompletada:",
      municipioSeleccionado,
      "->",
      datos.regional
    );
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

    if (municipioSeleccionado) {
      console.log("No se encontró mapeo para municipio:", municipioSeleccionado);
    }
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
  console.log("⚠️ actualizarAlturasPorTension() llamado - Campo altura_nueva eliminado");
  console.log("✅ El selector UC jerárquico maneja automáticamente las alturas");
  
  // El campo altura_nueva ya no existe
  return; // Salir temprano - el selector jerárquico maneja todo
}

// =============================================================================
// FUNCIONES DE CONTROL DE FORMULARIO
// =============================================================================

// Estados globales
let montajeIntegralActivo = false;
let desmanteladoActivo = false;

/**
 * Alterna el estado del modo Montaje Integral
 * Para tipos de inversión II y IV - deshabilita solo información de estructuras
 * Recibe prefijo de sección opcional para formularios modulares
 */
function toggleMontajeIntegral(seccionPrefix = '') {
  const checkboxId = seccionPrefix ? `${seccionPrefix}_montaje_integral_checkbox` : "montaje_integral_checkbox";
  const checkbox = document.getElementById(checkboxId);
  montajeIntegralActivo = checkbox ? checkbox.checked : false;
  
  if (montajeIntegralActivo) {
    // Deshabilitar solo información de estructuras
    deshabilitarInformacionEstructuras(true, seccionPrefix);
    
    console.log("Modo Montaje Integral activado - Información de estructuras deshabilitada");
  } else {
    // Habilitar información de estructuras si no está en modo desmantelado
    if (!desmanteladoActivo) {
      deshabilitarInformacionEstructuras(false, seccionPrefix);
    }
    
    console.log("Modo Montaje Integral desactivado - Información de estructuras habilitada");
  }
}

/**
 * Toggle Desmantelado - Deshabilita TODAS las secciones excepto estructura retirada
 * COMENTADO - Esta función está duplicada en tipos-inversion.js y causa conflictos
 */
/*
function toggleDesmantelado() {
  const checkbox = document.getElementById("desmantelado_checkbox");
  desmanteladoActivo = checkbox ? checkbox.checked : false;
  
  if (desmanteladoActivo) {
    console.log("🚨 DESMANTELADO ACTIVADO - Iniciando deshabilitación por secciones");
    
    // Deshabilitar secciones específicas
    deshabilitarSeccionInformacionProyecto(true);
    deshabilitarSeccionDocumentosArchivos(true);
    deshabilitarSeccionInformacionTecnica(true);
    deshabilitarSeccionInformacionEstructuras(true);
    
    // FORZAR que estos campos SIEMPRE estén habilitados
    setTimeout(() => {
      forzarCamposEsencialesHabilitados();
    }, 200); // Dar tiempo a que se ejecuten las otras funciones primero
    
    // Activar monitor continuo
    activarMonitorCamposEsenciales();
    
    // Mostrar mensaje de estado
    const mensaje = document.getElementById('desmantelado-mensaje');
    if (mensaje) {
      mensaje.classList.remove('hidden');
    }
    
    console.log("🚨 Desmantelado COMPLETADO - Secciones deshabilitadas excepto campos específicos");
    
  } else {
    console.log("✅ DESMANTELADO DESACTIVADO - Habilitando todas las secciones");
    
    // Desactivar monitor
    desactivarMonitorCamposEsenciales();
    
    // Habilitar todas las secciones
    deshabilitarSeccionInformacionProyecto(false);
    deshabilitarSeccionDocumentosArchivos(false);
    deshabilitarSeccionInformacionTecnica(false);
    deshabilitarSeccionInformacionEstructuras(false);
    
    // Quitar estilos especiales de estructura retirada
    const estructuraRetirada = document.getElementById("estructura_retirada_campo");
    if (estructuraRetirada) {
      estructuraRetirada.classList.remove("bg-yellow-50", "border-yellow-300", "font-semibold", "ring-2", "ring-yellow-400");
      estructuraRetirada.removeAttribute('data-keep-enabled');
    }
    
    // Ocultar mensaje de estado
    const mensaje = document.getElementById('desmantelado-mensaje');
    if (mensaje) {
      mensaje.classList.add('hidden');
    }
    
    console.log("✅ Desmantelado desactivado - Todas las secciones habilitadas");
  }
}
*/

/**
 * Función para forzar que los campos esenciales estén siempre habilitados
 */
function forzarCamposEsencialesHabilitados() {
  // MANTENER habilitado el checkbox de desmantelado
  const desmanteladoCheckbox = document.getElementById("desmantelado_checkbox");
  if (desmanteladoCheckbox) {
    desmanteladoCheckbox.disabled = false;
    desmanteladoCheckbox.readOnly = false;
    desmanteladoCheckbox.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
    console.log("✅ Checkbox desmantelado FORZADO a habilitado");
  }
  
  // MANTENER habilitado SOLO estructura retirada
  const estructuraRetirada = document.getElementById("estructura_retirada_campo");
  if (estructuraRetirada) {
    estructuraRetirada.disabled = false;
    estructuraRetirada.readOnly = false;
    estructuraRetirada.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
    estructuraRetirada.classList.add("bg-yellow-50", "border-yellow-300", "font-semibold", "ring-2", "ring-yellow-400");
    
    // Agregar atributo especial para identificarlo
    estructuraRetirada.setAttribute('data-keep-enabled', 'true');
    console.log("✅ Campo estructura retirada FORZADO a habilitado");
    
    // Forzar focus
    setTimeout(() => {
      estructuraRetirada.focus();
      estructuraRetirada.select();
    }, 100);
  }
}

// Variable para el monitor
let monitorInterval = null;

/**
 * Activar monitor continuo para campos esenciales
 */
function activarMonitorCamposEsenciales() {
  if (monitorInterval) return; // Ya está activo
  
  monitorInterval = setInterval(() => {
    if (desmanteladoActivo) {
      forzarCamposEsencialesHabilitados();
    }
  }, 1000); // Revisar cada segundo
  
  console.log("🔍 Monitor de campos esenciales ACTIVADO");
}

/**
 * Desactivar monitor continuo
 */
function desactivarMonitorCamposEsenciales() {
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
    console.log("🔍 Monitor de campos esenciales DESACTIVADO");
  }
}

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
  
  console.log(`📋 Información del Proyecto: ${deshabilitar ? 'DESHABILITADA' : 'HABILITADA'}`);
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
  
  console.log(`📁 Documentos y Archivos: ${deshabilitar ? 'DESHABILITADA' : 'HABILITADA'}`);
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
  
  console.log(`⚙️ Información Técnica: ${deshabilitar ? 'DESHABILITADA (excepto estructura retirada)' : 'HABILITADA'}`);
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
  console.log(`🏗️ Encontrados ${campos.length} campos en Información de Estructuras`);
  
  campos.forEach(campo => {
    // NO deshabilitar estructura retirada (aunque esté en esta sección)
    if (campo.id === 'estructura_retirada_campo') {
      console.log('✅ Manteniendo estructura_retirada_campo habilitado');
      return;
    }
    
    // NO deshabilitar el checkbox de desmantelado (aunque esté en esta sección)
    if (campo.id === 'desmantelado_checkbox') {
      console.log('✅ Manteniendo desmantelado_checkbox habilitado');
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
    
    console.log(`${deshabilitar ? '🔒' : '🔓'} Campo ${campo.id || campo.name || campo.className || 'sin-id'}`);
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
  
  console.log(`🏗️ Información de Estructuras: ${deshabilitar ? 'DESHABILITADA COMPLETAMENTE' : 'HABILITADA'}`);
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
  
  console.log(`Coordenadas ${deshabilitar ? 'deshabilitadas' : 'habilitadas'} ${seccionPrefix ? 'para sección ' + seccionPrefix : ''}`);
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
    
    console.log(`Información de estructuras ${deshabilitar ? 'deshabilitada' : 'habilitada'} ${seccionPrefix ? 'para sección ' + seccionPrefix : ''}`);
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
    
    console.log(`Información técnica ${deshabilitar ? 'deshabilitada' : 'habilitada'} ${seccionPrefix ? 'para sección ' + seccionPrefix : ''}`);
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
    
    console.log(`Formulario UC ${deshabilitar ? 'deshabilitado' : 'habilitado'}`);
  }
}

/**
 * Mostrar/ocultar botón Montaje Integral según tipo de inversión
 * Solo aparece para tipos II y IV y gestiona coordenadas
 * Recibe prefijo de sección opcional para formularios modulares
 */
function mostrarOcultarMontajeIntegral(seccionPrefix = '') {
  const tipoInversionId = seccionPrefix ? `${seccionPrefix}_t_inv` : "t_inv";
  const containerId = seccionPrefix ? `${seccionPrefix}_montaje_integral_container` : "montaje_integral_container";
  const helpTextId = seccionPrefix ? `${seccionPrefix}_montaje_integral_help` : "montaje_integral_help";
  const estructuraRetiradaId = seccionPrefix ? `${seccionPrefix}_estructura_retirada_campo` : "estructura_retirada_campo";
  
  const tipoInversion = document.getElementById(tipoInversionId);
  const container = document.getElementById(containerId);
  const helpText = document.getElementById(helpTextId);
  const estructuraRetiradaCampo = document.getElementById(estructuraRetiradaId);
  
  if (tipoInversion && container) {
    const valor = tipoInversion.value;
    
    if (valor === "II" || valor === "IV") {
      // Tipos II y IV: Mostrar Montaje Integral, habilitar coordenadas, deshabilitar estructura retirada
      container.style.display = "flex";
      if (helpText) helpText.style.display = "block";
      habilitarDeshabilitarCoordenadas(false, seccionPrefix); // Habilitar coordenadas
      
      // Deshabilitar estructura retirada
      if (estructuraRetiradaCampo) {
        estructuraRetiradaCampo.disabled = true;
        estructuraRetiradaCampo.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
        estructuraRetiradaCampo.value = ""; // Limpiar el campo
      }
      
      console.log(`Tipo de inversión ${valor} - Mostrando Montaje Integral, coordenadas habilitadas, estructura retirada deshabilitada ${seccionPrefix ? 'para sección ' + seccionPrefix : ''}`);
    } else {
      // Otros tipos: Ocultar Montaje Integral
      container.style.display = "none";
      if (helpText) helpText.style.display = "none";
      
      // Habilitar estructura retirada
      if (estructuraRetiradaCampo) {
        estructuraRetiradaCampo.disabled = false;
        estructuraRetiradaCampo.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");
      }
      
      // Si se oculta, desactivar el modo si estaba activo
      if (montajeIntegralActivo) {
        const checkboxId = seccionPrefix ? `${seccionPrefix}_montaje_integral_checkbox` : "montaje_integral_checkbox";
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) checkbox.checked = false;
        toggleMontajeIntegral(seccionPrefix);
      }
      console.log(`Tipo de inversión ${valor} - Ocultando Montaje Integral, estructura retirada habilitada ${seccionPrefix ? 'para sección ' + seccionPrefix : ''}`);
    }
  }
}

/**
 * Mostrar/ocultar botón Desmantelado según tipo de inversión
 * Solo aparece para tipos I y III y gestiona coordenadas
 * Recibe prefijo de sección opcional para formularios modulares
 * COMENTADO - Esta función está duplicada en tipos-inversion.js y causa conflictos
 */
/*
function mostrarOcultarDesmantelado(seccionPrefix = '') {
  const tipoInversionId = seccionPrefix ? `${seccionPrefix}_t_inv` : "t_inv";
  const containerId = seccionPrefix ? `${seccionPrefix}_desmantelado_container` : "desmantelado_container";
  const helpTextId = seccionPrefix ? `${seccionPrefix}_desmantelado_help` : "desmantelado_help";
  const estructuraRetiradaId = seccionPrefix ? `${seccionPrefix}_estructura_retirada_campo` : "estructura_retirada_campo";
  
  const tipoInversion = document.getElementById(tipoInversionId);
  const container = document.getElementById(containerId);
  const helpText = document.getElementById(helpTextId);
  const estructuraRetiradaCampo = document.getElementById(estructuraRetiradaId);
  
  if (tipoInversion && container) {
    const valor = tipoInversion.value;
    
    if (valor === "I" || valor === "III") {
      // Tipos I y III: Mostrar Desmantelado, deshabilitar coordenadas, habilitar estructura retirada
      container.style.display = "flex";
      if (helpText) helpText.style.display = "block";
      habilitarDeshabilitarCoordenadas(true, seccionPrefix); // Deshabilitar coordenadas
      
      // Habilitar estructura retirada
      if (estructuraRetiradaCampo) {
        estructuraRetiradaCampo.disabled = false;
        estructuraRetiradaCampo.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");
      }
      
      console.log(`Tipo de inversión ${valor} - Mostrando Desmantelado, coordenadas deshabilitadas, estructura retirada habilitada ${seccionPrefix ? 'para sección ' + seccionPrefix : ''}`);
    } else {
      // Otros tipos: Ocultar Desmantelado
      container.style.display = "none";
      if (helpText) helpText.style.display = "none";
      habilitarDeshabilitarCoordenadas(false, seccionPrefix); // Habilitar coordenadas
      
      // Si se oculta, desactivar el modo si estaba activo
      if (desmanteladoActivo) {
        const checkboxId = seccionPrefix ? `${seccionPrefix}_desmantelado_checkbox` : "desmantelado_checkbox";
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) checkbox.checked = false;
        toggleDesmantelado(seccionPrefix);
      }
      console.log(`Tipo de inversión ${valor} - Ocultando Desmantelado, coordenadas habilitadas ${seccionPrefix ? 'para sección ' + seccionPrefix : ''}`);
    }
  }
}
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
window.toggleMontajeIntegral = toggleMontajeIntegral;
// window.toggleDesmantelado = toggleDesmantelado; // COMENTADO - Función conflictiva
window.mostrarOcultarMontajeIntegral = mostrarOcultarMontajeIntegral;
// window.mostrarOcultarDesmantelado = mostrarOcultarDesmantelado; // COMENTADO - Función conflictiva
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
      console.log("🚀 Ejecutando autoComplete UC con debounce...");
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
      
      console.log(`✅ Event listeners (change+input+blur) agregados para ${campoId} (global)`);
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
          console.log(`✅ Event listeners dinámicos agregados para ${campoId} (sección)`);
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
        console.log("🔧 Nivel de tensión cambiado:", this.value);
        updateApoyoOptions();
        toggleStructureFields();
        debouncedAutoComplete();
      });
      console.log("✅ Event listener para nivel_tension configurado");
    }
  };
  
  const configurarApoyo = () => {
    console.log("⚠️ configurarApoyo() llamado - Campo apoyo_nueva eliminado");
    console.log("✅ El selector UC jerárquico maneja automáticamente el apoyo");
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
  console.log("Configurando autocompletados globales...");
  
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
    console.log("⚠️ Listeners de campo nombre delegados a autocompletion-estructuras.js");
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
    console.log("Event listeners configurados para campo contrato");
  }

  if (municipioField) {
    // Remover listeners anteriores
    municipioField.removeEventListener('change', autoCompleteDepartamento);
    municipioField.removeEventListener('change', actualizarCircuitos);
    
    // Agregar nuevos listeners
    municipioField.addEventListener('change', autoCompleteDepartamento);
    municipioField.addEventListener('change', actualizarCircuitos);
    console.log("Event listeners configurados para campo municipio");
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
  console.log("⚠️ Campos de estructura eliminados - usando selector UC jerárquico");
  
  // Los campos individuales ya no existen, solo comentamos para referencia
  // const camposEstructura = [
  //   "material_nueva", "altura_nueva", "poblacion_nueva", "disposicion_nueva",
  //   "tipo_red_nueva", "apoyo_nueva", "peso_nueva", "configuracion_nueva",
  //   "circuito_nueva", "linea_nueva"
  // ];

  console.log("✅ Configuración de listeners para estructura completada (selector UC jerárquico activo)");
  return; // Salir temprano ya que no hay campos que configurar
}

// Funciones auxiliares simplificadas - Los campos individuales fueron eliminados
function handleNivelTensionChange() {
  console.log("⚠️ handleNivelTensionChange() llamado - Campos eliminados");
  // updateApoyoOptions(); // Campo apoyo_nueva eliminado
  // toggleStructureFields(); // Campos individuales eliminados
  // autoCompleteUC(); // Función simplificada
}

function handleApoyoChange() {
  console.log("⚠️ handleApoyoChange() llamado - Campo apoyo_nueva eliminado");
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
  
  console.log("Autocompletados inicializados para sección:", currentSection);
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
  
  console.log(`� Diagnóstico: ${encontrados}/${campos.length} campos encontrados`);
  
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
  
  console.log(`📊 Validación de datos del usuario: ${camposConDatos} campos con datos`, estadoCampos);
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
    console.log("⚠️ Insuficientes datos. Completa al menos 3 campos básicos (apoyo, material, altura)");
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
    if (desmanteladoActivo) {
      const estructuraRetirada = document.getElementById("estructura_retirada_campo");
      if (estructuraRetirada && estructuraRetirada.disabled) {
        estructuraRetirada.disabled = false;
        estructuraRetirada.readOnly = false;
        estructuraRetirada.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed", "opacity-50");
        estructuraRetirada.classList.add("bg-yellow-50", "border-yellow-300", "font-semibold");
        console.log('🔧 Re-habilitando estructura retirada automáticamente');
      }
    }
  }, 1000);
});

// Event listener para mantener focus en estructura retirada
document.addEventListener('click', function(e) {
  if (desmanteladoActivo) {
    const estructuraRetirada = document.getElementById("estructura_retirada_campo");
    
    // Si clickean en cualquier lugar y desmantelado está activo
    if (estructuraRetirada) {
      // Forzar que siempre esté habilitado
      if (estructuraRetirada.disabled || estructuraRetirada.readOnly) {
        estructuraRetirada.disabled = false;
        estructuraRetirada.readOnly = false;
        console.log('🔧 Re-habilitando estructura retirada por click');
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
