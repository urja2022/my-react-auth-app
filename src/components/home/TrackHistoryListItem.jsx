import React from 'react'
import { Button, ListItem, Stack } from '@mui/material'
import DirectionsOutlinedIcon from '@mui/icons-material/DirectionsOutlined';
import UserAvatar from '../common/UserAvatar'
import Chip from '@mui/material/Chip';
import LocationPinCheck from 'src/svgComponents/LocationPinCheck';
import Bin from 'src/svgComponents/Bin';
import NewLocationPin from 'src/svgComponents/NewLocationPin';
import BeemzLocationIcon from 'src/svgComponents/BeemzLocationIcon';

const TrackHistoryListItem = ({ userImg, userFullname, requestFor, historyDate, reqStatus, handleDirection, handleLiveLocation, handleDeleteRequest, handleDirectDirection }) => {
    return (
        <ListItem className="track_req_list_item">
            <div className="d-flex align-items-center">
                <UserAvatar diameter={40} imgSrc={userImg} alternateSrc={userFullname} />
                <div className='d-flex flex-column ms-2'>
                    <h4 className="app_text_14_500 app_text_black text_limit_120 mb-1">{userFullname}</h4>
                    <span className="app_text_12_fw500 app_text_gray">@{requestFor}</span>
                    <span className="app_text_12_fw500 app_text_gray">{historyDate && `Requested At ${historyDate}`}</span>
                </div>
            </div>
            <div className='d-flex'>
                <Stack spacing={1} direction={"row"}>
                    {reqStatus === 'sent' ?
                        <><Button onClick={handleDirection} className="app_row_btn app_bg_primary app_text_14_semibold text-white text-capitalize">Request</Button></>
                        : reqStatus ?
                            <>
                                <Button disableRipple className="app_row_btn app_bg_primary_light" onClick={handleLiveLocation}><NewLocationPin size={18} color={"#6200ee"} /></Button>
                                <Button disableRipple className="app_row_btn app_bg_primary_light" onClick={handleDirectDirection}><BeemzLocationIcon size={18} color={"#6200ee"} /></Button>
                                <Button disableRipple className="app_row_btn app_bg_primary_light" onClick={handleDirection}><LocationPinCheck size={18} color={"#6200ee"} /></Button>
                            </>
                            :
                            <><Button className="app_row_btn app_bg_primary_light app_text_12_semibold text-black text-capitalize">Pending</Button></>}
                    {reqStatus !== 'sent' && <Button disableRipple className="app_row_btn app_bg_red_light" onClick={handleDeleteRequest}><Bin size={18} color={"#fd4a4c"} /></Button>}
                </Stack>
            </div>
        </ListItem>
    )
}

export default TrackHistoryListItem