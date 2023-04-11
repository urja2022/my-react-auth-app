import React from 'react'
import { Stack } from '@mui/material'
import UserAvatar from './UserAvatar'

const UserAvatarWithNameIDAndDesignation = ({ userImg, designation, avatarSize, userFullName, userId }) => {
    return (
        <div className={`d-flex ${userId ? 'align-item-start' : 'align-items-center'}`}>
            <UserAvatar diameter={avatarSize} alternateSrc={userFullName} imgSrc={userImg} />
            <Stack direction="column" className='ms-3' spacing={0}>
                <span className='app_text_14_semibold app_text_black '>{userFullName}</span>
                {designation && <span className='app_text_12 app_text_gray '>{designation}</span>}
                {userId && <span className='app_text_12 app_text_gray '>{`@${userId}`}</span>}
            </Stack>
        </div>
    )
}

export default UserAvatarWithNameIDAndDesignation