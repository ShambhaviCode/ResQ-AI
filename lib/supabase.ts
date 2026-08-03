import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseConfig() {
  return {
    url: supabaseUrl ?? '',
    anonKey: supabaseAnonKey ?? '',
    serviceRoleKey: serviceRoleKey ?? '',
  };
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createSupabaseAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function signUpWithEmail({ email, password, options }: { email: string; password: string; options?: { data?: Record<string, unknown> } }) {
  const client = createSupabaseClient();
  if (!client) {
    return { ok: false, error: { message: 'Missing Supabase credentials' } };
  }

  const { data, error } = await client.auth.signUp({ email, password, options });
  return { ok: !error, data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const client = createSupabaseClient();
  if (!client) {
    return { ok: false, error: { message: 'Missing Supabase credentials' } };
  }

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  return { ok: !error, data, error };
}

export async function uploadIncidentImage(file: File, incidentId: string) {
  const client = createSupabaseClient();
  if (!client) {
    return null;
  }

  const fileName = `${incidentId}/${file.name}`;
  const { data, error } = await client.storage.from('incident-images').upload(fileName, file, { upsert: true, cacheControl: '3600' });
  if (error || !data) {
    return null;
  }

  return client.storage.from('incident-images').getPublicUrl(fileName).data.publicUrl;
}
