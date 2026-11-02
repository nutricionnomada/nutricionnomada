import AuthForm from '../components/auth-form';
import AuthShell from '../components/auth-shell';
import { appOrigin, supabaseConfig } from '../lib/supabase/config';
export const dynamic = 'force-dynamic';
export default function Recover() {
  const configured = !!supabaseConfig() && !!appOrigin();
  return <AuthShell title="Recupera tu acceso" configured={configured}><p>Si tienes una cuenta, recibirás un enlace de un solo uso para cambiar tu contraseña.</p><AuthForm mode="recover" configured={configured} /></AuthShell>;
}
