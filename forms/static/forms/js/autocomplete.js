/**
 * DESS - Funciones de Autocompletado
 * Contiene todas las funciones para autocompletar campos basados en mapeos
 */

/**
 * Función para autocompletar banco del proyecto
 */
function autoCompleteBanco() {
  const nombreProyecto = document.getElementById("nombre").value;
  const bancoProyecto = document.getElementById("banco_proyecto");

  console.log("AutoCompleteBanco - Proyecto seleccionado:", nombreProyecto);

  // Verificar primero el mapeo completo
  if (nombreProyecto && PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
    const proyectoData = PROYECTO_COMPLETO_MAPPING[nombreProyecto];
    bancoProyecto.value = proyectoData.banco;
    bancoProyecto.classList.add("bg-green-50", "border-green-300");
    console.log("Banco autocompletado desde mapeo completo:", proyectoData.banco);
  }
  // Fallback al mapeo simple
  else if (nombreProyecto && PROYECTO_BANCO_MAPPING[nombreProyecto]) {
    bancoProyecto.value = PROYECTO_BANCO_MAPPING[nombreProyecto];
    bancoProyecto.classList.add("bg-green-50", "border-green-300");
    console.log("Banco autocompletado desde mapeo simple:", PROYECTO_BANCO_MAPPING[nombreProyecto]);
  } else {
    bancoProyecto.value = "";
    bancoProyecto.classList.remove("bg-green-50", "border-green-300");
    console.log("No se encontró mapeo para proyecto:", nombreProyecto);
  }

  // Actualizar contratos después del banco
  actualizarContratos();
}

/**
 * Función para actualizar contratos según proyecto seleccionado
 */
function actualizarContratos() {
  const nombreProyecto = document.getElementById("nombre").value;
  const contratoSelect = document.getElementById("contrato");

  console.log("ActualizarContratos - Proyecto seleccionado:", nombreProyecto);

  // Limpiar opciones existentes (excepto la primera)
  contratoSelect.innerHTML = '<option value="">Seleccionar contrato</option>';

  if (nombreProyecto && PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
    const contratos = PROYECTO_COMPLETO_MAPPING[nombreProyecto].contratos;

    console.log("Contratos encontrados para el proyecto:", contratos);

    // Agregar opciones de contratos
    contratos.forEach((contrato) => {
      const option = document.createElement("option");
      option.value = contrato;
      option.textContent = contrato;
      contratoSelect.appendChild(option);
    });

    // Agregar indicador visual
    contratoSelect.classList.add("bg-green-50", "border-green-300");

    console.log(`${contratos.length} contratos cargados para el proyecto`);
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
      console.log("Proyecto sin mapeo de contratos específico, usando genéricos");
    }
  }

  // Limpiar selects dependientes
  document.getElementById("municipio").innerHTML = '<option value="">Seleccionar municipio</option>';
  document.getElementById("municipio").classList.remove("bg-blue-50", "border-blue-300");
  document.getElementById("alimentador").innerHTML = '<option value="">Seleccionar alimentador</option>';
  document.getElementById("alimentador").classList.remove("bg-yellow-50", "border-yellow-300");

  // Actualizar municipios según el contrato por defecto (si hay uno)
  setTimeout(() => {
    if (contratoSelect.value) {
      actualizarMunicipiosPorContrato();
    }
  }, 100);
}

/**
 * Función para actualizar municipios según contrato seleccionado
 */
function actualizarMunicipiosPorContrato() {
  const contratoSeleccionado = document.getElementById("contrato").value;
  const municipioSelect = document.getElementById("municipio");
  const nombreProyecto = document.getElementById("nombre").value;

  console.log("ActualizarMunicipiosPorContrato - Contrato seleccionado:", contratoSeleccionado);

  // Limpiar opciones existentes (excepto la primera)
  municipioSelect.innerHTML = '<option value="">Seleccionar municipio</option>';

  if (contratoSeleccionado && contratoSeleccionado !== "Por definir") {
    // Buscar la regional del contrato seleccionado
    let regionalDelContrato = null;

    if (nombreProyecto && PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
      // Aquí se podría implementar lógica más específica según el contrato
      // Por ahora, mostrar todos los municipios
      regionalDelContrato = "TODAS";
    }

    console.log("Regional del contrato:", regionalDelContrato);

    if (regionalDelContrato) {
      // Mostrar municipios filtrados por regional
      Object.keys(MUNICIPIO_MAPPING).forEach((municipio) => {
        const option = document.createElement("option");
        option.value = municipio;
        option.textContent = municipio;
        municipioSelect.appendChild(option);
      });

      // Agregar indicador visual
      municipioSelect.classList.add("bg-yellow-50", "border-yellow-300");
    } else {
      console.log("No se encontró regional para el contrato:", contratoSeleccionado);
    }
  } else {
    // Si el contrato es "Por definir" o no hay contrato, mostrar todos los municipios
    Object.keys(MUNICIPIO_MAPPING).forEach((municipio) => {
      const option = document.createElement("option");
      option.value = municipio;
      option.textContent = municipio;
      municipioSelect.appendChild(option);
    });

    // Remover indicador visual
    municipioSelect.classList.remove("bg-yellow-50", "border-yellow-300");
  }

  // Limpiar selects dependientes
  document.getElementById("alimentador").innerHTML = '<option value="">Seleccionar alimentador</option>';
  document.getElementById("alimentador").classList.remove("bg-yellow-50", "border-yellow-300");
}

