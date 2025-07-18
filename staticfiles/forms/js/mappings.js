/**
 * DESS - Mapeos de Datos del Sistema
 * Contiene todos los mapeos de proyectos, municipios, circuitos, etc.
 */

// Mapeo de proyectos a bancos
const PROYECTO_BANCO_MAPPING = {
  "Automatización de redes distribución CENS": "NEG0719TYD",
  "Compra de bien futuro": "NEG9996TYD",
  "Electrificación Rural CENS": "NEG0721TYD",
  "Expansión redes de distribución CENS": "NEG0720TYD",
  "Gestión y control pérdidas de energía - CENS": "PEI0144TYD",
  "Mantenimiento redes de distribución": "NEG1175TYD",
  "Mantenimiento redes de distribución - MIT": "NEG1175MIT",
  "Normalización subestación Sevilla 115/34.5 kV e interconexión a 115 kV": "PEI0342TYD",
  "Nueva línea INSC77 - Guaduas 34.5 kV": "PEI1293DIS",
  "Nuevo Alimentador Gabarra": "PEI1197TYD",
  "Reconfiguración Planta Zulia 13.8kV": "PEI1198TYD",
};

// Mapeo completo de proyectos con contratos
const PROYECTO_COMPLETO_MAPPING = {
  "Automatización de redes distribución CENS": {
    banco: "NEG0719TYD",
    contratos: ["CON001", "CON002"]
  },
  "Compra de bien futuro": {
    banco: "NEG9996TYD", 
    contratos: ["CON003"]
  },
  "Electrificación Rural CENS": {
    banco: "NEG0721TYD",
    contratos: ["CON004", "CON005"]
  },
  "Expansión redes de distribución CENS": {
    banco: "NEG0720TYD",
    contratos: ["CON006"]
  },
  "Gestión y control pérdidas de energía - CENS": {
    banco: "PEI0144TYD",
    contratos: ["CON007"]
  },
  "Mantenimiento redes de distribución": {
    banco: "NEG1175TYD",
    contratos: ["CON008", "CON009"]
  },
  "Mantenimiento redes de distribución - MIT": {
    banco: "NEG1175MIT",
    contratos: ["CON010"]
  },
  "Normalización subestación Sevilla 115/34.5 kV e interconexión a 115 kV": {
    banco: "PEI0342TYD",
    contratos: ["CON011"]
  },
  "Nueva línea INSC77 - Guaduas 34.5 kV": {
    banco: "PEI1293DIS",
    contratos: ["CON012"]
  },
  "Nuevo Alimentador Gabarra": {
    banco: "PEI1197TYD",
    contratos: ["CON013"]
  },
  "Reconfiguración Planta Zulia 13.8kV": {
    banco: "PEI1198TYD",
    contratos: ["CON014"]
  },
  "Reposición redes de distribución CENS": {
    banco: "REP001TYD",
    contratos: ["CON015"]
  },
  "Reposición transformadores distribución CENS": {
    banco: "REP002TYD",
    contratos: ["CON016"]
  },
  "Repotenciación de líneas CENS 115 kV": {
    banco: "REP003TYD",
    contratos: ["CON017"]
  },
  "Reposición subestaciones y líneas CENS": {
    banco: "REP004TYD",
    contratos: ["CON018"]
  },
  "Expansión y normalización de subestaciones media tensión.": {
    banco: "EXP001TYD",
    contratos: ["CON019"]
  },
  "Nueva subestación La Playa 34.5/13.8 kV": {
    banco: "NUE001TYD",
    contratos: ["CON020"]
  },
  "Gestión de Activos CENS": {
    banco: "GES001TYD",
    contratos: ["CON021"]
  },
  "Activos de Uso propiedad de Terceros": {
    banco: "ACT001TYD",
    contratos: ["CON022"]
  }
};

