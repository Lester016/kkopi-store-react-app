type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  jobTitle: string;
  branch: string;
  dateStarted: string; // ISO format
};

type UserListProps = {
  users: User[];
  onEdit: (user: User) => void;
};

// Utility to calculate years of service
const getYearsOfService = (startDate: string) => {
  const start = new Date(startDate);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  const years = diff / (1000 * 60 * 60 * 24 * 365.25);
  return `${years.toFixed(1)} yrs`;
};

export const UserList = ({ users, onEdit }: UserListProps) => {
  if (!users || users.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No users found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-xl overflow-hidden">
      <div className="bg-gray-100 px-6 py-4 border-b flex items-center justify-between flex-wrap gap-4">
        {/* Title on the left */}
        <h2 className="text-lg font-semibold text-gray-800">Employee Directory</h2>

        {/* Search + Create Button on the right */}
        <div className="flex items-center gap-3 ml-auto">
          <input
            type="text"
            placeholder="Search employees..."
            className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => {
              // Hook up search logic
              console.log('Search:', e.target.value);
            }}
          />

          <button
            onClick={() => {
              // Trigger modal or navigate
              console.log('Create New Employee');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm"
          >
            + New Employee
          </button>
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li
            key={user.id}
            className="px-6 py-4 hover:bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-600">
                {user.jobTitle} · {user.branch}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Joined: {getYearsOfService(user.dateStarted)}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  user.role === 'ADMIN'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {user.role}
              </span>
              <button
                onClick={() => onEdit(user)}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
