import Link from 'next/link';
import Brand from './brand';

export default function AuthShell({ title, configured, children }: { title: string; configured: boolean; children: React.ReactNode }) {
  return <main className="auth-shell"><section className="card auth-card"><Link href="/" aria-label="Volver a la demostración"><Brand large /></Link><h1>{title}</h1>
    {!configured && <p className="notice" role="status">El acceso privado está pendiente de conectar Supabase. Los campos están desactivados; no introduzcas datos personales. La demostración sigue disponible.</p>}
    {children}<Link className="text-link" href="/">Volver a la demostración con datos ficticios</Link>
  </section></main>;
}
