import httpClient from './http';
// ============================================
// MAPPERS: camelCase → PascalCase
// ============================================
const mapAgregarDetalle = (data) => ({
    IdMedida: data.idMedida,
    Cantidad: data.cantidad,
});
const mapModificarDetalle = (data) => ({
    Cantidad: data.cantidad,
});
const mapAgregarExtra = (data) => ({
    IdCostoExtra: data.idCostoExtra,
    Cantidad: data.cantidad,
    Nota: data.nota,
});
const mapModificarExtra = (data) => ({
    Cantidad: data.cantidad,
    Nota: data.nota,
});
const mapAgregarIngredienteExtra = (data) => ({
    IdIngrediente: data.idIngrediente,
    Cantidad: data.cantidad,
    Nota: data.nota,
});
const mapModificarIngredienteExtra = (data) => ({
    Cantidad: data.cantidad,
    Nota: data.nota,
});
// ============================================
// API FUNCTIONS
// ============================================
/**
 * Agregar un detalle (producto) al pedido
 * POST /api/PedidosControl/{pedidoId}/detalle
 */
export const agregarDetallePedido = async (pedidoId, data) => {
    const payload = mapAgregarDetalle(data);
    const response = await httpClient.post(`/api/PedidosControl/${pedidoId}/detalle`, payload);
    return response.data;
};
/**
 * Modificar cantidad de un detalle
 * PATCH /api/PedidosControl/detalle/{detallePedidoId}
 */
export const modificarDetallePedido = async (detallePedidoId, data) => {
    const payload = mapModificarDetalle(data);
    const response = await httpClient.patch(`/api/PedidosControl/detalle/${detallePedidoId}`, payload);
    return response.data;
};
/**
 * Eliminar un detalle del pedido
 * DELETE /api/PedidosControl/detalle/{detallePedidoId}
 */
export const eliminarDetallePedido = async (detallePedidoId) => {
    const response = await httpClient.delete(`/api/PedidosControl/detalle/${detallePedidoId}`);
    return response.data;
};
/**
 * Agregar un extra a un detalle
 * POST /api/PedidosControl/detalle/{detallePedidoId}/extras
 */
export const agregarExtra = async (detallePedidoId, data) => {
    const response = await httpClient.post(`/api/PedidosControl/detalle/${detallePedidoId}/extras`, mapAgregarExtra(data));
    return response.data;
};
/**
 * Modificar un extra
 * PATCH /api/PedidosControl/extras/{extraId}
 */
export const modificarExtra = async (extraId, data) => {
    const response = await httpClient.patch(`/api/PedidosControl/extras/${extraId}`, mapModificarExtra(data));
    return response.data;
};
/**
 * Eliminar un extra
 * DELETE /api/PedidosControl/extras/{extraId}
 */
export const eliminarExtra = async (extraId) => {
    const response = await httpClient.delete(`/api/PedidosControl/extras/${extraId}`);
    return response.data;
};
/**
 * Agregar un ingrediente extra a un detalle
 * POST /api/PedidosControl/detalle/{detalleId}/ingredientes-extras
 */
export const agregarIngredienteExtra = async (detallePedidoId, data) => {
    const response = await httpClient.post(`/api/PedidosControl/detalle/${detallePedidoId}/ingredientes-extras`, mapAgregarIngredienteExtra(data));
    return response.data;
};
/**
 * Modificar un ingrediente extra
 * PATCH /api/PedidosControl/ingredientes-extras/{ingredienteExtraId}
 */
export const modificarIngredienteExtra = async (ingredienteExtraId, data) => {
    const response = await httpClient.patch(`/api/PedidosControl/ingredientes-extras/${ingredienteExtraId}`, mapModificarIngredienteExtra(data));
    return response.data;
};
/**
 * Eliminar un ingrediente extra
 * DELETE /api/PedidosControl/ingredientes-extras/{ingredienteExtraId}
 */
export const eliminarIngredienteExtra = async (ingredienteExtraId) => {
    const response = await httpClient.delete(`/api/PedidosControl/ingredientes-extras/${ingredienteExtraId}`);
    return response.data;
};
