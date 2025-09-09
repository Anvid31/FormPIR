/**
 * SCRIPT DE VERIFICACIÓN FINAL
 * Ejecuta todas las pruebas y validaciones del sistema corregido
 */

function verificacionCompleta() {
    console.group('🎯 VERIFICACIÓN COMPLETA DEL SISTEMA CORREGIDO');
    console.log('📅 Fecha:', new Date().toLocaleString());
    console.log('🔄 Ejecutando todas las pruebas...');
    
    const resultados = {
        sistemasActivos: {},
        pruebasTiposInversion: {},
        pruebasCircuitos: {},
        pruebasCheckboxes: {},
        erroresEncontrados: []
    };
    
    try {
        // 1. Verificar sistemas activos
        verificarSistemasActivos(resultados);
        
        // 2. Probar tipos de inversión
        probarTiposInversion(resultados);
        
        // 3. Probar circuitos
        probarCircuitos(resultados);
        
        // 4. Probar checkboxes
        probarCheckboxes(resultados);
        
        // 5. Generar reporte
        generarReporte(resultados);
        
    } catch (error) {
        console.error('❌ Error en verificación:', error);
        resultados.erroresEncontrados.push(error.message);
    }
    
    console.groupEnd();
    return resultados;
}

function verificarSistemasActivos(resultados) {
    console.log('1️⃣ Verificando sistemas activos...');
    
    const sistemas = {
        'Sistema Unificado': 'sistemaUnificado',
        'Tipos Inversión Corregido': 'sistemaTiposInversionCorregido',
        'Iteraciones Compartidas': 'sistemaIteracionesCompartidas',
        'Debug Circuitos': 'debugCircuitos',
        'Shared Fields': 'sharedFieldsManager'
    };
    
    Object.entries(sistemas).forEach(([nombre, variable]) => {
        const activo = !!window[variable];
        resultados.sistemasActivos[nombre] = activo;
        console.log(`   ${activo ? '✅' : '❌'} ${nombre}`);
    });
    
    // Verificar que sistema universal esté desactivado
    const universalDesactivado = !window.sistemaIteracionesUniversalInstance;
    resultados.sistemasActivos['Universal Desactivado'] = universalDesactivado;
    console.log(`   ${universalDesactivado ? '✅' : '❌'} Sistema Universal Desactivado`);
}

function probarTiposInversion(resultados) {
    console.log('2️⃣ Probando tipos de inversión...');
    
    const tipoInvField = document.getElementById('t_inv');
    const estructuraField = document.getElementById('estructura_retirada') || 
                           document.getElementById('estructura_retirada_campo');
    const latitudField = document.getElementById('latitud_inicial');
    
    if (!tipoInvField) {
        resultados.erroresEncontrados.push('Campo tipo inversión no encontrado');
        return;
    }
    
    // Guardar valor original
    const valorOriginal = tipoInvField.value;
    
    // Probar tipo I
    tipoInvField.value = 'I';
    tipoInvField.dispatchEvent(new Event('change'));
    
    setTimeout(() => {
        if (estructuraField) {
            const estructuraHabilitada = !estructuraField.disabled;
            resultados.pruebasTiposInversion['Tipo I - Estructura Retirada'] = estructuraHabilitada;
            console.log(`   ${estructuraHabilitada ? '✅' : '❌'} Tipo I habilita estructura_retirada`);
        }
        
        if (latitudField) {
            const coordenadasDeshabilitadas = latitudField.disabled;
            resultados.pruebasTiposInversion['Tipo I - Coordenadas Deshabilitadas'] = coordenadasDeshabilitadas;
            console.log(`   ${coordenadasDeshabilitadas ? '✅' : '❌'} Tipo I deshabilita coordenadas`);
        }
        
        // Restaurar valor original
        tipoInvField.value = valorOriginal;
        tipoInvField.dispatchEvent(new Event('change'));
    }, 300);
    
    // Probar tipo II
    setTimeout(() => {
        tipoInvField.value = 'II';
        tipoInvField.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
            if (estructuraField) {
                const estructuraDeshabilitada = estructuraField.disabled;
                resultados.pruebasTiposInversion['Tipo II - Estructura Deshabilitada'] = estructuraDeshabilitada;
                console.log(`   ${estructuraDeshabilitada ? '✅' : '❌'} Tipo II deshabilita estructura_retirada`);
            }
            
            if (latitudField) {
                const coordenadasHabilitadas = !latitudField.disabled;
                resultados.pruebasTiposInversion['Tipo II - Coordenadas Habilitadas'] = coordenadasHabilitadas;
                console.log(`   ${coordenadasHabilitadas ? '✅' : '❌'} Tipo II habilita coordenadas`);
            }
            
            // Restaurar valor original
            tipoInvField.value = valorOriginal;
            tipoInvField.dispatchEvent(new Event('change'));
        }, 300);
    }, 600);
}

