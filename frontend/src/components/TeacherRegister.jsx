import AuthForm from './AuthForm';

export default function TeacherRegister() {
    return (
        <AuthForm
            title="Teacher Registration"
            userType="teacher"
            isLogin={false}
        />
    );
}