/**
 * Gestión de Tipos de Inversión - Montaje Integral y Desmantelado
 * Version 3.0 - Implementación limpia con requerimientos confirmados
 */

(function() {
    'use strict';
    
    // Variables globales para el estado
    let montajeIntegralActivo = false;
    let desmanteladoActivo = false;
    let monitorInterval = null; // Para monitoreo continuo
    
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
     * Toggle Montaje Integral
     * Deshabilita: UC + estructura retirada
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
     * Toggle Desmantelado - Versión mejorada con protección absoluta
     * Deshabilita: Información Técnica (excepto estructura retirada) + UC
     * Mantiene habilitados: Información del Proyecto + Documentos + estructura retirada + botón iteración
     */
    function toggleDesmantelado() {
        const checkbox = document.getElementById("desmantelado_checkbox");
        desmanteladoActivo = checkbox ? checkbox.checked : false;
        
        console.log(`🚨 Desmantelado: ${desmanteladoActivo ? 'ACTIVADO' : 'DESACTIVADO'}`);
        
        if (desmanteladoActivo) {
            // Primero deshabilitar todo lo demás
            deshabilitarInformacionTecnica(true);
            deshabilitarSeccionUC(true);
            
            // FORZAR estructura retirada habilitada con máxima prioridad
            const estructuraRetirada = document.getElementById("estructura_retirada_campo");
            if (estructuraRetirada) {
                console.log("� PROTECCIÓN ABSOLUTA - Clonando elemento para eliminar listeners externos");
                
                // Remover TODOS los event listeners que puedan interferir
                const nuevoElemento = estructuraRetirada.cloneNode(true);
                estructuraRetirada.parentNode.replaceChild(nuevoElemento, estructuraRetirada);
                
                // Obtener referencia al nuevo elemento
                const estructuraRetiradaNueva = document.getElementById("estructura_retirada_campo");
                
                // Configurar el campo con máxima prioridad
                estructuraRetiradaNueva.disabled = false;
                estructuraRetiradaNueva.readOnly = false;
                estructuraRetiradaNueva.removeAttribute('disabled');
                estructuraRetiradaNueva.removeAttribute('readonly');
                
                // Limpiar TODAS las clases y aplicar solo las necesarias
                estructuraRetiradaNueva.className = 'form-input';
                estructuraRetiradaNueva.classList.add('bg-yellow-50', 'border-yellow-300', 'font-medium');
                
                // Aplicar estilos inline sin modificar dimensiones
                estructuraRetiradaNueva.style.cssText = `
                    background-color: #fef3c7 !important;
                    border-color: #f59e0b !important;
                    color: #000 !important;
                    opacity: 1 !important;
                    cursor: text !important;
                    pointer-events: auto !important;
                    -webkit-user-select: text !important;
                    user-select: text !important;
                    font-weight: 500 !important;
                    box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.2) !important;
                `;
                
                // Agregar atributo de protección
                estructuraRetiradaNueva.setAttribute('data-protected', 'true');
                estructuraRetiradaNueva.setAttribute('data-desmantelado-active', 'true');
                
                // Focus con delay
                setTimeout(() => {
                    estructuraRetiradaNueva.focus();
                    estructuraRetiradaNueva.select();
                }, 100);
                
                console.log("✅ ELEMENTO CLONADO Y PROTEGIDO - Estado:", {
                    disabled: estructuraRetiradaNueva.disabled,
                    readonly: estructuraRetiradaNueva.readOnly,
                    classes: estructuraRetiradaNueva.className
                });
            }
            
            // Monitor mejorado - más frecuente y agresivo
            if (monitorInterval) clearInterval(monitorInterval);
            monitorInterval = setInterval(() => {
                const campo = document.getElementById("estructura_retirada_campo");
                if (campo && desmanteladoActivo) {
                    // Verificar si alguien lo deshabilitó
                    if (campo.disabled || campo.hasAttribute('disabled')) {
                        console.log("🔄 MONITOR: Detectado intento de deshabilitar - corrigiendo");
                        campo.disabled = false;
                        campo.removeAttribute('disabled');
                    }
                    
                    // Verificar readonly
                    if (campo.readOnly || campo.hasAttribute('readonly')) {
                        campo.readOnly = false;
                        campo.removeAttribute('readonly');
                    }
                    
                    // Mantener estilos
                    if (!campo.classList.contains('bg-yellow-50')) {
                        campo.className = 'form-input bg-yellow-50 border-yellow-300 font-medium';
                    }
                    
                    // Mantener estilos inline sin modificar dimensiones
                    campo.style.backgroundColor = '#fef3c7';
                    campo.style.borderColor = '#f59e0b';
                    campo.style.color = '#000';
                    campo.style.opacity = '1';
                    campo.style.pointerEvents = 'auto';
                    campo.style.fontWeight = '500';
                    campo.style.boxShadow = '0 0 0 1px rgba(245, 158, 11, 0.2)';
                }
            }, 50); // Más frecuente: cada 50ms

            
            console.log("🔄 MONITOR SUPER-AGRESIVO activado (50ms) para estructura_retirada_campo");
            
        } else {
            console.log("✅ DESMANTELADO DESACTIVADO - Limpiando monitor y restaurando campo");
            
            // Desactivar monitor continuo
            if (monitorInterval) {
                clearInterval(monitorInterval);
                monitorInterval = null;
                console.log("🔄 MONITOR SUPER-AGRESIVO desactivado");
            }
            
            // Habilitar todo
            deshabilitarInformacionTecnica(false);
            deshabilitarSeccionUC(false);
            
            // Limpiar estructura retirada completamente
            const estructuraRetirada = document.getElementById("estructura_retirada_campo");
            if (estructuraRetirada) {
                estructuraRetirada.removeAttribute('data-protected');
                estructuraRetirada.removeAttribute('data-desmantelado-active');
                estructuraRetirada.style.cssText = ''; // Limpiar estilos inline
                estructuraRetirada.className = 'form-input'; // Restaurar clase base
                
                // Verificar si debe estar deshabilitada según tipo de inversión
                const tipoInversion = document.getElementById("t_inv").value;
                if (tipoInversion !== "I" && tipoInversion !== "III") {
                    estructuraRetirada.disabled = true;
                    estructuraRetirada.classList.add("bg-gray-100", "cursor-not-allowed");
                }
                
                console.log("🧹 Campo estructura retirada limpiado y restaurado");
            }
            
            // Ocultar mensaje
            mostrarMensajeDesmantelado(false);
            
            // Restaurar estado de montaje integral si estaba activo
            if (montajeIntegralActivo) {
                toggleMontajeIntegral();
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
     * Inicialización
     */
    function init() {
        console.log('🚀 Inicializando gestión de tipos de inversión v3.0 - PROTECCIÓN ABSOLUTA');
        
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
        
        // INICIALIZAR PROTECCIÓN ABSOLUTA
        setupProteccionAbsoluta();
        setupDebugEstructuraRetirada();
    }
    
    /**
     * Configurar protección absoluta para estructura_retirada_campo
     */
    function setupProteccionAbsoluta() {
        // Sobrescribir el setter de disabled para estructura_retirada_campo
        const estructuraRetirada = document.getElementById('estructura_retirada_campo');
        if (estructuraRetirada) {
            console.log("🛡️ CONFIGURANDO PROTECCIÓN ABSOLUTA para estructura_retirada_campo");
            
            // Guardar el descriptor original
            const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'disabled') ||
                                    Object.getOwnPropertyDescriptor(Element.prototype, 'disabled');
            
            Object.defineProperty(estructuraRetirada, 'disabled', {
                get: function() {
                    return this.hasAttribute('disabled');
                },
                set: function(value) {
                    // Si desmantelado está activo, NO permitir deshabilitar
                    if (this.getAttribute('data-desmantelado-active') === 'true' && value === true) {
                        console.warn('⚠️ INTERCEPTADO - Intento bloqueado de deshabilitar estructura_retirada_campo');
                        console.trace('📍 Stack trace del intento de deshabilitar:');
                        return;
                    }
                    // Para otros casos, comportamiento normal
                    if (value) {
                        this.setAttribute('disabled', '');
                    } else {
                        this.removeAttribute('disabled');
                    }
                },
                configurable: true
            });
            
            console.log("✅ Protección absoluta configurada - disabled setter interceptado");
        }
    }
    
    /**
     * Configurar debugging para estructura_retirada_campo
     */
    function setupDebugEstructuraRetirada() {
        const campo = document.getElementById('estructura_retirada_campo');
        if (!campo) return;
        
        console.log("🔍 CONFIGURANDO DEBUG para estructura_retirada_campo");
        
        // Observar cambios en el campo
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    console.log('🔍 ATRIBUTO CAMBIADO:', mutation.attributeName, 
                               'Valor anterior:', mutation.oldValue, 
                               'Valor actual:', campo.getAttribute(mutation.attributeName));
                    
                    if (mutation.attributeName === 'disabled' && campo.disabled) {
                        console.trace('❌ STACK TRACE - Alguien deshabilitó el campo:');
                    }
                    
                    if (mutation.attributeName === 'class') {
                        console.log('🎨 CLASES CAMBIADAS:', campo.className);
                    }
                }
            });
        });
        
        observer.observe(campo, {
            attributes: true,
            attributeOldValue: true
        });
        
        console.log('✅ Debug activado para estructura_retirada_campo');
        
        // Exponer función de debug globalmente
        window.debugEstructuraRetirada = function() {
            console.log('🔍 ESTADO ACTUAL estructura_retirada_campo:', {
                disabled: campo.disabled,
                readOnly: campo.readOnly,
                classes: campo.className,
                style: campo.style.cssText,
                attributes: Array.from(campo.attributes).map(attr => `${attr.name}="${attr.value}"`),
                value: campo.value
            });
        };
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
