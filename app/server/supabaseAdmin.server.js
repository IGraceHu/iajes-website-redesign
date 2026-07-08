import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mnjmyajjyxaoemhexhyt.supabase.co';
// Supabase Service Role Key defined on .env or Firebase

// can use this client to edit the newsletter subscribers table
export const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);