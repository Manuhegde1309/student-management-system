import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from './AuthStore';

const RoomManagement = () => {
    const { user, token } = useAuthStore(); // Get token from AuthStore instead of localStorage
    const [rooms, setRooms] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        courseId: '',
        roomName: '',
        description: '',
        maxCapacity: 50
    });

    useEffect(() => {
        fetchRooms();
        fetchMyCourses();
    }, []);

    // Temporarily add this to RoomManagement.jsx for debugging
    const fetchRooms = async () => {
        try {
            console.log('Using token:', token); // Debug log
            console.log('Token type:', typeof token); // Debug log
            
            const response = await axios.get('http://localhost:3000/api/course-room/teacher', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRooms(response.data || []);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyCourses = async () => {
        try {
            // Use token from AuthStore instead of localStorage
            const response = await axios.get('http://localhost:3000/api/course', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Filter courses taught by this teacher
            const teacherCourses = response.data.filter(course => course.teacherId === user.id);
            setMyCourses(teacherCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setMyCourses([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use token from AuthStore instead of localStorage
            await axios.post('http://localhost:3000/api/course-room', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Room created successfully!');
            setFormData({ courseId: '', roomName: '', description: '', maxCapacity: 50 });
            setIsCreateModalOpen(false);
            fetchRooms();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to create room');
        }
    };

    const resetForm = () => {
        setFormData({ courseId: '', roomName: '', description: '', maxCapacity: 50 });
        setIsCreateModalOpen(false);
    };

    if (loading) {
        return <div className="p-6">Loading rooms...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Course Rooms</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                    Create Room
                </button>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rooms.map(room => (
                    <div key={room.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {room.roomName}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${room.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                {room.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                <strong>Course:</strong> {room.Course?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Code:</strong> {room.Course?.code}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Capacity:</strong> {room.maxCapacity} students
                            </p>
                            {room.description && (
                                <p className="text-sm text-gray-600">
                                    <strong>Description:</strong> {room.description}
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex space-x-2">
                            <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm">
                                Enter Room
                            </button>
                            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                                Settings
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Room Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Create Course Room</h3>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Select Course *
                                    </label>
                                    <select
                                        value={formData.courseId}
                                        onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select a course</option>
                                        {myCourses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.name} ({course.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Room Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.roomName}
                                        onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., CS101 Virtual Classroom"
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
                                        placeholder="Optional description for the room"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Max Capacity
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.maxCapacity}
                                        onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) })}
                                        min="1"
                                        max="200"
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    />
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
                                        Create Room
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomManagement;