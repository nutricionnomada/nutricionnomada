'use client';
import { useActionState } from 'react';
import { login, recover, updatePassword } from '../acciones/auth';

export default function AuthForm({ mode, configured }: { mode: 'login' | 'recover' | 'password'; configured: boolean }) {
  const action = mode === 'login' ? login : mode === 'recover' ? recover : updatePassword;
  const [state, submit, pending] = useActionState(action, { message: '' });
  return <form action={submit} className="auth-form">
    <fieldset disabled={!configured || pending}>
      {mode !== 'password' && <label>Correo electrónico<input type="email" name="email" required maxLength={254} autoComplete="email" /></label>}
      {mode !== 'recover' && <label>{mode === 'password' ? 'Nueva contraseña' : 'Contraseña'}<input type="password" name="password" required minLength={mode === 'password' ? 12 : undefined} maxLength={128} autoComplete={mode === 'password' ? 'new-password' : 'current-password'} /></label>}
      {mode === 'password' && <label>Repite la nueva contraseña<input type="password" name="confirmation" required minLength={12} maxLength={128} autoComplete="new-password" /></label>}
      <button className="primary" type="submit">{pending ? 'Un momento…' : mode === 'login' ? 'Iniciar sesión' : mode === 'recover' ? 'Solicitar enlace' : 'Guardar contraseña'}</button>
    </fieldset>
    {state.message && <p className="notice" role={state.success ? 'status' : 'alert'}>{state.message}</p>}
  </form>;
}
