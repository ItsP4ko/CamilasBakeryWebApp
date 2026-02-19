import api from './http';
import { TortaSimple, MedidaSimple } from '../types/pedidoSeleccion';

// Obtener todas las tortas (solo id y nombre)
export const getTortasSimple = async (): Promise<TortaSimple[]> => {
  const response = await api.get('/api/Tortas');
  const tortasArray = Array.isArray(response.data) ? response.data : [];

  return tortasArray.map((torta: any) => ({
    idTorta: torta.IdTorta ?? torta.idTorta,
    nombre: torta.Nombre ?? torta.nombre,
    multiplicadorGanancia: torta.MultiplicadorGanancia ?? torta.multiplicadorGanancia ?? 2.7,
  }));
};

// Obtener medidas de una torta específica 
export const getMedidasPorTorta = async (idTorta: number): Promise<MedidaSimple[]> => {

  const response = await api.get(`/api/Tortas/${idTorta}`);
  const torta: any = response.data;

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
