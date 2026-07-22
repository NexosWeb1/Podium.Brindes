/* ============================================================
   supabase-config.js — Credenciais públicas do Supabase.
   Cole aqui os dois valores de Project Settings > API.
   (A chave anon é pública por design; as regras RLS protegem
   os dados. NUNCA coloque a chave service_role aqui.)
   Enquanto vazio, o site/painel rodam em modo local (localStorage).
   ============================================================ */

export const SUPABASE_URL = 'https://swpfhijwmpjbdxpybfce.supabase.co';
export const SUPABASE_ANON_KEY = '';   // colar a chave anon public aqui

export const IMAGE_BUCKET = 'produtos';

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
