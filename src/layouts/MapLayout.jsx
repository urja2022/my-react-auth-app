import React from 'react'
import { Outlet } from 'react-router'
import MainNavbar from 'src/components/layouts/MainNavbar'
import MainContent from 'src/components/layouts/MainContent'

const MapLayout = () => {
    return (
        <div className='master_wrapper'>
            <MainNavbar />
            <MainContent>
                <Outlet />
            </MainContent>
        </div>
    )
}

export default MapLayout