import { createClient } from '@supabase/supabase-js';

// Leggiamo le chiavi segrete dal file .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Creiamo il "client" che useremo nel resto dell'app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);