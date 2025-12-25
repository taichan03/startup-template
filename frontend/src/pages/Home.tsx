import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">
                <span className="text-orange-500">🔥</span> Startup Template
              </h1>

              <div className="hidden md:flex items-center space-x-6">
                {/* Features Dropdown */}
                <div className="relative group">
                  <button className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors flex items-center">
                    Features
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Core Features</h3>
                          <div className="space-y-3">
                            <a href="#auth" className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="text-orange-500 mt-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">Authentication</div>
                                <div className="text-xs text-gray-500">JWT tokens & OAuth ready</div>
                              </div>
                            </a>
                            <a href="#database" className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="text-orange-500 mt-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">Database Setup</div>
                                <div className="text-xs text-gray-500">PostgreSQL with SQLAlchemy</div>
                              </div>
                            </a>
                            <a href="#api" className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="text-orange-500 mt-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">FastAPI Backend</div>
                                <div className="text-xs text-gray-500">High performance API</div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <a href="#docs" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                  Docs
                </a>
                <a href="#pricing" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                  Pricing
                </a>

                {/* Examples Dropdown */}
                <div className="relative group">
                  <button className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors flex items-center">
                    Examples
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-6">
                      <div className="space-y-3">
                        <a href="#saas" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <span className="text-sm font-medium text-gray-900">SaaS Platform</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                        <a href="#marketplace" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <span className="text-sm font-medium text-gray-900">Marketplace</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                        <a href="#community" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <span className="text-sm font-medium text-gray-900">Community Platform</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resources Dropdown */}
                <div className="relative group">
                  <button className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors flex items-center">
                    Resources
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4">
                      <div className="space-y-2">
                        <a href="#blog" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="text-sm font-semibold text-gray-900">Blog</div>
                          <div className="text-xs text-gray-500">Tips and tutorials</div>
                        </a>
                        <a href="#documentation" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="text-sm font-semibold text-gray-900">Documentation</div>
                          <div className="text-xs text-gray-500">Complete guides</div>
                        </a>
                        <a href="#api-reference" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="text-sm font-semibold text-gray-900">API Reference</div>
                          <div className="text-xs text-gray-500">Full API docs</div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a href="https://github.com" className="hidden sm:flex items-center text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                7.0k
              </a>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign in
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm">
            <span className="text-gray-600">FastAPI + React + PostgreSQL</span>
            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Ship your startup
            <br />
            <span className="text-orange-500">at lightning speed</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A production-ready full-stack template with authentication, database,
            and deployment configs. Go from idea to MVP in hours, not weeks.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Get Started Free
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.open('https://github.com/anthropics/startup-template', '_blank')}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </Button>
          </div>

          {/* Feature Tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
            <span className="inline-flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Authentication Built-in
            </span>
            <span className="inline-flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              PostgreSQL + SQLAlchemy
            </span>
            <span className="inline-flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Google OAuth
            </span>
            <span className="inline-flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Docker Ready
            </span>
            <span className="inline-flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Admin Dashboard
            </span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-40 left-20 text-orange-500 text-4xl opacity-50 hidden lg:block">+</div>
        <div className="absolute top-60 right-32 text-orange-500 text-4xl opacity-50 hidden lg:block">+</div>
        <div className="absolute bottom-40 left-40 text-orange-500 text-4xl opacity-50 hidden lg:block">+</div>
      </main>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Built with FastAPI and React for optimal performance. Production-ready from day one.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure by Default</h3>
            <p className="text-gray-600">
              JWT authentication, password hashing, CORS protection, and security headers included.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fully Customizable</h3>
            <p className="text-gray-600">
              Clean architecture with TypeScript and Python. Extend and modify to fit your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm mb-4 md:mb-0">
              © 2024 Startup Template. Built for speed.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors">
                Documentation
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors">
                GitHub
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
