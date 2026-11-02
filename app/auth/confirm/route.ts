import { NextResponse, type NextRequest } from 'next/server';
import { serverSupabase } from '../../lib/supabase/server';
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get('type');
  const supabase = await serverSupabase();
  if (token && token.length < 4096 && (type === 'invite' || type === 'recovery') && supabase) {
    try {
      const { error } = await supabase.auth.verifyOtp({ token_hash: token, type });
      if (!error) return NextResponse.redirect(new URL('/actualizar-contrasena', request.url), { headers: { 'Cache-Control': 'no-store' } });
    } catch { /* Do not leak verification details. */ }
  }
  return NextResponse.redirect(new URL('/acceso?estado=enlace', request.url), { headers: { 'Cache-Control': 'no-store' } });
}
