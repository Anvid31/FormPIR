// PARCHE TEMPORAL PARA SOLUCIONAR AUTOCOMPLETADO
// Este archivo se ejecuta después de autocompletion.js para arreglar el problema

console.log("🔧 Aplicando parche de autocompletado...");

// Variables para controlar interacción del usuario
window.userHasReallyInteracted = false;
let firstInteractionLogged = false;

// Función para marcar interacción real del usuario
function markRealUserInteraction() {
  if (!window.userHasReallyInteracted && !firstInteractionLogged) {
    window.userHasReallyInteracted = true;
    firstInteractionLogged = true;
    console.log("👆 PRIMERA INTERACCIÓN REAL DEL USUARIO DETECTADA");
  }
}

// Sobrescribir la función autoCompleteUC para que solo funcione con interacción real
const originalAutoCompleteUC = window.autoCompleteUC;

window.autoCompleteUC = function() {
  // Si no hay interacción real del usuario, no hacer nada
  if (!window.userHasReallyInteracted) {
    console.log("🚫 Autocompletado bloqueado - esperando interacción real del usuario");
    return;
  }
  
  // Buscar elementos usando búsqueda híbrida más robusta
  const materialEl = document.getElementById("material_nueva") || findElementInCurrentSection("material_nueva");
  const alturaEl = document.getElementById("altura_nueva") || findElementInCurrentSection("altura_nueva");
  const poblacionEl = document.getElementById("poblacion_nueva") || findElementInCurrentSection("poblacion_nueva");
  const disposicionEl = document.getElementById("disposicion_nueva") || findElementInCurrentSection("disposicion_nueva");
  const tipoRedEl = document.getElementById("tipo_red_nueva") || findElementInCurrentSection("tipo_red_nueva");
  const apoyoEl = document.getElementById("apoyo_nueva") || findElementInCurrentSection("apoyo_nueva");
  const pesoEl = document.getElementById("peso_nueva") || findElementInCurrentSection("peso_nueva");
  const configuracionEl = document.getElementById("configuracion_nueva") || findElementInCurrentSection("configuracion_nueva");
  const circuitoEl = document.getElementById("circuito_nueva") || findElementInCurrentSection("circuito_nueva");
  const lineaEl = document.getElementById("linea_nueva") || findElementInCurrentSection("linea_nueva");
  const ucSelect = document.getElementById("uc") || document.getElementById("uc_nueva") || findElementInCurrentSection("uc") || findElementInCurrentSection("uc_nueva");

  // Obtener valores de manera segura
  const material = materialEl?.value?.trim() || '';
  const altura = alturaEl?.value?.trim() || '';
  const poblacion = poblacionEl?.value?.trim() || '';
  const disposicion = disposicionEl?.value?.trim() || '';
  const tipoRed = tipoRedEl?.value?.trim() || '';
  const apoyo = apoyoEl?.value?.trim() || '';
  const peso = pesoEl?.value?.trim() || '';
  const configuracion = configuracionEl?.value?.trim() || '';
  const circuito = circuitoEl?.value?.trim() || '';
  const linea = lineaEl?.value?.trim() || '';

  // Validación robusta: solo proceder si hay al menos valores básicos requeridos
  const valoresBasicos = [apoyo, material, altura].filter(v => v !== '');
  const totalCamposConValor = [material, altura, poblacion, disposicion, tipoRed, apoyo, peso, configuracion, circuito, linea].filter(v => v !== '').length;
  
  console.log("🔍 PARCHE AutoComplete UC - Análisis de valores:", {
    totalCamposConValor,
    valoresBasicos: valoresBasicos.length,
    userHasReallyInteracted: window.userHasReallyInteracted,
    campos: {apoyo, material, altura, poblacion, disposicion, tipoRed, peso, configuracion, circuito, linea}
  });

  // Solo proceder si hay suficientes datos para generar UC válido
  if (valoresBasicos.length < 2 || totalCamposConValor < 3) {
    console.log("⚠️ PARCHE - Insuficientes datos para autocompletado UC. Mínimo requerido: apoyo + material + altura");
    
    // Limpiar UC si no hay suficientes datos
    if (ucSelect) {
      ucSelect.value = "";
      ucSelect.classList.remove("bg-green-50", "border-green-300");
      ucSelect.disabled = false;
    }
    return;
  }

  // Determinar qué función de búsqueda usar según el tipo de apoyo y nivel
  let suggestedUC = null;
  
  if (typeof getUCFromAdvancedStructure === 'function') {
    suggestedUC = getUCFromAdvancedStructure({
      apoyo, material, altura, poblacion, disposicion, tipoRed, 
      peso, configuracion, circuito, linea
    });
  }

  console.log("🎯 PARCHE UC sugerido:", suggestedUC);

  if (suggestedUC && typeof UC_MAPPING !== 'undefined' && ucSelect) {
    // Verificar si ucSelect existe antes de usarlo
    if (ucSelect) {
      ucSelect.disabled = false;
      ucSelect.value = suggestedUC;
      ucSelect.disabled = true;

      // Agregar clase visual para indicar que está autocompletado
      ucSelect.classList.add("bg-green-50", "border-green-300");

      console.log(
        "✅ PARCHE UC autocompletado exitosamente:",
        suggestedUC,
        "->",
        UC_MAPPING[suggestedUC]
      );
    }
  } else {
    // Si no se encontró UC válido pero hay datos suficientes
    console.log("❌ PARCHE No se encontró UC para la combinación actual");
    if (ucSelect) {
      ucSelect.value = "";
      ucSelect.classList.remove("bg-green-50", "border-green-300");
      ucSelect.disabled = false;
    }
  }
};

