import Link from 'next/link';
import Brand from './brand';
import { logout } from '../acciones/auth';
export default function PrivateHome({ name, role, assigned }: { name: string; role: 'professional' | 'client'; assigned?: boolean }) {
  return <main className="auth-shell"><section className="card auth-card private-card"><Brand large /><h1>{role === 'professional' ? 'Espacio profesional' : 'Tu espacio de acompañamiento'}</h1><p>Hola, {name || 'bienvenido/a'}. Tu cuenta y tu rol se han verificado en el servidor.</p>
    <p className="notice">Base de acceso de Fase 2. Las fichas, planes y registros privados se conectarán en Fase 3. No se cargan los datos ficticios de la demo como si fueran información de tu cuenta.</p>
    {role === 'client' && !assigned && <p>Todavía no hay una ficha de acompañamiento vinculada a tu cuenta. Contacta con tu profesional.</p>}
    <form action={logout}><button type="submit" className="primary">Cerrar sesión</button></form><Link className="text-link" href="/">Explorar el prototipo con datos ficticios</Link>
  </section></main>;
}
