import Link from 'next/link';
import AuthForm from '../components/auth-form';
import AuthShell from '../components/auth-shell';
import { supabaseConfig } from '../lib/supabase/config';
export const dynamic = 'force-dynamic';
export default async function Login({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const messages: Record<string, string> = { servicio: 'No se ha podido conectar con el servicio de acceso. Inténtalo más tarde.', 'sin-perfil': 'Tu cuenta aún no tiene un perfil autorizado. Contacta con la consulta.', enlace: 'El enlace no es válido o ha caducado. Solicita uno nuevo.', actualizada: 'Contraseña actualizada. Ya puedes iniciar sesión.' };
  const configured = !!supabaseConfig();
  return <AuthShell title="Accede a tu espacio" configured={configured}><p>Acceso por invitación de tu profesional. Tu rol lo verifica el servidor.</p>{estado && messages[estado] && <p className="notice" role="status">{messages[estado]}</p>}<AuthForm mode="login" configured={configured} /><Link href="/recuperar" className="text-link">He olvidado mi contraseña</Link></AuthShell>;
}
