import React, { useState } from 'react'
import UserImagePlaceholder from '../user/UserImagePlaceholder'

const UserAvatar = ({ diameter, imgSrc, alternateSrc }) => {
    const [imageError, setImageError] = useState(false);

    let Avatar = () => !imageError && imgSrc ? <img src={imgSrc} alt="user avatar" onError={() => setImageError(true)} /> : <UserImagePlaceholder diameter={diameter} firstChar={alternateSrc ? alternateSrc.charAt(0) : 'B'} />

    return (
        <div className='app_user_avatar' style={{ width: `${diameter}px`, height: `${diameter}px`, transition: 'all 0.3s ease-in-out' }}>
            <Avatar />
        </div>
    )
}

export default UserAvatar