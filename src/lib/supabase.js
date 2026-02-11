const SUPABASE_URL = 'https://spznesttxigtwlymvxfr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BVZ6vSwPTPQnJlIR-5LMHg_5jeKhbPI';

export const supabase = {
    auth: {
        getUser: async () => {
            // For now, return a mock user or check localStorage/session
            const session = localStorage.getItem('sb-auth-token');
            return session ? JSON.parse(session).user : null;
        },
        signOut: async () => {
            // In a real implementation with supabase-js, this handles cookie/session clearing
            // With fetch, we would call the /auth/v1/logout endpoint
            try {
                await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('sb-auth-token'))?.access_token}`
                    }
                });
            } catch (e) {
                console.error('Logout error:', e);
            }
            localStorage.removeItem('sb-auth-token');
            window.location.reload();
        }
    }
};
