/**
 * Utilidades para formateo de moneda
 */

/**
 * Formatea un número como dólares (USD)
 * @param value - El valor numérico a formatear
 * @returns String formateado como moneda en dólares
 * 
 * @example
 * formatCurrency(8264982.819999998) // "$ 8,264,983"
 * formatCurrency(1500000) // "$ 1,500,000"
 */
export const formatCurrency = (value: number | string | null | undefined): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (numericValue === null || numericValue === undefined || isNaN(numericValue)) {
    return '$ 0';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericValue);
};

/**
 * Formatea un número sin símbolo de moneda
 * @param value - El valor numérico a formatear
 * @returns String formateado con separadores de miles
 * 
 * @example
 * formatNumber(8264982.819999998) // "8,264,983"
 * formatNumber(1500000) // "1,500,000"
 */
export const formatNumber = (value: number | string | null | undefined): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (numericValue === null || numericValue === undefined || isNaN(numericValue)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericValue);
};

/**
 * Formatea un número como porcentaje
 * @param value - El valor numérico a formatear (0-100)
 * @param decimals - Número de decimales a mostrar (default: 1)
 * @returns String formateado como porcentaje
 * 
 * @example
 * formatPercentage(45.678) // "45.7%"
 * formatPercentage(100) // "100.0%"
 */
export const formatPercentage = (
  value: number | string | null | undefined,
  decimals: number = 1
): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (numericValue === null || numericValue === undefined || isNaN(numericValue)) {
    return '0%';
  }

  return `${numericValue.toFixed(decimals)}%`;
};
