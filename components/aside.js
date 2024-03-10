import React, { useState, useEffect } from 'react';
import { BiPlus, BiComment, BiCheck, BiTrash, BiX, BiPencil, BiDockRight, BiDockLeft, BiSolidWinkSmile, BiLogOut } from "react-icons/bi";
import { useMutation, useQueryClient } from 'react-query';
import { createRoom, deleteRoom, updateRoom } from '../lib/request';
import { useAuth } from '../context/authContext';

export default function Aside({ getRooms, handler, isSidebarVisible, toggleSidebar }) {
    const queryclient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditingId, setCurrentEditingId] = useState(null);
    const { logout } = useAuth();
    const [userName, setUserName] = useState('');
    const { userEmail, setUserEmail  } = useAuth();


    const [editedName, setEditedName] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        console.log(storedEmail);
        if (storedEmail) {
            setUserEmail(storedEmail); 
        }
    }, [setUserEmail]);
    
    const createMutation = useMutation(email => createRoom(email), {
        onSuccess: () => {
            queryclient.invalidateQueries('rooms')
        }
    });

    const deleteMutation = useMutation(deleteRoom, {
        onSuccess: () => {
            queryclient.invalidateQueries('rooms')
        }
    })

    const startEdit = (roomId, roomName) => {
        setIsEditing(true);
        setCurrentEditingId(roomId);
        setEditedName(roomName);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setCurrentEditingId(null);
        setEditedName('');
    };

    const saveEdit = async (roomId) => {
        try {
            const response = await updateRoom(roomId, editedName);
            if (response.success) {
                setIsEditing(false);
                setCurrentEditingId(null);
                setEditedName('');
                queryclient.invalidateQueries('rooms');
            } else {
                console.error('Failed to update room name', response.error);
            }
        } catch (error) {
            console.error('Error updating room name', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
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
                    setUserName(data.name);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, []);

    const handleLogout = () => {
        logout();
    };
   console.log('Attempting to create room with userEmail:', userEmail);

    return (
        <>
            {!isSidebarVisible && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-0 left-0 z-[1000] bg-blue-600 hover:bg-blue-700 p-2 rounded-full"
                    style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)" }}
                >
                    <BiDockRight size={24} className="text-white" />
                </button>
            )}

            <aside className={`fixed left-0 w-80 h-screen bg-gray-900 ${isSidebarVisible ? '' : 'hidden'}`}>
                <div className="text-gray-50 py-3">
                    <div className="flex justify-between items-center w-full mb-5">
                        <button className="border rounded-md border-gray-600 w-4/5 hover:bg-blue-600 text-left py-3" onClick={() => createMutation.mutate(userEmail)} >
                            <BiPlus className="inline mx-2" size={19} /> New Chat
                        </button>
                        {isSidebarVisible && (
                            <button onClick={toggleSidebar} className="border rounded-md border-gray-600 hover:bg-blue-600 py-3 px-4">
                                <BiDockLeft size={19} className="inline" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 px-3" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}} >
                        <div className="chat_list w-full flex flex-col gap-4 px-3">
                            {getRooms.map((chat) => (
                                <div key={chat._id} className="w-full border-0 rounded-md bg-gray-800 py-1 px-3 flex justify-between items-center">
                                    {isEditing && currentEditingId === chat._id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="text-left truncate w-full text-black"
                                            />
                                            <BiCheck onClick={() => saveEdit(chat._id)} size="1.5em" className="hover:text-green-600" />
                                            <BiX onClick={cancelEdit} size="1.5em" className="hover:text-red-600" />
                                        </>
                                    ) : (
                                        <>
                                            <button className="text-left truncate w-full" onClick={() => handler(chat._id)}>
                                                <span className="block py-3 text-gray-50">
                                                    <BiComment className="inline mx-2" size={19}></BiComment>
                                                    {chat.name}
                                                </span>
                                            </button>
                                            <BiPencil onClick={() => startEdit(chat._id, chat.name)} size="1.5em" className="hover:text-green-600" />
                                            <BiTrash onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this chat room?")) {
                                                    deleteMutation.mutate(chat._id);
                                                    setTimeout(() => {
                                                        window.location.reload();
                                                    }, 500);
                                                }
                                            }} size="1.5em" className="hover:text-red-600" />
                                        </>
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <div className="absolute bottom-0 w-full px-3 py-4 bg-gray-900">
                    <div className="text-gray-50 mb-2 flex items-center">
                        Welcome, {userName}<BiSolidWinkSmile className="inline-block ml-1" size='1.5em' />
                    </div>
                    <button onClick={handleLogout} className="w-full text-left text-yellow-500 hover:bg-red-600 rounded-md py-2 flex items-center">
                        <BiLogOut size='1.5em' />
                        <span className="ml-2">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}