/**
 * Sistema de Tipos de Inversión - Versión Final
 * NO MÁS DUPLICADOS, NO MÁS VERSIONES
 */

class TiposInversion {
    constructor() {
        this.config = window.APP_CONFIG.elementos;
        this.montajeIntegralActivo = false;
        this.desmanteladoActivo = false;
        this.init();
    }
    
    init() {
        const tipoInversionEl = document.getElementById(this.config.tecnica.tipoInversion);
        if (tipoInversionEl) {
            tipoInversionEl.addEventListener('change', () => this.handleTipoInversion());
            this.handleTipoInversion(); // Estado inicial
        }
    }
    
    handleTipoInversion() {
        const valor = document.getElementById(this.config.tecnica.tipoInversion)?.value;
        
        // Mostrar/ocultar checkboxes según tipo
        this.toggleCheckbox('montaje_integral_container', valor === 'II' || valor === 'IV');
        this.toggleCheckbox('desmantelado_container', valor === 'I' || valor === 'III');
        
        // Manejar estructura retirada
        this.handleEstructuraRetirada(valor);
    }
    
    toggleCheckbox(containerId, show) {
        const container = document.getElementById(containerId);
        if (container) {
            container.style.display = show ? 'flex' : 'none';
            if (!show) {
                const checkbox = container.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                    checkbox.checked = false;
                    checkbox.dispatchEvent(new Event('change'));
                }
            }
        }
    }
    
    handleEstructuraRetirada(tipoInversion) {
        const campo = document.getElementById(this.config.tecnica.estructuraRetirada);
        if (!campo) return;
        
        const requiereEstructura = tipoInversion === 'I' || tipoInversion === 'III';
        campo.disabled = !requiereEstructura;
        campo.required = requiereEstructura;
        
        if (!requiereEstructura) {
            campo.value = '';
            campo.classList.add('bg-gray-100', 'cursor-not-allowed');
        } else {
            campo.classList.remove('bg-gray-100', 'cursor-not-allowed');
        }
    }
    
    toggleMontajeIntegral() {
        const checkbox = document.getElementById(this.config.checkboxes.montajeIntegral);
        this.montajeIntegralActivo = checkbox?.checked || false;
        
        // Deshabilitar solo campos UC
        const camposUC = [
            this.config.uc.selector,
            this.config.uc.codigo,
            this.config.uc.descripcion,
            'fotos'
        ];
        
        this.toggleElements(camposUC, !this.montajeIntegralActivo);
        
        window.logger.info('Montaje Integral:', this.montajeIntegralActivo ? 'ACTIVADO' : 'DESACTIVADO');
    }
    
    toggleDesmantelado() {
        const checkbox = document.getElementById(this.config.checkboxes.desmantelado);
        this.desmanteladoActivo = checkbox?.checked || false;
        
        if (this.desmanteladoActivo) {
            // Deshabilitar todo excepto campos permitidos
            this.disableAllExcept([
                'nombre', 'banco_proyecto', 'contrato',
                this.config.tecnica.estructuraRetirada,
                this.config.checkboxes.desmantelado,
                this.config.checkboxes.montajeIntegral
            ]);
            
            // Destacar estructura retirada
            const estructuraRetirada = document.getElementById(this.config.tecnica.estructuraRetirada);
            if (estructuraRetirada) {
                estructuraRetirada.classList.add('ring-2', 'ring-yellow-400', 'bg-yellow-50');
                estructuraRetirada.focus();
            }
        } else {
            // Re-habilitar todo
            this.enableAll();
            
            // Quitar destacado
            const estructuraRetirada = document.getElementById(this.config.tecnica.estructuraRetirada);
            if (estructuraRetirada) {
                estructuraRetirada.classList.remove('ring-2', 'ring-yellow-400', 'bg-yellow-50');
            }
            
            // Reaplicar estados previos
            this.handleTipoInversion();
            if (this.montajeIntegralActivo) {
                this.toggleMontajeIntegral();
            }
        }
        
        window.logger.info('Desmantelado:', this.desmanteladoActivo ? 'ACTIVADO' : 'DESACTIVADO');
    }
    
    toggleElements(elementIds, enable) {
        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.disabled = !enable;
                if (!enable) {
                    element.classList.add('opacity-50', 'pointer-events-none');
                } else {
                    element.classList.remove('opacity-50', 'pointer-events-none');
                }
            }
        });
    }
    
    disableAllExcept(allowedIds) {
        document.querySelectorAll('input, select, textarea, button').forEach(element => {
            if (!allowedIds.includes(element.id)) {
                element.disabled = true;
                element.classList.add('opacity-50');
            }
        });
    }
    
    enableAll() {
        document.querySelectorAll('input, select, textarea, button').forEach(element => {
            element.disabled = false;
            element.classList.remove('opacity-50');
        });
    }
}

// Exponer funciones globales para compatibilidad
window.handleTipoInversion = () => window.tiposInversion?.handleTipoInversion();
window.toggleMontajeIntegral = () => window.tiposInversion?.toggleMontajeIntegral();
window.toggleDesmantelado = () => window.tiposInversion?.toggleDesmantelado();
