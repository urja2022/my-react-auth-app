import React from 'react'
import { Stack } from '@mui/material'
import UserAvatar from './UserAvatar'

const UserAvatarWithNameAndID = ({ userImg, avatarSize, userFullName, userId }) => {
    return (
        <div className={`d-flex ${userId ? 'align-item-start' : 'align-items-center'}`}>
            <UserAvatar diameter={avatarSize} alternateSrc={userFullName} imgSrc={userImg} />
            <Stack direction="column" className='ms-3 justify-content-center' spacing={0}>
                <span className='app_text_14_semibold app_text_black '>{userFullName}</span>
                {userId && <span className='app_text_12 app_text_gray '>{`@${userId}`}</span>}
            </Stack>
        </div>
    )
}

export default UserAvatarWithNameAndID