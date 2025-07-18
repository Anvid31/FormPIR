/**
 * DESS - Funcionalidad Principal del Formulario
 * Contiene las funciones centrales de inicialización y manejo del formulario
 */

/**
 * Función principal para configurar datos iniciales del formulario
 */
function setupFormData() {
  // Configurar selects con datos de mappings
  populateSelects();
  
  // Configurar autocompletado de UC
  setupUCAutocomplete();
  
  // Configurar eventos de campos
  setupFormEvents();
  
  console.log("📊 Datos del formulario configurados");
}

/**
 * Función para poblar los selects con datos de mappings
 */
function populateSelects() {
  // Poblar select de municipios
  const municipioSelect = document.getElementById("municipio");
  if (municipioSelect && typeof MUNICIPIO_MAPPING !== 'undefined') {
    Object.keys(MUNICIPIO_MAPPING).forEach(codigo => {
      const option = document.createElement("option");
      option.value = codigo;
      option.textContent = MUNICIPIO_MAPPING[codigo];
      municipioSelect.appendChild(option);
    });
    console.log("🏘️ Municipios cargados");
  }

  // Poblar select de circuitos cuando se seleccione municipio
  if (municipioSelect) {
    municipioSelect.addEventListener("change", function() {
      populateCircuitos(this.value);
    });
  }
}

/**
 * Función para poblar circuitos según el municipio seleccionado
 * @param {string} municipioCodigo - Código del municipio
 */
function populateCircuitos(municipioCodigo) {
  const circuitoSelect = document.getElementById("circuito");
  if (!circuitoSelect || typeof MUNICIPIO_CIRCUITO_MAPPING === 'undefined') {
    return;
  }

  // Limpiar opciones existentes
  circuitoSelect.innerHTML = '<option value="">Seleccione un circuito</option>';

  // Agregar circuitos del municipio seleccionado
  const circuitos = MUNICIPIO_CIRCUITO_MAPPING[municipioCodigo] || [];
  circuitos.forEach(circuito => {
    const option = document.createElement("option");
    option.value = circuito.codigo;
    option.textContent = `${circuito.codigo} - ${circuito.nombre}`;
    circuitoSelect.appendChild(option);
  });

  console.log(`🔌 Circuitos cargados para municipio: ${municipioCodigo}`);
}

/**
 * Función para configurar autocompletado de códigos UC
 */
function setupUCAutocomplete() {
  const ucFields = [
    "uc_codigo",
    "conductor_n1_uc",
    "conductor_n2_uc",
    "conductor_n3_uc",
    "conductor_n4_uc"
  ];

  ucFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      setupUCField(field);
    }
  });

  console.log("🔍 Autocompletado UC configurado");
}

/**
 * Función para configurar un campo UC específico
 * @param {HTMLElement} field - El campo UC
 */
function setupUCField(field) {
  let timeout;
  
  field.addEventListener("input", function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      searchUC(this.value, this);
    }, 300);
  });

  // Crear contenedor de sugerencias si no existe
  if (!field.nextElementSibling?.classList.contains("uc-suggestions")) {
    const suggestionsDiv = document.createElement("div");
    suggestionsDiv.className = "uc-suggestions hidden absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto";
    suggestionsDiv.style.width = field.offsetWidth + "px";
    field.parentNode.style.position = "relative";
    field.parentNode.insertBefore(suggestionsDiv, field.nextSibling);
  }
}

/**
 * Función para buscar códigos UC
 * @param {string} query - Término de búsqueda
 * @param {HTMLElement} field - Campo que activó la búsqueda
 */
function searchUC(query, field) {
  if (query.length < 2) {
    hideSuggestions(field);
    return;
  }

  // Simular búsqueda de UC (aquí iría la lógica real de búsqueda)
  const suggestions = generateUCSuggestions(query);
  showUCSuggestions(suggestions, field);
}

/**
 * Función para generar sugerencias de UC (simulación)
 * @param {string} query - Término de búsqueda
 * @returns {Array} - Array de sugerencias
 */
function generateUCSuggestions(query) {
  // Esta función debería conectarse con el backend real
  const sampleUCs = [
    "UC001 - Transformador Principal",
    "UC002 - Conductor Primario",
    "UC003 - Estructura Torre",
    "UC004 - Acometida Residencial",
    "UC005 - Medidor Trifásico"
  ];

  return sampleUCs.filter(uc => 
    uc.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);
}

