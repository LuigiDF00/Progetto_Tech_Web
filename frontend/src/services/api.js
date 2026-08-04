// API Client Helper per RegexRiddle Frontend

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  // Se non è FormData, imposta Content-Type json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Errore HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth API
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      usernameOrEmail: payload.usernameOrEmail || payload.emailOrUsername,
      password: payload.password
    })
  }),
  getMe: () => request('/auth/me'),


  // Riddles API
  getRiddles: () => request('/riddles'),
  getRiddleById: (id) => request(`/riddles/${id}`),
  createRiddle: (payload) => request('/riddles', { method: 'POST', body: JSON.stringify(payload) }),
  submitAttempt: (id, proposedRegex) => request(`/riddles/${id}/attempt`, {
    method: 'POST',
    body: JSON.stringify({ proposed_regex: proposedRegex })
  }),

  // User Profile API
  getProfile: () => request('/users/profile'),
  getUserStats: (userId) => request(`/users/${userId}/stats`),
  uploadAvatar: (formData) => request('/users/avatar', {
    method: 'POST',
    body: formData // FormData imposterà automaticamente le opzioni multipart/form-data
  }),

  // Leaderboard API
  getLeaderboard: () => request('/leaderboard')
};
