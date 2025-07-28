/**
 * Manager de Iteraciones - Versión Simplificada
 * Sin duplicación de código y con logging controlado
 */

class IteracionesManager {
    constructor() {
        // Usar configuración con fallbacks seguros
        this.config = window.APP_CONFIG || {
            api: {
                baseUrl: window.location.origin,
                endpoints: { iteraciones: '/iteraciones' }
            },
            elementos: {},
            secciones: {}
        };
        
        this.iteraciones = [];
        this.seccionActual = document.body?.dataset?.section || 'estructuras';
        
        // Construir URL con fallback seguro
        const baseUrl = this.config.api?.baseUrl || window.location.origin;
        const endpoint = this.config.api?.endpoints?.iteraciones || '/iteraciones';
        this.apiBase = `${baseUrl}${endpoint}`;
    }
    
    async init() {
        this.configurarEventos();
        await this.cargarIteraciones();
    }
    
    configurarEventos() {
        // Delegar eventos para mejor performance
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-agregar-iteracion')) {
                e.preventDefault();
                this.agregarIteracion();
            }
            
            if (e.target.closest('.btn-eliminar-iteracion')) {
                e.preventDefault();
                const id = e.target.closest('.btn-eliminar-iteracion').dataset.iteracionId;
                this.eliminarIteracion(id);
            }
        });
    }
    
    obtenerDatosFormulario() {
        const datos = {
            seccion: this.seccionActual,
            timestamp: new Date().toISOString()
        };
        
        // Recopilar datos usando la configuración central con validación
        if (this.config.elementos) {
            Object.entries(this.config.elementos).forEach(([categoria, campos]) => {
                if (typeof campos === 'object') {
                    Object.entries(campos).forEach(([key, id]) => {
                        const elemento = document.getElementById(id);
                        if (elemento) {
                            datos[id] = elemento.value;
                        }
                    });
                }
            });
        }
        
        // Agregar datos específicos de la sección con validación
        const seccionConfig = this.config.secciones?.[this.seccionActual];
        if (seccionConfig?.campos_especificos) {
            seccionConfig.campos_especificos.forEach(campo => {
                const elemento = document.getElementById(campo);
                if (elemento) {
                    datos[campo] = elemento.value;
                }
            });
        }
        
        return datos;
    }
    
    async agregarIteracion() {
        try {
            const datos = this.obtenerDatosFormulario();
            
            // Validación básica
            if (!datos.nombre) {
                this.mostrarMensaje('error', 'Selecciona un proyecto primero');
                return;
            }
            
            const response = await fetch(`${this.apiBase}/agregar/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCsrfToken()
                },
                body: JSON.stringify(datos)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.iteraciones.push(result.iteracion);
                this.actualizarTabla();
                this.mostrarMensaje('success', 'Iteración agregada correctamente');
                this.limpiarCamposIteracion();
            } else {
                this.mostrarMensaje('error', result.error || 'Error al agregar iteración');
            }
        } catch (error) {
            window.logger?.error('Error agregando iteración:', error);
            this.mostrarMensaje('error', 'Error de conexión');
        }
    }
    
    async eliminarIteracion(id) {
        if (!confirm('¿Eliminar esta iteración?')) return;
        
        try {
            const response = await fetch(`${this.apiBase}/eliminar/${id}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': this.getCsrfToken()
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.iteraciones = this.iteraciones.filter(iter => iter.id != id);
                this.actualizarTabla();
                this.mostrarMensaje('success', 'Iteración eliminada');
            }
        } catch (error) {
            window.logger?.error('Error eliminando iteración:', error);
            this.mostrarMensaje('error', 'Error de conexión');
        }
    }
    
    actualizarTabla() {
        const tabla = document.getElementById('iterationTableBody');
        if (!tabla) return;
        
        if (this.iteraciones.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="12" class="text-center py-8 text-gray-500">
                        <i class="fas fa-inbox text-3xl mb-2"></i>
                        <p>No hay iteraciones agregadas</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tabla.innerHTML = this.iteraciones.map(iter => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-2">${iter.numero || '-'}</td>
                <td class="px-4 py-2">${iter.nombre_proyecto || '-'}</td>
                <td class="px-4 py-2">${iter.municipio || '-'}</td>
                <td class="px-4 py-2">${iter.direccion || '-'}</td>
                <td class="px-4 py-2">${iter.uc_nueva || '-'}</td>
                <td class="px-4 py-2">
                    <button class="btn-eliminar-iteracion text-red-600 hover:text-red-900" 
                            data-iteracion-id="${iter.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    limpiarCamposIteracion() {
        // Solo limpiar campos de iteración, no los del proyecto
        ['direccion', 'latitud', 'longitud', 'latitud_final', 'longitud_final'].forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento) elemento.value = '';
        });
    }
    
    mostrarMensaje(tipo, mensaje) {
        // Implementar notificación toast simple
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            tipo === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        toast.textContent = mensaje;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    }
    
    async cargarIteraciones() {
        try {
            const response = await fetch(`${this.apiBase}/listar/`);
            const result = await response.json();
            
            if (result.success) {
                this.iteraciones = result.iteraciones || [];
                this.actualizarTabla();
            }
        } catch (error) {
            window.logger?.error('Error cargando iteraciones:', error);
        }
    }
}
