/**
 * Script de diagnóstico avanzado para estructura retirada
 * Detecta qué está causando el encogimiento del campo
 */
(function() {
    'use strict';
    
    window.debugEstructuraRetirada = function() {
        const campo = document.getElementById('estructura_retirada_campo');
        if (!campo) {
            console.error('❌ Campo estructura_retirada_campo no encontrado');
            return;
        }
        
        // Capturar estilos iniciales
        const estilosIniciales = {
            width: campo.offsetWidth,
            height: campo.offsetHeight,
            padding: window.getComputedStyle(campo).padding,
            fontSize: window.getComputedStyle(campo).fontSize,
            className: campo.className,
            cssText: campo.style.cssText
        };
        
        console.log('📏 ESTILOS INICIALES:', estilosIniciales);
        
        // Observar cambios en atributos
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    console.log(`🔄 ATRIBUTO CAMBIADO: ${mutation.attributeName}`);
                    
                    if (mutation.attributeName === 'class') {
                        console.log('  📝 Clases anteriores:', mutation.oldValue);
                        console.log('  📝 Clases nuevas:', campo.className);
                    }
                    
                    if (mutation.attributeName === 'style') {
                        console.log('  🎨 Estilos anteriores:', mutation.oldValue);
                        console.log('  🎨 Estilos nuevos:', campo.style.cssText);
                        console.log('  📐 Dimensiones actuales:', {
                            width: campo.offsetWidth,
                            height: campo.offsetHeight,
                            padding: window.getComputedStyle(campo).padding
                        });
                        
                        // Verificar si cambió el tamaño
                        if (campo.offsetWidth !== estilosIniciales.width || 
                            campo.offsetHeight !== estilosIniciales.height) {
                            console.warn('🚨 CAMBIO DE DIMENSIONES DETECTADO!');
                        }
                    }
                    
                    // Stack trace para ver quién hizo el cambio
                    console.trace('📍 Stack trace del cambio:');
                }
            });
        });
        
        observer.observe(campo, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['class', 'style', 'disabled', 'readonly']
        });
        
        console.log('🔍 OBSERVADOR ACTIVADO para estructura_retirada_campo');
        
        // Monitor de dimensiones cada segundo
        const monitorDimensiones = setInterval(() => {
            const dimensionesActuales = {
                width: campo.offsetWidth,
                height: campo.offsetHeight
            };
            
            if (dimensionesActuales.width !== estilosIniciales.width || 
                dimensionesActuales.height !== estilosIniciales.height) {
                console.warn('⚠️ CAMBIO DE DIMENSIONES DETECTADO:', {
                    inicial: { width: estilosIniciales.width, height: estilosIniciales.height },
                    actual: dimensionesActuales,
                    diferencia: {
                        width: dimensionesActuales.width - estilosIniciales.width,
                        height: dimensionesActuales.height - estilosIniciales.height
                    }
                });
                
                // Actualizar referencia inicial
                estilosIniciales.width = dimensionesActuales.width;
                estilosIniciales.height = dimensionesActuales.height;
            }
        }, 1000);
        
        // Función para detener el debug
        window.stopDebugEstructuraRetirada = function() {
            observer.disconnect();
            clearInterval(monitorDimensiones);
            console.log('🛑 Debug de estructura retirada detenido');
        };
        
        return {
            observer,
            monitorDimensiones,
            estilosIniciales
        };
    };
    
    // Activar automáticamente al cargar
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            if (document.getElementById('estructura_retirada_campo')) {
                debugEstructuraRetirada();
                console.log('🔍 Debug automático iniciado para estructura_retirada_campo');
            }
        }, 1000);
    });
    
    console.log('🔧 Script de diagnóstico avanzado cargado');
})();
