import { useAuth } from '../hooks/useAuth';

export function RoleTest() {
  const { user, userRoles, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Role Test</h2>
      
      <div className="space-y-2">
        <p>
          <strong>User ID:</strong> {user?.id || 'Not logged in'}
        </p>
        <p>
          <strong>User Email:</strong> {user?.email || 'Not logged in'}
        </p>
        <p>
          <strong>User Roles:</strong>{' '}
          {userRoles.length > 0 ? userRoles.join(', ') : 'No roles'}
        </p>
        <p>
          <strong>Is Admin:</strong>{' '}
          {userRoles.includes('admin') ? 'Yes' : 'No'}
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Role-based Content Test:</h3>
        {userRoles.includes('admin') ? (
          <div className="bg-green-100 p-4 rounded">
            This content is only visible to admin users.
          </div>
        ) : (
          <div className="bg-yellow-100 p-4 rounded">
            You need admin privileges to see the restricted content.
          </div>
        )}
      </div>
    </div>
  );
}

