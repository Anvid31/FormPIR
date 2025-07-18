// autocompletion.js - Sistema de autocompletado del formulario DESS

// Variables globales para los elementos del DOM
let ucSelect, descripcionUc;

// Función para inicializar el autocompletado
function initializeAutocompletion() {
  // Buscar elementos con diferentes IDs según la sección
  ucSelect = document.getElementById("uc_nueva") || document.getElementById("uc_codigo");
  descripcionUc = document.getElementById("descripcion_uc");

  // Llenar el select de UC con el mapping completo si es un select
  if (ucSelect && ucSelect.tagName === 'SELECT' && typeof UC_MAPPING !== 'undefined') {
    for (const [codigo, descripcion] of Object.entries(UC_MAPPING)) {
      const option = document.createElement("option");
      option.value = codigo;
      option.textContent = codigo;
      ucSelect.appendChild(option);
    }
  }

  // Inicializar estados de campos autocompletados como deshabilitados
  initializeDisabledFields();
}

// Función para inicializar campos autocompletados como deshabilitados
function initializeDisabledFields() {
  const regionalInput = document.getElementById("regional");
  const departamentoInput = document.getElementById("departamento");
  const alimentadorSelect = document.getElementById("alimentador");

  // Deshabilitar regional hasta que se seleccione un contrato o municipio
  if (regionalInput) {
    regionalInput.disabled = true;
    regionalInput.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
    regionalInput.placeholder = "Se autocompletará según contrato o municipio";
  }

  // Deshabilitar departamento hasta que se seleccione un municipio
  if (departamentoInput) {
    departamentoInput.disabled = true;
    departamentoInput.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
    departamentoInput.placeholder = "Se autocompletará según el municipio";
  }

  // Deshabilitar circuitos hasta que se seleccione un municipio
  if (alimentadorSelect) {
    alimentadorSelect.disabled = true;
    alimentadorSelect.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
  }

  console.log("Campos autocompletados inicializados como deshabilitados");
}

// Auto-completar UC basado en selecciones de estructura nueva
function autoCompleteUC() {
  const material = document.getElementById("material_nueva").value;
  const altura = document.getElementById("altura_nueva").value;
  const poblacion = document.getElementById("poblacion_nueva").value;
  const disposicion = document.getElementById("disposicion_nueva").value;
  const tipoRed = document.getElementById("tipo_red_nueva").value;

  console.log("AutoComplete UC - Valores obtenidos:", {
    material,
    altura,
    poblacion,
    disposicion,
    tipoRed,
  });

  // Mapear valores del formulario a valores esperados por UC mapping
  let materialMapped = material;
  if (material === "Metálico") materialMapped = "Metálico";
  
  let poblacionMapped = poblacion;
  if (poblacion === "Urbana") poblacionMapped = "Urbano";
  
  let tipoRedMapped = tipoRed;
  if (tipoRed === "Común") tipoRedMapped = "Red común";
  if (tipoRed === "Trenzada") tipoRedMapped = "Red trenzada";

  // Autocompletar cuando se llenen algunos campos clave
  if (material && altura && poblacion && disposicion && tipoRed) {
    console.log("Todos los campos están llenos, buscando UC...");
    
    if (typeof getUCFromStructure === 'function') {
      const suggestedUC = getUCFromStructure(
        materialMapped,
        altura,
        poblacionMapped,
        disposicion,
        tipoRedMapped
      );
      console.log("UC sugerido:", suggestedUC);

      if (suggestedUC && typeof UC_MAPPING !== 'undefined' && ucSelect) {
        // Verificar si ucSelect existe antes de usarlo
        if (ucSelect) {
          ucSelect.disabled = false;
          ucSelect.value = suggestedUC;
          if (descripcionUc) {
            descripcionUc.value = UC_MAPPING[suggestedUC];
          }
          ucSelect.disabled = true;

          // Agregar clase visual para indicar que está autocompletado
          ucSelect.classList.add("bg-green-50", "border-green-300");
          if (descripcionUc) {
            descripcionUc.classList.add("bg-green-50", "border-green-300");
          }

          // Mostrar indicador visual
          const indicator = document.getElementById("uc_indicator");
          if (indicator) {
            indicator.classList.remove("hidden");
          }

          console.log(
            "UC autocompletado exitosamente:",
            suggestedUC,
            "->",
            UC_MAPPING[suggestedUC]
          );
        }
      } else {
        console.log("No se encontró UC para la combinación:", {
          material: materialMapped,
          altura,
          poblacion: poblacionMapped,
          disposicion,
          tipoRed: tipoRedMapped,
        });
      }
    }
  } else {
    // Si no todos los campos están llenos, limpiar UC
    console.log("Faltan campos por llenar, limpiando UC...");
    if (ucSelect) {
      ucSelect.value = "";
      ucSelect.classList.remove("bg-green-50", "border-green-300");
    }
    if (descripcionUc) {
      descripcionUc.value = "";
      descripcionUc.classList.remove("bg-green-50", "border-green-300");
    }

    // Ocultar indicadores visuales
    const indicator = document.getElementById("uc_indicator");
    if (indicator) {
      indicator.classList.add("hidden");
    }
  }
}

