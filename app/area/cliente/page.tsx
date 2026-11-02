import { requireAccount } from '../../lib/supabase/access';
import PrivateHome from '../../components/private-home';
export const dynamic = 'force-dynamic';
export default async function Client() {
  const { profile, supabase, user } = await requireAccount('client');
  const { data } = await supabase.from('clients').select('id').eq('profile_id', user.id).maybeSingle();
  return <PrivateHome role="client" name={profile.display_name} assigned={!!data} />;
}
