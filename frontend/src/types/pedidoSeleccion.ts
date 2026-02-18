// Tipos optimizados para la selección de productos en pedidos

export interface TortaSimple {
  idTorta: number;
  nombre: string;
  multiplicadorGanancia: number;
}

export interface MedidaSimple {
  idMedidaDetalle: number;
  tamano: string;
  porciones: number;
  precio: number;
}
