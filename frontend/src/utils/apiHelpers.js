/**
 * Normaliza las respuestas inconsistentes del backend (success/Success, token/Token, etc.)
 */
// Normaliza una respuesta del backend a un formato consistente
export function normalizeBackendResponse(response) {
    return {
        success: response.success ?? response.Success ?? false,
        token: response.token ?? response.Token,
        username: response.username ?? response.Username,
        message: response.message ?? response.Message,
        data: response,
    };
}
// Extrae el valor de una propiedad que puede estar en minúscula o mayúscula
export function getFlexibleProperty(obj, propertyName) {
    const lowerCase = propertyName.toLowerCase();
    const upperCase = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
    return obj[lowerCase] ?? obj[upperCase] ?? obj[propertyName];
}
