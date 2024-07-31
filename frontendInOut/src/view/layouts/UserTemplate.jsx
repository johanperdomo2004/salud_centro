import React from 'react';
/* import Sidebar from '../../components/organisms/Sidebar'; */
/* import Navbar from '../../components/organisms/Navbar'; */
import { Navbar } from '../../components/Navbar';

const UserTemplate = ({ children }) => (
  <div className="w-full h-[100vh] flex">
    <div className='w-full h-full bg-gray-100'>
      <header className='w-full rounded-es'><Navbar /></header>
      <div className='w-full overflow-y-auto h-[calc(100%-72px)] px-8 pb-5 flex flex-col justify-between'>
        <main className='w-full flex flex-col justify-center items-center '>
          {children}
        </main>
       {/*  <footer className='flex justify-center'>Dashboard Footer</footer> */}
      </div>
    </div>
  </div>
);

export default UserTemplate;