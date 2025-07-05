import React from 'react';

const Sidebar = ({ activeSection, onSectionChange, userType = 'student' }) => {
    const studentMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'courses', label: 'My Courses', icon: '📚' },
        { id: 'enrollment', label: 'Course Enrollment', icon: '✏️' },
        { id: 'grades', label: 'Grades', icon: '⭐' },
        { id: 'assignments', label: 'Assignments', icon: '📝' },
        { id: 'attendance', label: 'Attendance', icon: '📅' },
        { id: 'profile', label: 'Edit Profile', icon: '👤' },
    ];

    const teacherMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'courses', label: 'My Courses', icon: '📚' },
        { id: 'students', label: 'Students', icon: '👥' },
        { id: 'assignments', label: 'Assignments', icon: '📝' },
        { id: 'grades', label: 'Grading', icon: '⭐' },
        { id: 'attendance', label: 'Attendance', icon: '📅' },
        { id: 'profile', label: 'Edit Profile', icon: '👤' },
        //{ id: 'department', label: 'Department Management', icon: '🏢' },
    ];

    const menuItems = userType === 'student' ? studentMenuItems : teacherMenuItems;

    return (
        <div className="bg-white shadow-sm border-r border-gray-200 h-full">
            <nav className="mt-8">
                <div className="px-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Navigation
                    </h3>
                </div>
                <div className="mt-4 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md mx-2 transition-colors ${activeSection === item.id
                                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;