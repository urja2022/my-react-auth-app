import PropTypes from 'prop-types';
import List from '@mui/material/List';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { InputBase, Paper } from '@mui/material';
import SearchIcon from 'src/svgComponents/SearchIcon';
import RequestRow from './RequestRow';
const RequestsPopup = (props) => {
    const { onClose, open, friendRequestData } = props;
    const handleClose = () => {
        onClose();
    };
    return (
        <Dialog onClose={handleClose} open={open} className="request_popup_wrapper">
            <DialogTitle className='px-0 pt-0'>
                <span className='app_text_20_semibold'>Requests</span>
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
            {friendRequestData && friendRequestData.length > 0 ? 
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
                    {friendRequestData.map((user,index) => (
                        <RequestRow 
                            key={index}
                            userId={user.id}
                            name={user.name} 
                            userName={user.userName} 
                            userPic={user.image} 
                            mobile={user.fullname} 
                        />
                    ))}
                </List>
                </>
            :
            <span className='app_text_20_semibold'>No Requests</span>
            }
        </Dialog>
    )
}

RequestsPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default RequestsPopup