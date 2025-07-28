/**
 * Script de verificación: Campos sin valores predefinidos
 * Verifica que los campos de proyecto y banco aparezcan vacíos al cargar
 */

(function() {
    'use strict';
    
    function verificarCamposVacios() {
        console.log('🔍 === VERIFICACIÓN: Campos sin valores predefinidos ===');
        
        // Buscar elementos
        const nombreField = document.getElementById('nombre');
        const bancoField = document.getElementById('banco_proyecto');
        
        if (!nombreField || !bancoField) {
            console.error('❌ No se encontraron los campos necesarios');
            return false;
        }
        
        // Verificar estado inicial
        const nombreValue = nombreField.value;
        const bancoValue = bancoField.value;
        const nombreSelectedIndex = nombreField.selectedIndex;
        
        console.log('📋 Estado de campos:');
        console.log('  - Nombre proyecto valor:', nombreValue);
        console.log('  - Nombre proyecto selectedIndex:', nombreSelectedIndex);
        console.log('  - Banco proyecto valor:', bancoValue);
        console.log('  - Banco proyecto disabled:', bancoField.disabled);
        
        // Verificaciones
        const tests = [
            {
                name: 'Campo nombre debe estar vacío o en opción por defecto',
                passed: nombreValue === '' || nombreValue === 'Seleccionar proyecto' || nombreSelectedIndex === 0,
                value: `"${nombreValue}" (index: ${nombreSelectedIndex})`
            },
            {
                name: 'Campo banco debe estar vacío',
                passed: bancoValue === '',
                value: `"${bancoValue}"`
            },
            {
                name: 'Campo banco debe estar habilitado inicialmente',
                passed: !bancoField.disabled,
                value: bancoField.disabled ? 'Deshabilitado' : 'Habilitado'
            }
        ];
        
        let allPassed = true;
        tests.forEach(test => {
            if (test.passed) {
                console.log(`✅ ${test.name}: CORRECTO (${test.value})`);
            } else {
                console.log(`❌ ${test.name}: FALLIDO (${test.value})`);
                allPassed = false;
            }
        });
        
        // Resultado final
        if (allPassed) {
            console.log('🎉 TODOS LOS TESTS PASARON - Los campos aparecen vacíos correctamente');
        } else {
            console.log('⚠️ ALGUNOS TESTS FALLARON - Revisar configuración');
        }
        
        return allPassed;
    }
    
    function verificarListeners() {
        console.log('🔗 === VERIFICACIÓN: Event Listeners ===');
        
        const nombreField = document.getElementById('nombre');
        if (!nombreField) {
            console.error('❌ Campo nombre no encontrado');
            return;
        }
        
        // Simular cambio a proyecto válido
        console.log('🧪 Simulando selección de proyecto...');
        nombreField.value = 'Automatización de redes distribución CENS';
        
        // Disparar evento change
        nombreField.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Verificar después de un momento
        setTimeout(() => {
            const bancoField = document.getElementById('banco_proyecto');
            if (bancoField && bancoField.value) {
                console.log(`✅ Autocompletado funciona: ${bancoField.value}`);
                
                // Resetear campos
                nombreField.selectedIndex = 0;
                bancoField.value = '';
                bancoField.disabled = false;
                bancoField.classList.remove("bg-green-50", "border-green-300", "text-gray-700");
                
                console.log('🔄 Campos reseteados para prueba de usuario');
            } else {
                console.log('⚠️ Autocompletado no funcionó como esperado');
            }
        }, 100);
    }
    
    // Función principal
    function ejecutarVerificacion() {
        console.log('🚀 Iniciando verificación de valores predefinidos...');
        
        // Verificación inmediata
        const resultadoInicial = verificarCamposVacios();
        
        // Verificación de listeners después de carga completa
        setTimeout(() => {
            verificarListeners();
        }, 1000);
        
        // Verificación final después de procesos de inicialización
        setTimeout(() => {
            console.log('🔄 === VERIFICACIÓN FINAL ===');
            verificarCamposVacios();
        }, 3000);
        
        return resultadoInicial;
    }
    
    // Exponer función globalmente para testing manual
    window.verificarValoresPredefinidos = ejecutarVerificacion;
    
    // Auto-ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ejecutarVerificacion);
    } else {
        ejecutarVerificacion();
    }
    
    console.log('📦 Script de verificación de valores predefinidos cargado');
})();
