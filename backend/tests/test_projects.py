from fastapi.testclient import TestClient


def create_test_user_and_login(client: TestClient):
    """Helper function to create user and get token."""
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword123",
        }
    )

    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "test@example.com",
            "password": "testpassword123",
        }
    )
    return response.json()["access_token"]


def test_create_project(client: TestClient):
    """Test creating a project."""
    token = create_test_user_and_login(client)

    response = client.post(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Project",
            "description": "A test project"
        }
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Project"
    assert data["description"] == "A test project"
    assert "id" in data


def test_list_projects(client: TestClient):
    """Test listing projects."""
    token = create_test_user_and_login(client)

    # Create projects
    client.post(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Project 1", "description": "Description 1"}
    )
    client.post(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Project 2", "description": "Description 2"}
    )

    # List projects
    response = client.get(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_get_project(client: TestClient):
    """Test getting a single project."""
    token = create_test_user_and_login(client)

    # Create project
    create_response = client.post(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Test Project", "description": "Test Description"}
    )
    project_id = create_response.json()["id"]

    # Get project
    response = client.get(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == project_id
    assert data["title"] == "Test Project"


def test_update_project(client: TestClient):
    """Test updating a project."""
    token = create_test_user_and_login(client)

    # Create project
    create_response = client.post(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Original Title", "description": "Original Description"}
    )
    project_id = create_response.json()["id"]

    # Update project
    response = client.put(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Updated Title"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["description"] == "Original Description"


def test_delete_project(client: TestClient):
    """Test deleting a project."""
    token = create_test_user_and_login(client)

    # Create project
    create_response = client.post(
        "/api/v1/projects/",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Test Project", "description": "Test Description"}
    )
    project_id = create_response.json()["id"]

    # Delete project
    response = client.delete(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 204

    # Verify deletion
    get_response = client.get(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_response.status_code == 404
