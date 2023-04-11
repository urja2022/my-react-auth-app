import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { InputBase, Paper } from '@mui/material';
import SearchIcon from 'src/svgComponents/SearchIcon';
import LinkListRow from './LinkListRow';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { USER_API_URL } from 'src/api/axios';
import { useQuery } from 'react-query';

const EventBlockUserPopup = (props) => {
    const { onClose, open, newLinkId } = props;
    const [searchData, setSerchData] = useState("");
    const axiosPrivate = useAxiosPrivate();

    const handleClose = () => {
        onClose();
    };

    const handleSearch = (e) => {
        setSerchData(e.target.value.trim());
    }

    const { data: newLinkRequest, refetch: linkedRequestList } = useQuery("newLinkRequest", async ({ signal }) => {
        if (newLinkId) {
            return await axiosPrivate.get(USER_API_URL.eventBlockUser + newLinkId, { signal }).then(res => res.data)
        }
    }, { refetchOnWindowFocus: false });

    useEffect(() => {
        if (newLinkId) {
            linkedRequestList();
        }
    }, [newLinkId])

    return (
        <Dialog onClose={handleClose} open={open} className="linking_popup_wrapper">
            <DialogTitle className='px-0 pt-0 position-relative'>
                <span className='app_text_20_500'>event block user list</span>
                {onClose ? (
                    <IconButton
                        className='dialog_close_btn'
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: "-10px",
                            right: "-10px",
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
            {newLinkRequest && newLinkRequest.length > 0 ?
                <>
                    <Paper className='linking_popup_searchbox'>
                        <IconButton style={{ marginTop: "-2px" }}>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="search"
                            onChange={handleSearch}
                        />
                    </Paper>
                    <h4 className='app_text_gray app_text_12_fw500 py-3 ps-1'>list of users who are event block</h4>
                    <List className='linkList' sx={{ pt: 0 }}>
                        {newLinkRequest.filter(user => user?.userName?.toLowerCase().includes(searchData.toLowerCase())).map((user, index) => (
                            <LinkListRow
                                key={index}
                                userId={user?.id}
                                userName={user?.reason}
                                name={user.userName}
                            />
                        ))}
                    </List>
                </>
                :
                <span className='app_text_20_semibold'>no event block user</span>
            }
        </Dialog>
    );
}

EventBlockUserPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default EventBlockUserPopup