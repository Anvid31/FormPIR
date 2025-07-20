// navigation.js - Sistema de navegación del formulario DESS
// Variables globales - navegación libre
let currentStep = "estructuras";
const steps = [
  "estructuras",
  "conductores",
  "equipos",
  "transformador",
];

// Función principal de navegación - sin validaciones secuenciales
function navigateToStep(step) {
  console.log(`Navegando directamente a: ${step}`);

  if (!steps.includes(step)) {
    console.error("Paso inválido:", step);
    return;
  }

  // Actualizar paso actual
  currentStep = step;

  // Actualizar interfaz
  updateNavbarState();
  showStepContent(step);

  console.log(`Navegación completada a: ${step}`);
}

// Función para actualizar el estado visual del navbar
function updateNavbarState() {
  // Actualizar círculos
  document.querySelectorAll(".nav-item").forEach((item) => {
    const step = item.getAttribute("data-step");
    const icon = item.querySelector("i");

    // Limpiar clases existentes
    item.className =
      "nav-item w-16 h-16 rounded-full flex items-center justify-center mb-3 cursor-pointer shadow-lg transition-all duration-300 hover:scale-105";

    if (step === currentStep) {
      // Paso activo
      item.classList.add("active");
      item.classList.add("bg-blue-600");
      icon.className = getStepIcon(step, "active");
    } else {
      // Paso inactivo
      item.classList.add("bg-gray-300");
      icon.className = getStepIcon(step, "inactive");

      // Agregar efectos hover específicos
      if (step === "conductores") {
        item.classList.add("hover:bg-yellow-400");
      } else if (step === "equipos") {
        item.classList.add("hover:bg-green-400");
      } else if (step === "transformador") {
        item.classList.add("hover:bg-purple-400");
      } else if (step === "estructuras") {
        item.classList.add("hover:bg-blue-400");
      }
    }
  });

  // Actualizar etiquetas
  document.querySelectorAll(".nav-step").forEach((step) => {
    step.classList.remove("active");
  });

  const activeStepElement = document.querySelector(
    `[data-step="${currentStep}"]`
  );
  if (activeStepElement && activeStepElement.nextElementSibling) {
    activeStepElement.nextElementSibling.classList.add("active");
  }
}

// Función para obtener iconos según el estado
function getStepIcon(step, state) {
  const icons = {
    estructuras: "fas fa-building",
    conductores: "fas fa-bolt",
    equipos: "fas fa-shield-alt",
    transformador: "fas fa-microchip",
  };

  const baseIcon = icons[step];
  const colorClass = state === "active" ? "text-white" : "text-gray-600";

  return `${baseIcon} ${colorClass} text-lg`;
}

// Función para mostrar/ocultar contenido del paso
function showStepContent(step) {
  // Ocultar todas las secciones
  const allSections = document.querySelectorAll("[data-form-section]");
  allSections.forEach((section) => {
    section.style.display = "none";
  });

  // Mostrar las secciones correspondientes al paso actual
  const targetSections = document.querySelectorAll(
    `[data-form-section="${step}"]`
  );
  targetSections.forEach((section) => {
    section.style.display = "block";
  });

  // Actualizar labels y campos según el paso actual
  updateFieldsForStep(step);

  console.log(
    `Mostrando contenido para: ${step}, secciones: ${targetSections.length}`
  );
}

