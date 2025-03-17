import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qvhnbpyhqztasdlpawxi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2aG5icHlocXp0YXNkbHBhd3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMzU2MDgsImV4cCI6MjA1NzgxMTYwOH0.bCdcMdJpPrISkJPPlKS4iYYLljI4tlLuuslWapm7TQk";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
