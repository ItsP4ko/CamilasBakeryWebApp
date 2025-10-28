/**
 * Endpoints de la API
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/Auth/Login',
    GOOGLE_LOGIN: '/api/Auth/GoogleLogin',
  },
  
  // Tortas
  TORTAS: '/api/Tortas',
  
  // Ingredientes
  INGREDIENTES: '/api/Ingredientes',
  
  // Costos Extra
  COSTOS_EXTRA: '/api/CostosExtra',
  
  // Pedidos
  PEDIDOS: '/api/Pedidos',
  
  // Stock
  STOCK: '/api/Stock',
  
  // Medidas
  MEDIDAS: '/api/MedidasDetalle',
  
  // Pedido Seleccion
  PEDIDO_SELECCION: '/api/PedidoSeleccion',
} as const;
