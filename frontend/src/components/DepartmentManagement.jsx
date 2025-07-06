// Create frontend/src/components/DepartmentManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from './AuthStore';
import { useNavigate } from 'react-router-dom';

const DepartmentManagement = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState([]); // Add this state
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        headOfDepartment: '' // This will now store teacher ID
    });

    useEffect(() => {
        fetchDepartments();
        fetchTeachers(); // Add this call
    }, []);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/department', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDepartments(response.data || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setDepartments([]);
        } finally {
            setLoading(false);
        }
    };

    // Add this new function to fetch teachers
    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/teacher', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setTeachers(response.data || []);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setTeachers([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            // Fix: Send the correct field name to backend
            const submitData = {
                name: formData.name,
                description: formData.description,
                headOfDepartmentId: formData.headOfDepartment // Change this line
            };

            if (editingDepartment) {
                // Update existing department
                await axios.put(`http://localhost:3000/api/department/${editingDepartment.id}`, submitData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Department updated successfully!');
            } else {
                // Create new department
                await axios.post('http://localhost:3000/api/department', submitData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Department created successfully!');
            }

            setFormData({ name: '', description: '', headOfDepartment: '' });
            setIsCreateModalOpen(false);
            setEditingDepartment(null);
            fetchDepartments();
        } catch (error) {
            alert(error.response?.data?.error || 'Operation failed');
        }
    };

    const handleEdit = (department) => {
        setEditingDepartment(department);
        setFormData({
            name: department.name,
            description: department.description || '',
            headOfDepartment: department.headOfDepartmentId || '' // Use the teacher ID
        });
        setIsCreateModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/api/department/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Department deleted successfully!');
                fetchDepartments();
            } catch (error) {
                alert(error.response?.data?.error || 'Failed to delete department');
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', headOfDepartment: '' });
        setEditingDepartment(null);
        setIsCreateModalOpen(false);
    };

    // Helper function to get teacher name by ID
    const getTeacherName = (teacherId) => {
        const teacher = teachers.find(t => t.id === teacherId);
        if (teacher) {
            return teacher.firstName && teacher.lastName
                ? `${teacher.firstName} ${teacher.lastName}`
                : teacher.username;
        }
        return 'Not assigned';
    };

    if (loading) {
        return <div className="p-6">Loading departments...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with back button */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <span className="mr-2">←</span>
                        Back to Home
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
                    <div></div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Department Management</h2>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Create Department
                        </button>
                    </div>

                    {/* Departments List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Head of Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Courses
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Teachers
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {departments.map(department => (
                                    <tr key={department.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {department.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {department.description || 'No description'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {getTeacherName(department.headOfDepartmentId)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {department.Courses?.length || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {department.Teachers?.length || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleEdit(department)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(department.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Create/Edit Modal */}
                    {isCreateModalOpen && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {editingDepartment ? 'Edit Department' : 'Create New Department'}
                                        </h3>
                                        <button
                                            onClick={resetForm}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <span className="text-2xl">&times;</span>
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Department Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="e.g., Computer Science"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows="3"
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Brief description of the department"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Head of Department
                                            </label>
                                            <select
                                                value={formData.headOfDepartment}
                                                onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Select a teacher</option>
                                                {teachers.map(teacher => (
                                                    <option key={teacher.id} value={teacher.id}>
                                                        {teacher.firstName && teacher.lastName
                                                            ? `${teacher.firstName} ${teacher.lastName} (${teacher.username})`
                                                            : teacher.username
                                                        }
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                {editingDepartment ? 'Update Department' : 'Create Department'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentManagement;