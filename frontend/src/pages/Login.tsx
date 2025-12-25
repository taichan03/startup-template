import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { AuthLayout } from '@/components/layout'
import { Input, Button, Alert, Divider } from '@/components/ui'

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ username: email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <GoogleSignInButton />

        <Divider text="Or continue with email" />

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="error">{error}</Alert>
          )}

          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Sign in
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
