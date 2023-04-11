import React from 'react'

const CalanderCheckEditable = ({ color }) => {
    return (
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.25 2.25H11.5V0.75H10V2.25H4V0.75H2.5V2.25H1.75C0.925 2.25 0.25 2.925 0.25 3.75V14.25C0.25 15.075 0.925 15.75 1.75 15.75H12.25C13.075 15.75 13.75 15.075 13.75 14.25V3.75C13.75 2.925 13.075 2.25 12.25 2.25ZM12.25 14.25H1.75V6.75H12.25V14.25ZM1.75 5.25V3.75H12.25V5.25H1.75ZM5.92 13.095L10.3675 8.6475L9.5725 7.8525L5.92 11.505L4.3375 9.9225L3.5425 10.7175L5.92 13.095Z" fill={color} />
        </svg>

    )
}

export default CalanderCheckEditable