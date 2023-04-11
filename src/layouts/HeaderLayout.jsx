import React from 'react'
import { Outlet } from 'react-router'
import MainNavbar from 'src/components/layouts/MainNavbar'

const HeaderLayout = () => {
    return (
        <div className='master_wrapper'>
            <MainNavbar />
            <Outlet />
        </div>
    )
}

export default HeaderLayout