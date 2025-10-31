import api from './http';
import { CostoExtra, CreateCostoExtraDTO, UpdateCostoExtraDTO } from '../types/costoExtra';

export const getCostosExtra = async (): Promise<CostoExtra[]> => {
  const response = await api.get('/api/CostosExtra');
  // Mapear los datos del backend al frontend
  const data = Array.isArray(response.data) ? response.data : [];
  return data.map((costo: any) => ({
    idCostoExtra: costo.IdCostoExtra || costo.idCostoExtra,
    nombre: costo.Nombre || costo.nombre,
    precioUnitario: costo.PrecioUnitario || costo.precioUnitario,
    nota: costo.Nota || costo.nota,
    stock: costo.Stock ?? costo.stock ?? null
  }));
};

export const createCostoExtra = async (createCostoExtra : CreateCostoExtraDTO): Promise<CostoExtra> =>{
  const response = await api.post(`/api/CostosExtra`, createCostoExtra);
  // Mapear la respuesta del backend (PascalCase) al formato del frontend (camelCase)
  const data: any = response.data;
  return {
    idCostoExtra: data.IdCostoExtra || data.idCostoExtra,
    nombre: data.Nombre || data.nombre,
    precioUnitario: data.PrecioUnitario || data.precioUnitario,
    nota: data.Nota || data.nota || null,
    stock: data.Stock ?? data.stock ?? null
  };
}

//eliminar ingrediente
export const eliminarCostoExtra = async (id: number): Promise<void> => {
  await api.delete(`/api/CostosExtra/${id}`);
}

// Actualizar costo extra (precio y/o stock)
export const updateCostoExtra = async (id: number, data: UpdateCostoExtraDTO): Promise<void> => {
  await api.put(`/api/CostosExtra/${id}`, data);
}
