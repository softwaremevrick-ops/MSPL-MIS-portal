import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import { Trash2, Edit, Loader2 } from 'lucide-react';
import Alert from '../../components/ui/Alert';
import { API_BASE_URL } from '@/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    role: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/users`, { // Assuming a /api/users endpoint for admin to manage users
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditFormData({ username: user.username, email: user.email, role: user.role });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveUser = async (userId) => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update user');
      }
      setUsers(users.map((user) => (user._id === userId ? data : user)));
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteConfirmation(userId);
  };

  const handleConfirmDelete = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/users/${deleteConfirmation}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete user');
      }
      setUsers(users.filter((user) => user._id !== deleteConfirmation));
      setDeleteConfirmation(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(null);
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-600" />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-xl font-bold mb-4">User Management</h3>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Username</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  {editingUser === user._id ? (
                    <> 
                      <td className="py-2 px-4 border-b">
                        <input
                          type="text"
                          name="username"
                          value={editFormData.username}
                          onChange={handleEditFormChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditFormChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <select
                          name="role"
                          value={editFormData.role}
                          onChange={handleEditFormChange}
                          className="border p-1 rounded w-full"
                        >
                          <option value="admin">Admin</option>
                          <option value="userType1">User Type 1</option>
                          <option value="userType2">User Type 2</option>
                        </select>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <Button onClick={() => handleSaveUser(user._id)} disabled={isSaving}>
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                        </Button>
                        <Button onClick={() => setEditingUser(null)} variant="outline" className="ml-2">
                          Cancel
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-4 border-b">{user.username}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b capitalize">{user.role}</td>
                      <td className="py-2 px-4 border-b">
                        <Button onClick={() => handleEditClick(user)} variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => handleDeleteClick(user._id)} variant="ghost" className="ml-2 text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <Button onClick={handleConfirmDelete} className="bg-red-600 text-white">Delete</Button>
            <Button onClick={handleCancelDelete} variant="outline" className="ml-2">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
