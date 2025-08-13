/**
 * Sistema Mejorado de Posicionamiento de Iteraciones
 * Específicamente diseñado para colocar la tabla ANTES de los botones de acción
 */

// Función auxiliar para buscar botones específicos
function encontrarBotonesDeAccion() {
  // console.log('🔍 Buscando botones de acción...');
  
  // Primero buscamos el contenedor principal del formulario
  const formContainer = document.querySelector('form') || document.querySelector('.container') || document.body;
  // console.log('📋 Contenedor de formulario:', formContainer.tagName, formContainer.className);
  
  const selectoreBotones = [
    // Contenedores comunes de botones (más específicos primero)
    '.form-actions',
    '.action-buttons', 
    '.btn-group',
    '.button-group',
    '.form-buttons',
    // Bootstrap/Tailwind patterns
    '.d-flex.justify-content-center',
    '.d-flex.justify-content-end', 
    '.d-flex.justify-content-between',
    '.flex.justify-center',
    '.flex.justify-end',
    '.flex.justify-between',
    '.text-center:has(button)',
    '.text-end:has(button)',
    // Patrones más generales
    'div:has(button[type="submit"])',
    'div:has(input[type="submit"])',
    'p:has(button)',
    '.text-center'
  ];
  
  // Buscar contenedores
  for (const selector of selectoreBotones) {
    const elemento = formContainer.querySelector(selector);
    if (elemento && elemento.querySelector('button, input[type="submit"]')) {
      console.log(`✅ Encontrado contenedor: ${selector}`);
      return elemento;
    }
  }
  
  // Buscar botones directos
  const todosLosBotones = formContainer.querySelectorAll('button, input[type="submit"]');
  // console.log(`🔍 Encontrados ${todosLosBotones.length} botones en total`);
  
  for (const boton of todosLosBotones) {
    const texto = (boton.textContent || boton.value || '').trim().toLowerCase();
    // console.log(`🔍 Evaluando botón: "${texto}"`);
    
    if (texto.includes('guardar') || texto.includes('ver') || texto.includes('enviar') || 
        texto.includes('submit') || texto.includes('save') || 
        boton.type === 'submit') {
      console.log(`✅ Encontrado botón objetivo: "${texto}"`);
      
      // Buscar el contenedor más apropiado
      let contenedor = boton.parentElement;
      while (contenedor && contenedor !== document.body) {
        if (contenedor.classList.contains('text-center') || 
            contenedor.classList.contains('form-actions') ||
            contenedor.classList.contains('d-flex') ||
            contenedor.style.textAlign === 'center') {
          return contenedor;
        }
        contenedor = contenedor.parentElement;
      }
      
      // Si no encontramos un contenedor apropiado, usar el padre directo
      return boton.parentElement || boton;
    }
  }
  
  // Última opción: buscar cualquier botón submit
  const submitButton = formContainer.querySelector('button[type="submit"], input[type="submit"]');
  if (submitButton) {
    console.log('✅ Encontrado botón submit genérico');
    return submitButton.parentElement || submitButton;
  }
  
  console.log('⚠️ No se encontraron botones de acción específicos');
  return null;
}

// Función mejorada de posicionamiento
function posicionarTablaIteraciones() {
  // console.log('🎯 Iniciando posicionamiento de tabla de iteraciones...');
  
  const tablaExistente = document.getElementById('sistema-iteraciones-universal');
  if (!tablaExistente) {
    // Solo log si es el primer intento
    if (arguments[0] === 0) {
      console.log('ℹ️ No hay tabla de iteraciones para reposicionar');
    }
    return false;
  }
  
  console.log('📊 Tabla encontrada:', tablaExistente.getBoundingClientRect());
  
  // Buscar botones de acción
  const botonesAccion = encontrarBotonesDeAccion();
  
  if (botonesAccion) {
    console.log('🎯 Reposicionando tabla antes de los botones de acción');
    console.log('🎯 Posición actual de botones:', botonesAccion.getBoundingClientRect());
    
    // Verificar si ya está en la posición correcta
    const posicionTabla = tablaExistente.getBoundingClientRect();
    const posicionBotones = botonesAccion.getBoundingClientRect();
    
    if (posicionTabla.bottom <= posicionBotones.top + 50) { // 50px de tolerancia
      console.log('✅ Tabla ya está en posición correcta');
      return true;
    }
    
    // Remover la tabla de su posición actual
    const tablaHTML = tablaExistente.outerHTML;
    tablaExistente.remove();
    console.log('🔄 Tabla removida de posición original');
    
    // Insertarla antes de los botones
    botonesAccion.insertAdjacentHTML('beforebegin', tablaHTML);
    console.log('📥 Tabla insertada antes de botones');
    
    // Buscar la tabla recién insertada y aplicar estilos
    const nuevoElemento = document.getElementById('sistema-iteraciones-universal');
    if (nuevoElemento) {
      nuevoElemento.style.marginBottom = '2rem';
      nuevoElemento.style.marginTop = '2rem';
      nuevoElemento.style.border = '2px solid #28a745';
      nuevoElemento.style.borderRadius = '8px';
      nuevoElemento.style.padding = '1rem';
      nuevoElemento.style.backgroundColor = '#f8f9fa';
      
      console.log('✅ Tabla reposicionada exitosamente antes de los botones');
      console.log('📊 Nueva posición:', nuevoElemento.getBoundingClientRect());
      return true;
    } else {
      console.error('❌ Error: No se pudo encontrar la tabla después de insertarla');
      return false;
    }
    
  } else {
    console.log('⚠️ No se encontraron botones de acción, tabla permanece en su posición actual');
    
    // Aún así, aplicamos estilos para destacar la tabla
    tablaExistente.style.border = '2px solid #ffc107';
    tablaExistente.style.backgroundColor = '#fff3cd';
    tablaExistente.style.padding = '1rem';
    tablaExistente.style.borderRadius = '8px';
    
    return false;
  }
}

// Función para ejecutar con reintentos
function ejecutarConReintentos(intentos = 0) {
  const maxIntentos = 5;
  
  if (intentos >= maxIntentos) {
    // console.log('⏰ Se agotaron los intentos de reposicionamiento');
    return;
  }
  
  // Solo mostrar el primer y último intento
  if (intentos === 0 || intentos === maxIntentos - 1) {
    console.log(`🔄 Intento ${intentos + 1} de ${maxIntentos}`);
  }
  
  const exito = posicionarTablaIteraciones();
  
  if (!exito && intentos < maxIntentos - 1) {
    setTimeout(() => ejecutarConReintentos(intentos + 1), 1000);
  }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📋 DOM cargado, ejecutando posicionamiento...');
    setTimeout(() => ejecutarConReintentos(), 1500);
  });
} else {
  console.log('📋 DOM ya está listo, ejecutando posicionamiento inmediatamente...');
  setTimeout(() => ejecutarConReintentos(), 1000);
}

// Ejecutar después de que se hayan cargado todos los scripts
setTimeout(() => {
  console.log('⏰ Ejecutando posicionamiento final después de carga completa...');
  ejecutarConReintentos();
}, 3000);

// Observer para detectar cuando se crea la tabla dinámicamente
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.id === 'sistema-iteraciones-universal' || 
            node.querySelector && node.querySelector('#sistema-iteraciones-universal')) {
          console.log('🆕 Tabla de iteraciones detectada dinámicamente');
          setTimeout(() => ejecutarConReintentos(), 500);
        }
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('📋 Script de reposicionamiento de iteraciones cargado con observer activo');
