/**
 * Fábrica centralizada de query keys para TanStack Query.
 *
 * Beneficios:
 * - Evita strings mágicos dispersos en el código
 * - Garantiza invalidaciones precisas (no invalida de más ni de menos)
 * - TypeScript infiere los tipos correctamente
 * - Facilita el prefetch y el stale control por entidad
 *
 * Uso:
 *   queryKeys.pedidos.all         → ['pedidos']
 *   queryKeys.pedidos.lists()     → ['pedidos', 'list']
 *   queryKeys.pedidos.list(p)     → ['pedidos', 'list', { page: 1, ... }]
 *   queryKeys.pedidos.detail(id)  → ['pedidos', 'detail', 42]
 */
export const queryKeys = {
    // ── Pedidos ──────────────────────────────────────────────
    pedidos: {
        all: ['pedidos'],
        lists: () => ['pedidos', 'list'],
        list: (params) => ['pedidos', 'list', params],
        details: () => ['pedidos', 'detail'],
        detail: (id) => ['pedidos', 'detail', id],
        filtro: (filtros) => ['pedidos', 'filtro', filtros],
        pendientes: () => ['pedidos', 'pendientes'],
    },
    // ── Tortas ───────────────────────────────────────────────
    tortas: {
        all: ['tortas'],
        lists: () => ['tortas', 'list'],
        detail: (id) => ['tortas', 'detail', id],
        medidas: (tortaId) => ['tortas', 'medidas', tortaId],
        medidaDetalle: (medidaId) => ['tortas', 'medida-detalle', medidaId],
    },
    // ── Ingredientes ─────────────────────────────────────────
    ingredientes: {
        all: ['ingredientes'],
        lists: () => ['ingredientes', 'list'],
        stockBajo: () => ['ingredientes', 'stock-bajo'],
    },
    // ── Clientes ─────────────────────────────────────────────
    clientes: {
        all: ['clientes'],
        search: (query) => ['clientes', 'search', query],
    },
    // ── CostosExtra ──────────────────────────────────────────
    costosExtra: {
        all: ['costos-extra'],
        lists: () => ['costos-extra', 'list'],
    },
    // ── Reportes ─────────────────────────────────────────────
    reportes: {
        all: ['reportes'],
        dashboard: () => ['reportes', 'dashboard'],
        ventas: (params) => ['reportes', 'ventas', params],
        finanzas: (params) => ['reportes', 'finanzas', params],
        tortas: (params) => ['reportes', 'tortas', params],
        stock: () => ['reportes', 'stock'],
        clientes: (params) => ['reportes', 'clientes', params],
    },
};
