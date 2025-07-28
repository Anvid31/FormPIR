/**
 * Sistema de autocompletado inteligente para UCs de equipos
 * Versión específica para la sección de equipos de protección
 */
class EquipoAutocompletado {
    constructor() {
        this.ucMapping = {
            // Mapeo específico para equipos según las nuevas UC
            equipos: {
                'seccionador': {
                    'aereo': {
                        '13.8': 'N1E1',
                        '34.5': 'N1E2',
                        '115': 'N1E3'
                    },
                    'subestacion': {
                        '13.8': 'N1E4',
                        '34.5': 'N1E5',
                        '115': 'N1E6'
                    },
                    'pedestal': {
                        '13.8': 'N1E7',
                        '34.5': 'N1E8'
                    }
                },
                'reconectador': {
                    'aereo': {
                        '13.8': 'N1E9',
                        '34.5': 'N1E10'
                    },
                    'subestacion': {
                        '13.8': 'N1E11',
                        '34.5': 'N1E12'
                    }
                },
                'regulador': {
                    'aereo': {
                        '13.8': 'N1E13',
                        '34.5': 'N1E14'
                    },
                    'subestacion': {
                        '13.8': 'N1E15',
                        '34.5': 'N1E16'
                    }
                },
                'condensador': {
                    'aereo': {
                        '13.8': 'N1E17',
                        '34.5': 'N1E18'
                    },
                    'subestacion': {
                        '13.8': 'N1E19',
                        '34.5': 'N1E20'
                    }
                },
                'pararrayos': {
                    'aereo': {
                        '13.8': 'N1E21',
                        '34.5': 'N1E22',
                        '115': 'N1E23'
                    },
                    'subestacion': {
                        '13.8': 'N1E24',
                        '34.5': 'N1E25',
                        '115': 'N1E26'
                    }
                },
                'interruptor': {
                    'aereo': {
                        '13.8': 'N1E27',
                        '34.5': 'N1E28'
                    },
                    'subestacion': {
                        '13.8': 'N1E29',
                        '34.5': 'N1E30'
                    }
                },
                'fusible': {
                    'aereo': {
                        '13.8': 'N1E31',
                        '34.5': 'N1E32'
                    },
                    'pedestal': {
                        '13.8': 'N1E33',
                        '34.5': 'N1E34'
                    }
                }
            }
        };

        this.initializeEventListeners();
        this.resetForm();
    }

    initializeEventListeners() {
        // Escuchar cambios en los selectores tradicionales si existen
        const tipoSelect = document.getElementById('tipo_equipo');
        const voltajeSelect = document.getElementById('voltaje_operacion');
        const instalacionSelect = document.getElementById('tipo_instalacion_equipo');

        if (tipoSelect) {
            tipoSelect.addEventListener('change', () => this.updateFromTraditionalSelectors());
        }
        if (voltajeSelect) {
            voltajeSelect.addEventListener('change', () => this.updateFromTraditionalSelectors());
        }
        if (instalacionSelect) {
            instalacionSelect.addEventListener('change', () => this.updateFromTraditionalSelectors());
        }

        // Escuchar cambios del selector UC jerárquico
        document.addEventListener('ucEquipoSelected', (event) => {
            this.handleUCSelection(event.detail);
        });
    }

    updateFromTraditionalSelectors() {
        const tipo = document.getElementById('tipo_equipo')?.value;
        const voltaje = document.getElementById('voltaje_operacion')?.value;
        const instalacion = document.getElementById('tipo_instalacion_equipo')?.value;

        if (tipo && voltaje && instalacion) {
            this.calculateUCFromSelectors(tipo, voltaje, instalacion);
        }
    }

    calculateUCFromSelectors(tipo, voltaje, instalacion) {
        const tipoNorm = this.normalizeTipoEquipo(tipo);
        const instalacionNorm = this.normalizeInstalacion(instalacion);
        const voltajeNorm = this.normalizeVoltaje(voltaje);

        try {
            const uc = this.ucMapping.equipos[tipoNorm]?.[instalacionNorm]?.[voltajeNorm];
            if (uc && window.UC_MAPPING && window.UC_MAPPING[uc]) {
                this.showResult(uc, window.UC_MAPPING[uc]);
                this.updateHiddenFields(uc, window.UC_MAPPING[uc]);
            } else {
                this.showError('No se encontró UC para la combinación seleccionada');
            }
        } catch (e) {
            console.warn('Error calculando UC desde selectores tradicionales:', e);
            this.showError('Error en el cálculo de UC');
        }
    }

