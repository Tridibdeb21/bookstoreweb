import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  let supabaseUrl = process.env.SUPABASE_URL?.trim();
  let supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  // Remove surrounding quotes if user entered them
  supabaseUrl = supabaseUrl.replace(/^["']|["']$/g, '');
  supabaseKey = supabaseKey.replace(/^["']|["']$/g, '');

  // Ensure https:// protocol is present
  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    supabaseUrl = `https://${supabaseUrl}`;
  }

  // Handle if user pasted the dashboard URL: https://supabase.com/dashboard/project/<project-ref>
  const dashboardMatch = supabaseUrl.match(/supabase\.com\/dashboard\/project\/([a-z0-9_-]+)/i);
  if (dashboardMatch && dashboardMatch[1]) {
    supabaseUrl = `https://${dashboardMatch[1]}.supabase.co`;
  }

  // Remove trailing subpaths like /rest/v1 or /auth/v1
  supabaseUrl = supabaseUrl.replace(/\/(rest|auth)\/v1.*$/i, '');
  // Remove trailing slashes
  supabaseUrl = supabaseUrl.replace(/\/+$/, '');

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      }
    });
  }

  return supabaseClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
}
