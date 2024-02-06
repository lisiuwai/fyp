import React, { useState } from 'react';
import { useRequireAuth } from '../context/useRequireAuth';
import { BiHome } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';

export default function create() {
    const isAuthenticated = useRequireAuth();
    const router = useRouter();
    const { logout } = useAuth();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [identify, setIdentify] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch('/api/userControl', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              name,
              password,
              identify 
            }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to create user');
          }
      
          const result = await response.json();
          if (result.success) {
        
            router.push('/manageuser');
          } else {
            // Handle error, show error message to user
          }
        } catch (error) {
          console.error('An error occurred:', error);
          // Handle error, show error message to user
        }
      };

    const handleCancel = () => {
        router.push('/manageuser');
    };

    if (!isAuthenticated) {
        return null;
    }
    const handleLogout = () => {
        logout();
    };


    return (
        <div>
            <div className="menu-bar">
                <button onClick={() => router.push('/teacher')}>
                    <BiHome size="1.5em" />
                </button>
                <nav>
                    <button className="manage-user" onClick={() => router.push('/manageuser')}>Manage User</button>
                    <button className="edit-profile" onClick={() => router.push('/change-password')}>Edit profile</button>
                    <button className="logout" onClick={handleLogout}>Logout</button>
                </nav>
            </div>

            <form onSubmit={handleSubmit} className="create-user-form">
                <label htmlFor="email">User Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="name">User Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label htmlFor="identify">Role</label>
                <select
                    id="identify"
                    value={identify}
                    onChange={(e) => setIdentify(e.target.value)}
                    required
                >
                    <option value="" disabled>Choose a role</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                </select>

                <div className="form-actions">
                    <button type="submit" className="create-btn">Create</button>
                    <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}