function probarCircuitos(resultados) {
    console.log('3️⃣ Probando sistema de circuitos...');
    
    const municipioField = document.getElementById('municipio');
    const alimentadorField = document.getElementById('alimentador');
    
    if (!municipioField || !alimentadorField) {
        resultados.erroresEncontrados.push('Campos municipio/alimentador no encontrados');
        return;
    }
    
    // Guardar valor original
    const valorOriginal = municipioField.value;
    
    // Probar con CÚCUTA (municipio con muchos circuitos)
    municipioField.value = 'CÚCUTA';
    municipioField.dispatchEvent(new Event('change'));
    
    setTimeout(() => {
        const alimentadorHabilitado = !alimentadorField.disabled;
        const opcionesDisponibles = alimentadorField.options ? alimentadorField.options.length - 1 : 0;
        
        resultados.pruebasCircuitos['Alimentador Habilitado'] = alimentadorHabilitado;
        resultados.pruebasCircuitos['Opciones Disponibles'] = opcionesDisponibles;
        
        console.log(`   ${alimentadorHabilitado ? '✅' : '❌'} Alimentador habilitado con CÚCUTA`);
        console.log(`   ${opcionesDisponibles > 0 ? '✅' : '❌'} ${opcionesDisponibles} circuitos disponibles`);
        
        // Probar con municipio sin circuitos
        municipioField.value = 'CONCEPCION';
        municipioField.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
            const alimentadorDeshabilitado = alimentadorField.disabled;
            resultados.pruebasCircuitos['Sin Circuitos - Deshabilitado'] = alimentadorDeshabilitado;
            console.log(`   ${alimentadorDeshabilitado ? '✅' : '❌'} Alimentador deshabilitado sin circuitos`);
            
            // Restaurar valor original
            municipioField.value = valorOriginal;
            municipioField.dispatchEvent(new Event('change'));
        }, 300);
    }, 300);
}

function probarCheckboxes(resultados) {
    console.log('4️⃣ Probando checkboxes reversibles...');
    
    const montajeCheckbox = document.getElementById('montaje_integral') || 
                           document.getElementById('montaje_integral_checkbox');
    const desmanteladoCheckbox = document.getElementById('desmantelado') || 
                               document.getElementById('desmantelado_checkbox');
    
    if (montajeCheckbox) {
        // Probar montaje integral
        const estadoOriginalMontaje = montajeCheckbox.checked;
        
        // Activar
        montajeCheckbox.checked = true;
        montajeCheckbox.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
            // Verificar que campos se deshabilitaron
            const alturaField = document.getElementById('altura');
            const montajeActivo = alturaField ? alturaField.disabled : false;
            
            // Desactivar
            montajeCheckbox.checked = false;
            montajeCheckbox.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
                const montajeRevertido = alturaField ? !alturaField.disabled : true;
                
                resultados.pruebasCheckboxes['Montaje Integral Reversible'] = montajeRevertido;
                console.log(`   ${montajeRevertido ? '✅' : '❌'} Montaje integral revierte correctamente`);
                
                // Restaurar estado original
                montajeCheckbox.checked = estadoOriginalMontaje;
                montajeCheckbox.dispatchEvent(new Event('change'));
            }, 200);
        }, 200);
    }
    
    if (desmanteladoCheckbox) {
        // Probar desmantelado
        const estadoOriginalDesmantelado = desmanteladoCheckbox.checked;
        
        setTimeout(() => {
            // Activar
            desmanteladoCheckbox.checked = true;
            desmanteladoCheckbox.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
                // Desactivar
                desmanteladoCheckbox.checked = false;
                desmanteladoCheckbox.dispatchEvent(new Event('change'));
                
                setTimeout(() => {
                    const direccionField = document.getElementById('direccion');
                    const desmanteladoRevertido = direccionField ? !direccionField.disabled : true;
                    
                    resultados.pruebasCheckboxes['Desmantelado Reversible'] = desmanteladoRevertido;
                    console.log(`   ${desmanteladoRevertido ? '✅' : '❌'} Desmantelado revierte correctamente`);
                    
                    // Restaurar estado original
                    desmanteladoCheckbox.checked = estadoOriginalDesmantelado;
                    desmanteladoCheckbox.dispatchEvent(new Event('change'));
                }, 200);
            }, 200);
        }, 1000);
    }
}

