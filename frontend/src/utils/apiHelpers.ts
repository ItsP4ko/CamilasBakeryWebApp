/**
 * Normaliza las respuestas inconsistentes del backend (success/Success, token/Token, etc.)
 */

interface BackendResponse {
  success?: boolean;
  Success?: boolean;
  token?: string;
  Token?: string;
  username?: string;
  Username?: string;
  message?: string;
  Message?: string;
  [key: string]: any;
}

interface NormalizedResponse {
  success: boolean;
  token?: string;
  username?: string;
  message?: string;
  data?: any;
}


 // Normaliza una respuesta del backend a un formato consistente

export function normalizeBackendResponse<T = any>(response: BackendResponse): NormalizedResponse & { data?: T } {
  return {
    success: response.success ?? response.Success ?? false,
    token: response.token ?? response.Token,
    username: response.username ?? response.Username,
    message: response.message ?? response.Message,
    data: response as T,
  };
}


 // Extrae el valor de una propiedad que puede estar en minúscula o mayúscula

export function getFlexibleProperty<T>(
  obj: Record<string, any>,
  propertyName: string
): T | undefined {
  const lowerCase = propertyName.toLowerCase();
  const upperCase = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
  
  return obj[lowerCase] ?? obj[upperCase] ?? obj[propertyName];
}
