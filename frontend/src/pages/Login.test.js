import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import * as useAuthHook from '@/hooks/useAuth';
// Mock del hook useAuth
vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));
// Mock de useNavigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});
// Mock de @react-oauth/google
vi.mock('@react-oauth/google', () => ({
    GoogleLogin: () => _jsx("button", { children: "Google Login Mock" }),
    useGoogleLogin: () => { },
}));
describe('Login Component', () => {
    const loginTraditionalMock = vi.fn();
    const loginWithGoogleMock = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
        useAuthHook.useAuth.mockReturnValue({
            loginTraditional: loginTraditionalMock,
            loginWithGoogle: loginWithGoogleMock,
            loading: false,
            error: null,
        });
    });
    it('should render login form correctly', () => {
        render(_jsx(MemoryRouter, { children: _jsx(Login, {}) }));
        expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
        expect(screen.getByText(/camilas'/i)).toBeInTheDocument();
    });
    it('should handle input changes', () => {
        render(_jsx(MemoryRouter, { children: _jsx(Login, {}) }));
        const usernameInput = screen.getByLabelText(/usuario/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(usernameInput).toHaveValue('testuser');
        expect(passwordInput).toHaveValue('password123');
    });
    it('should call loginTraditional on form submission', async () => {
        loginTraditionalMock.mockResolvedValue(true);
        render(_jsx(MemoryRouter, { children: _jsx(Login, {}) }));
        const usernameInput = screen.getByLabelText(/usuario/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(loginTraditionalMock).toHaveBeenCalledWith('testuser', 'password123');
        });
    });
    it('should display error message when login fails', () => {
        useAuthHook.useAuth.mockReturnValue({
            loginTraditional: loginTraditionalMock,
            loading: false,
            error: 'Credenciales inválidas',
        });
        render(_jsx(MemoryRouter, { children: _jsx(Login, {}) }));
        expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });
    it('should disable button when loading', () => {
        useAuthHook.useAuth.mockReturnValue({
            loginTraditional: loginTraditionalMock,
            loading: true,
            error: null,
        });
        render(_jsx(MemoryRouter, { children: _jsx(Login, {}) }));
        const submitButton = screen.getByRole('button', { name: /iniciando sesión.../i });
        expect(submitButton).toBeDisabled();
    });
});
