import api from './http';
import { 
  DashboardData, 
  DashboardParams,
  VentasPorPeriodoData,
  VentasPorPeriodoParams,
  TopClientesData,
  TopClientesParams,
  TendenciaGananciasData,
  TendenciaGananciasParams,
  TendenciaMensualData,
  TendenciaMensualParams,
  TopTortasData,
  TopTortasParams,
  TortasRentablesData,
  TortasRentablesParams,
  MedidasPopularesData,
  MedidasPopularesParams,
  ReporteStockResponseDto,
  FiltrosReporteStock
} from '../types/reportes';

/**
 * API de Reportes
 */

// 1. Dashboard General
export const getDashboard = async (params: DashboardParams): Promise<DashboardData> => {
  const response = await api.get<DashboardData>('/api/reportes/Dashboard', { params });
  return response.data;
};

// 2. Ventas por Período
export const getVentasPorPeriodo = async (params: VentasPorPeriodoParams): Promise<VentasPorPeriodoData[]> => {
  const response = await api.get<VentasPorPeriodoData[]>('/api/reportes/VentasPorPeriodo', { params });
  return response.data;
};

// 6. Top Clientes
export const getTopClientes = async (params: TopClientesParams): Promise<TopClientesData[]> => {
  const response = await api.get<TopClientesData[]>('/api/reportes/TopClientes', { params });
  return response.data;
};

// 3. Tendencia de Ganancias
export const getTendenciaGanancias = async (params: TendenciaGananciasParams): Promise<TendenciaGananciasData[]> => {
  const response = await api.get<TendenciaGananciasData[]>('/api/reportes/TendenciaGanancias', { params });
  return response.data;
};

// 5. Tendencia Mensual
export const getTendenciaMensual = async (params: TendenciaMensualParams): Promise<TendenciaMensualData[]> => {
  const response = await api.get<TendenciaMensualData[]>('/api/reportes/TendenciaMensual', { params });
  return response.data;
};

// 4. Top Tortas Más Vendidas
export const getTopTortas = async (params: TopTortasParams): Promise<TopTortasData[]> => {
  const response = await api.get<TopTortasData[]>('/api/reportes/TopTortas', { params });
  return response.data;
};

// 7. Tortas Más Rentables
export const getTortasRentables = async (params: TortasRentablesParams): Promise<TortasRentablesData[]> => {
  const response = await api.get<TortasRentablesData[]>('/api/reportes/TortasRentables', { params });
  return response.data;
};

// 8. Medidas Más Populares
export const getMedidasPopulares = async (params: MedidasPopularesParams): Promise<MedidasPopularesData[]> => {
  const response = await api.get<MedidasPopularesData[]>('/api/reportes/MedidasPopulares', { params });
  return response.data;
};

// 9. Reporte de Stock
export const getReporteStock = async (filtros?: FiltrosReporteStock): Promise<ReporteStockResponseDto> => {
  // Filtrar parámetros undefined para no enviarlos al backend
  const params: any = {};
  if (filtros?.nivel !== undefined) {
    params.nivel = filtros.nivel;
  }
  if (filtros?.tipo !== undefined) {
    params.tipo = filtros.tipo;
  }
  
  const response = await api.get<any>('/api/reportes/stock', { params });
  
  // El backend devuelve PascalCase, convertir a camelCase
  const data = response.data;
  const itemsBackend = data.Items || data.items || [];
  const resumenBackend = data.Resumen || data.resumen;
  
  // Transformar cada item de PascalCase a camelCase
  const itemsTransformados = itemsBackend.map((item: any) => ({
    id: item.Id ?? item.id,
    nombre: item.Nombre ?? item.nombre,
    stock: item.Stock ?? item.stock,
    maxStock: item.MaxStock ?? item.maxStock,
    porcentajeStock: item.PorcentajeStock ?? item.porcentajeStock,
    nivelStock: item.NivelStock ?? item.nivelStock,
    nivelStockTexto: item.NivelStockTexto ?? item.nivelStockTexto,
    tipoItem: item.TipoItem ?? item.tipoItem,
  }));
  
  return {
    items: itemsTransformados,
    resumen: {
      totalItems: resumenBackend?.TotalItems ?? resumenBackend?.totalItems ?? 0,
      itemsCriticos: resumenBackend?.ItemsCriticos ?? resumenBackend?.itemsCriticos ?? 0,
      itemsBajos: resumenBackend?.ItemsBajos ?? resumenBackend?.itemsBajos ?? 0,
      itemsMedios: resumenBackend?.ItemsMedios ?? resumenBackend?.itemsMedios ?? 0,
      itemsAltos: resumenBackend?.ItemsAltos ?? resumenBackend?.itemsAltos ?? 0,
    }
  };
};
