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
import { useSnackbar } from "notistack";

const TrackUserPopup = (props) => {
    const { onClose, open, newLinkId,traceCount } = props;
    const [searchData, setSerchData] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => {
        onClose();
    };

    const handleSearch = (e) => {
        setSerchData(e.target.value.trim());
    }

    const { data: userTrackRequest, refetch: linkedRequestList } = useQuery("userTrackRequest", async ({ signal }) => {
        if (newLinkId) {
            return await axiosPrivate.get(USER_API_URL.getUserTrace + newLinkId, { signal }).then(res => res.data)
        }
    }, { refetchOnWindowFocus: false });
    
    useEffect(() => {
        if (newLinkId) {
            linkedRequestList();
        }
    }, [newLinkId])

    const deleteTrackUser = async (id) => {
        const response = await axiosPrivate.delete(USER_API_URL.deleteUserTrace + id)
        if (response.status == 200) {
            linkedRequestList();
            enqueueSnackbar("track user delete successfully", {
                variant: "success",
                anchorOrigin: { vertical: "top", horizontal: "right" },
                autoHideDuration: 2000,
            });
        } else {
            enqueueSnackbar("something went wrong", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
                autoHideDuration: 2000,
            });
        }
    }
    return (
        <Dialog onClose={handleClose} open={open} className="linking_popup_wrapper">
            <DialogTitle className='px-0 pt-0 position-relative'>
                <span className='app_text_20_500'>track user list</span>
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
            {userTrackRequest && userTrackRequest.length > 0 ?
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
                    <h4 className='app_text_gray app_text_12_fw500 py-3 ps-1'>list of users who are track : {userTrackRequest.length}/{traceCount}</h4>
                    <List className='linkList' sx={{ pt: 0 }}>
                        {userTrackRequest.filter(user => user?.userName?.toLowerCase().includes(searchData.toLowerCase())).map((user, index) => (
                            <LinkListRow
                                key={index}
                                userId={user._id}
                                userName={user.userName??""}
                                name={user.fullName??""}
                                businessName={user.businessName??""}
                                userPic={user.image}
                                del={true}
                                deleteTrackUser={deleteTrackUser}
                                status={user.status}
                            />
                        ))}
                    </List>
                </>
                :
                <span className='app_text_20_semibold'>no track user</span>
            }
        </Dialog>
    );
}

TrackUserPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default TrackUserPopup