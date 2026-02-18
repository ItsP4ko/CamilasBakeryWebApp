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
    all: ['pedidos'] as const,
    lists: () => ['pedidos', 'list'] as const,
    list: (params: Record<string, unknown>) =>
      ['pedidos', 'list', params] as const,
    details: () => ['pedidos', 'detail'] as const,
    detail: (id: number) => ['pedidos', 'detail', id] as const,
    filtro: (filtros: Record<string, unknown>) =>
      ['pedidos', 'filtro', filtros] as const,
    pendientes: () => ['pedidos', 'pendientes'] as const,
  },

  // ── Tortas ───────────────────────────────────────────────
  tortas: {
    all: ['tortas'] as const,
    lists: () => ['tortas', 'list'] as const,
    detail: (id: number) => ['tortas', 'detail', id] as const,
    medidas: (tortaId: number) => ['tortas', 'medidas', tortaId] as const,
    medidaDetalle: (medidaId: number) =>
      ['tortas', 'medida-detalle', medidaId] as const,
  },

  // ── Ingredientes ─────────────────────────────────────────
  ingredientes: {
    all: ['ingredientes'] as const,
    lists: () => ['ingredientes', 'list'] as const,
    stockBajo: () => ['ingredientes', 'stock-bajo'] as const,
  },

  // ── Clientes ─────────────────────────────────────────────
  clientes: {
    all: ['clientes'] as const,
    search: (query: string) => ['clientes', 'search', query] as const,
  },

  // ── CostosExtra ──────────────────────────────────────────
  costosExtra: {
    all: ['costos-extra'] as const,
    lists: () => ['costos-extra', 'list'] as const,
  },

  // ── Reportes ─────────────────────────────────────────────
  reportes: {
    all: ['reportes'] as const,
    dashboard: () => ['reportes', 'dashboard'] as const,
    ventas: (params: Record<string, unknown>) =>
      ['reportes', 'ventas', params] as const,
    finanzas: (params: Record<string, unknown>) =>
      ['reportes', 'finanzas', params] as const,
    tortas: (params: Record<string, unknown>) =>
      ['reportes', 'tortas', params] as const,
    stock: () => ['reportes', 'stock'] as const,
    clientes: (params: Record<string, unknown>) =>
      ['reportes', 'clientes', params] as const,
  },
} as const;
