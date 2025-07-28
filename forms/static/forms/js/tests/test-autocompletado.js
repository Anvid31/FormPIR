/**
 * Test del Autocompletado de Proyectos
 * Script temporal para verificar que todo funcione
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 === TEST AUTOCOMPLETADO PROYECTOS ===');
    
    // Test 1: Verificar que PROYECTO_COMPLETO_MAPPING esté disponible
    if (typeof window.PROYECTO_COMPLETO_MAPPING !== 'undefined') {
        console.log('✅ PROYECTO_COMPLETO_MAPPING disponible');
        console.log('📊 Cantidad de proyectos:', Object.keys(window.PROYECTO_COMPLETO_MAPPING).length);
        
        // Mostrar primer proyecto como ejemplo
        const primerProyecto = Object.keys(window.PROYECTO_COMPLETO_MAPPING)[0];
        console.log('📋 Ejemplo:', primerProyecto, '→', window.PROYECTO_COMPLETO_MAPPING[primerProyecto]);
    } else {
        console.error('❌ PROYECTO_COMPLETO_MAPPING NO disponible');
        return;
    }
    
    // Test 2: Verificar que los elementos del formulario existen
    const nombreField = document.getElementById('nombre');
    const bancoField = document.getElementById('banco_proyecto');
    
    if (nombreField && bancoField) {
        console.log('✅ Elementos del formulario encontrados');
        
        // Test 3: Simular selección de proyecto
        setTimeout(() => {
            console.log('🧪 Simulando selección de proyecto...');
            nombreField.value = 'Automatización de redes distribución CENS';
            
            // Disparar evento change
            const event = new Event('change', { bubbles: true });
            nombreField.dispatchEvent(event);
            
            // Verificar resultado después de un momento
            setTimeout(() => {
                if (bancoField.value) {
                    console.log('✅ Autocompletado funcionó! Banco:', bancoField.value);
                } else {
                    console.error('❌ Autocompletado NO funcionó - Banco vacío');
                }
            }, 100);
            
        }, 1000);
        
    } else {
        console.error('❌ Elementos del formulario no encontrados');
        console.log('nombre field:', nombreField);
        console.log('banco field:', bancoField);
    }
    
    // Test 4: Verificar que autoCompleteBanco esté disponible
    if (typeof window.autoCompleteBanco === 'function') {
        console.log('✅ Función autoCompleteBanco disponible');
    } else {
        console.error('❌ Función autoCompleteBanco NO disponible');
    }
    
    console.log('🧪 === FIN TEST ===');
});
