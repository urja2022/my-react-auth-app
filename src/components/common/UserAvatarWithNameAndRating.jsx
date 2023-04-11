import { Rating } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'
import UserAvatar from './UserAvatar'

const UserAvatarWithNameAndRating = ({ imgSrc, avatarSize, userFullName, rating }) => {
    return (
        <div className='d-flex align-items-center'>
            <UserAvatar diameter={avatarSize} alternateSrc={userFullName} imgSrc={imgSrc} />
            <Stack direction="column" className='ms-3 w-100' spacing={0.3}>
                <span className='app_text_14_500 app_text_black text_limit_180 text-capitalize lh_20'>{userFullName}</span>
                {rating && <span className='d-flex align-items-center'>
                    <Rating max={1} size={"small"} value={1} />
                    <span className='ms-1 app_text_14_500 app_text_gray'>{rating}</span>
                </span>}
            </Stack>
        </div>
    )
}

export default UserAvatarWithNameAndRating