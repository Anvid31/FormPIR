/**
 * Sistema de autocompletado inteligente para UCs de conductores
 * Versión específica para la sección de conductores
 */
class ConductorAutocompletado {
    constructor() {
        this.ucMapping = {
            // Mapeo específico para conductores según las nuevas UC
            conductores: {
                'aluminio': {
                    'aerea_desnuda': {
                        'n1': {
                            '2': 'N1C1',
                            '1/0': 'N1C2', 
                            '2/0': 'N1C3',
                            '4/0': 'N1C4',
                            '266.8': 'N1C5',
                            '336.4': 'N1C6',
                            '477': 'N1C7'
                        },
                        'n2': {
                            '2/0': 'N1C15',
                            '4/0': 'N1C16',
                            '266.8': 'N1C17'
                        },
                        'n3': {
                            '477': 'N1C18'
                        }
                    }
                },
                'cobre': {
                    'aerea_compacta': {
                        'n1': {
                            '2': 'N1C8',
                            '1/0': 'N1C9',
                            '2/0': 'N1C10',
                            '4/0': 'N1C11'
                        },
                        'n2': {
                            '336.4': 'N1C20'
                        }
                    }
                },
                'acsr': {
                    'subterranea': {
                        'n1': {
                            '4/0': 'N1C12',
                            '266.8': 'N1C13',
                            '336.4': 'N1C14'
                        }
                    },
                    'aerea_desnuda': {
                        'n3': {
                            '477': 'N1C19'
                        }
                    }
                },
                'aaac': {
                    'aerea_desnuda': {
                        'n2': {
                            '2/0': 'N1C15',
                            '4/0': 'N1C16',
                            '266.8': 'N1C17'
                        }
                    }
                }
            }
        };

        this.initializeEventListeners();
        this.resetForm();
    }

    initializeEventListeners() {
        // Escuchar cambios en los selectores tradicionales si existen
        const tipoSelect = document.getElementById('conductor_n1_tipo');
        const calibreSelect = document.getElementById('conductor_n1_calibre');
        const nivelSelect = document.getElementById('nivel_tension');

        if (tipoSelect) {
            tipoSelect.addEventListener('change', () => this.updateFromTraditionalSelectors());
        }
        if (calibreSelect) {
            calibreSelect.addEventListener('change', () => this.updateFromTraditionalSelectors());
        }
        if (nivelSelect) {
            nivelSelect.addEventListener('change', () => this.updateFromTraditionalSelectors());
        }

        // Escuchar cambios del selector UC jerárquico
        document.addEventListener('ucConductorSelected', (event) => {
            this.handleUCSelection(event.detail);
        });
    }

    updateFromTraditionalSelectors() {
        const tipo = document.getElementById('conductor_n1_tipo')?.value;
        const calibre = document.getElementById('conductor_n1_calibre')?.value;
        const nivel = document.getElementById('nivel_tension')?.value;

        if (tipo && calibre && nivel) {
            this.calculateUCFromSelectors(tipo, calibre, nivel);
        }
    }

    calculateUCFromSelectors(tipo, calibre, nivel) {
        const tipoMap = {
            'ACSR': 'acsr',
            'AAC': 'aluminio',
            'AAAC': 'aaac',
            'XLPE': 'cobre',
            'EPR': 'cobre'
        };

        const tipoRed = this.inferTipoRed(tipo);
        const nivelNorm = `n${nivel}`;
        const tipoNorm = tipoMap[tipo] || tipo.toLowerCase();

        try {
            const uc = this.ucMapping.conductores[tipoNorm]?.[tipoRed]?.[nivelNorm]?.[calibre];
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

    inferTipoRed(tipoConductor) {
        // Lógica para inferir el tipo de red según el conductor
        const redMap = {
            'ACSR': 'aerea_desnuda',
            'AAC': 'aerea_desnuda', 
            'AAAC': 'aerea_desnuda',
            'XLPE': 'subterranea',
            'EPR': 'aerea_compacta'
        };
        return redMap[tipoConductor] || 'aerea_desnuda';
    }

    handleUCSelection(data) {
        if (data.code && data.description) {
            this.updateHiddenFields(data.code, data.description);
            this.updateTraditionalSelectors(data);
        }
    }

    updateHiddenFields(uc, descripcion) {
        const ucField = document.getElementById('uc_conductor');
        const descField = document.getElementById('descripcion_uc_conductor');

        if (ucField) ucField.value = uc;
        if (descField) descField.value = descripcion;
    }

    updateTraditionalSelectors(data) {
        // Actualizar selectores tradicionales basados en la UC seleccionada
        if (data.selections) {
            const { tipo_conductor, calibre, nivel_tension } = data.selections;
            
            if (tipo_conductor) {
                const tipoSelect = document.getElementById('conductor_n1_tipo');
                if (tipoSelect) {
                    const tipoMap = {
                        'aluminio': 'AAC',
                        'cobre': 'EPR',
                        'acsr': 'ACSR',
                        'aaac': 'AAAC'
                    };
                    tipoSelect.value = tipoMap[tipo_conductor] || '';
                }
            }

            if (calibre) {
                const calibreSelect = document.getElementById('conductor_n1_calibre');
                if (calibreSelect) {
                    calibreSelect.value = calibre;
                }
            }

            if (nivel_tension) {
                const nivelSelect = document.getElementById('nivel_tension');
                if (nivelSelect) {
                    const nivelMap = {
                        'n1': '1',
                        'n2': '2', 
                        'n3': '3'
                    };
                    nivelSelect.value = nivelMap[nivel_tension] || '';
                }
            }
        }
    }

    showResult(uc, descripcion) {
        const messageContainer = document.getElementById('conductor-uc-message');
        if (messageContainer) {
            messageContainer.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <i class="fas fa-check-circle text-green-600 mr-2"></i>
                        <div>
                            <h4 class="font-semibold text-green-800">UC Conductor Determinado</h4>
                            <p class="text-sm text-green-700"><strong>Código:</strong> ${uc}</p>
                            <p class="text-sm text-green-700"><strong>Descripción:</strong> ${descripcion}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        console.log('✅ UC Conductor calculado:', { uc, descripcion });
    }

    showError(message = 'No se pudo determinar la UC') {
        const messageContainer = document.getElementById('conductor-uc-message');
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
        const ucField = document.getElementById('uc_conductor');
        const descField = document.getElementById('descripcion_uc_conductor');
        
        if (ucField) ucField.value = '';
        if (descField) descField.value = '';
        
        const messageContainer = document.getElementById('conductor-uc-message');
        if (messageContainer) {
            messageContainer.innerHTML = `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                        <p class="text-sm text-blue-700">Complete la selección de UC o los campos del conductor para determinar automáticamente la UC correspondiente.</p>
                    </div>
                </div>
            `;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('conductores') || document.getElementById('uc_conductor')) {
        window.conductorAutocompletado = new ConductorAutocompletado();
        console.log('✅ Sistema de autocompletado de conductores inicializado');
    }
});
