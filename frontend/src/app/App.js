import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, Link } from 'react-router-dom';
const App = () => {
    return (_jsxs("div", { style: { maxWidth: 600, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8, fontFamily: 'sans-serif' }, children: [_jsx("h1", { style: { textAlign: 'center', color: '#b45f06' }, children: "Pasteler\u00EDa" }), _jsxs("nav", { style: { textAlign: 'center', marginBottom: 20 }, children: [_jsx(Link, { to: "/", style: { margin: '0 1rem' }, children: "Dashboard" }), _jsx(Link, { to: "/ingredientes", style: { margin: '0 1rem' }, children: "Ingredientes" })] }), _jsx(Outlet, {})] }));
};
export default App;
