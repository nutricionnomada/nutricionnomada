'use client';
import Link from 'next/link';
export default function PrivateError({ reset }: { reset: () => void }) {
  return <main className="auth-shell"><section className="card auth-card"><h1>No se ha podido abrir tu espacio</h1><p>Puede haber un problema de conexión. No mostramos detalles privados del servicio.</p><button className="primary" onClick={reset}>Volver a intentar</button><Link className="text-link" href="/acceso">Volver al acceso</Link></section></main>;
}
