'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { validEmail, validPassword, type AuthState } from '../lib/auth-validation';
import { serverSupabase } from '../lib/supabase/server';
import { appOrigin } from '../lib/supabase/config';

const unavailable = { message: 'El acceso privado todavía no está conectado. Puedes seguir explorando la demostración sin introducir datos personales.' };
export async function login(_state: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await serverSupabase();
  if (!supabase) return unavailable;
  const email = String(form.get('email') || '').trim();
  const password = String(form.get('password') || '');
  if (!validEmail(email) || !password || password.length > 128) return { message: 'Revisa el correo y la contraseña.' };
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { message: 'No hemos podido iniciar sesión. Revisa tus datos o utiliza la recuperación de contraseña.' };
  } catch { return { message: 'No se ha podido conectar con el servicio. Inténtalo de nuevo más tarde.' }; }
  revalidatePath('/area', 'layout');
  redirect('/area');
}
export async function recover(_state: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await serverSupabase();
  const origin = appOrigin();
  if (!supabase || !origin) return unavailable;
  const email = String(form.get('email') || '').trim();
  if (!validEmail(email)) return { message: 'Escribe un correo válido.' };
  try { await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/actualizar-contrasena` }); }
  catch { /* Do not expose whether the account exists or provider details. */ }
  return { success: true, message: 'Si existe una cuenta con ese correo, recibirás instrucciones para recuperar el acceso. Revisa también el correo no deseado.' };
}
export async function updatePassword(_state: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await serverSupabase();
  if (!supabase) return unavailable;
  const password = String(form.get('password') || '');
  if (!validPassword(password)) return { message: 'Utiliza una contraseña de entre 12 y 128 caracteres.' };
  if (password !== String(form.get('confirmation') || '')) return { message: 'Las contraseñas no coinciden.' };
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: 'El enlace ha caducado o no es válido. Solicita uno nuevo.' };
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { message: 'No se ha podido actualizar la contraseña. Solicita un enlace nuevo o prueba con otra contraseña.' };
    await supabase.auth.signOut();
  } catch { return { message: 'No se ha podido conectar con el servicio. Inténtalo más tarde.' }; }
  redirect('/acceso?estado=actualizada');
}
export async function logout() {
  const supabase = await serverSupabase();
  if (supabase) await supabase.auth.signOut();
  revalidatePath('/area', 'layout');
  redirect('/acceso');
}
