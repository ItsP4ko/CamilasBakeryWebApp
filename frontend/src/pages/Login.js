import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { loginTraditional, loginWithGoogle, loading, error } = useAuth();
    const navigate = useNavigate();
    const [isExiting, setIsExiting] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await loginTraditional(username, password);
        if (success) {
            setIsExiting(true);
            setTimeout(() => {
                navigate(ROUTES.DASHBOARD);
            }, 600);
        }
    };
    const handleGoogleSuccess = async (credentialResponse) => {
        if (credentialResponse.credential) {
            const success = await loginWithGoogle(credentialResponse.credential);
            if (success) {
                setIsExiting(true);
                setTimeout(() => {
                    navigate(ROUTES.DASHBOARD);
                }, 600);
            }
        }
    };
    const handleGoogleError = () => {
        console.error('Google login failed');
    };
    const handleGoogleLoginClick = () => {
        // Placeholder para futuras funcionalidades
    };
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-t from-gray-800 via-gray-700 to-gray-600 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden px-4", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [_jsx("div", { className: "absolute top-0 -left-4 w-72 h-72 bg-gray-400/20 dark:bg-gray-600/10 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-blob" }), _jsx("div", { className: "absolute top-0 -right-4 w-72 h-72 bg-gray-500/20 dark:bg-gray-500/10 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-blob animation-delay-2000" }), _jsx("div", { className: "absolute -bottom-8 left-20 w-72 h-72 bg-gray-600/20 dark:bg-gray-400/10 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-blob animation-delay-4000" })] }), _jsx(AnimatePresence, { children: !isExiting && (_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.6 }, className: "bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative z-10 border border-gray-300/50 dark:border-gray-700/50", children: [_jsxs("div", { className: "flex flex-col items-center mb-6 sm:mb-8", children: [_jsx("img", { src: "/assets/tortas/logo.png", alt: "Logo CamilasBakery", className: "w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 mb-3 sm:mb-4 rounded-full shadow-xl" }), _jsxs("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-700 dark:text-gray-200 text-center", children: ["Camilas'", _jsx("span", { className: "text-primary-600 dark:text-primary-400", children: "Bakery" })] })] }), _jsx("div", { className: "flex justify-center mb-4 sm:mb-6", children: _jsx("div", { onClick: handleGoogleLoginClick, children: _jsx(GoogleLogin, { onSuccess: handleGoogleSuccess, onError: handleGoogleError, text: "continue_with", shape: "rectangular", size: "medium", width: 280, useOneTap: false, auto_select: false, type: "standard" }) }) }), _jsxs("div", { className: "relative my-4 sm:my-6", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-300 dark:border-gray-600" }) }), _jsx("div", { className: "relative flex justify-center text-xs sm:text-sm", children: _jsx("span", { className: "px-2 bg-white/80 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400", children: "O contin\u00FAa con" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 sm:space-y-5", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "usuario", className: "block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Usuario" }), _jsx("input", { type: "text", id: "usuario", value: username, onChange: (e) => setUsername(e.target.value), required: true, className: "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-400 focus:outline-none", placeholder: "Ingresa tu usuario" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Contrase\u00F1a" }), _jsx("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-400 focus:outline-none", placeholder: "Ingresa tu contrase\u00F1a" })] }), error && (_jsx("div", { className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 sm:px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 text-xs sm:text-sm", children: error })), _jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, type: "submit", disabled: loading, className: "w-full bg-primary-600 hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-2 px-4 text-sm sm:text-base rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? "Iniciando sesión..." : "Iniciar Sesión" })] })] }, "login-card")) })] }));
};
export default Login;
