// src/api/pedidos.ts
import api from './http';
// Helper function para mapear datos del backend
const mapPedidoFromBackend = (data) => ({
    idPedido: data.IdPedido,
    idCliente: data.IdCliente,
    nombreCliente: data.NombreCliente,
    telefonoCliente: data.TelefonoCliente,
    fecha: data.Fecha,
    total: data.Total,
    ganancia: data.Ganancia,
    ingredientes: data.Ingredientes,
    costoExtras: data.CostoExtras,
    nota: data.Nota || '',
    precioExtra: data.PrecioExtra,
    metodoDePago: data.MetodoDePago,
    estado: data.Estado,
    detallePedidos: (data.DetallePedidos || []).map((detalle) => ({
        idDetallePedido: detalle.IdDetallePedido,
        idPedido: detalle.IdPedido,
        idMedida: detalle.IdMedida,
        cantidad: detalle.Cantidad,
        nombreTorta: detalle.NombreTorta,
        tamanoMedida: detalle.TamanoMedida,
        totalProducto: detalle.TotalProducto,
        precioMomentoMedida: detalle.PrecioMomentoMedida,
        extras: (detalle.Extras || []).map((extra) => ({
            idExtras: extra.IdExtras,
            idDetallePedido: extra.IdDetallePedido,
            idCostoExtra: extra.IdCostoExtra,
            nombreCostoExtra: extra.NombreCostoExtra,
            nota: extra.Nota || '',
            precioMomento: extra.PrecioMomento,
            cantidad: extra.Cantidad,
            precioUnitario: extra.PrecioUnitario,
        })),
        ingredientesExtras: (detalle.IngredientesExtras || []).map((ing) => ({
            idIngredienteExtra: ing.IdIngredienteExtra,
            idDetallePedido: ing.IdDetallePedido,
            idIngrediente: ing.IdIngrediente,
            nombreIngrediente: ing.NombreIngrediente,
            nota: ing.Nota || '',
            precioMomento: ing.PrecioMomento,
            cantidad: ing.Cantidad,
            unidadCompra: ing.UnidadCompra,
        })),
    })),
});
// Obtener todos los pedidos (resumen) con paginación
export const getPedidos = async (pageNumber = 1, pageSize = 100) => {
    const response = await api.get(`/api/Pedidos?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    // El backend puede devolver con PascalCase o camelCase
    const pagedData = response.data;
    // Obtener items con ambos formatos posibles
    const itemsArray = pagedData.items || pagedData.Items || [];
    const totalCount = pagedData.totalCount || pagedData.TotalCount || 0;
    const currentPageNumber = pagedData.pageNumber || pagedData.PageNumber || pageNumber;
    const currentPageSize = pagedData.pageSize || pagedData.PageSize || pageSize;
    // Calcular totalPages si no viene del backend
    const totalPages = pagedData.totalPages || pagedData.TotalPages || Math.ceil(totalCount / currentPageSize);
    return {
        items: itemsArray.map((pedido) => ({
            idPedido: pedido.IdPedido || pedido.idPedido,
            nombreCliente: pedido.NombreCliente || pedido.nombreCliente,
            fecha: pedido.Fecha || pedido.fecha,
            total: pedido.Total || pedido.total,
            metodoDePago: pedido.MetodoDePago || pedido.metodoDePago,
            estado: pedido.Estado || pedido.estado,
        })),
        totalCount: totalCount,
        pageNumber: currentPageNumber,
        pageSize: currentPageSize,
        totalPages: totalPages,
    };
};
// Obtener pedido por ID
export const getPedidoById = async (id) => {
    const response = await api.get(`/api/Pedidos/${id}`);
    return mapPedidoFromBackend(response.data);
};
export const getPedidosConFiltros = async (filtros = {}) => {
    const params = new URLSearchParams();
    // El backend usa PascalCase para los query params
    if (filtros.nombreCliente)
        params.append('NombreCliente', filtros.nombreCliente);
    if (filtros.estado)
        params.append('Estado', filtros.estado);
    if (filtros.fechaInicio)
        params.append('FechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin)
        params.append('FechaFin', filtros.fechaFin);
    if (filtros.metodoPago)
        params.append('MetodoDePago', filtros.metodoPago);
    if (filtros.montoMinimo !== undefined)
        params.append('MontoMinimo', filtros.montoMinimo.toString());
    if (filtros.montoMaximo !== undefined)
        params.append('MontoMaximo', filtros.montoMaximo.toString());
    // ⚠️ Este endpoint NO soporta paginación, retorna todos los resultados
    const fullUrl = `/api/Pedidos/filtro?${params.toString()}`;
    const response = await api.get(fullUrl);
    // ⚠️ El endpoint /filtro retorna un ARRAY directamente, no un PagedResult
    // Necesitamos convertirlo a PagedResult manualmente
    const pedidosArray = Array.isArray(response.data) ? response.data : [];
    const items = pedidosArray.map((pedido) => ({
        idPedido: pedido.IdPedido || pedido.idPedido,
        nombreCliente: pedido.NombreCliente || pedido.nombreCliente,
        fecha: pedido.Fecha || pedido.fecha,
        total: pedido.Total || pedido.total,
        ganancia: pedido.Ganancia || pedido.ganancia,
        metodoDePago: pedido.MetodoDePago || pedido.metodoDePago,
        estado: pedido.Estado || pedido.estado,
    }));
    return {
        items,
        totalCount: items.length,
        pageNumber: 1,
        pageSize: items.length,
        totalPages: 1,
    };
};
// Buscar pedidos por nombre de cliente (DEPRECATED - usa getPedidosConFiltros)
export const getPedidosByNombre = async (nombre) => {
    const response = await api.get(`/api/Pedidos/nombre/${nombre}`);
    // El API devuelve un array de pedidos
    const pedidosArray = Array.isArray(response.data) ? response.data : [];
    return pedidosArray.map(mapPedidoFromBackend);
};
// Buscar pedidos por fecha hasta
export const getPedidosByFecha = async (fecha) => {
    const response = await api.get(`/api/Pedidos/FechaHasta/${fecha}`);
    const pedidosArray = Array.isArray(response.data) ? response.data : [];
    return pedidosArray.map(mapPedidoFromBackend);
};
// Buscar pedidos por fecha hasta pendientes
export const getPedidosPendientesHoy = async () => {
    try {
        const hoy = new Date();
        const diaSemana = hoy.getDay(); // 0=Domingo, 1=Lunes, 2=Martes, ..., 6=Sábado
        // Días que faltan hasta el domingo (incluyendo hoy)
        let diasHastaDomingo;
        if (diaSemana === 0) {
            // Si hoy es domingo, solo cuenta hoy (1 día)
            diasHastaDomingo = 1;
        }
        else {
            diasHastaDomingo = 16 - diaSemana; // modificar el 16 al numero 8 para semana
        }
        const response = await api.get(`/api/Pedidos/FechaHasta/${diasHastaDomingo}`);
        // Validar si la respuesta es un array
        if (!Array.isArray(response.data)) {
            return 0;
        }
        const pedidos = response.data.map(mapPedidoFromBackend);
        const count = pedidos.filter(p => p.estado.toLowerCase() !== 'entregado' &&
            p.estado.toLowerCase() !== 'cancelado').length;
        return count;
    }
    catch (error) {
        if (error.response?.status === 404) {
            return 0;
        }
        return 0;
    }
};
// Buscar pedidos por fecha
export const getPedidosByFechaRango = async (fechaInicio, fechaFin) => {
    const response = await api.get(`/api/Pedidos/FechaRango/${fechaInicio}/${fechaFin}`);
    const pedidosArray = Array.isArray(response.data) ? response.data : [];
    return pedidosArray.map(mapPedidoFromBackend);
};
// Buscar pedidos por estado
export const getPedidosByEstado = async (estado) => {
    const response = await api.get(`/api/Pedidos/estado/${estado}`);
    const pedidosArray = Array.isArray(response.data) ? response.data : [];
    return pedidosArray.map(mapPedidoFromBackend);
};
export const getPedidoByMetodoDePago = async (metodoDePago) => {
    const response = await api.get(`/api/Pedidos/MetodoDePago/${metodoDePago}`);
    const pedidosArray = Array.isArray(response.data) ? response.data : [];
    return pedidosArray.map(mapPedidoFromBackend);
};
export const calcularTotalPedido = async (id) => {
    const response = await api.get(`/api/Pedidos/${id}/calcularTotal`);
    return response.data;
};
export const getTotalVentasFecha = async (fechaInicio, fechaFin) => {
    const response = await api.get(`/api/Pedidos/TotalVentasFecha/${fechaInicio}/${fechaFin}`);
    return response.data;
};
// Crear pedido
export const crearPedido = async (pedido) => {
    const pedidoBackend = {
        IdCliente: pedido.idCliente,
        NombreCliente: pedido.nombreCliente,
        TelefonoCliente: pedido.telefonoCliente,
        Fecha: pedido.fecha, // El backend espera string en formato 'YYYY-MM-DD' y lo convierte a DateOnly
        Nota: pedido.nota || '',
        PrecioExtra: pedido.precioExtra || 0,
        MetodoDePago: pedido.metodoDePago,
        Estado: 'Pendiente',
        DetallePedidos: pedido.detallePedidos.map(detalle => ({
            IdMedida: detalle.idMedida,
            Cantidad: detalle.cantidad,
            Extras: (detalle.extras || []).map(extra => ({
                IdCostoExtra: extra.idCostoExtra,
                Nota: extra.nota || '',
                Cantidad: extra.cantidad,
                PrecioVentaManual: extra.precioVentaManual ?? undefined
            })),
            IngredientesExtras: (detalle.ingredientesExtras || []).map(ing => ({
                IdIngrediente: ing.idIngrediente,
                Nota: ing.nota || '',
                Cantidad: ing.cantidad,
                PrecioVentaManual: ing.precioVentaManual ?? undefined
            }))
        }))
    };
    const response = await api.post('/api/Pedidos', pedidoBackend);
    return mapPedidoFromBackend(response.data);
};
// Actualizar Pedido
export const actualizarPedido = async (id, pedido) => {
    await api.patch(`/api/Pedidos/${id}`, pedido);
};
// Actualizar estado
export const actualizarEstadoPedido = async (id, estado) => {
    await api.patch(`/api/Pedidos/${id}/estado`, JSON.stringify(estado), {
        headers: { "Content-Type": "application/json" },
    });
};
// actualizar pedido rapido 
export const actualizarPedidoEncabezado = async (id, data) => {
    await api.patch(`/api/Pedidos/${id}`, data, {
        headers: { "Content-Type": "application/json" },
    });
};
// Eliminar pedido
export const eliminarPedido = async (id) => {
    await api.delete(`/api/Pedidos/${id}`);
};
// Ganancias del mes 
export const getGananciaMensual = async () => {
    try {
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
            .toISOString()
            .split("T")[0];
        const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
            .toISOString()
            .split("T")[0];
        const response = await api.get(`/api/Pedidos/FechaRango/${inicioMes}/${finMes}`);
        const pedidosArray = Array.isArray(response.data) ? response.data : [];
        const totalGanancia = pedidosArray
            .filter((pedido) => pedido.Estado?.toLowerCase() === "entregado")
            .reduce((acc, pedido) => acc + (pedido.Ganancia ?? 0), 0);
        return totalGanancia;
    }
    catch (error) {
        console.error("Error al calcular la ganancia mensual:", error);
        return 0;
    }
};
// Contar pedidos entregados del mes
export const getPedidosEntregadosMensual = async () => {
    try {
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
            .toISOString()
            .split("T")[0];
        const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
            .toISOString()
            .split("T")[0];
        const response = await api.get(`/api/Pedidos/FechaRango/${inicioMes}/${finMes}`);
        const pedidosArray = Array.isArray(response.data) ? response.data : [];
        const cantidadEntregados = pedidosArray
            .filter((pedido) => pedido.Estado?.toLowerCase() === "entregado")
            .length;
        return cantidadEntregados;
    }
    catch (error) {
        console.error("Error al contar pedidos entregados:", error);
        return 0;
    }
};
