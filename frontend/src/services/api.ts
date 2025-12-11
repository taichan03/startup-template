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
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.loadTokens()
  }

  private loadTokens() {
    this.accessToken = localStorage.getItem('access_token')
    this.refreshToken = localStorage.getItem('refresh_token')
  }

  private saveTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
  }

  private clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false

    try {
      const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      })

      if (!response.ok) {
        this.clearTokens()
        return false
      }

      const data: TokenResponse = await response.json()
      this.saveTokens(data.access_token, data.refresh_token)
      return true
    } catch {
      this.clearTokens()
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

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    let response = await fetch(url, { ...options, headers })

    // Handle 401 - try to refresh token
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken()
      if (refreshed) {
        // Retry request with new token
        headers['Authorization'] = `Bearer ${this.accessToken}`
        response = await fetch(url, { ...options, headers })
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

    this.saveTokens(tokens.access_token, tokens.refresh_token)
    return tokens
  }

  async logout(): Promise<void> {
    await this.request('/api/v1/auth/logout', { method: 'POST' })
    this.clearTokens()
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

  isAuthenticated(): boolean {
    return !!this.accessToken
  }
}

export const api = new ApiClient(API_BASE_URL)
