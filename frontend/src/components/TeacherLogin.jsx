import AuthForm from './AuthForm';

export default function TeacherLogin() {
    return (
        <AuthForm
            title="Teacher Login"
            userType="teacher"
            isLogin={true}
            redirectPath="/teacher/dashboard"
        />
    );
}