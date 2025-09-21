import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wufgiklwxterumsfglxg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1Zmdpa2x3eHRlcnVtc2ZnbHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MDE0MjQsImV4cCI6MjA3Mzk3NzQyNH0.ZOyK_HZLB3FZaFeO2qHH5hRkGQwvAPcAn0LnepouDCo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);