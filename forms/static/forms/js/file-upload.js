/**
 * File Upload Handler - Sistema de carga de archivos para FormPIR
 * Maneja la carga, preview y eliminación de archivos CAD y KMZ
 */

// Configuración global para archivos
const FILE_CONFIG = {
  archivo_cad: {
    accept: '.dwg,.dxf,.dws',
    maxSize: 10 * 1024 * 1024, // 10MB
    preview: 'cad_preview',
    filename: 'cad_filename',
    icon: 'fas fa-file-alt',
    color: 'blue'
  },
  archivo_kmz: {
    accept: '.kmz',
    maxSize: 10 * 1024 * 1024, // 10MB
    preview: 'kmz_preview',
    filename: 'kmz_filename',
    icon: 'fas fa-map-marked-alt',
    color: 'green'
  }
};

/**
 * Inicializar el sistema de carga de archivos
 */
function initializeFileUpload() {
  // Configurar event listeners para cada tipo de archivo
  Object.keys(FILE_CONFIG).forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input) {
      // Event listener para cambio de archivo
      input.addEventListener('change', function(e) {
        handleFileSelection(fieldId, e.target.files[0]);
      });
      
      // Event listener para drag & drop en el label
      const label = input.closest('label');
      if (label) {
        label.addEventListener('dragover', function(e) {
          e.preventDefault();
          label.classList.add('border-blue-400', 'bg-blue-50');
        });
        
        label.addEventListener('dragleave', function(e) {
          e.preventDefault();
          label.classList.remove('border-blue-400', 'bg-blue-50');
        });
        
        label.addEventListener('drop', function(e) {
          e.preventDefault();
          label.classList.remove('border-blue-400', 'bg-blue-50');
          
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            handleFileSelection(fieldId, files[0]);
            // Asignar el archivo al input
            const dt = new DataTransfer();
            dt.items.add(files[0]);
            input.files = dt.files;
          }
        });
      }
    }
  });
  
  console.log('✅ Sistema de carga de archivos inicializado');
}

/**
 * Manejar la selección de archivo
 */
function handleFileSelection(fieldId, file) {
  if (!file) return;
  
  const config = FILE_CONFIG[fieldId];
  if (!config) {
    console.error('Configuración no encontrada para:', fieldId);
    return;
  }
  
  // Validar tamaño de archivo
  if (file.size > config.maxSize) {
    alert(`El archivo es demasiado grande. Máximo permitido: ${formatFileSize(config.maxSize)}`);
    return;
  }
  
  // Validar tipo de archivo
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!config.accept.includes(fileExtension)) {
    alert(`Tipo de archivo no permitido. Tipos aceptados: ${config.accept}`);
    return;
  }
  
  // Mostrar preview del archivo
  showFilePreview(fieldId, file);
  
  console.log(`✅ Archivo seleccionado: ${file.name} (${formatFileSize(file.size)})`);
}

/**
 * Mostrar preview del archivo seleccionado
 */
function showFilePreview(fieldId, file) {
  const config = FILE_CONFIG[fieldId];
  const previewDiv = document.getElementById(config.preview);
  const filenameSpan = document.getElementById(config.filename);
  
  if (previewDiv && filenameSpan) {
    // Actualizar nombre del archivo
    filenameSpan.textContent = `${file.name} (${formatFileSize(file.size)})`;
    
    // Mostrar preview
    previewDiv.classList.remove('hidden');
    
    // Ocultar la zona de upload
    const input = document.getElementById(fieldId);
    const uploadZone = input?.closest('label');
    if (uploadZone) {
      uploadZone.classList.add('hidden');
    }
  }
}

/**
 * Remover archivo seleccionado
 */
function removeFile(fieldId) {
  const config = FILE_CONFIG[fieldId];
  if (!config) return;
  
  // Limpiar el input
  const input = document.getElementById(fieldId);
  if (input) {
    input.value = '';
  }
  
  // Ocultar preview
  const previewDiv = document.getElementById(config.preview);
  if (previewDiv) {
    previewDiv.classList.add('hidden');
  }
  
  // Mostrar zona de upload
  const uploadZone = input?.closest('label');
  if (uploadZone) {
    uploadZone.classList.remove('hidden');
  }
  
  console.log(`🗑️ Archivo removido: ${fieldId}`);
}

/**
 * Formatear tamaño de archivo
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validar todos los archivos antes del envío
 */
function validateAllFiles() {
  let isValid = true;
  const errors = [];
  
  Object.keys(FILE_CONFIG).forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input && input.required && !input.files.length) {
      errors.push(`El archivo ${fieldId.replace('archivo_', '').toUpperCase()} es requerido`);
      isValid = false;
    }
  });
  
  if (!isValid) {
    alert('Errores en archivos:\n' + errors.join('\n'));
  }
  
  return isValid;
}

// Exponer funciones globalmente
window.initializeFileUpload = initializeFileUpload;
window.removeFile = removeFile;
window.validateAllFiles = validateAllFiles;

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Dar tiempo para que se carguen otros scripts
  setTimeout(initializeFileUpload, 100);
});
