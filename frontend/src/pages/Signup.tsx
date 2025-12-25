import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { AuthLayout } from '@/components/layout'
import { Input, Button, Alert, Divider } from '@/components/ui'

export function Signup() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register({ email, password, full_name: fullName })
      navigate('/login', { state: { message: 'Account created! Please log in.' } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">Get started with your free account</p>
        </div>

        <GoogleSignInButton text="Sign up with Google" />

        <Divider text="Or continue with email" />

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="error">{error}</Alert>
          )}

          <Input
            label="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            helperText="Optional"
          />

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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Sign up
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
