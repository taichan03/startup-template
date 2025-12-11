import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/services/api'
import type { User, UserStats } from '@/types'

export function AdminDashboard() {
  const { user: currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  // Confirmation modal state
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState<'deactivate' | 'delete' | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersData, statsData] = await Promise.all([
        api.getAllUsers(),
        api.getUserStats()
      ])
      setUsers(usersData)
      setStats(statsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const confirmAction = (user: User, action: 'deactivate' | 'delete') => {
    setSelectedUser(user)
    setModalAction(action)
    setShowModal(true)
  }

  const executeAction = async () => {
    if (!selectedUser || !modalAction) return

    setActionLoading(selectedUser.id)
    try {
      if (modalAction === 'deactivate') {
        await api.deactivateUser(selectedUser.id)
      } else if (modalAction === 'delete') {
        await api.deleteUser(selectedUser.id)
      }
      await loadData()
      setShowModal(false)
      setSelectedUser(null)
      setModalAction(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivate = async (user: User) => {
    setActionLoading(user.id)
    try {
      await api.activateUser(user.id)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate user')
    } finally {
      setActionLoading(null)
    }
  }

  const handleChangeRole = async (user: User, newRole: 'admin' | 'user') => {
    if (user.id === currentUser?.id) {
      setError('Cannot change your own role')
      return
    }

    setActionLoading(user.id)
    try {
      await api.changeUserRole(user.id, newRole)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change role')
    } finally {
      setActionLoading(null)
    }
  }

  const isCurrentUser = (user: User) => user.id === currentUser?.id

  const isLastAdmin = (user: User) => {
    return user.role === 'admin' && stats && stats.admin_users <= 1
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Back to Dashboard
              </button>
              <span className="text-gray-700">{currentUser?.full_name || currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Total Users</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_users}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Active</div>
              <div className="text-3xl font-bold text-green-600">{stats.active_users}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Inactive</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.inactive_users}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Admins</div>
              <div className="text-3xl font-bold text-blue-600">{stats.admin_users}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Deleted</div>
              <div className="text-3xl font-bold text-red-600">{stats.deleted_users}</div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage all users in the system</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className={isCurrentUser(user) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.full_name || '-'}
                      {isCurrentUser(user) && (
                        <span className="ml-2 text-xs text-blue-600 font-medium">(You)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user, e.target.value as 'admin' | 'user')}
                        disabled={isCurrentUser(user) || actionLoading === user.id}
                        className="text-sm border rounded px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      {isLastAdmin(user) && (
                        <span className="ml-2 text-xs text-red-600 font-medium">Last Admin</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_active ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {user.is_active ? (
                        <button
                          onClick={() => confirmAction(user, 'deactivate')}
                          disabled={isCurrentUser(user) || actionLoading === user.id}
                          className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(user)}
                          disabled={actionLoading === user.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => confirmAction(user, 'delete')}
                        disabled={isCurrentUser(user) || isLastAdmin(user) || actionLoading === user.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isLastAdmin(user) ? 'Cannot delete the last admin' : ''}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showModal && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full relative">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {modalAction === 'deactivate' ? 'Deactivate User' : 'Delete User'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {modalAction === 'deactivate'
                          ? `Are you sure you want to deactivate ${selectedUser.email}? They will be immediately logged out and unable to log back in until reactivated.`
                          : `Are you sure you want to delete ${selectedUser.email}? This action will soft delete the user but allow the email to be reused for new registrations.`
                        }
                      </p>
                      {modalAction === 'delete' && selectedUser.role === 'admin' && stats && stats.admin_users <= 1 && (
                        <p className="mt-2 text-sm text-red-600 font-medium">
                          Warning: This is the last admin user. Deleting this account will leave the system without an administrator.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={executeAction}
                  disabled={actionLoading !== null}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {actionLoading !== null ? 'Processing...' : 'Confirm'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={actionLoading !== null}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