// Nueva función para actualizar campos según el paso
function updateFieldsForStep(step) {
  const longitudLabel = document.getElementById("longitud_label");
  const latitudLabel = document.getElementById("latitud_label");
  const longitudFinalGroup = document.getElementById("longitud_final_group");
  const latitudFinalGroup = document.getElementById("latitud_final_group");
  const cantidadField = document.getElementById("cantidad");
  const numeroConductoresField = document.getElementById("numero_conductores");

  if (!longitudLabel || !latitudLabel) {
    console.warn("Labels de coordenadas no encontrados, esperando...");
    setTimeout(() => updateFieldsForStep(step), 100);
    return;
  }

  if (step === "estructuras") {
    // En estructuras: labels normales, sin campos finales, campos bloqueados
    longitudLabel.innerHTML = `LONGITUD
            <span class="tooltip">
              <i class="fas fa-question-circle help-icon"></i>
              <span class="tooltip-content">
                Coordenada X (Longitud) de la ubicación exacta.
              </span>
            </span>`;

    latitudLabel.innerHTML = `LATITUD
            <span class="tooltip">
              <i class="fas fa-question-circle help-icon"></i>
              <span class="tooltip-content">
                Coordenada Y (Latitud) de la ubicación exacta.
              </span>
            </span>`;

    // Ocultar campos finales
    if (longitudFinalGroup) longitudFinalGroup.style.display = "none";
    if (latitudFinalGroup) latitudFinalGroup.style.display = "none";

    // Bloquear campos cantidad y número de conductores
    if (cantidadField) {
      cantidadField.readOnly = true;
      cantidadField.classList.add("bg-gray-100", "cursor-not-allowed");
    }
    if (numeroConductoresField) {
      numeroConductoresField.readOnly = true;
      numeroConductoresField.classList.add("bg-gray-100", "cursor-not-allowed");
    }
  } else {
    // En conductor, equipos, transformador: labels iniciales, mostrar campos finales, campos desbloqueados
    longitudLabel.innerHTML = `LONGITUD INICIAL
            <span class="tooltip">
              <i class="fas fa-question-circle help-icon"></i>
              <span class="tooltip-content">
                Coordenada X (Longitud Inicial) de la ubicación de inicio en el sistema de coordenadas MAGNA-SIRGAS. Rango
                válido: 800,000 - 1,300,000.
              </span>
            </span>`;

    latitudLabel.innerHTML = `LATITUD INICIAL
            <span class="tooltip">
              <i class="fas fa-question-circle help-icon"></i>
              <span class="tooltip-content">
                Coordenada Y (Latitud Inicial) de la ubicación de inicio en el sistema de coordenadas MAGNA-SIRGAS. Rango
                válido: 1,000,000 - 1,600,000.
              </span>
            </span>`;

    // Mostrar campos finales
    if (longitudFinalGroup) longitudFinalGroup.style.display = "block";
    if (latitudFinalGroup) latitudFinalGroup.style.display = "block";

    // Desbloquear campos cantidad y número de conductores
    if (cantidadField) {
      cantidadField.readOnly = false;
      cantidadField.classList.remove("bg-gray-100", "cursor-not-allowed");
    }
    if (numeroConductoresField) {
      numeroConductoresField.readOnly = false;
      numeroConductoresField.classList.remove("bg-gray-100", "cursor-not-allowed");
    }
  }

  console.log(`Campos actualizados para el paso: ${step}`);
}

// Función para validar coordenadas
function validateCoordinate(input, type) {
  const value = parseFloat(input.value);
  const errorElementId = input.id + "_error";
  const errorElement = document.getElementById(errorElementId);

  let min, max, fieldName;

  if (type === "x" || type === "x_final") {
    min = -79.0; // Longitud mínima para Colombia
    max = -66.8; // Longitud máxima para Colombia
    fieldName = type === "x" ? "Longitud" : "Longitud Final";
  } else if (type === "y" || type === "y_final") {
    min = -4.2; // Latitud mínima para Colombia
    max = 15.5; // Latitud máxima para Colombia
    fieldName = type === "y" ? "Latitud" : "Latitud Final";
  }

  if (input.value && (isNaN(value) || value < min || value > max)) {
    if (errorElement) {
      errorElement.textContent = `${fieldName} debe estar entre ${min} y ${max} (coordenadas geográficas)`;
      errorElement.style.display = "block";
    }
    input.classList.add("border-red-500");
    return false;
  } else {
    if (errorElement) {
      errorElement.style.display = "none";
    }
    input.classList.remove("border-red-500");
    return true;
  }
}

// Exponer funciones globalmente
window.navigateToStep = navigateToStep;
window.validateCoordinate = validateCoordinate;
