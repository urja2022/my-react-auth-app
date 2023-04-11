import React, { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip';

const AppTooltip = ({ children, title, placement }) => {
    const [open, setShow] = useState(false);

    useEffect(() => {
        window.addEventListener("click", () => {
            setShow(false)
        })
    })

    return <Tooltip
        componentsProps={{
            tooltip: {
                sx: {
                    bgcolor: 'common.black',
                    '& .MuiTooltip-arrow': {
                        color: 'common.black',
                    },
                },
            },
        }}
        enterDelay={100}
        open={open}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        arrow
        placement={placement}
        title={title}
    >
        {children}
    </Tooltip>
}
export default AppTooltip