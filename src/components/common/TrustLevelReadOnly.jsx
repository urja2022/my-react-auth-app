import { Rating } from '@mui/material'
import React from 'react'

const TrustLevelReadOnly = ({rating, maxStar}) => {
    return (
        <span className='d-flex align-items-center'>
            <span className='app_text_12 app_text_gray me-1'>Trust level</span>
            <Rating size='small' name="read-only" max={maxStar ? maxStar : 5} precision={0.5} value={rating ? rating : 0}  readOnly />
        </span>
    )
}

export default TrustLevelReadOnly