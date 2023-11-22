import React, { useState, useEffect } from 'react';
import { BiPlus, BiComment, BiTrash, BiDockLeft, BiDockRight, BiPencil } from "react-icons/bi";
import { useMutation, useQueryClient } from 'react-query';
import { createRoom,deleteRoom } from '../lib/request';

export default ({ getRooms, handler }) => {
    const queryclient = useQueryClient();
    const createMutation = useMutation(createRoom, {
        onSuccess : () => {
            queryclient.invalidateQueries('rooms')
        }
    })

    const deleteMutation = useMutation(deleteRoom, {
        onSuccess : () => {
        queryclient.invalidateQueries('rooms')
        }
    })
    /*   const [isMinimized, setIsMinimized] = useState(false);
      const [rooms, setRooms] = useState([]);
  
      useEffect(() => {
          async function fetchRooms() {
              try {
                  const fetchedRooms = await getRooms();
                  setRooms(fetchedRooms);
              } catch (error) {
                  console.error('Error fetching rooms:', error);
              }
          }
  
          fetchRooms();
      }, [getRooms]);
  
      if (isMinimized) {
          return (
              <button className="fixed top-0 left-0 z-50 bg-transparent hover:bg-blue-600 p-2" onClick={() => setIsMinimized(false)}>
                  <BiDockRight size={20} className="text-gray-50" />
              </button>
          );
      } */

    return (
        <aside className="fixed left-0 w-80 h-screen bg-gray-900">
            <div className="text-gray-50 py-3">
                <div className="flex justify-start items-center w-full mb-5">
                <button className="border rounded-md border-gray-600 w-4/5 hover:bg-blue-600 text-left py-3 mr-2" onClick={() => createMutation.mutate()} >
                        <BiPlus className="inline mx-2" size={19} /> New Chat
                    </button>
             {/*      <button onClick={() => setIsMinimized(true)} className="border rounded-md border-gray-600 w-1/6 hover:bg-blue-600 py-3">
                        <BiDockLeft size={19} className="inline mx-2" />
                    </button> */}
                </div>
                <div className="flex flex-col gap-4 px-3">

                    <div className="chat_list w-full flex flex-col gap-4 px-3">
                        {

                            getRooms.map((chat, index) => {
                                return (
                                    <div key={index} className="w-full border-0 rounded-md bg-gray-800 py-1 px-3 flex justify-center items-center">
                                        <button className="text-left truncate w-full" onClick={()=>handler(chat._id)}>
                                            <span className="block py-3 text-gray-50">
                                                <BiComment className="inline mx-2" size={19}></BiComment>
                                                {chat.name}
                                            </span>
                                        </button>
                                        <button className="bg-gradient-to-l form-gray-800 py-4  hover:text-green-600">
                                            <BiPencil />
                                        </button>
                                        <button onClick={()=>deleteMutation.mutate(chat._id)} className="bg-gradient-to-l form-gray-800 py-4 px-3 hover:text-red-600">
                                            <BiTrash />
                                        </button>
                                    </div>
                                );
                            })

                        }

                    </div>

                </div>

            </div>

        </aside>
    )
}