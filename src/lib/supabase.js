const SUPABASE_URL = 'https://spznesttxigtwlymvxfr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BVZ6vSwPTPQnJlIR-5LMHg_5jeKhbPI';

export const supabase = {
    auth: {
        getUser: async () => {
            const session = localStorage.getItem('sb-auth-token');
            return session ? JSON.parse(session).user : null;
        },
        signOut: async () => {
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
    },

    // Lightweight CRUD helpers using fetch
    from: (table) => {
        const headers = {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('sb-auth-token'))?.access_token || SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };

        return {
            select: async (query = '*') => {
                const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${query}`, { headers });
                return { data: await res.json(), error: res.ok ? null : true };
            },
            insert: async (data) => {
                const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(data)
                });
                return { data: await res.json(), error: res.ok ? null : true };
            },
            update: async (match, data) => {
                const queryParams = Object.keys(match).map(k => `${k}=eq.${match[k]}`).join('&');
                const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${queryParams}`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify(data)
                });
                return { data: await res.json(), error: res.ok ? null : true };
            },
            delete: async (match) => {
                const queryParams = Object.keys(match).map(k => `${k}=eq.${match[k]}`).join('&');
                const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${queryParams}`, {
                    method: 'DELETE',
                    headers
                });
                return { data: res.ok, error: res.ok ? null : true };
            },
            upsert: async (data, onConflict = 'id') => {
                const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                    method: 'POST',
                    headers: { ...headers, 'Prefer': `resolution=merge-duplicates,return=representation` },
                    body: JSON.stringify(data)
                });
                return { data: await res.json(), error: res.ok ? null : true };
            }
        };
    }
};
