import React, { useEffect, useState } from "react";
import { Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import { useQuery } from 'react-query';
import { USER_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { IconButton, InputBase, Paper, Chip } from "@mui/material";
import SearchIcon from "src/svgComponents/SearchIcon";
import LoadingScreen from 'src/components/LoadingScreen';
import EventBlockUserPopup from 'src/components/user/EventBlockUserPopup';
import { useLocation } from "react-router";
import files from "src/helpers/helpers";

const EventInvitedUser = () => {
    const { state } = useLocation();
    const [tableData, setTableData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const [loding, setLoding] = useState(true);
    const [openLinkPopup, setOpenLinkPopup] = useState(false);
    const [id, setId] = useState(false);

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
        { id: 'fullName', label: 'fullName', alignRight: false },
        { id: 'email', label: 'email', alignRight: false },
        { id: 'mobile', label: 'mobile', alignRight: false },
        { id: 'image', label: 'image', alignRight: false },
        { id: 'status', label: 'status', alignRight: false },
        // { id: 'action', label: 'action', alignRight: false },
    ];

    async function fetchSeeker(page, filterName) {
        const response = await axiosPrivate.get(USER_API_URL.eventInvitedUser + state?.eventId, { params: { page: page + 1, search: filterName, limit: rowsPerPage } })
        return response.data[0];
    }

    const { isLoading, data: eventInvitedUserList, refetch } = useQuery(['eventInvitedUserList', page, filterName], () => fetchSeeker(page, filterName), { keepPreviousData: true, })

    useEffect(() => {
        if (eventInvitedUserList) {
            console.log({ eventInvitedUserList })
            setTableData(eventInvitedUserList?.data);
            setRowsPerPage(eventInvitedUserList?.metadata.length != 0 ? eventInvitedUserList?.metadata[0].limit : 10);
        }
        setTimeout(() => {
            setLoding(false);
        }, 1800);
    }, [eventInvitedUserList])

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

    const handleFilterByName = (event) => {
        setFilterName(event.target.value.trim());
        fetchSeeker(page, filterName);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - eventInvitedUserList?.data?.length) : 0;

    const handleLinkPopupClose = (value) => {
        setOpenLinkPopup(false);
        setId(false)
    };
    if (isLoading) return <LoadingScreen />

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
                            placeholder="search event..."
                            onChange={(e) => handleFilterByName(e)}
                        />
                    </Paper>
                </div>

                <Card>
                    <TableContainer>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                                rowCount={eventInvitedUserList?.data?.length}
                                onRequestSort={handleRequestSort}
                            />
                            {tableData?.length > 0 ?
                                <TableBody>
                                    {tableData.length != 0 && tableData?.map((row) => {
                                        return (
                                            <StyledTableRow key={row._id}>
                                                <TableCell component="th" scope="row"> {row.fullName ?? '-'} </TableCell>
                                                <TableCell component="th" scope="row"> {row.email ?? '-'} </TableCell>
                                                <TableCell component="th" scope="row"> {row.mobile ?? '-'} </TableCell>
                                                <TableCell component="th" scope="row"> <img src={files(row.image.profilePic, "image")} alt="event" width={65} height={60} /> </TableCell>
                                                <TableCell align="left">
                                                    {
                                                        row.status === 1 ? <Chip label="enable" className="app_status_chip accepted" /> :
                                                            <Chip label="disable" className="app_status_chip invalid" />
                                                    }
                                                </TableCell>
                                                {/* <TableCell>
                                                    <Stack direction="row" spacing={3}>
                                                        <AppTooltip title="event view" placement="bottom">
                                                            <Button sx={{ "&:hover": { bgcolor: "transparent" } }} onClick={() => handleActionPages(row, 'view')} variant="text" className="user_list_row_btn"><VisibilityIcon /></Button>
                                                        </AppTooltip>
                                                    </Stack>
                                                </TableCell> */}
                                            </StyledTableRow>
                                        )
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                :
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" colSpan={7} sx={{ py: 5 }}>
                                            <span className="app_text_16_semibold">no data found</span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>}
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        count={eventInvitedUserList?.metadata.length != 0 ? eventInvitedUserList?.metadata[0].total : 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    <EventBlockUserPopup newLinkId={id} open={openLinkPopup} onClose={handleLinkPopupClose} />
                </Card>
            </>
            }
        </>
    )
}

export default EventInvitedUser