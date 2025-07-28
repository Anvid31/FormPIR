/**
 * Mapeo de Proyectos con sus Bancos y Contratos
 * Datos actualizados según especificaciones del cliente
 */

window.PROYECTO_COMPLETO_MAPPING = {
    'Automatización de redes distribución CENS': {
        banco: 'NEG0719TYD',
        contratos: []  // Se llenarán dinámicamente desde el backend
    },
    'Compra de bien futuro': {
        banco: 'NEG9996TYD',
        contratos: []
    },
    'Electrificación Rural CENS': {
        banco: 'NEG0721TYD',
        contratos: []
    },
    'Expansión redes de distribución CENS': {
        banco: 'NEG0720TYD',
        contratos: []
    },
    'Gestión y control pérdidas de energía - CENS': {
        banco: 'PEI0144TYD',
        contratos: []
    },
    'Mantenimiento redes de distribución': {
        banco: 'NEG1175TYD',
        contratos: []
    },
    'Mantenimiento redes de distribución - MIT': {
        banco: 'NEG1175MIT',
        contratos: []
    },
    'Normalización subestación Sevilla 115/34.5 kV e interconexión a 115 kV': {
        banco: 'PEI0342TYD',
        contratos: []
    },
    'Nueva línea INSC77 - Guaduas 34.5 kV': {
        banco: 'PEI1293DIS',
        contratos: []
    },
    'Nuevo Alimentador Gabarra': {
        banco: 'PEI1197TYD',
        contratos: []
    },
    'Reconfiguración Planta Zulia 13.8kV': {
        banco: 'PEI1198TYD',
        contratos: []
    },
    'Reposición redes de distribución CENS': {
        banco: 'NEG0717TYD',
        contratos: []
    },
    'Reposición transformadores distribución CENS': {
        banco: 'NEG0718TYD',
        contratos: []
    },
    'Repotenciación de líneas CENS 115 kV': {
        banco: 'PEI0553TYD',
        contratos: []
    },
    'Reposición subestaciones y líneas CENS': {
        banco: 'NEG0716TYD',
        contratos: []
    },
    'Expansión y normalización de subestaciones media tensión.': {
        banco: 'NEG1176TYD',
        contratos: []
    },
    'Nueva subestación La Playa 34.5/13.8 kV': {
        banco: 'PEI0569TYDCE',
        contratos: []
    },
    'Gestión de Activos CENS': {
        banco: 'SGACENSTYD',
        contratos: []
    },
    'Activos de Uso propiedad de Terceros': {
        banco: 'NEG0720TYD',
        contratos: []
    }
};

// Función para autocompletar banco del proyecto
function autoCompleteBanco() {
    const nombreField = document.getElementById('nombre');
    const bancoField = document.getElementById('banco_proyecto');
    
    if (!nombreField || !bancoField) {
        console.warn('⚠️ No se encontraron los campos nombre o banco_proyecto');
        return;
    }
    
    const nombreProyecto = nombreField.value.trim();
    
    // NO autocompletar si el campo está vacío o es la opción por defecto
    if (!nombreProyecto || nombreProyecto === '' || nombreProyecto === 'Seleccionar proyecto') {
        console.log('🏦 Campo proyecto vacío o por defecto - no autocompletando');
        // Limpiar el banco si no hay proyecto seleccionado
        bancoField.value = "";
        bancoField.classList.remove("bg-green-50", "border-green-300", "text-gray-700");
        bancoField.disabled = false;
        return;
    }
    
    console.log('🏦 Autocompletando banco para proyecto:', nombreProyecto);
    
    if (nombreProyecto && window.PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
        const proyectoData = window.PROYECTO_COMPLETO_MAPPING[nombreProyecto];
        const banco = proyectoData.banco;
        
        // Autocompletar el banco
        bancoField.value = banco;
        bancoField.classList.add("bg-green-50", "border-green-300", "text-gray-700");
        bancoField.disabled = true;
        
        console.log('✅ Banco autocompletado:', banco);
        
        // Actualizar contratos después del banco
        actualizarContratos();
        
        // Evento personalizado para notificar el cambio
        document.dispatchEvent(new CustomEvent('bancoAutocompletado', {
            detail: { proyecto: nombreProyecto, banco: banco }
        }));
        
    } else {
        // Limpiar si no hay mapeo
        bancoField.value = "";
        bancoField.classList.remove("bg-green-50", "border-green-300", "text-gray-700");
        bancoField.disabled = false;
        
        console.log('⚠️ No se encontró mapeo para el proyecto:', nombreProyecto);
    }
}

// Función para actualizar contratos (placeholder - se llenará desde el backend)
function actualizarContratos() {
    const contratoField = document.getElementById('contrato');
    const nombreField = document.getElementById('nombre');
    
    if (!contratoField || !nombreField) return;
    
    const nombreProyecto = nombreField.value;
    
    if (nombreProyecto && window.PROYECTO_COMPLETO_MAPPING[nombreProyecto]) {
        const contratos = window.PROYECTO_COMPLETO_MAPPING[nombreProyecto].contratos;
        
        // Limpiar opciones existentes
        contratoField.innerHTML = '<option value="">Seleccionar contrato</option>';
        
        // Agregar contratos si existen
        if (contratos && contratos.length > 0) {
            contratos.forEach(contrato => {
                const option = document.createElement('option');
                option.value = contrato;
                option.textContent = contrato;
                contratoField.appendChild(option);
            });
            
            contratoField.disabled = false;
            console.log('✅ Contratos actualizados:', contratos.length);
        } else {
            // Si no hay contratos definidos, habilitar para selección manual
            contratoField.disabled = false;
            console.log('⚠️ No hay contratos definidos para este proyecto');
        }
    }
}

// Hacer funciones disponibles globalmente
window.autoCompleteBanco = autoCompleteBanco;
window.actualizarContratos = actualizarContratos;

// Log de inicialización
console.log('✅ PROYECTO_COMPLETO_MAPPING cargado con', Object.keys(window.PROYECTO_COMPLETO_MAPPING).length, 'proyectos');
console.log('📋 Proyectos disponibles:', Object.keys(window.PROYECTO_COMPLETO_MAPPING));
