import { useRequireAuth } from '../context/useRequireAuth';
import { BiHome } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';
export default function manage() {

/*     const isAuthenticated = useRequireAuth();
    const router = useRouter();
    const { logout } = useAuth();
    if (!isAuthenticated) {
        return null;
    }

    const handleLogout = () => {
        logout();
    }; */

    return (
        <div>
            <div className="menu-bar">
                <button onClick={() => router.push('/teacher')}>
                    <BiHome size="1.5em" />
                </button>
                <nav>
                    <button> Manage User</button>
                    <button onClick={() => router.push('/change-password')}>Change Password</button>
                    <button /* onClick={handleLogout} */>Logout</button>
                    <span>Teacher Name</span>
                </nav>
            </div>
        </div>
            
            
        
    );
}
