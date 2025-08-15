/**
 * Sistema de Iteraciones Compartidas FINAL - FormPIR
 * - Información compartida entre todas las secciones
 * - Posicionamiento uniforme: debajo de las fotografías en todas las secciones
 * - Indica la sección de origen de cada iteración
 * @version 2.1.0 - Posicionamiento Unificado
 */

class SistemaIteracionesCompartidasFinal {
  constructor() {
    this.iteracionesGlobales = [];
    this.seccionActual = this.detectarSeccion();
    this.storageKey = 'formPIR_iteraciones_globales';
    this.tablaCreada = false;
    this.inicializar();
  }
  
  detectarSeccion() {
    const url = window.location.pathname;
    if (url.includes('conductores')) return 'conductores';
    if (url.includes('equipos')) return 'equipos';
    if (url.includes('transformadores')) return 'transformadores';
    return 'estructuras';
  }
  
  inicializar() {
    console.log(`🌐 Inicializando Sistema de Iteraciones COMPARTIDAS para ${this.seccionActual}`);
    
    // Cargar iteraciones globales desde localStorage
    this.cargarIteracionesGlobales();
    
    // Esperar a que el formulario esté completamente cargado
    setTimeout(() => {
      this.crearTablaEnPosicionCorrecta();
      this.configurarEventos();
      this.renderizarTablaCompartida();
      console.log(`✅ Sistema de iteraciones compartidas inicializado para ${this.seccionActual}`);
    }, 2000);
  }
  
