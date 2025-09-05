const User = ({ user }) => {
  if (!user) {
    return <div className="text-gray-500">No user data available.</div>;
  }

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-2">User Info</h2>
      <div><strong>Name:</strong> {user.name}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Role:</strong> {user.role}</div>
      {/* Add more fields as needed */}
    </div>
  );
};

export default User;