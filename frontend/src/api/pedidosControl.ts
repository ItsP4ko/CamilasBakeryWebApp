import httpClient from './http';

// ============================================
// TYPES
// ============================================

interface AgregarDetalleDTO {
  IdMedida: number;
  Cantidad: number;
}

interface ModificarDetalleDTO {
  Cantidad: number;
}

interface AgregarExtraDTO {
  IdCostoExtra: number;
  Cantidad: number;
  Nota?: string;
  PrecioVentaManual?: number | null;
}

interface ModificarExtraDTO {
  Cantidad?: number;
  Nota?: string;
}

interface AgregarIngredienteExtraDTO {
  IdIngrediente: number;
  Cantidad: number;
  Nota?: string;
  PrecioVentaManual?: number | null;
}

interface ModificarIngredienteExtraDTO {
  Cantidad?: number;
  Nota?: string;
}

// ============================================
// MAPPERS: camelCase → PascalCase
// ============================================

const mapAgregarDetalle = (data: { idMedida: number; cantidad: number }): AgregarDetalleDTO => ({
  IdMedida: data.idMedida,
  Cantidad: data.cantidad,
});

const mapModificarDetalle = (data: { cantidad: number }): ModificarDetalleDTO => ({
  Cantidad: data.cantidad,
});

const mapAgregarExtra = (data: { idCostoExtra: number; cantidad: number; nota?: string; precioVentaManual?: number | null }): AgregarExtraDTO => ({
  IdCostoExtra: data.idCostoExtra,
  Cantidad: data.cantidad,
  Nota: data.nota,
  PrecioVentaManual: data.precioVentaManual ?? undefined,
});

const mapModificarExtra = (data: { cantidad?: number; nota?: string }): ModificarExtraDTO => ({
  Cantidad: data.cantidad,
  Nota: data.nota,
});

const mapAgregarIngredienteExtra = (data: { idIngrediente: number; cantidad: number; nota?: string; precioVentaManual?: number | null }): AgregarIngredienteExtraDTO => ({
  IdIngrediente: data.idIngrediente,
  Cantidad: data.cantidad,
  Nota: data.nota,
  PrecioVentaManual: data.precioVentaManual ?? undefined,
});

const mapModificarIngredienteExtra = (data: { cantidad?: number; nota?: string }): ModificarIngredienteExtraDTO => ({
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
export const agregarDetallePedido = async (
  pedidoId: number,
  data: { idMedida: number; cantidad: number }
) => {
  const payload = mapAgregarDetalle(data);
  const response = await httpClient.post(
    `/api/PedidosControl/${pedidoId}/detalle`,
    payload
  );
  return response.data;
};

/**
 * Modificar cantidad de un detalle
 * PATCH /api/PedidosControl/detalle/{detallePedidoId}
 */
export const modificarDetallePedido = async (
  detallePedidoId: number,
  data: { cantidad: number }
) => {
  const payload = mapModificarDetalle(data);
  const response = await httpClient.patch(
    `/api/PedidosControl/detalle/${detallePedidoId}`,
    payload
  );
  return response.data;
};

/**
 * Eliminar un detalle del pedido
 * DELETE /api/PedidosControl/detalle/{detallePedidoId}
 */
export const eliminarDetallePedido = async (detallePedidoId: number) => {
  const response = await httpClient.delete(`/api/PedidosControl/detalle/${detallePedidoId}`);
  return response.data;
};

/**
 * Agregar un extra a un detalle
 * POST /api/PedidosControl/detalle/{detallePedidoId}/extras
 */
export const agregarExtra = async (
  detallePedidoId: number,
  data: { idCostoExtra: number; cantidad: number; nota?: string; precioVentaManual?: number | null }
) => {
  const response = await httpClient.post(
    `/api/PedidosControl/detalle/${detallePedidoId}/extras`,
    mapAgregarExtra(data)
  );
  return response.data;
};

/**
 * Modificar un extra
 * PATCH /api/PedidosControl/extras/{extraId}
 */
export const modificarExtra = async (
  extraId: number,
  data: { cantidad?: number; nota?: string }
) => {
  const response = await httpClient.patch(
    `/api/PedidosControl/extras/${extraId}`,
    mapModificarExtra(data)
  );
  return response.data;
};

/**
 * Eliminar un extra
 * DELETE /api/PedidosControl/extras/{extraId}
 */
export const eliminarExtra = async (extraId: number) => {
  const response = await httpClient.delete(`/api/PedidosControl/extras/${extraId}`);
  return response.data;
};

/**
 * Agregar un ingrediente extra a un detalle
 * POST /api/PedidosControl/detalle/{detalleId}/ingredientes-extras
 */
export const agregarIngredienteExtra = async (
  detallePedidoId: number,
  data: { idIngrediente: number; cantidad: number; nota?: string; precioVentaManual?: number | null }
) => {
  const response = await httpClient.post(
    `/api/PedidosControl/detalle/${detallePedidoId}/ingredientes-extras`,
    mapAgregarIngredienteExtra(data)
  );
  return response.data;
};

/**
 * Modificar un ingrediente extra
 * PATCH /api/PedidosControl/ingredientes-extras/{ingredienteExtraId}
 */
export const modificarIngredienteExtra = async (
  ingredienteExtraId: number,
  data: { cantidad?: number; nota?: string }
) => {
  const response = await httpClient.patch(
    `/api/PedidosControl/ingredientes-extras/${ingredienteExtraId}`,
    mapModificarIngredienteExtra(data)
  );
  return response.data;
};

/**
 * Eliminar un ingrediente extra
 * DELETE /api/PedidosControl/ingredientes-extras/{ingredienteExtraId}
 */
export const eliminarIngredienteExtra = async (ingredienteExtraId: number) => {
  const response = await httpClient.delete(
    `/api/PedidosControl/ingredientes-extras/${ingredienteExtraId}`
  );
  return response.data;
};
