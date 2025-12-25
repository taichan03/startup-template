import { Button } from '@/components/ui'
import type { User } from '@/types'

interface NavbarProps {
  user?: User | null
  onLogout: () => void
  showAdminButton?: boolean
  onNavigateAdmin?: () => void
}

export function Navbar({ user, onLogout, showAdminButton, onNavigateAdmin }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Startup <span className="text-orange-500">Template</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user?.profile_picture_url ? (
              <img
                src={user.profile_picture_url}
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-gray-200"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold border-2 border-orange-600">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
              </div>
            )}
            <span className="text-gray-700 font-medium hidden sm:inline">
              {user?.full_name || user?.email}
            </span>

            {showAdminButton && onNavigateAdmin && (
              <Button variant="secondary" size="sm" onClick={onNavigateAdmin}>
                Admin Dashboard
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