    normalizeTipoEquipo(tipo) {
        const tipoMap = {
            'SECCIONADOR': 'seccionador',
            'RECONECTADOR': 'reconectador',
            'REGULADOR': 'regulador',
            'CONDENSADOR': 'condensador',
            'PARARRAYOS': 'pararrayos',
            'INTERRUPTOR': 'interruptor',
            'FUSIBLE': 'fusible'
        };
        return tipoMap[tipo.toUpperCase()] || tipo.toLowerCase();
    }

    normalizeInstalacion(instalacion) {
        const instalacionMap = {
            'AEREO': 'aereo',
            'AÉREO': 'aereo',
            'SUBESTACION': 'subestacion',
            'SUBESTACIÓN': 'subestacion',
            'PEDESTAL': 'pedestal'
        };
        return instalacionMap[instalacion.toUpperCase()] || instalacion.toLowerCase();
    }

    normalizeVoltaje(voltaje) {
        // Normalizar voltaje a formato estándar
        const voltajeStr = voltaje.toString();
        if (voltajeStr.includes('13.8') || voltajeStr.includes('13,8')) return '13.8';
        if (voltajeStr.includes('34.5') || voltajeStr.includes('34,5')) return '34.5';
        if (voltajeStr.includes('115')) return '115';
        return voltajeStr;
    }

    handleUCSelection(data) {
        if (data.code && data.description) {
            this.updateHiddenFields(data.code, data.description);
            this.updateTraditionalSelectors(data);
        }
    }

    updateHiddenFields(uc, descripcion) {
        const ucField = document.getElementById('uc_equipo');
        const descField = document.getElementById('descripcion_uc_equipo');

        if (ucField) ucField.value = uc;
        if (descField) descField.value = descripcion;
    }

    updateTraditionalSelectors(data) {
        // Actualizar selectores tradicionales basados en la UC seleccionada
        if (data.selections) {
            const { tipo_equipo, nivel_tension, tipo_instalacion } = data.selections;
            
            if (tipo_equipo) {
                const tipoSelect = document.getElementById('tipo_equipo');
                if (tipoSelect) {
                    const tipoMap = {
                        'seccionador': 'SECCIONADOR',
                        'reconectador': 'RECONECTADOR',
                        'regulador': 'REGULADOR',
                        'condensador': 'CONDENSADOR',
                        'pararrayos': 'PARARRAYOS',
                        'interruptor': 'INTERRUPTOR',
                        'fusible': 'FUSIBLE'
                    };
                    tipoSelect.value = tipoMap[tipo_equipo] || '';
                }
            }

            if (nivel_tension) {
                const voltajeSelect = document.getElementById('voltaje_operacion');
                if (voltajeSelect) {
                    voltajeSelect.value = nivel_tension;
                }
            }

            if (tipo_instalacion) {
                const instalacionSelect = document.getElementById('tipo_instalacion_equipo');
                if (instalacionSelect) {
                    const instalacionMap = {
                        'aereo': 'AEREO',
                        'subestacion': 'SUBESTACION',
                        'pedestal': 'PEDESTAL'
                    };
                    instalacionSelect.value = instalacionMap[tipo_instalacion] || '';
                }
            }
        }
    }

    showResult(uc, descripcion) {
        const messageContainer = document.getElementById('equipo-uc-message');
        if (messageContainer) {
            messageContainer.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <i class="fas fa-check-circle text-green-600 mr-2"></i>
                        <div>
                            <h4 class="font-semibold text-green-800">UC Equipo Determinado</h4>
                            <p class="text-sm text-green-700"><strong>Código:</strong> ${uc}</p>
                            <p class="text-sm text-green-700"><strong>Descripción:</strong> ${descripcion}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        console.log('✅ UC Equipo calculado:', { uc, descripcion });
    }

    showError(message = 'No se pudo determinar la UC') {
        const messageContainer = document.getElementById('equipo-uc-message');
        if (messageContainer) {
            messageContainer.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                        <div>
                            <h4 class="font-semibold text-red-800">UC No Determinado</h4>
                            <p class="text-sm text-red-700">${message}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    resetForm() {
        const ucField = document.getElementById('uc_equipo');
        const descField = document.getElementById('descripcion_uc_equipo');
        
        if (ucField) ucField.value = '';
        if (descField) descField.value = '';
        
        const messageContainer = document.getElementById('equipo-uc-message');
        if (messageContainer) {
            messageContainer.innerHTML = `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                        <p class="text-sm text-blue-700">Complete la selección de UC o los campos del equipo para determinar automáticamente la UC correspondiente.</p>
                    </div>
                </div>
            `;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('equipos') || document.getElementById('uc_equipo')) {
        window.equipoAutocompletado = new EquipoAutocompletado();
        console.log('✅ Sistema de autocompletado de equipos inicializado');
    }
});
