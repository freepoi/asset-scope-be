import { Method } from '../types';

export function serializeParams(
  params: object | undefined,
  method: Method,
): string {
  if (!params) {
    return '';
  }

  if (method !== 'GET') {
    return JSON.stringify(params);
  }

  const queryString = Object.entries(params)
    .filter(pair => pair[1] !== undefined)
    .map(pair => `${pair[0]}=${pair[1]}`)
    .join('&');

  // Prevent trailing `?` if no params are provided
  return queryString ? `?${queryString}` : queryString;
}
