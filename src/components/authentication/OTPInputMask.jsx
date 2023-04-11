import React, { useEffect, useState } from 'react'
import { Stack, TextField, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import NumberFormat from 'react-number-format'
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    fieldset: {
        background: '#F2E9FF',
        outline: '1px solid #6200ee',
    },
}));
const OTPInputMask = ({ otpOnChangeFunc }) => {
    const [otpInput, setOtpInput] = useState({ 'digit-1': '', 'digit-2': '', 'digit-3': '', 'digit-4': '' })
    const [isOtpFilled, setIsOtpFilled] = useState({ 'digit-1': false, 'digit-2': false, 'digit-3': false, 'digit-4': false });
    const classes = useStyles();
    const textFieldStyleProps = {
        variant: "outlined",
        label: false,
        InputLabelProps: { shrink: false },
    }
    const digit1FilledInputStyle = { InputProps: { className: isOtpFilled['digit-1'] ? classes.fieldset : '' } }
    const digit2FilledInputStyle = { InputProps: { className: isOtpFilled['digit-2'] ? classes.fieldset : '' } }
    const digit3FilledInputStyle = { InputProps: { className: isOtpFilled['digit-3'] ? classes.fieldset : '' } }
    const digit4FilledInputStyle = { InputProps: { className: isOtpFilled['digit-4'] ? classes.fieldset : '' } }

    const handleOnChange = (ev) => {
        const { value, name } = ev.target;
        setOtpInput({ ...otpInput, [name]: value });
        setIsOtpFilled({ ...isOtpFilled, [name]: value.length === 1 })
        const [, fieldIndex] = name.split("-");
        let fieldIntIndex = parseInt(fieldIndex, 10);

        // check if all fields are not filled
        if (Object.keys(isOtpFilled).filter(digit => isOtpFilled[digit]).length !== 4) {
            // Check if no of char in field == maxlength
            if (value.length >= 1) {
                if (fieldIntIndex < 4) {
                    // Get the next input field using it's name
                    const nextfield = document.querySelector(
                        `input[name=digit-${fieldIntIndex + 1}]`
                    );
                    // If found, focus the next field
                    if (nextfield !== null) {
                        nextfield.focus();
                    }
                }
            } else {
                if (fieldIntIndex > 1) {
                    const prevField = document.querySelector(
                        `input[name=digit-${fieldIntIndex - 1}]`
                    );
                    if (prevField !== null) {
                        prevField.focus();
                    }
                }
            }
        }
    }
    const onKeyDown = (ev) => {
        const { value, name } = ev.target;
        const [, fieldIndex] = name.split("-");
        let fieldIntIndex = parseInt(fieldIndex, 10);
        let key = ev.keyCode || ev.charCode;

        if (key === 8 || key === 46) {
            if (value === '') {
                if (fieldIntIndex > 1) {
                    const prevField = document.querySelector(
                        `input[name=digit-${fieldIntIndex - 1}]`
                    );
                    if (prevField !== null) {
                        prevField.focus();
                    }
                }
            }
        }


    }

    useEffect(() => {
        otpOnChangeFunc(otpInput);
    }, [otpInput, otpOnChangeFunc])

    return (
        <>
            <Box className="py-5">
                <Stack className='otp_input_stack' direction="row" spacing={4}>
                    <NumberFormat name="digit-1" onKeyDown={onKeyDown} onChange={handleOnChange} customInput={TextField} {...textFieldStyleProps} {...digit1FilledInputStyle} format="#" />
                    <NumberFormat name="digit-2" onKeyDown={onKeyDown} onChange={handleOnChange} customInput={TextField} {...textFieldStyleProps} {...digit2FilledInputStyle} format="#" />
                    <NumberFormat name="digit-3" onKeyDown={onKeyDown} onChange={handleOnChange} customInput={TextField} {...textFieldStyleProps} {...digit3FilledInputStyle} format="#" />
                    <NumberFormat name="digit-4" onKeyDown={onKeyDown} onChange={handleOnChange} customInput={TextField} {...textFieldStyleProps} {...digit4FilledInputStyle} format="#" />
                </Stack>
            </Box>
        </>
    )
}

OTPInputMask.propTypes = {
    otpOnChangeFunc: PropTypes.func
}

export default OTPInputMask
