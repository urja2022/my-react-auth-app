import React from 'react'

const ChatFilled = ({ size, color }) => {
    return (
        <svg width={size ? size : '16'} height={size ? size : '16'} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2655_20873)">
                <rect width="16" height="16" fill="" />
                <path d="M6.66668 2H9.33334C10.7478 2 12.1044 2.5619 13.1046 3.5621C14.1048 4.56229 14.6667 5.91885 14.6667 7.33333C14.6667 8.74782 14.1048 10.1044 13.1046 11.1046C12.1044 12.1048 10.7478 12.6667 9.33334 12.6667V15C6.00001 13.6667 1.33334 11.6667 1.33334 7.33333C1.33334 5.91885 1.89525 4.56229 2.89544 3.5621C3.89563 2.5619 5.25219 2 6.66668 2Z" fill={color ? color : "#2D3748"} />
            </g>
            <defs>
                <clipPath id="clip0_2655_20873">
                    <rect width="16" height="16" fill="" />
                </clipPath>
            </defs>
        </svg>

    )
}

export default ChatFilled