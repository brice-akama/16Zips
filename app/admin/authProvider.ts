export const authProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch('/api/auth/secure-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ✅ ensures cookie is stored
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Invalid credentials');
    }
  },

  logout: async () => {
    // ✅ Calls API to clear the cookie
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // ✅ sends auth cookie to server
    });

    return Promise.resolve();
  },

  checkAuth: async () => {
    // ✅ Uses cookie instead of token in header
    try {
      const response = await fetch('/api/protected', {
        method: 'GET',
        credentials: 'include', // ✅ sends cookie with request
      });

      if (!response.ok) {
        return Promise.reject('Not authenticated');
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject('Error validating token');
    }
  },

  checkError: (error: any) => {
    if (error.status === 401 || error.status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => Promise.resolve(),
};