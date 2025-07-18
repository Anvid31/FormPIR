// form-synchronization.js - Manejo de sincronización entre secciones

// Configuración de campos que se sincronizan entre secciones
const SYNC_FIELDS_CONFIG = {
  // Campos de la sección estructuras que se sincronizan a otras secciones
  'nombre': {
    readonly_targets: [
      'conductor_n1_nombre_proyecto',
      'conductor_n2_n3_nombre_proyecto', 
      'equipos_nombre_proyecto',
      'transformador_nombre_proyecto'
    ]
  },
  'banco_proyecto': {
    readonly_targets: [
      'conductor_n1_banco_proyecto',
      'conductor_n2_n3_banco_proyecto',
      'equipos_banco_proyecto', 
      'transformador_banco_proyecto'
    ]
  },
  'contrato': {
    readonly_targets: [
      'conductor_n1_contrato',
      'conductor_n2_n3_contrato',
      'equipos_contrato',
      'transformador_contrato'
    ]
  },
  'fecha': {
    readonly_targets: [
      'conductor_n1_fecha',
      'conductor_n2_n3_fecha',
      'equipos_fecha',
      'transformador_fecha'
    ],
    format: 'date'
  },
  'nivel_tension': {
    readonly_targets: [
      'conductor_n1_nivel_tension',
      'conductor_n2_n3_nivel_tension',
      'equipos_nivel_tension',
      'transformador_nivel_tension'
    ],
    format: 'select'
  },
  't_inv': {
    readonly_targets: [
      'conductor_n1_t_inv',
      'conductor_n2_n3_t_inv',
      'equipos_t_inv',
      'transformador_t_inv'
    ]
  },
  'municipio': {
    readonly_targets: [
      'conductor_n1_municipio',
      'conductor_n2_n3_municipio',
      'equipos_municipio',
      'transformador_municipio'
    ],
    format: 'select'
  },
  'departamento': {
    readonly_targets: [
      'conductor_n1_departamento',
      'conductor_n2_n3_departamento',
      'equipos_departamento',
      'transformador_departamento'
    ]
  },
  'regional': {
    readonly_targets: [
      'conductor_n1_regional',
      'conductor_n2_n3_regional',
      'equipos_regional',
      'transformador_regional'
    ],
    format: 'select'
  }
};

// Función para configurar la sincronización de campos
function setupFieldSynchronization() {
  console.log('Configurando sincronización de campos entre secciones...');
  
  Object.keys(SYNC_FIELDS_CONFIG).forEach(fieldId => {
    const mainField = document.getElementById(fieldId);
    if (!mainField) {
      console.warn(`Campo principal no encontrado: ${fieldId}`);
      return;
    }

    const config = SYNC_FIELDS_CONFIG[fieldId];
    
    // Función para sincronizar valores
    const syncField = () => {
      let displayValue = mainField.value;
      
      // Formatear el valor según el tipo de campo
      if (config.format === 'select' && mainField.selectedOptions[0]) {
        displayValue = mainField.selectedOptions[0].text;
      } else if (config.format === 'date' && displayValue) {
        // Convertir fecha a formato legible si es necesario
        const date = new Date(displayValue);
        if (!isNaN(date.getTime())) {
          displayValue = date.toLocaleDateString('es-ES');
        }
      }

      // Actualizar campos de solo lectura
      config.readonly_targets.forEach(targetId => {
        const targetField = document.getElementById(targetId);
        if (targetField) {
          targetField.value = displayValue;
          
          // Agregar indicador visual cuando el campo tiene valor
          if (displayValue) {
            targetField.classList.add('bg-blue-50', 'border-blue-300');
          } else {
            targetField.classList.remove('bg-blue-50', 'border-blue-300');
          }
        }
      });
    };

    // Agregar listeners de eventos
    mainField.addEventListener('change', syncField);
    mainField.addEventListener('input', syncField);

    // Sincronizar inmediatamente si ya hay valor
    if (mainField.value) {
      syncField();
    }
  });

  console.log('Sincronización de campos configurada correctamente');
}

// Función para validar que los campos sincronizados tengan valores coherentes
function validateSynchronizedFields() {
  let isValid = true;
  const errors = [];

  Object.keys(SYNC_FIELDS_CONFIG).forEach(fieldId => {
    const mainField = document.getElementById(fieldId);
    if (!mainField || !mainField.required) return;

    const config = SYNC_FIELDS_CONFIG[fieldId];
    const mainValue = mainField.value;

    if (!mainValue) {
      errors.push(`El campo ${fieldId} es requerido y afecta a otras secciones`);
      isValid = false;
      return;
    }

    // Validar que todos los campos sincronizados tengan el mismo valor
    config.readonly_targets.forEach(targetId => {
      const targetField = document.getElementById(targetId);
      if (targetField && targetField.value !== mainValue) {
        console.warn(`Inconsistencia detectada: ${fieldId} vs ${targetId}`);
        // Forzar resincronización
        setupFieldSynchronization();
      }
    });
  });

  if (!isValid) {
    console.error('Errores de validación en campos sincronizados:', errors);
  }

  return {
    isValid,
    errors
  };
}

// Función para resetear todos los campos sincronizados
function resetSynchronizedFields() {
  Object.keys(SYNC_FIELDS_CONFIG).forEach(fieldId => {
    const mainField = document.getElementById(fieldId);
    if (mainField) {
      mainField.value = '';
      
      const config = SYNC_FIELDS_CONFIG[fieldId];
      config.readonly_targets.forEach(targetId => {
        const targetField = document.getElementById(targetId);
        if (targetField) {
          targetField.value = '';
          targetField.classList.remove('bg-blue-50', 'border-blue-300');
        }
      });
    }
  });
  
  console.log('Campos sincronizados reseteados');
}

// Función para obtener todos los datos sincronizados
function getSynchronizedData() {
  const data = {};
  
  Object.keys(SYNC_FIELDS_CONFIG).forEach(fieldId => {
    const mainField = document.getElementById(fieldId);
    if (mainField) {
      data[fieldId] = {
        value: mainField.value,
        displayValue: mainField.tagName === 'SELECT' && mainField.selectedOptions[0] 
          ? mainField.selectedOptions[0].text 
          : mainField.value
      };
    }
  });
  
  return data;
}

// Exportar funciones para uso global
window.setupFieldSynchronization = setupFieldSynchronization;
window.validateSynchronizedFields = validateSynchronizedFields;
window.resetSynchronizedFields = resetSynchronizedFields;
window.getSynchronizedData = getSynchronizedData;
