/**
 * DESS - Navegación entre Pasos del Formulario
 * Controla la navegación y visualización de diferentes secciones
 */

// Variable global para el paso actual
let currentStep = "generales";

const steps = ["generales", "estructuras", "conductores", "documentos"];

/**
 * Función para navegar a un paso específico
 * @param {string} step - El paso al que navegar
 */
function navigateToStep(step) {
  if (!steps.includes(step)) {
    console.error("❌ Paso no válido:", step);
    return;
  }

  currentStep = step;
  console.log("🧭 Navegando al paso:", step);

  // Actualizar navbar visual
  updateNavbarState();
  
  // Mostrar contenido del paso
  showStepContent(step);
  
  // Actualizar campos específicos del paso
  updateFieldsForStep(step);
}

/**
 * Función para actualizar el estado visual del navbar
 */
function updateNavbarState() {
  // Actualizar círculos de navegación
  document.querySelectorAll(".nav-item").forEach((item) => {
    const step = item.getAttribute("data-step");
    const circle = item.querySelector(".nav-circle");
    const label = item.querySelector(".nav-label");
    
    if (step === currentStep) {
      // Paso actual - activo
      circle?.classList.remove("bg-gray-300", "bg-green-500");
      circle?.classList.add("bg-blue-500", "text-white");
      label?.classList.add("text-blue-600", "font-semibold");
    } else if (steps.indexOf(step) < steps.indexOf(currentStep)) {
      // Paso completado
      circle?.classList.remove("bg-gray-300", "bg-blue-500");
      circle?.classList.add("bg-green-500", "text-white");
      label?.classList.remove("text-blue-600", "font-semibold");
      label?.classList.add("text-green-600");
    } else {
      // Paso pendiente
      circle?.classList.remove("bg-blue-500", "bg-green-500", "text-white");
      circle?.classList.add("bg-gray-300");
      label?.classList.remove("text-blue-600", "text-green-600", "font-semibold");
    }
  });

  // Actualizar líneas de progreso
  document.querySelectorAll(".progress-line").forEach((line, index) => {
    if (index < steps.indexOf(currentStep)) {
      line.classList.remove("bg-gray-300");
      line.classList.add("bg-green-500");
    } else {
      line.classList.remove("bg-green-500");
      line.classList.add("bg-gray-300");
    }
  });
}

/**
 * Función para obtener iconos según el estado del paso
 * @param {string} step - El paso
 * @param {string} state - El estado (active, completed, pending)
 * @returns {string} - Clases del icono
 */
function getStepIcon(step, state) {
  const icons = {
    generales: "fas fa-info-circle",
    estructuras: "fas fa-building",
    conductores: "fas fa-bolt",
    documentos: "fas fa-file-alt"
  };

  const baseIcon = icons[step] || "fas fa-circle";
  let colorClass = "";

  switch (state) {
    case "active":
      colorClass = "text-blue-500";
      break;
    case "completed":
      colorClass = "text-green-500";
      break;
    default:
      colorClass = "text-gray-400";
  }

  return `${baseIcon} ${colorClass} text-lg`;
}

/**
 * Función para mostrar/ocultar contenido del paso
 * @param {string} step - El paso a mostrar
 */
function showStepContent(step) {
  // Ocultar todas las secciones
  const allSections = document.querySelectorAll("[data-form-section]");
  allSections.forEach((section) => {
    section.style.display = "none";
  });

  // Mostrar las secciones correspondientes al paso actual
  const targetSections = document.querySelectorAll(`[data-form-section="${step}"]`);
  targetSections.forEach((section) => {
    section.style.display = "block";
  });

  console.log(`👁️ Mostrando contenido del paso: ${step}`);
}

/**
 * Función para actualizar campos específicos según el paso
 * @param {string} step - El paso actual
 */
