/**
 * DESS - Funciones de Validación
 * Contiene todas las funciones de validación de coordenadas y formularios
 */

/**
 * Función para validar coordenadas geográficas
 * @param {HTMLInputElement} input - El elemento input a validar
 * @param {string} type - Tipo de coordenada (x, x_final, y, y_final)
 * @returns {boolean} - True si es válida, false si no
 */
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
    input.classList.add("border-red-500", "bg-red-50");
    return false;
  } else {
    if (errorElement) {
      errorElement.style.display = "none";
    }
    input.classList.remove("border-red-500", "bg-red-50");
    input.classList.add("border-green-500", "bg-green-50");
    return true;
  }
}

/**
 * Función para validar todos los campos requeridos del formulario
 * @returns {boolean} - True si todo está válido
 */
function validateFormData() {
  const requiredFields = [
    "nombre", "banco_proyecto", "contrato", "municipio", "departamento",
    "regional", "alimentador", "fecha", "inspector", "contratista",
    "t_inv", "numero_x", "numero_y"
  ];

  for (const fieldId of requiredFields) {
    const field = document.getElementById(fieldId);
    if (!field || !field.value.trim()) {
      alert(`El campo ${fieldId} es requerido`);
      if (field) field.focus();
      return false;
    }
  }

  // Validar coordenadas
  const coordenadas = [
    { id: "numero_x", type: "x" },
    { id: "numero_y", type: "y" }
  ];

  for (const coord of coordenadas) {
    const input = document.getElementById(coord.id);
    if (input && !validateCoordinate(input, coord.type)) {
      input.focus();
      return false;
    }
  }

  // Validar que hay al menos una foto de estructura nueva
  const fotosNueva = document.getElementById("fotos_nueva").files;
  if (fotosNueva.length === 0) {
    alert("Debe cargar al menos una foto de la estructura nueva");
    return false;
  }

  // Validar archivos CAD y KMZ
  const archivoCad = document.getElementById("archivo_cad").files[0];
  const archivoKmz = document.getElementById("archivo_kmz").files[0];
  
  if (!archivoCad) {
    alert("Debe cargar el archivo CAD");
    return false;
  }
  
  if (!archivoKmz) {
    alert("Debe cargar el archivo KMZ");
    return false;
  }

  return true;
}

/**
 * Función para configurar validaciones en tiempo real
 */
function setupRealTimeValidation() {
  // Validación de coordenadas en tiempo real
  const coordFields = [
    { id: "numero_x", type: "x" },
    { id: "numero_y", type: "y" },
    { id: "numero_x_final", type: "x_final" },
    { id: "numero_y_final", type: "y_final" }
  ];

  coordFields.forEach(field => {
    const input = document.getElementById(field.id);
    if (input) {
      input.addEventListener("input", function() {
        validateCoordinate(this, field.type);
      });
      
      input.addEventListener("blur", function() {
        validateCoordinate(this, field.type);
      });
    }
  });

  console.log("Validaciones en tiempo real configuradas");
}

/**
 * Función para formatear el campo de estructura retirada
 */
function formatEstructuraRetirada() {
  const estructuraRetirada = document.getElementById("estructura_retirada_campo");
  
  if (!estructuraRetirada) return;

  estructuraRetirada.addEventListener("input", function (e) {
    let valor = e.target.value;
    
    // Remover el prefijo "Z" si existe para procesarlo
    let numeros = valor.replace(/^Z/, "");
    
    // Mantener solo números
    numeros = numeros.replace(/[^0-9]/g, "");
    
    // Formatear con "Z" seguido de los números
    if (numeros.length > 0) {
      e.target.value = "Z" + numeros;
    } else {
      e.target.value = "";
    }
    
    console.log("Estructura retirada formateada:", e.target.value);
  });

  // Formatear automáticamente cuando se enfoca el campo
  estructuraRetirada.addEventListener("focus", function (e) {
    if (e.target.value === "") {
      e.target.value = "Z";
    }
  });

  // Validar que no esté vacío cuando se desenface si hay contenido
  estructuraRetirada.addEventListener("blur", function (e) {
    if (e.target.value === "Z") {
      e.target.value = "";
    }
  });

  // Prevenir que se borre el prefijo "Z" con backspace
  estructuraRetirada.addEventListener("keydown", function (e) {
    const valor = e.target.value;
    const cursorPos = e.target.selectionStart;

    // Si intenta borrar dentro del prefijo "Z", prevenir
    if (e.key === "Backspace" && cursorPos <= 1 && valor.startsWith("Z")) {
      e.preventDefault();
    }
  });

  console.log("Formateo de estructura retirada configurado");
}

// Exportar funciones para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateCoordinate,
    validateFormData,
    setupRealTimeValidation,
    formatEstructuraRetirada
  };
}
