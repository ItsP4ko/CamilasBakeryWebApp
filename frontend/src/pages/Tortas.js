import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useTortas } from "../hooks/useTortas";
import { TortaCard } from "@/components/tortas/TortaCard";
import { BotonesGestionTorta } from "@/components/tortas/BotonesGestionTorta";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Tortas = () => {
    const { data, isLoading, error } = useTortas();
    const navigate = useNavigate();
    const [tortaSeleccionada, setTortaSeleccionada] = useState(null);
    const [medidasSeleccionadas, setMedidasSeleccionadas] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    if (isLoading)
        return _jsx("div", { className: "text-center py-10 text-gray-600 dark:text-gray-400", children: "Cargando tortas..." });
    if (error)
        return (_jsxs("div", { className: "text-center text-red-600 dark:text-red-400", children: ["Error al cargar las tortas: ", error.message] }));
    if (!data?.length)
        return _jsx("div", { className: "text-center text-gray-500 dark:text-gray-400", children: "No hay tortas disponibles" });
    // Filtrar tortas por nombre
    const filteredData = data.filter((torta) => torta.Nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    // Función para ir a gestión de medidas
    const handleGestionarMedidas = (tortaId) => {
        navigate(`/tortas/${tortaId}/medidas`);
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6", children: [_jsxs("div", { className: "mb-6 sm:mb-8 text-center", children: [_jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2", children: "Cat\u00E1logo de Tortas" }), _jsx("p", { className: "text-sm sm:text-base text-gray-600 dark:text-gray-400", children: "Gesti\u00F3n de tortas y precios" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 }, className: "bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8", children: [_jsxs("div", { className: "relative mb-3", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Buscar torta por nombre...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 \n             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 \n             placeholder-gray-500 dark:placeholder-gray-400\n             border border-gray-300 dark:border-gray-600 \n             rounded-lg \n             focus:ring-2 focus:ring-primary-400 focus:border-transparent \n             outline-none" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Mostrando ", filteredData.length, " de ", data?.length || 0, " tortas"] }), _jsx(BotonesGestionTorta, { tortaSeleccionada: data.find(t => t.IdTorta === tortaSeleccionada) || null })] })] }), filteredData.length === 0 ? (_jsxs("div", { className: "text-center py-10 text-gray-500 dark:text-gray-400", children: ["No se encontraron tortas con \"", searchTerm, "\""] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-start", children: filteredData.map((torta) => (_jsx(TortaCard, { torta: torta, isExpanded: tortaSeleccionada === torta.IdTorta, onToggle: () => {
                        setTortaSeleccionada((prev) => prev === torta.IdTorta ? null : torta.IdTorta);
                        setMedidasSeleccionadas((prev) => ({
                            ...prev,
                            [torta.IdTorta]: null
                        }));
                    }, medidaSeleccionada: medidasSeleccionadas[torta.IdTorta] || null, onMedidaSelect: (medidaId) => {
                        setMedidasSeleccionadas((prev) => ({
                            ...prev,
                            [torta.IdTorta]: medidaId
                        }));
                    }, onGestionarMedidas: handleGestionarMedidas }, torta.IdTorta))) }))] }));
};
export default Tortas;
