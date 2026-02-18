/**
 * Rutas de la aplicación
 */
export const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    TORTAS: '/tortas',
    INGREDIENTES: '/ingredientes',
    COSTOS_EXTRA: '/costos-extra',
    REPORTES: '/reportes',
    PEDIDOS: '/Pedidos',
    PEDIDOS_CREAR: '/pedidos/crear',
    PEDIDOS_MODIFICAR: (id) => `/pedidos/modificar/${id}`,
    TORTAS_MEDIDAS: (tortaId) => `/tortas/${tortaId}/medidas`,
    TORTAS_MEDIDA_DETALLE: (tortaId, medidaId) => `/tortas/${tortaId}/medidas/${medidaId}`,
};
