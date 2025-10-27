// config.js - Supabase configuration
const SUPABASE_URL = 'https://wwkatfgmynvywzhajtnj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3a2F0ZmdteW52eXd6aGFqdG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1OTMzMDQsImV4cCI6MjA3NzE2OTMwNH0.i8iQARahMb8Q2DSPT8YrpgbO2qfmhuQkwcTOSk-DrhU';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

