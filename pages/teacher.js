import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '../context/useRequireAuth';
import { useRouter } from 'next/router';
import Loading from '../components/loading'
import { useAuth } from '../context/authContext';

export default function Teacher() {
  const { isAuthenticated, isLoading } = useRequireAuth();
 // console.log('Teacher page - isAuthenticated:', isAuthenticated);
  const router = useRouter();
  const { logout } = useAuth();
  const [teacherId, setTeacherId] = useState('');
  const [teacherName, setTeacherName] = useState(''); 

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      fetch('/api/information', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error('Network response was not ok');
        })
        .then((data) => {
          setTeacherName(data.name); 
          setTeacherId(data._id);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [isAuthenticated]);

  const handleEdit = () => {
    if (teacherId) {
      router.push({
        pathname: '/editprofile',
        query: { id: teacherId },
      });
    } else {
      console.error('No teacher ID available for editing');
    }
  };
  
  
  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return <Loading />; 
  }

  if (!isAuthenticated) {
   // console.log('Teacher page - User not authenticated, showing loading...');
    return null;
  }

  return (
    <div>
      <div className="menu-bar">
        <span>Welcome, {teacherName || 'Teacher'}</span>
        <nav>
          <button className="manage-user" onClick={() => router.push('/manageuser')}>Manage User</button>
          <button className="edit-profile" onClick={handleEdit}>Edit profile</button> 
          <button className="logout" onClick={handleLogout}>Logout</button>
        </nav>
      </div>
    </div>
  );
}
