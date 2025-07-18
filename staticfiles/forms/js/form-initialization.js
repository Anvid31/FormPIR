// form-initialization.js - Inicialización principal del formulario DESS

document.addEventListener("DOMContentLoaded", function () {
  console.log("=== DESS - Inicializando Sistema de Formularios ===");

  // Verificar que el mapping UC esté disponible
  if (
    typeof UC_MAPPING === "undefined" ||
    typeof getUCFromStructure === "undefined"
  ) {
    console.error("Error: uc-mapping.js no se cargó correctamente");
    alert(
      "Error al cargar el sistema de códigos UC. Por favor recarga la página."
    );
    return;
  }

  // Inicializar fecha máxima (hoy)
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fecha").setAttribute("max", hoy);

  // Inicializar mapeos de datos
  if (typeof initializeDataMappings === "function") {
    initializeDataMappings();
  }

  // Inicializar autocompletado
  if (typeof initializeAutocompletion === "function") {
    initializeAutocompletion();
  }

  // Configurar event listeners para campos de estructura nueva
  const camposEstructuraNueva = [
    "material_nueva",
    "altura_nueva", 
    "poblacion_nueva",
    "disposicion_nueva",
    "tipo_red_nueva"
  ];

  camposEstructuraNueva.forEach(campo => {
    const elemento = document.getElementById(campo);
    if (elemento && typeof autoCompleteUC === "function") {
      elemento.addEventListener("change", autoCompleteUC);
    } else if (elemento) {
      console.warn(`autoCompleteUC no está disponible para ${campo}`);
    }
  });

  // Configurar event listeners para autocompletado de proyecto
  const nombreProyecto = document.getElementById("nombre");
  if (nombreProyecto) {
    nombreProyecto.addEventListener("change", function() {
      console.log("Proyecto seleccionado:", this.value);
      if (typeof autoCompleteBanco === "function") {
        autoCompleteBanco();
      }
      if (typeof actualizarContratos === "function") {
        actualizarContratos();
      }
    });
  }

  // Configurar event listeners para contratos
  const contratoSelect = document.getElementById("contrato");
  if (contratoSelect) {
    contratoSelect.addEventListener("change", function() {
      console.log("Contrato seleccionado:", this.value);
      if (typeof autoCompleteRegional === "function") {
        autoCompleteRegional();
      }
    });
  }

  // Configurar event listeners para municipio
  const municipioSelect = document.getElementById("municipio");
  if (municipioSelect) {
    municipioSelect.addEventListener("change", function() {
      console.log("Municipio seleccionado:", this.value);
      if (typeof autoCompleteDepartamento === "function") {
        autoCompleteDepartamento();
      }
    });
  }

  // Configurar event listener para nivel de tensión
  const nivelTensionSelect = document.getElementById("nivel_tension");
  if (nivelTensionSelect && typeof actualizarAlturasPorTension === "function") {
    nivelTensionSelect.addEventListener("change", function() {
      console.log("Evento change en nivel de tensión:", this.value);
      actualizarAlturasPorTension();
    });
    console.log("Listener agregado para nivel de tensión");
  } else {
    console.error("No se encontró el elemento con ID 'nivel_tension' o la función actualizarAlturasPorTension");
  }

  // Configurar event listener para tipo de inversión
  const tipoInversionSelect = document.getElementById("t_inv");
  if (tipoInversionSelect) {
    tipoInversionSelect.addEventListener("change", function() {
      console.log("Evento change en tipo de inversión:", this.value);
      
      // Actualizar botón Montaje Integral
      if (typeof mostrarOcultarMontajeIntegral === "function") {
        mostrarOcultarMontajeIntegral();
      }
      
      // Actualizar botón Desmantelado
      if (typeof mostrarOcultarDesmantelado === "function") {
        mostrarOcultarDesmantelado();
      }
    });
    console.log("Listener agregado para tipo de inversión");
  } else {
    console.error("No se encontró el elemento con ID 't_inv'");
  }

  // Configurar event listener para estructura retirada
  const estructuraRetiradaInput = document.getElementById("estructura_retirada_campo");
  if (estructuraRetiradaInput && typeof mostrarOcultarDesmantelado === "function") {
    estructuraRetiradaInput.addEventListener("input", function() {
      console.log("Evento input en estructura retirada:", this.value);
      mostrarOcultarDesmantelado();
    });
    console.log("Listener agregado para estructura retirada");
  } else {
    console.error("No se encontró el elemento con ID 'estructura_retirada_campo' o la función mostrarOcultarDesmantelado");
  }

  // Configurar validación de coordenadas
  const coordenadasInputs = [
    { id: "longitud", type: "x" },
    { id: "latitud", type: "y" },
    { id: "longitud_final", type: "x_final" },
    { id: "latitud_final", type: "y_final" }
  ];

  coordenadasInputs.forEach(coord => {
    const input = document.getElementById(coord.id);
    if (input) {
      input.addEventListener("blur", function() {
        validateCoordinate(this, coord.type);
      });
    }
  });

  // Configurar drag & drop para archivos
  setupFileDropZone("fotos_estructura", "preview_estructura", true);
  setupFileDropZone("fotos_conductor", "preview_conductor", true);
  setupFileDropZone("fotos_equipo", "preview_equipo", true);
  setupFileDropZone("fotos_transformador", "preview_transformador", true);

  // Inicializar el navbar de navegación
  console.log("Inicializando navbar de navegación...");
  updateNavbarState();
  showStepContent(currentStep);
  updateFieldsForStep(currentStep);

  // Evaluar estado inicial de los botones
  console.log("Evaluando estados iniciales de botones...");
  if (typeof mostrarOcultarMontajeIntegral === "function") {
    mostrarOcultarMontajeIntegral();
  }
  if (typeof mostrarOcultarDesmantelado === "function") {
    mostrarOcultarDesmantelado();
  }

  console.log("=== Inicialización completada ===");
});

// Función para configurar zonas de drag & drop
function setupFileDropZone(inputId, previewId, allowMultiple = false) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  
  if (!input || !preview) {
    console.warn(`No se encontraron elementos para: ${inputId}, ${previewId}`);
    return;
  }

  const dropZone = input.closest('.file-drop-zone');
  if (!dropZone) return;

  // Event listeners para drag & drop
  dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropZone.classList.add('border-blue-400', 'bg-blue-50');
  });

  dropZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    dropZone.classList.remove('border-blue-400', 'bg-blue-50');
  });

  dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    dropZone.classList.remove('border-blue-400', 'bg-blue-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      input.files = files;
      handleFilePreview(input, preview, allowMultiple);
    }
  });

  // Event listener para input change
  input.addEventListener('change', function() {
    handleFilePreview(this, preview, allowMultiple);
  });
}

// Función para manejar vista previa de archivos
function handleFilePreview(input, preview, allowMultiple) {
  preview.innerHTML = '';
  
  if (input.files && input.files.length > 0) {
    Array.from(input.files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.className = 'w-20 h-20 object-cover rounded border';
          img.alt = file.name;
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      } else {
        const fileInfo = document.createElement('div');
        fileInfo.className = 'text-sm text-gray-600 p-2 border rounded';
        fileInfo.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        preview.appendChild(fileInfo);
      }
    });
  }
}

// Exponer funciones globalmente
window.setupFileDropZone = setupFileDropZone;
window.handleFilePreview = handleFilePreview;
