import { useState, useEffect } from 'react'
import Aside from '../components/aside'
import Main from '../components/main'
import Input from '../components/input'
import Loading from '../components/loading'
import { useQuery } from 'react-query'
import { getAllRooms } from '../lib/request'
import Background from '../components/background'
import { useRequireAuth } from '../context/useRequireAuth';

export default function Home() {
  const [roomid, setRoomid] = useState(null);
  const [darkTheme, setDarkTheme] = useState(true);
  const { isLoading, isError, data, error } = useQuery('rooms', getAllRooms);
  const [inputText, setInputText] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { isAuthenticated, user } = useRequireAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchRooms = async () => {
        try {
          // Update to pass user details to `getAllRooms` if necessary
          const response = await getAllRooms(user.email); // Example: passing user email
          if (response.success) {
            setRooms(response.data);
          } else {
            console.error("Failed to fetch rooms");
          }
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      };

      fetchRooms();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1080) {
        setIsSidebarVisible(false);
      } else {
        setIsSidebarVisible(true);
      }
    }
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);

  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleTheme = () => {
    setDarkTheme(prevState => !prevState);
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className='text-center'>Error: {error.message}</div>;
  if (!data) return <div className="text-center">No message</div>;

  function onRoomClick(id) {
    setRoomid(id);
    setInputText('');
  }

  return (
    <div className='grid grid-cols-6'>
      <div className='bg-gray-900 col-span-1 aside z-10 text-gray-50'>
        <Aside getRooms={data} handler={onRoomClick} isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
      </div>
      <div className={`${darkTheme ? 'bg-gray-800 text-gray-50' : 'bg-gray-200 text-black'} ${isSidebarVisible ? 'col-span-5' : 'col-span-6'} min-h-screen h-full mb-40`}>
        {roomid ? <Main roomid={roomid} darkTheme={darkTheme} isSidebarVisible={isSidebarVisible} /> : <Background />}
        {roomid && <Input roomid={roomid} inputText={inputText} setInputText={setInputText} toggleTheme={toggleTheme} darkTheme={darkTheme} isSidebarMinimized={!isSidebarVisible} />}
      </div>
    </div>
  );
}
