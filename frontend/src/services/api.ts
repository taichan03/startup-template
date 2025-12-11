import type {
  User,
  Project,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  ProjectCreate,
  ProjectUpdate,
  UserStats,
} from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send httpOnly cookies
      })

      if (!response.ok) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Always include credentials to send httpOnly cookies
    let response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    })

    // Handle 401 - try to refresh token
    if (response.status === 401) {
      const refreshed = await this.refreshAccessToken()
      if (refreshed) {
        // Retry request with new token (now in cookie)
        response = await fetch(url, {
          ...options,
          headers,
          credentials: 'include'
        })
      } else {
        throw new Error('Session expired. Please log in again.')
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T
    }

    return response.json()
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<User> {
    const user = await this.request<User>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return user
  }

  async login(data: LoginRequest): Promise<TokenResponse> {
    const formData = new URLSearchParams()
    formData.append('username', data.username)
    formData.append('password', data.password)

    const tokens = await this.request<TokenResponse>('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    })

    // Tokens are now in httpOnly cookies, no need to store them
    return tokens
  }

  async logout(): Promise<void> {
    await this.request('/api/v1/auth/logout', { method: 'POST' })
    // Cookies are cleared by the backend
  }

  // OAuth endpoints
  initiateGoogleLogin(): void {
    // Redirect to backend OAuth endpoint which will redirect to Google
    window.location.href = `${this.baseURL}/api/v1/auth/google/login`
  }

  async addPassword(password: string): Promise<User> {
    return this.request<User>('/api/v1/auth/add-password', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/v1/users/me')
  }

  // Project endpoints
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/api/v1/projects/')
  }

  async getProject(id: number): Promise<Project> {
    return this.request<Project>(`/api/v1/projects/${id}`)
  }

  async createProject(data: ProjectCreate): Promise<Project> {
    return this.request<Project>('/api/v1/projects/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProject(id: number, data: ProjectUpdate): Promise<Project> {
    return this.request<Project>(`/api/v1/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: number): Promise<void> {
    return this.request<void>(`/api/v1/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // Admin endpoints
  async getUserStats(): Promise<UserStats> {
    return this.request<UserStats>('/api/v1/admin/users/stats')
  }

  async getAllUsers(skip?: number, limit?: number, includeDeleted?: boolean): Promise<User[]> {
    const params = new URLSearchParams()
    if (skip !== undefined) params.append('skip', skip.toString())
    if (limit !== undefined) params.append('limit', limit.toString())
    if (includeDeleted) params.append('include_deleted', 'true')
    const queryString = params.toString()
    return this.request<User[]>(`/api/v1/admin/users${queryString ? `?${queryString}` : ''}`)
  }

  async deactivateUser(userId: number): Promise<User> {
    return this.request<User>(`/api/v1/admin/users/${userId}/deactivate`, {
      method: 'PUT',
    })
  }

  async activateUser(userId: number): Promise<User> {
    return this.request<User>(`/api/v1/admin/users/${userId}/activate`, {
      method: 'PUT',
    })
  }

  async changeUserRole(userId: number, role: 'admin' | 'user'): Promise<User> {
    return this.request<User>(`/api/v1/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    })
  }

  async deleteUser(userId: number): Promise<User> {
    return this.request<User>(`/api/v1/admin/users/${userId}`, {
      method: 'DELETE',
    })
  }

  // Check authentication status by attempting to get current user
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser()
      return true
    } catch {
      return false
    }
  }
}

export const api = new ApiClient(API_BASE_URL)
