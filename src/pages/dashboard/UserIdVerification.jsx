import React, { useEffect, useState } from "react";
import { IconButton, InputBase, Paper, Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { USER_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { Stack } from "@mui/material";
import SearchIcon from "src/svgComponents/SearchIcon";
import { useSnackbar } from "notistack";
import useStore from 'src/contexts/AuthProvider'
import LoadingScreen from 'src/components/LoadingScreen'
import moment from 'moment'
import AppTooltip from "src/components/common/AppTooltip";
import { Button, Chip } from "@mui/material";

const _ = require('lodash');

export default function UserIdVerification() {
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

  const label = { inputProps: { 'aria-label': 'Switch demo' } };

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
    { id: 'userName', label: 'name', alignRight: false },
    { id: 'fullName', label: 'full name', alignRight: false },
    { id: 'email', label: 'email', alignRight: false },
    { id: 'mobile', label: 'mobile number', alignRight: false },
    { id: 'isApprove', label: 'status', alignRight: false },
    { id: 'createdAt', label: 'date', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];

  async function getUsersIdVerificationData(page, filterName) {
    const response = await axiosPrivate.get(USER_API_URL.getUserIdVerification, { params: { page: page + 1, search: filterName, limit: rowsPerPage } })
    return response.data[0];
  }

  const { isLoading, data: UsersIdVerificationList, refetch } = useQuery(['UsersIdVerificationList', page, filterName], () => getUsersIdVerificationData(page, filterName), { keepPreviousData: true, })

  useEffect(() => {
    if (UsersIdVerificationList) {
      setTableData(UsersIdVerificationList?.data);
      setRowsPerPage(UsersIdVerificationList?.metadata.length != 0 ? UsersIdVerificationList?.metadata[0].limit : 10);
    }
    if (UsersIdVerificationList?.metadata.length != 0 && UsersIdVerificationList?.metadata[0].hasMoreData == true) {
      getUsersIdVerificationData(page + 1);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [UsersIdVerificationList])

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
    setFilterName(event.target.value.trim().replace('+', ''));
    getUsersIdVerificationData(page, filterName);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  async function updateIdVerificationRequest(status, id) {
    const response = await axiosPrivate.put(USER_API_URL.updateUserIdVerification, { userId: id, status: status })
    if (response.status == 200) {
      enqueueSnackbar("status change successfully ", {
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

  if (isLoading) return <LoadingScreen />

  return (
    <>
      {loding ? <LoadingScreen /> : <>
        <div className="dashboard_header mb-4">
          {/* <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">Users</h4> */}
          <Paper className='dashboard_searchbox col-lg-4'>
            <IconButton>
              <SearchIcon />
            </IconButton>
            <InputBase
              fullWidth
              sx={{ flex: 1 }}
              placeholder="search users ..."
              onChange={(e) => handleFilterByName(e)}
            />
          </Paper>

          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>

            <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>
          </Stack>
        </div>

        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={UsersIdVerificationList?.metadata.length !== 0 ? UsersIdVerificationList?.metadata[0].total : 0}
                onRequestSort={handleRequestSort}
              />
              {tableData.length > 0 ?
                <TableBody>
                  {tableData.map((row, i) => {
                    return (
                      <StyledTableRow key={i}>
                        <TableCell component="th" scope="row">
                          {row.userName ?? "-"}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.fullName ?? "-"}
                        </TableCell>
                        <TableCell align="left">  {row?.email ?? "-"}</TableCell>
                        <TableCell align="left">  {row?.mobile ?? "-"}</TableCell>
                        <TableCell component="th" scope="row">
                          {row?.trustLevel?.id === 1 ? <Chip label="pending" className="app_status_chip pending" /> : row?.trustLevel?.id === 2 ? <Chip label="invalid" className="app_status_chip invalid" /> : <Chip label="accepted" className="app_status_chip accepted" />}
                        </TableCell>
                        <TableCell align="left"> {moment(row.createdAt).format("MMM DD YYYY h:mm A")}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            {/* <AppTooltip title="view business details" placement="bottom"><Button className="theme_button_view" variant="contained" onClick={(e) => handleRequestView(row)}>view</Button></AppTooltip> */}
                            {permissionsData?.business_request?.substring(3, 4) == "1" ?
                              <>
                                <AppTooltip title="accept user id-verification" placement="bottom"><Button className="theme_button" variant="contained" onClick={(e) => updateIdVerificationRequest(1, row.id)}>accept</Button></AppTooltip>
                                <AppTooltip title="reject user id-verification" placement="bottom"><Button className="invalid_button" variant="contained" onClick={() => updateIdVerificationRequest(2, row.id)}
                                >reject</Button></AppTooltip>
                              </> : ''}
                          </Stack>
                        </TableCell>
                      </StyledTableRow>
                    )
                  })}
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
            count={UsersIdVerificationList?.metadata.length != 0 ? UsersIdVerificationList?.metadata[0].total : 0}
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