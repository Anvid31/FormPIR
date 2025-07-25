/**
 * Gestión de Tipos de Inversión - VERSIÓN SIMPLIFICADA 4.0
 * NO MODIFICA ESTILOS - Solo estados y clases CSS
 */

(function() {
    'use strict';
    
    // Variables globales para el estado
    let montajeIntegralActivo = false;
    let desmanteladoActivo = false;
    let protectionMonitor = null;
    
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
            estructuraRetirada.removeAttribute('disabled','disabled');
            estructuraRetirada.required = true;
            estructuraRetirada.classList.remove("bg-gray-100", "cursor-not-allowed");
            console.log("✅ Estructura retirada habilitada para tipo " + tipoInversion);
        } else {
            // Deshabilitar para tipos II y IV
            estructuraRetirada.setAttribute('disabled', 'disabled');
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
     * Toggle Montaje Integral
     */
    function toggleMontajeIntegral() {
        const checkbox = document.getElementById("montaje_integral_checkbox");
        montajeIntegralActivo = checkbox ? checkbox.checked : false;
        
        console.log(`🔧 Montaje Integral: ${montajeIntegralActivo ? 'ACTIVADO' : 'DESACTIVADO'}`);
        
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
     * NO modifica estilos visuales, solo estados
     */
    function toggleDesmantelado() {
        const checkbox = document.getElementById("desmantelado_checkbox");
        desmanteladoActivo = checkbox ? checkbox.checked : false;
        
        console.log(`🚨 Desmantelado: ${desmanteladoActivo ? 'ACTIVADO' : 'DESACTIVADO'}`);
        
        if (desmanteladoActivo) {
            // PASO 1: Deshabilitar secciones
            deshabilitarInformacionTecnica(true);
            deshabilitarSeccionUC(true);
            
            // PASO 2: Habilitar SOLO estructura retirada sin modificar estilos
            const estructuraRetirada = document.getElementById("estructura_retirada_campo");
            if (estructuraRetirada) {
                console.log('🔧 CONFIGURANDO estructura_retirada_campo SIN modificar estilos');
                
                // Guardar clases originales
                if (!estructuraRetirada.hasAttribute('data-original-class')) {
                    estructuraRetirada.setAttribute('data-original-class', estructuraRetirada.className);
                    console.log('💾 Clases originales guardadas:', estructuraRetirada.className);
                }
                
                // Solo cambiar estado, NO estilos
                estructuraRetirada.disabled = false;
                estructuraRetirada.readOnly = false;
                estructuraRetirada.removeAttribute('disabled');
                estructuraRetirada.removeAttribute('readonly');
                
                // Marcar como protegido
                estructuraRetirada.setAttribute('data-protected', 'true');
                estructuraRetirada.setAttribute('data-desmantelado-active', 'true');
                
                // Solo agregar clase de highlight, no modificar otras
                if (!estructuraRetirada.classList.contains('desmantelado-highlight')) {
                    estructuraRetirada.classList.add('desmantelado-highlight');
                    console.log('✅ Clase desmantelado-highlight agregada');
                }
                
                // Focus sin modificar estilos
                setTimeout(() => {
                    estructuraRetirada.focus();
                    estructuraRetirada.select();
                }, 100);
                
                console.log('✅ Estructura retirada habilitada (SIN modificar estilos)');
            }
            
            // Monitor simplificado
            startProtectionMonitor();
            mostrarMensajeDesmantelado(true);
            
        } else {
            // Desactivar desmantelado
            stopProtectionMonitor();
            
            // Restaurar estados
            deshabilitarInformacionTecnica(false);
            deshabilitarSeccionUC(false);
            
            // Restaurar estructura retirada
            const estructuraRetirada = document.getElementById("estructura_retirada_campo");
            if (estructuraRetirada) {
                console.log('🔄 RESTAURANDO estructura_retirada_campo');
                
                // Restaurar clases originales
                const originalClass = estructuraRetirada.getAttribute('data-original-class');
                if (originalClass) {
                    estructuraRetirada.className = originalClass;
                    console.log('🔙 Clases originales restauradas:', originalClass);
                }
                
                // Remover atributos de protección
                estructuraRetirada.removeAttribute('data-protected');
                estructuraRetirada.removeAttribute('data-desmantelado-active');
                estructuraRetirada.removeAttribute('data-original-class');
                estructuraRetirada.classList.remove('desmantelado-highlight');
                
                // Verificar si debe estar deshabilitada según tipo de inversión
                const tipoInversion = document.getElementById("t_inv").value;
                if (tipoInversion !== "I" && tipoInversion !== "III") {
                    estructuraRetirada.disabled = true;
                    console.log('🔒 Campo deshabilitado para tipo:', tipoInversion);
                }
                
                console.log('✅ Estructura retirada restaurada completamente');
            }
            
            mostrarMensajeDesmantelado(false);
        }
    }

    /**
     * Monitor de protección simplificado
     */
    function startProtectionMonitor() {
        if (protectionMonitor) return;
        
        console.log('🛡️ INICIANDO monitor de protección simplificado');
        
        protectionMonitor = setInterval(() => {
            const campo = document.getElementById("estructura_retirada_campo");
            if (campo && desmanteladoActivo) {
                // Solo verificar estado, NO estilos
                if (campo.disabled) {
                    campo.disabled = false;
                    console.log('🛡️ Protección: Re-habilitando campo');
                }
                if (campo.readOnly) {
                    campo.readOnly = false;
                    console.log('🛡️ Protección: Removiendo readOnly');
                }
                
                // Asegurar que tenga la clase highlight
                if (!campo.classList.contains('desmantelado-highlight')) {
                    campo.classList.add('desmantelado-highlight');
                    console.log('🛡️ Protección: Re-agregando clase highlight');
                }
            }
        }, 100);
    }

    function stopProtectionMonitor() {
        if (protectionMonitor) {
            clearInterval(protectionMonitor);
            protectionMonitor = null;
            console.log('🛡️ Monitor de protección detenido');
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
     * Inicialización
     */
    function init() {
        console.log('🚀 Inicializando gestión de tipos de inversión v4.0 SIMPLIFICADA');
        
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
    }
    
    // Exponer funciones globalmente
    window.handleTipoInversion = handleTipoInversion;
    window.toggleMontajeIntegral = toggleMontajeIntegral;
    window.toggleDesmantelado = toggleDesmantelado;
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
