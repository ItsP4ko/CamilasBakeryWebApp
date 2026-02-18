import api from './http';
export const getMedidaDetalle = async (medidaId) => {
    const response = await api.get(`/api/Tortas/medidas/${medidaId}`);
    return response.data;
};
