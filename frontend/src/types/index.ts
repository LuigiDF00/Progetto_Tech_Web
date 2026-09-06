export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string | null;
  created_at?: string;
  riddles_solved?: number;
  riddles_created?: number;
  solved_count?: number;
  created_count?: number;
  total_attempts?: number;
  avg_attempts?: number;
  stats?: {
    solved_count?: number;
    created_count?: number;
    total_attempts?: number;
    avg_attempts?: number;
    riddles_solved?: number;
    riddles_created?: number;
  };
}

export interface Riddle {
  id: number;
  title: string;
  description: string;
  public_pos_example: string;
  public_neg_example: string;
  created_at: string;
  author_id: number;
  author_name: string;
  author_avatar?: string | null;
  total_attempts?: number;
  solved_by_count?: number;
  is_solved_by_current_user?: number | boolean;
  is_solved?: boolean;
}

export interface Attempt {
  id?: number;
  proposed_regex: string;
  pos_passed_count: number;
  total_pos_count: number;
  neg_passed_count: number;
  total_neg_count: number;
  is_solved: boolean | number;
  created_at?: string;
}

export interface LeaderboardEntry {
  user_id: number;
  username: string;
  avatar_url: string | null;
  solved_count: number;
  riddles_solved?: number;
  created_count: number;
  riddles_created?: number;
  avg_attempts: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}
