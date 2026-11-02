import AuthForm from '../components/auth-form';
import AuthShell from '../components/auth-shell';
import { serverSupabase } from '../lib/supabase/server';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
export default async function Password() {
  const supabase = await serverSupabase();
  if (supabase) { const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/acceso?estado=enlace'); }
  return <AuthShell title="Elige tu contraseña" configured={!!supabase}><p>Utiliza entre 12 y 128 caracteres. No compartas esta contraseña.</p><AuthForm mode="password" configured={!!supabase} /></AuthShell>;
}
