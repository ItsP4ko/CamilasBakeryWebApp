// src/types/pedidos.ts

export interface Extra {
  idExtras: number;
  idDetallePedido: number;
  idCostoExtra: number;
  nombreCostoExtra: string;
  nota: string;
  precioMomento: number;
  cantidad: number;
  precioUnitario: number;
}

export interface IngredienteExtra {
  idIngredienteExtra: number;
  idDetallePedido: number;
  idIngrediente: number;
  nombreIngrediente: string;
  nota: string;
  precioMomento: number;
  cantidad: number;
  unidadCompra: string;
}

export interface DetallePedido {
  idDetallePedido: number;
  idPedido: number;
  idMedida: number;
  cantidad: number;
  nombreTorta: string;
  tamanoMedida: string;
  precioMomentoMedida: number;
  totalProducto: number
  extras: Extra[];
  ingredientesExtras: IngredienteExtra[];
}

export interface Pedido {
  idPedido: number;
  idCliente: number;
  nombreCliente: string;
  telefonoCliente: string;
  fecha: string; // ISO date string
  total: number;
  ganancia: number;
  ingredientes: number;
  costoExtras: number;
  nota: string;
  precioExtra: number;
  metodoDePago: string;
  estado: string;
  detallePedidos: DetallePedido[];
}

// Tipos auxiliares para listas y formularios
export interface PedidoResumen {
  idPedido: number;
  nombreCliente: string;
  fecha: string;
  total: number;
  ganancia?: number;
  metodoDePago: string,
  estado: string;
}

// Tipo para respuesta paginada
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CrearPedidoDTO {
  idCliente?: number;
  nombreCliente: string;
  telefonoCliente: string;
  fecha: string;
  nota?: string;
  precioExtra?: number;
  metodoDePago: string;
  detallePedidos: {
    idMedida: number;
    cantidad: number;
    extras?: { idCostoExtra: number; cantidad: number; nota?: string; precioVentaManual?: number | null }[];
    ingredientesExtras?: { idIngrediente: number; cantidad: number; nota?: string; precioVentaManual?: number | null }[];
  }[];
}

export interface ActualizarPedidoDTO {
  Fecha?: string;
  Nota?: string;
  PrecioExtra?: number;
  MetodoDePago?: string;
  Estado?: string;
}

export interface TotalVentasFecha {
  FechaInicio?: string;
  FechaFin?: string;
  TotalPedidos?: number;
  TotalVentas: number;
  TotalGanancias?: number;
  TotalIngredientes?: number;
  TotalCostoExtras?: number;
}

// Enums para estados y métodos de pago
export enum EstadoPedido {
  PENDIENTE = 'Pendiente',
  EN_PROCESO = 'En Proceso',
  COMPLETADO = 'Completado',
  CANCELADO = 'Cancelado',
  ENTREGADO = 'Entregado'
}

export enum MetodoPago {
  EFECTIVO = 'Efectivo',
  TRANSFERENCIA = 'Transferencia',
  TARJETA = 'Tarjeta',
  MERCADO_PAGO = 'Mercado Pago'
}