  cargarIteracionesGlobales() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.iteracionesGlobales = JSON.parse(stored);
        console.log(`📦 Cargadas ${this.iteracionesGlobales.length} iteraciones globales`);
      }
    } catch (error) {
      console.warn('⚠️ Error cargando iteraciones:', error);
      this.iteracionesGlobales = [];
    }
  }
  
  guardarIteracionesGlobales() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.iteracionesGlobales));
      console.log(`💾 Guardadas ${this.iteracionesGlobales.length} iteraciones globales`);
    } catch (error) {
      console.warn('⚠️ Error guardando iteraciones:', error);
    }
  }
  
  crearTablaEnPosicionCorrecta() {
    if (document.getElementById('iteraciones-compartidas-final') || this.tablaCreada) {
      console.log('⚠️ La tabla ya existe');
      return;
    }
    
    let contenedor = null;
    let posicion = 'beforeend'; // Por defecto al final
    
    // NUEVA LÓGICA: Todas las secciones (incluyendo estructuras) tendrán la tabla al final
    // Buscar el final del formulario para TODAS las secciones
    const selectoresBotones = [
      'button[type="submit"]',
      'input[type="submit"]',
      '.btn-primary',
      '.btn-success'
    ];
    
    // Función para buscar botones por texto
    const buscarBotonPorTexto = (textos) => {
      const botones = document.querySelectorAll('button, input[type="submit"]');
      for (const boton of botones) {
        const texto = (boton.textContent || boton.value || '').toLowerCase().trim();
        for (const textoBuscado of textos) {
          if (texto.includes(textoBuscado.toLowerCase())) {
            return boton;
          }
        }
      }
      return null;
    };
    
    const botonGuardar = buscarBotonPorTexto(['guardar formulario', 'guardar', 'enviar', 'submit']);
    if (botonGuardar) {
      contenedor = botonGuardar.closest('.text-center') || 
                  botonGuardar.closest('.d-flex') || 
                  botonGuardar.closest('.form-actions') ||
                  botonGuardar.parentElement || 
                  botonGuardar;
      posicion = 'beforebegin'; // Antes de los botones
      console.log(`📍 Tabla se posicionará ANTES de los botones (${this.seccionActual})`);
    } else {
      // Fallback: buscar después del contenedor de fotografías
      const selectoresFotos = [
        '#preview', // Contenedor de preview de fotos
        '[id*="foto"]',
        '[class*="foto"]',
        '.upload-area',
        '.file-upload-area'
      ];
      
      for (const selector of selectoresFotos) {
        const elementoFotos = document.querySelector(selector);
        if (elementoFotos) {
          // Buscar el contenedor padre de las fotos
          contenedor = elementoFotos.closest('.bg-white.rounded-lg') || 
                      elementoFotos.closest('.form-section') || 
                      elementoFotos.closest('.p-8') ||
                      elementoFotos.parentElement;
          posicion = 'afterend'; // Después del contenedor de fotos
          console.log(`📍 Tabla se posicionará DESPUÉS del contenedor de fotografías (${this.seccionActual}): ${selector}`);
          break;
        }
      }
      
      // Fallback final
      if (!contenedor) {
        const selectoresFallback = [
          '#form-total',
          '.form-section', 
          'form',
          'main .container',
          '.container'
        ];
        
        for (const selector of selectoresFallback) {
          contenedor = document.querySelector(selector);
          if (contenedor) {
            posicion = 'beforeend';
            console.log(`📍 Tabla se posicionará al final del contenedor (${this.seccionActual}): ${selector}`);
            break;
          }
        }
      }
    }
    
    if (!contenedor) {
      console.error('❌ No se encontró contenedor para la tabla');
      return;
    }
    
    const iconos = {
      'estructuras': 'fas fa-building',
      'conductores': 'fas fa-bolt', 
      'equipos': 'fas fa-shield-alt',
      'transformadores': 'fas fa-microchip'
    };
    
    const colores = {
      'estructuras': 'blue',
      'conductores': 'yellow',
      'equipos': 'green', 
      'transformadores': 'purple'
    };
    
    const tablaHTML = `
    <div id="iteraciones-compartidas-final" class="bg-white rounded-lg shadow-sm p-6 mb-8 mt-8 border-t-4 border-indigo-500">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
          <i class="fas fa-share-alt mr-2 text-indigo-600"></i>
          Iteraciones Compartidas - Todas las Secciones
        </h3>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            Sección Actual: <strong>${this.seccionActual.toUpperCase()}</strong>
          </span>
          <span id="contador-iteraciones-globales" class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium text-sm">
            0 iteraciones
          </span>
        </div>
      </div>

      <button 
        type="button"
        id="btn-agregar-iteracion-global"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-3 mb-6 transition-all duration-200 shadow-md hover:shadow-lg">
        <i class="fas fa-plus-circle"></i>
        <span>Agregar Iteración desde ${this.seccionActual.charAt(0).toUpperCase() + this.seccionActual.slice(1)}</span>
        <span class="bg-indigo-800 px-2 py-1 rounded text-xs font-medium">GLOBAL</span>
      </button>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-16">#</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-24">Sección</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Descripción</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Datos Específicos</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-32">Fecha Creación</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-20">Acciones</th>
            </tr>
          </thead>
          <tbody id="tabla-iteraciones-globales">
            <tr id="mensaje-vacio-global">
              <td colspan="6" class="text-center py-8 text-gray-500">
                <i class="fas fa-share-alt text-3xl mb-2 block"></i>
                <div class="text-sm">No hay iteraciones compartidas</div>
                <div class="text-xs text-gray-400">Las iteraciones aparecerán en todas las secciones</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Información del sistema compartido -->
      <div class="mt-4 text-sm text-gray-600 bg-indigo-50 p-3 rounded-lg">
        <div class="flex items-start gap-2">
          <i class="fas fa-info-circle text-indigo-600 mt-0.5"></i>
          <div>
            <strong>Sistema de Iteraciones Compartidas</strong>
            <p class="mt-1 text-xs">
              • Las iteraciones se comparten entre todas las secciones (Estructuras, Conductores, Equipos, Transformadores)<br>
              • Cada iteración indica su sección de origen<br>
              • Los cambios se sincronizan automáticamente entre secciones
            </p>
          </div>
        </div>
      </div>
    </div>`;
    
    // Insertar la tabla
    contenedor.insertAdjacentHTML(posicion, tablaHTML);
    this.tablaCreada = true;
    
    console.log(`✅ Tabla compartida creada en ${this.seccionActual} - Posición: ${posicion}`);
  }
  
  configurarEventos() {
    // Botón agregar iteración
    const btnAgregar = document.getElementById('btn-agregar-iteracion-global');
    if (btnAgregar) {
      btnAgregar.addEventListener('click', () => this.agregarIteracionDesdeSeccionActual());
    }
  }
  
  agregarIteracionDesdeSeccionActual() {
    console.log(`➕ Agregando iteración desde ${this.seccionActual}`);
    
    // Recopilar datos específicos según la sección
    const datos = this.recopilarDatosSeccion();
    
    if (!datos) {
      alert('Por favor, completa los campos requeridos antes de agregar la iteración.');
      return;
    }
    
    // Crear la iteración con información de origen
    const iteracion = {
      id: Date.now(),
      seccionOrigen: this.seccionActual,
      fecha: new Date().toISOString(),
      fechaFormateada: new Date().toLocaleDateString('es-CO'),
      datos: datos,
      descripcion: this.generarDescripcion(datos)
    };
    
    // Agregar a la lista global
    this.iteracionesGlobales.push(iteracion);
    
    // Guardar en localStorage
    this.guardarIteracionesGlobales();
    
    // Renderizar tabla
    this.renderizarTablaCompartida();
    
    console.log(`✅ Iteración agregada desde ${this.seccionActual}:`, iteracion);
  }
  
  recopilarDatosSeccion() {
    switch (this.seccionActual) {
      case 'estructuras':
        return this.recopilarDatosEstructuras();
      case 'conductores':
        return this.recopilarDatosConductores();
      case 'equipos':
        return this.recopilarDatosEquipos();
      case 'transformadores':
        return this.recopilarDatosTransformadores();
      default:
        return null;
    }
  }
  
  // Método para obtener descripción desde la vista previa
  obtenerDescripcionDesdeVistaPrevia() {
    try {
      // Buscar la descripción en .uc-description
      const ucDescription = document.querySelector('.uc-description');
      if (ucDescription && ucDescription.textContent) {
        const descripcion = ucDescription.textContent.trim();
        console.log(`📝 Descripción encontrada: ${descripcion}`);
        return descripcion;
      }
      
      // Buscar en el contenedor de vista previa
      const previewContent = document.querySelector('.uc-preview-content');
      if (previewContent) {
        // Buscar span con clase uc-description
        const descInPreview = previewContent.querySelector('.uc-description');
        if (descInPreview && descInPreview.textContent) {
          const descripcion = descInPreview.textContent.trim();
          console.log(`📝 Descripción encontrada en preview: ${descripcion}`);
          return descripcion;
        }
      }
      
      return null;
    } catch (error) {
      console.warn('⚠️ Error obteniendo descripción:', error);
      return null;
    }
  }
  
  recopilarDatosEstructuras() {
    // PRIORIDAD 1: Buscar UC desde la vista previa (visible)
    let ucCompleto = this.obtenerUCDesdeVistaPrevia();
    
    // PRIORIDAD 2: Si no se encuentra en vista previa, buscar en selectores tradicionales
    if (!ucCompleto) {
      const selectoresUC = [
        '#uc_completo',
        '[name="uc_completo"]',
        '#shared_uc_completo',
        '#uc-selector select',
        '.uc-hierarchical-selector select',
        // Nuevos selectores basados en tu sistema
        'input[name*="uc"]',
        'select[name*="uc"]',
        '[data-uc]',
        '#selectedUC',
        '.selected-uc',
        // Buscar en elementos ocultos también
        'input[type="hidden"][name*="uc"]',
        'input[type="hidden"][id*="uc"]'
      ];
      
      console.log('🔎 Buscando UC en selectores tradicionales...');
      for (const selector of selectoresUC) {
        const ucSelector = document.querySelector(selector);
        if (ucSelector) {
          console.log(`🔍 Examinando selector "${selector}": valor="${ucSelector.value}", texto="${ucSelector.textContent}"`);
          if (ucSelector.value && ucSelector.value.trim()) {
            ucCompleto = ucSelector.value.trim();
            console.log(`✅ UC encontrada en selector "${selector}": ${ucCompleto}`);
            break;
          }
        }
      }
    }
    
    // Buscar estructura retirada
    const selectoresEstructura = [
      '#estructura_retirada',
      '[name="estructura_retirada"]',
      '#shared_estructura_retirada'
    ];
    
    let estructuraRetirada = null;
    for (const selector of selectoresEstructura) {
      estructuraRetirada = document.querySelector(selector);
      if (estructuraRetirada) break;
    }
    
    // Buscar tipo de inversión
    const selectoresTipoInv = [
      '#t_inv',
      '[name="t_inv"]',
      '#tipo_inversion',
      '[name="tipo_inversion"]'
    ];
    
    let tipoInversion = null;
    for (const selector of selectoresTipoInv) {
      tipoInversion = document.querySelector(selector);
      if (tipoInversion) break;
    }
    
    if (!ucCompleto) {
      console.warn('⚠️ No se pudo obtener UC ni desde vista previa ni desde selectores');
      alert('Por favor, selecciona una UC antes de agregar la iteración.');
      return null;
    }
    
    // Obtener descripción desde vista previa
    const descripcionPrevia = this.obtenerDescripcionDesdeVistaPrevia();
    
    console.log(`✅ UC obtenida: ${ucCompleto}`);
    if (descripcionPrevia) {
      console.log(`✅ Descripción obtenida: ${descripcionPrevia}`);
    }
    
    return {
      uc_completo: ucCompleto,
      descripcion_previa: descripcionPrevia || '',
      estructura_retirada: estructuraRetirada ? estructuraRetirada.value : '',
      tipo_inversion: tipoInversion ? tipoInversion.value : '',
      // Campos adicionales que podrían estar presentes
      tension: this.obtenerValorCampo(['#tension', '[name="tension"]']),
      circuito: this.obtenerValorCampo(['#circuito', '[name="circuito"]']),
    };
  }
  
  recopilarDatosConductores() {
    const datos = {
      tipo_conductor: this.obtenerValorCampo(['#tipo_conductor', '[name="tipo_conductor"]']),
      calibre: this.obtenerValorCampo(['#calibre', '[name="calibre"]']),
      uc_conductor: this.obtenerValorCampo(['#uc_conductor', '[name="uc_conductor"]']),
      longitud: this.obtenerValorCampo(['#longitud', '[name="longitud"]']),
      fases: this.obtenerValorCampo(['#fases', '[name="fases"]']),
    };
    
    // Verificar que al menos un campo importante esté lleno
    if (!datos.tipo_conductor && !datos.calibre) {
      console.warn('⚠️ Faltan datos principales de conductores');
      alert('Por favor, completa el tipo de conductor o calibre antes de agregar la iteración.');
      return null;
    }
    
    return datos;
  }
  
  recopilarDatosEquipos() {
    const datos = {
      tipo_equipo: this.obtenerValorCampo(['#tipo_equipo', '[name="tipo_equipo"]']),
      fabricante: this.obtenerValorCampo(['#fabricante', '[name="fabricante"]']),
      modelo: this.obtenerValorCampo(['#modelo', '[name="modelo"]']),
      serie: this.obtenerValorCampo(['#serie', '[name="serie"]']),
      cantidad: this.obtenerValorCampo(['#cantidad', '[name="cantidad"]']),
    };
    
    // Verificar que al menos el tipo de equipo esté seleccionado
    if (!datos.tipo_equipo) {
      console.warn('⚠️ Falta seleccionar tipo de equipo');
      alert('Por favor, selecciona el tipo de equipo antes de agregar la iteración.');
      return null;
    }
    
    return datos;
  }
  
  recopilarDatosTransformadores() {
    const datos = {
      potencia: this.obtenerValorCampo(['#potencia', '[name="potencia"]']),
      relacion: this.obtenerValorCampo(['#relacion', '[name="relacion"]']),
      tipo_conexion: this.obtenerValorCampo(['#tipo_conexion', '[name="tipo_conexion"]']),
      fabricante: this.obtenerValorCampo(['#fabricante', '[name="fabricante"]']),
      serie: this.obtenerValorCampo(['#serie', '[name="serie"]']),
    };
    
    // Verificar que al menos la potencia esté especificada
    if (!datos.potencia) {
      console.warn('⚠️ Falta especificar potencia del transformador');
      alert('Por favor, especifica la potencia del transformador antes de agregar la iteración.');
      return null;
    }
    
    return datos;
  }
  
  // Método auxiliar para obtener el valor de un campo con múltiples selectores posibles
  obtenerValorCampo(selectores) {
    for (const selector of selectores) {
      const campo = document.querySelector(selector);
      if (campo && campo.value && campo.value.trim()) {
        return campo.value.trim();
      }
    }
    return '';
  }
  
  // Método para obtener UC desde la vista previa
  obtenerUCDesdeVistaPrevia() {
    try {
      console.log('🔍 Iniciando búsqueda de UC en vista previa...');
      
      // MÉTODO 1: Buscar específicamente el elemento .uc-code dentro de .uc-preview-content
      const ucCodeElement = document.querySelector('.uc-preview-content .uc-code');
      if (ucCodeElement && ucCodeElement.textContent) {
        const ucCode = ucCodeElement.textContent.trim();
        console.log(`🎯 UC encontrada en .uc-code: ${ucCode}`);
        return ucCode;
      }
      
      // MÉTODO 2: Buscar en cualquier elemento con clase uc-code
      const anyUcCode = document.querySelector('.uc-code');
      if (anyUcCode && anyUcCode.textContent) {
        const ucCode = anyUcCode.textContent.trim();
        console.log(`🎯 UC encontrada en cualquier .uc-code: ${ucCode}`);
        return ucCode;
      }
      
      // MÉTODO 3: Buscar en el div #uc-preview
      const ucPreview = document.querySelector('#uc-preview');
      if (ucPreview) {
        console.log(`🔎 Examinando #uc-preview:`, ucPreview.innerHTML.substring(0, 200));
        
        // Buscar span con clase uc-code dentro de uc-preview
        const ucCodeInPreview = ucPreview.querySelector('.uc-code');
        if (ucCodeInPreview && ucCodeInPreview.textContent) {
          const ucCode = ucCodeInPreview.textContent.trim();
          console.log(`🎯 UC encontrada en #uc-preview .uc-code: ${ucCode}`);
          return ucCode;
        }
        
        // Buscar cualquier texto que parezca un código UC
        const textoCompleto = ucPreview.textContent || '';
        console.log(`🔎 Texto completo en #uc-preview: "${textoCompleto}"`);
        
        const patronesUC = [
          /\b(N\d+P\d+)\b/g,               // Patrón N1P59
          /\b([A-Z]\d+[A-Z]\d+)\b/g,       // Patrón general A1B2
          /\b([A-Z]{1,3}\d{1,4})\b/g       // Patrón más amplio
        ];
        
        for (const patron of patronesUC) {
          const matches = textoCompleto.match(patron);
          if (matches && matches.length > 0) {
            console.log(`🎯 UC encontrada por patrón en #uc-preview: ${matches[0]}`);
            return matches[0];
          }
        }
      }
      
      // MÉTODO 4: Buscar en elementos con clase uc-preview-content
      const previewContent = document.querySelector('.uc-preview-content');
      if (previewContent) {
        console.log(`🔎 Examinando .uc-preview-content:`, previewContent.innerHTML.substring(0, 200));
        
        const textoPreview = previewContent.textContent || '';
        console.log(`🔎 Texto en .uc-preview-content: "${textoPreview}"`);
        
        // Buscar códigos UC en el texto
        const patronesUC = [
          /\b(N\d+P\d+)\b/g,               // N1P59
          /\b([A-Z]\d+[A-Z]\d+)\b/g,       // Patrón general
        ];
        
        for (const patron of patronesUC) {
          const matches = textoPreview.match(patron);
          if (matches && matches.length > 0) {
            console.log(`🎯 UC encontrada por patrón en .uc-preview-content: ${matches[0]}`);
            return matches[0];
          }
        }
      }
      
      // MÉTODO 5: Buscar TODOS los elementos span en la página
      console.log('🔎 Buscando en todos los spans...');
      const todosLosSpans = document.querySelectorAll('span');
      for (const span of todosLosSpans) {
        const texto = span.textContent || '';
        const clase = span.className || '';
        
        if (clase.includes('uc-code') || texto.match(/^N\d+P\d+$/)) {
          console.log(`🔎 Span encontrado - Clase: "${clase}", Texto: "${texto}"`);
          if (texto.match(/^N\d+P\d+$/)) {
            console.log(`🎯 UC encontrada en span: ${texto}`);
            return texto.trim();
          }
        }
      }
      
      console.log('🔍 No se encontró UC en vista previa con ningún método');
      return null;
      
    } catch (error) {
      console.warn('⚠️ Error buscando UC en vista previa:', error);
      return null;
    }
  }
  
  generarDescripcion(datos) {
    switch (this.seccionActual) {
      case 'estructuras':
        // Priorizar la descripción de la vista previa si existe
        let descripcion = `UC: ${datos.uc_completo}`;
        
        if (datos.descripcion_previa && datos.descripcion_previa.trim()) {
          descripcion += ` - ${datos.descripcion_previa}`;
        }
        
        if (datos.estructura_retirada && datos.estructura_retirada.trim()) {
          descripcion += ` - Estructura Retirada: ${datos.estructura_retirada}`;
        }
        
        if (datos.tipo_inversion && datos.tipo_inversion.trim()) {
          descripcion += ` - Tipo Inversión: ${datos.tipo_inversion}`;
        }
        
        return descripcion;
      case 'conductores':
        return `Conductor ${datos.tipo_conductor} - Calibre: ${datos.calibre} - UC: ${datos.uc_conductor}`;
      case 'equipos':
        return `${datos.tipo_equipo} - ${datos.fabricante} ${datos.modelo}`;
      case 'transformadores':
        return `Transformador ${datos.potencia} - ${datos.relacion} - ${datos.tipo_conexion}`;
      default:
        return 'Iteración sin descripción específica';
    }
  }
  
  renderizarTablaCompartida() {
    const tbody = document.getElementById('tabla-iteraciones-globales');
    const contador = document.getElementById('contador-iteraciones-globales');
    const mensajeVacio = document.getElementById('mensaje-vacio-global');
    
    if (!tbody) {
      console.warn('⚠️ Tabla no encontrada para renderizar');
      return;
    }
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Actualizar contador
    if (contador) {
      contador.textContent = `${this.iteracionesGlobales.length} iteraciones`;
    }
    
    if (this.iteracionesGlobales.length === 0) {
      // Mostrar mensaje vacío
      tbody.appendChild(mensajeVacio);
      return;
    }
    
    // Renderizar iteraciones
    this.iteracionesGlobales.forEach((iteracion, index) => {
      const iconoSeccion = this.obtenerIconoSeccion(iteracion.seccionOrigen);
      const colorSeccion = this.obtenerColorSeccion(iteracion.seccionOrigen);
      
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition-colors';
      row.innerHTML = `
        <td class="px-4 py-3 text-sm font-medium text-gray-900 border-b">${index + 1}</td>
        <td class="px-4 py-3 text-sm border-b">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${colorSeccion}-100 text-${colorSeccion}-800">
            <i class="${iconoSeccion} mr-1"></i>
            ${iteracion.seccionOrigen.toUpperCase()}
          </span>
        </td>
        <td class="px-4 py-3 text-sm text-gray-900 border-b">${iteracion.descripcion}</td>
        <td class="px-4 py-3 text-sm text-gray-600 border-b">
          ${this.formatearDatosEspecificos(iteracion.datos)}
        </td>
        <td class="px-4 py-3 text-sm text-gray-500 border-b">${iteracion.fechaFormateada}</td>
        <td class="px-4 py-3 text-center border-b">
          <button type="button" class="text-red-600 hover:text-red-800 transition-colors" onclick="sistemaIteracionesCompartidas.eliminarIteracion(${iteracion.id})" title="Eliminar iteración">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
    
    console.log(`📊 Tabla renderizada con ${this.iteracionesGlobales.length} iteraciones`);
  }
  
  obtenerIconoSeccion(seccion) {
    const iconos = {
      'estructuras': 'fas fa-building',
      'conductores': 'fas fa-bolt', 
      'equipos': 'fas fa-shield-alt',
      'transformadores': 'fas fa-microchip'
    };
    return iconos[seccion] || 'fas fa-circle';
  }
  
  obtenerColorSeccion(seccion) {
    const colores = {
      'estructuras': 'blue',
      'conductores': 'yellow',
      'equipos': 'green', 
      'transformadores': 'purple'
    };
    return colores[seccion] || 'gray';
  }
  
  formatearDatosEspecificos(datos) {
    if (!datos || typeof datos !== 'object') return 'Sin datos específicos';
    
    const elementos = [];
    Object.entries(datos).forEach(([key, value]) => {
      // Solo incluir si el valor existe y no está vacío
      if (value && value.toString().trim()) {
        // Formatear el nombre del campo para mejor legibilidad
        const nombreFormateado = key.replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        elementos.push(`<strong>${nombreFormateado}:</strong> ${value}`);
      }
    });
    
    return elementos.length > 0 ? elementos.join(' • ') : 'Sin datos específicos';
  }
  
  eliminarIteracion(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta iteración? Se eliminará de todas las secciones.')) {
      return;
    }
    
    this.iteracionesGlobales = this.iteracionesGlobales.filter(iter => iter.id !== id);
    this.guardarIteracionesGlobales();
    this.renderizarTablaCompartida();
    
    console.log(`🗑️ Iteración ${id} eliminada`);
  }
  
  // Método público para limpiar todas las iteraciones
  limpiarTodasLasIteraciones() {
    if (confirm('¿Estás seguro de que quieres eliminar TODAS las iteraciones compartidas?')) {
      this.iteracionesGlobales = [];
      this.guardarIteracionesGlobales();
      this.renderizarTablaCompartida();
      console.log('🧹 Todas las iteraciones han sido eliminadas');
    }
  }
}

// Instanciar globalmente
let sistemaIteracionesCompartidas = null;

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Esperar un poco para que otros scripts se carguen
  setTimeout(() => {
    if (!sistemaIteracionesCompartidas) {
      sistemaIteracionesCompartidas = new SistemaIteracionesCompartidasFinal();
      window.sistemaIteracionesCompartidas = sistemaIteracionesCompartidas;
      console.log('🌐 Sistema de Iteraciones Compartidas FINAL inicializado globalmente');
    }
  }, 2500);
});
