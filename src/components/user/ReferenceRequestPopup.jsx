import React from 'react'
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { InputBase, Paper } from '@mui/material';
import SearchIcon from 'src/svgComponents/SearchIcon';
import RefReqRow from './RefReqRow';

const RefRequestsPopup = (props) => {
    const { onClose, open, friendRefRequestData } = props;

    const handleClose = () => {
        onClose();
    };


    return (
        <Dialog onClose={handleClose} open={open} className="request_popup_wrapper">
            <DialogTitle className='px-0 pt-0'>
                <span className='app_text_20_semibold'>Reference Requests</span>
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 12,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
            {friendRefRequestData && friendRefRequestData.length > 0 ? 
            <>
            <Paper className='linking_popup_searchbox'>
                <IconButton style={{ marginTop: "-2px" }}>
                    <SearchIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search"
                // inputProps={ }
                />
            </Paper>
            <List className='linkList mt-3' sx={{ pt: 0 }}>
                {friendRefRequestData.map((user,index) => (
                    <RefReqRow 
                        key={index}
                        requestId={user.requestId}
                        userId={user.userId}
                        name={user.name}
                        businessName={user.businessName}
                        userName={user.userName} 
                        userPic={user.image}
                        mobile={user.mobile}
                        endorsedType={user.endorsedType}
                    />
                ))}
            </List>
            </>
            :
                <span className='app_text_20_semibold'>No Referance Requests</span>
            }
        </Dialog>
    )
}

RefRequestsPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default RefRequestsPopup