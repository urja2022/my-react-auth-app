import React from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button } from '@mui/material';

const CompleteProfilePopup = (props) => {
    const { onClose, open } = props;
    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle className='text-center'>Complete Profile</DialogTitle>
            <p className="app_text_16 app_text_gray px-4">Update your profile to increase
                your trust level</p>
            <div className='d-flex align-items-center p-3 justify-content-center'>
                <Button onClick={onClose} variant="outlined" className="app_btn_lg app_text_16_semibold text-lowercase app_text_primary app_border_primary">Skip For Now</Button>
                <Button href="/dashboard/profile-settings" className='app_bg_primary app_text_16_semibold app_btn_lg text-white text-lowercase ms-3'>Complete</Button>
            </div>
        </Dialog>
    )
}

export default CompleteProfilePopup