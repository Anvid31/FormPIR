/**
 * DESS - Mapeos de Datos del Sistema Centralizados
 * Versión optimizada que evita duplicación y mejora rendimiento
 * @version 2.0.0
 * @description Todos los mapeos están centralizados aquí para evitar redundancia
 */

// ==================== CONFIGURACIÓN GLOBAL ====================
window.DESS_MAPPINGS = window.DESS_MAPPINGS || {};

// ==================== MAPEOS DE PROYECTOS ====================

// Mapeo de proyectos a bancos (legacy - mantenido por compatibilidad)
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
  "Reposición redes de distribución CENS": "NEG0717TYD",
  "Reposición transformadores distribución CENS": "NEG0718TYD",
  "Repotenciación de líneas CENS 115 kV": "PEI0553TYD",
  "Reposición subestaciones y líneas CENS": "NEG0716TYD",
  "Expansión y normalización de subestaciones media tensión.": "NEG1176TYD",
  "Nueva subestación La Playa 34.5/13.8 kV": "PEI0569TYDCE",
  "Gestión de Activos CENS": "SGACENSTYD",
  "Activos de Uso propiedad de Terceros": "NEG0720TYD"
};

// Mapeo completo de proyectos con contratos
const PROYECTO_COMPLETO_MAPPING = {
  "Expansión redes de distribución CENS": {
    banco: "NEG0720TYD",
    contratos: [
      {
        codigo: "CW321301",
        contratista: "INGESSA",
        regional: "CÚCUTA Y PAMPLONA"
      },
      {
        codigo: "CW324382",
        contratista: "ENECON",
        regional: "OCAÑA Y AGUACHICA"
      }
    ]
  },
  "Reposición redes de distribución CENS": {
    banco: "NEG0717TYD",
    contratos: [
      {
        codigo: "CW321301",
        contratista: "INGESSA",
        regional: "CÚCUTA Y PAMPLONA"
      },
      {
        codigo: "CW324382",
        contratista: "ENECON",
        regional: "OCAÑA Y AGUACHICA"
      }
    ]
  },
  "Gestión y control pérdidas de energía - CENS": {
    banco: "PEI0144TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Automatización de redes distribución CENS": {
    banco: "NEG0719TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Compra de bien futuro": {
    banco: "NEG9996TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Electrificación Rural CENS": {
    banco: "NEG0721TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Mantenimiento redes de distribución": {
    banco: "NEG1175TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Mantenimiento redes de distribución - MIT": {
    banco: "NEG1175MIT",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Normalización subestación Sevilla 115/34.5 kV e interconexión a 115 kV": {
    banco: "PEI0342TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Nueva línea INSC77 - Guaduas 34.5 kV": {
    banco: "PEI1293DIS",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Nuevo Alimentador Gabarra": {
    banco: "PEI1197TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Reconfiguración Planta Zulia 13.8kV": {
    banco: "PEI1198TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Reposición transformadores distribución CENS": {
    banco: "NEG0718TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Repotenciación de líneas CENS 115 kV": {
    banco: "PEI0553TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Reposición subestaciones y líneas CENS": {
    banco: "NEG0716TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Expansión y normalización de subestaciones media tensión.": {
    banco: "NEG1176TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Nueva subestación La Playa 34.5/13.8 kV": {
    banco: "PEI0569TYDCE",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Gestión de Activos CENS": {
    banco: "SGACENSTYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  },
  "Activos de Uso propiedad de Terceros": {
    banco: "NEG0720TYD",
    contratos: [
      {
        codigo: "Por definir",
        contratista: "Por definir",
        regional: "Por definir"
      }
    ]
  }
};

// Mapeo de municipios a departamentos y regionales - ACTUALIZADO ENERO 2025
const MUNICIPIO_MAPPING = {
  // BOLIVAR (1 municipio)
  MORALES: { departamento: "BOLIVAR", regional: "AGUACHICA" },
  
  // CESAR (7 municipios)
  AGUACHICA: { departamento: "CESAR", regional: "AGUACHICA" },
  GAMARRA: { departamento: "CESAR", regional: "AGUACHICA" },
  GONZALEZ: { departamento: "CESAR", regional: "OCAÑA" },
  "LA GLORIA": { departamento: "CESAR", regional: "AGUACHICA" },
  PAILITAS: { departamento: "CESAR", regional: "AGUACHICA" },
  PELAYA: { departamento: "CESAR", regional: "AGUACHICA" },
  "RIO DE ORO": { departamento: "CESAR", regional: "OCAÑA" },
  
  // NORTE DE SANTANDER (37 municipios)
  ÁBREGO: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  ARBOLEDAS: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  BOCHALEMA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  BUCARASICA: { departamento: "NORTE DE SANTANDER", regional: "TIBU" },
  CÁCHIRA: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  CÁCOTA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  CHINÁCOTA: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  CHITAGÁ: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  CONVENCIÓN: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  CÚCUTA: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  CUCUTILLA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  DURANIA: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  "EL CARMEN": { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  "EL TARRA": { departamento: "NORTE DE SANTANDER", regional: "TIBU" },
  "EL ZULIA": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  GRAMALOTE: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  HACARÍ: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  HERRÁN: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  "LA ESPERANZA": { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  "LA PLAYA": { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  LABATECA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  "LOS PATIOS": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  LOURDES: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  MUTISCUA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  OCAÑA: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  PAMPLONA: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  PAMPLONITA: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  "PUERTO SANTANDER": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  RAGONVALIA: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  SALAZAR: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  "SAN CALIXTO": { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  "SAN CAYETANO": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  SANTIAGO: { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  SARDINATA: { departamento: "NORTE DE SANTANDER", regional: "TIBU" },
  SILOS: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  TEORAMA: { departamento: "NORTE DE SANTANDER", regional: "OCAÑA" },
  TIBÚ: { departamento: "NORTE DE SANTANDER", regional: "TIBU" },
  TOLEDO: { departamento: "NORTE DE SANTANDER", regional: "PAMPLONA" },
  "VILLA DEL ROSARIO": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  "VILLA CARO": { departamento: "NORTE DE SANTANDER", regional: "CUCUTA" },
  
  // SANTANDER (2 municipios)
  CONCEPCION: { departamento: "SANTANDER", regional: "PAMPLONA" },
  "SAN ALBERTO": { departamento: "SANTANDER", regional: "OCAÑA" },
  "SAN MARTIN": { departamento: "SANTANDER", regional: "OCAÑA" }
};

// Mapeo de municipios a circuitos - ACTUALIZADO ENERO 2025
const MUNICIPIO_CIRCUITO_MAPPING = {
  ÁBREGO: ["ABRC1", "ABRC2", "ABRC3", "AGUC4", "AGUC7", "CACHIRA", "CONSAL_CARMEN", "ELSC68", "GRAC3", "OCAGONZALES", "OCAILA5", "OCALA_PLAYA", "OCAOCANA2", "OCAOCANA3", "TARC1"],
  AGUACHICA: ["AGUC2", "AGUC3", "AGUC4", "AGUC5", "AGUC7", "AGUC8", "AGUIG5", "AGUIG6", "AYAC1", "AYAC2", "BELC21", "BELC23", "BELC29", "BUTC1", "BUTC2", "CONSAL_CARMEN", "ELSC68", "GAMC1", "GAMC2", "GAMC3", "MONTESITOS", "OCAGONZALES", "OCAIA15", "PATC1", "PELC2", "SANC46", "SANC55", "TARC2", "ZULC3"],
  ARBOLEDAS: ["BELC30", "CORC1", "PLZ263B1", "SALC1", "SALC4", "SEVC4"],
  BOCHALEMA: ["CORC1", "P_IL30", "PALBOCHALEMA", "PALCHINACOTA", "PALDONJUANA", "PAMC4", "PATC2", "SALC1", "SEVC16", "TOLPALERMO"],
  BOGOTÁ: ["SEVC17"],
  BUCARASICA: ["GRAC2", "GRAC3", "SARC1", "SARC2"],
  CÁCHIRA: ["CACHIRA", "LA_MIEL", "LOS_ALPES", "LOS_MANGOS", "SALC1", "SANALBERTO", "SAN_ANTONIO"],
  CÁCOTA: ["PALCHINACOTA", "PAMC2", "PAMC3", "PAMC4", "TOLLABATECA", "TOLPALERMO"],
  CERRITO: ["TOLLABATECA"],
  CHINÁCOTA: ["ATAC86", "ELSC68", "INSC94", "P_IL30", "PALBOCHALEMA", "PALCHINACOTA", "PALDONJUANA", "PALRAGONVALIA", "PATC2", "PLZ283B1", "SALC4", "TOLPALERMO", "TOLTOLEDO"],
  CHITAGÁ: ["CONSAL_CONVE", "PALRAGONVALIA", "PAMC2", "SEVC16", "TOLLABATECA", "TOLTOLEDO"],
  CONCEPCION: [],
  CONVENCIÓN: ["ABRC1", "CONS65", "CONS75", "CONS95", "CONSAL_CARMEN", "CONSAL_CONVE", "CONSAL_SANPABLO", "CONSAL_TEORA", "OCAIC25", "SPAC2"],
  CUBARÁ: ["SAMSAMORE"],
  CUCUTILLA: ["GRAC2", "PAMC2", "SALC1", "SALC4"],
  CÚCUTA: ["AGUC2", "AGUC4", "ATAC86", "ATAC87", "ATAC88", "BELC21", "BELC22", "BELC23", "BELC24", "BELC27", "BELC28", "BELC29", "BELC30", "BELC31", "BELC33", "BELC35", "BELC36", "BELC38", "CAMC2", "CLIL20", "CONSAL_CARMEN", "CONSAL_TEORA", "CORC1", "CULC1", "CULC2", "ELSC68", "ELSC69", "ESCC61", "ESCC62", "ESCC63", "GAMC3", "GRAC2", "GRAC3", "IL70", "INSC76", "INSC77", "INSC91", "INSC92", "INSC93", "INSC94", "INSIL60", "OCAGONZALES", "OCAOCANA3", "P_IL30", "PALCHINACOTA", "PALDONJUANA", "PALRAGONVALIA", "PAMC2", "PAMC3", "PAMC4", "PATC1", "PATC2", "PATC3", "PLZ263B1", "PLZ283B1", "PLZS10", "PLZS20", "SALC4", "SAMSAMORE", "SANC43", "SANC45", "SANC46", "SANC48", "SANC49", "SANC51", "SANC52", "SANC53", "SANC54", "SANC55", "SANC56", "SANC57", "SANC58", "SANC59", "SANIL15", "SANOL15", "SANOL25", "SANOL35", "SANOL45", "SANOL55", "SARC2", "SEVC11", "SEVC16", "SEVC17", "SEVC21", "SEVC22", "SEVC3", "SEVC4", "SEVC5", "SEVC6", "SEVC7", "SEVS10", "SEVS20", "SRQC3", "TARC1", "TOLLABATECA", "ZULC2"],
  DURANIA: ["CORC1", "CORC2", "PALBOCHALEMA", "PALDONJUANA", "PLZ283B1", "SALC1", "SALC4", "SANC54", "SANC57", "SEVC16"],
  "EL CARMEN": ["AGUC4", "AYAC1", "CONS75", "CONSAL_CARMEN", "CONSAL_CONVE", "CONSAL_TEORA", "OCAGONZALES", "PAMC3", "SPAC2", "TARC1"],
  "EL PLAYÓN": ["LA_MIEL"],
  "EL TARRA": ["CONS65", "CONS95", "CONSAL_CARMEN", "CONSAL_CONVE", "CONSAL_TEORA", "OCALA_PLAYA", "OCAOCANA1", "OCAOCANA2", "ORUC1", "ORUC2", "PAMC4", "TARC1", "TARC2", "TIBO11"],
  "EL ZULIA": ["ATAC86", "BELC24", "BELC30", "BELC33", "BELC36", "CAMC3", "CLIL20", "CORC1", "CORC2", "CORC3", "CULC1", "CULC2", "ELSC69", "GRAC1", "GRAC2", "IL70", "INSC91", "INSC92", "INSC93", "PAMC4", "PATC1", "PLZ263B1", "PLZ283B1", "SALC4", "SARC2", "SEVC4", "SEVC5", "SEVC6", "SRQC1", "TIBTIBU2", "ZULC1", "ZULC2", "ZULC3"],
  GAMARRA: ["AGUC2", "AGUC3", "AGUC4", "AGUC5", "AYAC2", "BUIA25", "BUTC1", "GAMC1", "GAMC2", "GAMC3"],
  GONZALEZ: ["CONSAL_CARMEN", "CONSAL_CONVE", "OCAGONZALES", "OCAOCANA3"],
  GRAMALOTE: ["BELC36", "CORC2", "CULC1", "GRAC1", "GRAC2", "GRAC3", "SALC2", "SALC3", "SALC4", "SEVC6"],
  HACARÍ: ["ABRC2", "CONSAL_TEORA", "OCALA_PLAYA", "TARC1"],
  HERRÁN: ["ATAC88", "PALCHINACOTA", "PALRAGONVALIA", "PATC2", "SEVC5", "SEVC16"],
  "LA ESPERANZA": ["ABRC2", "AGUC2", "AGUC8", "LOS_ALPES", "SANALBERTO"],
  "LA GLORIA": ["AYAA31", "AYAC1", "AYAC2", "BUIA25", "CONS75", "CONSAL_CARMEN", "GAMC1", "LAMATA", "PELC2"],
  "LA PLAYA": ["ABRC1", "CONSAL_TEORA", "OCALA_PLAYA", "OCAOCANA3"],
  LABATECA: ["SAMSAMORE", "TOLLABATECA", "TOLPALERMO", "TOLTOLEDO"],
  "LOS PATIOS": ["ABRC3", "ATAC86", "ATAC87", "BELC21", "BELC24", "BELC27", "BELC29", "BELC30", "BELC31", "BELC35", "CAMC3", "ELSC68", "ELSC69", "ESCC63", "INSC92", "INSC93", "INSC94", "OCAOCANA2", "P_IL30", "PALCHINACOTA", "PALDONJUANA", "PALRAGONVALIA", "PAMC4", "PATC1", "PATC2", "PATC3", "PATIOS", "PLZ283B1", "SALC4", "SANC43", "SANC45", "SANC49", "SANC53", "SANC54", "SANC58", "SANC59", "SANOL25", "SEVC7", "SEVC16", "TARC1", "TIBTIBU2", "TOLPALERMO", "TOLTOLEDO"],
  LOURDES: ["BELC36", "GRAC2", "GRAC3", "PLZ283B1", "PATC2", "SEVC16"],
  MORALES: ["AGUC2", "AGUC5", "AGUC7", "GAMC1", "GAMC3"],
  MUTISCUA: ["PAMC2", "PAMC3", "PAMC4", "SEVC16", "TOLLABATECA"],
  OCAÑA: ["ABRC1", "ABRC2", "ABRC3", "AGUC4", "AGUC8", "CONSAL_CARMEN", "CONSAL_CONVE", "CONSAL_TEORA", "ELSC69", "ESCC63", "OCAGONZALES", "OCAIA15", "OCAIC25", "OCAILA5", "OCALA_PLAYA", "OCAOCANA1", "OCAOCANA2", "OCAOCANA3", "SEVC11", "TOLLABATECA"],
  PAILITAS: ["PELC2"],
  PAMPLONA: ["GRAC3", "PALCHINACOTA", "PALDONJUANA", "PALRAGONVALIA", "PAMC2", "PAMC3", "PAMC4", "SAMSAMORE", "SEVC4", "SEVC16", "TOLLABATECA", "TOLPALERMO", "TOLTOLEDO"],
  PAMPLONITA: ["GRAC2", "PALBOCHALEMA", "PALCHINACOTA", "PALDONJUANA", "PAMC2", "PAMC3", "PAMC4", "SALC1", "SANC54", "SEVC16", "TOLPALERMO", "TOLTOLEDO"],
  PELAYA: ["AGUC5", "AYAA31", "LAMATA", "PELC1", "PELC2"],
  "PUERTO SANTANDER": ["CULC2", "GRAC3", "INSC92", "PLZ263B1", "PLZ283B1", "SRQC2"],
  RAGONVALIA: ["ELSC68", "PALRAGONVALIA", "PATC2", "SEVC16"],
  "RÍO DE ORO": ["AGUC5", "BUTC2", "MONTESITOS", "OCAGONZALES", "OCAIA15", "OCALA_PLAYA", "OCAOCANA1", "OCAOCANA2", "OCAOCANA3"],
  "RÍO VIEJO": ["GAMC3"],
  SALAZAR: ["BELC36", "CACHIRA", "GRAC1", "GRAC3", "SALC1", "SALC2", "SALC3", "SALC4", "SEVC16"],
  "SAN ALBERTO": ["ABRC2", "ABRC3", "LOS_ALPES"],
  "SAN CALIXTO": ["CONSAL_TEORA", "OCAGONZALES", "OCALA_PLAYA", "SPAC2", "TARC1", "TARC2"],
  "SAN CAYETANO": ["ATAC86", "BELC23", "BELC29", "BELC30", "BELC36", "CORC1", "CORC2", "CORC3", "CULC1", "CULC2", "ELSC68", "GRAC1", "INSIL60", "INSC92", "PALDONJUANA", "PATC2", "SEVC5", "SEVC16"],
  "SAN MARTIN": ["ABRC3", "OCALA_PLAYA"],
  SANTIAGO: ["BELC36", "CORC1", "CORC2", "SALC3", "SEVC16"],
  SARDINATA: ["BELC28", "BELC31", "CAMC2", "CAMC3", "CLIL20", "CORC1", "CULC1", "CULC2", "ESCC63", "GRAC2", "IL70", "INSC94", "ORUC1", "SALC2", "SALC3", "SANC46", "SANC53", "SARC1", "SARC2", "SEVC7", "SRQC1", "SRQC2", "SRQC3", "TIBG11"],
  SILOS: ["PALRAGONVALIA", "PAMC2", "PAMC4", "SAMSAMORE", "SEVC16", "TOLLABATECA"],
  SIMITÍ: ["GAMC3"],
  TEORAMA: ["CONS65", "CONS95", "CONSAL_CARMEN", "CONSAL_CONVE", "CONSAL_SANPABLO", "CONSAL_TEORA", "OCAGONZALES", "OCAIC25", "SPAC2", "TARC1", "TARC2"],
  TIBÚ: ["CAMC1", "CAMC2", "CAMC3", "CONS95", "CONSAL_CARMEN", "ELSC68", "GABGABARRA", "ORUC1", "ORUC2", "PALBOCHALEMA", "PLZ263B1", "PLZ283B1", "PLZS20", "SALC2", "SARC2", "TARC1", "TIBCAMP2", "TIBG11", "TIBL422", "TIBO11", "TIBPOZOS", "TIBTIBU1", "TIBTIBU2", "TIBTIBU3", "ZULC3"],
  TOLEDO: ["ATAC86", "PALBOCHALEMA", "PAMC2", "PAMC4", "SAMSAMORE", "SEVC16", "TOLLABATECA", "TOLPALERMO", "TOLTOLEDO"],
  VALLEDUPAR: ["BELC30"],
  "VILLA CARO": ["CACHIRA", "ELSC68", "GRAC2", "GRAC3", "SALC2", "SEVC5", "SRQC2"],
  "VILLA DEL ROSARIO": ["AGUC4", "ATAC86", "ATAC87", "BELC21", "BELC22", "BELC23", "BELC28", "BELC29", "BELC30", "BELC31", "CAMC3", "CULC1", "ELSC68", "ELSC69", "ESCC61", "ESCC62", "ESCC63", "INSC91", "INSC92", "INSC93", "INSC94", "PATC1", "PATC2", "PATC3", "PLZ283B1", "SALC1", "SANC43", "SANC45", "SANC46", "SANC49", "SANC53", "SANC54", "SANC55", "SANC57", "SANC58", "SANC59", "SANIL15", "SANOL25", "SANOL35", "SANOL45", "SEVC3", "SEVC4", "SEVC5", "SEVC7", "SEVC11", "SEVC16", "SPAC2", "TARC2"]
};

// ==================== CENTRALIZACIÓN DE MAPEOS ====================

/**
 * Objeto centralizado que contiene todos los mapeos del sistema
 * Evita duplicación y facilita mantenimiento
 */
window.DESS_MAPPINGS = {
  // Mapeos de proyectos
  proyectos: {
    banco: PROYECTO_BANCO_MAPPING,
    completo: PROYECTO_COMPLETO_MAPPING
  },
  
  // Mapeos geográficos
  geografia: {
    municipios: MUNICIPIO_MAPPING,
    circuitos: MUNICIPIO_CIRCUITO_MAPPING
  },
  
  // Mapeos técnicos (se pueden agregar más aquí)
  tecnico: {
    // UC_MAPPING se cargará desde uc-mapping.js
    // Este será el lugar central para todos los mapeos técnicos
  },

  // Metadatos
  metadata: {
    version: '2.0.0',
    lastUpdated: new Date().toISOString(),
    totalProyectos: Object.keys(PROYECTO_COMPLETO_MAPPING).length,
    totalMunicipios: Object.keys(MUNICIPIO_MAPPING).length,
    totalCircuitos: Object.keys(MUNICIPIO_CIRCUITO_MAPPING).length
  }
};

// ==================== MANTENER COMPATIBILIDAD ====================
// Estas variables globales se mantienen para compatibilidad con código existente
// Pero ahora apuntan al objeto centralizado

window.PROYECTO_BANCO_MAPPING = DESS_MAPPINGS.proyectos.banco;
window.PROYECTO_COMPLETO_MAPPING = DESS_MAPPINGS.proyectos.completo;
window.MUNICIPIO_MAPPING = DESS_MAPPINGS.geografia.municipios;
window.MUNICIPIO_CIRCUITO_MAPPING = DESS_MAPPINGS.geografia.circuitos;

// ==================== UTILIDADES DE MAPEO ====================

/**
 * Clase para gestionar mapeos de manera centralizada
 */
class MappingManager {
  /**
   * Obtiene datos de un mapeo específico
   */
  static getData(category, subcategory = null, key = null) {
    let data = window.DESS_MAPPINGS[category];
    
    if (!data) {
      console.warn(`⚠️ Categoría de mapeo '${category}' no encontrada`);
      return null;
    }
    
    if (subcategory) {
      data = data[subcategory];
      if (!data) {
        console.warn(`⚠️ Subcategoría '${subcategory}' no encontrada en '${category}'`);
        return null;
      }
    }
    
    if (key) {
      return data[key] || null;
    }
    
    return data;
  }

  /**
   * Busca en un mapeo con filtros
   */
  static search(category, subcategory, searchField, searchValue) {
    const data = this.getData(category, subcategory);
    if (!data) return [];

    return Object.entries(data).filter(([key, item]) => {
      if (typeof item === 'object' && item[searchField]) {
        return item[searchField] === searchValue;
      }
      return false;
    }).map(([key, item]) => ({ key, ...item }));
  }

  /**
   * Obtiene estadísticas de los mapeos
   */
  static getStats() {
    return window.DESS_MAPPINGS.metadata;
  }

  /**
   * Valida integridad de mapeos
   */
  static validateMappings() {
    const issues = [];
    const stats = this.getStats();
    
    // Verificar que los mapeos principales existen
    const requiredMappings = [
      ['proyectos', 'completo'],
      ['geografia', 'municipios'],
      ['geografia', 'circuitos']
    ];

    requiredMappings.forEach(([cat, subcat]) => {
      const data = this.getData(cat, subcat);
      if (!data || Object.keys(data).length === 0) {
        issues.push(`Mapeo vacío: ${cat}.${subcat}`);
      }
    });

    console.log('🔍 Validación de mapeos:', {
      issues: issues.length,
      details: issues,
      stats
    });

    return {
      isValid: issues.length === 0,
      issues,
      stats
    };
  }
}

// Exponer globalmente
window.MappingManager = MappingManager;

// ==================== MAPPINGS ADICIONALES ====================

// Mapeo de estructuras (definición básica)
const ESTRUCTURA_MAPPING = {
  // Mapeo básico para autocompletado de estructuras
  "Poste": ["N1", "N2", "N3", "N4"],
  "Estructura": ["N3", "N4"],
  "Torre": ["N4"],
  "Torrecilla": ["N3"]
};

// Mapeo de códigos de conductores
const CODIGO_CONDUCTOR_MAPPING = {
  // Conductores comunes en el sistema
  "ACSR": ["2/0", "4/0", "266.8", "336.4", "477", "556.5"],
  "AAAC": ["2/0", "4/0", "266.8", "336.4"],
  "ACAR": ["2/0", "4/0", "266.8"],
  "Cobre": ["2", "1/0", "2/0", "4/0"]
};

// ==================== INICIALIZACIÓN ====================

/**
 * Función para inicializar los mapeos y validar integridad
 */
function initializeDataMappings() {
  // Validar mapeos
  const validation = MappingManager.validateMappings();
  
  if (!validation.isValid) {
    console.error('❌ Problemas en mapeos:', validation.issues);
  }
  
  // Exponer mapeos globalmente
  // UC_MAPPING debería estar disponible desde uc-mapping.js
  if (typeof UC_MAPPING !== 'undefined' && UC_MAPPING) {
    window.UcMapping = UC_MAPPING;
    window.UC_MAPPING = UC_MAPPING; // También como UC_MAPPING para compatibilidad
    console.log('✅ UC_MAPPING cargado correctamente');
  } else {
    console.warn('⚠️ UC_MAPPING no está disponible. Verificar que uc-mapping.js se cargue antes.');
    window.UcMapping = {};
    window.UC_MAPPING = {};
  }
  
  window.ESTRUCTURA_MAPPING = ESTRUCTURA_MAPPING;
  window.CODIGO_CONDUCTOR_MAPPING = CODIGO_CONDUCTOR_MAPPING;
  window.DESS_MAPPINGS = DESS_MAPPINGS;
  
  console.log('✅ Mapeos inicializados correctamente');
  
  return validation;
}

// Auto-inicializar cuando se carga el script
document.addEventListener('DOMContentLoaded', () => {
  initializeDataMappings();
});

// ==================== EXPORTACIÓN PARA MÓDULOS ====================

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DESS_MAPPINGS: window.DESS_MAPPINGS,
    MappingManager,
    PROYECTO_COMPLETO_MAPPING,
    MappingManager,
    PROYECTO_BANCO_MAPPING,
    PROYECTO_COMPLETO_MAPPING,
    MUNICIPIO_MAPPING,
    MUNICIPIO_CIRCUITO_MAPPING,
    initializeDataMappings
  };
}
