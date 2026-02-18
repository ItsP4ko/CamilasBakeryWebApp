export interface Ingrediente {
  IdMedidaIngrediente: number;
  MedidaId: number;
  IngredienteId: number;
  NombreIngrediente: string;
  CantidadUsada: number;
  UnidadUsada: string;
  PrecioUnitario: number;
  CostoTotal: number;
}

export interface CostoExtra {
  IdMedidaCostoExtra: number;
  IdMedida: number;
  IdCostoExtra: number;
  NombreCostoExtra: string;
  CantidadUsada: number;
  PrecioUnitario: number;
  CostoTotal: number;
}

export interface Medida {
  IdMedida: number;
  IdTorta: number;
  Tamano: string;
  Estado: string;
  MultiplicadorGanancia: number;
  PrecioVentaManual?: number | null;
  CostoIngredientes: number;
  CostoExtras: number;
  CostoTotal: number;
  PrecioSugerido: number;
  PrecioVenta: number;
  MultiplicadorReal: number;
  Ganancia: number;
}

export interface MedidaDetalle extends Medida {
  Ingredientes: Ingrediente[];
  CostosExtra: CostoExtra[];
}

export interface Torta {
  IdTorta: number;
  Nombre: string;
  Estado: string;
  MultiplicadorGanancia: number;
  Medidas: Medida[];
  PrecioPromedio: number;
  CantidadMedidas: number;
}