import React, { useState, useEffect } from 'react';
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
    const [alertShown, setAlertShown] = useState(false);
    const [isSelectFocused, setIsSelectFocused] = useState(false);

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
                        setAlertShown(true);
                        router.push('/');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [isAuthenticated, alertShown, router]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/user/userControl', {
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
            }
        } catch (error) {
            console.error('An error occurred:', error);
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
                    <button className="logout" onClick={handleLogout}>Logout</button>
                </nav>
            </div>
            <h3 className="text-center font-bold text-lg">
                Create user
            </h3>
            <form onSubmit={handleSubmit} className="create-user-form max-w-lg mx-auto p-4">
                <div className="input-field relative mb-6">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-green-500"
                        placeholder="User Email" />
                    <label htmlFor="email" className="absolute left-1 -top-3.5 text-green-500 text-md transition-all peer-focus:-top-5 peer-focus:text-green-500 peer-focus:text-md peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2"
                    >
                        User Email
                    </label>
                </div>

                <div className="input-field relative mb-6">
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-green-500"
                        placeholder="User Name"
                    />
                    <label
                        htmlFor="name"
                        className="absolute left-1 -top-3.5 text-green-500 text-md transition-all peer-focus:-top-5 peer-focus:text-green-500 peer-focus:text-md peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2"
                    >
                        User Name
                    </label>
                </div>

                <div className="input-field relative mb-6">
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-800 placeholder-transparent focus:outline-none focus:border-green-500"
                        placeholder="Password"
                    />
                    <label htmlFor="password" className="absolute left-1 -top-3.5 text-green-500 text-md transition-all peer-focus:-top-5 peer-focus:text-green-500 peer-focus:text-md peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2"
                    >
                        Password
                    </label>
                </div>

                <div className="input-field relative mb-6">
                    <select
                        id="identify"
                        value={identify}
                        onChange={(e) => setIdentify(e.target.value)}
                        required
                        onFocus={() => setIsSelectFocused(true)}
                        onBlur={() => setIsSelectFocused(identify !== '')}
                        className={`peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-500 ${identify && 'selected'}`}
                    >
                        <option value="" disabled>Choose a role</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>
                    <label
                        htmlFor="identify"
                        className={`absolute left-0 top-0 text-gray-500 text-sm transition-all peer-focus:top-[-22px] peer-focus:text-green-500 peer-selected:top-[-22px] peer-selected:text-green-500`}
                    >
                    </label>
                </div>

                <div className="form-actions flex justify-between mt-4">
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create</button>
                    <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}