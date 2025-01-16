import { supabase } from '../lib/supabase';

async function checkProfilesTable() {
  try {
    // Obtener información de la tabla profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error checking profiles table:', error);
      return;
    }

    console.log('Profiles table structure:', data);
    
    // Verificar políticas RLS
    const { data: rlsData, error: rlsError } = await supabase
      .rpc('get_rls_policies', { table_name: 'profiles' });

    if (rlsError) {
      console.error('Error getting RLS policies:', rlsError);
      return;
    }

    console.log('RLS policies for profiles table:', rlsData);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkProfilesTable();
