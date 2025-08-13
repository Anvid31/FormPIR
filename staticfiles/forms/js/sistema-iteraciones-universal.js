/**
 * Sistema de Iteraciones Universal - FormPIR
 * Funciona en todas las secciones y se posiciona al final del formulario
 * @version 1.0.0 - Universal y Posicionado
 */

class SistemaIteracionesUniversal {
  constructor() {
    this.iteraciones = [];
    this.seccionActual = this.detectarSeccion();
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
    // console.log(`🚀 Inicializando Sistema de Iteraciones Universal para ${this.seccionActual}`);
    
    // Esperar a que el formulario esté completamente cargado
    setTimeout(() => {
      this.crearTablaAlFinal();
      this.configurarEventos();
      this.cargarIteracionesDesdeStorage();
      console.log(`✅ Sistema de iteraciones inicializado para ${this.seccionActual}`);
    }, 1500);
  }
  
  crearTablaAlFinal() {
    if (document.getElementById('sistema-iteraciones-universal') || this.tablaCreada) return;
    
    // Función para buscar botones por texto
    const encontrarBotonPorTexto = (textos) => {
      const botones = document.querySelectorAll('button, input[type="submit"]');
      for (const boton of botones) {
        const texto = (boton.textContent || boton.value || '').toLowerCase().trim();
        for (const textoBuscado of textos) {
          if (texto.includes(textoBuscado.toLowerCase())) {
            return boton.parentElement || boton;
          }
        }
      }
      return null;
    };
    
    let contenedor = null;
    let insertarAntes = false;
    
    // 1. Buscar botones específicos por texto
    const botonesObjetivo = encontrarBotonPorTexto(['Guardar Formulario', 'Ver Formularios', 'Guardar', 'Enviar']);
    if (botonesObjetivo) {
      contenedor = botonesObjetivo;
      insertarAntes = true;
    }
    
    // 2. Buscar contenedores de botones
    if (!contenedor) {
      const selectoresContenedores = [
        '.form-actions',
        '.action-buttons', 
        '.btn-group',
        '.d-flex.justify-content-center',
        '.d-flex.justify-content-end',
        '.text-center'
      ];
      
      for (const selector of selectoresContenedores) {
        const elemento = document.querySelector(selector);
        if (elemento && elemento.querySelector('button, input[type="submit"]')) {
          contenedor = elemento;
          insertarAntes = true;
          break;
        }
      }
    }
    
    // 3. Fallback - buscar cualquier botón submit
    if (!contenedor) {
      const submitButton = document.querySelector('button[type="submit"], input[type="submit"]');
      if (submitButton) {
        contenedor = submitButton.parentElement || submitButton;
        insertarAntes = true;
      }
    }
    
    // 4. Fallback final - usar contenedores generales
    if (!contenedor) {
      const selectoresFallback = [
        '#form-total',
        '.form-section',
        '[data-form-section]', 
        'main .container',
        'form'
      ];
      
      for (const selector of selectoresFallback) {
        contenedor = document.querySelector(selector);
        if (contenedor) {
          insertarAntes = false;
          break;
        }
      }
    }
    
    if (!contenedor) {
      console.warn('⚠️ No se encontró contenedor para la tabla');
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
    
    const icono = iconos[this.seccionActual] || 'fas fa-list';
    const color = colores[this.seccionActual] || 'blue';
    
    const tablaHTML = `
    <div id="sistema-iteraciones-universal" class="bg-white rounded-lg shadow-sm p-6 mb-8 mt-8 border-t-4 border-${color}-500">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
          <i class="${icono} mr-2 text-${color}-600"></i>
          Iteraciones de ${this.seccionActual.charAt(0).toUpperCase() + this.seccionActual.slice(1)}
        </h3>
        <span id="contador-iteraciones-${this.seccionActual}" class="bg-${color}-100 text-${color}-800 px-3 py-1 rounded-full font-medium text-sm">
          0 iteraciones
        </span>
      </div>

      <button 
        type="button"
        id="btn-agregar-iteracion-${this.seccionActual}"
        class="bg-${color}-600 hover:bg-${color}-700 text-white px-6 py-3 rounded-lg flex items-center gap-3 mb-6 transition-all duration-200 shadow-md hover:shadow-lg">
        <i class="fas fa-plus-circle"></i>
        <span>Agregar Iteración</span>
        <span class="bg-${color}-800 px-2 py-1 rounded text-xs font-medium">${this.seccionActual}</span>
      </button>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-16">#</th>
              ${this.obtenerColumnas()}
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-20">Acciones</th>
            </tr>
          </thead>
          <tbody id="tabla-iteraciones-${this.seccionActual}">
            <tr id="mensaje-vacio-${this.seccionActual}">
              <td colspan="${this.getNumColumnas()}" class="text-center py-8 text-gray-500">
                <i class="fas fa-inbox text-3xl mb-2 block"></i>
                <div class="text-sm">No hay iteraciones agregadas</div>
                <div class="text-xs text-gray-400">Usa "Agregar Iteración" para comenzar</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Información específica por sección -->
      <div class="mt-4 text-sm text-gray-600 bg-${color}-50 p-3 rounded-lg">
        <div class="flex items-start gap-2">
          <i class="fas fa-info-circle text-${color}-600 mt-0.5"></i>
          <div>
            <strong>Sección: ${this.seccionActual.toUpperCase()}</strong>
            <p class="mt-1 text-xs">${this.obtenerDescripcionSeccion()}</p>
          </div>
        </div>
      </div>
    </div>`;
    
    // Insertar la tabla según la posición determinada
    if (insertarAntes) {
      contenedor.insertAdjacentHTML('beforebegin', tablaHTML);
      console.log(`✅ Tabla insertada ANTES de los botones: ${contenedor.tagName}`);
    } else {
      contenedor.insertAdjacentHTML('beforeend', tablaHTML);
      console.log(`✅ Tabla insertada al final del contenedor: ${contenedor.tagName}`);
    }
    
    this.tablaCreada = true;
    console.log(`✅ Tabla de iteraciones creada al final del formulario de ${this.seccionActual}`);
  }
  
  obtenerColumnas() {
    const columnas = {
      'estructuras': `
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Estructura Retirada</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-24">UC Nueva</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Descripción UC</th>
      `,
      'conductores': `
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tipo Conductor</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Calibre</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-24">UC Conductor</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Longitud</th>
      `,
      'equipos': `
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tipo Equipo</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Marca</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-24">UC Equipo</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Características</th>
      `,
      'transformadores': `
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Potencia</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tipo</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-24">UC Transform.</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Relación</th>
      `
    };
    
    return columnas[this.seccionActual] || columnas['estructuras'];
  }
  
  getNumColumnas() {
    const numCols = {
      'estructuras': 5, // # + 3 columnas + acciones
      'conductores': 6,  // # + 4 columnas + acciones  
      'equipos': 6,      // # + 4 columnas + acciones
      'transformadores': 6 // # + 4 columnas + acciones
    };
    return numCols[this.seccionActual] || 5;
  }
  
  obtenerDescripcionSeccion() {
    const descripciones = {
      'estructuras': 'Agrega iteraciones de estructuras eléctricas (postes, torres, etc.) con su UC correspondiente.',
      'conductores': 'Registra instalaciones y modificaciones de conductores eléctricos por tramos.',
      'equipos': 'Documenta instalación de equipos de protección y maniobra en la red.',
      'transformadores': 'Gestiona iteraciones de transformadores de distribución y sus características.'
    };
    return descripciones[this.seccionActual] || '';
  }
  
  configurarEventos() {
    document.addEventListener('click', (e) => {
      if (e.target.closest(`#btn-agregar-iteracion-${this.seccionActual}`)) {
        e.preventDefault();
        this.agregarIteracion();
      }
      if (e.target.closest('.btn-eliminar-iteracion')) {
        const id = parseInt(e.target.closest('.btn-eliminar-iteracion').dataset.id);
        this.eliminarIteracion(id);
      }
    });
  }
  
  agregarIteracion() {
    console.log(`⚡ Agregando iteración para ${this.seccionActual}`);
    
    const datos = this.capturarDatosSeccion();
    
    if (!this.validarDatos(datos)) {
      return;
    }
    
    const iteracion = {
      id: Date.now(),
      numero: this.iteraciones.length + 1,
      seccion: this.seccionActual,
      ...datos
    };
    
    this.iteraciones.push(iteracion);
    this.actualizarTabla();
    this.guardarEnStorage();
    this.mostrarNotificacion(`✅ Iteración #${iteracion.numero} agregada en ${this.seccionActual}`);
  }
  
  capturarDatosSeccion() {
    switch(this.seccionActual) {
      case 'estructuras':
        return this.capturarDatosEstructuras();
      case 'conductores':
        return this.capturarDatosConductores();
      case 'equipos':
        return this.capturarDatosEquipos();
      case 'transformadores':
        return this.capturarDatosTransformadores();
      default:
        return {};
    }
  }
  
  capturarDatosEstructuras() {
    const estructuraRetirada = this.obtenerValor('estructura_retirada_campo');
    const ucData = this.capturarUC();
    
    return {
      estructuraRetirada,
      ucNueva: ucData.codigo,
      descripcionUC: ucData.descripcion
    };
  }
  
  capturarDatosConductores() {
    return {
      tipoConductor: this.obtenerTextoSelect('tipo_conductor') || 'ACSR',
      calibre: this.obtenerTextoSelect('calibre_conductor') || '4/0 AWG',
      ucConductor: this.obtenerValor('uc_conductor') || 'N1C001',
      longitud: (this.obtenerValor('longitud_conductor') || '1.0') + ' km'
    };
  }
  
  capturarDatosEquipos() {
    return {
      tipoEquipo: this.obtenerTextoSelect('tipo_equipo') || 'Seccionador',
      marca: this.obtenerValor('marca_equipo') || 'ABB',
      ucEquipo: this.obtenerValor('uc_equipo') || 'N1E001',
      caracteristicas: this.obtenerValor('caracteristicas_equipo') || '15 kV'
    };
  }
  
  capturarDatosTransformadores() {
    const potencia = this.obtenerValor('potencia_transformador') || '25';
    return {
      potencia: potencia + ' kVA',
      tipo: this.obtenerTextoSelect('tipo_transformador') || 'Monofásico',
      ucTransformador: this.obtenerValor('uc_transformador') || 'N1T001',
      relacion: this.obtenerValor('relacion_transformacion') || '13200/240'
    };
  }
  
  validarDatos(datos) {
    switch(this.seccionActual) {
      case 'estructuras':
        if (!datos.estructuraRetirada?.trim()) {
          alert('⚠️ Por favor complete el campo "Estructura Retirada"');
          document.getElementById('estructura_retirada_campo')?.focus();
          return false;
        }
        if (!datos.ucNueva?.trim() || datos.ucNueva === 'UC001') {
          alert('⚠️ Por favor seleccione una UC usando el selector jerárquico');
          return false;
        }
        return true;
        
      case 'conductores':
        if (!datos.tipoConductor?.trim()) {
          alert('⚠️ Por favor seleccione el tipo de conductor');
          return false;
        }
        return true;
        
      case 'equipos':
        if (!datos.tipoEquipo?.trim()) {
          alert('⚠️ Por favor seleccione el tipo de equipo');
          return false;
        }
        return true;
        
      case 'transformadores':
        if (!datos.potencia?.trim() || datos.potencia === ' kVA') {
          alert('⚠️ Por favor ingrese la potencia del transformador');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  }
  
  actualizarTabla() {
    const tbody = document.getElementById(`tabla-iteraciones-${this.seccionActual}`);
    const contador = document.getElementById(`contador-iteraciones-${this.seccionActual}`);
    const mensajeVacio = document.getElementById(`mensaje-vacio-${this.seccionActual}`);
    
    if (!tbody) return;
    
    // Actualizar contador
    if (contador) {
      contador.textContent = `${this.iteraciones.length} iteración${this.iteraciones.length !== 1 ? 'es' : ''}`;
    }
    
    if (this.iteraciones.length === 0) {
      if (mensajeVacio) mensajeVacio.style.display = '';
      return;
    }
    
    if (mensajeVacio) mensajeVacio.style.display = 'none';
    
    const filasHTML = this.iteraciones.map((iter, index) => 
      this.crearFilaIteracion(iter, index)
    ).join('');
    
    tbody.innerHTML = `
      <tr id="mensaje-vacio-${this.seccionActual}" style="display: none;">
        <td colspan="${this.getNumColumnas()}" class="text-center py-8 text-gray-500">
          <i class="fas fa-inbox text-3xl mb-2 block"></i>
          <div class="text-sm">No hay iteraciones agregadas</div>
        </td>
      </tr>
      ${filasHTML}
    `;
  }
  
  crearFilaIteracion(iter, index) {
    const colores = {
      'estructuras': 'blue',
      'conductores': 'yellow',
      'equipos': 'green',
      'transformadores': 'purple'
    };
    
    const color = colores[this.seccionActual] || 'blue';
    
    switch(this.seccionActual) {
      case 'estructuras':
        return `
          <tr class="hover:bg-${color}-50 transition-colors">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${index + 1}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${iter.estructuraRetirada}</td>
            <td class="px-4 py-3 text-sm">
              <span class="bg-${color}-100 text-${color}-800 px-2 py-1 rounded font-mono font-bold">
                ${iter.ucNueva}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">${this.truncar(iter.descripcionUC, 60)}</td>
            <td class="px-4 py-3 text-center">
              <button data-id="${iter.id}" class="btn-eliminar-iteracion text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
        
      case 'conductores':
        return `
          <tr class="hover:bg-${color}-50 transition-colors">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${index + 1}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${iter.tipoConductor}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${iter.calibre}</td>
            <td class="px-4 py-3 text-sm">
              <span class="bg-${color}-100 text-${color}-800 px-2 py-1 rounded font-mono font-bold">
                ${iter.ucConductor}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">${iter.longitud}</td>
            <td class="px-4 py-3 text-center">
              <button data-id="${iter.id}" class="btn-eliminar-iteracion text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
        
      case 'equipos':
        return `
          <tr class="hover:bg-${color}-50 transition-colors">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${index + 1}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${iter.tipoEquipo}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${iter.marca}</td>
            <td class="px-4 py-3 text-sm">
              <span class="bg-${color}-100 text-${color}-800 px-2 py-1 rounded font-mono font-bold">
                ${iter.ucEquipo}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">${iter.caracteristicas}</td>
            <td class="px-4 py-3 text-center">
              <button data-id="${iter.id}" class="btn-eliminar-iteracion text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
        
      case 'transformadores':
        return `
          <tr class="hover:bg-${color}-50 transition-colors">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${index + 1}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${iter.potencia}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${iter.tipo}</td>
            <td class="px-4 py-3 text-sm">
              <span class="bg-${color}-100 text-${color}-800 px-2 py-1 rounded font-mono font-bold">
                ${iter.ucTransformador}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">${iter.relacion}</td>
            <td class="px-4 py-3 text-center">
              <button data-id="${iter.id}" class="btn-eliminar-iteracion text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
        
      default:
        return `<tr><td colspan="${this.getNumColumnas()}">Sección no implementada</td></tr>`;
    }
  }
  
  // Funciones auxiliares
  capturarUC() {
    // Intentar obtener UC del selector jerárquico o previsualizaciones
    const ucPreview = document.querySelector('#uc-preview .uc-code') || 
                     document.querySelector('[data-uc-selected]') ||
                     document.querySelector('#uc_nueva');
    
    if (ucPreview) {
      const codigo = ucPreview.textContent || ucPreview.value || 'UC001';
      const descripcion = document.querySelector('#uc-preview .uc-description')?.textContent || 
                         document.querySelector('#descripcion_uc')?.value ||
                         'Descripción UC';
      return { codigo, descripcion };
    }
    
    // Valores por defecto para testing
    return { 
      codigo: `N1-${String(Date.now()).slice(-3)}`, 
      descripcion: `UC Estructura - ${this.seccionActual}` 
    };
  }
  
  obtenerValor(id) {
    const elemento = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
    return elemento ? elemento.value.trim() : '';
  }
  
  obtenerTextoSelect(id) {
    const select = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
    if (!select) return '';
    
    const selectedOption = select.options[select.selectedIndex];
    return selectedOption ? selectedOption.textContent.trim() : select.value;
  }
  
  truncar(texto, max) {
    return texto && texto.length > max ? texto.substring(0, max) + '...' : texto || '';
  }
  
  mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.className = 'fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-3 rounded-lg border border-green-300 shadow-lg z-50';
    notif.innerHTML = `<div class="flex items-center gap-2"><i class="fas fa-check-circle"></i><span>${mensaje}</span></div>`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  }
  
  eliminarIteracion(id) {
    const iteracion = this.iteraciones.find(iter => iter.id === id);
    if (!iteracion) return;
    
    if (confirm(`¿Eliminar iteración #${iteracion.numero} de ${this.seccionActual}?`)) {
      this.iteraciones = this.iteraciones.filter(iter => iter.id !== id);
      this.iteraciones.forEach((iter, index) => iter.numero = index + 1);
      this.actualizarTabla();
      this.guardarEnStorage();
      this.mostrarNotificacion('🗑️ Iteración eliminada');
    }
  }
  
  createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }
  
  // Persistencia en localStorage
  guardarEnStorage() {
    const key = `iteraciones_${this.seccionActual}`;
    localStorage.setItem(key, JSON.stringify(this.iteraciones));
  }
  
  cargarIteracionesDesdeStorage() {
    const key = `iteraciones_${this.seccionActual}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        this.iteraciones = JSON.parse(stored);
        this.actualizarTabla();
      } catch (e) {
        console.warn('Error cargando iteraciones:', e);
      }
    }
  }
  
  // Función para obtener todas las iteraciones (útil para envío de formulario)
  obtenerTodasLasIteraciones() {
    return this.iteraciones;
  }
  
  // Limpiar todas las iteraciones
  limpiarIteraciones() {
    if (confirm('¿Eliminar TODAS las iteraciones de esta sección?')) {
      this.iteraciones = [];
      this.actualizarTabla();
      this.guardarEnStorage();
      this.mostrarNotificacion('🧹 Todas las iteraciones eliminadas');
    }
  }
}

// Exponer clase globalmente
window.SistemaIteracionesUniversal = SistemaIteracionesUniversal;

// Auto-inicializar si no se ha hecho ya
if (!window.sistemaIteracionesUniversalInstance) {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      if (!window.sistemaIteracionesUniversalInstance) {
        window.sistemaIteracionesUniversalInstance = new SistemaIteracionesUniversal();
        // console.log('🚀 Sistema de Iteraciones Universal auto-inicializado');
      }
    }, 2000);
  });
}

// console.log('📦 Sistema de Iteraciones Universal cargado');
