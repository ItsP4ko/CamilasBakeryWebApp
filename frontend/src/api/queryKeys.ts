/**
 * Type-safe Query Key Factory for TanStack Query
 * 
 * Benefits:
 * - Type safety: TypeScript catches typos at compile time
 * - Autocomplete: IDE suggests available keys
 * - Refactoring: Rename once, updates everywhere
 * - Consistency: Single source of truth for all query keys
 * 
 * Usage:
 * ```typescript
 * useQuery({ 
 *   queryKey: queryKeys.pedidos.list({ estado: 'Pendiente' }),
 *   queryFn: () => api.get('/pedidos', { params: { estado: 'Pendiente' }})
 * })
 * 
 * // Invalidate specific queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.all })
 * queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.detail(123) })
 * ```
 */

export interface PedidoFilters {
    estado?: string;
    fechaInicio?: string;
    fechaFin?: string;
    idCliente?: number;
    pageNumber?: number;
    pageSize?: number;
}

export interface ClienteFilters {
    search?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface ReporteFilters {
    fechaInicio: string;
    fechaFin: string;
    tipo?: 'ventas' | 'ingredientes' | 'clientes';
}

export const queryKeys = {
    // ─── Pedidos ─────────────────────────────────────────────────────────────
    pedidos: {
        all: ['pedidos'] as const,
        lists: () => [...queryKeys.pedidos.all, 'list'] as const,
        list: (filters?: PedidoFilters) =>
            [...queryKeys.pedidos.lists(), filters ?? {}] as const,
        details: () => [...queryKeys.pedidos.all, 'detail'] as const,
        detail: (id: number) =>
            [...queryKeys.pedidos.details(), id] as const,
        byEstado: (estado: string) =>
            [...queryKeys.pedidos.all, 'estado', estado] as const,
        pendientes: () =>
            [...queryKeys.pedidos.all, 'pendientes'] as const,
        byCliente: (idCliente: number) =>
            [...queryKeys.pedidos.all, 'cliente', idCliente] as const,
        byFechaRange: (fechaInicio: string, fechaFin: string) =>
            [...queryKeys.pedidos.all, 'fecha-range', { fechaInicio, fechaFin }] as const,
        filtered: (filters: any) =>
            [...queryKeys.pedidos.all, 'filtered', filters] as const,
    },

    // ─── Clientes ────────────────────────────────────────────────────────────
    clientes: {
        all: ['clientes'] as const,
        lists: () => [...queryKeys.clientes.all, 'list'] as const,
        list: (filters?: ClienteFilters) =>
            [...queryKeys.clientes.lists(), filters ?? {}] as const,
        details: () => [...queryKeys.clientes.all, 'detail'] as const,
        detail: (id: number) =>
            [...queryKeys.clientes.details(), id] as const,
        search: (query: string) =>
            [...queryKeys.clientes.all, 'search', query] as const,
    },

    // ─── Tortas ──────────────────────────────────────────────────────────────
    tortas: {
        all: ['tortas'] as const,
        lists: () => [...queryKeys.tortas.all, 'list'] as const,
        list: () => [...queryKeys.tortas.lists()] as const,
        details: () => [...queryKeys.tortas.all, 'detail'] as const,
        detail: (id: number) =>
            [...queryKeys.tortas.details(), id] as const,
        medidas: (idTorta: number) =>
            [...queryKeys.tortas.all, 'medidas', idTorta] as const,
    },

    // ─── Ingredientes ────────────────────────────────────────────────────────
    ingredientes: {
        all: ['ingredientes'] as const,
        lists: () => [...queryKeys.ingredientes.all, 'list'] as const,
        list: () => [...queryKeys.ingredientes.lists()] as const,
        details: () => [...queryKeys.ingredientes.all, 'detail'] as const,
        detail: (id: number) =>
            [...queryKeys.ingredientes.details(), id] as const,
        stock: () =>
            [...queryKeys.ingredientes.all, 'stock'] as const,
    },

    // ─── Costos Extras ───────────────────────────────────────────────────────
    costosExtras: {
        all: ['costos-extras'] as const,
        lists: () => [...queryKeys.costosExtras.all, 'list'] as const,
        list: () => [...queryKeys.costosExtras.lists()] as const,
        details: () => [...queryKeys.costosExtras.all, 'detail'] as const,
        detail: (id: number) =>
            [...queryKeys.costosExtras.details(), id] as const,
    },

    // ─── Reportes ────────────────────────────────────────────────────────────
    reportes: {
        all: ['reportes'] as const,
        ventas: (filters: ReporteFilters) =>
            [...queryKeys.reportes.all, 'ventas', filters] as const,
        ingredientes: (filters: ReporteFilters) =>
            [...queryKeys.reportes.all, 'ingredientes', filters] as const,
        clientes: (filters: ReporteFilters) =>
            [...queryKeys.reportes.all, 'clientes', filters] as const,
    },

    // ─── Auth ────────────────────────────────────────────────────────────────
    auth: {
        all: ['auth'] as const,
        user: () => [...queryKeys.auth.all, 'user'] as const,
    },
} as const;

/**
 * Helper type to extract query key type from factory
 * 
 * Usage:
 * ```typescript
 * type PedidoListKey = QueryKey<typeof queryKeys.pedidos.list>;
 * ```
 */
export type QueryKey<T extends (...args: any[]) => readonly any[]> = ReturnType<T>;
