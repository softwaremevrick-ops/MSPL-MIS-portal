import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { Edit, Loader2 } from 'lucide-react';
import Alert from '../ui/Alert';
import Badge from '../ui/Badge'; // Import Badge component
import { format } from 'date-fns'; // For date formatting

const ManageActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editFormData, setEditFormData] = useState({
    activityName: '',
    description: '',
    status: '',
    project: '',
    location: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [newActivityFormData, setNewActivityFormData] = useState({
    activityName: '',
    description: '',
    project: '',
    location: '',
    status: 'pending',
    startTime: '',
    endTime: '',
    progressPercentage: 0,
  });
  const [isAddingNewActivity, setIsAddingNewActivity] = useState(false);
  const [newActivityFormErrors, setNewActivityFormErrors] = useState({});
  const [showAddForm, setShowAddForm] = useState(false); // To toggle visibility of the add form

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/activities', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch activities');
      }
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (activity) => {
    setEditingActivity(activity._id);
    setEditFormData({
      activityName: activity.activityName,
      description: activity.description,
      status: activity.status,
      project: activity.project,
      location: activity.location,
    });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveActivity = async (activityId) => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/activities/${activityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update activity');
      }
      setActivities(activities.map((activity) => (activity._id === activityId ? data : activity)));
      setEditingActivity(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewActivityChange = (e) => {
    const { name, value } = e.target;
    setNewActivityFormData((prev) => ({ ...prev, [name]: value }));
    if (newActivityFormErrors[name]) {
      setNewActivityFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateNewActivityForm = () => {
    const errors = {};
    if (!newActivityFormData.activityName.trim()) {
      errors.activityName = 'Activity name is required';
    }
    if (!newActivityFormData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!newActivityFormData.project.trim()) {
      errors.project = 'Project is required';
    }
    if (!newActivityFormData.location.trim()) {
      errors.location = 'Location is required';
    }
    return errors;
  };

  const handleNewActivitySubmit = async (e) => {
    e.preventDefault();

    const errors = validateNewActivityForm();
    if (Object.keys(errors).length > 0) {
      setNewActivityFormErrors(errors);
      return;
    }

    setIsAddingNewActivity(true);
    setNewActivityFormErrors({});
    setError(null);
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newActivityFormData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.errors?.[0]?.msg || 'Failed to create activity');
      }
      setActivities((prev) => [data, ...prev]);
      setNewActivityFormData({
        activityName: '',
        description: '',
        project: '',
        location: '',
        status: 'pending',
        startTime: '',
        endTime: '',
        progressPercentage: 0,
      });
      setShowAddForm(false); // Hide form after successful submission
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAddingNewActivity(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-600" />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-xl font-bold mb-4">Manage Activities</h3>

      <div className="mb-6">
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-600 hover:bg-blue-700">
          {showAddForm ? 'Hide Add Activity Form' : 'Add New Activity'}
        </Button>

        {showAddForm && (
          <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-bold mb-4">Create New Activity</h4>
            <form onSubmit={handleNewActivitySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="newActivityName" className="block text-sm font-medium text-gray-700">Activity Name</label>
                <input
                  type="text"
                  id="newActivityName"
                  name="activityName"
                  value={newActivityFormData.activityName}
                  onChange={handleNewActivityChange}
                  className={`mt-1 block w-full border ${newActivityFormErrors.activityName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                />
                {newActivityFormErrors.activityName && <p className="text-red-500 text-xs mt-1">{newActivityFormErrors.activityName}</p>}
              </div>
              <div>
                <label htmlFor="newDescription" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="newDescription"
                  name="description"
                  value={newActivityFormData.description}
                  onChange={handleNewActivityChange}
                  rows="3"
                  className={`mt-1 block w-full border ${newActivityFormErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                ></textarea>
                {newActivityFormErrors.description && <p className="text-red-500 text-xs mt-1">{newActivityFormErrors.description}</p>}
              </div>
              <div>
                <label htmlFor="newProject" className="block text-sm font-medium text-gray-700">Project</label>
                <input
                  type="text"
                  id="newProject"
                  name="project"
                  value={newActivityFormData.project}
                  onChange={handleNewActivityChange}
                  className={`mt-1 block w-full border ${newActivityFormErrors.project ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                />
                {newActivityFormErrors.project && <p className="text-red-500 text-xs mt-1">{newActivityFormErrors.project}</p>}
              </div>
              <div>
                <label htmlFor="newLocation" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  id="newLocation"
                  name="location"
                  value={newActivityFormData.location}
                  onChange={handleNewActivityChange}
                  className={`mt-1 block w-full border ${newActivityFormErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                />
                {newActivityFormErrors.location && <p className="text-red-500 text-xs mt-1">{newActivityFormErrors.location}</p>}
              </div>
              <div className="col-span-full">
                <Button type="submit" disabled={isAddingNewActivity} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                  {isAddingNewActivity ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Activity'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {activities.length === 0 ? (
        <p>No activities found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Activity Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Project</th>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Submitted By</th>
                <th className="py-2 px-4 border-b">Created At</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id} className="hover:bg-gray-50">
                  {editingActivity === activity._id ? (
                    <>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="text"
                          name="activityName"
                          value={editFormData.activityName}
                          onChange={handleEditFormChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="text"
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditFormChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <select
                          name="status"
                          value={editFormData.status}
                          onChange={handleEditFormChange}
                          className="border p-1 rounded w-full"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="in-progress">In-Progress</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="text"
                          name="project"
                          value={editFormData.project}
                          onChange={handleEditFormChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="text"
                          name="location"
                          value={editFormData.location}
                          onChange={handleNewActivityChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b col-span-2">
                        <Button onClick={() => handleSaveActivity(activity._id)} disabled={isSaving}>
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                        </Button>
                        <Button onClick={() => setEditingActivity(null)} variant="outline" className="ml-2">
                          Cancel
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-4 border-b">{activity.activityName}</td>
                      <td className="py-2 px-4 border-b">{activity.description}</td>
                      <td className="py-2 px-4 border-b">
                        <Badge className={getStatusBadgeClass(activity.status)}>{activity.status}</Badge>
                      </td>
                      <td className="py-2 px-4 border-b">{activity.project}</td>
                      <td className="py-2 px-4 border-b">{activity.location}</td>
                      <td className="py-2 px-4 border-b">{activity.user?.username || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{format(new Date(activity.createdAt), 'dd-MM-yyyy')}</td>
                      <td className="py-2 px-4 border-b">
                        <Button onClick={() => handleEditClick(activity)} variant="ghost">
                          <Edit className="w-4 h-4" />
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
    </div>
  );
};

export default ManageActivities;
