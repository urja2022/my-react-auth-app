import React, { createContext, useContext, useState } from 'react'
import { useEffect } from 'react';
import { useLocation } from 'react-router'
import MapSideBarLayout from './MapSideBarLayout';
export const MapContext = createContext();
const MainContent = ({ children }) => {
    let location = useLocation();
    const [isSidebar, setIsSidebar] = useState(false);
    const [latlng, setLatLng] = useState({});
    const [isNewSearch, setIsNewSearch] = useState(false);
    const handleSidebar = (bool) => {
        setIsSidebar(bool)
    }

    const updateLatLng = (data) => {
        setLatLng(data)
    }

    const onNewSearch = (bool) => {
        setIsNewSearch(bool)
    }

    useEffect(() => {
        if (location.pathname.includes("/dashboard") || location.pathname === "/") {
            setIsSidebar(true)
        } else {
            setIsSidebar(false)
        }
    }, [location])

    return (
        <div className={`${location.pathname === '/map' ? 'map_wrapper' : 'main_content_wrapper'}`}>
            {!isSidebar && <MapSideBarLayout filterLatLong={latlng} isNewSearch={isNewSearch} />}
            <MapContext.Provider value={{ handleSidebar, updateLatLng, onNewSearch }}>
                {children}
            </MapContext.Provider>
        </div>
    )
}

export default MainContent