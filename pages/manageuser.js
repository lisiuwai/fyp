import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '../context/useRequireAuth';
import { BiHome, BiUserPlus, BiTrash, BiEdit } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';

export default function manage() {
    const isAuthenticated = useRequireAuth();
    const router = useRouter();
    const { logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [alertShown, setAlertShown] = useState(false);
    if (!isAuthenticated) {
        return null;
    }
    
    useEffect(() => {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        fetch('/api/user/information', {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        })
          .then((response) => {
            if (response.ok) return response.json();
            throw new Error('Network response was not ok');
          })
          .then((data) => {
            if (data.identify !== 'teacher' && !alertShown) {
              alert('Access denied: You are not a teacher');
              router.push('/'); 
              setAlertShown(true);
            } 
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }, [isAuthenticated, alertShown]);

    useEffect(() => {
        fetch('/api/user/userControl')
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

    const handleAddUserClick = () => {
        router.push('/createuser'); 
      };

      const handleDelete = async (userId) => {
       
        const isConfirmed = confirm('Are you sure you want to delete this user?');
        if (isConfirmed) {
         
          try {

            const response = await fetch('/api/user/userControl', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId }), 
              });
              
            const data = await response.json();
            if (response.ok) {
              alert('User deleted successfully');
              location.reload();
            } else {
              alert('Error: ' + data.message);
            }
          } catch (error) {
            console.error('Error deleting user:', error);
          }
        } else {
          console.log('User deletion cancelled');
        }
      };
      
    const handleEdit = (userId) => {
        router.push({
          pathname: '/editprofile',
          query: { id: userId }, 
        });
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
                </div>
                <button onClick={handleAddUserClick} className="add-user-btn">
                    <BiUserPlus />
                </button>
            </div>
            <div className="user-card-container">
                {filteredUsers.map(user => (
                    <div key={user._id} className="user-card">
                        <div className="user-info">
                            <div className="user-name">{user.name}</div>
                            <BiTrash className="action-icon text-red-500" onClick={() => handleDelete(user._id)} />
                            <BiEdit className="action-icon" onClick={() => handleEdit(user._id)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
