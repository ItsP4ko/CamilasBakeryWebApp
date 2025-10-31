import api from './http';
import { CreateIngredienteDTO, Ingrediente, UpdateIngredienteDTO } from '../types/ingredientes';

export const getIngredientes = async (): Promise<Ingrediente[]> => {
  const response = await api.get('/api/Ingredientes');  
  // Mapear los datos del backend al frontend
  const ingredientesArray = Array.isArray(response.data) ? response.data : [];
  return ingredientesArray.map((ingrediente: any) => ({
    idIngrediente: ingrediente.IdIngrediente || ingrediente.idIngrediente,
    nombre: ingrediente.Nombre || ingrediente.nombre,
    unidadCompra: ingrediente.UnidadCompra || ingrediente.unidadCompra,
    precioUnitario: ingrediente.PrecioUnitario || ingrediente.precioUnitario,
    stock: ingrediente.Stock ?? ingrediente.stock
  }));
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
export const createIngrediente = async (ingrediente : CreateIngredienteDTO): Promise<Ingrediente> =>{
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
