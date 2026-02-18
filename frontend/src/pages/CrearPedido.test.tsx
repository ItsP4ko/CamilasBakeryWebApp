import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CrearPedido from './CrearPedido';
import * as usePedidosHook from '@/hooks/usePedidos';

// Mock del hook useCrearPedido
vi.mock('@/hooks/usePedidos', () => ({
    useCrearPedido: vi.fn(),
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

// Mock de framer-motion para evitar problemas de animación en tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
        button: ({ children, onClick, disabled, type, className }: any) => (
            <button onClick={onClick} disabled={disabled} type={type} className={className}>
                {children}
            </button>
        ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock de componentes lazy (Popups)
vi.mock('@/components/pedidos/PopupSeleccionarProducto', () => ({
    default: ({ isOpen, onClose, onSelect }: any) => isOpen ? (
        <div role="dialog">
            <button onClick={onClose}>Cerrar</button>
            <button onClick={() => onSelect({
                idMedida: 1,
                nombreTorta: 'Chocotorta',
                nombreMedida: 'Grande',
                cantidad: 1,
                extras: [],
                ingredientesExtras: []
            })}>Seleccionar Producto</button>
        </div>
    ) : null
}));

describe('CrearPedido Component', () => {
    const mutateMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (usePedidosHook.useCrearPedido as any).mockReturnValue({
            mutate: mutateMock,
            isPending: false,
        });

        // Mock window.alert
        vi.spyOn(globalThis, 'alert').mockImplementation(() => { });
    });

    it('should render form fields correctly', () => {
        render(
            <MemoryRouter>
                <CrearPedido />
            </MemoryRouter>
        );

        expect(screen.getByText(/Crear Nuevo Pedido/i)).toBeInTheDocument();
        expect(screen.getByText(/Información del Cliente/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Ej: María González/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Ej: 3413456789/i)).toBeInTheDocument();
    });

    it('should validate empty form submission', () => {
        render(
            <MemoryRouter>
                <CrearPedido />
            </MemoryRouter>
        );

        const submitButton = screen.getByRole('button', { name: /Guardar Pedido/i });
        fireEvent.click(submitButton);

        // Debería mostrar alerta porque no hay productos
        expect(globalThis.alert).toHaveBeenCalledWith('Debe agregar al menos un producto al pedido');
        expect(mutateMock).not.toHaveBeenCalled();
    });

    it('should handle input changes', () => {
        render(
            <MemoryRouter>
                <CrearPedido />
            </MemoryRouter>
        );

        const nombreInput = screen.getByPlaceholderText(/Ej: María González/i);
        const telefonoInput = screen.getByPlaceholderText(/Ej: 3413456789/i);

        fireEvent.change(nombreInput, { target: { value: 'Juan Perez' } });
        fireEvent.change(telefonoInput, { target: { value: '123456789' } });

        expect(nombreInput).toHaveValue('Juan Perez');
        expect(telefonoInput).toHaveValue('123456789');
    });

    it('should add a product and submit the order', async () => {
        render(
            <MemoryRouter>
                <CrearPedido />
            </MemoryRouter>
        );

        // 1. Llenar datos del cliente
        fireEvent.change(screen.getByPlaceholderText(/Ej: María González/i), { target: { value: 'Juan Perez' } });
        fireEvent.change(screen.getByPlaceholderText(/Ej: 3413456789/i), { target: { value: '123456789' } });

        // Simular fecha (Date picker puede ser tricky, usamos un string compatible)
        const dateInput = screen.getByLabelText(/Fecha de Entrega/i);
        fireEvent.change(dateInput, { target: { value: '2023-12-25' } });

        // 2. Abrir Popup de Productos
        fireEvent.click(screen.getByRole('button', { name: /Agregar Producto/i }));

        // 3. Seleccionar producto (Mocked Popup)
        // Wait for lazy load
        await waitFor(() => {
            expect(screen.getByText(/Seleccionar Producto/i)).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/Seleccionar Producto/i));

        // 4. Verificar que se agregó a la lista
        expect(screen.getByText('Chocotorta - Grande')).toBeInTheDocument();

        // 5. Enviar formulario
        const submitButton = screen.getByRole('button', { name: /Guardar Pedido/i });
        fireEvent.click(submitButton);

        // 6. Verificar llamada a mutate
        await waitFor(() => {
            expect(mutateMock).toHaveBeenCalled();
            const calledArg = mutateMock.mock.calls[0][0];
            expect(calledArg.nombreCliente).toBe('Juan Perez');
            expect(calledArg.detallePedidos).toHaveLength(1);
            expect(calledArg.detallePedidos[0].idMedida).toBe(1);
        });
    });

    it('should disable submit button when loading', () => {
        (usePedidosHook.useCrearPedido as any).mockReturnValue({
            mutate: mutateMock,
            isPending: true,
        });

        render(
            <MemoryRouter>
                <CrearPedido />
            </MemoryRouter>
        );

        const submitButton = screen.getByText('Guardando...');
        expect(submitButton).toBeDisabled();
    });
});
