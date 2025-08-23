import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaEdit, FaUsersCog } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// npm install react-toastify

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: '',
    email: '',
    role: 'public'
  });
  const [formError, setFormError] = useState('');

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/auth/users');
      setUsers(res.data.users);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const handleEditClick = (user) => {
    setCurrentUser({ ...user });
    setFormError('');
    setShowModal(true);
  };

  // Handle input change in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Update user role
      await api.put('/api/auth/users/role', {
        userId: currentUser.id,
        role: currentUser.role
      });
      
      // Refresh users list
      await fetchUsers();
      toast.success("User role updated successfully!");

      
      // Close modal
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error("Failed to update user role. Please try again.");

      setFormError(
        err.response?.data?.message || 
        'Failed to update user role. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get badge variant for user role
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'user':
        return 'success';
      default:
        return 'secondary';
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
    <div className="admin-users">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Users</h2>
      </div>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Table responsive hover className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </td>
              <td>{formatDate(user.created_at)}</td>
              <td>
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={() => handleEditClick(user)}
                >
                  <FaEdit className="me-1" /> Change Role
                </Button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      
      {/* Edit User Role Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUsersCog className="me-2" /> Change User Role
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && (
            <Alert variant="danger">{formError}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <p>
              <strong>User:</strong> {currentUser.name} ({currentUser.email})
            </p>
            <Form.Group className="mb-3" controlId="userRole">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={currentUser.role}
                onChange={handleInputChange}
                required
              >
                <option value="public">Public</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
              <Form.Text className="text-muted">
                <strong>Public:</strong> Can view and search images<br />
                <strong>User:</strong> Can also upload images<br />
                <strong>Admin:</strong> Full administrative privileges
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

       <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AdminUsers;