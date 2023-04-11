import React from 'react'
import { Stack } from '@mui/material'
import UserAvatar from '../common/UserAvatar'
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const UserAvatarWithNameAndID = ({ userImg, avatarSize, userFullName,businessName, userId }) => {
    return (
        <div className={`d-flex ${userId ? 'align-item-start' : 'align-items-center'}`}>
            <UserAvatar diameter={avatarSize} alternateSrc={userFullName} imgSrc={userImg} />
            <Stack direction="column" sx={{ marginLeft: 1.5 }} className='justify-content-center' spacing={0}>
                <span className='app_text_14_semibold app_text_black text-capitalize'>{userFullName}</span>
                {userId && <span className='app_text_12 app_text_gray text-lowercase'>{`@${userId}`}</span>}
                {businessName && <span className='app_text_gray app_text_12'><BusinessCenterIcon sx={{ color: "#97A8BE", fontSize: 15 }} /><span className='app_text_gray app_text_14 mx-1'>{businessName}</span></span>}
            </Stack>
        </div>
    )
}

export default UserAvatarWithNameAndID