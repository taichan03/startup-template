import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full space-y-4 p-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-red-800">Authentication Error</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <p className="mt-2 text-sm text-red-600">Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-lg text-gray-700">Completing sign in...</p>
      </div>
    </div>
  )
}
