import React, { useState, useEffect } from 'react';
import BeatLoader from "react-spinners/BeatLoader";
import { 
    FaUsers, FaShoppingCart, FaUserShield, FaUser, 
    FaEye, FaEdit, FaTrash, FaBell, FaSearch,
    FaDownload, FaChartLine, FaDollarSign, FaBox,
    FaExclamationTriangle, FaArrowUp, FaArrowDown
} from "react-icons/fa";
import { MdDashboard, MdAnalytics, MdInventory } from "react-icons/md";

interface DashboardStats {
    totalUsers: number;
    totalOrders: number;
    revenue: number;
    activeUsers: number;
    newUsersToday: number;
    pendingOrders: number;
    totalProducts: number;
    lowStockItems: number;
}

interface RecentActivity {
    id: string;
    action: string;
    user: string;
    timestamp: string;
    type: 'user' | 'order' | 'payment' | 'system';
    status: 'success' | 'warning' | 'error';
}

interface UserData {
    id: string;
    email: string;
    username: string;
    fullName: string;
    createdAt: string;
    lastLogin: string;
    loginAttempts: number;
    isEmailVerified: boolean;
    role: 'admin' | 'user';
    status: 'active' | 'suspended' | 'pending';
}

interface Order {
    id: string;
    customerName: string;
    email: string;
    amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    items: number;
}

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'analytics'>('overview');
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalOrders: 0,
        revenue: 0,
        activeUsers: 0,
        newUsersToday: 0,
        pendingOrders: 0,
        totalProducts: 0,
        lowStockItems: 0
    });

    const [users, setUsers] = useState<UserData[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUserRole, setSelectedUserRole] = useState<'all' | 'admin' | 'user'>('all');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, users, selectedUserRole]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Mock data - replace with actual API calls
            setStats({
                totalUsers: 2847,
                totalOrders: 1523,
                revenue: 87650,
                activeUsers: 324,
                newUsersToday: 18,
                pendingOrders: 47,
                totalProducts: 1205,
                lowStockItems: 12
            });

            // Mock users data
            const mockUsers: UserData[] = [
                {
                    id: '1',
                    email: 'admin@example.com',
                    username: 'admin',
                    fullName: 'System Administrator',
                    createdAt: '2023-01-15T10:30:00Z',
                    lastLogin: '2024-01-20T14:25:00Z',
                    loginAttempts: 0,
                    isEmailVerified: true,
                    role: 'admin',
                    status: 'active'
                },
                {
                    id: '2',
                    email: 'john.doe@example.com',
                    username: 'johndoe',
                    fullName: 'John Doe',
                    createdAt: '2023-06-10T09:15:00Z',
                    lastLogin: '2024-01-19T16:45:00Z',
                    loginAttempts: 0,
                    isEmailVerified: true,
                    role: 'user',
                    status: 'active'
                },
                {
                    id: '3',
                    email: 'jane.smith@example.com',
                    username: 'janesmith',
                    fullName: 'Jane Smith',
                    createdAt: '2023-08-22T11:20:00Z',
                    lastLogin: '2024-01-18T10:30:00Z',
                    loginAttempts: 2,
                    isEmailVerified: false,
                    role: 'user',
                    status: 'pending'
                }
            ];

            // Mock orders data
            const mockOrders: Order[] = [
                {
                    id: 'ORD-001',
                    customerName: 'John Doe',
                    email: 'john.doe@example.com',
                    amount: 299.99,
                    status: 'processing',
                    createdAt: '2024-01-20T10:30:00Z',
                    items: 3
                },
                {
                    id: 'ORD-002',
                    customerName: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    amount: 159.50,
                    status: 'shipped',
                    createdAt: '2024-01-19T15:45:00Z',
                    items: 2
                }
            ];

            setUsers(mockUsers);
            setOrders(mockOrders);
            setFilteredUsers(mockUsers);

            // Mock recent activity
            setRecentActivity([
                {
                    id: '1',
                    action: 'New user registration',
                    user: 'sarah.wilson@email.com',
                    timestamp: '2 minutes ago',
                    type: 'user',
                    status: 'success'
                },
                {
                    id: '2',
                    action: 'Order #ORD-1234 placed',
                    user: 'mike.johnson@email.com',
                    timestamp: '5 minutes ago',
                    type: 'order',
                    status: 'success'
                },
                {
                    id: '3',
                    action: 'Payment failed',
                    user: 'alex.brown@email.com',
                    timestamp: '8 minutes ago',
                    type: 'payment',
                    status: 'error'
                },
                {
                    id: '4',
                    action: 'Low stock alert',
                    user: 'System',
                    timestamp: '12 minutes ago',
                    type: 'system',
                    status: 'warning'
                }
            ]);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        if (selectedUserRole !== 'all') {
            filtered = filtered.filter(user => user.role === selectedUserRole);
        }

        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(user =>
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    };

    const StatCard: React.FC<{
        title: string;
        value: number | string;
        icon: React.ReactNode;
        color: string;
        change?: { value: number; isPositive: boolean };
    }> = ({ title, value, icon, color, change }) => {
        const colorClasses = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            orange: 'bg-orange-500',
            red: 'bg-red-500',
            indigo: 'bg-indigo-500'
        };

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} text-white`}>
                            {icon}
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                        </div>
                    </div>
                    {change && (
                        <div className={`flex items-center text-sm ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {change.isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                            {Math.abs(change.value)}%
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'user': return <FaUser className="text-blue-500" />;
            case 'order': return <FaShoppingCart className="text-green-500" />;
            case 'payment': return <FaDollarSign className="text-purple-500" />;
            case 'system': return <FaExclamationTriangle className="text-orange-500" />;
            default: return <FaBell className="text-gray-500" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <BeatLoader size={15} color="#3B82F6" />
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-sm text-gray-600">Welcome back, manage your application</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <FaBell size={20} />
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <FaDownload className="mr-2" />
                                Export Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-6">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: <MdDashboard /> },
                            { id: 'users', label: 'Users', icon: <FaUsers /> },
                            { id: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
                            { id: 'analytics', label: 'Analytics', icon: <MdAnalytics /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.icon}
                                <span className="ml-2">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Users"
                                value={stats.totalUsers.toLocaleString()}
                                icon={<FaUsers />}
                                color="blue"
                                change={{ value: 12, isPositive: true }}
                            />
                            <StatCard
                                title="Total Orders"
                                value={stats.totalOrders.toLocaleString()}
                                icon={<FaShoppingCart />}
                                color="green"
                                change={{ value: 8, isPositive: true }}
                            />
                            <StatCard
                                title="Revenue"
                                value={`$${stats.revenue.toLocaleString()}`}
                                icon={<FaDollarSign />}
                                color="purple"
                                change={{ value: 15, isPositive: true }}
                            />
                            <StatCard
                                title="Active Users"
                                value={stats.activeUsers.toLocaleString()}
                                icon={<FaChartLine />}
                                color="orange"
                                change={{ value: 3, isPositive: false }}
                            />
                        </div>

                        {/* Secondary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="New Users Today"
                                value={stats.newUsersToday}
                                icon={<FaUser />}
                                color="indigo"
                            />
                            <StatCard
                                title="Pending Orders"
                                value={stats.pendingOrders}
                                icon={<FaBox />}
                                color="orange"
                            />
                            <StatCard
                                title="Total Products"
                                value={stats.totalProducts.toLocaleString()}
                                icon={<MdInventory />}
                                color="green"
                            />
                            <StatCard
                                title="Low Stock Alerts"
                                value={stats.lowStockItems}
                                icon={<FaExclamationTriangle />}
                                color="red"
                            />
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex items-center">
                                            <div className="mr-3">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                                <p className="text-xs text-gray-500">{activity.user}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">{activity.timestamp}</p>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                activity.status === 'success' ? 'bg-green-100 text-green-800' :
                                                activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {activity.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-3 text-gray-400" size={14} />
                                            <input
                                                type="text"
                                                placeholder="Search users..."
                                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <select
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={selectedUserRole}
                                            onChange={(e) => setSelectedUserRole(e.target.value as any)}
                                        >
                                            <option value="all">All Roles</option>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <FaUser className="text-gray-600" />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {user.role === 'admin' ? <FaUserShield className="mr-1" /> : <FaUser className="mr-1" />}
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(user.lastLogin)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button className="text-blue-600 hover:text-blue-900">
                                                            <FaEye />
                                                        </button>
                                                        <button className="text-green-600 hover:text-green-900">
                                                            <FaEdit />
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-900">
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                                        <div className="text-sm text-gray-500">{order.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ${order.amount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button className="text-blue-600 hover:text-blue-900">
                                                            <FaEye />
                                                        </button>
                                                        <button className="text-green-600 hover:text-green-900">
                                                            <FaEdit />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
                            <div className="text-center py-12">
                                <MdAnalytics size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500">Analytics charts and reports will be implemented here.</p>
                                <p className="text-sm text-gray-400 mt-2">Integration with charting libraries like Chart.js or D3.js</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;