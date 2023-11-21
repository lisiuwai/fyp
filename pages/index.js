import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Aside from '../components/aside'
import Main from '../components/main'
import Input from '../components/input'
import Loading from '../components/loading'
import { useQuery } from 'react-query'
import { getAllRooms } from '../lib/request'

export default function Home() {
  const { isLoading, isError, data, error } = useQuery('rooms', getAllRooms)

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div className='text-center'>Error: {error.message} </div>;
  }

  if (!data) {
    return <div className="text-center">No message</div>;
  }
 console.log(data)
  return (
    <div className='grid grid-cols-6'>
      <div className='bg-gray-900 col-span-1 aside z-10 text-gray-50'>       
        <Aside getRooms={data} />
      </div>
      <div className='bg-gray-800 text-gray-50 col-span-5 min-h-screen h-full mb-40'>
        <Main>
          {/* Content here */}
        </Main>
        <Input>
          Search
        </Input>
      </div>
    </div>
  );
}
