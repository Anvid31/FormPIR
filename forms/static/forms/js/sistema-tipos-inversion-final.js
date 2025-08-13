/**
 * SISTEMA DEFINITIVO DE TIPOS DE INVERSIÓN
 * Versión 7.0 - Consolidado y sin duplicaciones
 * 
 * ESTE ES EL ÚNICO ARCHIVO QUE DEBE MANEJAR:
 * - Tipos de inversión (I, II, III, IV)
 * - Montaje Integral
 * - Desmantelado
 * - Estructura Retirada
 */

(function() {
    'use strict';
    
    // Singleton para evitar múltiples instancias
    if (window.SistemaTiposInversion) {
        console.warn('⚠️ Sistema de Tipos de Inversión ya inicializado');
        return;
    }
    
    class SistemaTiposInversion {
        constructor() {
            // Estado centralizado único
            this.estado = {
                tipoInversionActual: '',
                montajeIntegralActivo: false,
                desmanteladoActivo: false,
                montajeEstadoPrevio: false,
                seccionActual: this.detectarSeccion(),
                camposOriginales: new Map(),
                monitorActivo: null
            };
            
            // Configuración de campos
            this.config = {
                camposCompartidos: [
                    'nombre', 'banco_proyecto', 'banco', 'contrato',
                    'municipio', 'departamento', 'regional', 'direccion',
                    'circuito', 'formato_preoperacional', 'plano_perfil',
                    'sap_documento', 'archivo_cad', 'archivo_kmz', 'fotos',
                    't_inv', 'desmantelado_checkbox', 'estructura_retirada_campo'
                ],
                elementos: {
                    tipoInversion: 't_inv',
                    estructuraRetirada: 'estructura_retirada_campo',
                    montajeCheckbox: 'montaje_integral_checkbox',
                    desmanteladoCheckbox: 'desmantelado_checkbox',
                    montajeContainer: 'montaje_integral_container',
                    desmanteladoContainer: 'desmantelado_container',
                    desmanteladoMensaje: 'desmantelado-mensaje'
                }
            };
            
            this.init();
        }
        
        detectarSeccion() {
            const url = window.location.pathname;
            if (url.includes('conductores')) return 'conductores';
            if (url.includes('equipos')) return 'equipos';
            if (url.includes('transformadores')) return 'transformadores';
            return 'estructuras';
        }
        
        init() {
            console.log('🚀 Inicializando Sistema Unificado de Tipos de Inversión v7.0');
            console.log(`📍 Sección detectada: ${this.estado.seccionActual}`);
            
            // Esperar a que el DOM esté completamente cargado
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.configurarSistema());
            } else {
                this.configurarSistema();
            }
        }
        
        configurarSistema() {
            // Limpiar event listeners previos
            this.limpiarEventListeners();
            
            // Configurar nuevos listeners
            this.configurarEventListeners();
            
            // Estado inicial
            this.handleTipoInversion();
            
            console.log('✅ Sistema inicializado correctamente');
        }
        
        limpiarEventListeners() {
            // Remover TODOS los listeners previos para evitar duplicaciones
            const elementos = [
                this.config.elementos.tipoInversion,
                this.config.elementos.montajeCheckbox,
                this.config.elementos.desmanteladoCheckbox
            ];
            
            elementos.forEach(id => {
                const elemento = document.getElementById(id);
                if (elemento) {
                    const nuevoElemento = elemento.cloneNode(true);
                    elemento.parentNode.replaceChild(nuevoElemento, elemento);
                }
            });
        }
        
        configurarEventListeners() {
            const tipoInv = document.getElementById(this.config.elementos.tipoInversion);
            const montajeCheck = document.getElementById(this.config.elementos.montajeCheckbox);
            const desmanteladoCheck = document.getElementById(this.config.elementos.desmanteladoCheckbox);
            
            if (tipoInv) {
                tipoInv.addEventListener('change', () => this.handleTipoInversion());
                console.log('✅ Event listener para tipo de inversión configurado');
            }
            
            if (montajeCheck) {
                montajeCheck.addEventListener('change', () => this.toggleMontajeIntegral());
                console.log('✅ Event listener para montaje integral configurado');
            }
            
            if (desmanteladoCheck) {
                desmanteladoCheck.addEventListener('change', () => this.toggleDesmantelado());
                console.log('✅ Event listener para desmantelado configurado');
            }
        }
        
        handleTipoInversion() {
            const tipoInv = document.getElementById(this.config.elementos.tipoInversion);
            if (!tipoInv) return;
            
            const valor = tipoInv.value;
            this.estado.tipoInversionActual = valor;
            
            console.log(`📋 Tipo de inversión seleccionado: ${valor} (Sección: ${this.estado.seccionActual})`);
            
            // Reset checkboxes si cambia el tipo
            this.resetearCheckboxes();
            
            // Configurar según tipo
            this.configurarEstructuraRetirada(valor);
            this.configurarMontajeIntegral(valor);
            this.configurarDesmantelado(valor);
        }
        
        configurarEstructuraRetirada(tipo) {
            const campo = document.getElementById(this.config.elementos.estructuraRetirada);
            if (!campo) return;
            
            const habilitado = (tipo === 'I' || tipo === 'III');
            
            campo.disabled = !habilitado;
            campo.required = habilitado;
            
            if (habilitado) {
                campo.classList.remove('bg-gray-100', 'cursor-not-allowed', 'opacity-50');
                campo.classList.add('bg-white');
                console.log('✅ Estructura retirada HABILITADA');
            } else {
                campo.value = '';
                campo.classList.add('bg-gray-100', 'cursor-not-allowed', 'opacity-50');
                campo.classList.remove('bg-white');
                console.log('❌ Estructura retirada DESHABILITADA para tipo ' + tipo);
            }
        }
        
        configurarMontajeIntegral(tipo) {
            const container = document.getElementById(this.config.elementos.montajeContainer);
            if (!container) return;
            
            const mostrar = (tipo === 'II' || tipo === 'IV');
            container.style.display = mostrar ? 'flex' : 'none';
            
            if (!mostrar && this.estado.montajeIntegralActivo) {
                const checkbox = document.getElementById(this.config.elementos.montajeCheckbox);
                if (checkbox) {
                    checkbox.checked = false;
                    this.estado.montajeIntegralActivo = false;
                    this.toggleMontajeIntegral();
                }
            }
            
            console.log(`🔧 Montaje Integral: ${mostrar ? 'VISIBLE' : 'OCULTO'} para tipo ${tipo}`);
        }
        
        configurarDesmantelado(tipo) {
            const container = document.getElementById(this.config.elementos.desmanteladoContainer);
            if (!container) return;
            
            const mostrar = (tipo === 'I' || tipo === 'III');
            container.style.display = mostrar ? 'flex' : 'none';
            
            if (!mostrar && this.estado.desmanteladoActivo) {
                const checkbox = document.getElementById(this.config.elementos.desmanteladoCheckbox);
                if (checkbox) {
                    checkbox.checked = false;
                    this.estado.desmanteladoActivo = false;
                    this.toggleDesmantelado();
                }
            }
            
            console.log(`🚨 Desmantelado: ${mostrar ? 'VISIBLE' : 'OCULTO'} para tipo ${tipo}`);
        }
        
        toggleMontajeIntegral() {
            const checkbox = document.getElementById(this.config.elementos.montajeCheckbox);
            this.estado.montajeIntegralActivo = checkbox?.checked || false;
            
            console.log(`🔧 Montaje Integral: ${this.estado.montajeIntegralActivo ? 'ACTIVADO' : 'DESACTIVADO'}`);
            
            // Verificar si está bloqueado por desmantelado
            if (this.estado.desmanteladoActivo) {
                console.warn('⚠️ Montaje Integral bloqueado - Desmantelado activo');
                if (checkbox) {
                    checkbox.checked = this.estado.montajeEstadoPrevio;
                    this.estado.montajeIntegralActivo = this.estado.montajeEstadoPrevio;
                }
                return;
            }
            
            // Solo deshabilitar selector UC si está activo
            if (this.estado.montajeIntegralActivo) {
                this.deshabilitarSelectorUC();
                this.deshabilitarCoordenadas();
            } else {
                this.habilitarSelectorUC();
                this.habilitarCoordenadas();
            }
        }
        
        toggleDesmantelado() {
            const checkbox = document.getElementById(this.config.elementos.desmanteladoCheckbox);
            this.estado.desmanteladoActivo = checkbox?.checked || false;
            
            console.log(`🚨 Desmantelado: ${this.estado.desmanteladoActivo ? 'ACTIVADO' : 'DESACTIVADO'}`);
            
            if (this.estado.desmanteladoActivo) {
                this.activarDesmantelado();
            } else {
                this.desactivarDesmantelado();
            }
        }
        
        activarDesmantelado() {
            console.log('🚨 DESMANTELADO ACTIVADO - Iniciando deshabilitación por secciones');
            
            // Guardar estado de montaje
            const montajeCheck = document.getElementById(this.config.elementos.montajeCheckbox);
            this.estado.montajeEstadoPrevio = montajeCheck?.checked || false;
            
            // Guardar estados originales de todos los campos
            this.guardarEstadosOriginales();
            
            // Aplicar restricciones de desmantelado
            this.aplicarRestriccionesDesmantelado();
            
            // Mostrar mensaje de estado
            this.mostrarMensajeDesmantelado(true);
            
            // Iniciar monitor de protección
            this.iniciarMonitorProteccion();
            
            console.log('🚨 Desmantelado COMPLETADO - Solo campos esenciales habilitados');
        }
        
        desactivarDesmantelado() {
            console.log('✅ DESMANTELADO DESACTIVADO - Restaurando formulario');
            
            // Detener monitor
            this.detenerMonitorProteccion();
            
            // Restaurar estados originales
            this.restaurarEstadosOriginales();
            
            // Ocultar mensaje
            this.mostrarMensajeDesmantelado(false);
            
            // Reaplicar configuración actual del tipo de inversión
            this.handleTipoInversion();
            
            console.log('✅ Formulario completamente restaurado');
        }
        
        guardarEstadosOriginales() {
            // Solo guardar si no hay estados ya guardados
            if (this.estado.camposOriginales.size > 0) return;
            
            document.querySelectorAll('input, select, textarea, button').forEach(campo => {
                if (campo.id) {
                    this.estado.camposOriginales.set(campo.id, {
                        disabled: campo.disabled,
                        className: campo.className,
                        value: campo.value,
                        required: campo.required
                    });
                }
            });
        }
        
        restaurarEstadosOriginales() {
            this.estado.camposOriginales.forEach((estado, id) => {
                const campo = document.getElementById(id);
                if (campo) {
                    campo.disabled = estado.disabled;
                    campo.className = estado.className;
                    campo.required = estado.required;
                    // No restaurar valores, solo estados
                }
            });
            
            // Limpiar estados guardados
            this.estado.camposOriginales.clear();
        }
        
        aplicarRestriccionesDesmantelado() {
            // Deshabilitar todos los campos excepto los permitidos
            document.querySelectorAll('input, select, textarea, button').forEach(campo => {
                const esPermitido = this.esCampoPermitidoEnDesmantelado(campo);
                
                if (!esPermitido && campo.type !== 'hidden') {
                    campo.disabled = true;
                    campo.classList.add('bg-gray-100', 'opacity-50', 'cursor-not-allowed');
                }
            });
            
            // Asegurar que estructura retirada esté habilitada y destacada
            this.protegerEstructuraRetirada();
        }
        
        esCampoPermitidoEnDesmantelado(campo) {
            // Campos siempre permitidos
            const camposPermitidos = [
                'nombre', 'banco_proyecto', 'banco', 'contrato',
                'municipio', 'departamento', 'regional', 'direccion',
                'circuito', 'formato_preoperacional', 'plano_perfil',
                'sap_documento', 'archivo_cad', 'archivo_kmz', 'fotos',
                't_inv', 'desmantelado_checkbox', 'estructura_retirada_campo'
            ];
            
            return camposPermitidos.includes(campo.id) ||
                   camposPermitidos.includes(campo.name) ||
                   campo.type === 'hidden' ||
                   campo.type === 'submit';
        }
        
        protegerEstructuraRetirada() {
            const estructuraRetirada = document.getElementById(this.config.elementos.estructuraRetirada);
            if (estructuraRetirada) {
                // Asegurar que esté habilitado
                estructuraRetirada.disabled = false;
                estructuraRetirada.required = true;
                
                // Aplicar estilos de destacado
                estructuraRetirada.classList.remove('bg-gray-100', 'opacity-50', 'cursor-not-allowed');
                estructuraRetirada.classList.add(
                    'bg-yellow-50', 'border-yellow-300', 'ring-2', 'ring-yellow-400',
                    'font-semibold', 'text-yellow-900'
                );
                
                // Agregar atributo para el monitor
                estructuraRetirada.setAttribute('data-protected', 'true');
                
                console.log('🛡️ Estructura retirada protegida y destacada');
            }
        }
        
        iniciarMonitorProteccion() {
            if (this.estado.monitorActivo) return;
            
            this.estado.monitorActivo = setInterval(() => {
                if (this.estado.desmanteladoActivo) {
                    this.protegerEstructuraRetirada();
                    
                    // Proteger checkbox de desmantelado
                    const desmanteladoCheck = document.getElementById(this.config.elementos.desmanteladoCheckbox);
                    if (desmanteladoCheck && desmanteladoCheck.disabled) {
                        desmanteladoCheck.disabled = false;
                    }
                }
            }, 1000);
        }
        
        detenerMonitorProteccion() {
            if (this.estado.monitorActivo) {
                clearInterval(this.estado.monitorActivo);
                this.estado.monitorActivo = null;
            }
        }
        
        mostrarMensajeDesmantelado(mostrar) {
            const mensaje = document.getElementById(this.config.elementos.desmanteladoMensaje);
            if (mensaje) {
                mensaje.classList.toggle('hidden', !mostrar);
                mensaje.classList.toggle('block', mostrar);
            }
        }
        
        deshabilitarSelectorUC() {
            const selectores = [
                '#uc-selector-container', '.uc-card', '[data-nivel]',
                '#uc-conductor-selector', '#uc-equipo-selector',
                '#uc-transformador-selector', '.uc-selector'
            ];
            
            selectores.forEach(selector => {
                document.querySelectorAll(selector).forEach(elemento => {
                    elemento.classList.add('opacity-50', 'pointer-events-none', 'bg-gray-100');
                    elemento.setAttribute('data-disabled-by-montaje', 'true');
                });
            });
            
            console.log('🔒 Selector UC deshabilitado por Montaje Integral');
        }
        
        habilitarSelectorUC() {
            const selectores = [
                '#uc-selector-container', '.uc-card', '[data-nivel]',
                '#uc-conductor-selector', '#uc-equipo-selector',
                '#uc-transformador-selector', '.uc-selector'
            ];
            
            selectores.forEach(selector => {
                document.querySelectorAll(selector).forEach(elemento => {
                    if (elemento.getAttribute('data-disabled-by-montaje')) {
                        elemento.classList.remove('opacity-50', 'pointer-events-none', 'bg-gray-100');
                        elemento.removeAttribute('data-disabled-by-montaje');
                    }
                });
            });
            
            console.log('🔓 Selector UC habilitado');
        }
        
        deshabilitarCoordenadas() {
            const campos = ['longitud', 'latitud'];
            campos.forEach(id => {
                const campo = document.getElementById(id);
                if (campo) {
                    campo.disabled = true;
                    campo.classList.add('bg-gray-100', 'opacity-50');
                    campo.setAttribute('data-disabled-by-montaje', 'true');
                }
            });
        }
        
        habilitarCoordenadas() {
            const campos = ['longitud', 'latitud'];
            campos.forEach(id => {
                const campo = document.getElementById(id);
                if (campo && campo.getAttribute('data-disabled-by-montaje')) {
                    campo.disabled = false;
                    campo.classList.remove('bg-gray-100', 'opacity-50');
                    campo.removeAttribute('data-disabled-by-montaje');
                }
            });
        }
        
        resetearCheckboxes() {
            // Solo resetear si el tipo cambió realmente
            const montajeCheck = document.getElementById(this.config.elementos.montajeCheckbox);
            const desmanteladoCheck = document.getElementById(this.config.elementos.desmanteladoCheckbox);
            
            // Resetear montaje si estaba activo y ya no es aplicable
            if (montajeCheck?.checked && this.estado.montajeIntegralActivo) {
                const tipoActual = this.estado.tipoInversionActual;
                if (tipoActual !== 'II' && tipoActual !== 'IV') {
                    montajeCheck.checked = false;
                    this.estado.montajeIntegralActivo = false;
                    this.toggleMontajeIntegral();
                }
            }
            
            // Resetear desmantelado si estaba activo y ya no es aplicable
            if (desmanteladoCheck?.checked && this.estado.desmanteladoActivo) {
                const tipoActual = this.estado.tipoInversionActual;
                if (tipoActual !== 'I' && tipoActual !== 'III') {
                    desmanteladoCheck.checked = false;
                    this.estado.desmanteladoActivo = false;
                    this.toggleDesmantelado();
                }
            }
        }
        
        // Método de debug público
        debug() {
            console.group('🔍 Debug Sistema Tipos de Inversión v7.0');
            console.log('Estado Global:', this.estado);
            console.log('Configuración:', this.config);
            
            const tipoInv = document.getElementById(this.config.elementos.tipoInversion);
            const montajeCheck = document.getElementById(this.config.elementos.montajeCheckbox);
            const desmanteladoCheck = document.getElementById(this.config.elementos.desmanteladoCheckbox);
            
            console.log('Elementos DOM:', {
                tipoInversion: tipoInv?.value || 'no encontrado',
                montajeIntegral: montajeCheck?.checked || false,
                desmantelado: desmanteladoCheck?.checked || false
            });
            
            console.groupEnd();
            return {
                estado: this.estado,
                elementos: {
                    tipoInversion: tipoInv?.value,
                    montajeIntegral: montajeCheck?.checked,
                    desmantelado: desmanteladoCheck?.checked
                }
            };
        }
    }
    
    // Crear instancia única global
    window.SistemaTiposInversion = new SistemaTiposInversion();
    
    // Exponer funciones para compatibilidad con código existente
    window.handleTipoInversion = () => window.SistemaTiposInversion.handleTipoInversion();
    window.toggleMontajeIntegral = () => window.SistemaTiposInversion.toggleMontajeIntegral();
    window.toggleDesmantelado = () => window.SistemaTiposInversion.toggleDesmantelado();
    window.debugTiposInversion = () => window.SistemaTiposInversion.debug();
    
    console.log('✅ Sistema de Tipos de Inversión v7.0 cargado y listo');
    
})();
