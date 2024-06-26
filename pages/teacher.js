import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '../context/useRequireAuth';
import { BsEmojiSmile } from "react-icons/bs";
import { useRouter } from 'next/router';
import Loading from '../components/loading'
import { useAuth } from '../context/authContext';
import { Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

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
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(true);

  const horizontalBarChartData = {
    labels: mostFrequentQuestions.map(q => q._id),
    datasets: [
      {
        label: 'Number of Times Asked',
        data: mostFrequentQuestions.map(q => q.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const horizontalBarChartOptions = {
    indexAxis: 'y', 
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 18, 
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 18, 
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: { 
        enabled: true,
        mode: 'point',
        intersect: false,
        bodyFont: {
          size: 18, 
        },
        titleFont: {
          size: 18, 
        },
        footerFont: {
          size: 18, 
        },
        padding: 10, 
      },
    },
    maintainAspectRatio: false, 
    // aspectRatio: 2, 
  };
  

  const barChartData = {
    labels: topKeywords.map(kw => kw.word),
    datasets: [
      {
        label: 'Keyword Frequency',
        data: topKeywords.map(kw => kw.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 18, 
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 18, 
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      tooltip: { 
        enabled: true,
        mode: 'index',
        intersect: false,
        bodyFont: {
          size: 18, 
        },
        titleFont: {
          size: 18, 
        },
        footerFont: {
          size: 18, 
        },
        padding: 10,
      },
      maintainAspectRatio: false,
    },
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
      setIsLoadingKeywords(true);
      fetch('/api/course/keyword')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setTopKeywords(data.data);
          } else {
            setTopKeywords([]);
          }
          setIsLoadingKeywords(false); 
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

  if (isLoading || isLoadingKeywords) {
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
        alert('Course information saved successfully');
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
      <div className="flex justify-between">
        <div className="canvas-container w-3/4 p-4 h-90">
          {mostFrequentQuestions.length > 0 && (
            <div>
              <h3>Top 5 Most Frequent Questions:</h3>
              <div style={{ width: '100%', height: '100%' }}>
              <Bar data={horizontalBarChartData} options={horizontalBarChartOptions} />
              </div>
            </div>
          )}
        </div>

        <div className="canvas-container w-3/4 p-4 h-90">
          {topKeywords.length > 0 ? (
            <div>
              <div>
                <h3>Top 5 Keywords Frequency:</h3>
                <div style={{ width: '100%', height: '100%' }}>
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </div>
            </div>
          ) : (
            <p>No keywords record found.</p>
          )}
        </div>
      </div>
      <h1 className="text-4xl font-bold text-center text-gray-900">
        Please input your course information here
      </h1>
      <form onSubmit={handleSubmit} className="course-form bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div>
          <label className="block text-gray-700 text-md font-bold mb-2" htmlFor="contactInfo" >Contact information of this course:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="contactInfo"
            value={contactInfo}
            onChange={e => setContactInfo(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-md font-bold mb-2" >Number of students in the group project:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="studentNumber"
            value={studentNumber}
            onChange={e => setstudentNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-md font-bold mb-2">Requirements of the assignment:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="assignment"
            value={assignment}
            onChange={e => setassignment(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-md font-bold mb-2">Requirements of the project:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="project"
            value={project}
            onChange={e => setproject(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-md font-bold mb-2">Exam format and tips:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="exam"
            value={exam}
            onChange={e => setexam(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-md font-bold mb-2">Deadline of the assignment/project:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="deadline"
            value={deadline}
            onChange={e => setdeadline(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-md font-bold mb-2">Marking scheme of the assignment:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="msassignment"
            value={msassignment}
            onChange={e => setmsassignment(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-md font-bold mb-2">Marking scheme of the project:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="msproject"
            value={msproject}
            onChange={e => setmsproject(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between mt-6">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}