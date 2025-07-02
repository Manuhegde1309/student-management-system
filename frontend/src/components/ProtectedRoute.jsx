import { Navigate } from 'react-router-dom';
import useAuthStore from './AuthStore';
// adjust to your actual store path

export default function ProtectedRoute({ children, allowedRole }) {
    const { isAuthenticated, user } = useAuthStore(); // or useContext(AuthContext), etc.

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (allowedRole && user?.userType !== allowedRole) {
        return <Navigate to="/" />;
    }

    return children;
}
