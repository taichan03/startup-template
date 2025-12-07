export interface User {
  id: number
  email: string
  full_name: string | null
  role: 'user' | 'admin'
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: number
  title: string
  description: string | null
  owner_id: number
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name?: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface ProjectCreate {
  title: string
  description?: string
}

export interface ProjectUpdate {
  title?: string
  description?: string
}
