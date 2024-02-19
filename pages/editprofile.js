import React, { useEffect, useState } from 'react';
import { useRequireAuth } from '../context/useRequireAuth';
import { BiHome } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';

export default function EditProfile() {
  const isAuthenticated = useRequireAuth();
  const router = useRouter();
  const { logout } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [identify, setIdentify] = useState('');
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/user/${id}`)
        .then(response => response.json())
        .then(data => {
          if (data.identify !== 'teacher') {
            alert('Access denied: You are not a teacher');
            router.push('/'); 
          }else{
            setEmail(data.email);
            setName(data.name);
            setIdentify(data.identify);
          }       
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [id]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,

          ...(password && { password }),
          identify,
        }),
      });

      if (response.ok) {
        window.alert('User profile is successfully updated');
        setTimeout(() => {
          router.back();
        },);
      } else {
        window.alert('Failed to update user');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleCancel = () => {
    router.back();
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
          disabled={!isUpdatePassword}
          className={`create-user-input ${!isUpdatePassword ? 'disabledInput' : ''}`}
        />
        
        <div className="update-password-section">
          <label htmlFor="updatePasswordCheckbox" className="update-password-label">
            Update Password
            <input
              type="checkbox"
              id="updatePasswordCheckbox"
              checked={isUpdatePassword}
              onChange={() => setIsUpdatePassword(!isUpdatePassword)}
              className="update-password-checkbox"
            />
          </label>
        </div>

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
          <button type="submit" className="create-btn">update</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}