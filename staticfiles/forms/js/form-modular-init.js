// form-modular-init.js - Inicialización específica para el formulario modular

document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicializando formulario modular...');
  
  // 1. Configurar navegación entre secciones
  if (typeof setupNavigation === 'function') {
    setupNavigation();
  }
  
  // 2. Configurar sincronización de campos
  if (typeof setupFieldSynchronization === 'function') {
    setupFieldSynchronization();
  }
  
  // 3. Configurar autocompletado
  if (typeof setupAutocompletion === 'function') {
    setupAutocompletion();
  }
  
  // 4. Configurar file drop zones para cada sección
  setupFileDropZones();
  
  // 5. Configurar validaciones específicas
  setupFormValidation();
  
  // 6. Configurar tooltips
  setupTooltips();
  
  console.log('Formulario modular inicializado correctamente');
});

// Configurar file drop zones para todas las secciones
function setupFileDropZones() {
  const fileInputs = [
    // Estructuras
    { input: 'archivo_cad', preview: 'cad_preview', required: true },
    { input: 'archivo_kmz', preview: 'kmz_preview', required: true },
    { input: 'fotos_nueva', preview: 'preview_nueva', required: true, multiple: true },
    
    // Conductor N1
    { input: 'conductor_n1_archivo_cad', preview: 'conductor_n1_cad_preview', required: true },
    { input: 'conductor_n1_archivo_kmz', preview: 'conductor_n1_kmz_preview', required: true },
    { input: 'conductor_n1_fotos_conductor', preview: 'conductor_n1_preview_conductor', required: true, multiple: true },
    
    // Conductor N2-N3
    { input: 'conductor_n2_n3_archivo_cad', preview: 'conductor_n2_n3_cad_preview', required: true },
    { input: 'conductor_n2_n3_archivo_kmz', preview: 'conductor_n2_n3_kmz_preview', required: true },
    { input: 'conductor_n2_n3_fotos_conductor_n2_n3', preview: 'conductor_n2_n3_preview_conductor_n2_n3', required: true, multiple: true },
    
    // Equipos
    { input: 'equipos_archivo_cad', preview: 'equipos_cad_preview', required: true },
    { input: 'equipos_archivo_kmz', preview: 'equipos_kmz_preview', required: true },
    { input: 'equipos_fotos_equipo', preview: 'equipos_preview_equipo', required: true, multiple: true },
    
    // Transformador
    { input: 'transformador_archivo_cad', preview: 'transformador_cad_preview', required: true },
    { input: 'transformador_archivo_kmz', preview: 'transformador_kmz_preview', required: true },
    { input: 'fotos_transformador', preview: 'preview_transformador', required: true, multiple: true }
  ];
  
  fileInputs.forEach(config => {
    if (typeof setupFileDropZone === 'function') {
      setupFileDropZone(config.input, config.preview, config.required, config.multiple);
    }
  });
}

// Configurar validaciones específicas del formulario modular
function setupFormValidation() {
  const form = document.getElementById('mainForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar campos sincronizados
    const syncValidation = validateSynchronizedFields();
    if (!syncValidation.isValid) {
      showValidationErrors(syncValidation.errors);
      return false;
    }
    
    // Validar sección actual
    const currentSection = getCurrentSection();
    if (!validateCurrentSection(currentSection)) {
      return false;
    }
    
    // Si todas las validaciones pasan, enviar formulario
    console.log('Formulario válido, enviando...');
    this.submit();
  });
}

// Obtener la sección actual visible
function getCurrentSection() {
  const sections = document.querySelectorAll('[data-form-section]');
  for (let section of sections) {
    if (section.style.display !== 'none') {
      return section.getAttribute('data-form-section');
    }
  }
  return 'estructuras'; // fallback
}

// Validar la sección actual
function validateCurrentSection(sectionName) {
  const section = document.querySelector(`[data-form-section="${sectionName}"]`);
  if (!section) return true;
  
  const requiredFields = section.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('border-red-500');
      isValid = false;
    } else {
      field.classList.remove('border-red-500');
    }
  });
  
  if (!isValid) {
    showMessage('Por favor complete todos los campos requeridos en esta sección', 'error');
  }
  
  return isValid;
}

// Mostrar errores de validación
function showValidationErrors(errors) {
  const errorMsg = 'Errores de validación:\n' + errors.join('\n');
  showMessage(errorMsg, 'error');
}

// Mostrar mensaje al usuario
function showMessage(message, type = 'info') {
  // Crear o actualizar elemento de mensaje
  let messageEl = document.getElementById('form-message');
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.id = 'form-message';
    messageEl.className = 'fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg z-50';
    document.body.appendChild(messageEl);
  }
  
  // Aplicar estilos según el tipo
  messageEl.className = 'fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg z-50 ';
  if (type === 'error') {
    messageEl.className += 'bg-red-100 border border-red-300 text-red-700';
  } else if (type === 'success') {
    messageEl.className += 'bg-green-100 border border-green-300 text-green-700';
  } else {
    messageEl.className += 'bg-blue-100 border border-blue-300 text-blue-700';
  }
  
  messageEl.innerHTML = `
    <div class="flex items-start">
      <div class="flex-grow">
        <p class="text-sm font-medium">${message}</p>
      </div>
      <button type="button" class="ml-4 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    if (messageEl.parentElement) {
      messageEl.remove();
    }
  }, 5000);
}

// Configurar tooltips
function setupTooltips() {
  const tooltips = document.querySelectorAll('.tooltip');
  tooltips.forEach(tooltip => {
    const trigger = tooltip.querySelector('.help-icon');
    const content = tooltip.querySelector('.tooltip-content');
    
    if (trigger && content) {
      trigger.addEventListener('mouseenter', () => {
        content.style.visibility = 'visible';
        content.style.opacity = '1';
      });
      
      trigger.addEventListener('mouseleave', () => {
        content.style.visibility = 'hidden';
        content.style.opacity = '0';
      });
    }
  });
}

// Función para limpiar formulario
function resetForm() {
  if (confirm('¿Está seguro de que desea limpiar todo el formulario?')) {
    document.getElementById('mainForm').reset();
    resetSynchronizedFields();
    navigateToStep('estructuras');
    showMessage('Formulario limpiado correctamente', 'success');
  }
}

// Exponer funciones globalmente
window.resetForm = resetForm;
window.showMessage = showMessage;
