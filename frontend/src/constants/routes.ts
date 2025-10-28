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
  PEDIDOS_MODIFICAR: (id: string | number) => `/pedidos/modificar/${id}`,
  TORTAS_MEDIDAS: (tortaId: string | number) => `/tortas/${tortaId}/medidas`,
  TORTAS_MEDIDA_DETALLE: (tortaId: string | number, medidaId: string | number) => 
    `/tortas/${tortaId}/medidas/${medidaId}`,
} as const;
