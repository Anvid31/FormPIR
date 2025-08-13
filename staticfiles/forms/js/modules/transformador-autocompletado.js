/**
 * Sistema de autocompletado inteligente para UCs de transformadores
 * Versión limpia sin logs excesivos
 */
class TransformadorAutocompletado {
    constructor() {
        this.ucMapping = {
            // Transformadores de Potencia N1T
            potencia: {
                aereo: {
                    urbano: {
                        monofasico: {
                            '5': 'N1T1',
                            '7.5': 'N1T2',
                            '10': 'N1T3',
                            '15': 'N1T4',
                            '25': 'N1T5',
                            '37.5': 'N1T6',
                            '50': 'N1T7',
                            '75': 'N1T8'
                        },
                        trifasico: {
                            '15': 'N1T9',
                            '20': 'N1T10',
                            '30': 'N1T11',
                            '45': 'N1T12',
                            '50': 'N1T13',
                            '75': 'N1T14',
                            '112.5': 'N1T15',
                            '150': 'N1T16'
                        }
                    },
                    rural: {
                        monofasico: {
                            '5': 'N1T38',
                            '7.5': 'N1T39',
                            '10': 'N1T40',
                            '15': 'N1T41',
                            '25': 'N1T42',
                            '37.5': 'N1T43',
                            '50': 'N1T44',
                            '75': 'N1T45'
                        },
                        trifasico: {
                            '15': 'N1T46',
                            '20': 'N1T47',
                            '30': 'N1T48',
                            '45': 'N1T49',
                            '50': 'N1T50',
                            '75': 'N1T51',
                            '112.5': 'N1T52',
                            '150': 'N1T53'
                        }
                    }
                },
                pedestal: {
                    urbano: {
                        trifasico: {
                            '45': 'N1T17',
                            '75': 'N1T18',
                            '112.5': 'N1T19',
                            '225': 'N1T20',
                            '250': 'N1T21',
                            '300': 'N1T22',
                            '400': 'N1T23',
                            '500': 'N1T24',
                            '630': 'N1T25',
                            '1000': 'N1T26'
                        }
                    },
                    rural: {
                        trifasico: {
                            '45': 'N1T54',
                            '75': 'N1T55',
                            '112.5': 'N1T56',
                            '225': 'N1T57',
                            '250': 'N1T58',
                            '300': 'N1T59',
                            '400': 'N1T60',
                            '500': 'N1T61',
                            '630': 'N1T62',
                            '1000': 'N1T63'
                        }
                    }
                },
                subestacion: {
                    urbano: {
                        trifasico: {
                            '45': 'N1T27',
                            '75': 'N1T28',
                            '112.5': 'N1T29',
                            '150': 'N1T30',
                            '225': 'N1T31',
                            '250': 'N1T32',
                            '300': 'N1T33',
                            '400': 'N1T34',
                            '500': 'N1T35',
                            '630': 'N1T36',
                            '1000': 'N1T37'
                        }
                    },
                    rural: {
                        trifasico: {
                            '45': 'N1T64',
                            '75': 'N1T65',
                            '112.5': 'N1T66',
                            '150': 'N1T67',
                            '225': 'N1T68',
                            '250': 'N1T69',
                            '300': 'N1T70',
                            '400': 'N1T71',
                            '500': 'N1T72',
                            '630': 'N1T73',
                            '1000': 'N1T74'
                        }
                    }
                }
            },
            // Transformadores de Medición
            medicion: {
                'puesta_tierra': {
                    n2: 'N2EQ37',
                    n3: 'N3EQ10'
                },
                'tension': {
                    n2: 'N2EQ38',
                    n3: 'N3EQ11'
                },
                'tension_pedestal': {
                    n2: 'N2EQ39',
                    n3: 'N3EQ26'
                },
                'corriente': {
                    n2: 'N2EQ40',
                    n3: 'N3EQ27'
                }
            }
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.resetForm();
        });
    }

    resetForm() {
        const campos = ['categoria_transformador', 'apoyo_transformador', 'ubicacion_transformador', 'fases_transformador', 'potencia_transformador'];
        campos.forEach(campo => {
            const element = document.getElementById(campo);
            if (element) {
                element.innerHTML = '<option value="">Seleccionar...</option>';
                element.disabled = true;
            }
        });

        const camposPotencia = document.getElementById('campos_potencia');
        const resultadoUC = document.getElementById('resultado_uc');
        if (camposPotencia) camposPotencia.style.display = 'none';
        if (resultadoUC) resultadoUC.style.display = 'none';
        
        this.updateMessageHelper('Complete los campos en orden para que el sistema determine automáticamente la UC correspondiente.');
    }

    updateTipoTransformador() {
        const tipo = document.getElementById('tipo_transformador')?.value;
        const categoriaSelect = document.getElementById('categoria_transformador');
        
        if (!categoriaSelect) return;
        
        categoriaSelect.innerHTML = '<option value="">Seleccionar categoría</option>';
        categoriaSelect.disabled = false;

        if (tipo === 'potencia') {
            categoriaSelect.innerHTML += '<option value="potencia">Transformador de Potencia</option>';
            const camposPotencia = document.getElementById('campos_potencia');
            if (camposPotencia) camposPotencia.style.display = 'block';
            this.updateMessageHelper('Ahora seleccione la categoría del transformador.');
        } else if (tipo === 'medicion') {
            categoriaSelect.innerHTML += `
                <option value="puesta_tierra">Transformador de puesta a tierra</option>
                <option value="tension">Transformador de tensión</option>
                <option value="tension_pedestal">Transformador de tensión (pedestal)</option>
                <option value="corriente">Transformador de corriente</option>
            `;
            const camposPotencia = document.getElementById('campos_potencia');
            if (camposPotencia) camposPotencia.style.display = 'none';
            this.updateMessageHelper('Seleccione el tipo específico de transformador de medición.');
        }

        this.resetSubsequentFields(['apoyo_transformador', 'ubicacion_transformador', 'fases_transformador', 'potencia_transformador']);
    }

    updateCategoria() {
        const tipo = document.getElementById('tipo_transformador')?.value;
        const categoria = document.getElementById('categoria_transformador')?.value;
        const apoyoSelect = document.getElementById('apoyo_transformador');

        if (!apoyoSelect) return;

        apoyoSelect.innerHTML = '<option value="">Seleccionar instalación</option>';
        apoyoSelect.disabled = false;

        if (tipo === 'potencia' && categoria === 'potencia') {
            apoyoSelect.innerHTML += `
                <option value="aereo">Aéreo</option>
                <option value="pedestal">Pedestal</option>
                <option value="subestacion">Subestación</option>
            `;
            this.updateMessageHelper('Seleccione el tipo de instalación del transformador.');
        } else if (tipo === 'medicion') {
            if (categoria === 'tension_pedestal') {
                apoyoSelect.innerHTML += '<option value="pedestal">Pedestal</option>';
            } else {
                apoyoSelect.innerHTML += `
                    <option value="n2">Nivel 2</option>
                    <option value="n3">Nivel 3</option>
                `;
            }
            this.updateMessageHelper('Seleccione el nivel de tensión correspondiente.');
        }

        this.resetSubsequentFields(['ubicacion_transformador', 'fases_transformador', 'potencia_transformador']);
    }

    updateApoyo() {
        const tipo = document.getElementById('tipo_transformador')?.value;
        const ubicacionSelect = document.getElementById('ubicacion_transformador');

        if (tipo === 'potencia') {
            if (ubicacionSelect) ubicacionSelect.disabled = false;
            this.updateMessageHelper('Seleccione la ubicación (urbano o rural).');
        } else if (tipo === 'medicion') {
            if (ubicacionSelect) ubicacionSelect.disabled = true;
            this.calculateUC();
            return;
        }

        this.resetSubsequentFields(['fases_transformador', 'potencia_transformador']);
    }

    updateUbicacion() {
        const fasesSelect = document.getElementById('fases_transformador');
        if (fasesSelect) fasesSelect.disabled = false;
        this.updateMessageHelper('Seleccione el número de fases del transformador.');
        
        this.resetSubsequentFields(['potencia_transformador']);
    }

    updateFases() {
        const apoyo = document.getElementById('apoyo_transformador')?.value;
        const fases = document.getElementById('fases_transformador')?.value;
        const potenciaSelect = document.getElementById('potencia_transformador');

        if (!potenciaSelect) return;

        potenciaSelect.innerHTML = '<option value="">Seleccionar potencia</option>';
        potenciaSelect.disabled = false;

        let potencias = [];

        if (fases === 'monofasico') {
            potencias = ['5', '7.5', '10', '15', '25', '37.5', '50', '75'];
        } else if (fases === 'trifasico') {
            if (apoyo === 'aereo') {
                potencias = ['15', '20', '30', '45', '50', '75', '112.5', '150'];
            } else if (apoyo === 'pedestal' || apoyo === 'subestacion') {
                potencias = ['45', '75', '112.5', '150', '225', '250', '300', '400', '500', '630', '1000'];
            }
        }

        potencias.forEach(potencia => {
            potenciaSelect.innerHTML += `<option value="${potencia}">${potencia} kVA</option>`;
        });

        this.updateMessageHelper('Finalmente, seleccione la potencia del transformador.');
    }

    updatePotencia() {
        this.calculateUC();
    }

    calculateUC() {
        const tipo = document.getElementById('tipo_transformador')?.value;
        const categoria = document.getElementById('categoria_transformador')?.value;
        const apoyo = document.getElementById('apoyo_transformador')?.value;
        const ubicacion = document.getElementById('ubicacion_transformador')?.value;
        const fases = document.getElementById('fases_transformador')?.value;
        const potencia = document.getElementById('potencia_transformador')?.value;

        let uc = null;

        if (tipo === 'potencia' && categoria === 'potencia') {
            try {
                uc = this.ucMapping.potencia[apoyo][ubicacion][fases][potencia];
            } catch (e) {
                window.logger?.warn('Combinación no encontrada en mapping de transformadores');
            }
        } else if (tipo === 'medicion') {
            try {
                uc = this.ucMapping.medicion[categoria][apoyo];
            } catch (e) {
                window.logger?.warn('Transformador de medición no encontrado');
            }
        }

        if (uc && window.UC_MAPPING && window.UC_MAPPING[uc]) {
            this.showResult(uc, window.UC_MAPPING[uc]);
        } else {
            this.showError();
        }
    }

    showResult(uc, descripcion) {
        const ucResultado = document.getElementById('uc_transformador_resultado');
        const descResultado = document.getElementById('descripcion_transformador_resultado');
        const resultado = document.getElementById('resultado_uc');
        
        if (ucResultado) ucResultado.value = uc;
        if (descResultado) descResultado.value = descripcion;
        if (resultado) resultado.style.display = 'block';
        
        this.updateMessageHelper('¡UC determinada exitosamente! Puede continuar con el resto del formulario.', 'success');
    }

    showError() {
        const resultado = document.getElementById('resultado_uc');
        if (resultado) resultado.style.display = 'none';
        this.updateMessageHelper('No se pudo determinar la UC con la combinación seleccionada. Verifique los valores.', 'error');
    }

    updateMessageHelper(message, type = 'info') {
        const messageDiv = document.getElementById('mensaje_ayuda');
        if (!messageDiv) return;
        
        const messageP = messageDiv.querySelector('p');
        if (!messageP) return;

        messageP.innerHTML = `<i class="${this.getIconClass(type)} mr-2"></i>${message}`;
        messageDiv.className = `mt-4 p-3 rounded-lg border ${this.getMessageClass(type)}`;
    }

    getIconClass(type) {
        switch (type) {
            case 'success': return 'fas fa-check-circle';
            case 'error': return 'fas fa-exclamation-triangle';
            default: return 'fas fa-info-circle';
        }
    }

    getMessageClass(type) {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200 text-green-800';
            case 'error': return 'bg-red-50 border-red-200 text-red-800';
            default: return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        }
    }

    resetSubsequentFields(fields) {
        fields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.innerHTML = '<option value="">Seleccionar...</option>';
                element.disabled = true;
            }
        });
        
        const resultado = document.getElementById('resultado_uc');
        if (resultado) resultado.style.display = 'none';
    }
}

// Funciones globales para los event handlers del HTML
function updateUCTransformador() {
    if (!window.transformadorAutocompletado) {
        window.transformadorAutocompletado = new TransformadorAutocompletado();
    }

    // Determinar qué campo cambió y llamar la función correspondiente
    if (event.target.id === 'tipo_transformador') {
        window.transformadorAutocompletado.updateTipoTransformador();
    } else if (event.target.id === 'categoria_transformador') {
        window.transformadorAutocompletado.updateCategoria();
    } else if (event.target.id === 'apoyo_transformador') {
        window.transformadorAutocompletado.updateApoyo();
    } else if (event.target.id === 'ubicacion_transformador') {
        window.transformadorAutocompletado.updateUbicacion();
    } else if (event.target.id === 'fases_transformador') {
        window.transformadorAutocompletado.updateFases();
    } else if (event.target.id === 'potencia_transformador') {
        window.transformadorAutocompletado.updatePotencia();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.transformadorAutocompletado = new TransformadorAutocompletado();
});
