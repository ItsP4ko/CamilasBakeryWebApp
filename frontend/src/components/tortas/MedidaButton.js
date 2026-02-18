import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import MedidaDetalle from "./MedidaDetalle";
const MedidaButton = ({ medida, tortaId, isSelected, onClick, }) => {
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { onClick: onClick, className: `w-full text-center py-2 rounded-xl font-semibold tracking-wide cursor-pointer border select-none ${isSelected
                    ? "border-primary-400 dark:border-primary-500 bg-primary-200 dark:bg-primary-700 text-gray-900 dark:text-gray-100"
                    : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200"}`, children: medida.Tamano }), isSelected && _jsx(MedidaDetalle, { medida: medida, tortaId: tortaId })] }));
};
export default MedidaButton;
