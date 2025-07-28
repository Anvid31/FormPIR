/**
 * Sistema de Iteraciones Compartidas - FormPIR
 * Gestiona iteraciones entre las 4 secciones: Estructuras, Conductores, Equipos, Transformadores
 * @version 1.0.0
 */

// Verificar si IteracionesManager ya existe para evitar redeclaración
if (typeof window.IteracionesManager === 'undefined') {
    class IteracionesManager {
        constructor() {
            this.iteraciones = []; // Array que contendrá todas las iteraciones
            this.contadorIteraciones = 0;
            this.seccionActiva = null;
            this.inicializar();
        }

        inicializar() {
            console.log('🔄 Inicializando Sistema de Iteraciones Compartidas');
            this.crearTablaIteraciones();
            this.configurarEventListeners();
            this.cargarIteracionesGuardadas();
        }

        /**
         * Crea la tabla de iteraciones que se mostrará en todas las secciones
         */
        crearTablaIteraciones() {
        const tablaHTML = `
        <div id="tabla-iteraciones-container" class="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                    <i class="fas fa-table mr-2 text-blue-600"></i>
                    Tabla de Iteraciones
                </h3>
                <button id="btn-agregar-iteracion" class="btn-primary flex items-center">
                    <i class="fas fa-plus mr-2"></i>
                    Agregar Iteración
                </button>
            </div>
            
            <div class="overflow-x-auto">
                <table id="tabla-iteraciones" class="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                #
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Estructura Retirada
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Descripción Estructura
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                UC Nueva
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Descripción UC
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Fotos
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Sección
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody id="tabla-iteraciones-body" class="bg-white divide-y divide-gray-200">
                        <!-- Las iteraciones se agregarán aquí dinámicamente -->
                    </tbody>
                </table>
            </div>
            
            <div id="no-iteraciones-message" class="text-center py-8 text-gray-500">
                <i class="fas fa-info-circle text-4xl mb-2"></i>
                <p>No hay iteraciones agregadas. Haz clic en "Agregar Iteración" para comenzar.</p>
            </div>
        </div>
        `;

        // Insertar la tabla AL FINAL del contenido, no al principio
        const contenedor = document.querySelector('.form-section') || 
                          document.querySelector('#form-total') || 
                          document.body;
        
        if (contenedor) {
            contenedor.insertAdjacentHTML('beforeend', tablaHTML);
            console.log('✅ Tabla de iteraciones insertada al final del contenido');
        } else {
            console.warn('⚠️ No se encontró contenedor para la tabla de iteraciones');
        }
    }

    /**
     * Configura los event listeners principales
     */
    configurarEventListeners() {
        // Botón agregar iteración
        document.addEventListener('click', (e) => {
            if (e.target.id === 'btn-agregar-iteracion' || e.target.closest('#btn-agregar-iteracion')) {
                this.mostrarModalIteracion();
            }
        });

        // Detectar cambio de sección
        this.detectarCambioSeccion();
    }

    /**
     * Detecta cuando el usuario cambia de sección (tab)
     */
    detectarCambioSeccion() {
        // Escuchar cambios en tabs si existen
        const tabs = document.querySelectorAll('[role="tab"], .tab-button, .nav-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                setTimeout(() => {
                    this.actualizarSeccionActiva();
                    this.sincronizarTabla();
                }, 100);
            });
        });

        // También detectar por URL o cambios en el DOM
        const observer = new MutationObserver(() => {
            this.actualizarSeccionActiva();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    /**
     * Actualiza cuál es la sección actualmente visible
     */
    actualizarSeccionActiva() {
        const secciones = ['estructuras', 'conductores', 'equipos', 'transformadores'];
        
        for (const seccion of secciones) {
            const elemento = document.querySelector(`#${seccion}`) || 
                           document.querySelector(`[data-section="${seccion}"]`) ||
                           document.querySelector(`.${seccion}-section`);
            
            if (elemento && this.esVisible(elemento)) {
                if (this.seccionActiva !== seccion) {
                    this.seccionActiva = seccion;
                    console.log(`📍 Sección activa: ${seccion}`);
                    this.sincronizarTabla();
                }
                break;
            }
        }
    }

    /**
     * Establece manualmente la sección activa
     * @param {string} seccion - Nombre de la sección (estructuras, conductores, equipos, transformadores)
     */
    setSeccionActiva(seccion) {
        if (['estructuras', 'conductores', 'equipos', 'transformadores'].includes(seccion)) {
            this.seccionActiva = seccion;
            console.log(`🎯 Sección activa establecida manualmente: ${seccion}`);
            this.sincronizarTabla();
        } else {
            console.warn(`⚠️ Sección no válida: ${seccion}`);
        }
    }

    /**
     * Verifica si un elemento es visible
     */
    esVisible(elemento) {
        const rect = elemento.getBoundingClientRect();
        const style = getComputedStyle(elemento);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               rect.width > 0 && 
               rect.height > 0;
    }

    /**
     * Muestra el modal para agregar/editar iteración
     */
    mostrarModalIteracion(iteracionId = null) {
        const isEditar = iteracionId !== null;
        const iteracion = isEditar ? this.obtenerIteracion(iteracionId) : null;

        const modalHTML = `
        <div id="modal-iteracion" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">
                        ${isEditar ? 'Editar' : 'Agregar'} Iteración
                    </h3>
                    <button id="cerrar-modal" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <form id="form-iteracion" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group">
                            <label class="form-label required">Estructura Retirada</label>
                            <input 
                                type="text" 
                                id="estructura-retirada" 
                                name="estructura_retirada"
                                class="form-input" 
                                placeholder="Código de estructura"
                                value="${iteracion?.estructuraRetirada || ''}"
                                required
                            >
                            <small class="text-gray-500">Se autocompletará la descripción automáticamente</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Descripción Estructura</label>
                            <input 
                                type="text" 
                                id="descripcion-estructura" 
                                name="descripcion_estructura"
                                class="form-input bg-gray-50" 
                                placeholder="Se autocompletará..."
                                value="${iteracion?.descripcionEstructura || ''}"
                                readonly
                            >
                        </div>

                        <div class="form-group">
                            <label class="form-label required">UC Nueva</label>
                            <input 
                                type="text" 
                                id="uc-nueva" 
                                name="uc_nueva"
                                class="form-input" 
                                placeholder="Código UC nueva"
                                value="${iteracion?.ucNueva || ''}"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label class="form-label required">Descripción UC</label>
                            <input 
                                type="text" 
                                id="descripcion-uc" 
                                name="descripcion_uc"
                                class="form-input" 
                                placeholder="Descripción de la UC nueva"
                                value="${iteracion?.descripcionUC || ''}"
                                required
                            >
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Fotos</label>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <input 
                                type="file" 
                                id="fotos-iteracion" 
                                name="fotos"
                                class="hidden" 
                                multiple 
                                accept="image/*"
                            >
                            <div class="text-center">
                                <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                <p class="text-gray-600">
                                    <button type="button" onclick="document.getElementById('fotos-iteracion').click()" 
                                            class="text-blue-600 hover:text-blue-700">
                                        Seleccionar fotos
                                    </button>
                                    o arrastra y suelta aquí
                                </p>
                                <p class="text-sm text-gray-500 mt-1">PNG, JPG hasta 10MB cada una</p>
                            </div>
                            <div id="preview-fotos" class="mt-4 grid grid-cols-3 gap-2">
                                <!-- Preview de fotos se mostrará aquí -->
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" id="cancelar-iteracion" class="btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" class="btn-primary">
                            ${isEditar ? 'Actualizar' : 'Agregar'} Iteración
                        </button>
                    </div>
                </form>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.configurarModalEventListeners(iteracionId);
    }

    /**
     * Configura los event listeners del modal
     */
    configurarModalEventListeners(iteracionId) {
        const modal = document.getElementById('modal-iteracion');
        const form = document.getElementById('form-iteracion');
        const estructuraInput = document.getElementById('estructura-retirada');
        const fotosInput = document.getElementById('fotos-iteracion');

        // Cerrar modal
        const cerrarModal = () => {
            modal.remove();
        };

        document.getElementById('cerrar-modal').addEventListener('click', cerrarModal);
        document.getElementById('cancelar-iteracion').addEventListener('click', cerrarModal);

        // Cerrar con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') cerrarModal();
        });

        // Autocompletar descripción de estructura
        estructuraInput.addEventListener('blur', () => {
            this.autocompletarDescripcionEstructura(estructuraInput.value);
        });

        // Preview de fotos
        fotosInput.addEventListener('change', (e) => {
            this.mostrarPreviewFotos(e.target.files);
        });

        // Submit del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarIteracion(form, iteracionId);
            cerrarModal();
        });
    }

    /**
     * Autocompleta la descripción de la estructura usando consulta SQL simulada
     */
    async autocompletarDescripcionEstructura(codigoEstructura) {
        if (!codigoEstructura) return;

        const descripcionInput = document.getElementById('descripcion-estructura');
        descripcionInput.value = 'Consultando...';

        try {
            // Simular consulta SQL a la base de datos
            // En producción, esto sería una llamada real a la API/base de datos
            const descripcion = await this.consultarDescripcionEstructura(codigoEstructura);
            
            descripcionInput.value = descripcion;
            descripcionInput.classList.add('bg-green-50', 'border-green-300');
            
            console.log('✅ Descripción autocompletada:', descripcion);
        } catch (error) {
            descripcionInput.value = 'No encontrada';
            descripcionInput.classList.add('bg-red-50', 'border-red-300');
            console.warn('⚠️ No se pudo obtener descripción para:', codigoEstructura);
        }
    }

    /**
     * Simula consulta SQL para obtener descripción de estructura
     * En producción, esto sería una llamada real a la base de datos
     */
    async consultarDescripcionEstructura(codigo) {
        // Simular delay de consulta SQL
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mapeo simulado de estructuras (esto vendría de la base de datos)
        const estructuras = {
            'EST001': 'Poste de concreto 12m - Tipo H',
            'EST002': 'Estructura metálica - Torre de suspensión',
            'EST003': 'Poste de madera 10m - Tipo A',
            'EST004': 'Estructura de anclaje - Concreto armado',
            'EST005': 'Torre de transmisión 115kV',
            'N1E001': 'Estructura unipolar de concreto',
            'N2E002': 'Estructura bipolar metalica',
            'N3E003': 'Estructura tripolar suspension',
            'N4E004': 'Torre lattice transmision'
        };

        const descripcion = estructuras[codigo.toUpperCase()];
        if (!descripcion) {
            throw new Error('Estructura no encontrada en base de datos');
        }

        return descripcion;
    }

    /**
     * Muestra preview de las fotos seleccionadas
     */
    mostrarPreviewFotos(archivos) {
        const preview = document.getElementById('preview-fotos');
        preview.innerHTML = '';

        Array.from(archivos).forEach((archivo, index) => {
            if (archivo.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const div = document.createElement('div');
                    div.className = 'relative';
                    div.innerHTML = `
                        <img src="${e.target.result}" class="w-full h-20 object-cover rounded border">
                        <button type="button" onclick="this.parentElement.remove()" 
                                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            ×
                        </button>
                        <p class="text-xs text-center mt-1 truncate">${archivo.name}</p>
                    `;
                    preview.appendChild(div);
                };
                reader.readAsDataURL(archivo);
            }
        });
    }

    /**
     * Guarda una iteración (nueva o editada)
     */
    guardarIteracion(form, iteracionId = null) {
        const formData = new FormData(form);
        const fotos = Array.from(document.getElementById('fotos-iteracion').files);

        const iteracion = {
            id: iteracionId || `iter_${++this.contadorIteraciones}`,
            estructuraRetirada: formData.get('estructura_retirada'),
            descripcionEstructura: formData.get('descripcion_estructura'),
            ucNueva: formData.get('uc_nueva'),
            descripcionUC: formData.get('descripcion_uc'),
            fotos: fotos,
            seccion: this.seccionActiva || 'general',
            fechaCreacion: iteracionId ? this.obtenerIteracion(iteracionId).fechaCreacion : new Date(),
            fechaModificacion: new Date()
        };

        if (iteracionId) {
            // Editar iteración existente
            const index = this.iteraciones.findIndex(iter => iter.id === iteracionId);
            if (index !== -1) {
                this.iteraciones[index] = iteracion;
                console.log('✅ Iteración actualizada:', iteracion);
            }
        } else {
            // Agregar nueva iteración
            this.iteraciones.push(iteracion);
            console.log('✅ Nueva iteración agregada:', iteracion);
        }

        this.sincronizarTabla();
        this.guardarIteracionesLocalStorage();
    }

    /**
     * Sincroniza la tabla con las iteraciones actuales
     */
    sincronizarTabla() {
        const tbody = document.getElementById('tabla-iteraciones-body');
        const noMessage = document.getElementById('no-iteraciones-message');
        
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.iteraciones.length === 0) {
            noMessage.style.display = 'block';
            return;
        }

        noMessage.style.display = 'none';

        this.iteraciones.forEach((iteracion, index) => {
            const fila = document.createElement('tr');
            fila.className = 'hover:bg-gray-50';
            fila.innerHTML = `
                <td class="px-4 py-3 text-sm text-gray-900">${index + 1}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${iteracion.estructuraRetirada}</td>
                <td class="px-4 py-3 text-sm text-gray-600 max-w-xs truncate" title="${iteracion.descripcionEstructura}">
                    ${iteracion.descripcionEstructura}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">${iteracion.ucNueva}</td>
                <td class="px-4 py-3 text-sm text-gray-600 max-w-xs truncate" title="${iteracion.descripcionUC}">
                    ${iteracion.descripcionUC}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ${iteracion.fotos.length} foto${iteracion.fotos.length !== 1 ? 's' : ''}
                    </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        ${iteracion.seccion}
                    </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                    <div class="flex space-x-2">
                        <button onclick="iteracionesManager.editarIteracion('${iteracion.id}')" 
                                class="text-blue-600 hover:text-blue-900" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="iteracionesManager.verFotos('${iteracion.id}')" 
                                class="text-green-600 hover:text-green-900" title="Ver fotos">
                            <i class="fas fa-images"></i>
                        </button>
                        <button onclick="iteracionesManager.eliminarIteracion('${iteracion.id}')" 
                                class="text-red-600 hover:text-red-900" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(fila);
        });
    }

    /**
     * Edita una iteración existente
     */
    editarIteracion(iteracionId) {
        this.mostrarModalIteracion(iteracionId);
    }

    /**
     * Muestra las fotos de una iteración
     */
    verFotos(iteracionId) {
        const iteracion = this.obtenerIteracion(iteracionId);
        if (!iteracion || iteracion.fotos.length === 0) {
            alert('No hay fotos disponibles para esta iteración.');
            return;
        }

        // Crear modal para mostrar fotos
        const modalHTML = `
        <div id="modal-fotos" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 max-w-4xl max-h-screen overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">
                        Fotos - ${iteracion.estructuraRetirada} → ${iteracion.ucNueva}
                    </h3>
                    <button onclick="document.getElementById('modal-fotos').remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    ${iteracion.fotos.map((foto, index) => `
                        <div class="relative">
                            <img src="${URL.createObjectURL(foto)}" 
                                 class="w-full h-40 object-cover rounded border cursor-pointer"
                                 onclick="this.classList.toggle('fixed'); this.classList.toggle('inset-0'); this.classList.toggle('z-50'); this.classList.toggle('object-contain'); this.classList.toggle('bg-black');">
                            <p class="text-xs text-center mt-1 truncate">${foto.name}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    /**
     * Elimina una iteración
     */
    eliminarIteracion(iteracionId) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta iteración?')) {
            return;
        }

        this.iteraciones = this.iteraciones.filter(iter => iter.id !== iteracionId);
        this.sincronizarTabla();
        this.guardarIteracionesLocalStorage();
        
        console.log('🗑️ Iteración eliminada:', iteracionId);
    }

    /**
     * Obtiene una iteración por ID
     */
    obtenerIteracion(iteracionId) {
        return this.iteraciones.find(iter => iter.id === iteracionId);
    }

    /**
     * Guarda las iteraciones en localStorage
     */
    guardarIteracionesLocalStorage() {
        try {
            // No podemos guardar archivos en localStorage, solo metadatos
            const iteracionesParaGuardar = this.iteraciones.map(iter => ({
                ...iter,
                fotos: iter.fotos.map(foto => ({
                    name: foto.name,
                    size: foto.size,
                    type: foto.type
                }))
            }));

            localStorage.setItem('formPIR_iteraciones', JSON.stringify(iteracionesParaGuardar));
            console.log('💾 Iteraciones guardadas en localStorage');
        } catch (error) {
            console.warn('⚠️ No se pudieron guardar las iteraciones:', error);
        }
    }

    /**
     * Carga las iteraciones desde localStorage
     */
    cargarIteracionesGuardadas() {
        try {
            const iteracionesGuardadas = localStorage.getItem('formPIR_iteraciones');
            if (iteracionesGuardadas) {
                const iteraciones = JSON.parse(iteracionesGuardadas);
                // Solo cargar metadatos, las fotos se perderán al recargar
                console.log('📂 Iteraciones cargadas desde localStorage:', iteraciones.length);
                this.sincronizarTabla();
            }
        } catch (error) {
            console.warn('⚠️ No se pudieron cargar las iteraciones:', error);
        }
    }

    /**
     * Exporta las iteraciones para envío al backend
     */
    exportarIteraciones() {
        return {
            iteraciones: this.iteraciones,
            seccionActiva: this.seccionActiva,
            totalIteraciones: this.iteraciones.length,
            fechaExportacion: new Date().toISOString()
        };
    }

    /**
     * Importa iteraciones desde el backend
     */
    importarIteraciones(datos) {
        if (datos && datos.iteraciones) {
            this.iteraciones = datos.iteraciones;
            this.contadorIteraciones = Math.max(...this.iteraciones.map(iter => 
                parseInt(iter.id.replace('iter_', '')) || 0
            )) || 0;
            this.sincronizarTabla();
            console.log('📥 Iteraciones importadas:', this.iteraciones.length);
        }
    }
}

// Inicializar el sistema cuando se carga el DOM
let iteracionesManager;

document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que otros scripts se hayan cargado
    setTimeout(() => {
        iteracionesManager = new IteracionesManager();
        window.iteracionesManager = iteracionesManager; // Hacer disponible globalmente
        
        console.log('🚀 Sistema de Iteraciones Compartidas inicializado');
    }, 1000);
});

    // Exponer para uso global
    window.IteracionesManager = IteracionesManager;
} else {
    console.log('✅ IteracionesManager ya está definido, usando instancia existente');
}
