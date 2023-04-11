import React from 'react'

const StarYellowEditable = ({ color }) => {
    return (
        <svg width="27" height="25" viewBox="0 0 27 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.7131 0.989964L17.7703 7.92301L17.8814 8.11289L18.0965 8.15925L25.9706 9.85637L20.6039 15.8344L20.4562 15.999L20.4786 16.219L21.2902 24.1978L13.9139 20.9626L13.7131 20.8745L13.5123 20.9626L6.13596 24.1978L6.94762 16.219L6.97 15.999L6.82225 15.8344L1.45554 9.85637L9.32971 8.15925L9.54479 8.11289L9.65591 7.92301L13.7131 0.989964Z" fill={color ? color : ''} stroke="#FFCB45" />
        </svg>

    )
}

export default StarYellowEditable