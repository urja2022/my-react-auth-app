import React, { useEffect, useState } from 'react'
import { Card, Table, TableBody, TableCell, TableContainer, TableRow, Button } from "@material-ui/core";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from 'src/routes/paths';
import UserListHead from "src/components/user/UserListHead";
import { styled } from '@mui/material/styles';
import moment from 'moment'
import EditPenIcon from 'src/svgComponents/EditPenIcon'
import Stack from '@mui/material/Stack';
import AppTooltip from "src/components/common/AppTooltip";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import BinIcon from 'src/svgComponents/BinIcon'
import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from "notistack";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { BUSINESS_API_URL } from "src/api/axios";
import { useQuery } from 'react-query';
import LoadingScreen from 'src/components/LoadingScreen'
import BusinessBulkAddressPopup from "src/components/user/BusinessBulkAddressPopup";
import * as XLSX from "xlsx";
import { processData } from "src/helpers/helpers";
import _ from "lodash";

const BusinessAddress = () => {
    const [businessData, setBusinessData] = useState();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const axiosPrivate = useAxiosPrivate();
    const [id, setid] = useState("");
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [loding, setLoding] = useState(true);
    const [array, setArray] = useState([]);
    const [bulkAddressPopup, setBulkAddressPopup] = useState(false);

    useEffect(() => {
        setBusinessData(state?.businessData)
        setTimeout(() => {
            setLoding(false);
        }, 1800);
    }, [state]);

    const handleClickOpen = (Id) => {
        setid(Id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const TABLE_HEAD = [
        { id: 'name', label: 'address name', alignRight: false },
        { id: 'email', label: 'email', alignRight: false },
        { id: 'mobile', label: 'mobile', alignRight: false },
        { id: 'createdAt', label: 'date', alignRight: false },
        { id: 'action', label: 'action', alignRight: false },
    ];
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

    const { data: addressList, refetch } = useQuery(
        "addressList",
        async ({ signal }) => {
            return await axiosPrivate
                .get(BUSINESS_API_URL.getBusinessAddress + state?.businessData?._id, { signal })
                .then((res) => res.data);
        },
        { refetchOnWindowFocus: false }
    );
    const handleRequestBusinessAddressEdit = (data) => {
        navigate(PATH_DASHBOARD.general.businessAddressUpdate, { state: { businessAddressData: data } });
    };

    const handleRequestBusinessAdd = () => {
        navigate(PATH_DASHBOARD.general.businessAddressAdd, { state: { data: { userId: businessData?.userId, businessId: businessData?._id } } });
    };

    const deleteAddress = async () => {
        handleClose();
        const response = await axiosPrivate.delete(BUSINESS_API_URL.deteleBusinessAddress + id)
        if (response.status == 200) {
            enqueueSnackbar("address delete successfully", {
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
    };

    const handleBulkAddressClose = (value) => {
        refetch();
        setBulkAddressPopup(false);
        setArray([])
    };

    const handleAddressFileOnChange = (e) => {
        const file = e.target.files[0];
        if (!file) return false
        if (["xlsx", "csv"].includes(file.name.split(".").pop())) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                /* Parse data */
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
                setArray(processData(data));
                setBulkAddressPopup(true);
            };
            reader.readAsBinaryString(file);
        } else {
            setBulkAddressPopup(false);
            enqueueSnackbar("only accept Xlsx and csv file.", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
                autoHideDuration: 2000,
            });
        }
    };
    return (
        <>
            {loding ? <LoadingScreen /> : <>
                <div className="dashboard_header mb-4">
                    <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">user business address</h4>
                    <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
                        <AppTooltip title="add business address" placement="bottom"><Button className="dashboard_light_bg_icon_btn" onClick={() => handleRequestBusinessAdd()}
                        ><AddCircleOutlineOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>
                        <AppTooltip title="add bulk business address" placement="bottom"><Button
                            fullWidth
                            variant='contained'
                            className='my-3 text-capitalize app_bg_primary_medium app_text_primary app_text_16_semibold app_btn_lg'
                            component='label'>
                            <input hidden name='document' accept=' .xlsx,.csv' onInput={handleAddressFileOnChange} type='file' />
                            add bulk address
                        </Button></AppTooltip>
                    </Stack>
                </div>
                <Dialog
                    fullScreen={fullScreen}
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
                        <Button className="theme_button" variant="contained" onClick={() => deleteAddress()} autoFocus>
                            delete
                        </Button>
                    </DialogActions>
                </Dialog>
                <Card>
                    <TableContainer>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            {addressList?.length > 0 ?
                                <TableBody>
                                    {addressList?.map((row, i) => {
                                        return (
                                            <StyledTableRow key={i}>
                                                <TableCell component="th" scope="row">
                                                    {row?.physicalAddress}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row?.email}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {row?.mobile}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {moment(row.createdAt).format("MMM DD YYYY h:mm A")}
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1}>
                                                        <AppTooltip title="business address edit" placement="bottom" ><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                                                            onClick={() => handleRequestBusinessAddressEdit(row)}
                                                            variant="text" className="user_list_row_btn"><EditPenIcon /></Button></AppTooltip>
                                                        {row?.primaryAddress ? "" : <AppTooltip title="business address delete" placement="bottom"><Button variant="text" className="user_list_row_btn"
                                                            onClick={() => handleClickOpen(row._id)}><BinIcon /></Button></AppTooltip>}
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
                {!_.isEmpty(array) && <BusinessBulkAddressPopup addressData={array} businessId={businessData?._id} userId={businessData?.userId} open={bulkAddressPopup} onClose={handleBulkAddressClose} />}
            </>
            }
        </>
    )
}

export default BusinessAddress