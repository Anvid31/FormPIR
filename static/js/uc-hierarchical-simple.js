/**
 * Versión simplificada de UC_HIERARCHICAL_STRUCTURE para test
 * Solo incluye N1E y N1C para verificar el problema
 */

const UC_HIERARCHICAL_STRUCTURE_SIMPLE = {
    // Conductores
    N1C: {
        label: "Conductores Nivel 1",
        category: "conductores",
        levels: {
            tipo_red: {
                label: "Tipo de Red",
                options: {
                    aerea_desnuda: "Aérea Desnuda",
                    aerea_compacta: "Aérea Compacta",
                    subterranea: "Subterránea"
                }
            },
            nivel_tension: {
                label: "Nivel de Tensión",
                options: {
                    n1: "Nivel 1 (Baja)",
                    n2: "Nivel 2 (Media)", 
                    n3: "Nivel 3 (Alta)"
                }
            },
            calibre: {
                label: "Calibre",
                options: {
                    "2": "2 AWG",
                    "1/0": "1/0 AWG",
                    "2/0": "2/0 AWG",
                    "4/0": "4/0 AWG",
                    "266.8": "266.8 MCM",
                    "336.4": "336.4 MCM",
                    "477": "477 MCM"
                }
            },
            tipo_conductor: {
                label: "Material del Conductor",
                options: {
                    aluminio: "Aluminio",
                    cobre: "Cobre",
                    acsr: "ACSR",
                    aaac: "AAAC"
                }
            }
        }
    },

    // Equipos de Protección
    N1E: {
        label: "Equipos de Protección",
        category: "equipos",
        levels: {
            tipo_equipo: {
                label: "Tipo de Equipo",
                options: {
                    seccionador: "Seccionador",
                    reconectador: "Reconectador",
                    regulador: "Regulador de Tensión",
                    condensador: "Banco de Condensadores",
                    pararrayos: "Pararrayos",
                    interruptor: "Interruptor",
                    fusible: "Fusible"
                }
            },
            nivel_tension: {
                label: "Nivel de Tensión",
                options: {
                    "13.8": "13.8 kV",
                    "34.5": "34.5 kV", 
                    "115": "115 kV"
                }
            },
            tipo_instalacion: {
                label: "Tipo de Instalación",
                options: {
                    aereo: "Aéreo",
                    subestacion: "Subestación",
                    pedestal: "Pedestal"
                }
            }
        }
    }
};

// Exportar al contexto global para uso en navegador
if (typeof window !== 'undefined') {
    window.UC_HIERARCHICAL_STRUCTURE_SIMPLE = UC_HIERARCHICAL_STRUCTURE_SIMPLE;
    
    // Debug específico para este test
    console.log('🔍 UC_HIERARCHICAL_STRUCTURE_SIMPLE cargado');
    console.log('📋 Categorías en versión simple:', Object.keys(UC_HIERARCHICAL_STRUCTURE_SIMPLE));
    
    // Verificar cada categoría específicamente
    if (UC_HIERARCHICAL_STRUCTURE_SIMPLE.N1C) {
        console.log('✅ N1C presente en versión simple:', UC_HIERARCHICAL_STRUCTURE_SIMPLE.N1C.label);
    } else {
        console.error('❌ N1C faltante en versión simple');
    }
    
    if (UC_HIERARCHICAL_STRUCTURE_SIMPLE.N1E) {
        console.log('✅ N1E presente en versión simple:', UC_HIERARCHICAL_STRUCTURE_SIMPLE.N1E.label);
    } else {
        console.error('❌ N1E faltante en versión simple');
    }
}
