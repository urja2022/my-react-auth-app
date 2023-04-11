import React from 'react'
import PropTypes from 'prop-types'
const AuthBoxHeader = ({ title, instruction }) => {
    return (
        <div className='auth_box_header'>
            <h4 className='app_text_20_bold app_text_black text-lowercase'>{title}</h4>
            <p className='app_text_16 app_text_black'>{instruction}</p>
        </div>
    )
}
AuthBoxHeader.propTypes = {
    title: PropTypes.string,
    instruction: PropTypes.string
}
export default AuthBoxHeader