function updateFieldsForStep(step) {
  const longitudLabel = document.getElementById("longitud_label");
  const latitudLabel = document.getElementById("latitud_label");
  const longitudFinalGroup = document.getElementById("longitud_final_group");
  const latitudFinalGroup = document.getElementById("latitud_final_group");
  const cantidadField = document.getElementById("cantidad");
  const numeroConductoresField = document.getElementById("numero_conductores");

  if (!longitudLabel || !latitudLabel) {
    console.warn("⚠️ Labels de coordenadas no encontrados");
    return;
  }

  if (step === "estructuras") {
    // En estructuras, las coordenadas son de la estructura
    longitudLabel.textContent = "Longitud de la Estructura";
    latitudLabel.textContent = "Latitud de la Estructura";
    
    // Ocultar coordenadas finales
    if (longitudFinalGroup) longitudFinalGroup.style.display = "none";
    if (latitudFinalGroup) latitudFinalGroup.style.display = "none";
    
    // Bloquear campos de cantidad y conductores
    if (cantidadField) {
      cantidadField.readOnly = true;
      cantidadField.classList.add("bg-gray-100", "cursor-not-allowed");
    }
    if (numeroConductoresField) {
      numeroConductoresField.readOnly = true;
      numeroConductoresField.classList.add("bg-gray-100", "cursor-not-allowed");
    }
  } else {
    // En otros pasos, las coordenadas son del conductor/transformador
    longitudLabel.textContent = "Longitud Inicial";
    latitudLabel.textContent = "Latitud Inicial";
    
    // Mostrar coordenadas finales
    if (longitudFinalGroup) longitudFinalGroup.style.display = "block";
    if (latitudFinalGroup) latitudFinalGroup.style.display = "block";
    
    // Desbloquear campos de cantidad y conductores
    if (cantidadField) {
      cantidadField.readOnly = false;
      cantidadField.classList.remove("bg-gray-100", "cursor-not-allowed");
    }
    if (numeroConductoresField) {
      numeroConductoresField.readOnly = false;
      numeroConductoresField.classList.remove("bg-gray-100", "cursor-not-allowed");
    }
  }

  console.log(`🔧 Campos actualizados para el paso: ${step}`);
}

/**
 * Función para validar si se puede avanzar al siguiente paso
 * @param {string} currentStep - El paso actual
 * @returns {boolean} - True si puede avanzar
 */
function canAdvanceToNextStep(currentStep) {
  switch (currentStep) {
    case "generales":
      // Validar campos básicos
      const requiredGenerales = ["nombre", "contrato", "municipio", "fecha"];
      return requiredGenerales.every(id => {
        const field = document.getElementById(id);
        return field && field.value.trim();
      });
      
    case "estructuras":
      // Validar UC y fotos
      const uc = document.getElementById("uc_codigo")?.value;
      const fotos = document.getElementById("fotos_nueva")?.files;
      return uc && fotos && fotos.length > 0;
      
    case "conductores":
      // Validar al menos un conductor
      const conductorUC = document.getElementById("conductor_n1_uc")?.value;
      return conductorUC && conductorUC.trim();
      
    case "documentos":
      // Validar archivos requeridos
      const cad = document.getElementById("archivo_cad")?.files[0];
      const kmz = document.getElementById("archivo_kmz")?.files[0];
      return cad && kmz;
      
    default:
      return true;
  }
}

/**
 * Función para avanzar al siguiente paso
 */
function nextStep() {
  const currentIndex = steps.indexOf(currentStep);
  if (currentIndex < steps.length - 1) {
    if (canAdvanceToNextStep(currentStep)) {
      navigateToStep(steps[currentIndex + 1]);
    } else {
      alert("Por favor complete todos los campos requeridos antes de continuar.");
    }
  }
}

/**
 * Función para retroceder al paso anterior
 */
function previousStep() {
  const currentIndex = steps.indexOf(currentStep);
  if (currentIndex > 0) {
    navigateToStep(steps[currentIndex - 1]);
  }
}

/**
 * Función para inicializar la navegación
 */
function initializeNavigation() {
  // Configurar navegación con clicks en navbar
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      const step = item.getAttribute("data-step");
      if (step) {
        navigateToStep(step);
      }
    });
  });

  // Configurar botones de navegación
  const nextBtn = document.getElementById("nextStepBtn");
  const prevBtn = document.getElementById("prevStepBtn");
  
  if (nextBtn) {
    nextBtn.addEventListener("click", nextStep);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener("click", previousStep);
  }

  // Inicializar en el primer paso
  navigateToStep("generales");
  
  console.log("🧭 Sistema de navegación inicializado");
}

// Exportar funciones para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    navigateToStep,
    updateNavbarState,
    getStepIcon,
    showStepContent,
    updateFieldsForStep,
    canAdvanceToNextStep,
    nextStep,
    previousStep,
    initializeNavigation,
    currentStep,
    steps
  };
}
