// Mapeo completo de UCs y sus descripciones
const UC_MAPPING = {
    'N1P1': 'Poste de concreto - 8 m - urbano - suspensión - red común',
    'N1P2': 'Poste de concreto - 10 m - urbano - suspensión - red común',
    'N1P3': 'Poste de concreto - 12 m - urbano - suspensión - red común',
    'N1P4': 'Poste de madera - 8 m - urbano - suspensión - red común',
    'N1P5': 'Poste de madera - 10 m - urbano - suspensión - red común',
    'N1P6': 'Poste de madera - 12 m - urbano - suspensión - red común',
    'N1P7': 'Poste de metálico - 8 m - urbano - suspensión - red común',
    'N1P8': 'Poste de metálico - 10 m - urbano - suspensión - red común',
    'N1P9': 'Poste de metálico - 12 m - urbano - suspensión - red común',
    'N1P10': 'Poste de fibra de vidrio - 8 m - urbano - suspensión - red común',
    'N1P11': 'Poste de fibra de vidrio - 10 m - urbano - suspensión - red común',
    'N1P12': 'Poste de fibra de vidrio - 12 m - urbano - suspensión - red común',
    'N1P13': 'Poste de concreto - 8 m - rural - suspensión - red común',
    'N1P14': 'Poste de concreto - 10 m - rural - suspensión - red común',
    'N1P15': 'Poste de concreto - 12 m - rural - suspensión - red común',
    'N1P16': 'Poste de madera - 8 m - rural - suspensión - red común',
    'N1P17': 'Poste de madera - 10 m - rural - suspensión - red común',
    'N1P18': 'Poste de madera - 12 m - rural - suspensión - red común',
    'N1P19': 'Poste de metálico - 8 m - rural - suspensión - red común',
    'N1P20': 'Poste de metálico - 10 m - rural - suspensión - red común',
    'N1P21': 'Poste de metálico - 12 m - rural - suspensión - red común',
    'N1P22': 'Poste de fibra de vidrio - 8 m - rural - suspensión - red común',
    'N1P23': 'Poste de fibra de vidrio - 10 m - rural - suspensión - red común',
    'N1P24': 'Poste de fibra de vidrio - 12 m - rural - suspensión - red común',
    'N1P25': 'Poste de concreto - 8 m - urbano - retención - red común',
    'N1P26': 'Poste de concreto - 10 m - urbano - retención - red común',
    'N1P27': 'Poste de concreto - 12 m - urbano - retención - red común',
    'N1P28': 'Poste de madera - 8 m - urbano - retención - red común',
    'N1P29': 'Poste de madera - 10 m - urbano - retención - red común',
    'N1P30': 'Poste de madera - 12 m - urbano - retención - red común',
    'N1P31': 'Poste de metálico - 8 m - urbano - retención - red común',
    'N1P32': 'Poste de metálico - 10 m - urbano - retención - red común',
    'N1P33': 'Poste de metálico - 12 m - urbano - retención - red común',
    'N1P34': 'Poste de fibra de vidrio - 8 m - urbano - retención - red común',
    'N1P35': 'Poste de fibra de vidrio - 10 m - urbano - retención - red común',
    'N1P36': 'Poste de fibra de vidrio - 12 m - urbano - retención - red común',
    'N1P37': 'Poste de concreto - 8 m - rural - retención - red común',
    'N1P38': 'Poste de concreto - 10 m - rural - retención - red común',
    'N1P39': 'Poste de concreto - 12 m - rural - retención - red común',
    'N1P40': 'Poste de madera - 8 m - rural - retención - red común',
    'N1P41': 'Poste de madera - 10 m - rural - retención - red común',
    'N1P42': 'Poste de madera - 12 m - rural - retención - red común',
    'N1P43': 'Poste de metálico - 8 m - rural - retención - red común',
    'N1P44': 'Poste de metálico - 10 m - rural - retención - red común',
    'N1P45': 'Poste de metálico - 12 m - rural - retención - red común',
    'N1P46': 'Poste de fibra de vidrio - 8 m - rural - retención - red común',
    'N1P47': 'Poste de fibra de vidrio - 10 m - rural - retención - red común',
    'N1P48': 'Poste de fibra de vidrio - 12 m - rural - retención - red común',
    'N1P49': 'Poste de concreto - 8 m - urbano - suspensión - red trenzada',
    'N1P50': 'Poste de concreto - 10 m - urbano - suspensión - red trenzada',
    'N1P51': 'Poste de concreto - 12 m - urbano - suspensión - red trenzada',
    'N1P52': 'Poste de madera - 8 m - urbano - suspensión - red trenzada',
    'N1P53': 'Poste de madera - 10 m - urbano - suspensión - red trenzada',
    'N1P54': 'Poste de madera - 12 m - urbano - suspensión - red trenzada',
    'N1P55': 'Poste de metálico - 8 m - urbano - suspensión - red trenzada',
    'N1P56': 'Poste de metálico - 10 m - urbano - suspensión - red trenzada',
    'N1P57': 'Poste de metálico - 12 m - urbano - suspensión - red trenzada',
    'N1P58': 'Poste de fibra de vidrio - 8 m - urbano - suspensión - red trenzada',
    'N1P59': 'Poste de fibra de vidrio - 10 m - urbano - suspensión - red trenzada',
    'N1P60': 'Poste de fibra de vidrio - 12 m - urbano - suspensión - red trenzada',
    'N1P61': 'Poste de concreto - 9 m - rural - suspensión - red trenzada',
    'N1P62': 'Poste de concreto - 10 m - rural - suspensión - red trenzada',
    'N1P63': 'Poste de concreto - 12 m - rural - suspensión - red trenzada',
    'N1P64': 'Poste de madera - 8 m - rural - suspensión - red trenzada',
    'N1P65': 'Poste de madera - 10 m - rural - suspensión - red trenzada',
    'N1P66': 'Poste de madera - 12 m - rural - suspensión - red trenzada',
    'N1P67': 'Poste de metálico - 8 m - rural - suspensión - red trenzada',
    'N1P68': 'Poste de metálico - 10 m - rural - suspensión - red trenzada',
    'N1P69': 'Poste de metálico - 12 m - rural - suspensión - red trenzada',
    'N1P70': 'Poste de fibra de vidrio - 8 m - rural - suspensión - red trenzada',
    'N1P71': 'Poste de fibra de vidrio - 10 m - rural - suspensión - red trenzada',
    'N1P72': 'Poste de fibra de vidrio - 12 m - rural - suspensión - red trenzada',
    'N1P73': 'Poste de concreto - 8 m - urbano - retención - red trenzada',
    'N1P74': 'Poste de concreto - 10 m - urbano - retención - red trenzada',
    'N1P75': 'Poste de concreto - 12 m - urbano - retención - red trenzada',
    'N1P76': 'Poste de madera - 8 m - urbano - retención - red trenzada',
    'N1P77': 'Poste de madera - 10 m - urbano - retención - red trenzada',
    'N1P78': 'Poste de madera - 12 m - urbano - retención - red trenzada',
    'N1P79': 'Poste de metálico - 8 m - urbano - retención - red trenzada',
    'N1P80': 'Poste de metálico - 10 m - urbano - retención - red trenzada',
    'N1P81': 'Poste de metálico - 12 m - urbano - retención - red trenzada',
    'N1P82': 'Poste de fibra de vidrio - 8 m - urbano - retención - red trenzada',
    'N1P83': 'Poste de fibra de vidrio - 10 m - urbano - retención - red trenzada',
    'N1P84': 'Poste de fibra de vidrio - 12 m - urbano - retención - red trenzada',
    'N1P85': 'Poste de concreto - 9 m - rural - retención - red trenzada',
    'N1P86': 'Poste de concreto - 10 m - rural - retención - red trenzada',
    'N1P87': 'Poste de concreto - 12 m - rural - retención - red trenzada',
    'N1P88': 'Poste de madera - 8 m - rural - retención - red trenzada',
    'N1P89': 'Poste de madera - 10 m - rural - retención - red trenzada',
    'N1P90': 'Poste de madera - 12 m - rural - retención - red trenzada',
    'N1P91': 'Poste de metálico - 8 m - rural - retención - red trenzada',
    'N1P92': 'Poste de metálico - 10 m - rural - retención - red trenzada',
    'N1P93': 'Poste de metálico - 12 m - rural - retención - red trenzada',
    'N1P94': 'Poste de fibra de vidrio - 8 m - rural - retención - red trenzada',
    'N1P95': 'Poste de fibra de vidrio - 10 m - rural - retención - red trenzada',
    'N1P96': 'Poste de fibra de vidrio - 12 m - rural - retención - red trenzada'
};

