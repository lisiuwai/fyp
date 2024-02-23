import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '../context/useRequireAuth';
import { BsEmojiSmile } from "react-icons/bs";
import { useRouter } from 'next/router';
import Loading from '../components/loading'
import { useAuth } from '../context/authContext';

export default function Teacher() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const router = useRouter();
  const { logout } = useAuth();
  const [teacherId, setTeacherId] = useState('');
  const [teacherName, setTeacherName] = useState(''); 
  const [mostFrequentQuestions, setMostFrequentQuestion] = useState([]);

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
          if (data.identify !== 'teacher') {
            alert('Access denied: You are not a teacher');
            router.push('/'); 
          } else {
            setTeacherName(data.name); 
            setTeacherId(data._id);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/course/mostFrequentQuestion')
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            setMostFrequentQuestion(data.data);
           
          }
        })
        .catch((error) => console.error("Failed to fetch most frequent question", error));
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
    return null;
  }

  return (
    <div>
      <div className="menu-bar">
        <span>Welcome, {teacherName || 'Teacher'}<BsEmojiSmile className="inline-block ml-1" size='1.2em' /></span>
        <nav>
          <button className="manage-user" onClick={() => router.push('/manageuser')}>Manage User</button>
          <button className="edit-profile" onClick={handleEdit}>Edit profile</button> 
          <button className="logout" onClick={handleLogout}>Logout</button>
        </nav>
      </div>
      <div>
      {mostFrequentQuestions.length > 0 && (
        <div>
          <h3>Top 5 Most Frequent Questions:</h3>
          <ul>
            {mostFrequentQuestions.map((q, index) => (
              <li key={index}>
                {q._id} (Asked {q.count} times)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
}
