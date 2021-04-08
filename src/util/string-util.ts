/**
 * Determines if the passed value is a string
 * @param value Value to evaluate for stringiness
 */
export function isString(value: any) {
  return typeof value === 'string' || value instanceof String
}