// Función para obtener UC basado en parámetros de la estructura
function getUCFromStructure(material, altura, poblacion, disposicion, tipoRed) {
    console.log('Búsqueda UC con parámetros:', { material, altura, poblacion, disposicion, tipoRed });
    
    // Normalizar los valores para que coincidan con las descripciones
    const materialNorm = material?.toLowerCase();
    const alturaNorm = altura?.toString();
    const poblacionNorm = poblacion?.toLowerCase();
    const disposicionNorm = disposicion?.toLowerCase();
    const tipoRedNorm = tipoRed?.toLowerCase();
    
    console.log('Valores normalizados:', { materialNorm, alturaNorm, poblacionNorm, disposicionNorm, tipoRedNorm });
    
    // Buscar en el mapping
    for (const [uc, descripcion] of Object.entries(UC_MAPPING)) {
        const desc = descripcion.toLowerCase();
        
        // Verificar material (debe coincidir exactamente)
        if (materialNorm) {
            let materialMatch = false;
            if (materialNorm === 'fibra de vidrio' && desc.includes('fibra de vidrio')) materialMatch = true;
            else if (materialNorm === 'concreto' && desc.includes('concreto')) materialMatch = true;
            else if (materialNorm === 'metálico' && desc.includes('metálico')) materialMatch = true;
            else if (materialNorm === 'metalico' && desc.includes('metálico')) materialMatch = true;
            else if (materialNorm === 'madera' && desc.includes('madera')) materialMatch = true;
            
            if (!materialMatch) continue;
        }
        
        // Verificar altura (debe coincidir exactamente) - incluir soporte para 9m
        if (alturaNorm && !desc.includes(alturaNorm + ' m')) continue;
        
        // Verificar población (urbano/rural) - mapear urbana->urbano
        if (poblacionNorm) {
            if (poblacionNorm === 'urbana' && !desc.includes('urbano')) continue;
            if (poblacionNorm === 'urbano' && !desc.includes('urbano')) continue;
            if (poblacionNorm === 'rural' && !desc.includes('rural')) continue;
        }
        
        // Verificar disposición - mapear suspencion->suspensión
        if (disposicionNorm) {
            if (disposicionNorm === 'retención' && !desc.includes('retención')) continue;
            if (disposicionNorm === 'retencion' && !desc.includes('retención')) continue;
            if (disposicionNorm === 'suspensión' && !desc.includes('suspensión')) continue;
            if (disposicionNorm === 'suspencion' && !desc.includes('suspensión')) continue;
        }
        
        // Verificar tipo de red - mapear común->red común y trenzada->red trenzada
        if (tipoRedNorm) {
            if (tipoRedNorm === 'común' && !desc.includes('red común')) continue;
            if (tipoRedNorm === 'comun' && !desc.includes('red común')) continue;
            if (tipoRedNorm === 'red común' && !desc.includes('red común')) continue;
            if (tipoRedNorm === 'trenzada' && !desc.includes('red trenzada')) continue;
            if (tipoRedNorm === 'red trenzada' && !desc.includes('red trenzada')) continue;
        }
        
        console.log('¡UC encontrado!', uc, ':', descripcion);
        return uc;
    }
    
    console.log('No se encontró UC para los parámetros dados');
    return null;
}

// Función para filtrar UCs por criterios
function filterUCs(criteria) {
    const filtered = {};
    
    for (const [uc, descripcion] of Object.entries(UC_MAPPING)) {
        const desc = descripcion.toLowerCase();
        let matches = true;
        
        for (const [key, value] of Object.entries(criteria)) {
            if (value && !desc.includes(value.toLowerCase())) {
                matches = false;
                break;
            }
        }
        
        if (matches) {
            filtered[uc] = descripcion;
        }
    }
    
    return filtered;
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UC_MAPPING, getUCFromStructure, filterUCs };
}
