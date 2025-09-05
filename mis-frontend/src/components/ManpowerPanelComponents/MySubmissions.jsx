import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input'; // Import Input component for search
import Badge from '../ui/Badge'; // Import Badge component for status
import { Loader2, Search } from 'lucide-react';
import Alert from '../ui/Alert';
import { format } from 'date-fns';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
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
        throw new Error(data.message || 'Failed to fetch submissions');
      }
      setSubmissions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const filteredAndSearchedSubmissions = submissions.filter((activity) => {
    const matchesSearch = activity.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.project?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-600" />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-xl font-bold mb-4">My Submissions</h3>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-auto p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredAndSearchedSubmissions.length === 0 ? (
        <p>No submissions found matching your criteria.</p>
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
                <th className="py-2 px-4 border-b">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSearchedSubmissions.map((activity) => (
                <tr key={activity._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{activity.activityName}</td>
                  <td className="py-2 px-4 border-b">{activity.description}</td>
                  <td className="py-2 px-4 border-b">
                    <Badge className={getStatusBadgeClass(activity.status)}>{activity.status}</Badge>
                  </td>
                  <td className="py-2 px-4 border-b">{activity.project || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{activity.location || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{format(new Date(activity.createdAt), 'dd-MM-yyyy HH:mm')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
