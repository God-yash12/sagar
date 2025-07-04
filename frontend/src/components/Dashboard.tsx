import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-3xl mx-auto mt-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl rounded-2xl overflow-hidden border border-blue-200">
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-6 flex flex-wrap items-center gap-2">
            Welcome, <span className="text-blue-600">{user?.username || user?.email}!</span>
          </h2>

          <div className="divide-y divide-blue-200">
            <div className="py-4 flex justify-between items-center">
              <span className="text-base font-semibold text-blue-700">Email:</span>
              <p className="text-base text-blue-900">{user?.email}</p>
            </div>

            <div className="py-4 flex justify-between items-center">
              <span className="text-base font-semibold text-blue-700">Full Name:</span>
              <p className="text-base text-blue-900">{user?.fullName}</p>
            </div>

            <div className="py-4 flex justify-between items-center">
              <span className="text-base font-semibold text-blue-700">Role:</span>
              <p className="text-base text-blue-900 capitalize">{user?.role || 'user'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
