import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/services/api'
import type { User, UserStats } from '@/types'
import { Navbar, PageContainer } from '@/components/layout'
import { Card, Badge, Button, Modal, Alert, Spinner } from '@/components/ui'

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-lg text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        showAdminButton={false}
        onNavigateAdmin={() => navigate('/dashboard')}
      />

      <PageContainer>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900">Admin Dashboard</h2>
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            <div className="flex justify-between items-start">
              <span>{error}</span>
              <button onClick={() => setError('')} className="font-bold ml-4">×</button>
            </div>
          </Alert>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <div className="text-sm text-gray-600 mb-1">Total Users</div>
              <div className="text-4xl font-bold text-gray-900">{stats.total_users}</div>
            </Card>
            <Card>
              <div className="text-sm text-gray-600 mb-1">Active</div>
              <div className="text-4xl font-bold text-green-600">{stats.active_users}</div>
            </Card>
            <Card>
              <div className="text-sm text-gray-600 mb-1">Inactive</div>
              <div className="text-4xl font-bold text-yellow-600">{stats.inactive_users}</div>
            </Card>
            <Card>
              <div className="text-sm text-gray-600 mb-1">Admins</div>
              <div className="text-4xl font-bold text-orange-500">{stats.admin_users}</div>
            </Card>
            <Card>
              <div className="text-sm text-gray-600 mb-1">Deleted</div>
              <div className="text-4xl font-bold text-red-600">{stats.deleted_users}</div>
            </Card>
          </div>
        )}

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
            <p className="mt-1 text-sm text-gray-600">Manage all users in the system</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-t border-gray-200 hover:bg-gray-50 transition-colors ${isCurrentUser(user) ? 'bg-orange-50 hover:bg-orange-100' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.full_name || '-'}
                      {isCurrentUser(user) && (
                        <Badge variant="info" className="ml-2">You</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeRole(user, e.target.value as 'admin' | 'user')}
                          disabled={isCurrentUser(user) || actionLoading === user.id}
                          className="text-sm border-2 border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        {isLastAdmin(user) && (
                          <Badge variant="error">Last Admin</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="warning">Inactive</Badge>
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
                          className="text-yellow-600 hover:text-yellow-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(user)}
                          disabled={actionLoading === user.id}
                          className="text-green-600 hover:text-green-800 font-medium disabled:opacity-50 transition-colors"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => confirmAction(user, 'delete')}
                        disabled={isCurrentUser(user) || isLastAdmin(user) || actionLoading === user.id}
                        className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        </Card>
      </PageContainer>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal && !!selectedUser}
        onClose={() => setShowModal(false)}
        title={modalAction === 'deactivate' ? 'Deactivate User' : 'Delete User'}
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={actionLoading !== null}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={executeAction}
              disabled={actionLoading !== null}
              loading={actionLoading !== null}
            >
              Confirm
            </Button>
          </>
        }
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
                <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  {modalAction === 'deactivate'
                    ? `Are you sure you want to deactivate ${selectedUser.email}? They will be immediately logged out and unable to log back in until reactivated.`
                    : `Are you sure you want to delete ${selectedUser.email}? This action will soft delete the user but allow the email to be reused for new registrations.`
                  }
                </p>
                {modalAction === 'delete' && selectedUser.role === 'admin' && stats && stats.admin_users <= 1 && (
                  <Alert variant="warning" className="mt-3">
                    Warning: This is the last admin user. Deleting this account will leave the system without an administrator.
                  </Alert>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
