import React from 'react'

const BeemzUserIcon = ({ size, color }) => {
    return (
        <svg width={size ? size : '16'} height={size ? size : '16'} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2655_20867)">
                <path d="M7.33335 9.37475V13.3334H8.66669V9.37475C11.2974 9.70275 13.3334 11.9467 13.3334 14.6667H2.66669C2.66671 13.3677 3.14081 12.1133 4.00002 11.1389C4.85923 10.1646 6.04449 9.53727 7.33335 9.37475ZM8.00002 8.66675C5.79002 8.66675 4.00002 6.87675 4.00002 4.66675C4.00002 2.45675 5.79002 0.666748 8.00002 0.666748C10.21 0.666748 12 2.45675 12 4.66675C12 6.87675 10.21 8.66675 8.00002 8.66675Z" fill={color ? color : "#2D3748"} />
            </g>
            <defs>
                <clipPath id="clip0_2655_20867">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>

    )
}

export default BeemzUserIcon