import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './AuthStore';
import axios from 'axios';
import Sidebar from './Sidebar';
import EditProfileModal from './EditProfileModal';

const StudentDashboard = () => {
    const { user, logout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Add safety check for enrolledCourses being an array
    // Update this useMemo hook:
    const enrolledCourseIds = React.useMemo(() => {
        if (!Array.isArray(enrolledCourses)) {
            return new Set();
        }
        // Now correctly access courseId from enrollment data
        return new Set(enrolledCourses.map(enrollment => enrollment.courseId));
    }, [enrolledCourses]);

    const handleEnroll = async (courseId) => {
        if (enrolling) return; // Prevent double enrollment

        try {
            setEnrolling(true);
            const token = localStorage.getItem('token');

            await axios.post('http://localhost:3000/api/enrollment', {
                studentId: user.id,
                courseId,
                semester: "Fall",
                year: 2025
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Refetch enrollments after successful enrollment
            const res = await axios.get(`http://localhost:3000/api/enrollment/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Ensure the response is an array
            if (Array.isArray(res.data)) {
                setEnrolledCourses(res.data);
            } else {
                console.error('Expected array but got:', typeof res.data, res.data);
                setEnrolledCourses([]);
            }

            alert("Enrolled successfully!");
        } catch (err) {
            console.error('Enrollment error:', err);
            alert(err.response?.data?.message || "Enrollment failed.");
        } finally {
            setEnrolling(false);
        }
    };

    // Fetch available courses
    // Replace both useEffect hooks with this single one:
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            try {
                const token = localStorage.getItem('token');

                // Fetch both courses and enrollments in parallel
                const [coursesRes, enrollmentsRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/course', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get(`http://localhost:3000/api/enrollment/${user.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                // Set available courses
                if (Array.isArray(coursesRes.data)) {
                    setAvailableCourses(coursesRes.data);
                } else {
                    setAvailableCourses([]);
                }

                // Set enrolled courses
                if (Array.isArray(enrollmentsRes.data)) {
                    setEnrolledCourses(enrollmentsRes.data);
                } else {
                    setEnrolledCourses([]);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setAvailableCourses([]);
                setEnrolledCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]); // Only depend on user.id

    const handleSectionChange = (section) => {
        setActiveSection(section);
        if (section === 'profile') {
            setIsProfileModalOpen(true);
            setActiveSection('dashboard'); // Keep dashboard as active since modal opens
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return renderDashboardContent();
            case 'courses':
                return renderMyCoursesContent();
            case 'enrollment':
                return renderEnrollmentContent();
            case 'grades':
                return <div className="p-6"><h2 className="text-xl font-bold">Grades - Coming Soon</h2></div>;
            case 'assignments':
                return <div className="p-6"><h2 className="text-xl font-bold">Assignments - Coming Soon</h2></div>;
            case 'attendance':
                return <div className="p-6"><h2 className="text-xl font-bold">Attendance - Coming Soon</h2></div>;
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

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-medium">📚</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Enrolled Courses
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {Array.isArray(enrolledCourses) ? enrolledCourses.length : 0}
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
                                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-medium">⭐</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Average Grade
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        N/A
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderMyCoursesContent = () => (
        <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900">My Enrolled Courses</h2>
            {Array.isArray(enrolledCourses) && enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {enrolledCourses.map(enrollment => (
                        <div key={enrollment.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {enrollment.Course?.name || 'Course Name'}
                            </h3>
                            <p className="text-gray-600 mb-2 text-sm">
                                {enrollment.Course?.description || 'No description available'}
                            </p>
                            <div className="text-xs text-gray-500">
                                <p>Semester: {enrollment.semester} {enrollment.year}</p>
                                <p>Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                                {enrollment.grade && <p>Grade: {enrollment.grade}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                </div>
            )}
        </div>
    );

    const renderEnrollmentContent = () => (
        <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Available Courses</h2>
            {!Array.isArray(availableCourses) || availableCourses.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500">No courses available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {availableCourses.map(course => {
                        const isEnrolled = enrolledCourseIds.has(course.id);

                        return (
                            <div key={course.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {course.name}
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    {course.description}
                                </p>

                                <button
                                    onClick={() => !isEnrolled && !enrolling && handleEnroll(course.id)}
                                    className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${isEnrolled
                                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                            : enrolling
                                                ? 'bg-blue-300 text-white cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                        }`}
                                    disabled={isEnrolled || enrolling}
                                >
                                    {enrolling ? 'Enrolling...' : isEnrolled ? 'Enrolled' : 'Enroll'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    // Authentication check
    useEffect(() => {
        if (!isAuthenticated || (user && user.userType !== 'student')) {
            navigate('/student/login');
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
                <div className="flex items-center justify-center h-16 bg-blue-600">
                    <h1 className="text-white text-lg font-semibold">Student Portal</h1>
                </div>
                <Sidebar
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                    userType="student"
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

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
};

export default StudentDashboard;