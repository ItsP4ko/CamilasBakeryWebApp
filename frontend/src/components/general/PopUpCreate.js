import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const PopupForm = ({ isOpen, tipo, unidadesCompra = [], onClose, onSubmit, }) => {
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [nota, setNota] = useState("");
    const [unidadCompra, setUnidadCompra] = useState("");
    if (!isOpen)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre || nombre.trim() === "") {
            alert("El nombre es obligatorio");
            return;
        }
        if (precio === "" || Number(precio) < 0) {
            alert("El precio debe ser un número mayor a 0");
            return;
        }
        if (tipo === "ingrediente" && (!unidadCompra || unidadCompra === "")) {
            alert("La unidad de compra es obligatoria");
            return;
        }
        const data = tipo === "ingrediente"
            ? {
                Nombre: nombre.trim(),
                PrecioUnitario: Number(precio),
                UnidadCompra: unidadCompra
            }
            : {
                Nombre: nombre.trim(),
                PrecioUnitario: Number(precio),
                Nota: nota.trim()
            };
        onSubmit(data);
        setNombre("");
        setPrecio("");
        setNota("");
        setUnidadCompra("");
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-primary-100 w-full max-w-md rounded-xl shadow-lg border border-primary-300 p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-lg font-semibold text-primary-800", children: tipo === "ingrediente" ? "Agregar Ingrediente" : "Agregar Costo Extra" }), _jsx("button", { onClick: onClose, className: "text-primary-600 hover:text-primary-900 text-xl leading-none px-2", children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-primary-700", children: "Nombre *" }), _jsx("input", { type: "text", value: nombre, onChange: (e) => setNombre(e.target.value), required: true, maxLength: 50, className: "text-primary-0 bg-primary-50 w-full mt-1 px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400", placeholder: "Ej. Harina 0000" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-primary-700", children: "Precio *" }), _jsx("input", { type: "number", step: "0.01", min: "0.01", value: precio, onChange: (e) => setPrecio(e.target.value ? Number(e.target.value) : ""), required: true, className: "text-primary-0 bg-primary-50 w-full mt-1 px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400", placeholder: "Ej. 1500" })] }), tipo === "ingrediente" ? (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-primary-700", children: "Unidad de compra *" }), _jsxs("select", { value: unidadCompra, onChange: (e) => setUnidadCompra(e.target.value), required: true, className: "text-primary-0 bg-primary-50 w-full mt-1 px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400", children: [_jsx("option", { value: "", children: "Seleccionar unidad" }), unidadesCompra.map((unidad) => (_jsx("option", { value: unidad, children: unidad }, unidad)))] })] })) : (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-primary-700", children: "Nota (Opcional)" }), _jsx("textarea", { value: nota, onChange: (e) => setNota(e.target.value), maxLength: 200, className: "text-primary-0 bg-primary-100 w-full mt-1 px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400", rows: 3, placeholder: "Detalles opcionales..." })] })), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 bg-primary-200 text-primary-700 rounded-md hover:bg-primary-300 transition-colors", children: "Cancelar" }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 transition-colors", children: "Guardar" })] })] })] }) }));
};
export default PopupForm;
