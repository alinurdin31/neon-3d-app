const SUPABASE_URL = 'https://ixnimrrzvhnijiusojqr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bmltcnJ6dmhuaWppdXNvanFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3OTE0NTksImV4cCI6MjA4NjM2NzQ1OX0.nlXsW77m4BWVJYYjvaOiIwD8DAwBL3pB-jvGzyDmvBk';

export const supabase = {
    auth: {
        getUser: async () => {
            const session = localStorage.getItem('sb-auth-token');
            if (!session) return { data: { user: null }, error: null };
            const parsed = JSON.parse(session);
            return { data: { user: parsed.user }, error: null };
        },
        getSession: async () => {
            const session = localStorage.getItem('sb-auth-token');
            return { data: { session: session ? JSON.parse(session) : null }, error: null };
        },
        signIn: async ({ email, password }) => {
            const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('sb-auth-token', JSON.stringify(data));
                return { data, error: null };
            }
            return { data: null, error: data };
        },
        signUp: async ({ email, password, data }) => {
            const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, data })
            });
            const result = await res.json();
            if (res.ok) {
                // Supabase signup might require email confirmation, but usually returns the user
                return { data: result, error: null };
            }
            return { data: null, error: result };
        },
        signOut: async () => {
            try {
                const session = localStorage.getItem('sb-auth-token');
                if (session) {
                    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${JSON.parse(session).access_token}`
                        }
                    });
                }
            } catch (e) {
                console.error('Logout error:', e);
            }
            localStorage.removeItem('sb-auth-token');
            window.location.href = '/login';
        }
    },

    from: (table) => {
        const getAuthHeader = () => {
            const session = localStorage.getItem('sb-auth-token');
            if (!session) return `Bearer ${SUPABASE_ANON_KEY}`;
            try {
                const parsed = JSON.parse(session);
                return parsed.access_token ? `Bearer ${parsed.access_token}` : `Bearer ${SUPABASE_ANON_KEY}`;
            } catch (e) {
                return `Bearer ${SUPABASE_ANON_KEY}`;
            }
        };

        const headers = {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };

        return {
            select: async (query = '*') => {
                const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${query}`, {
                    headers: { ...headers, 'Authorization': getAuthHeader() }
                });
                return { data: await res.json(), error: res.ok ? null : true };
            },
            insert: async (data) => {
                const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                    method: 'POST',
                    headers: { ...headers, 'Authorization': getAuthHeader() },
                    body: JSON.stringify(data)
                });
                return { data: await res.json(), error: res.ok ? null : true };
            },
            update: async (match, data) => {
                const queryParams = Object.keys(match).map(k => `${k}=eq.${match[k]}`).join('&');
                const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${queryParams}`, {
                    method: 'PATCH',
                    headers: { ...headers, 'Authorization': getAuthHeader() },
                    body: JSON.stringify(data)
                });
                return { data: await res.json(), error: res.ok ? null : true };
            },
            delete: async (match) => {
                const queryParams = Object.keys(match).map(k => `${k}=eq.${match[k]}`).join('&');
                const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${queryParams}`, {
                    method: 'DELETE',
                    headers: { ...headers, 'Authorization': getAuthHeader() }
                });
                return { data: res.ok, error: res.ok ? null : true };
            },
            upsert: async (data, onConflict = 'id') => {
                const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                    method: 'POST',
                    headers: {
                        ...headers,
                        'Authorization': getAuthHeader(),
                        'Prefer': `resolution=merge-duplicates,return=representation`
                    },
                    body: JSON.stringify(data)
                });
                return { data: await res.json(), error: res.ok ? null : true };
            }
        };
    }
};
