import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mnjmyajjyxaoemhexhyt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uam15YWpqeXhhb2VtaGV4aHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDY0OTIsImV4cCI6MjA4NjkyMjQ5Mn0.C7mA1tq4i_V9-1nRwNFmHJe3rczQX27PDJwHfGE2LwI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
