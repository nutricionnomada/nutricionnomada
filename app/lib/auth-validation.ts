export type AuthState = { message: string; success?: boolean };
export function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function validPassword(value: string) { return value.length >= 12 && value.length <= 128; }
export function safeAuthNext(value: string | null) {
  return value === '/actualizar-contrasena' ? value : '/area';
}
export function homeForRole(role: unknown) {
  return role === 'professional' ? '/area/profesional' : role === 'client' ? '/area/cliente' : null;
}
