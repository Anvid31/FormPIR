/**
 * Configuración Central de la Aplicación FormPIR
 * Un solo lugar para todas las configuraciones
 */

window.APP_CONFIG = {
    // Configuración de API
    api: {
        baseUrl: window.location.origin,
        endpoints: {
            iteraciones: '/iteraciones',
            autocompletar: '/api/autocompletar',
            validar: '/api/validar'
        }
    },
    
    // IDs de elementos críticos
    elementos: {
        // Información del proyecto
        proyecto: {
            nombre: 'nombre',
            banco: 'banco_proyecto',
            contrato: 'contrato',
            municipio: 'municipio',
            departamento: 'departamento',
            regional: 'regional'
        },
        
        // Información técnica
        tecnica: {
            fecha: 'fecha',
            tipoInversion: 't_inv',
            circuito: 'alimentador',
            estructuraRetirada: 'estructura_retirada_campo',
            direccion: 'direccion'
        },
        
        // Coordenadas
        coordenadas: {
            latitudInicial: 'latitud',
            longitudInicial: 'longitud',
            latitudFinal: 'latitud_final',
            longitudFinal: 'longitud_final'
        },
        
        // UC
        uc: {
            codigo: 'uc_nueva',
            descripcion: 'descripcion_uc',
            selector: 'uc-selector-content'
        },
        
        // Checkboxes especiales
        checkboxes: {
            montajeIntegral: 'montaje_integral_checkbox',
            desmantelado: 'desmantelado_checkbox'
        }
    },
    
    // Configuración de secciones
    secciones: {
        estructuras: {
            nombre: 'Estructuras',
            campos_especificos: ['material_nueva', 'altura_nueva', 'poblacion_nueva']
        },
        conductores: {
            nombre: 'Conductores',
            campos_especificos: ['tipo_conductor', 'calibre', 'nivel_tension_conductor']
        },
        equipos: {
            nombre: 'Equipos',
            campos_especificos: ['tipo_equipo', 'marca', 'modelo']
        },
        transformadores: {
            nombre: 'Transformadores',
            campos_especificos: ['potencia_transformador', 'tipo_transformador']
        }
    },
    
    // Configuración de debugging
    debug: {
        enabled: false, // Cambiar a true solo en desarrollo
        logLevel: 'error' // 'debug', 'info', 'warn', 'error'
    }
};
