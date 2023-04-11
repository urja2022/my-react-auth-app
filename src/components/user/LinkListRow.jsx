import React from 'react'
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { ListItem, Button } from '@mui/material'
import UserAvatarWithNameAndID from '../common/UserAvatarWithNameAndID';
import AppTooltip from "src/components/common/AppTooltip";

const LinkListRow = ({ userId, userPic, businessName, name, isLinked, userName, distance, del, deleteTrackUser, status }) => {
    return (
        <ListItem className='px-0 py-3'>
            <UserAvatarWithNameAndID
                userImg={userPic ? process.env.REACT_APP_PROFILE_URL + userPic : ""}
                avatarSize={48}
                userFullName={businessName ? businessName : name}
                userId={businessName ? name : userName}
            />
            <div className='d-flex flex-column'>
                <div className='d-flex'>
                    {distance && <span className='ms-2 app_text_gray app_text_12 d-flex align-items-center'><FmdGoodIcon style={{ fontSize: 12, marginRight: 3 }} />{`${distance} away`}</span>}
                </div>
            </div>
            {/* {status && <span className='ms-2 app_text_gray app_text_12 d-flex align-items-center'>{(status !== 1) ? "approve" : "pending"}</span>} */}
            {del && <AppTooltip title="delete user" placement="bottom"><Button className='ms-auto linkList_btn app_border_primary app_text_transform app_text_12_semibold app_text_primary app_bg_primary_light' onClick={() => deleteTrackUser(userId)} variant='outlined'>delete</Button></AppTooltip>}
        </ListItem >
    )
}

export default LinkListRow