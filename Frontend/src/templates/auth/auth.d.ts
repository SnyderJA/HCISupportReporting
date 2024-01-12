export interface AuthUser {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  roles?: [];
}

export type AuthStatus = 'NOT_CHECK' | 'WAITING_CHECK' | 'LOGGED_IN' | 'NOT_LOGGED_IN';

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | undefined;
}
