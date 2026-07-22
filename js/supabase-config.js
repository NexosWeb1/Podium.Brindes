/* ============================================================
   supabase-config.js — Credenciais públicas do Supabase.
   Cole aqui os dois valores de Project Settings > API.
   (A chave anon é pública por design; as regras RLS protegem
   os dados. NUNCA coloque a chave service_role aqui.)
   Enquanto vazio, o site/painel rodam em modo local (localStorage).
   ============================================================ */

export const SUPABASE_URL = 'https://swpfhijwmpjbdxpybfce.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cGZoaWp3bXBqYmR4cHliZmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjU2NDAsImV4cCI6MjEwMDMwMTY0MH0.dGEELdpONv1xzuUvUZh_dxucIpEY9995tWEFJVAvJ7w';

export const IMAGE_BUCKET = 'produtos';

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