// Configurar event listeners que marcan interacción real
function setupRealInteractionListeners() {
  const camposEstructura = [
    "material_nueva", "altura_nueva", "poblacion_nueva", "disposicion_nueva",
    "tipo_red_nueva", "apoyo_nueva", "peso_nueva", "configuracion_nueva",
    "circuito_nueva", "linea_nueva"
  ];

  let debounceTimer = null;
  const debouncedAutoComplete = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log("🚀 PARCHE Ejecutando autoComplete UC con debounce...");
      window.autoCompleteUC();
    }, 300);
  };

  camposEstructura.forEach(campoId => {
    const elemento = document.getElementById(campoId);
    if (elemento) {
      // Agregar listeners que marcan interacción real
      ['change', 'input', 'focus', 'blur'].forEach(evento => {
        elemento.addEventListener(evento, function() {
          markRealUserInteraction();
          if (evento === 'change' || evento === 'blur') {
            debouncedAutoComplete();
          }
        });
      });
      console.log(`🔧 PARCHE Event listeners configurados para ${campoId}`);
    }
  });
}

// Configurar después de que se cargue la página
setTimeout(() => {
  setupRealInteractionListeners();
  console.log("✅ PARCHE de autocompletado aplicado correctamente");
}, 2000);

// Función de testing manual mejorada
window.testAutoCompleteWithPatch = function() {
  console.log("🧪 === TEST MANUAL CON PARCHE ===");
  
  // Forzar interacción
  window.userHasReallyInteracted = true;
  
  // Llenar campos de prueba
  const apoyo = document.getElementById('apoyo_nueva');
  const material = document.getElementById('material_nueva');
  const altura = document.getElementById('altura_nueva');
  
  if (apoyo) apoyo.value = 'Poste';
  if (material) material.value = 'Concreto';
  if (altura) altura.value = '12';
  
  console.log("📝 Campos de prueba llenados");
  
  // Ejecutar autocompletado
  window.autoCompleteUC();
};

window.forceUserInteraction = function() {
  window.userHasReallyInteracted = true;
  console.log("💪 Interacción del usuario forzada");
};
