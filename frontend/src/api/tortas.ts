import api from './http';
import { Medida, Torta, MedidaDetalle } from '../types/tortas';

export const getTortas = async (): Promise<Torta[]> => {
  const response = await api.get('/api/Tortas');
  const tortasArray = Array.isArray(response.data) ? response.data : [];

  const mapped = tortasArray.map((torta: any): Torta => ({
    IdTorta: torta.IdTorta ?? torta.idTorta,
    Nombre: torta.Nombre ?? torta.nombre,
    Estado: torta.Estado ?? torta.estado ?? '',
    MultiplicadorGanancia: torta.MultiplicadorGanancia ?? torta.multiplicadorGanancia ?? 2.7,
    PrecioPromedio: torta.PrecioPromedio ?? torta.precioPromedio ?? 0,
    CantidadMedidas: torta.CantidadMedidas ?? torta.cantidadMedidas ?? 0,
    Medidas: (torta.Medidas ?? torta.medidas ?? []).map((m: any): Medida => ({
      IdMedida: m.IdMedida ?? m.idMedida,
      IdTorta: m.IdTorta ?? m.idTorta,
      Tamano: m.Tamano ?? m.tamano,
      Estado: m.Estado ?? m.estado ?? '',
      MultiplicadorGanancia: m.MultiplicadorGanancia ?? m.multiplicadorGanancia ?? 2.7,
      PrecioVentaManual: m.PrecioVentaManual ?? m.precioVentaManual ?? null,
      CostoIngredientes: m.CostoIngredientes ?? m.costoIngredientes ?? 0,
      CostoExtras: m.CostoExtras ?? m.costoExtras ?? 0,
      CostoTotal: m.CostoTotal ?? m.costoTotal ?? 0,
      PrecioSugerido: m.PrecioSugerido ?? m.precioSugerido ?? 0,
      PrecioVenta: m.PrecioVenta ?? m.precioVenta ?? 0,
      MultiplicadorReal: m.MultiplicadorReal ?? m.multiplicadorReal ?? 0,
      Ganancia: m.Ganancia ?? m.ganancia ?? 0,
    })),
  }));

  return mapped;
};

export const getCantidadTortas = async (): Promise<number> => {
  const tortas = await getTortas();
  return tortas.length;
};

// CRUD Tortas
export const createTorta = async (nombre: string, multiplicadorGanancia?: number): Promise<Torta> => {
  const response = await api.post('/api/Tortas', {
    Nombre: nombre,
    MultiplicadorGanancia: multiplicadorGanancia
  });
  return response.data as Torta;
};

export const updateTorta = async (id: number, nombre?: string, multiplicadorGanancia?: number): Promise<void> => {
  await api.put(`/api/Tortas/${id}`, {
    Nombre: nombre,
    MultiplicadorGanancia: multiplicadorGanancia
  });
};

export const deleteTorta = async (id: number): Promise<void> => {
  await api.delete(`/api/Tortas/${id}`);
};

// CRUD Medidas
export const getMedida = async (medidaId: number): Promise<MedidaDetalle> => {
  const response = await api.get(`/api/Tortas/medidas/${medidaId}`);
  return response.data as MedidaDetalle;
};

export const createMedida = async (tortaId: number, tamano: string): Promise<Medida> => {
  const response = await api.post(`/api/Tortas/${tortaId}/medidas`, JSON.stringify(tamano), {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data as Medida;
};

export const updateMedida = async (medidaId: number, tamano: string): Promise<void> => {
  await api.put(`/api/Tortas/medidas/${medidaId}`, JSON.stringify(tamano), {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const deleteMedida = async (medidaId: number): Promise<void> => {
  await api.delete(`/api/Tortas/medidas/${medidaId}`);
};

export const updatePrecioVentaMedida = async (medidaId: number, precioVentaManual: number | null): Promise<void> => {
  await api.put(`/api/Tortas/medidas/${medidaId}/precio`, {
    PrecioVentaManual: precioVentaManual
  });
};

// Ingredientes de Medida
export const addIngredienteToMedida = async (
  medidaId: number,
  ingredienteId: number,
  cantidad: number,
  unidad: string
): Promise<void> => {
  await api.post(`/api/Tortas/medidas/${medidaId}/ingredientes`, {
    IngredienteId: ingredienteId,
    Cantidad: cantidad,
    Unidad: unidad
  });
};

export const updateIngredienteMedida = async (
  tortaIngredienteId: number,
  cantidad: number,
  unidad: string
): Promise<void> => {
  await api.put(`/api/Tortas/ingredientes/${tortaIngredienteId}`, {
    Cantidad: cantidad,
    Unidad: unidad
  });
};

export const removeIngredienteFromMedida = async (tortaIngredienteId: number): Promise<void> => {
  await api.delete(`/api/Tortas/ingredientes/${tortaIngredienteId}`);
};

// Costos Extra de Medida
export const addCostoExtraToMedida = async (
  medidaId: number,
  costoExtraId: number,
  cantidadUsada: number
): Promise<void> => {
  await api.post(`/api/Tortas/medidas/${medidaId}/costos-extra`, {
    CostoExtraId: costoExtraId,
    cantidad: cantidadUsada
  });
};

export const removeCostoExtraFromMedida = async (tortaCostoExtraId: number): Promise<void> => {
  await api.delete(`/api/Tortas/costos-extra/${tortaCostoExtraId}`);
};