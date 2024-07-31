import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import Sidebars from '../components/Sidebars';



export const DashboardTemplate = ({ setLoggedIn, user }) => {


    return (
        <main className="flex h-screen w-full">
            <section className="hidden tablet:initial bg-gray-100">
                <Sidebars/>
            </section>
            <section className="flex flex-col w-full h-screen">
                <Navbar setLogIn={setLoggedIn}/>
                <div className="flex-1 overflow-y-auto bg-gray-100">
                    <Outlet user={user}/>
                </div>
            </section>
        </main> 
    )
}
