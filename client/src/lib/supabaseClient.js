import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nhzzxymtvnrqjtzudfwe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oenp4eW10dm5ycWp0enVkZndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzM5MzYsImV4cCI6MjEwMDMwOTkzNn0.unofLogvMCJndhbGrm-za_DCXyJOWOO4YGYh0Uukee0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
