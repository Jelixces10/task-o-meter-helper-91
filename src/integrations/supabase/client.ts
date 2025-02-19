
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://sucydrdhwyokmphkicec.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1Y3lkcmRod3lva21waGtpY2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NzM1NzMsImV4cCI6MjA1NTU0OTU3M30.gym90OMhbq-1bn_aoA8iePq4ew6LM5S0S80P6_eKO_c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
