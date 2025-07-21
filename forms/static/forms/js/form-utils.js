/**
 * DESS - Utilidades de Formulario para Secciones Independientes
 * Contiene funciones comunes para dropzones y validaciones
 */

/**
 * Función para configurar zonas de drag & drop
 */
function setupFileDropZone(inputId, previewId, allowMultiple = false) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  
  if (!input || !preview) {
    console.warn(`⚠️ No se encontraron elementos: ${inputId}, ${previewId}`);
    return;
  }

  // Configurar el input
  input.multiple = allowMultiple;
  
  // Event listener para cambio de archivos
  input.addEventListener('change', function(e) {
    handleFilePreview(this, preview, allowMultiple);
  });

  // Configurar drag & drop
  const dropZone = input.parentElement;
  
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
}

/**
 * Función para manejar vista previa de archivos
 */
function handleFilePreview(input, preview, allowMultiple) {
  preview.innerHTML = '';
  
  const files = Array.from(input.files);
  if (files.length === 0) return;

  files.forEach((file, index) => {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'flex items-center justify-between bg-gray-50 p-2 rounded mt-1';
    
    const fileName = document.createElement('span');
    fileName.textContent = file.name;
    fileName.className = 'text-sm text-gray-700 flex-1 truncate';
    
    const fileSize = document.createElement('span');
    fileSize.textContent = formatFileSize(file.size);
    fileSize.className = 'text-xs text-gray-500 ml-2';
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.className = 'ml-2 text-red-500 hover:text-red-700 font-bold';
    removeBtn.type = 'button';
    removeBtn.onclick = () => removeFile(input, index, preview, allowMultiple);
    
    fileDiv.appendChild(fileName);
    fileDiv.appendChild(fileSize);
    fileDiv.appendChild(removeBtn);
    preview.appendChild(fileDiv);
  });
}

/**
 * Función para remover un archivo específico
 */
function removeFile(input, index, preview, allowMultiple) {
  const dt = new DataTransfer();
  const files = Array.from(input.files);
  
  files.forEach((file, i) => {
    if (i !== index) {
      dt.items.add(file);
    }
  });
  
  input.files = dt.files;
  handleFilePreview(input, preview, allowMultiple);
}

/**
 * Función para formatear el tamaño del archivo
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Función para validar coordenadas
 */
function validateCoordinate(input, type) {
  const value = parseFloat(input.value);
  
  if (isNaN(value)) {
    input.setCustomValidity('Por favor ingrese un número válido');
    return;
  }
  
  if (type === 'lat') {
    if (value < -90 || value > 90) {
      input.setCustomValidity('La latitud debe estar entre -90 y 90 grados');
      return;
    }
  } else if (type === 'lng') {
    if (value < -180 || value > 180) {
      input.setCustomValidity('La longitud debe estar entre -180 y 180 grados');
      return;
    }
  }
  
  input.setCustomValidity('');
}

/**
 * Función para inicializar la fecha máxima (hoy)
 */
function initializeDateFields() {
  const today = new Date().toISOString().split('T')[0];
  const dateFields = document.querySelectorAll('input[type="date"]');
  
  dateFields.forEach(field => {
    if (!field.hasAttribute('max')) {
      field.max = today;
    }
  });
}

/**
 * Función para mostrar mensajes al usuario
 */
function showMessage(message, type = 'info') {
  // Crear elemento de mensaje
  const messageDiv = document.createElement('div');
  messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm`;
  
  // Aplicar estilos según el tipo
  switch(type) {
    case 'success':
      messageDiv.className += ' bg-green-100 border border-green-400 text-green-700';
      break;
    case 'error':
      messageDiv.className += ' bg-red-100 border border-red-400 text-red-700';
      break;
    case 'warning':
      messageDiv.className += ' bg-yellow-100 border border-yellow-400 text-yellow-700';
      break;
    default:
      messageDiv.className += ' bg-blue-100 border border-blue-400 text-blue-700';
  }
  
  messageDiv.textContent = message;
  
  // Agregar al documento
  document.body.appendChild(messageDiv);
  
  // Remover después de 5 segundos
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 5000);
}

// Inicializar funciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  initializeDateFields();
});

// Exponer funciones globalmente
window.setupFileDropZone = setupFileDropZone;
window.handleFilePreview = handleFilePreview;
window.validateCoordinate = validateCoordinate;
window.showMessage = showMessage;

console.log('✅ Utilidades de formulario cargadas correctamente');