/**
 * Función para mostrar sugerencias de UC
 * @param {Array} suggestions - Array de sugerencias
 * @param {HTMLElement} field - Campo relacionado
 */
function showUCSuggestions(suggestions, field) {
  const suggestionsDiv = field.nextElementSibling;
  if (!suggestionsDiv?.classList.contains("uc-suggestions")) {
    return;
  }

  if (suggestions.length === 0) {
    hideSuggestions(field);
    return;
  }

  suggestionsDiv.innerHTML = "";
  suggestions.forEach(suggestion => {
    const item = document.createElement("div");
    item.className = "p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100";
    item.textContent = suggestion;
    
    item.addEventListener("click", () => {
      field.value = suggestion.split(" - ")[0];
      hideSuggestions(field);
      field.focus();
    });

    suggestionsDiv.appendChild(item);
  });

  suggestionsDiv.classList.remove("hidden");
}

/**
 * Función para ocultar sugerencias de UC
 * @param {HTMLElement} field - Campo relacionado
 */
function hideSuggestions(field) {
  const suggestionsDiv = field.nextElementSibling;
  if (suggestionsDiv?.classList.contains("uc-suggestions")) {
    suggestionsDiv.classList.add("hidden");
  }
}

/**
 * Función para configurar eventos generales del formulario
 */
function setupFormEvents() {
  // Formateo automático de UC al perder el foco
  document.querySelectorAll('input[id*="_uc"]').forEach(field => {
    field.addEventListener("blur", function() {
      formatUCField(this);
    });
  });

  // Auto-cálculo de coordenadas finales
  const longitudInicial = document.getElementById("longitud");
  const latitudInicial = document.getElementById("latitud");
  const longitudFinal = document.getElementById("longitud_final");
  const latitudFinal = document.getElementById("latitud_final");

  if (longitudInicial && latitudInicial && longitudFinal && latitudFinal) {
    [longitudInicial, latitudInicial].forEach(field => {
      field.addEventListener("input", () => {
        calculateFinalCoordinates();
      });
    });
  }

  // Configurar cantidad por defecto según tipo de proyecto
  const tipoProyecto = document.getElementById("tipo_proyecto");
  if (tipoProyecto) {
    tipoProyecto.addEventListener("change", function() {
      setDefaultQuantityByType(this.value);
    });
  }

  console.log("🎛️ Eventos del formulario configurados");
}

/**
 * Función para formatear campos UC
 * @param {HTMLElement} field - Campo UC a formatear
 */
function formatUCField(field) {
  let value = field.value.trim().toUpperCase();
  
  // Remover caracteres no permitidos
  value = value.replace(/[^A-Z0-9]/g, "");
  
  // Formatear según patrón UC###
  if (value && !value.startsWith("UC")) {
    if (/^\d/.test(value)) {
      value = "UC" + value;
    }
  }

  field.value = value;
}

/**
 * Función para calcular coordenadas finales automáticamente
 */
function calculateFinalCoordinates() {
  const longInicial = parseFloat(document.getElementById("longitud").value);
  const latInicial = parseFloat(document.getElementById("latitud").value);
  const distancia = parseFloat(document.getElementById("distancia")?.value || 0);

  if (!isNaN(longInicial) && !isNaN(latInicial) && distancia > 0) {
    // Cálculo simple: agregar distancia proporcional
    // En un caso real, esto requeriría cálculos geodésicos más precisos
    const deltaLat = distancia * 0.00001; // Aproximación
    const deltaLong = distancia * 0.00001; // Aproximación

    document.getElementById("longitud_final").value = (longInicial + deltaLong).toFixed(6);
    document.getElementById("latitud_final").value = (latInicial + deltaLat).toFixed(6);
  }
}

/**
 * Función para establecer cantidad por defecto según tipo de proyecto
 * @param {string} tipoProyecto - Tipo de proyecto seleccionado
 */
function setDefaultQuantityByType(tipoProyecto) {
  const cantidadField = document.getElementById("cantidad");
  if (!cantidadField) return;

  // Mapeo de cantidades por defecto
  const defaultQuantities = {
    "expansion": 1,
    "reposicion": 1,
    "mejoramiento": 2,
    "mantenimiento": 1
  };

  const defaultValue = defaultQuantities[tipoProyecto] || 1;
  cantidadField.value = defaultValue;

  console.log(`📊 Cantidad por defecto establecida: ${defaultValue} para ${tipoProyecto}`);
}

