import test from 'node:test';
import assert from 'node:assert/strict';
import { validEmail, validPassword, safeAuthNext, homeForRole } from '../app/lib/auth-validation.ts';
test('validación de correo y contraseña nueva',()=>{
 assert(validEmail('persona@example.test'));assert(!validEmail('persona'));assert(!validEmail('a '.repeat(130)+'@example.test'));
 assert(validPassword('un-ejemplo-largo'));assert(!validPassword('corta'));assert(!validPassword('x'.repeat(129)));
});
test('el retorno de autenticación nunca acepta destinos externos o rutas arbitrarias',()=>{
 for(const path of ['https://example.test','//example.test','/area/profesional','\\evil.test','/actualizar-contrasena?next=otro',null])assert.equal(safeAuthNext(path),'/area');
 assert.equal(safeAuthNext('/actualizar-contrasena'),'/actualizar-contrasena');
});
test('los roles no reconocidos fallan de forma cerrada',()=>{
 assert.equal(homeForRole('professional'),'/area/profesional');assert.equal(homeForRole('client'),'/area/cliente');
 for(const role of ['admin','PROFESSIONAL','',null,undefined,{role:'professional'}])assert.equal(homeForRole(role),null);
});
