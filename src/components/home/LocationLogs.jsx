import { Box, Button, List, ListItem } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsOutlinedIcon from '@mui/icons-material/DirectionsOutlined';

const LocationLogs = ({ activityList, handleLocationLogBack, handleLocationLog, handleMapFeedItemIcon }) => {
    const sidebarContentBoxRef1 = useRef(null);
    const navigate = useNavigate();
    const handleClick = (flag, id) => {
        handleLocationLog(id)
        handleMapFeedItemIcon(flag)
    };

    useEffect(() => {
        sidebarContentBoxRef1.current.addEventListener("scroll", () => {
            if (sidebarContentBoxRef1.current.scrollTop > 10) {
                sidebarContentBoxRef1.current.classList.add("scrolling")
            } else {
                sidebarContentBoxRef1.current.classList.remove("scrolling")
            }
        })
    })


    return (
        <Box className='map_side_box'>
            <div className='p-3'>
                <Button onClick={handleLocationLogBack} sx={{ minWidth: 'unset' }} className='app_blank_btn p-0'>
                    <ArrowBackIcon style={{ color: '#2D3748' }} />
                </Button>
            </div>
            <div className='map_side_box_header'>
                <h4 className="app_text_20_500 app_text_black">Location Log</h4>
            </div>
            <div ref={sidebarContentBoxRef1} className='map_sidebox_container'>
                <div className='map_side_box_content'>
                    <List className='map_side_box_list'>
                        {Object.keys(activityList).length > 0 ? Object.keys(activityList).map((key, index) => {
                            return <ListItem className='map_sidebox_listItem' key={index}>
                                <div className="d-flex justify-content-between w-100 align-items-center">
                                    <h4 className="app_text_16 mb-0">{key}</h4>
                                    <Button disableRipple className="app_null_btn" onClick={() => handleClick('date', activityList[key])}><DirectionsOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button>
                                </div>
                            </ListItem>
                        }) : <><div className="d-flex justify-content-between w-100 align-items-center"><span className='app_text_20_semibold'>No Activity Found</span></div></>}
                    </List>
                </div>
            </div>
            <div className='map_side_box_footer'>
                {Object.keys(activityList).length > 0 && <Button variant="contained" onClick={() => handleClick('all', 'all')} className="app_black_btn app_btn" endIcon={<DirectionsOutlinedIcon style={{ color: '#fff' }} />}>Show All</Button>}
            </div>
        </Box>
    )
}

export default LocationLogs