function getSupabaseUrl() {
  return process.env.SUPABASE_URL || "";
}

function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getServiceRoleKey());
}

export function getSupabaseConfig() {
  return {
    url: getSupabaseUrl(),
    serviceRoleKey: getServiceRoleKey(),
  };
}
