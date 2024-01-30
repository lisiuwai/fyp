import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '../context/useRequireAuth';
import { BiHome, BiSearch, BiUserPlus, BiTrash, BiEdit } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';

export default function manage() {
    const isAuthenticated = useRequireAuth();
    const router = useRouter();
    const { logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    if (!isAuthenticated) {
        return null;
    }

    useEffect(() => {
        fetch('/api/userControl')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data); 
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleLogout = () => {
        logout();
    };

    const handleDelete = userId => {
        // Implement the delete logic
    };

    const handleEdit = userId => {
        // Implement the edit logic
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="menu-bar">
                <button onClick={() => router.push('/teacher')}>
                    <BiHome size="1.5em" />
                </button>
                <nav>
                    <button> Manage User</button>
                    <button className="edit-profile" onClick={() => router.push('/change-password')}>Edit profile</button>
                    <button onClick={handleLogout} >Logout</button>
                </nav>
            </div>
            <div className="search-add-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search here"
                        className="search-input"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
{/*                     <BiSearch className="search-icon" /> */}
                </div>
                <button className="add-user-btn" onClick={() => {/* logic to add user */ }}>
                    <BiUserPlus />
                   
                </button>
            </div>
            <div className="user-card-container">
                {filteredUsers.map(user => (
                    <div key={user._id} className="user-card">
                        <div className="user-info">
                            <div className="user-name">{user.name}</div>
                            <BiTrash className="action-icon" onClick={() => handleDelete(user._id)} />
                            <BiEdit className="action-icon" onClick={() => handleEdit(user._id)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
