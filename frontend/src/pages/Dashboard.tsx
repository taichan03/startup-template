import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/services/api'
import type { Project } from '@/types'
import { Navbar, PageContainer } from '@/components/layout'
import { Button, Card, Modal, Input, Textarea, Alert, Spinner } from '@/components/ui'

export function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '' })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await api.getProjects()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.createProject(formData)
      setFormData({ title: '', description: '' })
      setShowCreateModal(false)
      loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return

    try {
      await api.updateProject(editingProject.id, formData)
      setFormData({ title: '', description: '' })
      setEditingProject(null)
      loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await api.deleteProject(id)
      loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
    }
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setFormData({ title: project.title, description: project.description || '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        onLogout={handleLogout}
        showAdminButton={user?.role === 'admin'}
        onNavigateAdmin={() => navigate('/admin')}
      />

      <PageContainer>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900">My Projects</h2>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Project
          </Button>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">{error}</Alert>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Spinner size="lg" />
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No projects yet. Create your first project!</p>
            <Button onClick={() => setShowCreateModal(true)}>
              Get Started
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} hoverable>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description || 'No description'}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openEditModal(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setFormData({ title: '', description: '' })
        }}
        title="Create New Project"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false)
                setFormData({ title: '', description: '' })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter project title"
          />
          <Textarea
            label="Description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter project description (optional)"
          />
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingProject}
        onClose={() => {
          setEditingProject(null)
          setFormData({ title: '', description: '' })
        }}
        title="Edit Project"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setEditingProject(null)
                setFormData({ title: '', description: '' })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Update
            </Button>
          </>
        }
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter project title"
          />
          <Textarea
            label="Description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter project description (optional)"
          />
        </form>
      </Modal>
    </div>
  )
}
