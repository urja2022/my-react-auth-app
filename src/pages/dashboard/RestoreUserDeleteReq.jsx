
import React, { useEffect, useState } from "react";
import { IconButton, InputBase, Paper, Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Chip } from "@material-ui/core";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import UserListHead from "src/components/user/UserListHead";
import { Stack, useMediaQuery } from "@mui/material";
import Button from '@mui/material/Button';
import SearchIcon from "src/svgComponents/SearchIcon";
import { styled } from '@mui/material/styles';
import LoadingScreen from 'src/components/LoadingScreen'
import moment from 'moment'
import AppTooltip from "src/components/common/AppTooltip";
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { useSnackbar } from "notistack";
import { useTheme } from '@mui/material/styles';
import useStore from "src/contexts/AuthProvider";
import { useNavigate } from "react-router";
import { USER_API_URL } from "src/api/axios";
import { useMutation, useQuery } from "react-query";
import { PATH_DASHBOARD } from "src/routes/paths";
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

const _ = require('lodash');



function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
function applySortFilter(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
}
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
// getArchivedUserList
const RestoreUserDeleteReq = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [tableData, setTableData] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [loding, setLoding] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const permissionsData = useStore(state => state.permissions);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [deleteData, setDeleteData] = useState(false);
    const [CsvData, setCsvData] = useState([]);
    const [disableBtn, setDisableBtn] = useState(false)






    //restore-deleted request
    async function updateRequest() {
        setDisableBtn(true);
        await restoreReq();

    };
    const { mutateAsync: restoreReq } = useMutation(async () => {
        const response = await axiosPrivate.post(USER_API_URL.removeArchiveUser, { id: deleteData._id, type: deleteData?.status });
        return response;
    }, {
        onSuccess: (data) => {
            enqueueSnackbar(data.data.message, {
                variant: "success",
                anchorOrigin: { vertical: "top", horizontal: "right" },
                autoHideDuration: 2000,
            });

        },
        onError: (error) => {
            if (error?.response?.data.errors || error?.response?.data?.message) {
                const errors = error?.response?.data?.errors
                const errorMessage = error?.response?.data?.message;
                if (errorMessage) {
                    enqueueSnackbar(errorMessage, {
                        variant: "error",
                        anchorOrigin: { vertical: "top", horizontal: "right" },
                        autoHideDuration: 2000,
                    });
                } else if (errors)
                    Object.keys(errors).map(function (key) {
                        return enqueueSnackbar(errors[key], {
                            variant: "error",
                            anchorOrigin: { vertical: "top", horizontal: "right" },
                            autoHideDuration: 2000,
                        });
                    });
            }
        },
        onSettled: () => {
            setDisableBtn(false);
            handleClose()
            refetch();
        }
    })

    const TABLE_HEAD = [
        { id: 'userName', label: 'name', alignRight: false },
        { id: 'email', label: 'email', alignRight: false },
        { id: 'mobile', label: 'mobile', alignRight: false },
        { id: 'restore_request_type', label: 'restore request type', alignRight: false },
        { id: 'createdAt', label: 'date', alignRight: false },
        { id: 'action', label: 'action', alignRight: false },
    ];


    useEffect(() => {
        var arr = [];
        tableData.map((item) => {
            const createdAt = new Date(item?.createdAt).toLocaleString();
            var obj = {
                "name": item?.businessId ? item?.businessName : item?.userName,
                "email": item?.businessId ? item?.businessEmail : item?.userEmail,
                "mobile": item?.mobile ? item?.mobile : '-',
                "restore_request_type": item?.businessId ? 'Business' : ' User',
                "createdAt": createdAt ?? '-',
            }
            arr.push(obj);
        })
        setCsvData(arr)
    }, [tableData]);
    const headers = [
        { label: "name", key: "name" },
        { label: "email", key: "email" },
        { label: "mobile", key: "mobile" },
        { label: "restore_request_type", key: "restore_request_type" },
        { label: "createdAt", key: "createdAt" },
    ];
    let csvReport = {
        data: CsvData,
        headers: headers,
        filename: 'beemz-restore-deleted-users.csv'
    };
    const handleFilterByName = (event) => {
        setFilterName(event.target.value.trim());
        getArchivedUser(page, filterName);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setTimeout(() => {
            refetch();
        }, 500);
    };

    // get deleted users
    async function getArchivedUser(page, filterName) {
        const response = await axiosPrivate.get(USER_API_URL.getDeletedReqList, { params: { page: page + 1, search: filterName, limit: rowsPerPage } })
        return response.data[0];
    }
    const { isLoading, data: userArchivedList, refetch } = useQuery(['userArchivedList', page, filterName], () => getArchivedUser(page, filterName), { keepPreviousData: true, })
    useEffect(() => {
        if (userArchivedList) {
            setTableData(userArchivedList?.data);
            setRowsPerPage(userArchivedList?.metadata.length != 0 ? userArchivedList?.metadata[0].limit : 10);
        }
        if (userArchivedList?.metadata.length != 0 && userArchivedList?.metadata[0].hasMoreData == true) {
            getArchivedUser(page + 1);
        }
        setTimeout(() => {
            setLoding(false);
        }, 1800);
    }, [userArchivedList])

    if (isLoading) return <LoadingScreen />

    const filteredUsers = applySortFilter(tableData, getComparator(order, orderBy));

    //dialogue
    const handleClickOpen = (value) => {
        setDeleteData(value);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setDisableBtn(false);
    };


    const handleRequestEdit = (data) => {
        if (data?.is_business == 1) {
            navigate(PATH_DASHBOARD.general.restoreBusinessView, { state: { id: data._id } })
        } else {
            navigate(PATH_DASHBOARD.general.restoreUserView, { state: { id: data._id } })
        }
    };

    return (
        <>
            {loding ? <LoadingScreen /> : <>
                <div className="dashboard_header mb-4">
                    <Paper className='dashboard_searchbox col-lg-4'>
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            fullWidth
                            sx={{ flex: 1 }}
                            placeholder="search user name..."
                            onChange={(e) => handleFilterByName(e)}
                        />
                    </Paper>
                    <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
                        <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>
                        {/* csv */}
                        {permissionsData?.users?.substring(1, 2) == "1"
                            ?
                            <AppTooltip title="export-users" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip> : ''}
                    </Stack>
                </div>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title" className='m-auto'>
                        {"Are you sure you want to remove user from archive?"}
                    </DialogTitle>
                    <DialogContent>
                    </DialogContent>
                    <DialogActions className='m-auto'>
                        <Button className="theme_button_view" variant="contained" autoFocus onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button className="theme_button_view" variant="contained" disabled={disableBtn} onClick={() => updateRequest()} autoFocus>
                            restore
                        </Button>
                    </DialogActions>
                </Dialog>
                <Card>
                    <TableContainer>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                                rowCount={0}
                                onRequestSort={handleRequestSort}
                            />
                            {tableData?.length > 0 ?
                                <TableBody>
                                    {filteredUsers?.map((row, i) => (
                                        <StyledTableRow key={i}>
                                            <TableCell component="th" scope="row">
                                                {row?.is_business == 0 ? row.userName : row.businessName}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row?.is_business == 0 ? row.userEmail : row.businessEmail}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row?.mobile  ? row.mobile : '-'}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row?.is_business == 0 ? "User" : "Business"}
                                            </TableCell>
                                            <TableCell align="left"> {moment(row.createdAt).format("MMM DD YYYY h:mm A")}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={3}>
                                                    {/* Restore  */}
                                                    <AppTooltip title="delete user & business" placement="bottom"><Button className="theme_button" variant="contained" onClick={(e) => handleClickOpen(row)}>restore</Button></AppTooltip>

                                                    {/* view user */}
                                                    <AppTooltip title="view user" placement="bottom"><Button className="invalid_button" variant="contained" onClick={() => handleRequestEdit(row)} >View</Button></AppTooltip>


                                                </Stack>
                                            </TableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>

                                :

                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" colSpan={6} sx={{ py: 5 }}>
                                            <span className="app_text_16_semibold">no data found</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>

                            }

                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        count={userArchivedList?.metadata.length != 0 ? userArchivedList?.metadata[0].total : 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </>
            }
        </>
    )
}

export default RestoreUserDeleteReq