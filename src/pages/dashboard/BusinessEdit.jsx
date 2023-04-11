import React, { useState } from 'react'
import { Card, Table, TableBody, TableCell, TableContainer, TableRow, Chip, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import { useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { USER_API_URL } from "src/api/axios";
import LoadingScreen from 'src/components/LoadingScreen'
import UserListHead from "src/components/user/UserListHead";
import moment from 'moment'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import EditPenIcon from 'src/svgComponents/EditPenIcon'
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import AppTooltip from 'src/components/common/AppTooltip';
import Stack from '@mui/material/Stack';
import AddressIcon from 'src/svgComponents/Address'
import { useSnackbar } from 'notistack';
import DeleteIcon from "@mui/icons-material/Delete";
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';

const BusinessEdit = () => {
    const axiosPrivate = useAxiosPrivate();
    const [loding, setLoding] = useState(true);
    const [isActive, setIsActive] = useState(1);
    const [id, setId] = useState();
    const [open, setOpen] = useState();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { state } = useLocation();

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: '#ffffff',
        },
        '&:nth-of-type(even)': {
            background: "linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), #F4F5F7",
        },
        // hide last border
        '& td, & th': {
            border: 0,
        },
    }));
    const TABLE_HEAD = [
        { id: 'name', label: 'name', alignRight: false },
        { id: 'email', label: 'email', alignRight: false },
        { id: 'mobile', label: 'mobile', alignRight: false },
        { id: 'createdAt', label: 'date', alignRight: false },
        { id: 'status', label: 'status', alignRight: false },
        { id: 'action', label: 'action', alignRight: false },
    ];

    //update Buisness status
    async function updateBuisnessStatus(business) {
        const response = await axiosPrivate.patch(USER_API_URL.updateUserBuisnessStatus, { businessId: business })
        if (response.status == 200) {
            enqueueSnackbar("business status updated successfully", {
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
        refetch();
    }
    // Admin delete Business 
    async function deleteBusiness() {
        const response = await axiosPrivate.delete(USER_API_URL.deleteUserBusiness + id)
        if (response.status == 200) {
            enqueueSnackbar(response.data.message, {
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
        refetch();
        handleClose();
    }

    const { data: businessList, refetch } = useQuery(
        "businessList",
        async ({ signal }) => {
            return await axiosPrivate
                .get(USER_API_URL.getBusinessList + state?.User_id, { signal })
                .then((res) => res.data);
        },
        { refetchOnWindowFocus: false }
    );

    setTimeout(() => {
        setLoding(false);
    }, 1800);

    const handleRequestBusinessEdit = (data) => {
        navigate(PATH_DASHBOARD.general.businessUpdate, { state: { businessId: data._id } });
    };
    const handleRequestBusinessAddress = (data) => {
        navigate(PATH_DASHBOARD.general.businessAddress, { state: { businessData: data } });
    };
    const handleDeleteBusiness = (Id) => {
        setId(Id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleRequestUserEvent = (data) => {
        navigate(PATH_DASHBOARD.general.businessEvent, { state: { userId: data.userId } });
    };
    return (
        <>
            {loding ? <LoadingScreen /> : <>
                <div className="dashboard_header mb-4">
                    <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">user business</h4>
                </div>
                <Card>
                    <TableContainer>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            {businessList?.length > 0 ?
                                <TableBody>
                                    {businessList.map((row) => {
                                        return (
                                            <StyledTableRow key={row._id}>
                                                <TableCell component="th" scope="row">
                                                    {row?.name ?? '-'}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row?.email ?? '-'}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {row?.mobile ?? '-'}
                                                </TableCell>

                                                {/* {row?.status == true ? 'Active' : 'Inactive'} */}

                                                <TableCell align="left">
                                                    {moment(row.createdAt).format("MMM DD YYYY h:mm A")}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row?.status == 1 ? <Chip label="Active" className="app_status_chip accepted" /> : <Chip label="In-active" className="app_status_chip invalid" />}
                                                </TableCell>

                                                <TableCell>
                                                    <Stack direction="row" spacing={3}>
                                                        <AppTooltip title="business edit" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                                                            onClick={() => handleRequestBusinessEdit(row)}
                                                            variant="text" className="user_list_row_btn"><EditPenIcon /></Button></AppTooltip>
                                                        <AppTooltip title="business addresses" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                                                            onClick={() => handleRequestBusinessAddress(row)}
                                                            variant="text" className="user_list_row_btn"><AddressIcon /></Button></AppTooltip>
                                                        <AppTooltip title="business event" placement="bottom">
                                                            <Button variant="text" className="user_list_row_btn" onClick={() => handleRequestUserEvent(row)} ><EventOutlinedIcon /></Button>
                                                        </AppTooltip>
                                                        <AppTooltip title="status" placement="bottom">
                                                            <Switch
                                                                checked={row?.status == 1 ? true : false}
                                                                onChange={(e) => updateBuisnessStatus(row?._id)}
                                                            />
                                                        </AppTooltip>
                                                        <AppTooltip title="business delete" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                                                            onClick={() => handleDeleteBusiness(row?._id)}
                                                            variant="text" className="app_row_btn app_text_14_semibold app_text_primary text-capitalize ms-2"><DeleteIcon /></Button></AppTooltip>
                                                    </Stack>
                                                </TableCell>
                                            </StyledTableRow>
                                        )
                                    })}
                                </TableBody>
                                :
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" colSpan={5} sx={{ py: 5 }}>
                                            <span className="app_text_16_semibold">no data found</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>}
                        </Table>
                    </TableContainer>
                </Card>
            </>
            }

            <Dialog
                // fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" className='m-auto'>
                    {"are you sure you want to delete?"}
                </DialogTitle>
                <DialogContent>
                </DialogContent>
                <DialogActions className='m-auto'>
                    <Button className="theme_button_view" variant="contained" autoFocus onClick={handleClose}>
                        cancel
                    </Button>
                    <Button className="theme_button" variant="contained" onClick={() => deleteBusiness()} autoFocus>
                        delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default BusinessEdit