export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

/** Response of POST /auth/login */
export interface LoginResponse {
  status: 'success';
  data: AuthUser;
  token: string;
}

/** Response of POST /auth/register (201) – the backend also sets the `jwt` cookie */
export interface RegisterResponse {
  status: 'success';
  data: AuthUser & { name: string; createdAt: string };
  token: string;
}

/** Response of GET /auth/me */
export interface MeResponse {
  status: 'success';
  data: AuthUser & { name: string; createdAt: string };
}

/** Response of POST /auth/logout */
export interface LogoutResponse {
  status: 'success';
  message: string;
}

/** Error body returned by the backend, e.g. `{ error: 'Invalid email or password' }` */
export interface ApiError {
  error: string;
}
