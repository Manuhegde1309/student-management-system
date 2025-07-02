import AuthForm from './AuthForm';

export default function StudentRegister() {
    return (
        <AuthForm
            title="Student Registration"
            userType="student"
            isLogin={false}
        />
    );
}