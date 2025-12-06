import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnhrmrdidvqazyimjvts.supabase.co';
// Ensure no whitespace in key from copy-paste
const supabaseKey = 'sb_publishable_N7BrA9myskiDu32hGgD1qw_OlHd0JkN'.trim();

export const supabase = createClient(supabaseUrl, supabaseKey);