// Mapeo de municipios a departamentos y regionales
const MUNICIPIO_MAPPING = {
  MORALES: { departamento: "BOLIVAR", regional: "AGUACHICA" },
  AGUACHICA: { departamento: "CESAR", regional: "AGUACHICA" },
  GAMARRA: { departamento: "CESAR", regional: "AGUACHICA" },
  GONZALEZ: { departamento: "CESAR", regional: "OCAÑA" },
  "LA GLORIA": { departamento: "CESAR", regional: "AGUACHICA" },
  PAILITAS: { departamento: "CESAR", regional: "AGUACHICA" },
  PELAYA: { departamento: "CESAR", regional: "AGUACHICA" },
  "RIO DE ORO": { departamento: "CESAR", regional: "OCAÑA" },
  "SAN ALBERTO": { departamento: "CESAR", regional: "OCAÑA" },
  "SAN MARTIN": { departamento: "CESAR", regional: "OCAÑA" },
  ÁBREGO: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  ARBOLEDAS: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  BOCHALEMA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  BUCARASICA: { departamento: "NORTE DE SANTANDER", regional: "TIBÚ" },
  CÁCHIRA: { departamento: "NORTE DE SANTANDER", regional: "AGUACHICA" },
  CÁCOTA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  CHINÁCOTA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  CHITAGÁ: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  CONVENCIÓN: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  CÚCUTA: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  CUCUTILLA: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  DURANIA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  "EL CARMEN": { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  "EL TARRA": { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  "EL ZULIA": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  GRAMALOTE: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  HACARÍ: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  HERRÁN: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  "LA ESPERANZA": { departamento: "NORTE DE SANTANDER", regional: "AGUACHICA" },
  "LA PLAYA": { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  LABATECA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  "LOS PATIOS": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  LOURDES: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  MUTISCUA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  OCAÑA: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  PAMPLONA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  PAMPLONITA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  "PUERTO SANTANDER": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  RAGONVALIA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  SALAZAR: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  "SAN CALIXTO": { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  "SAN CAYETANO": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  SANTIAGO: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  SARDINATA: { departamento: "NORTE DE SANTANDER", regional: "TIBÚ" },
  SILOS: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  TEORAMA: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  TIBÚ: { departamento: "NORTE DE SANTANDER", regional: "TIBÚ" },
  TOLEDO: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  "VILLA DEL ROSARIO": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  "VILLA CARO": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  CONCEPCION: { departamento: "SANTANDER", regional: "PAMPLONA" }
};

// Mapeo de municipios a circuitos
const MUNICIPIO_CIRCUITO_MAPPING = {
  ÁBREGO: ["TARC1"],
  CONVENCIÓN: ["SPAC2"],
  "LA PLAYA": ["ABRC1", "CONSAL_TEORA", "OCALA_PLAYA", "OCAOCANA3"],
  OCAÑA: ["TOLLABATECA"],
  HACARÍ: ["ABRC2", "CONSAL_TEORA", "OCALA_PLAYA", "TARC1"],
  "LA ESPERANZA": ["SANALBERTO"],
  "SAN ALBERTO": ["ABRC2", "ABRC3", "LOS_ALPES"],
  "SAN MARTÍN": ["ABRC3", "OCALA_PLAYA"],
  "LOS PATIOS": ["TOLTOLEDO"],
  AGUACHICA: ["GAMC1", "GAMC2", "GAMC3", "MONTESITOS", "OCAGONZALES", "OCAIA15", "OCAOCANA2", "PATC1", "PELC2", "SANC46", "SANC55", "TARC2", "ZULC3"],
  CÚCUTA: ["AGUC2", "AGUC4", "ATAC86", "ATAC87", "ATAC88", "BELC21", "BELC22", "BELC23", "BELC24", "BELC27", "BELC28", "BELC29", "BELC30", "BELC31", "BELC33", "BELC35", "BELC36", "BELC38", "CAMC2", "CLIL20", "CONSAL_CARMEN", "CONSAL_TEORA", "CORC1", "CULC1", "CULC2", "ELSC68", "ELSC69", "ESCC61", "ESCC62", "ESCC63", "GAMC3", "GRAC2", "GRAC3", "IL70", "INSC76", "INSC77", "INSC91", "INSC92", "INSC93", "INSC94", "INSIL60", "OCAGONZALES", "OCAOCANA3", "P_IL30", "PALCHINACOTA", "PALDONJUANA", "PALRAGONVALIA", "PAMC2", "PAMC3", "PAMC4", "PATC1", "PATC2", "PATC3", "PLZ263B1", "PLZ283B1", "PLZS10", "PLZS20", "SALC4", "SAMSAMORE", "SANC43", "SANC45", "SANC46", "SANC48", "SANC49", "SANC51", "SANC52", "SANC53", "SANC54", "SANC55", "SANC56", "SANC57", "SANC58", "SANC59", "SANIL15", "SANOL15", "SANOL25", "SANOL35", "SANOL45", "SANOL55", "SARC2", "SEVC11", "SEVC16", "SEVC17", "SEVC21", "SEVC22", "SEVC3", "SEVC4", "SEVC5", "SEVC6", "SEVC7", "SEVS10", "SEVS20", "SRQC3", "TARC1", "TOLLABATECA"],
  GAMARRA: ["AGUC2", "AGUC3", "AGUC4", "AGUC5", "BUIA25", "BUTC1", "GAMC1", "GAMC2", "GAMC3"],
  MORALES: ["AGUC2", "AGUC5", "AGUC7", "GAMC1", "GAMC3"],
  PELAYA: ["AGUC5", "AYAA31", "LAMATA", "PELC1", "PELC2"],
  "RÍO DE ORO": ["AGUC5", "BUTC2", "MONTESITOS", "OCAGONZALES", "OCAIA15", "OCALA_PLAYA", "OCAOCANA1", "OCAOCANA2", "OCAOCANA3"]
};

// Función para inicializar los mapeos
function initializeDataMappings() {
  console.log("📊 Mapeo Proyecto-Banco:", Object.keys(PROYECTO_BANCO_MAPPING).length, "proyectos");
  console.log("📋 Mapeo Proyecto-Completo:", Object.keys(PROYECTO_COMPLETO_MAPPING).length, "proyectos con contratos");
  console.log("🏙️ Mapeo Municipios:", Object.keys(MUNICIPIO_MAPPING).length, "municipios");
  console.log("⚡ Mapeo Municipio-Circuito:", Object.keys(MUNICIPIO_CIRCUITO_MAPPING).length, "municipios con circuitos");
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PROYECTO_BANCO_MAPPING,
    PROYECTO_COMPLETO_MAPPING,
    MUNICIPIO_MAPPING,
    MUNICIPIO_CIRCUITO_MAPPING,
    initializeDataMappings
  };
}
