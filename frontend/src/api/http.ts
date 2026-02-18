import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

// ─── ApiError ────────────────────────────────────────────────────────────────
/**
 * Error tipado que encapsula respuestas HTTP del backend.
 * Compatible con el formato ProblemDetails (RFC 9457) que retorna la API.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly title: string,
    public readonly detail?: string,
    public readonly errors?: Record<string, string[]>,
    public readonly traceId?: string,
  ) {
    super(detail ?? title);
    this.name = 'ApiError';
  }

  get isUnauthorized() { return this.status === 401; }
  get isForbidden()    { return this.status === 403; }
  get isNotFound()     { return this.status === 404; }
  get isConflict()     { return this.status === 409; }
  get isServerError()  { return this.status >= 500; }
  get isValidation()   { return this.status === 400; }

  /**
   * Retorna el primer mensaje de error de validación si existe,
   * o el detail/title como fallback.
   */
  get userMessage(): string {
    if (this.errors) {
      const firstField = Object.values(this.errors)[0];
      if (firstField?.length) return firstField[0];
    }
    return this.detail ?? this.title;
  }

  static fromAxiosError(error: AxiosError<ProblemDetails>): ApiError {
    const data = error.response?.data;
    return new ApiError(
      data?.status ?? error.response?.status ?? 0,
      data?.title ?? 'Error inesperado',
      data?.detail,
      (data as ValidationProblemDetails)?.errors,
      data?.extensions?.traceId as string | undefined,
    );
  }
}

// ─── Tipos ProblemDetails ────────────────────────────────────────────────────
interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  extensions?: Record<string, unknown>;
}

interface ValidationProblemDetails extends ProblemDetails {
  errors?: Record<string, string[]>;
}

// ─── Cliente Axios ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30_000,
});

// Interceptor de request: adjunta JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de response: convierte errores Axios en ApiError tipados
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ProblemDetails>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      globalThis.location.href = '/login';
      return Promise.reject(new ApiError(401, 'Sesión expirada', 'Tu sesión expiró. Iniciá sesión nuevamente.'));
    }

    if (error.response) {
      // Error con respuesta del servidor (4xx, 5xx)
      return Promise.reject(ApiError.fromAxiosError(error));
    }

    if (error.request) {
      // Timeout o sin conexión
      return Promise.reject(
        new ApiError(0, 'Sin conexión', 'No se pudo conectar con el servidor. Verificá tu conexión a internet.'),
      );
    }

    return Promise.reject(new ApiError(0, 'Error de red', error.message));
  },
);

export default api;
