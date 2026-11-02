import { redirect } from 'next/navigation';
import { requireAccount } from '../lib/supabase/access';
import { homeForRole } from '../lib/auth-validation';
export const dynamic = 'force-dynamic';
export default async function Area() { const { profile } = await requireAccount(); redirect(homeForRole(profile.role)!); }
