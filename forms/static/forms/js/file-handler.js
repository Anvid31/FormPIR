/**
 * DESS - Manejo de Archivos y Drag & Drop
 * Contiene todas las funciones para upload y preview de archivos
 */

/**
 * Función para configurar zonas de drag & drop
 * @param {string} inputId - ID del input de archivo
 * @param {string} previewId - ID del contenedor de preview
 * @param {boolean} isImage - Si es un archivo de imagen o documento
 */
function setupFileDropZone(inputId, previewId, isImage) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  
  // Validar que los elementos existan
  if (!input) {
    console.warn(`No se encontró el elemento input con ID: ${inputId}`);
    return;
  }
  
  if (!preview) {
    console.warn(`No se encontró el elemento preview con ID: ${previewId}`);
    return;
  }
  
  const dropZone = input.closest(".file-drop-zone");

  if (!dropZone) {
    console.warn(`No se encontró el contenedor .file-drop-zone para el input: ${inputId}`);
    return;
  }

  // Eventos de drag & drop
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("border-blue-500", "bg-blue-50/50");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("border-blue-500", "bg-blue-50/50");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("border-blue-500", "bg-blue-50/50");
    handleFiles(e.dataTransfer.files, isImage, preview, input);
  });

  // Eventos de click y change
  dropZone.addEventListener("click", () => input.click());
  input.addEventListener("change", () =>
    handleFiles(input.files, isImage, preview, input)
  );

  console.log(`Drop zone configurado para: ${inputId}`);
}

/**
 * Función para manejar archivos cargados
 * @param {FileList} files - Lista de archivos
 * @param {boolean} isImage - Si son imágenes o documentos
 * @param {HTMLElement} preview - Elemento de preview
 * @param {HTMLInputElement} input - Input de archivo
 */
function handleFiles(files, isImage, preview, input) {
  if (isImage) {
    handleImageFiles(files, preview);
  } else {
    handleDocumentFile(files[0], preview, input);
  }
}

/**
 * Función para manejar archivos de imagen
 * @param {FileList} files - Lista de archivos de imagen
 * @param {HTMLElement} preview - Elemento de preview
 */
function handleImageFiles(files, preview) {
  preview.innerHTML = "";
  
  Array.from(files).forEach((file) => {
    // Validar que sea imagen y tamaño máximo 5MB
    if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imgContainer = document.createElement("div");
        imgContainer.className = "relative inline-block m-2";
        
        imgContainer.innerHTML = `
          <img src="${e.target.result}" 
               alt="Preview" 
               class="w-20 h-20 object-cover rounded border border-gray-300 shadow-sm">
          <button type="button" 
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  onclick="this.parentElement.remove()">
            ×
          </button>
          <div class="text-xs text-gray-600 mt-1 max-w-20 truncate" title="${file.name}">
            ${file.name}
          </div>
        `;
        
        preview.appendChild(imgContainer);
      };
      
      reader.readAsDataURL(file);
    } else if (file.size > 5 * 1024 * 1024) {
      alert(`La imagen ${file.name} excede el tamaño máximo de 5MB. Tamaño actual: ${formatFileSize(file.size)}`);
    } else {
      alert(`El archivo ${file.name} no es una imagen válida.`);
    }
  });
}

/**
 * Función para manejar archivos de documento (CAD/KMZ)
 * @param {File} file - Archivo de documento
 * @param {HTMLElement} preview - Elemento de preview
 * @param {HTMLInputElement} input - Input de archivo
 */
function handleDocumentFile(file, preview, input) {
  if (!file) return;

  console.log("Procesando archivo de documento:", file.name, "Tipo:", file.type, "Tamaño:", file.size);

  // Validar tamaño máximo de 10MB para documentos
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    alert(`El archivo ${file.name} excede el tamaño máximo de 10MB. Tamaño actual: ${formatFileSize(file.size)}`);
    if (input) input.value = "";
    return;
  }

  // Actualizar elementos de preview
  const previewId = preview.id;
  const filename = document.getElementById(previewId.replace("preview", "filename"));
  const filesize = document.getElementById(previewId.replace("preview", "filesize"));
  const removeBtn = document.getElementById(previewId.replace("preview", "remove"));

  console.log("Elementos encontrados:", {
    filename: filename ? "✓" : "✗",
    filesize: filesize ? "✓" : "✗", 
    removeBtn: removeBtn ? "✓" : "✗"
  });

  if (filename) filename.textContent = file.name;
  if (filesize) filesize.textContent = formatFileSize(file.size);
  
  if (removeBtn) {
    // Remover listener previo si existe
    removeBtn.replaceWith(removeBtn.cloneNode(true));
    const newRemoveBtn = document.getElementById(previewId.replace("preview", "remove"));
    
    newRemoveBtn.addEventListener("click", () => {
      preview.classList.add("hidden");
      if (input) input.value = "";
      console.log("Archivo removido");
    });
  }

  // Mostrar el preview
  preview.classList.remove("hidden");
  
  console.log("Archivo de documento cargado exitosamente:", file.name, "Tamaño:", formatFileSize(file.size));
}

/**
 * Función para formatear tamaño de archivo
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} - Tamaño formateado
 */
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Función para inicializar todas las zonas de drop
 */
function initializeFileDropZones() {
  // Setup file upload for estructura nueva
  setupFileDropZone("fotos_nueva", "preview_nueva", true);

  // Setup file uploads for conductores
  setupFileDropZone("fotos_conductor", "preview_conductor", true);
  setupFileDropZone("fotos_conductor_n2_n3", "preview_conductor_n2_n3", true);

  // Setup file uploads for documentos
  setupFileDropZone("archivo_cad", "cad_preview", false);
  setupFileDropZone("archivo_kmz", "kmz_preview", false);

  console.log("Todas las zonas de drop inicializadas");
}

// Exportar funciones para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setupFileDropZone,
    handleFiles,
    handleImageFiles,
    handleDocumentFile,
    formatFileSize,
    initializeFileDropZones
  };
}
