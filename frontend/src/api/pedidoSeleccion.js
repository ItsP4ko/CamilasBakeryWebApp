import api from './http';
// Obtener todas las tortas (solo id y nombre)
export const getTortasSimple = async () => {
    const response = await api.get('/api/Tortas');
    const tortasArray = Array.isArray(response.data) ? response.data : [];
    return tortasArray.map((torta) => ({
        idTorta: torta.IdTorta ?? torta.idTorta,
        nombre: torta.Nombre ?? torta.nombre,
        multiplicadorGanancia: torta.MultiplicadorGanancia ?? torta.multiplicadorGanancia ?? 2.7,
    }));
};
// Obtener medidas de una torta específica 
export const getMedidasPorTorta = async (idTorta) => {
    const response = await api.get(`/api/Tortas/${idTorta}`);
    const torta = response.data;
    if (!torta) {
        return [];
    }
    const medidas = torta.Medidas ?? torta.medidas ?? [];
    return medidas.map((medida) => ({
        idMedidaDetalle: medida.IdMedida ?? medida.idMedida,
        tamano: medida.Tamano ?? medida.tamano,
        precio: medida.PrecioVenta ?? medida.precioVenta ?? 0,
    }));
};
