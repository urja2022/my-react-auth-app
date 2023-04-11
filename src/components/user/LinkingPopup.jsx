import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, InputBase, Paper } from '@mui/material';
import SearchIcon from 'src/svgComponents/SearchIcon';
import LinkListRow from './LinkListRow';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { USER_API_URL } from 'src/api/axios';
import { useQuery } from 'react-query';

const LinkingPopup = (props) => {
    const { onClose, open, newLinkId } = props;
    const [searchData, setSerchData] = useState("");
    const axiosPrivate = useAxiosPrivate();

    const handleClose = () => {
        onClose();
    };

    const handleSearch = (e) => {
        setSerchData(e.target.value.trim());
    }

    const { data: newLinkRequest, refetch: linkedRequestList } = useQuery(["newLinkRequest", newLinkId], async ({ signal }) => {
        if (newLinkId) {
            return await axiosPrivate.get(USER_API_URL.linkedRequest + newLinkId, { signal }).then(res => res.data)
        }
    }, { refetchOnWindowFocus: false });

    useEffect(() => {
        if (newLinkId) {
            linkedRequestList();
        }
    }, [newLinkId])

    return (
        <Dialog onClose={handleClose} open={open} className="linking_popup_wrapper">
            <DialogTitle className='px-0 pt-0'>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                    <span className='app_text_20_500'>Linked List</span>
                    {onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 12,
                                color: (theme) => theme.palette.grey[500],
                                display: "contents !important"
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </Box>
            </DialogTitle>
            {newLinkRequest && newLinkRequest.length > 0 ?
                <>
                    <Paper className='linking_popup_searchbox'>
                        <IconButton style={{ marginTop: "-2px" }}>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search"
                            onChange={handleSearch}
                        />
                    </Paper>
                    <h4 className='app_text_gray app_text_12_fw500 py-3 ps-1'>List of users who are linked to contacts</h4>
                    <List className='linkList' sx={{ pt: 0 }}>
                        {newLinkRequest.filter(user => user.name.toLowerCase().includes(searchData.toLowerCase())).map((user, index) => (
                            <LinkListRow
                                key={index}
                                userId={user.id}
                                userName={user.userName}
                                name={user.name}
                                businessName={user.businessName}
                                permissions={user.permissions}
                                userStatus={user.userStatus}
                                userPic={user.image}
                                isLinked={user.selfStatus}
                            />
                        ))}
                    </List>
                </>
                :
                <span className='app_text_20_semibold'>No Link User</span>
            }
        </Dialog>
    );
}

LinkingPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default LinkingPopup