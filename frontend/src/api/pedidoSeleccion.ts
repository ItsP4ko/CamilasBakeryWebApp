import api from './http';
import { TortaSimple, MedidaSimple } from '../types/pedidoSeleccion';

// Obtener todas las tortas (solo id y nombre)
export const getTortasSimple = async (): Promise<TortaSimple[]> => {
  const response = await api.get('/api/Tortas');
  const tortasArray = Array.isArray(response.data) ? response.data : [];

  return tortasArray.map((torta: any) => ({
    idTorta: torta.IdTorta ?? torta.idTorta,
    nombre: torta.Nombre ?? torta.nombre,
  }));
};

// Obtener medidas de una torta específica 
export const getMedidasPorTorta = async (idTorta: number): Promise<MedidaSimple[]> => {

  const response = await api.get('/api/Tortas');
  const tortasArray = Array.isArray(response.data) ? response.data : [];
  
  const torta = tortasArray.find((t: any) => (t.IdTorta ?? t.idTorta) === idTorta);
  
  if (!torta) {
    return [];
  }

  const medidas = torta.Medidas ?? torta.medidas ?? [];
  
  return medidas.map((medida: any) => ({
    idMedidaDetalle: medida.IdMedida ?? medida.idMedida,
    tamano: medida.Tamano ?? medida.tamano,
    precio: medida.PrecioVenta ?? medida.precioVenta ?? 0,
  }));
};
