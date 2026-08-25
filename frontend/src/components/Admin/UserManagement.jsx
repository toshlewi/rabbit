import { useState } from "react";

const UserManagement = () => {
    const users = [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            role: "Admin"
        }
    ]

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer", // Default role
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // Reset form after submission
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "customer",
        });
    }

    const handleRoleChange = (userId, newRole) => {
        console.log(`User ID: ${userId}, New Role: ${newRole}`);
        // Here you would typically make an API call to update the user's role in the backend.
    }

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            console.log(`User ID: ${userId} deleted`);
            // Here you would typically make an API call to delete the user in the backend.
        }
    }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 ">User Management</h2>
      {/* Add New user form */}
      <div className="p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4 ">Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">
              Name
            </label>
            <input
              className="w-full p-2 border rounded"
              name="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
            
            <div className="mb-4">
            <label className="block text-gray-700">
              Email
            </label>
            <input
              className="w-full p-2 border rounded"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              Password
            </label>
            <input
              className="w-full p-2 border rounded"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              Role
            </label>
            <select
              className="w-full p-2 border rounded"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Add User
          </button>
        </form>
      </div>

        {/* User List */}
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="py-3 px-4 border-b">Name</th>
                        <th className="py-3 px-4 border-b">Email</th>
                        <th className="py-3 px-4 border-b">Role</th>
                        <th className="py-3 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                            <td className="py-2 px-4">{user.email}</td>
                            <td className="py-2 px-4">
                                <select 
                                value={user.role}
                                onChange={(e) => {handleRoleChange(user.id, e.target.value)}}
                                className="p-2 border rounded"
                                >
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td className="p-4">
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default UserManagement
