import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spinner, Alert } from '@/components/ui'

export function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Check for error parameter
    const errorParam = searchParams.get('error')

    if (errorParam) {
      setError(errorParam)
      // Redirect to login after showing error
      setTimeout(() => {
        navigate('/login')
      }, 3000)
      return
    }

    // Tokens are now in httpOnly cookies set by the backend
    // Just redirect to dashboard
    navigate('/dashboard')
  }, [searchParams, navigate])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <Alert variant="error">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Authentication Error</h3>
              <p>{error}</p>
              <p className="text-sm">Redirecting to login...</p>
            </div>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4">
        <Spinner size="lg" />
        <p className="text-lg text-gray-700 font-medium">Completing sign in...</p>
      </div>
    </div>
  )
}
