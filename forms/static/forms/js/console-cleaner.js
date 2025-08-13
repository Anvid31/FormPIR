/**
 * Script para limpiar y organizar logs de consola
 * Reduce el ruido visual manteniendo información importante
 */

// Función para mostrar solo logs importantes
window.cleanConsole = function() {
  console.clear();
  console.log('%c🎯 FormPIR - Console Limpio', 'color: #10B981; font-size: 16px; font-weight: bold;');
  console.log('%c📋 Sistema iniciado correctamente', 'color: #3B82F6; font-size: 14px;');
  
  // Mostrar estado actual del sistema
  if (window.TiposInversionState) {
    console.log('✅ Sistema de Tipos de Inversión: Activo');
  }
  
  if (window.sistemaIteracionesUniversalInstance) {
    console.log('✅ Sistema de Iteraciones: Activo');
  }
  
  if (window.UCHierarchicalSelector) {
    console.log('✅ Selector UC Jerárquico: Activo');
  }
  
  console.log('---');
};

// Override console methods para filtrar logs repetitivos
const originalLog = console.log;
const originalWarn = console.warn;

// Lista de frases que queremos filtrar
const filteredPhrases = [
  'Banco autocompletado',
  'Configurando autocompletados globales',
  'Event listeners configurados para campo',
  'El selector UC jerárquico maneja automáticamente',
  'Todas las categorías UC están presentes',
  '📦 Proyectos disponibles:',
  '🔍 Encontrados',
  'botones en total'
];

// Function to check if message should be filtered
function shouldFilter(message) {
  if (typeof message !== 'string') return false;
  return filteredPhrases.some(phrase => message.includes(phrase));
}

// Override console.log with filtering
console.log = function(...args) {
  const firstArg = args[0];
  if (shouldFilter(firstArg)) {
    return; // Skip this log
  }
  originalLog.apply(console, args);
};

// Auto-clean console after page load
setTimeout(() => {
  // Solo limpiar si hay demasiados logs
  if (console.history && console.history.length > 50) {
    window.cleanConsole();
  }
}, 5000);

console.log('🧹 Console cleaner cargado - usa cleanConsole() para limpiar');
