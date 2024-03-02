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
  const [contactInfo, setContactInfo] = useState('');
  const [studentNumber, setstudentNumber] = useState('');
  const [assignment, setassignment] = useState('');
  const [project, setproject] = useState('');
  const [exam, setexam] = useState('');
  const [deadline, setdeadline] = useState('');
  const [msassignment, setmsassignment] = useState('');
  const [msproject, setmsproject] = useState('');
  const [mostFrequentQuestions, setMostFrequentQuestion] = useState([]);
  const [topKeywords, setTopKeywords] = useState([]);

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
          if (data.success) {
            setMostFrequentQuestion(data.data);

          }
        })
        .catch((error) => console.error("Failed to fetch most frequent question", error));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/course/keyword')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setTopKeywords(data.data);
          } else {
            setTopKeywords([]);
          }
        })
        .catch(error => console.error("Failed to fetch top keywords", error));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch('/api/course/information'); 
        if (!response.ok) throw new Error('Failed to fetch course data');
        const data = await response.json();
        console.log(data);
        setContactInfo(data.data.contactInfo);
        setstudentNumber(data.data.studentNumber);
        setassignment(data.data.assignment);
        setproject(data.data.project);
        setexam(data.data.exam);
        setdeadline(data.data.deadline);
        setmsassignment(data.data.msassignment);
        setmsproject(data.data.msproject);
        setstudentNumber(data.data.studentNumber);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };
  
    if (isAuthenticated) {
      fetchCourse();
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      contactInfo: event.target.contactInfo.value,
      studentNumber: event.target.studentNumber.value,
      assignment: event.target.assignment.value,
      project: event.target.project.value,
      exam: event.target.exam.value,
      deadline: event.target.deadline.value,
      msassignment: event.target.msassignment.value,
      msproject: event.target.msproject.value
    };

    try {
      const response = await fetch('/api/course/information', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Course updated successfully');
      } else {
        console.error('Failed to update course');
      }
    } catch (error) {
      console.error('Failed to send form data:', error);
    }
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '50%', margin: '1em' }}>
          {mostFrequentQuestions.length > 0 && (
            <div>
              <h3>Top 5 Most Frequent Questions:</h3>
              <ul>
                {mostFrequentQuestions.map((q, index) => (
                  <li key={index} style={{ color: index % 2 === 0 ? 'blue' : 'inherit' }}>
                    {q._id} (Asked {q.count} times)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ width: '50%', margin: '1em' }}>
          {topKeywords.length > 0 ? (
            <div>
              <h3 >Top 10 Keywords:</h3>
              <ul>
                {topKeywords.map((keyword, index) => (
                  <li key={index} style={{ color: index % 2 === 0 ? 'blue' : 'inherit' }}>
                    {keyword._id} (Mentioned {keyword.count} times)
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No keywords record found.</p>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="course-form">
        <div>
          <label>Contact information of this course:</label>
          <input
            type="text"
            name="contactInfo"
            value={contactInfo}
            onChange={e => setContactInfo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Number of students in the group project:</label>
          <input
            type="text"
            name="studentNumber"
            value={studentNumber}
            onChange={e => setstudentNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Requirements of the assignment:</label>
          <input
            type="text"
            name="assignment"
            value={assignment}
            onChange={e => setassignment(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Requirements of the project:</label>
          <input
            type="text"
            name="project"
            value={project}
            onChange={e => setproject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Exam format and tips:</label>
          <input
            type="text"
            name="exam"
            value={exam}
            onChange={e => setexam(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Deadline of the assignment/project:</label>
          <input
            type="text"
            name="deadline"
            value={deadline}
            onChange={e => setdeadline(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Marking scheme of the assignment:</label>
          <input
            type="text"
            name="msassignment"
            value={msassignment}
            onChange={e => setmsassignment(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Marking scheme of the project:</label>
          <input
            type="text"
            name="msproject"
            value={msproject}
            onChange={e => setmsproject(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="create-btn">Submit</button>
        </div>
      </form>
    </div>
  );
}
