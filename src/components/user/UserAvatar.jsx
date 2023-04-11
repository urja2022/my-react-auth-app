import React, { useState } from 'react'
import UserImagePlaceholder from './UserImagePlaceholder'

const UserAvatar = ({ diameter, imgSrc, alternateSrc }) => {
    const [imageError, setImageError] = useState(false);

    let Avatar = () => !imageError && imgSrc ? <img src={imgSrc} alt="user avatar" onError={() => setImageError(true)} /> : <UserImagePlaceholder diameter={diameter} firstChar={alternateSrc} />

    return (
        <div className='app_user_avatar' style={{ width: `${diameter}px`, height: `${diameter}px` }}>
            <Avatar />
        </div>
    )
}

export default UserAvatar