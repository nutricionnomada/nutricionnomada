import { NextResponse, type NextRequest } from 'next/server';
import { serverSupabase } from '../../lib/supabase/server';
import { safeAuthNext } from '../../lib/auth-validation';
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const supabase = await serverSupabase();
  if (code && code.length < 4096 && supabase) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(safeAuthNext(request.nextUrl.searchParams.get('next')), request.url), { headers: { 'Cache-Control': 'no-store' } });
    } catch { /* Invalid/expired exchanges always return to access. */ }
  }
  return NextResponse.redirect(new URL('/acceso?estado=enlace', request.url), { headers: { 'Cache-Control': 'no-store' } });
}
