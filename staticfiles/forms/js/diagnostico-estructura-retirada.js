/**
 * Script de diagnóstico avanzado para estructura_retirada_campo
 * Ejecutar en la consola del navegador para debugging
 */

window.diagnosticoEstructuraRetirada = function() {
    console.clear();
    console.log('🔍 === DIAGNÓSTICO AVANZADO ESTRUCTURA RETIRADA ===');
    
    const campo = document.getElementById('estructura_retirada_campo');
    if (!campo) {
        console.error('❌ Campo estructura_retirada_campo NO encontrado');
        return;
    }
    
    console.log('✅ Campo encontrado:', campo);
    
    // Estado actual
    console.log('📊 ESTADO ACTUAL:');
    console.log('  - Disabled:', campo.disabled);
    console.log('  - ReadOnly:', campo.readOnly);
    console.log('  - Value:', campo.value);
    console.log('  - Classes:', campo.className);
    console.log('  - Style:', campo.style.cssText);
    console.log('  - Data attributes:', Array.from(campo.attributes)
        .filter(attr => attr.name.startsWith('data-'))
        .map(attr => `${attr.name}="${attr.value}"`));
    
    // Verificar protección
    console.log('🛡️ PROTECCIÓN:');
    console.log('  - data-desmantelado-active:', campo.getAttribute('data-desmantelado-active'));
    console.log('  - data-protected:', campo.getAttribute('data-protected'));
    
    // Variables globales
    console.log('🌐 VARIABLES GLOBALES:');
    console.log('  - desmanteladoActivo:', window.desmanteladoActivo);
    console.log('  - monitorInterval activo:', window.monitorInterval !== null);
    
    // Event listeners
    console.log('📡 EVENT LISTENERS:');
    const listeners = getEventListeners(campo);
    if (listeners) {
        Object.keys(listeners).forEach(event => {
            console.log(`  - ${event}: ${listeners[event].length} listeners`);
        });
    } else {
        console.log('  - getEventListeners no disponible en este navegador');
    }
    
    // Función de monitoreo continuo
    let monitorCount = 0;
    const monitor = setInterval(() => {
        monitorCount++;
        console.log(`📊 Monitor #${monitorCount}:`, {
            disabled: campo.disabled,
            readOnly: campo.readOnly,
            classes: campo.className.substring(0, 50) + '...',
            bgColor: getComputedStyle(campo).backgroundColor,
            borderColor: getComputedStyle(campo).borderColor,
            cursor: getComputedStyle(campo).cursor,
            opacity: getComputedStyle(campo).opacity
        });
        
        if (monitorCount >= 10) {
            clearInterval(monitor);
            console.log('🏁 Monitor finalizado después de 10 iteraciones');
        }
    }, 1000);
    
    // Función para forzar corrección manual
    window.forzarCorreccionManual = function() {
        console.log('🔧 FORZANDO CORRECCIÓN MANUAL...');
        campo.disabled = false;
        campo.readOnly = false;
        campo.removeAttribute('disabled');
        campo.removeAttribute('readonly');
        campo.style.backgroundColor = '#fef3c7';
        campo.style.borderColor = '#fbbf24';
        campo.style.color = '#000';
        campo.style.opacity = '1';
        campo.style.cursor = 'text';
        campo.style.pointerEvents = 'auto';
        campo.setAttribute('data-desmantelado-active', 'true');
        campo.setAttribute('data-protected', 'true');
        console.log('✅ Corrección manual aplicada');
    };
    
    console.log('💡 Usa forzarCorreccionManual() para forzar la corrección');
    console.log('💡 Usa debugEstructuraRetirada() para ver el estado actual');
};

// Auto-ejecutar si está en modo debug
if (window.location.search.includes('debug=true')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            diagnosticoEstructuraRetirada();
        }, 2000);
    });
}

console.log('🔍 Script de diagnóstico cargado. Ejecuta diagnosticoEstructuraRetirada() para empezar.');
