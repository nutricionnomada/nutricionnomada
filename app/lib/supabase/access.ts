import 'server-only';
import { redirect } from 'next/navigation';
import { serverSupabase } from './server';
import { homeForRole } from '../auth-validation';

export async function requireAccount(expectedRole?: 'professional' | 'client') {
  const supabase = await serverSupabase();
  if (!supabase) redirect('/acceso?estado=sin-configurar');
  const session = await supabase.auth.getUser().catch(() => null);
  if (!session) redirect('/acceso?estado=servicio');
  const { data: { user }, error } = session;
  if (error || !user) redirect('/acceso');
  // Only the server-controlled database profile defines the role, never URL or user_metadata.
  const { data: profile, error: profileError } = await supabase.from('profiles').select('id,display_name,role').eq('id', user.id).single();
  if (profileError || !homeForRole(profile?.role)) redirect('/acceso?estado=sin-perfil');
  if (expectedRole && profile.role !== expectedRole) redirect(homeForRole(profile.role)!);
  return { supabase, user, profile };
}
