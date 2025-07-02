import AuthForm from './AuthForm';

export default function StudentLogin() {
    return (
        <AuthForm
            title="Student Login"
            userType="student"
            isLogin={true}
            redirectPath="/student/dashboard"
        />
    );
}