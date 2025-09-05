const API_URL = 'http://localhost:5000/api/auth'; // Assuming your backend auth routes are here

const UserAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to login');
    }
    return data;
  },

  me: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null; // No token, no user
    }

    const response = await fetch(`${API_URL}/me`, { // Assuming a /me endpoint for fetching current user data
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      localStorage.removeItem('token'); // Token might be expired or invalid
      throw new Error(data.message || 'Failed to fetch user data');
    }
    return data;
  },

  logout: async () => {
    // For a stateless JWT, backend logout is often not strictly necessary
    // but we can simulate it or add a blacklist check on the backend if needed.
    localStorage.removeItem('token');
    console.log('User logged out (token removed from localStorage)');
    return { message: 'Logged out successfully' };
  },
};

export default UserAPI;
