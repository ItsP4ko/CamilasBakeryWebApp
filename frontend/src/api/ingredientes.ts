import api from './http';
import { CreateIngredienteDTO, Ingrediente, UpdateIngredienteDTO } from '../types/ingredientes';

import { PagedResult } from '../types/pagination';

export const getIngredientes = async (page: number = 1, pageSize: number = 20): Promise<PagedResult<Ingrediente>> => {
  const response = await api.get(`/api/Ingredientes?page=${page}&pageSize=${pageSize}`);
  const data: any = response.data; // Cast to any to fix linter error

  return {
    items: (data.items || data.Items || []).map((ingrediente: any) => ({
      idIngrediente: ingrediente.IdIngrediente || ingrediente.idIngrediente,
      nombre: ingrediente.Nombre || ingrediente.nombre,
      unidadCompra: ingrediente.UnidadCompra || ingrediente.unidadCompra,
      precioUnitario: ingrediente.PrecioUnitario || ingrediente.precioUnitario,
      stock: ingrediente.Stock ?? ingrediente.stock
    })),
    totalCount: data.totalCount ?? data.TotalCount ?? 0,
    pageNumber: data.pageNumber ?? data.PageNumber ?? 1,
    pageSize: data.pageSize ?? data.PageSize ?? 20,
    totalPages: data.totalPages ?? data.TotalPages ?? 1
  };
};

export const getIngredientesByID = async (id: number): Promise<Ingrediente[]> => {
  const response = await api.get(`/api/Ingredientes/${id}`);
  const ingredientesArray = Array.isArray(response.data) ? response.data : [];
  return ingredientesArray.map((ingrediente: any) => ({
    idIngrediente: ingrediente.IdIngrediente || ingrediente.idIngrediente,
    nombre: ingrediente.Nombre || ingrediente.nombre,
    unidadCompra: ingrediente.UnidadCompra || ingrediente.unidadCompra,
    precioUnitario: ingrediente.PrecioUnitario || ingrediente.precioUnitario,
    stock: ingrediente.Stock ?? ingrediente.stock
  }));
};

// crear ingrediente
export const createIngrediente = async (ingrediente: CreateIngredienteDTO): Promise<Ingrediente> => {
  const response = await api.post(`/api/Ingredientes`, ingrediente);
  // Mapear la respuesta del backend (PascalCase) al formato del frontend (camelCase)
  const data: any = response.data;
  return {
    idIngrediente: data.IdIngrediente || data.idIngrediente,
    nombre: data.Nombre || data.nombre,
    unidadCompra: data.UnidadCompra || data.unidadCompra,
    precioUnitario: data.PrecioUnitario || data.precioUnitario,
    stock: data.Stock ?? data.stock ?? 0
  };
}

//eliminar ingrediente
export const eliminarIngrediente = async (id: number): Promise<void> => {
  await api.delete(`api/Ingredientes/${id}`);
}



// Actualizar ingrediente (precio y/o stock)
export const updateIngrediente = async (id: number, data: UpdateIngredienteDTO): Promise<void> => {
  await api.put(`/api/Ingredientes/${id}`, data);
}