/**
 * Función para autocompletar departamento y regional basado en municipio
 */
function autoCompleteMunicipio() {
  const municipioSeleccionado = document.getElementById("municipio").value;
  const departamentoInput = document.getElementById("departamento");
  const regionalInput = document.getElementById("regional");

  console.log("AutoCompleteMunicipio - Municipio seleccionado:", municipioSeleccionado);

  if (municipioSeleccionado && MUNICIPIO_MAPPING[municipioSeleccionado]) {
    const datos = MUNICIPIO_MAPPING[municipioSeleccionado];

    // Autocompletar departamento
    departamentoInput.value = datos.departamento;
    departamentoInput.classList.add("bg-green-50", "border-green-300");

    // Autocompletar regional
    regionalInput.value = datos.regional;
    regionalInput.classList.add("bg-green-50", "border-green-300");

    console.log("Datos autocompletados:", datos);
  } else {
    // Limpiar campos si no hay mapeo
    departamentoInput.value = "";
    departamentoInput.classList.remove("bg-green-50", "border-green-300");
    regionalInput.value = "";
    regionalInput.classList.remove("bg-green-50", "border-green-300");

    if (municipioSeleccionado) {
      console.log("No se encontró mapeo para municipio:", municipioSeleccionado);
      console.log("Municipios disponibles:", Object.keys(MUNICIPIO_MAPPING));
    }
  }

  // Actualizar circuitos después del municipio
  actualizarCircuitos();
}

/**
 * Función para actualizar circuitos según municipio seleccionado
 */
function actualizarCircuitos() {
  const municipioSeleccionado = document.getElementById("municipio").value;
  const alimentadorSelect = document.getElementById("alimentador");

  console.log("ActualizarCircuitos - Municipio seleccionado:", municipioSeleccionado);

  // Limpiar opciones existentes (excepto la primera)
  alimentadorSelect.innerHTML = '<option value="">Seleccionar alimentador</option>';

  if (municipioSeleccionado && MUNICIPIO_CIRCUITO_MAPPING[municipioSeleccionado]) {
    const circuitos = MUNICIPIO_CIRCUITO_MAPPING[municipioSeleccionado];

    // Agregar opciones de circuitos ordenadas
    circuitos.sort().forEach((circuito) => {
      const option = document.createElement("option");
      option.value = circuito;
      option.textContent = circuito;
      alimentadorSelect.appendChild(option);
    });

    // Agregar indicador visual
    alimentadorSelect.classList.add("bg-green-50", "border-green-300");

    console.log(`${circuitos.length} circuitos cargados para municipio:`, municipioSeleccionado);
  } else {
    // Remover indicador visual si no hay circuitos
    alimentadorSelect.classList.remove("bg-green-50", "border-green-300");

    if (municipioSeleccionado) {
      console.log("No se encontraron circuitos para municipio:", municipioSeleccionado);
    }
  }
}

/**
 * Función para autocompletar UC basado en selecciones de estructura nueva
 */
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

  const ucSelect = document.getElementById("uc_codigo");
  const descripcionUc = document.getElementById("descripcion_uc");

  // Autocompletar cuando se llenen algunos campos clave
  if (material && altura && poblacion && disposicion && tipoRed) {
    console.log("Todos los campos están llenos, buscando UC...");
    
    // Verificar si existe la función externa getUCFromStructure
    if (typeof getUCFromStructure === "function") {
      const suggestedUC = getUCFromStructure(material, altura, poblacion, disposicion, tipoRed);
      console.log("UC sugerido:", suggestedUC);

      if (suggestedUC) {
        ucSelect.value = suggestedUC;
        if (typeof UC_MAPPING !== "undefined" && UC_MAPPING[suggestedUC]) {
          descripcionUc.value = UC_MAPPING[suggestedUC];
        }
        
        // Agregar indicadores visuales
        ucSelect.classList.add("bg-green-50", "border-green-300");
        descripcionUc.classList.add("bg-green-50", "border-green-300");
        document.getElementById("uc_indicator").classList.remove("hidden");
      } else {
        console.log("No se encontró UC para la combinación especificada");
      }
    } else {
      console.warn("Función getUCFromStructure no disponible");
    }
  } else {
    // Si no todos los campos están llenos, limpiar UC
    console.log("Faltan campos por llenar, limpiando UC...");
    ucSelect.value = "";
    descripcionUc.value = "";
    ucSelect.classList.remove("bg-green-50", "border-green-300");
    descripcionUc.classList.remove("bg-green-50", "border-green-300");

    // Ocultar indicadores visuales
    document.getElementById("uc_indicator").classList.add("hidden");
  }
}

// Exportar funciones para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    autoCompleteBanco,
    actualizarContratos,
    actualizarMunicipiosPorContrato,
    autoCompleteMunicipio,
    actualizarCircuitos,
    autoCompleteUC
  };
}
