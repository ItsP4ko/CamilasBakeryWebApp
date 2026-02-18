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
export const queryKeys = {
    // ─── Pedidos ─────────────────────────────────────────────────────────────
    pedidos: {
        all: ['pedidos'],
        lists: () => [...queryKeys.pedidos.all, 'list'],
        list: (filters) => [...queryKeys.pedidos.lists(), filters ?? {}],
        details: () => [...queryKeys.pedidos.all, 'detail'],
        detail: (id) => [...queryKeys.pedidos.details(), id],
        byEstado: (estado) => [...queryKeys.pedidos.all, 'estado', estado],
        pendientes: () => [...queryKeys.pedidos.all, 'pendientes'],
        byCliente: (idCliente) => [...queryKeys.pedidos.all, 'cliente', idCliente],
        byFechaRange: (fechaInicio, fechaFin) => [...queryKeys.pedidos.all, 'fecha-range', { fechaInicio, fechaFin }],
    },
    // ─── Clientes ────────────────────────────────────────────────────────────
    clientes: {
        all: ['clientes'],
        lists: () => [...queryKeys.clientes.all, 'list'],
        list: (filters) => [...queryKeys.clientes.lists(), filters ?? {}],
        details: () => [...queryKeys.clientes.all, 'detail'],
        detail: (id) => [...queryKeys.clientes.details(), id],
        search: (query) => [...queryKeys.clientes.all, 'search', query],
    },
    // ─── Tortas ──────────────────────────────────────────────────────────────
    tortas: {
        all: ['tortas'],
        lists: () => [...queryKeys.tortas.all, 'list'],
        list: () => [...queryKeys.tortas.lists()],
        details: () => [...queryKeys.tortas.all, 'detail'],
        detail: (id) => [...queryKeys.tortas.details(), id],
        medidas: (idTorta) => [...queryKeys.tortas.all, 'medidas', idTorta],
    },
    // ─── Ingredientes ────────────────────────────────────────────────────────
    ingredientes: {
        all: ['ingredientes'],
        lists: () => [...queryKeys.ingredientes.all, 'list'],
        list: () => [...queryKeys.ingredientes.lists()],
        details: () => [...queryKeys.ingredientes.all, 'detail'],
        detail: (id) => [...queryKeys.ingredientes.details(), id],
        stock: () => [...queryKeys.ingredientes.all, 'stock'],
    },
    // ─── Costos Extras ───────────────────────────────────────────────────────
    costosExtras: {
        all: ['costos-extras'],
        lists: () => [...queryKeys.costosExtras.all, 'list'],
        list: () => [...queryKeys.costosExtras.lists()],
        details: () => [...queryKeys.costosExtras.all, 'detail'],
        detail: (id) => [...queryKeys.costosExtras.details(), id],
    },
    // ─── Reportes ────────────────────────────────────────────────────────────
    reportes: {
        all: ['reportes'],
        ventas: (filters) => [...queryKeys.reportes.all, 'ventas', filters],
        ingredientes: (filters) => [...queryKeys.reportes.all, 'ingredientes', filters],
        clientes: (filters) => [...queryKeys.reportes.all, 'clientes', filters],
    },
    // ─── Auth ────────────────────────────────────────────────────────────────
    auth: {
        all: ['auth'],
        user: () => [...queryKeys.auth.all, 'user'],
    },
};
