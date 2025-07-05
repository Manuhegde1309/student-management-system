import { useNavigate } from 'react-router-dom';
import DepartmentManagement from './DepartmentManagement';

export default function StartPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-4xl font-bold text-gray-900 mb-12">
                    Student Management System
                </h1>

                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 space-y-8">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Student Portal</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/student/login')}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Login as Student
                            </button>
                            <button
                                onClick={() => navigate('/student/register')}
                                className="w-full flex justify-center py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Register as Student
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Teacher Portal</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/teacher/login')}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Login as Teacher
                                </button>
                                <button
                                    onClick={() => navigate('/teacher/register')}
                                    className="w-full flex justify-center py-2 px-4 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Register as Teacher
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-6">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Department Management</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/department/manage')}
                                    className="w-full flex justify-center py-2 px-4 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Manage Departments
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}