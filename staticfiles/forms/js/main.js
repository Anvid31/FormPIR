/**
 * DESS - Script Principal del Formulario
 * Inicializa todos los módulos y configura los event listeners
 */

// Variable global para el paso actual
let currentStep = "generales";

document.addEventListener("DOMContentLoaded", function () {
  console.log("=== DESS - Inicializando Sistema de Formularios ===");

  // Verificar que el mapping UC esté disponible
  if (typeof UC_MAPPING === "undefined" || typeof getUCFromStructure === "undefined") {
    console.error("Error: uc-mapping.js no se cargó correctamente");
    alert("Error: No se pudieron cargar los mapeos de UC. Por favor, recargue la página.");
    return;
  }

  // Inicializar fecha máxima (hoy)
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fecha").setAttribute("max", hoy);

  // Inicializar mapeos de datos
  if (typeof initializeDataMappings === "function") {
    initializeDataMappings();
  }

  // Inicializar validaciones en tiempo real
  if (typeof setupRealTimeValidation === "function") {
    setupRealTimeValidation();
  }

  // Inicializar formateo de estructura retirada
  if (typeof formatEstructuraRetirada === "function") {
    formatEstructuraRetirada();
  }

  // Inicializar zonas de drag & drop
  if (typeof initializeFileDropZones === "function") {
    initializeFileDropZones();
  }

  // Configurar event listeners principales
  setupMainEventListeners();

  // Configurar autocompletado de UC
  setupUCAutoComplete();

  // Configurar funcionalidades adicionales
  setupAdditionalFeatures();

  // Inicializar estados del formulario
  initializeFormStates();

  console.log("=== Sistema inicializado correctamente ===");
});

/**
 * Configurar event listeners principales
 */
function setupMainEventListeners() {
  // Event listener para nombre del proyecto
  const nombreSelect = document.getElementById("nombre");
  if (nombreSelect) {
    nombreSelect.addEventListener("change", function () {
      console.log("Evento change en nombre del proyecto:", this.value);
      if (typeof autoCompleteBanco === "function") {
        autoCompleteBanco();
      }
    });
    console.log("Listener agregado para nombre del proyecto");
  } else {
    console.error("No se encontró el elemento con ID 'nombre'");
  }

  // Event listener para tipo de inversión
  const tipoInvSelect = document.getElementById("t_inv");
  if (tipoInvSelect) {
    tipoInvSelect.addEventListener("change", function () {
      console.log("Evento change en tipo de inversión:", this.value);
      handleTipoInversion();
    });
    console.log("Listener agregado para tipo de inversión");
  } else {
    console.error("No se encontró el elemento con ID 't_inv'");
  }

  // Event listener para municipio
  const municipioSelect = document.getElementById("municipio");
  if (municipioSelect) {
    municipioSelect.addEventListener("change", function () {
      console.log("Evento change en municipio:", this.value);
      if (typeof autoCompleteMunicipio === "function") {
        autoCompleteMunicipio();
      }
    });
    console.log("Listener agregado para municipio");
  } else {
    console.error("No se encontró el elemento con ID 'municipio'");
  }

  // Event listener para alimentador
  const alimentadorSelect = document.getElementById("alimentador");
  if (alimentadorSelect) {
    alimentadorSelect.addEventListener("change", function () {
      console.log("Evento change en alimentador:", this.value);
      // Agregar indicador visual cuando se seleccione manualmente
      if (this.value) {
        this.classList.add("bg-blue-50", "border-blue-300");
      } else {
        this.classList.remove("bg-blue-50", "border-blue-300");
      }
    });
    console.log("Listener agregado para alimentador");
  } else {
    console.error("No se encontró el elemento con ID 'alimentador'");
  }

  // Event listener para contrato
  const contratoSelect = document.getElementById("contrato");
  if (contratoSelect) {
    contratoSelect.addEventListener("change", function () {
      console.log("Evento change en contrato:", this.value);
      // Obtener datos del contrato seleccionado
      const selectedOption = this.options[this.selectedIndex];
      if (selectedOption && selectedOption.dataset.contratista) {
        console.log("Contrato seleccionado:", {
          contratista: selectedOption.dataset.contratista,
          regional: selectedOption.dataset.regional,
        });
      }

      // Agregar indicador visual cuando se seleccione
      if (this.value) {
        this.classList.add("bg-blue-50", "border-blue-300");
      } else {
        this.classList.remove("bg-blue-50", "border-blue-300");
      }

      // Filtrar municipios según la regional del contrato
      if (typeof actualizarMunicipiosPorContrato === "function") {
        actualizarMunicipiosPorContrato();
      }
    });
    console.log("Listener agregado para contrato");
  } else {
    console.error("No se encontró el elemento con ID 'contrato'");
  }
}

/**
 * Configurar autocompletado de UC
 */
function setupUCAutoComplete() {
  const ucFields = [
    "material_nueva",
    "altura_nueva", 
    "poblacion_nueva",
    "disposicion_nueva",
    "tipo_red_nueva"
  ];

  ucFields.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("change", function () {
        console.log(`Campo ${id} cambió a:`, this.value);
        if (typeof autoCompleteUC === "function") {
          autoCompleteUC();
        }
      });
      console.log(`Listener agregado a ${id}`);
    } else {
      console.error(`No se encontró el elemento con ID: ${id}`);
    }
  });

  // Llenar el select de UC con el mapping completo
  const ucSelect = document.getElementById("uc_codigo");
  if (ucSelect && typeof UC_MAPPING !== "undefined") {
    for (const [codigo, descripcion] of Object.entries(UC_MAPPING)) {
      const option = document.createElement("option");
      option.value = codigo;
      option.textContent = codigo;
      ucSelect.appendChild(option);
    }
    console.log("Select UC poblado con", Object.keys(UC_MAPPING).length, "opciones");
  }
}

