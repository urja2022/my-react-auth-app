import { FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material'
import { useField, useFormikContext } from 'formik'
import React from 'react'
import Checkbox from "@mui/material/Checkbox";

const CheckBoxWrapper = ({ name, label, ...otherProps }) => {

    const [field, meta] = useField(name);

    const { setFieldValue } = useFormikContext();
    const handleChange = (event) => {
        const { checked } = event.target;
        setFieldValue(name, checked);
    };

    const configCheckbox = {
        ...field,
        onChange: handleChange
    };

    const configFormControl = {};

    if (meta && meta.touched && meta.error) {
        configFormControl.error = true;
    }

    return (
        <FormControl>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox {...configCheckbox} {...otherProps} />}
                    label={label}

                />
            </FormGroup>
        </FormControl>
    );
};

export default CheckBoxWrapper;