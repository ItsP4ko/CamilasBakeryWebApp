import api from './http';
export const getCostosExtra = async (page = 1, pageSize = 20) => {
    const response = await api.get(`/api/CostosExtra?page=${page}&pageSize=${pageSize}`);
    const data = response.data;
    return {
        items: (data.items || data.Items || []).map((costo) => ({
            idCostoExtra: costo.IdCostoExtra || costo.idCostoExtra,
            nombre: costo.Nombre || costo.nombre,
            precioUnitario: costo.PrecioUnitario || costo.precioUnitario,
            nota: costo.Nota || costo.nota,
            stock: costo.Stock ?? costo.stock ?? null
        })),
        totalCount: data.totalCount ?? data.TotalCount ?? 0,
        pageNumber: data.pageNumber ?? data.PageNumber ?? 1,
        pageSize: data.pageSize ?? data.PageSize ?? 20,
        totalPages: data.totalPages ?? data.TotalPages ?? 1
    };
};
export const createCostoExtra = async (createCostoExtra) => {
    const response = await api.post(`/api/CostosExtra`, createCostoExtra);
    // Mapear la respuesta del backend (PascalCase) al formato del frontend (camelCase)
    const data = response.data;
    return {
        idCostoExtra: data.IdCostoExtra || data.idCostoExtra,
        nombre: data.Nombre || data.nombre,
        precioUnitario: data.PrecioUnitario || data.precioUnitario,
        nota: data.Nota || data.nota || null,
        stock: data.Stock ?? data.stock ?? null
    };
};
//eliminar ingrediente
export const eliminarCostoExtra = async (id) => {
    await api.delete(`/api/CostosExtra/${id}`);
};
// Actualizar costo extra (precio y/o stock)
export const updateCostoExtra = async (id, data) => {
    await api.put(`/api/CostosExtra/${id}`, data);
};
