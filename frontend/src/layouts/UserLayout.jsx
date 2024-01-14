import React, { useContext } from 'react'
import Header from '../components/common/Header'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Outlet } from 'react-router-dom'
import { UserProvider } from '../UserContext'

export default function UserLayout() {
        return (
            <>

                <div>
                    <Outlet />
                </div>
                <Footer />
            </>
        
    )
}
