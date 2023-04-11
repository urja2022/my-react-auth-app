import React from 'react'
import { TextField, Select, OutlinedInput, Input, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import countryCode from "../../assets/data/countryCode"

const PhoneInput = () => {
    return (
        <Box className="phone_input_box" margin="normal">
            <Input className='phoneNumber_input' fullWidth />
        </Box>
    )
}

export default PhoneInput