function generarReporte(resultados) {
    console.group('📊 REPORTE FINAL');
    
    // Calcular estadísticas
    const totalSistemas = Object.keys(resultados.sistemasActivos).length;
    const sistemasOK = Object.values(resultados.sistemasActivos).filter(v => v).length;
    
    const totalPruebasTipos = Object.keys(resultados.pruebasTiposInversion).length;
    const pruebasTiposOK = Object.values(resultados.pruebasTiposInversion).filter(v => v).length;
    
    const totalPruebasCircuitos = Object.keys(resultados.pruebasCircuitos).length;
    const pruebasCircuitosOK = Object.values(resultados.pruebasCircuitos).filter(v => v).length;
    
    const totalPruebasCheckbox = Object.keys(resultados.pruebasCheckboxes).length;
    const pruebasCheckboxOK = Object.values(resultados.pruebasCheckboxes).filter(v => v).length;
    
    console.log('🎯 RESUMEN DE RESULTADOS:');
    console.log(`   Sistemas Activos: ${sistemasOK}/${totalSistemas}`);
    console.log(`   Tipos Inversión: ${pruebasTiposOK}/${totalPruebasTipos}`);
    console.log(`   Circuitos: ${pruebasCircuitosOK}/${totalPruebasCircuitos}`);
    console.log(`   Checkboxes: ${pruebasCheckboxOK}/${totalPruebasCheckbox}`);
    
    if (resultados.erroresEncontrados.length > 0) {
        console.log('🚨 ERRORES ENCONTRADOS:');
        resultados.erroresEncontrados.forEach(error => {
            console.log(`   ❌ ${error}`);
        });
    }
    
    const porcentajeExito = ((sistemasOK + pruebasTiposOK + pruebasCircuitosOK + pruebasCheckboxOK) / 
                           (totalSistemas + totalPruebasTipos + totalPruebasCircuitos + totalPruebasCheckbox)) * 100;
    
    console.log(`🎯 ÉXITO GENERAL: ${porcentajeExito.toFixed(1)}%`);
    
    if (porcentajeExito >= 90) {
        console.log('✅ Sistema funcionando correctamente');
    } else if (porcentajeExito >= 70) {
        console.log('⚠️ Sistema funcional con problemas menores');
    } else {
        console.log('❌ Sistema requiere atención inmediata');
    }
    
    console.groupEnd();
}

// Hacer disponible globalmente
window.verificacionCompleta = verificacionCompleta;

// Auto-ejecutar después de inicialización
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🔍 Verificación completa disponible: verificacionCompleta()');
        
        // Auto-ejecutar solo en modo debug
        if (window.location.search.includes('debug=true')) {
            setTimeout(() => {
                verificacionCompleta();
            }, 5000);
        }
    }, 4000);
});

console.log('✅ Script de verificación cargado');
