/**
 * Types para Reportes
 */
// 9. Reporte de Stock
export var NivelStockEnum;
(function (NivelStockEnum) {
    NivelStockEnum[NivelStockEnum["Critico"] = 0] = "Critico";
    NivelStockEnum[NivelStockEnum["Bajo"] = 1] = "Bajo";
    NivelStockEnum[NivelStockEnum["Medio"] = 2] = "Medio";
    NivelStockEnum[NivelStockEnum["Alto"] = 3] = "Alto";
})(NivelStockEnum || (NivelStockEnum = {}));