/**
 * Manejar el campo de estructura retirada según tipo de inversión
 */
function handleTipoInversion() {
  const tipoInversion = document.getElementById("t_inv").value;
  const estructuraRetirada = document.getElementById("estructura_retirada_campo");
  const longitud = document.getElementById("numero_x");
  const latitud = document.getElementById("numero_y");
  const cantidadField = document.getElementById("cantidad");
  const numeroConductoresField = document.getElementById("numero_conductores");

  if (!estructuraRetirada) return;

  // Habilitar si es tipo I (1) o III (3)
  if (tipoInversion === "I" || tipoInversion === "III") {
    estructuraRetirada.disabled = false;
    if (longitud) longitud.disabled = true;
    if (latitud) latitud.disabled = true;
    estructuraRetirada.classList.remove("bg-gray-100", "cursor-not-allowed");
    estructuraRetirada.classList.add("bg-white");
    console.log("Estructura retirada habilitada para tipo de inversión:", tipoInversion);
  } else {
    // Deshabilitar si es tipo II (2) o IV (4) o vacío
    estructuraRetirada.disabled = true;
    if (longitud) longitud.disabled = false;
    if (latitud) latitud.disabled = false;
    estructuraRetirada.value = ""; // Limpiar el valor
    estructuraRetirada.classList.remove("bg-white");
    estructuraRetirada.classList.add("bg-gray-100", "cursor-not-allowed");
    console.log("Estructura retirada deshabilitada para tipo de inversión:", tipoInversion);
  }

  // Gestionar campos cantidad y número de conductores según el paso actual
  if (currentStep === "estructuras") {
    if (cantidadField) {
      cantidadField.readOnly = true;
      cantidadField.classList.add("bg-gray-100", "cursor-not-allowed");
    }
    if (numeroConductoresField) {
      numeroConductoresField.readOnly = true;
      numeroConductoresField.classList.add("bg-gray-100", "cursor-not-allowed");
    }
  } else {
    if (cantidadField) {
      cantidadField.readOnly = false;
      cantidadField.classList.remove("bg-gray-100", "cursor-not-allowed");
    }
    if (numeroConductoresField) {
      numeroConductoresField.readOnly = false;
      numeroConductoresField.classList.remove("bg-gray-100", "cursor-not-allowed");
    }
  }

  // Actualizar funcionalidades adicionales si existen
  if (window.toggleMontajeIntegralVisibility) {
    window.toggleMontajeIntegralVisibility();
  }

  if (window.toggleDesmanteladoVisibility) {
    window.toggleDesmanteladoVisibility();
  }
}

/**
 * Configurar funcionalidades adicionales
 */
function setupAdditionalFeatures() {
  // Configurar sincronización de campos entre secciones
  if (typeof setupFieldSynchronization === "function") {
    setupFieldSynchronization();
  }

  // Configurar filtrado de altura por nivel de tensión
  if (typeof setupTensionHeightFiltering === "function") {
    setupTensionHeightFiltering();
  }

  // Configurar funcionalidad de Montaje Integral
  if (typeof setupMontajeIntegral === "function") {
    setupMontajeIntegral();
  }

  // Configurar funcionalidad de Desmantelado
  if (typeof setupDesmantelado === "function") {
    setupDesmantelado();
  }
}

/**
 * Inicializar estados del formulario
 */
function initializeFormStates() {
  // Inicializar el estado del campo estructura retirada
  handleTipoInversion();

  // Probar elementos del formulario
  testFormElements();

  // Inicializar contratos si ya hay proyecto seleccionado
  const nombreEl = document.getElementById("nombre");
  if (nombreEl && nombreEl.value && typeof actualizarContratos === "function") {
    actualizarContratos();
  }

  // Inicializar municipios filtrados si ya hay contrato seleccionado
  const contratoEl = document.getElementById("contrato");
  if (contratoEl && contratoEl.value && typeof actualizarMunicipiosPorContrato === "function") {
    actualizarMunicipiosPorContrato();
  }

  // Inicializar circuitos si ya hay municipio seleccionado
  const municipioEl = document.getElementById("municipio");
  if (municipioEl && municipioEl.value && typeof actualizarCircuitos === "function") {
    actualizarCircuitos();
  }
}

/**
 * Probar elementos del formulario
 */
function testFormElements() {
  console.log("=== Probando elementos del formulario ===");

  const elementos = [
    "nombre", "banco_proyecto", "contrato", "t_inv", 
    "estructura_retirada_campo", "municipio", "departamento", 
    "regional", "alimentador"
  ];

  elementos.forEach(id => {
    const el = document.getElementById(id);
    console.log(`- ${id}:`, el ? "✓" : "✗");
  });
}

/**
 * Función para obtener CSRF token
 */
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Exponer funciones globalmente si es necesario
window.navigateToStep = function(step) {
  currentStep = step;
  console.log("Navegando al paso:", step);
  // Aquí se implementaría la lógica de navegación
};

window.validateCoordinate = validateCoordinate;
window.getCookie = getCookie;