// Función para actualizar contratos según proyecto seleccionado
function actualizarContratos() {
  const nombreProyecto = document.getElementById("nombre").value;
  const contratoSelect = document.getElementById("contrato");

  console.log(
    "ActualizarContratos - Proyecto seleccionado:",
    nombreProyecto
  );

  // Limpiar opciones existentes (excepto la primera)
  contratoSelect.innerHTML =
    '<option value="">Seleccionar contrato</option>';

  if (nombreProyecto && typeof PROYECTO_COMPLETO_MAPPING !== 'undefined' && PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
    const contratos = PROYECTO_COMPLETO_MAPPING[nombreProyecto].contratos;

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

    console.log(
      `Contratos actualizados para ${nombreProyecto}:`,
      contratos.length,
      "opciones disponibles"
    );
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

    if (nombreProyecto) {
      console.log(
        "No se encontraron contratos específicos para proyecto:",
        nombreProyecto,
        "- usando contratos genéricos"
      );
    }
  }

  // Limpiar selects dependientes
  document.getElementById("municipio").innerHTML =
    '<option value="">Seleccionar municipio</option>';
  document
    .getElementById("municipio")
    .classList.remove("bg-blue-50", "border-blue-300");
  document.getElementById("alimentador").innerHTML =
    '<option value="">Seleccionar alimentador</option>';
  document
    .getElementById("alimentador")
    .classList.remove("bg-yellow-50", "border-yellow-300");

  // Limpiar departamento y regional
  const departamentoInput = document.getElementById("departamento");
  const regionalInput = document.getElementById("regional");
  const alimentadorSelect = document.getElementById("alimentador");
  
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
  if (alimentadorSelect) {
    alimentadorSelect.disabled = true;
    alimentadorSelect.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
    alimentadorSelect.classList.remove("bg-green-50", "border-green-300");
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
  const nombreProyecto = document.getElementById("nombre").value;
  const bancoProyecto = document.getElementById("banco_proyecto");

  console.log(
    "AutoCompleteBanco - Proyecto seleccionado:",
    nombreProyecto
  );

  // Verificar primero el mapeo completo
  if (nombreProyecto && typeof PROYECTO_COMPLETO_MAPPING !== 'undefined' && PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
    const proyectoData = PROYECTO_COMPLETO_MAPPING[nombreProyecto];
    bancoProyecto.value = proyectoData.banco;
    bancoProyecto.classList.add("bg-green-50", "border-green-300");
    console.log(
      "Banco autocompletado (mapeo completo):",
      nombreProyecto,
      "->",
      proyectoData.banco
    );
  }
  // Fallback al mapeo simple
  else if (nombreProyecto && PROYECTO_BANCO_MAPPING[nombreProyecto]) {
    bancoProyecto.value = PROYECTO_BANCO_MAPPING[nombreProyecto];
    bancoProyecto.classList.add("bg-green-50", "border-green-300");
    console.log(
      "Banco autocompletado (mapeo simple):",
      nombreProyecto,
      "->",
      PROYECTO_BANCO_MAPPING[nombreProyecto]
    );
  } else {
    bancoProyecto.value = "";
    bancoProyecto.classList.remove("bg-green-50", "border-green-300");
    console.log("No se encontró mapeo para proyecto:", nombreProyecto);
  }

  // Actualizar contratos después del banco
  actualizarContratos();
}

// Función para autocompletar regional basado en contrato seleccionado
function autoCompleteRegional() {
  const contratoSeleccionado = document.getElementById("contrato").value;
  const nombreProyecto = document.getElementById("nombre").value;
  const regionalInput = document.getElementById("regional");

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
  const contratoSeleccionado = document.getElementById("contrato").value;
  const municipioSelect = document.getElementById("municipio");
  const nombreProyecto = document.getElementById("nombre").value;

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
  document.getElementById("alimentador").innerHTML =
    '<option value="">Seleccionar alimentador</option>';
  document
    .getElementById("alimentador")
    .classList.remove("bg-yellow-50", "border-yellow-300");
}

// Función para actualizar circuitos según municipio seleccionado
function actualizarCircuitos() {
  const municipioSeleccionado = document.getElementById("municipio").value;
  const alimentadorSelect = document.getElementById("alimentador");

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
  const municipioSeleccionado = document.getElementById("municipio").value;
  const departamentoInput = document.getElementById("departamento");
  const regionalInput = document.getElementById("regional");

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

// Función para actualizar alturas según nivel de tensión
function actualizarAlturasPorTension() {
  const nivelTension = document.getElementById("nivel_tension").value;
  const alturaSelect = document.getElementById("altura_nueva");

  console.log("Nivel de tensión seleccionado:", nivelTension);

  // Limpiar opciones existentes (excepto la primera)
  alturaSelect.innerHTML = '<option value="">Seleccionar altura</option>';

  let alturasPermitidas = [];

  // Definir alturas según nivel de tensión
  switch (nivelTension) {
    case "1": // Baja Tensión
      alturasPermitidas = [
        { value: "8", text: "8 m" },
        { value: "10", text: "10 m" }
      ];
      break;
    case "2": // Media Tensión
      alturasPermitidas = [
        { value: "10", text: "10 m" },
        { value: "12", text: "12 m" },
        { value: "14", text: "14 m" }
      ];
      break;
    case "3": // Alta Tensión
      alturasPermitidas = [
        { value: "14", text: "14 m" },
        { value: "16", text: "16 m" }
      ];
      break;
    default:
      // Si no hay nivel seleccionado, mostrar todas las opciones
      alturasPermitidas = [
        { value: "8", text: "8 m" },
        { value: "9", text: "9 m" },
        { value: "10", text: "10 m" },
        { value: "11", text: "11 m" },
        { value: "12", text: "12 m" },
        { value: "13", text: "13 m" },
        { value: "14", text: "14 m" },
        { value: "15", text: "15 m" },
        { value: "16", text: "16 m" }
      ];
  }

  // Agregar las opciones permitidas
  alturasPermitidas.forEach(altura => {
    const option = document.createElement("option");
    option.value = altura.value;
    option.textContent = altura.text;
    alturaSelect.appendChild(option);
  });

  // Agregar indicador visual si hay filtro aplicado
  if (nivelTension) {
    alturaSelect.classList.add("bg-blue-50", "border-blue-300");
    console.log(`Alturas filtradas para tensión nivel ${nivelTension}:`, alturasPermitidas.length, "opciones");
  } else {
    alturaSelect.classList.remove("bg-blue-50", "border-blue-300");
  }

  // Limpiar selección actual si ya no es válida
  const valorActual = alturaSelect.value;
  if (valorActual && !alturasPermitidas.find(a => a.value === valorActual)) {
    alturaSelect.value = "";
    console.log("Altura actual ya no es válida, limpiando selección");
  }
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
 * Alterna el estado del modo Desmantelado
 * Deshabilita información de estructuras Y información técnica, solo deja estructura retirada
 * Recibe prefijo de sección opcional para formularios modulares
 */
function toggleDesmantelado(seccionPrefix = '') {
  const checkboxId = seccionPrefix ? `${seccionPrefix}_desmantelado_checkbox` : "desmantelado_checkbox";
  const checkbox = document.getElementById(checkboxId);
  desmanteladoActivo = checkbox ? checkbox.checked : false;
  
  const estructuraRetiradaId = seccionPrefix ? `${seccionPrefix}_estructura_retirada_campo` : "estructura_retirada_campo";
  const estructuraRetirada = document.getElementById(estructuraRetiradaId);
  
  if (desmanteladoActivo) {
    // Deshabilitar información de estructuras e información técnica
    deshabilitarInformacionEstructuras(true, seccionPrefix);
    deshabilitarInformacionTecnica(true, seccionPrefix);
    
    // Resaltar el campo estructura retirada como el único habilitado
    if (estructuraRetirada) {
      estructuraRetirada.classList.add("bg-yellow-100", "border-yellow-400", "ring-2", "ring-yellow-200");
      estructuraRetirada.disabled = false; // Asegurar que esté habilitado
      estructuraRetirada.focus(); // Enfocar el campo
    }
    
    console.log("Modo Desmantelado activado - Solo campo estructura_retirada_campo disponible");
  } else {
    // Habilitar información de estructuras e información técnica
    deshabilitarInformacionEstructuras(false, seccionPrefix);
    deshabilitarInformacionTecnica(false, seccionPrefix);
    
    // Remover resaltado del campo estructura retirada
    if (estructuraRetirada) {
      estructuraRetirada.classList.remove("bg-yellow-100", "border-yellow-400", "ring-2", "ring-yellow-200");
    }
    
    // Si montaje integral estaba activo, mantener información de estructuras deshabilitada
    if (montajeIntegralActivo) {
      deshabilitarInformacionEstructuras(true, seccionPrefix);
    }
    
    console.log("Modo Desmantelado desactivado - Formulario habilitado");
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
 */
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
window.toggleDesmantelado = toggleDesmantelado;
window.mostrarOcultarMontajeIntegral = mostrarOcultarMontajeIntegral;
window.mostrarOcultarDesmantelado = mostrarOcultarDesmantelado;
window.habilitarDeshabilitarCoordenadas = habilitarDeshabilitarCoordenadas;
window.initializeAutocompletion = initializeAutocompletion;
window.initializeDisabledFields = initializeDisabledFields;

// Inicializar event listeners para autocompletado UC cuando se cargue el DOM
document.addEventListener("DOMContentLoaded", function() {
  // Event listeners para campos de estructura nueva (sección estructuras_complete)
  const camposEstructura = [
    "material_nueva",
    "altura_nueva", 
    "poblacion_nueva",
    "disposicion_nueva",
    "tipo_red_nueva"
  ];

  camposEstructura.forEach(campoId => {
    const elemento = document.getElementById(campoId);
    if (elemento) {
      elemento.addEventListener("change", autoCompleteUC);
      console.log(`Event listener agregado para ${campoId}`);
    }
  });

  // Inicializar autocompletado
  initializeAutocompletion();
});
