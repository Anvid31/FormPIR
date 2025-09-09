/**
 * SISTEMA CORREGIDO DE TIPOS DE INVERSIÓN
 * Versión 8.0 - Solución para problemas de validaciones y checkboxes
 * 
 * CORRECCIONES IMPLEMENTADAS:
 * - Tipos I y III habilitan estructura_retirada y deshabilitan coordenadas
 * - En conductores: deshabilita coordenadas iniciales y finales para tipos I y III
 * - Checkboxes de montaje y desmantelado revierten correctamente su función
 */

class SistemaTiposInversionCorregido {
    constructor() {
        this.seccionActual = this.detectarSeccion();
        this.estadoCheckboxes = {
            montajeIntegral: false,
            desmantelado: false
        };
        this.inicializar();
    }

    detectarSeccion() {
        const path = window.location.pathname;
        if (path.includes('estructuras')) return 'estructuras';
        if (path.includes('conductores')) return 'conductores';
        if (path.includes('equipos')) return 'equipos';
        if (path.includes('transformador')) return 'transformador';
        return null;
    }

    inicializar() {
        
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.configurarSistema();
            });
        } else {
            this.configurarSistema();
        }
    }

    configurarSistema() {
        this.configurarTiposInversion();
        this.configurarCheckboxes();
        this.aplicarEstilosCSS();
    }

    configurarTiposInversion() {
        const selectTipoInversion = this.buscarElemento(['t_inv', 'tipo_inversion']);
        if (!selectTipoInversion) {
            console.warn('⚠️ No se encontró el select de tipo de inversión');
            return;
        }


        // Aplicar estado inicial
        this.aplicarReglasInversion(selectTipoInversion.value);

        // Remover listeners anteriores clonando el elemento
        const nuevoSelect = selectTipoInversion.cloneNode(true);
        selectTipoInversion.parentNode.replaceChild(nuevoSelect, selectTipoInversion);

        // Listener para cambios
        nuevoSelect.addEventListener('change', (e) => {
            this.aplicarReglasInversion(e.target.value);
        });
    }

    aplicarReglasInversion(tipoInversion) {
        const estipoIoIII = ['I', 'III'].includes(tipoInversion);
        
        if (this.seccionActual === 'conductores') {
            // En conductores: deshabilitar coordenadas iniciales y finales para I y III
            const camposCoordenadas = [
                'latitud_inicial', 'longitud_inicial', 'latitud_final', 'longitud_final'
            ];
            this.toggleCampos(camposCoordenadas, !estipoIoIII, 'tipo-inversion');
            
        } else {
            // En otras secciones: deshabilitar coordenadas, habilitar estructura_retirada
            const camposCoordenadas = [
                'latitud_inicial', 'longitud_inicial', 'latitud_final', 'longitud_final'
            ];
            this.toggleCampos(camposCoordenadas, !estipoIoIII, 'tipo-inversion');
            
            // Habilitar estructura_retirada para tipos I y III
            const camposEstructura = ['estructura_retirada', 'estructura_retirada_campo'];
            this.toggleCampos(camposEstructura, estipoIoIII, 'tipo-inversion');
        }

        // Actualizar indicador solo en modo debug
        if (window.location.search.includes('debug=true')) {
            this.actualizarIndicadorTipoInversion(tipoInversion);
        }
    }

    configurarCheckboxes() {
        this.configurarMontajeIntegral();
        this.configurarDesmantelado();
    }

    configurarMontajeIntegral() {
        const checkbox = this.buscarElemento(['montaje_integral', 'montaje_integral_checkbox']);
        if (!checkbox) {
            console.warn('⚠️ No se encontró checkbox de montaje integral');
            return;
        }


        // Remover listeners antiguos clonando
        const nuevoCheckbox = checkbox.cloneNode(true);
        checkbox.parentNode.replaceChild(nuevoCheckbox, checkbox);
        
        // Aplicar estado inicial
        this.estadoCheckboxes.montajeIntegral = nuevoCheckbox.checked;
        this.manejarMontajeIntegral(nuevoCheckbox.checked);

        // Nuevo listener
        nuevoCheckbox.addEventListener('change', (e) => {
            this.estadoCheckboxes.montajeIntegral = e.target.checked;
            this.manejarMontajeIntegral(e.target.checked);
        });
    }

    configurarDesmantelado() {
        const checkbox = this.buscarElemento(['desmantelado', 'desmantelado_checkbox']);
        if (!checkbox) {
            console.warn('⚠️ No se encontró checkbox de desmantelado');
            return;
        }


        // Remover listeners antiguos clonando
        const nuevoCheckbox = checkbox.cloneNode(true);
        checkbox.parentNode.replaceChild(nuevoCheckbox, checkbox);
        
        // Aplicar estado inicial
        this.estadoCheckboxes.desmantelado = nuevoCheckbox.checked;
        this.manejarDesmantelado(nuevoCheckbox.checked);

        // Nuevo listener
        nuevoCheckbox.addEventListener('change', (e) => {
            this.estadoCheckboxes.desmantelado = e.target.checked;
            this.manejarDesmantelado(e.target.checked);
        });
    }

    manejarMontajeIntegral(activo) {
        const camposAfectados = this.getCamposMontajeIntegral();
        
        if (activo) {
            this.toggleCampos(camposAfectados, false, 'montaje-integral');
            this.limpiarCampos(camposAfectados);
            if (window.location.search.includes('debug=true')) {
                this.mostrarIndicador('montaje', '🏗️ Montaje Integral Activo', '#10B981');
            }
        } else {
            this.toggleCampos(camposAfectados, true, 'montaje-integral');
            this.ocultarIndicador('montaje');
        }
    }

    manejarDesmantelado(activo) {
        const camposAfectados = this.getCamposDesmantelado();
        
        if (activo) {
            // Deshabilitar todos los campos excepto estructura_retirada
            camposAfectados.forEach(campoId => {
                if (campoId !== 'estructura_retirada' && campoId !== 'estructura_retirada_campo') {
                    this.toggleCampos([campoId], false, 'desmantelado');
                    this.limpiarCampos([campoId]);
                }
            });
            
            // Asegurar que estructura_retirada esté habilitado y requerido
            const estructuraFields = ['estructura_retirada', 'estructura_retirada_campo'];
            estructuraFields.forEach(fieldId => {
                const campo = this.buscarElemento([fieldId]);
                if (campo) {
                    campo.disabled = false;
                    campo.required = true;
                    campo.classList.remove('campo-deshabilitado-desmantelado');
                }
            });
            
            if (window.location.search.includes('debug=true')) {
                this.mostrarIndicador('desmantelado', '🔧 Desmantelado Activo', '#EF4444');
            }
        } else {
            // Revertir: habilitar todos los campos
            this.toggleCampos(camposAfectados, true, 'desmantelado');
            
            // estructura_retirada ya no es requerido
            const estructuraFields = ['estructura_retirada', 'estructura_retirada_campo'];
            estructuraFields.forEach(fieldId => {
                const campo = this.buscarElemento([fieldId]);
                if (campo) {
                    campo.required = false;
                }
            });
            
            this.ocultarIndicador('desmantelado');
        }
    }

    getCamposMontajeIntegral() {
        // Campos afectados por Montaje Integral según la sección
        const camposBase = ['altura', 'resistencia_mecanica', 'retenidas', 'comentarios_estructura'];
        
        switch (this.seccionActual) {
            case 'estructuras':
                return [...camposBase, 'estructura_anterior_id', 'estructura'];
            case 'conductores':
                return ['calibre', 'material', 'longitud_red', 'regulado'];
            case 'equipos':
                return ['tipo_equipo', 'capacidad', 'conexion'];
            case 'transformador':
                return ['capacidad_transformador', 'tipo_transformador', 'nivel_tension'];
            default:
                return camposBase;
        }
    }

    getCamposDesmantelado() {
        // Campos afectados por Desmantelado (todos menos estructura_retirada)
        const todosCampos = [
            'altura', 'resistencia_mecanica', 'retenidas', 'comentarios_estructura',
            'latitud_inicial', 'longitud_inicial', 'latitud_final', 'longitud_final',
            'direccion', 'cantidad', 'municipio', 'departamento', 'regional'
        ];

        switch (this.seccionActual) {
            case 'estructuras':
                return [...todosCampos, 'estructura_anterior_id', 'estructura'];
            case 'conductores':
                return [...todosCampos, 'calibre', 'material', 'longitud_red', 'regulado'];
            case 'equipos':
                return [...todosCampos, 'tipo_equipo', 'capacidad', 'conexion'];
            case 'transformador':
                return [...todosCampos, 'capacidad_transformador', 'tipo_transformador'];
            default:
                return todosCampos;
        }
    }

    buscarElemento(ids) {
        for (const id of ids) {
            const elemento = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
            if (elemento) return elemento;
        }
        return null;
    }

    toggleCampos(campos, habilitar, contexto) {
        campos.forEach(campoId => {
            const campo = this.buscarElemento([campoId]);
            if (campo) {
                campo.disabled = !habilitar;
                
                // Remover todas las clases de contexto
                campo.classList.remove(
                    'campo-deshabilitado-tipo-inversion',
                    'campo-deshabilitado-montaje-integral', 
                    'campo-deshabilitado-desmantelado'
                );
                
                if (!habilitar) {
                    campo.classList.add(`campo-deshabilitado-${contexto}`);
                }
                
            }
        });
    }

    limpiarCampos(campos) {
        campos.forEach(campoId => {
            const campo = this.buscarElemento([campoId]);
            if (campo) {
                if (campo.type === 'checkbox' || campo.type === 'radio') {
                    campo.checked = false;
                } else {
                    campo.value = '';
                }
            }
        });
    }

    mostrarIndicador(tipo, texto, color) {
        this.ocultarIndicador(tipo); // Remover indicador anterior
        
        const indicador = document.createElement('div');
        indicador.className = `indicador-${tipo}`;
        indicador.textContent = texto;
        indicador.style.cssText = `
            position: fixed;
            top: ${tipo === 'montaje' ? '70px' : '110px'};
            right: 20px;
            background: ${color};
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(indicador);
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            if (indicador.parentNode) {
                indicador.remove();
            }
        }, 5000);
    }

    ocultarIndicador(tipo) {
        const indicador = document.querySelector(`.indicador-${tipo}`);
        if (indicador) {
            indicador.remove();
        }
    }

    actualizarIndicadorTipoInversion(tipoInversion) {
        const indicador = document.querySelector('.indicador-tipo-inversion') || this.crearIndicadorTipoInversion();
        indicador.textContent = `Tipo de Inversión: ${tipoInversion}`;
        indicador.className = `indicador-tipo-inversion tipo-${tipoInversion}`;
    }

    crearIndicadorTipoInversion() {
        const indicador = document.createElement('div');
        indicador.className = 'indicador-tipo-inversion';
        indicador.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #3B82F6;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(indicador);
        return indicador;
    }

    aplicarEstilosCSS() {
        if (document.getElementById('estilos-tipos-inversion-corregido')) return;
        
        const estilos = document.createElement('style');
        estilos.id = 'estilos-tipos-inversion-corregido';
        estilos.textContent = `
            /* Estilos para campos deshabilitados por contexto */
            .campo-deshabilitado-tipo-inversion,
            .campo-deshabilitado-montaje-integral,
            .campo-deshabilitado-desmantelado {
                background-color: #f3f4f6 !important;
                cursor: not-allowed !important;
                opacity: 0.6;
                border-color: #d1d5db !important;
            }

            .campo-deshabilitado-montaje-integral {
                background-color: #ecfdf5 !important;
                border-color: #10b981 !important;
            }

            .campo-deshabilitado-desmantelado {
                background-color: #fef2f2 !important;
                border-color: #ef4444 !important;
            }

            /* Indicadores de tipo de inversión */
            .indicador-tipo-inversion.tipo-I {
                background: #10B981 !important;
            }

            .indicador-tipo-inversion.tipo-II {
                background: #3B82F6 !important;
            }

            .indicador-tipo-inversion.tipo-III {
                background: #F59E0B !important;
            }

            .indicador-tipo-inversion.tipo-IV {
                background: #8B5CF6 !important;
            }

            /* Animación para indicadores */
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        document.head.appendChild(estilos);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Limpiar instancias anteriores
    if (window.sistemaTiposInversionCorregido) {
        window.sistemaTiposInversionCorregido = null;
    }
    
    // Crear nueva instancia corregida
    setTimeout(() => {
        window.sistemaTiposInversionCorregido = new SistemaTiposInversionCorregido();
    }, 1000); // Esperar 1 segundo para que otros sistemas se carguen
});

// Hacer disponible globalmente
window.SistemaTiposInversionCorregido = SistemaTiposInversionCorregido;
