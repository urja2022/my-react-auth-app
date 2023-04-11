import { Button, ListItem } from '@mui/material'
import React from 'react'
import UserAvatar from '../common/UserAvatar'
import DeleteIcon from '@mui/icons-material/Delete';

const TrackRequestListItem = ({ userImg, userFullname, requestFor, onAccept, onReject, status }) => {
    return (
        <ListItem className="track_req_list_item">
            <div className="d-flex align-items-center">
                <UserAvatar diameter={40} imgSrc={userImg} alternateSrc={userFullname} />
                <div className='d-flex flex-column ms-2'>
                    <h4 className="app_text_14_500 app_text_black text_limit_120 mb-1">{userFullname}</h4>
                    <span className="app_text_12_fw500 app_text_gray">@{requestFor}</span>
                </div>
            </div>
            <div className='d-flex'>
                {status == 0 && <Button onClick={() => onAccept()} className="app_row_btn app_bg_primary app_text_14_semibold text-white text-capitalize">Accept</Button>}
                <Button onClick={() => onReject()} className="app_row_btn app_bg_primary_light app_text_14_semibold app_text_primary text-capitalize ms-2"><DeleteIcon /></Button>
            </div>
        </ListItem>
    )
}

export default TrackRequestListItem