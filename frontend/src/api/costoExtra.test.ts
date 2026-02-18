import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCostosExtra } from './costoExtra';
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

describe('getCostosExtra', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should map PascalCase properties from backend correctly', async () => {
        // Arrange
        const mockResponse = {
            data: {
                Items: [
                    {
                        IdCostoExtra: 10,
                        Nombre: 'Caja',
                        PrecioUnitario: 500,
                        Nota: 'Caja grande',
                        Stock: 100,
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
        const result = await getCostosExtra(1, 20);

        // Assert
        expect(result.items).toHaveLength(1);
        expect(result.items[0]).toEqual({
            idCostoExtra: 10,
            nombre: 'Caja',
            precioUnitario: 500,
            nota: 'Caja grande',
            stock: 100,
        });
        expect(result.totalCount).toBe(1);
    });

    it('should map camelCase properties correctly', async () => {
        // Arrange
        const mockResponse = {
            data: {
                items: [
                    {
                        idCostoExtra: 11,
                        nombre: 'Cinta',
                        precioUnitario: 50,
                        nota: null,
                        stock: null,
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
        const result = await getCostosExtra(1, 20);

        // Assert
        expect(result.items[0].nombre).toBe('Cinta');
        expect(result.items[0].stock).toBeNull();
    });
});
