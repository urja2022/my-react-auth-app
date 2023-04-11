import React, { useEffect, useState } from "react";
import { IconButton, InputBase, Paper, Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { USER_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { Stack } from "@mui/material";
import Button from '@mui/material/Button';
import SearchIcon from "src/svgComponents/SearchIcon";
import { useSnackbar } from "notistack";
import useStore from 'src/contexts/AuthProvider'
import LoadingScreen from 'src/components/LoadingScreen'
import moment from 'moment'
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import AppTooltip from "src/components/common/AppTooltip";
import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
const _ = require('lodash');

export default function UserDeleteReq() {
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
    { id: 'email', label: 'email', alignRight: false },
    { id: 'mobile', label: 'mobile', alignRight: false },
    { id: 'reason', label: 'reason', alignRight: false },
    { id: 'status', label: 'delete request', alignRight: false },
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
        "reason": item?.reason ? item?.reason : '-',
        "status": item?.businessId ? 'Business' : ' User',
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
    { label: "reason", key: "reason" },
    { label: "status", key: "status" },
    { label: "createdAt", key: "createdAt" },
  ];
  let csvReport = {
    data: CsvData,
    headers: headers,
    filename: 'beemz-user-delete-request.csv'
  };
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
  async function getBusinessData(page, filterName) {
    const response = await axiosPrivate.get(USER_API_URL.getUserDeleteReqList, { params: { type: '1', page: page + 1, search: filterName, limit: rowsPerPage } })
    return response.data[0];
  }

  const { isLoading, data: userDeleteReqList, refetch } = useQuery(['userDeleteReqList', page, filterName], () => getBusinessData(page, filterName), { keepPreviousData: true, })

  useEffect(() => {
    if (userDeleteReqList) {
      setTableData(userDeleteReqList?.data);
      setRowsPerPage(userDeleteReqList?.metadata.length != 0 ? userDeleteReqList?.metadata[0].limit : 10);
    }
    if (userDeleteReqList?.metadata.length != 0 && userDeleteReqList?.metadata[0].hasMoreData == true) {
      getBusinessData(page + 1);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [userDeleteReqList])


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
    getBusinessData(page, filterName);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleClickOpen = (value) => {
    setDeleteData(value);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const filteredUsers = applySortFilter(tableData, getComparator(order, orderBy));

  async function updateRequest() {
    setDisableBtn(true);
    if (deleteData.status == 0 && !deleteData.businessId) {
      const response = await axiosPrivate.delete(USER_API_URL.deleteUser + deleteData.userId)
      if (response.status == 200) {
        setDisableBtn(false);
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
    } else {
      const response = await axiosPrivate.delete(USER_API_URL.deleteUserBusiness + deleteData.businessId)
      if (response.status == 200) {
        setDisableBtn(false);
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
    }
    refetch();
    handleClose();
  }

  async function cancelRequest(id) {
    const response = await axiosPrivate.put(USER_API_URL.cancelRequest + id)
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

  if (isLoading) return <LoadingScreen />




  const handleRequestEdit = (data) => {
    if (data.businessId) {
      navigate(PATH_DASHBOARD.general.deleteBusinessReqView, { state: { businessId: data?.businessId } });
    } else {
      navigate(PATH_DASHBOARD.general.ArchiveUserView, { state: { userId: data?.userId } });
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
            {"Are you sure you want to delete the user?"}
          </DialogTitle>
          <DialogContent>
          </DialogContent>
          <DialogActions className='m-auto'>
            <Button className="theme_button_view" variant="contained" autoFocus onClick={handleClose}>
              Cancel
            </Button>

            <Button className="theme_button_view" variant="contained" onClick={() => updateRequest()} autoFocus disabled={disableBtn}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={userDeleteReqList?.metadata.length !== 0 ? userDeleteReqList?.metadata[0].total : 0}
                onRequestSort={handleRequestSort}
              />
              {tableData.length > 0 ?
                <TableBody>
                  {filteredUsers.map((row, i) => {
                    return (
                      <StyledTableRow key={i}>
                        <TableCell component="th" scope="row">
                          {row?.businessId ? row.businessName : row.userName ?? "-"}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row?.businessId ? row.businessEmail : row.userEmail ?? "-"}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row?.mobile ? row.mobile : "-"}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.reason}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.businessId ? "business" : "user"}
                        </TableCell>
                        <TableCell align="left"> {moment(row.createdAt).format("MMM DD YYYY h:mm A")}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            {permissionsData?.business_request?.substring(3, 4) == "1" ?
                              <>
                                <AppTooltip title="delete user & business" placement="bottom"><Button className="theme_button" variant="contained" onClick={(e) => handleClickOpen(row)}>delete</Button></AppTooltip>
                                <AppTooltip title="cancel request" placement="bottom"><Button className="invalid_button" variant="contained" onClick={(e) => cancelRequest(row._id)}>cancel</Button></AppTooltip>
                                <AppTooltip title="view user" placement="bottom"><Button className="invalid_button" variant="contained" onClick={() => handleRequestEdit(row)} >View</Button></AppTooltip>
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
                    <TableCell align="center" colSpan={6} sx={{ py: 5 }}>
                      <span className="app_text_16_semibold">no data found</span>
                    </TableCell>
                  </TableRow>
                </TableBody>}
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 20, 50, 100]}
            count={userDeleteReqList?.metadata.length != 0 ? userDeleteReqList?.metadata[0].total : 0}
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