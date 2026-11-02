import { requireAccount } from '../../lib/supabase/access';
import PrivateHome from '../../components/private-home';
export const dynamic = 'force-dynamic';
export default async function Professional() { const { profile } = await requireAccount('professional'); return <PrivateHome role="professional" name={profile.display_name} />; }
