import api from './http';
export const getTortas = async () => {
    const response = await api.get('/api/Tortas');
    const tortasArray = Array.isArray(response.data) ? response.data : [];
    const mapped = tortasArray.map((torta) => ({
        IdTorta: torta.IdTorta ?? torta.idTorta,
        Nombre: torta.Nombre ?? torta.nombre,
        Estado: torta.Estado ?? torta.estado ?? '',
        MultiplicadorGanancia: torta.MultiplicadorGanancia ?? torta.multiplicadorGanancia ?? 2.7,
        PrecioPromedio: torta.PrecioPromedio ?? torta.precioPromedio ?? 0,
        CantidadMedidas: torta.CantidadMedidas ?? torta.cantidadMedidas ?? 0,
        Medidas: (torta.Medidas ?? torta.medidas ?? []).map((m) => ({
            IdMedida: m.IdMedida ?? m.idMedida,
            IdTorta: m.IdTorta ?? m.idTorta,
            Tamano: m.Tamano ?? m.tamano,
            Estado: m.Estado ?? m.estado ?? '',
            MultiplicadorGanancia: m.MultiplicadorGanancia ?? m.multiplicadorGanancia ?? 2.7,
            PrecioVentaManual: m.PrecioVentaManual ?? m.precioVentaManual ?? null,
            CostoIngredientes: m.CostoIngredientes ?? m.costoIngredientes ?? 0,
            CostoExtras: m.CostoExtras ?? m.costoExtras ?? 0,
            CostoTotal: m.CostoTotal ?? m.costoTotal ?? 0,
            PrecioSugerido: m.PrecioSugerido ?? m.precioSugerido ?? 0,
            PrecioVenta: m.PrecioVenta ?? m.precioVenta ?? 0,
            MultiplicadorReal: m.MultiplicadorReal ?? m.multiplicadorReal ?? 0,
            Ganancia: m.Ganancia ?? m.ganancia ?? 0,
        })),
    }));
    return mapped;
};
export const getCantidadTortas = async () => {
    const tortas = await getTortas();
    return tortas.length;
};
// CRUD Tortas
export const createTorta = async (nombre, multiplicadorGanancia) => {
    const response = await api.post('/api/Tortas', {
        Nombre: nombre,
        MultiplicadorGanancia: multiplicadorGanancia
    });
    return response.data;
};
export const updateTorta = async (id, nombre, multiplicadorGanancia) => {
    await api.put(`/api/Tortas/${id}`, {
        Nombre: nombre,
        MultiplicadorGanancia: multiplicadorGanancia
    });
};
export const deleteTorta = async (id) => {
    await api.delete(`/api/Tortas/${id}`);
};
// CRUD Medidas
export const getMedida = async (medidaId) => {
    const response = await api.get(`/api/Tortas/medidas/${medidaId}`);
    return response.data;
};
export const createMedida = async (tortaId, tamano) => {
    const response = await api.post(`/api/Tortas/${tortaId}/medidas`, JSON.stringify(tamano), {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};
export const updateMedida = async (medidaId, tamano) => {
    await api.put(`/api/Tortas/medidas/${medidaId}`, JSON.stringify(tamano), {
        headers: { 'Content-Type': 'application/json' }
    });
};
export const deleteMedida = async (medidaId) => {
    await api.delete(`/api/Tortas/medidas/${medidaId}`);
};
export const updatePrecioVentaMedida = async (medidaId, precioVentaManual) => {
    await api.put(`/api/Tortas/medidas/${medidaId}/precio`, {
        PrecioVentaManual: precioVentaManual
    });
};
// Ingredientes de Medida
export const addIngredienteToMedida = async (medidaId, ingredienteId, cantidad, unidad) => {
    await api.post(`/api/Tortas/medidas/${medidaId}/ingredientes`, {
        IngredienteId: ingredienteId,
        Cantidad: cantidad,
        Unidad: unidad
    });
};
export const updateIngredienteMedida = async (tortaIngredienteId, cantidad, unidad) => {
    await api.put(`/api/Tortas/ingredientes/${tortaIngredienteId}`, {
        Cantidad: cantidad,
        Unidad: unidad
    });
};
export const removeIngredienteFromMedida = async (tortaIngredienteId) => {
    await api.delete(`/api/Tortas/ingredientes/${tortaIngredienteId}`);
};
// Costos Extra de Medida
export const addCostoExtraToMedida = async (medidaId, costoExtraId, cantidadUsada) => {
    await api.post(`/api/Tortas/medidas/${medidaId}/costos-extra`, {
        CostoExtraId: costoExtraId,
        cantidad: cantidadUsada
    });
};
export const removeCostoExtraFromMedida = async (tortaCostoExtraId) => {
    await api.delete(`/api/Tortas/costos-extra/${tortaCostoExtraId}`);
};
