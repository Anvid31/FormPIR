// Demostración del Sistema de Iteraciones Compartidas
// Ejecutar en consola del navegador para ver las funcionalidades

console.log('🚀 DEMO: Sistema de Iteraciones Compartidas');
console.log('==========================================');

// Simular datos de prueba
const datosDemostracion = [
  {
    id: 'demo-001',
    descripcion: 'Instalación de postes de concreto en sector residencial',
    estructuras: 'Poste de concreto 12m, cruceta metálica, aislador polimérico',
    estado: 'en-progreso',
    fecha: '2025-01-12',
    seccion: 'estructuras',
    fotos: []
  },
  {
    id: 'demo-002', 
    descripcion: 'Tendido de cable ACSR 4/0 en línea principal',
    estructuras: 'Cable ACSR 4/0, tensor de acero, grapa de anclaje',
    estado: 'completada',
    fecha: '2025-01-11',
    seccion: 'conductores',
    fotos: []
  },
  {
    id: 'demo-003',
    descripcion: 'Instalación de transformador 25 KVA',
    estructuras: 'Transformador monofásico 25KVA, base de concreto, pararrayos',
    estado: 'pendiente',
    fecha: '2025-01-13',
    seccion: 'transformadores',
    fotos: []
  },
  {
    id: 'demo-004',
    descripción: 'Instalación de equipos de protección',
    estructuras: 'Seccionador tripolar, fusibles NH, caja de medición',
    estado: 'en-progreso',
    fecha: '2025-01-12',
    seccion: 'equipos',
    fotos: []
  }
];

// Función para cargar datos de demostración
function cargarDemostracion() {
  console.log('📝 Cargando datos de demostración...');
  
  // Simular localStorage
  const iteracionesExistentes = JSON.parse(localStorage.getItem('iteraciones_compartidas') || '[]');
  const iteracionesCombinadas = [...iteracionesExistentes, ...datosDemostracion];
  
  localStorage.setItem('iteraciones_compartidas', JSON.stringify(iteracionesCombinadas));
  console.log(`✅ ${datosDemostracion.length} iteraciones de demo cargadas`);
  
  // Actualizar tabla si existe
  if (window.iteracionesManager) {
    window.iteracionesManager.cargarIteraciones();
    console.log('🔄 Tabla actualizada con datos de demo');
  }
}

// Función para limpiar datos de demostración
function limpiarDemostracion() {
  console.log('🧹 Limpiando datos de demostración...');
  localStorage.removeItem('iteraciones_compartidas');
  
  if (window.iteracionesManager) {
    window.iteracionesManager.cargarIteraciones();
    console.log('✅ Datos limpiados y tabla actualizada');
  }
}

// Función para mostrar estadísticas
function mostrarEstadisticas() {
  const iteraciones = JSON.parse(localStorage.getItem('iteraciones_compartidas') || '[]');
  
  console.log('📊 ESTADÍSTICAS DEL SISTEMA');
  console.log('===========================');
  console.log(`Total de iteraciones: ${iteraciones.length}`);
  
  // Por sección
  const porSeccion = iteraciones.reduce((acc, iter) => {
    acc[iter.seccion] = (acc[iter.seccion] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n📋 Por Sección:');
  Object.entries(porSeccion).forEach(([seccion, cantidad]) => {
    console.log(`  ${seccion}: ${cantidad}`);
  });
  
  // Por estado
  const porEstado = iteraciones.reduce((acc, iter) => {
    acc[iter.estado] = (acc[iter.estado] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n🚦 Por Estado:');
  Object.entries(porEstado).forEach(([estado, cantidad]) => {
    const emoji = estado === 'completada' ? '🟢' : estado === 'en-progreso' ? '🟡' : '🔵';
    console.log(`  ${emoji} ${estado}: ${cantidad}`);
  });
}

// Función para demostrar las funcionalidades principales
function demoFuncionalidades() {
  console.log('🎯 FUNCIONALIDADES DISPONIBLES');
  console.log('==============================');
  console.log('1. 📝 Crear iteración: Botón "Nueva Iteración"');
  console.log('2. ✏️  Editar iteración: Botón "Editar" en tabla');
  console.log('3. 🗑️  Eliminar iteración: Botón "Eliminar" en tabla');
  console.log('4. 🔍 Filtrar por estado: Dropdown de estados');
  console.log('5. 🔎 Buscar: Campo de búsqueda en tiempo real');
  console.log('6. 📷 Agregar fotos: Drag & drop en modal');
  console.log('7. 💾 Autoguardado: Persistencia automática');
  console.log('8. 🔄 Sincronización: Entre todas las secciones');
  
  console.log('\n🛠️ COMANDOS DE CONSOLA:');
  console.log('cargarDemostracion() - Carga datos de prueba');
  console.log('limpiarDemostracion() - Limpia todos los datos');
  console.log('mostrarEstadisticas() - Muestra estadísticas');
  console.log('demoFuncionalidades() - Esta ayuda');
}

// Función para verificar el estado del sistema
function verificarSistema() {
  console.log('🔍 VERIFICACIÓN DEL SISTEMA');
  console.log('===========================');
  
  const checks = [
    {
      nombre: 'IteracionesManager cargado',
      condicion: typeof IteracionesManager !== 'undefined',
      detalle: 'Clase principal del sistema'
    },
    {
      nombre: 'Manager inicializado',
      condicion: window.iteracionesManager instanceof IteracionesManager,
      detalle: 'Instancia activa del manager'
    },
    {
      nombre: 'DOM elementos presentes',
      condicion: document.getElementById('tabla-iteraciones') !== null,
      detalle: 'Tabla principal en el DOM'
    },
    {
      nombre: 'LocalStorage disponible',
      condicion: typeof Storage !== 'undefined',
      detalle: 'Soporte para persistencia'
    },
    {
      nombre: 'CSS cargado',
      condicion: document.querySelector('link[href*="iteraciones-compartidas"]') !== null,
      detalle: 'Estilos del sistema'
    }
  ];
  
  checks.forEach(check => {
    const status = check.condicion ? '✅' : '❌';
    console.log(`${status} ${check.nombre} - ${check.detalle}`);
  });
  
  const todosOk = checks.every(check => check.condicion);
  console.log(`\n${todosOk ? '🎉' : '⚠️'} Sistema ${todosOk ? 'completamente funcional' : 'con problemas'}`);
}

// Ejecutar verificación inicial
verificarSistema();
demoFuncionalidades();

// Hacer funciones disponibles globalmente
window.cargarDemostracion = cargarDemostracion;
window.limpiarDemostracion = limpiarDemostracion;
window.mostrarEstadisticas = mostrarEstadisticas;
window.demoFuncionalidades = demoFuncionalidades;
window.verificarSistema = verificarSistema;
