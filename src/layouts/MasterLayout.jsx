import React from 'react'
import { Outlet } from 'react-router'
import MainNavbar from 'src/components/layouts/MainNavbar'
import MainContent from 'src/components/layouts/MainContent'
import MainSidebar from 'src/components/layouts/MainSidebar'

const MasterLayout = () => {
    return (
        <div className='master_wrapper'>
            <MainNavbar />
            <div className='main_wrapper'>
                <MainSidebar />
                <MainContent>
                    <Outlet />
                </MainContent>
            </div>
        </div>
    )
}

export default MasterLayout