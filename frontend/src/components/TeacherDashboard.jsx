import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './AuthStore';
import axios from 'axios';
import Sidebar from './Sidebar';
import EditProfileModal from './EditProfileModal';
import CreateCourseModal from './CreateCourseModal';
// import DepartmentManagement from './DepartmentManagement'; // Add this import
import RoomManagement from './RoomManagement';

const TeacherDashboard = () => {
    const { user, logout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [myCourses, setMyCourses] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);

    // Add refetch function
    const refetchData = async () => {
        if (!user?.id) return;

        try {
            const token = localStorage.getItem('token');

            const [coursesRes, studentsRes] = await Promise.all([
                axios.get('http://localhost:3000/api/course', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get('http://localhost:3000/api/student', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const teacherCourses = Array.isArray(coursesRes.data)
                ? coursesRes.data.filter(course => course.teacherId === user.id)
                : [];

            setMyCourses(teacherCourses);
            setAllStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);

        } catch (err) {
            console.error('Error refetching teacher data:', err);
        }
    };

    // Fetch teacher's data
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            try {
                const token = localStorage.getItem('token');

                // Fetch teacher's courses and all students
                const [coursesRes, studentsRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/course', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:3000/api/student', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                // Filter courses taught by this teacher
                const teacherCourses = Array.isArray(coursesRes.data)
                    ? coursesRes.data.filter(course => course.teacherId === user.id)
                    : [];

                setMyCourses(teacherCourses);
                setAllStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);

            } catch (err) {
                console.error('Error fetching teacher data:', err);
                setMyCourses([]);
                setAllStudents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]);

    const handleSectionChange = (section) => {
        setActiveSection(section);
        if (section === 'profile') {
            setIsProfileModalOpen(true);
            setActiveSection('dashboard');
        }
    };

    const handleCreateCourse = () => {
        setIsCreateCourseModalOpen(true);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return renderDashboardContent();
            case 'courses':
                return renderMyCoursesContent();
            case 'students':
                return renderStudentsContent();
            case 'assignments':
                return <div className="p-6"><h2 className="text-xl font-bold">Assignments - Coming Soon</h2></div>;
            case 'grades':
                return <div className="p-6"><h2 className="text-xl font-bold">Grading - Coming Soon</h2></div>;
            case 'attendance':
                return <div className="p-6"><h2 className="text-xl font-bold">Attendance - Coming Soon</h2></div>;
            case 'rooms':
                return <RoomManagement />;
            default:
                return renderDashboardContent();
        }
    };

    const renderDashboardContent = () => (
        <>
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Welcome, {user.username}!
                    </h2>
                    <div className="space-y-2">
                        <p className="text-gray-600">
                            <span className="font-medium">Email:</span> {user.email}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">User Type:</span> {user.userType}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-medium">👥</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Students
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {allStudents.length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-medium">📚</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        My Courses
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {myCourses.length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-medium">📝</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Assignments
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        0
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-medium">📊</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Pending Reviews
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        0
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Quick Actions
                        </h3>
                        <div className="mt-5 grid grid-cols-1 gap-3">
                            <button
                                onClick={handleCreateCourse}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Create New Course
                            </button>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                Add Assignment
                            </button>
                            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                Grade Submissions
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Recent Activity
                        </h3>
                        <div className="mt-5">
                            <p className="text-gray-500 text-sm">No recent activity</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderMyCoursesContent = () => (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                <button
                    onClick={handleCreateCourse}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Create New Course
                </button>
            </div>

            {myCourses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {myCourses.map(course => (
                        <div key={course.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {course.name}
                                </h3>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {course.code}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-3 text-sm">
                                {course.description || 'No description available'}
                            </p>
                            <div className="text-xs text-gray-500 mb-4">
                                <p>Credits: {course.credits || 'N/A'}</p>
                                <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium">
                                    View Students
                                </button>
                                <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium">
                                    Edit Course
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
                    <button
                        onClick={handleCreateCourse}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Create Your First Course
                    </button>
                </div>
            )}
        </div>
    );

    const renderStudentsContent = () => (
        <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900">All Students</h2>
            {allStudents.length > 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Enrolled Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allStudents.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {student.firstName?.[0] || student.username?.[0] || 'S'}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {student.firstName && student.lastName
                                                        ? `${student.firstName} ${student.lastName}`
                                                        : student.username
                                                    }
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    @{student.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {student.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${student.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {student.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {student.enrollmentDate
                                            ? new Date(student.enrollmentDate).toLocaleDateString()
                                            : 'N/A'
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                                            View
                                        </button>
                                        <button className="text-green-600 hover:text-green-900">
                                            Contact
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500">No students found.</p>
                </div>
            )}
        </div>
    );

    // Authentication check
    useEffect(() => {
        if (!isAuthenticated || (user && user.userType !== 'teacher')) {
            navigate('/teacher/login');
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Loading state
    if (!user || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-sm">
                <div className="flex items-center justify-center h-16 bg-green-600">
                    <h1 className="text-white text-lg font-semibold">Teacher Portal</h1>
                </div>
                <Sidebar
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                    userType="teacher"
                />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Top navigation */}
                <nav className="bg-white shadow border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-semibold text-gray-900 capitalize">
                                    {activeSection === 'dashboard' ? 'Dashboard' : activeSection.replace(/([A-Z])/g, ' $1')}
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">Welcome, {user.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="px-4 py-6 sm:px-0">
                            {renderContent()}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
            <CreateCourseModal
                isOpen={isCreateCourseModalOpen}
                onClose={() => setIsCreateCourseModalOpen(false)}
                onCourseCreated={() => {
                    setIsCreateCourseModalOpen(false);
                    refetchData(); // Add this line to refresh data
                }}
            />
        </div>
    );
};

export default TeacherDashboard;