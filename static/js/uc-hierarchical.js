/**
 * Estructura jerárquica para el sistema de UC (Unidades Constructivas)
 * Convierte el mapeo plano a una estructura jerárquica dinámica
 */

const UC_HIERARCHICAL_STRUCTURE = {
    // Nivel 1 - Postes básicos
    N1: {
        label: "Nivel 1 - Postes Básicos",
        category: "postes",
        levels: {
            material: {
                label: "Material",
                options: {
                    concreto: "Concreto",
                    madera: "Madera",
                    metalico: "Metálico", 
                    fibra: "Fibra de Vidrio"
                }
            },
            altura: {
                label: "Altura",
                options: {
                    "8": "8 m",
                    "9": "9 m", 
                    "10": "10 m",
                    "12": "12 m"
                }
            },
            zona: {
                label: "Zona",
                options: {
                    urbano: "Urbano",
                    rural: "Rural"
                }
            },
            disposicion: {
                label: "Disposición",
                options: {
                    suspension: "Suspensión",
                    retencion: "Retención"
                }
            },
            tipo_red: {
                label: "Tipo de Red",
                options: {
                    comun: "Red Común",
                    trenzada: "Red Trenzada"
                }
            }
        }
    },

    // Nivel 2 - Postes con peso específico
    N2: {
        label: "Nivel 2 - Postes con Peso",
        category: "postes_peso",
        levels: {
            material: {
                label: "Material",
                options: {
                    concreto: "Concreto",
                    prfv: "PRFV",
                    metalico: "Metálico"
                }
            },
            altura: {
                label: "Altura", 
                options: {
                    "12": "12 m"
                }
            },
            peso: {
                label: "Peso",
                options: {
                    "510": "510 kg",
                    "750": "750 kg", 
                    "1050": "1050 kg"
                }
            },
            disposicion: {
                label: "Disposición",
                options: {
                    suspension: "Suspensión",
                    retencion: "Retención"
                }
            }
        }
    },

    // Nivel 3 - Estructuras avanzadas
    N3: {
        label: "Nivel 3 - Estructuras Avanzadas",
        category: "estructuras",
        levels: {
            tipo_estructura: {
                label: "Tipo de Estructura",
                options: {
                    poste_simple: "Poste Simple",
                    postes_h: "Postes en H",
                    estructura_concreto: "Estructura Concreto",
                    torrecilla: "Torrecilla"
                }
            },
            material: {
                label: "Material",
                options: {
                    concreto: "Concreto",
                    prfv: "PRFV"
                }
            },
            altura: {
                label: "Altura",
                options: {
                    "12": "12 m",
                    "14": "14 m", 
                    "16": "16 m",
                    "27": "27 m"
                }
            },
            peso: {
                label: "Peso",
                options: {
                    "510": "510 kg",
                    "750": "750 kg",
                    "1050": "1050 kg",
                    "1350": "1350 kg",
                    "1500": "1500 kg",
                    "2000": "2000 kg",
                    "3000": "3000 kg"
                }
            },
            circuito: {
                label: "Tipo de Circuito",
                options: {
                    sencillo: "Circuito Sencillo",
                    doble: "Circuito Doble"
                }
            },
            disposicion: {
                label: "Disposición",
                options: {
                    suspension: "Suspensión",
                    retencion: "Retención"
                }
            }
        }
    },

    // Nivel 4 - Estructuras de alta tensión
    N4: {
        label: "Nivel 4 - Estructuras Alta Tensión",
        category: "alta_tension",
        levels: {
            tipo_estructura: {
                label: "Tipo de Estructura",
                options: {
                    estructura_concreto: "Estructura Concreto",
                    poste_metalico: "Poste Metálico"
                }
            },
            altura: {
                label: "Altura",
                options: {
                    "25": "25 m",
                    "27": "27 m"
                }
            },
            linea: {
                label: "Tipo de Línea",
                options: {
                    aerea_desnuda: "Línea Aérea Desnuda"
                }
            },
            circuito: {
                label: "Tipo de Circuito", 
                options: {
                    sencillo: "Circuito Sencillo",
                    doble: "Circuito Doble"
                }
            },
            disposicion: {
                label: "Disposición",
                options: {
                    suspension: "Suspensión",
                    retencion: "Retención"
                }
            }
        }
    },

    // Transformadores Nivel 1
    N1T: {
        label: "Transformadores Nivel 1",
        category: "transformadores",
        levels: {
            tipo_instalacion: {
                label: "Tipo de Instalación",
                options: {
                    aereo: "Aéreo",
                    pedestal: "Pedestal",
                    subestacion: "Subestación"
                }
            },
            fases: {
                label: "Número de Fases",
                options: {
                    monofasico: "Monofásico",
                    trifasico: "Trifásico"
                }
            },
            zona: {
                label: "Zona",
                options: {
                    urbano: "Urbano",
                    rural: "Rural"
                }
            },
            potencia: {
                label: "Potencia",
                options: {
                    "5": "5 kVA",
                    "7.5": "7,5 kVA",
                    "10": "10 kVA",
                    "15": "15 kVA",
                    "20": "20 kVA",
                    "25": "25 kVA",
                    "30": "30 kVA",
                    "37.5": "37,5 kVA",
                    "45": "45 kVA",
                    "50": "50 kVA",
                    "75": "75 kVA",
                    "112.5": "112,5 kVA",
                    "150": "150 kVA",
                    "225": "225 kVA",
                    "250": "250 kVA",
                    "300": "300 kVA",
                    "400": "400 kVA",
                    "500": "500 kVA",
                    "630": "630 kVA",
                    "1000": "1000 kVA"
                }
            }
        }
    }
};

/**
 * Mapeo inverso para generar códigos UC desde selecciones jerárquicas
 */
const UC_CODE_GENERATOR = {
    N1: (selections) => {
        // Validar que todas las selecciones están presentes
        if (!selections.material || !selections.altura || !selections.zona || !selections.disposicion || !selections.tipo_red) {
            console.error('N1: Selecciones incompletas:', selections);
            return 'Selección incompleta para N1';
        }
        
        // Lógica para generar código N1P basado en selecciones
        const materialMap = { concreto: 'concreto', madera: 'madera', metalico: 'metálico', fibra: 'fibra de vidrio' };
        const zonaMap = { urbano: 'urbano', rural: 'rural' };
        const disposicionMap = { suspension: 'suspensión', retencion: 'retención' };
        const tipoRedMap = { comun: 'red común', trenzada: 'red trenzada' };
        
        const material = materialMap[selections.material] || selections.material;
        const zona = zonaMap[selections.zona] || selections.zona;
        const disposicion = disposicionMap[selections.disposicion] || selections.disposicion;
        const tipoRed = tipoRedMap[selections.tipo_red] || selections.tipo_red;
        
        return `Poste de ${material} - ${selections.altura} m - ${zona} - ${disposicion} - ${tipoRed}`;
    },

    N2: (selections) => {
        const materialMap = { concreto: 'concreto', prfv: 'PRFV', metalico: 'metálico' };
        const disposicionMap = { suspension: 'suspensión', retencion: 'retención' };
        
        return `Poste de ${materialMap[selections.material]} de ${selections.altura} m ${selections.peso} kg - ${disposicionMap[selections.disposicion]}`;
    },

    N3: (selections) => {
        const estructuraMap = { 
            poste_simple: 'Poste simple', 
            postes_h: 'Postes en H', 
            estructura_concreto: 'Estructura concreto',
            torrecilla: 'Torrecilla'
        };
        const materialMap = { concreto: 'concreto', prfv: 'PRFV' };
        const circuitoMap = { sencillo: 'Circuito sencillo', doble: 'Circuito doble' };
        const disposicionMap = { suspension: 'suspensión', retencion: 'retención' };
        
        if (selections.tipo_estructura === 'torrecilla') {
            return `Torrecilla ${circuitoMap[selections.circuito]} ${disposicionMap[selections.disposicion]}`;
        }
        
        return `${estructuraMap[selections.tipo_estructura]} de ${materialMap[selections.material]} de ${selections.altura} m ${selections.peso} kg ${circuitoMap[selections.circuito]} ${disposicionMap[selections.disposicion]}`;
    },

    N4: (selections) => {
        const estructuraMap = { 
            estructura_concreto: 'Estructura concreto', 
            poste_metalico: 'Poste metálico'
        };
        const circuitoMap = { sencillo: 'circuito sencillo', doble: 'circuito doble' };
        const disposicionMap = { suspension: 'suspensión', retencion: 'retención' };
        
        return `${estructuraMap[selections.tipo_estructura]} de ${selections.altura} m línea aérea desnuda ${circuitoMap[selections.circuito]} ${disposicionMap[selections.disposicion]}`;
    },

    N1T: (selections) => {
        const tipoMap = { aereo: 'Aéreo', pedestal: 'Pedestal', subestacion: 'Subestación' };
        const fasesMap = { monofasico: 'Monofásico', trifasico: 'Trifásico' };
        const zonaMap = { urbano: 'urbano', rural: 'rural' };
        
        return `Transformador ${tipoMap[selections.tipo_instalacion]} ${fasesMap[selections.fases]} ${zonaMap[selections.zona]} de ${selections.potencia} kVA`;
    }
};

/**
 * Función para buscar el código UC exacto basado en la descripción generada
 */
function findExactUCCode(category, description) {
    console.log(`Buscando código UC para categoría: ${category}, descripción: "${description}"`);
    
    // Importar UC_MAPPING del archivo original
    if (typeof UC_MAPPING === 'undefined') {
        console.error('UC_MAPPING no está disponible');
        return null;
    }
    
    // Filtrar solo los códigos de la categoría relevante
    const categoryEntries = Object.entries(UC_MAPPING).filter(([code, desc]) => code.startsWith(category));
    console.log(`Encontrados ${categoryEntries.length} códigos para la categoría ${category}`);
    
    // Buscar por descripción exacta
    for (const [code, desc] of categoryEntries) {
        if (desc === description) {
            console.log(`✅ Encontrado código exacto: ${code}`);
            return code;
        }
    }
    
    console.log('No se encontró descripción exacta, probando búsqueda aproximada...');
    
    // Búsqueda aproximada - normalizar espacios y mayúsculas
    const normalizedDescription = description.toLowerCase().replace(/\s+/g, ' ').trim();
    
    for (const [code, desc] of categoryEntries) {
        const normalizedDesc = desc.toLowerCase().replace(/\s+/g, ' ').trim();
        if (normalizedDesc === normalizedDescription) {
            console.log(`✅ Encontrado código por normalización: ${code}`);
            return code;
        }
    }
    
    // Búsqueda por palabras clave principales
    console.log('Probando búsqueda por palabras clave...');
    const keywords = description.toLowerCase().split(/[-\s]+/).filter(word => word.length > 2);
    console.log('Palabras clave:', keywords);
    
    for (const [code, desc] of categoryEntries) {
        const descLower = desc.toLowerCase();
        const matchingKeywords = keywords.filter(keyword => descLower.includes(keyword));
        if (matchingKeywords.length >= Math.min(3, keywords.length - 1)) {
            console.log(`🔍 Encontrado código por palabras clave (${matchingKeywords.length}/${keywords.length}): ${code}`);
            console.log(`Descripción encontrada: "${desc}"`);
            return code;
        }
    }
    
    console.log('❌ No se encontró código UC para la descripción');
    console.log('Primeros 5 códigos disponibles para comparación:');
    categoryEntries.slice(0, 5).forEach(([code, desc]) => {
        console.log(`  ${code}: "${desc}"`);
    });
    
    return null;
}

/**
 * Función principal para obtener el código UC desde selecciones jerárquicas
 */
function getUCCodeFromSelections(category, selections) {
    const description = UC_CODE_GENERATOR[category](selections);
    return findExactUCCode(category, description);
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UC_HIERARCHICAL_STRUCTURE,
        UC_CODE_GENERATOR,
        getUCCodeFromSelections,
        findExactUCCode
    };
}

// Exportar al contexto global para uso en navegador
if (typeof window !== 'undefined') {
    window.UC_HIERARCHICAL_STRUCTURE = UC_HIERARCHICAL_STRUCTURE;
    window.UC_CODE_GENERATOR = UC_CODE_GENERATOR;
    window.getUCCodeFromSelections = getUCCodeFromSelections;
    window.findExactUCCode = findExactUCCode;
}
