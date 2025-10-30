import { useQuery } from '@tanstack/react-query';
import { 
  getDashboard, 
  getVentasPorPeriodo, 
  getTopClientes,
  getTendenciaGanancias,
  getTendenciaMensual,
  getTopTortas,
  getTortasRentables,
  getMedidasPopulares
} from '../api/reportes';
import { 
  DashboardParams, 
  VentasPorPeriodoParams, 
  TopClientesParams,
  TendenciaGananciasParams,
  TendenciaMensualParams,
  TopTortasParams,
  TortasRentablesParams,
  MedidasPopularesParams
} from '../types/reportes';

/**
 * Hook para Dashboard General
 */
export const useDashboard = (params: DashboardParams) => {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => getDashboard(params),
    enabled: !!params.fechaInicio && !!params.fechaFin,
  });
};

/**
 * Hook para Ventas por Período
 */
export const useVentasPorPeriodo = (params: VentasPorPeriodoParams) => {
  return useQuery({
    queryKey: ['ventasPorPeriodo', params],
    queryFn: () => getVentasPorPeriodo(params),
    enabled: !!params.fechaInicio && !!params.fechaFin && !!params.agrupacion,
  });
};

/**
 * Hook para Top Clientes
 */
export const useTopClientes = (params: TopClientesParams) => {
  return useQuery({
    queryKey: ['topClientes', params],
    queryFn: () => getTopClientes(params),
    enabled: !!params.fechaInicio && !!params.fechaFin && !!params.top,
  });
};

/**
 * Hook para Tendencia de Ganancias
 */
export const useTendenciaGanancias = (params: TendenciaGananciasParams) => {
  return useQuery({
    queryKey: ['tendenciaGanancias', params],
    queryFn: () => getTendenciaGanancias(params),
    enabled: !!params.fechaInicio && !!params.fechaFin && !!params.agrupacion,
  });
};

/**
 * Hook para Tendencia Mensual
 */
export const useTendenciaMensual = (params: TendenciaMensualParams) => {
  return useQuery({
    queryKey: ['tendenciaMensual', params],
    queryFn: () => getTendenciaMensual(params),
    enabled: !!params.año,
  });
};

/**
 * Hook para Top Tortas
 */
export const useTopTortas = (params: TopTortasParams | null) => {
  return useQuery({
    queryKey: ['topTortas', params],
    queryFn: () => getTopTortas(params!),
    enabled: !!params && !!params.fechaInicio && !!params.fechaFin && !!params.top && !!params.ordenarPor,
  });
};

/**
 * Hook para Tortas Rentables
 */
export const useTortasRentables = (params: TortasRentablesParams | null) => {
  return useQuery({
    queryKey: ['tortasRentables', params],
    queryFn: () => getTortasRentables(params!),
    enabled: !!params && !!params.fechaInicio && !!params.fechaFin && !!params.top,
  });
};

/**
 * Hook para Medidas Populares
 */
export const useMedidasPopulares = (params: MedidasPopularesParams | null) => {
  return useQuery({
    queryKey: ['medidasPopulares', params],
    queryFn: () => getMedidasPopulares(params!),
    enabled: !!params,
  });
};
