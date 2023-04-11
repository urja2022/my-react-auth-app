import React from 'react'
import PropTypes from 'prop-types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GoBack = ({ navigateFunc }) => {
    return (
        <div className="goback_btn_container">
            <button onClick={() => navigateFunc()} className='app_blank_btn'>
                <ArrowBackIcon />
            </button>
        </div>
    )
}
GoBack.propTypes = {
    navigateFunc: PropTypes.func
}
export default GoBack