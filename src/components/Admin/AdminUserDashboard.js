import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeviceStatus from '../DeviceStatus';


const AdminUserDashboard = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    // Fetch all users from the backend on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/auth/totalUsers'); // Adjust the URL based on your API endpoint
                const nonAdminUsers = response.data.filter(user => !user.isAdmin); // Filter out admin users
                setUsers(nonAdminUsers);
            } catch (err) {
                setError('Failed to fetch user data.');
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard - User Management</h1>

            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-4"> {/* Adds space between user blocks */}
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user._id} className="p-4 bg-white shadow rounded-lg border border-gray-200">
                            <p className="text-xl font-semibold mb-2">Name: {user.username}</p>
                            <p><strong>User ID:</strong> User ID: {user._id}</p>
                            <DeviceStatus userId={user._id} />
                        </div>
                    ))
                ) : (
                    <p className="text-center">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminUserDashboard;
