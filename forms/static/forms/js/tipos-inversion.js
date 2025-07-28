/**
 * Gestión de Tipos de Inversión - VERSIÓN ÚNICA SIMPLIFICADA
 * Maneja Montaje Integral y Desmantelado de forma limpia y sin conflictos
 */

(function() {
    'use strict';
    
    // Variables globales para el estado
    let montajeIntegralActivo = false;
    let desmanteladoActivo = false;
    let montajeEstadoPrevio = false; // Para preservar estado al toggle Desmantelado
    
    /**
     * Función principal para manejar cambios en tipo de inversión
     */
    function handleTipoInversion() {
        const tipoInversion = document.getElementById("t_inv");
        if (!tipoInversion) return;
        
        const valor = tipoInversion.value;
        console.log(`📋 Tipo de inversión seleccionado: ${valor}`);
        
        // Manejar estructura retirada según tipo
        manejarEstructuraRetirada(valor);
        
        // Mostrar/ocultar checkboxes según tipo
        mostrarOcultarMontajeIntegral(valor);
        mostrarOcultarDesmantelado(valor);
    }
    
    /**
     * Manejar campo estructura retirada según tipo de inversión
     */
    function manejarEstructuraRetirada(tipoInversion) {
        const estructuraRetirada = document.getElementById("estructura_retirada_campo");
        if (!estructuraRetirada) return;
        
        if (tipoInversion === "I" || tipoInversion === "III") {
            // Habilitar para tipos I y III
            estructuraRetirada.disabled = false;
            estructuraRetirada.required = true;
            estructuraRetirada.classList.remove("bg-gray-100", "cursor-not-allowed");
            console.log("✅ Estructura retirada habilitada para tipo " + tipoInversion);
        } else {
            // Deshabilitar para tipos II y IV
            estructuraRetirada.disabled = true;
            estructuraRetirada.required = false;
            estructuraRetirada.value = "";
            estructuraRetirada.classList.add("bg-gray-100", "cursor-not-allowed");
            console.log("❌ Estructura retirada deshabilitada para tipo " + tipoInversion);
        }
    }
    
    /**
     * Mostrar/ocultar checkbox Montaje Integral (tipos II y IV)
     */
    function mostrarOcultarMontajeIntegral(tipoInversion) {
        const container = document.getElementById("montaje_integral_container");
        if (!container) return;
        
        if (tipoInversion === "II" || tipoInversion === "IV") {
            container.style.display = "flex";
            console.log("🔧 Mostrando checkbox Montaje Integral");
        } else {
            container.style.display = "none";
            // Si se oculta, desactivar el checkbox
            const checkbox = document.getElementById("montaje_integral_checkbox");
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
                toggleMontajeIntegral();
            }
        }
    }
    
    /**
     * Mostrar/ocultar checkbox Desmantelado (tipos I y III)
     */
    function mostrarOcultarDesmantelado(tipoInversion) {
        const container = document.getElementById("desmantelado_container");
        if (!container) return;
        
        if (tipoInversion === "I" || tipoInversion === "III") {
            container.style.display = "flex";
            console.log("🚨 Mostrando checkbox Desmantelado");
        } else {
            container.style.display = "none";
            // Si se oculta, desactivar el checkbox
            const checkbox = document.getElementById("desmantelado_checkbox");
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
                toggleDesmantelado();
            }
        }
    }
    
    /**
     * Toggle Montaje Integral - VERSIÓN SIMPLIFICADA
     */
    function toggleMontajeIntegral() {
        const checkbox = document.getElementById("montaje_integral_checkbox");
        montajeIntegralActivo = checkbox ? checkbox.checked : false;
        
        console.log(`🔧 Montaje Integral: ${montajeIntegralActivo ? 'ACTIVADO' : 'DESACTIVADO'}`);
        
        // Si Desmantelado está activo, no hacer nada y restaurar estado previo
        if (desmanteladoActivo) {
            console.log('⚠️ Montaje Integral bloqueado por Desmantelado activo');
            if (checkbox) {
                checkbox.checked = montajeEstadoPrevio;
                montajeIntegralActivo = montajeEstadoPrevio;
            }
            return;
        }
        
        if (montajeIntegralActivo) {
            // Deshabilitar UC
            deshabilitarSeccionUC(true);
            
            // Deshabilitar estructura retirada
            const estructuraRetirada = document.getElementById("estructura_retirada_campo");
            if (estructuraRetirada) {
                estructuraRetirada.disabled = true;
                estructuraRetirada.classList.add("bg-gray-100", "cursor-not-allowed", "opacity-50");
            }
        } else {
            // Habilitar UC
            deshabilitarSeccionUC(false);
            
            // Habilitar estructura retirada si el tipo es I o III
            const tipoInversion = document.getElementById("t_inv").value;
            if (tipoInversion === "I" || tipoInversion === "III") {
                const estructuraRetirada = document.getElementById("estructura_retirada_campo");
                if (estructuraRetirada) {
                    estructuraRetirada.disabled = false;
                    estructuraRetirada.classList.remove("bg-gray-100", "cursor-not-allowed", "opacity-50");
                }
            }
        }
    }
    
    /**
     * Toggle Desmantelado - VERSIÓN SIMPLIFICADA
     * FIX: Preserva estado de Montaje Integral
     */
    function toggleDesmantelado() {
        const checkbox = document.getElementById("desmantelado_checkbox");
        desmanteladoActivo = checkbox ? checkbox.checked : false;
        
        console.log(`🚨 Desmantelado: ${desmanteladoActivo ? 'ACTIVADO' : 'DESACTIVADO'}`);
        
        if (desmanteladoActivo) {
            // GUARDAR estado actual de Montaje Integral
            montajeEstadoPrevio = montajeIntegralActivo;
            console.log(`💾 Guardando estado Montaje Integral: ${montajeEstadoPrevio}`);
            
            // Deshabilitar secciones
            deshabilitarInformacionTecnica(true);
            deshabilitarSeccionUC(true);
            
            // Deshabilitar checkbox de Montaje Integral
            const montajeCheckbox = document.getElementById("montaje_integral_checkbox");
            if (montajeCheckbox) {
                montajeCheckbox.disabled = true;
                montajeCheckbox.classList.add("opacity-50", "cursor-not-allowed");
            }
            
            // Habilitar estructura retirada con highlight
            const estructuraRetirada = document.getElementById("estructura_retirada_campo");
            if (estructuraRetirada) {
                estructuraRetirada.disabled = false;
                estructuraRetirada.classList.remove("bg-gray-100", "cursor-not-allowed");
                estructuraRetirada.classList.add("bg-yellow-50", "border-yellow-300", "ring-2", "ring-yellow-400");
                
                setTimeout(() => {
                    estructuraRetirada.focus();
                }, 100);
            }
            
        } else {
            // Desactivar desmantelado - RESTAURACIÓN SIMPLE
            deshabilitarInformacionTecnica(false);
            deshabilitarSeccionUC(false);
            
            // RESTAURAR checkbox de Montaje Integral
            const montajeCheckbox = document.getElementById("montaje_integral_checkbox");
            if (montajeCheckbox) {
                montajeCheckbox.disabled = false;
                montajeCheckbox.classList.remove("opacity-50", "cursor-not-allowed");
                
                // Restaurar estado previo
                montajeCheckbox.checked = montajeEstadoPrevio;
                montajeIntegralActivo = montajeEstadoPrevio;
                console.log(`🔄 Estado Montaje Integral restaurado: ${montajeEstadoPrevio}`);
            }
            
            // Limpiar estructura retirada
            const estructuraRetirada = document.getElementById("estructura_retirada_campo");
            if (estructuraRetirada) {
                estructuraRetirada.classList.remove("bg-yellow-50", "border-yellow-300", "ring-2", "ring-yellow-400");
                
                // Verificar si debe estar deshabilitada según tipo de inversión
                const tipoInversion = document.getElementById("t_inv").value;
                if (tipoInversion !== "I" && tipoInversion !== "III") {
                    estructuraRetirada.disabled = true;
                    estructuraRetirada.classList.add("bg-gray-100", "cursor-not-allowed");
                }
            }
            
            // RE-APLICAR Montaje Integral si estaba activo
            if (montajeEstadoPrevio) {
                console.log('🔄 Re-aplicando Montaje Integral...');
                setTimeout(() => {
                    toggleMontajeIntegral();
                }, 100);
            }
        }
    }
    
    /**
     * Deshabilitar/habilitar sección Información Técnica (excepto estructura retirada)
     */
    function deshabilitarInformacionTecnica(deshabilitar) {
        const seccion = document.querySelector("#seccion-informacion-tecnica, .informacion-tecnica-section");
        if (!seccion) {
            console.warn("No se encontró la sección de Información Técnica");
            return;
        }
        
        const campos = seccion.querySelectorAll("input, select, textarea");
        let camposDeshabilitados = 0;
        let camposExcluidos = 0;
        
        campos.forEach(campo => {
            // No deshabilitar estructura retirada ni el checkbox desmantelado
            if (campo.id === "estructura_retirada_campo" || 
                campo.id === "desmantelado_checkbox") {
                console.log(`🛡️ PROTEGIDO: ${campo.id} - NO se modifica`);
                camposExcluidos++;
                return;
            }
            
            campo.disabled = deshabilitar;
            if (deshabilitar) {
                campo.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
                console.log(`🔒 DESHABILITADO: ${campo.id || campo.name || 'sin-id'}`);
            } else {
                campo.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");
                console.log(`🔓 HABILITADO: ${campo.id || campo.name || 'sin-id'}`);
            }
            camposDeshabilitados++;
        });
        
        console.log(`📋 Información Técnica: ${camposDeshabilitados} campos ${deshabilitar ? 'deshabilitados' : 'habilitados'}, ${camposExcluidos} campos protegidos`);
    }
    
    /**
     * Deshabilitar/habilitar sección UC (Información de Estructuras)
     */
    function deshabilitarSeccionUC(deshabilitar) {
        const seccion = document.getElementById("seccion-informacion-estructuras");
        if (!seccion) {
            console.warn("No se encontró la sección de UC");
            return;
        }
        
        // Deshabilitar todos los elementos interactivos
        const elementos = seccion.querySelectorAll("input, select, textarea, button, .uc-card");
        let elementosDeshabilitados = 0;
        let elementosProtegidos = 0;
        
        elementos.forEach(elemento => {
            // NO deshabilitar estructura retirada ni checkbox desmantelado aunque estén en UC
            if (elemento.id === "estructura_retirada_campo" || 
                elemento.id === "desmantelado_checkbox") {
                console.log(`🛡️ PROTEGIDO EN UC: ${elemento.id} - NO se modifica`);
                elementosProtegidos++;
                return;
            }
            
            if (elemento.tagName === 'BUTTON' || elemento.classList.contains('uc-card')) {
                if (deshabilitar) {
                    elemento.classList.add("opacity-50", "pointer-events-none", "cursor-not-allowed");
                } else {
                    elemento.classList.remove("opacity-50", "pointer-events-none", "cursor-not-allowed");
                }
            } else {
                elemento.disabled = deshabilitar;
                if (deshabilitar) {
                    elemento.classList.add("bg-gray-100", "text-gray-500", "cursor-not-allowed");
                } else {
                    elemento.classList.remove("bg-gray-100", "text-gray-500", "cursor-not-allowed");
                }
            }
            console.log(`${deshabilitar ? '🔒' : '🔓'} UC: ${elemento.id || elemento.name || elemento.className || 'sin-id'}`);
            elementosDeshabilitados++;
        });
        
        // Aplicar overlay visual
        if (deshabilitar) {
            seccion.classList.add("relative", "opacity-75");
            // Crear overlay si no existe
            if (!seccion.querySelector('.section-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'section-overlay absolute inset-0 bg-gray-200 bg-opacity-50 z-10';
                seccion.appendChild(overlay);
            }
        } else {
            seccion.classList.remove("opacity-75");
            // Remover overlay
            const overlay = seccion.querySelector('.section-overlay');
            if (overlay) overlay.remove();
        }
        
        console.log(`🏗️ UC: ${elementosDeshabilitados} elementos ${deshabilitar ? 'deshabilitados' : 'habilitados'}, ${elementosProtegidos} elementos protegidos`);
    }
    

    
    /**
     * Inicialización SIMPLIFICADA
     */
    function init() {
        console.log('🚀 Inicializando gestión de tipos de inversión - VERSIÓN ÚNICA SIMPLIFICADA');
        
        // Event listener para tipo de inversión
        const tipoInvSelect = document.getElementById('t_inv');
        if (tipoInvSelect) {
            tipoInvSelect.addEventListener('change', handleTipoInversion);
            // Ejecutar al cargar
            handleTipoInversion();
        }
        
        // Event listeners para checkboxes
        const montajeCheckbox = document.getElementById('montaje_integral_checkbox');
        if (montajeCheckbox) {
            montajeCheckbox.addEventListener('change', toggleMontajeIntegral);
        }
        
        const desmanteladoCheckbox = document.getElementById('desmantelado_checkbox');
        if (desmanteladoCheckbox) {
            desmanteladoCheckbox.addEventListener('change', toggleDesmantelado);
        }
        
        // Asegurar estado inicial correcto
        if (montajeCheckbox) montajeCheckbox.checked = false;
        if (desmanteladoCheckbox) desmanteladoCheckbox.checked = false;
        montajeIntegralActivo = false;
        desmanteladoActivo = false;
        montajeEstadoPrevio = false;
        
        console.log('✅ Sistema de tipos de inversión inicializado correctamente');
    }
    
    // Exponer funciones globalmente
    window.handleTipoInversion = handleTipoInversion;
    window.toggleMontajeIntegral = toggleMontajeIntegral;
    window.toggleDesmantelado = toggleDesmantelado;
    
    // Función de debug simple
    window.debugTiposInversion = function() {
        console.log('� === DEBUG TIPOS DE INVERSIÓN ===');
        console.log('Estado Montaje Integral:', montajeIntegralActivo);
        console.log('Estado Desmantelado:', desmanteladoActivo);
        console.log('Estado Previo Montaje:', montajeEstadoPrevio);
        console.log('=== FIN DEBUG ===');
    };
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
