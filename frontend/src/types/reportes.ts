/**
 * Types para Reportes
 */

// 1. Dashboard General
export interface DashboardData {
  TotalPedidos: number;
  IngresosTotales: number;
  GananciaTotales: number;
  TasaConversion: number;
  PedidosCompletados: number;
  PedidosCancelados: number;
  ComparativaMesAnterior: {
    IngresosMesAnterior: number;
    GananciasMesAnterior: number;
    CrecimientoIngresos: number;
    CrecimientoGanancias: number;
  };
}

export interface DashboardParams {
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
}

// 2. Ventas por Período
export interface VentasPorPeriodoData {
  Fecha: string;
  Periodo: string;
  TotalVentas: number;
  TotalGanancias: number;
  CantidadPedidos: number;
}

export interface VentasPorPeriodoParams {
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  agrupacion: 'dia' | 'semana' | 'mes';
}

// 6. Top Clientes
export interface TopClientesData {
  IdCliente: number;
  NombreCliente: string;
  TelefonoCliente: string;
  TotalPedidos: number;
  TotalGastado: number;
  UltimaCompra: string;
}

export interface TopClientesParams {
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  top: number;
}

// 3. Tendencia de Ganancias
export interface TendenciaGananciasData {
  Periodo: string;
  Fecha: string;
  Ganancia: number;
  PorcentajeCrecimiento: number;
}

export interface TendenciaGananciasParams {
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  agrupacion: 'dia' | 'semana' | 'mes';
}

// 5. Tendencia Mensual
export interface TendenciaMensualData {
  Mes: number;
  NombreMes: string;
  CantidadPedidos: number;
  TotalVentas: number;
  TotalGanancias: number;
}

export interface TendenciaMensualParams {
  año: number;
}

// 4. Top Tortas Más Vendidas
export interface TopTortasData {
  IdTorta: number;
  NombreTorta: string;
  CantidadVendida: number;
  TotalIngresos: number;
  TotalGanancias: number;
  PorcentajeDelTotal: number;
}

export interface TopTortasParams {
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  top: number;
  ordenarPor: 'cantidad' | 'ganancia';
}

// 7. Tortas Más Rentables
export interface TortasRentablesData {
  IdTorta: number;
  NombreTorta: string;
  CantidadVendida: number;
  TotalIngresos: number;
  TotalGanancias: number;
  MargenGanancia: number;
  GananciaPorUnidad: number;
}

export interface TortasRentablesParams {
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  top: number;
}

// 8. Medidas Más Populares
export interface MedidasPopularesData {
  IdTorta: number;
  NombreTorta: string;
  IdMedida: number;
  TamanoMedida: string;
  CantidadVendida: number;
  PorcentajeDelTotal: number;
}

export interface MedidasPopularesParams {
  idTorta?: number | null;
  fechaInicio?: string | null; // YYYY-MM-DD
  fechaFin?: string | null; // YYYY-MM-DD
}
