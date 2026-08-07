import { User, Riddle, Attempt, LeaderboardEntry } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...getAuthHeaders(),
    ...((options.headers as Record<string, string>) || {})
  };

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

  return data as T;
}

export const api = {
  // Auth API
  register: (payload: { username: string; email: string; password: string }) => 
    request<{ token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  
  login: (payload: { usernameOrEmail?: string; emailOrUsername?: string; password: string }) => 
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        usernameOrEmail: payload.usernameOrEmail || payload.emailOrUsername,
        password: payload.password
      })
    }),
  
  getMe: () => request<{ user: User }>('/auth/me'),

  // Riddles API
  getRiddles: () => request<{ riddles: Riddle[] }>('/riddles'),
  getRiddleById: (id: string | number) => request<{ riddle: Riddle; attempts: Attempt[] }>(`/riddles/${id}`),
  createRiddle: (payload: {
    title: string;
    description: string;
    secret_regex: string;
    public_pos_example: string;
    public_neg_example: string;
    control_pos_strings: string[];
    control_neg_strings: string[];
  }) => request<{ message: string; riddle_id: number }>('/riddles', { method: 'POST', body: JSON.stringify(payload) }),
  
  submitAttempt: (id: string | number, proposedRegex: string) => request<{
    message: string;
    result: Attempt;
  }>(`/riddles/${id}/attempt`, {
    method: 'POST',
    body: JSON.stringify({ proposed_regex: proposedRegex })
  }),

  // User Profile API
  getProfile: () => request<{ user: User }>('/users/profile'),
  getUserStats: (userId: string | number) => request<{ user: User }>(`/users/${userId}/stats`),
  uploadAvatar: (formData: FormData) => request<{ message: string; avatar_url: string }>('/users/avatar', {
    method: 'POST',
    body: formData
  }),

  // Leaderboard API
  getLeaderboard: () => request<{ leaderboard: LeaderboardEntry[] }>('/leaderboard')
};

export default api;
