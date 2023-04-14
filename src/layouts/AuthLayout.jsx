import React from 'react'
import BeemzText from 'src/theme/BeemzText';
import WelcomeIcon from "../svgComponents/WelcomeIcon";

const AuthLayout = ({ children }) => {
    return (
        <div className="auth_wrapper">
            <div className='row h-100'>
                <div className='col-lg-6 d-none d-lg-block'>
                    <div className='auth_left_container'>
                        <div className='auth_welcome_box'>
                            <div className='welcome_icon'>
                                <WelcomeIcon />
                            </div>
                            {/* <div className='welcome_text'>
                                <h4 className='text-white app_text_30_bold text-nowrap d-flex mb-3'><BeemzText /></h4>
                            </div> */}
                            {/* <p className='text-white text-nowrap text-lowercase'>connect with trust</p> */}
                        </div>
                    </div>
                </div>
                <div className='col-lg-6 h-100'>
                    <div className='auth_right_container'>
                        <div className='auth_container'>
                            <div className='d-flex justify-content-center mb-4 d-lg-none'><WelcomeIcon /></div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout