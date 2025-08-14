export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // NOTE: in a real app, never store plain passwords
}

export const enum StorageKeys {
  USERS = "users",
  CURRENT_USER = "currentUserId"
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthError {
  message: string;
  code?: string;
  details?: string;
}