/**
 * Función para resetear el formulario
 */
function resetForm() {
  if (confirm("¿Está seguro de que desea limpiar todo el formulario?")) {
    document.getElementById("formPreview").reset();
    
    // Limpiar archivos subidos
    document.querySelectorAll(".file-preview").forEach(preview => {
      preview.innerHTML = "";
    });
    
    // Navegar al primer paso
    if (typeof navigateToStep === 'function') {
      navigateToStep("generales");
    }
    
    console.log("🗑️ Formulario reseteado");
  }
}

/**
 * Función para guardar borrador
 */
function saveDraft() {
  const formData = new FormData(document.getElementById("formPreview"));
  const draftData = {};
  
  for (let [key, value] of formData.entries()) {
    draftData[key] = value;
  }
  
  localStorage.setItem("dess_form_draft", JSON.stringify(draftData));
  
  // Mostrar mensaje de confirmación
  showNotification("Borrador guardado exitosamente", "success");
  
  console.log("💾 Borrador guardado");
}

/**
 * Función para cargar borrador
 */
function loadDraft() {
  const draftData = localStorage.getItem("dess_form_draft");
  if (!draftData) {
    showNotification("No se encontró ningún borrador guardado", "info");
    return;
  }

  try {
    const data = JSON.parse(draftData);
    
    for (let [key, value] of Object.entries(data)) {
      const field = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
      if (field && field.type !== "file") {
        field.value = value;
      }
    }
    
    showNotification("Borrador cargado exitosamente", "success");
    console.log("📂 Borrador cargado");
  } catch (error) {
    showNotification("Error al cargar el borrador", "error");
    console.error("❌ Error al cargar borrador:", error);
  }
}

/**
 * Función para mostrar notificaciones
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, info, warning)
 */
function showNotification(message, type = "info") {
  // Crear elemento de notificación
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${getNotificationClasses(type)}`;
  notification.innerHTML = `
    <div class="flex items-center">
      <div class="flex-shrink-0">
        ${getNotificationIcon(type)}
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium">${message}</p>
      </div>
      <button class="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 items-center justify-center text-current hover:bg-black hover:bg-opacity-10" onclick="this.parentElement.remove()">
        <span class="sr-only">Cerrar</span>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

/**
 * Función para obtener clases CSS según tipo de notificación
 * @param {string} type - Tipo de notificación
 * @returns {string} - Clases CSS
 */
function getNotificationClasses(type) {
  const classes = {
    success: "bg-green-50 border border-green-200 text-green-800",
    error: "bg-red-50 border border-red-200 text-red-800",
    warning: "bg-yellow-50 border border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border border-blue-200 text-blue-800"
  };
  return classes[type] || classes.info;
}

/**
 * Función para obtener icono según tipo de notificación
 * @param {string} type - Tipo de notificación
 * @returns {string} - HTML del icono
 */
function getNotificationIcon(type) {
  const icons = {
    success: '<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>',
    error: '<svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>',
    warning: '<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>',
    info: '<svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>'
  };
  return icons[type] || icons.info;
}

/**
 * Función de inicialización principal
 */
function initializeFormCore() {
  setupFormData();
  
  // Configurar botones de acción
  const resetBtn = document.getElementById("resetFormBtn");
  const saveDraftBtn = document.getElementById("saveDraftBtn");
  const loadDraftBtn = document.getElementById("loadDraftBtn");
  
  if (resetBtn) resetBtn.addEventListener("click", resetForm);
  if (saveDraftBtn) saveDraftBtn.addEventListener("click", saveDraft);
  if (loadDraftBtn) loadDraftBtn.addEventListener("click", loadDraft);
  
  console.log("🚀 Núcleo del formulario inicializado");
}

// Ocultar sugerencias al hacer click fuera
document.addEventListener("click", function(event) {
  if (!event.target.matches('input[id*="_uc"]')) {
    document.querySelectorAll(".uc-suggestions").forEach(suggestions => {
      suggestions.classList.add("hidden");
    });
  }
});

// Exportar funciones para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setupFormData,
    populateSelects,
    populateCircuitos,
    setupUCAutocomplete,
    setupFormEvents,
    resetForm,
    saveDraft,
    loadDraft,
    showNotification,
    initializeFormCore
  };
}
