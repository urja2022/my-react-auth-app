import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { InputBase, Paper } from '@mui/material';
import SearchIcon from 'src/svgComponents/SearchIcon';
import EmployeeRow from './EmployeeRow';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { USER_API_URL } from 'src/api/axios';
import { useQuery } from 'react-query';
import "@lottiefiles/lottie-player";

const EmployeePopup = (props) => {
    const { onClose, open, newBusinessId } = props;
    const [searchData, setSerchData] = useState("");
    const axiosPrivate = useAxiosPrivate();

    const handleClose = () => {
        onClose();
    };

    const handleSearch = (e) => {
        setSerchData(e.target.value.trim());
    }

    const { isLoading, data: employeeList, refetch } = useQuery("employeeList", async ({ signal }) => {
        if (newBusinessId) {
            return await axiosPrivate.get(USER_API_URL.employeeList + newBusinessId, { signal }).then(res => res.data)
        }
    }, { refetchOnWindowFocus: false });

    useEffect(() => {
        if (newBusinessId) {
            refetch();
        }
    }, [newBusinessId])

    return (
        <Dialog onClose={handleClose} open={open} className="linking_popup_wrapper">
            <DialogTitle className='px-0 pt-0'>
                <span className='app_text_20_500'>employee list</span>
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 12,
                            color: (theme) => theme.palette.grey[500],
                            // display: "contents !important"
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>

            {isLoading && <lottie-player autoplay loop mode="normal" src="https://assets6.lottiefiles.com/packages/lf20_f1dhzsnx.json" ></lottie-player>}

            {employeeList && employeeList.length > 0 ?
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
                    <h4 className='app_text_gray app_text_12_fw500 py-3 ps-1'>list of users who are Employess to Contacts</h4>
                    <List className='linkList' sx={{ pt: 0 }}>
                        {employeeList.filter(user => user?.name?.toLowerCase().includes(searchData?.toLowerCase())).map((user, index) => (
                            <EmployeeRow
                                key={index}
                                workHours={user?.workHours}
                                address={user?.address}
                                name={user?.name}
                                designation={user?.designation}
                                businessName={user?.businessName}
                                userPic={user?.image}
                            />
                        ))}
                    </List>
                </>
                :
                <span className='app_text_20_semibold'>no employee</span>
            }

        </Dialog>
    );
}

EmployeePopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default EmployeePopup