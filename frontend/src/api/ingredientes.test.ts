import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getIngredientes } from './ingredientes';
import api from './http';

// Mock del módulo api
vi.mock('./http', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('getIngredientes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should map PascalCase properties from backend correctly', async () => {
        // Arrange
        const mockResponse = {
            data: {
                Items: [
                    {
                        IdIngrediente: 1,
                        Nombre: 'Harina',
                        UnidadCompra: 'kg',
                        PrecioUnitario: 1500,
                        Stock: 50,
                    },
                ],
                TotalCount: 1,
                PageNumber: 1,
                PageSize: 20,
                TotalPages: 1,
            },
        };

        (api.get as any).mockResolvedValue(mockResponse);

        // Act
        const result = await getIngredientes(1, 20);

        // Assert
        expect(result.items).toHaveLength(1);
        expect(result.items[0]).toEqual({
            idIngrediente: 1,
            nombre: 'Harina',
            unidadCompra: 'kg',
            precioUnitario: 1500,
            stock: 50,
        });
        expect(result.totalCount).toBe(1);
        expect(result.pageNumber).toBe(1);
        expect(result.pageSize).toBe(20);
        expect(result.totalPages).toBe(1);
    });

    it('should map camelCase properties (if backend changes) correctly', async () => {
        // Arrange
        const mockResponse = {
            data: {
                items: [
                    {
                        idIngrediente: 2,
                        nombre: 'Azucar',
                        unidadCompra: 'kg',
                        precioUnitario: 1200,
                        stock: 30,
                    },
                ],
                totalCount: 1,
                pageNumber: 1,
                pageSize: 20,
                totalPages: 1,
            },
        };

        (api.get as any).mockResolvedValue(mockResponse);

        // Act
        const result = await getIngredientes(1, 20);

        // Assert
        expect(result.items[0].nombre).toBe('Azucar');
    });

    it('should handle empty response gracefully', async () => {
        // Arrange
        const mockResponse = {
            data: {
                items: [],
                totalCount: 0,
                pageNumber: 1,
                pageSize: 20,
                totalPages: 0
            }
        };

        (api.get as any).mockResolvedValue(mockResponse);

        // Act
        const result = await getIngredientes(1, 20);

        // Assert
        expect(result.items).toHaveLength(0);
        expect(result.totalCount).toBe(0);
    });
});
