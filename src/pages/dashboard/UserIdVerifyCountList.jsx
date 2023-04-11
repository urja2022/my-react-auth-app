import React, { useEffect, useState } from "react";
import { Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from "@material-ui/core";
import useStore from 'src/contexts/AuthProvider'
import { styled } from '@mui/material/styles';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { USER_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import EditPenIcon from 'src/svgComponents/EditPenIcon'
import LoadingScreen from 'src/components/LoadingScreen'
import Stack from '@mui/material/Stack';
import { Box, Button, FormControl, FormControlLabel, IconButton, InputBase, Modal, Paper, Radio, RadioGroup } from "@mui/material";
import SearchIcon from "src/svgComponents/SearchIcon";
import { useSnackbar } from "notistack";
import moment from 'moment'
import AppTooltip from "src/components/common/AppTooltip";
import { Dialog, DialogActions, DialogTitle, useMediaQuery, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import StarRateIcon from '@mui/icons-material/StarRate';
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

export default function UserIdVerifyCountList() {
  // const { themeStretch } = useSettings();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const permissionsData = useStore(state => state.permissions);
  const [loding, setLoding] = useState(true);
  const [trustLevelImage, setTrustLevelImage] = useState("1");
  const [trustLevelIdNumber, setTrustLevelIdNumber] = useState("1");
  const [trustLevelReference, setTrustLevelReference] = useState("1");
  const [trustLevelHomeAddress, setTrustLevelHomeAddress] = useState("1");
  const [openTrustModal, setOpenTrustModal] = useState(false);
  const [CsvData, setCsvData] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
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
    { id: 'documentUpdateCount', label: 'id verify limit', alignRight: false },
    { id: 'status', label: 'account status', alignRight: false },
    { id: 'createdAt', label: 'created at', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];
  useEffect(() => {
    var arr = [];
    tableData.map((item) => {
      const createdAt = new Date(item?.createdAt).toLocaleString();
      var obj = {
        "userName": item?.userName ? item?.userName : '-',
        "fullName": item?.fullName ? item?.fullName : '-',
        "email": item?.email ? item?.email : '-',
        "mobile": item?.mobile ? item?.mobile : '-',
        "documentUpdateCount": item?.documentUpdateCount ? item?.documentUpdateCount : '-',
        "status": item?.status == 1 ? 'Active' : 'In Active',
        "createdAt": createdAt ?? '-',
      }
      arr.push(obj);
    })
    setCsvData(arr)
  }, [tableData]);
  const headers = [
    { label: "fullName", key: "fullName" },
    { label: "userName", key: "userName" },
    { label: "email", key: "email" },
    { label: "mobile", key: "mobile" },
    { label: "documentUpdateCount", key: "documentUpdateCount" },
    { label: "status", key: "status" },
    { label: "createdAt", key: "createdAt" },
  ];
  let csvReport = {
    data: CsvData,
    headers: headers,
    filename: 'beemz-id-verification-limit.csv'
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
  async function getidVerifyCountListData(page, filterName) {
    const response = await axiosPrivate.get(USER_API_URL.getidVerifyCountList, { params: { type: '1', page: page + 1, search: filterName, limit: rowsPerPage } })

    return response.data[0];
  }

  const { isLoading, data: idVerifyCountList, refetch } = useQuery(['idVerifyCountList', page, filterName], () => getidVerifyCountListData(page, filterName), { keepPreviousData: true, })
  useEffect(() => {
    if (idVerifyCountList) {
      setTableData(idVerifyCountList?.data);
      setRowsPerPage(idVerifyCountList?.metadata.length != 0 ? idVerifyCountList?.metadata[0].limit : 10);
    }
    if (idVerifyCountList?.metadata.length != 0 && idVerifyCountList?.metadata[0].hasMoreData == true) {
      getidVerifyCountListData(page + 1);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [idVerifyCountList])
  if (isLoading) return <LoadingScreen />

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
    getidVerifyCountListData(0, filterName)
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredUsers = applySortFilter(tableData, getComparator(order, orderBy));

  const isUserNotFound = filteredUsers.length === 0;
  const handleOpenModal = (data) => {
    setUserId(data);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenTrustModal(false);
  };

  const resetLimit = async () => {
    const response = await axiosPrivate.put(USER_API_URL.idVerifyCountUpdate, { userId: userId })
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
    handleCloseModal();
  };

  // trust level update
  const trustLevelUpdate = async () => {

    const response = await axiosPrivate.put(USER_API_URL.userTrustLevelUpdate + userId, {
      "image": trustLevelImage,
      "idNumber": trustLevelIdNumber,
      "reference": trustLevelReference,
      "homeAddress": trustLevelHomeAddress
    })
    if (response.status == 200) {
      enqueueSnackbar("trust level update successfully", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
      refetch();
      handleCloseTrustModal();
    }

  }
  const handleOpenTrustModal = (data) => {
    if (data.trustLevel) {
      setTrustLevelImage(data.trustLevel.image.toString());
      setTrustLevelIdNumber(data.trustLevel.id.toString());
      setTrustLevelReference(data.trustLevel.reference.toString());
      setTrustLevelHomeAddress(data.trustLevel.address.toString());
    } else {
      setTrustLevelImage("1");
      setTrustLevelIdNumber("1");
      setTrustLevelReference("1");
      setTrustLevelHomeAddress("1");
    }
    setUserId(data.id);
    setOpenTrustModal(true);
  };

  const handleCloseTrustModal = () => {
    setOpenTrustModal(false);
  };
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
              placeholder="search users..."
              onChange={(e) => handleFilterByName(e)}
            />
          </Paper>
          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
            <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>

            {/* csv */}
            {permissionsData?.users?.substring(1, 2) == "1"
              ?
              <AppTooltip title="export invalid id users" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip> : ''}
          </Stack>
        </div>
        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={idVerifyCountList?.metadata.length !== 0 ? idVerifyCountList?.metadata[0].total : 0}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredUsers.map((row, key) => {
                  return (
                    <StyledTableRow key={key}>
                      <TableCell component="th" scope="row"> {row?.userName ?? "-"}</TableCell>
                      <TableCell align="left">  {row?.fullName ?? "-"}</TableCell>
                      <TableCell align="left">  {row?.email ?? "-"}</TableCell>
                      <TableCell align="left">  {row?.mobile ?? "-"}</TableCell>
                      <TableCell align="left">  {row?.documentUpdateCount ?? "-"}</TableCell>
                      <TableCell align="left">  {row.status == 1 ? <Chip label="active" className="app_status_chip accepted" /> : <Chip label="de-active" className="app_status_chip invalid" />}</TableCell>

                      <TableCell align="left"> {moment(row.createdAt).format("MMM DD YYYY h:mm A")} </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={3}>
                          {permissionsData?.users?.substring(3, 4) == "1"
                            ? <AppTooltip title="change id verify limit" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                              onClick={() => handleOpenModal(row.id)}
                              variant="text" className="user_list_row_btn"><EditPenIcon /></Button></AppTooltip> : ''}
                          {permissionsData?.users?.substring(3, 4) == "1"
                            ? <AppTooltip title="user trust level" placement="bottom"><Button variant="text" className="user_list_row_btn" onClick={() => handleOpenTrustModal(row)}><StarRateIcon /></Button></AppTooltip> : ''}
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  )
                })}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                      <span className="app_text_16_semibold">no data found</span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 20, 50, 100]}
            count={idVerifyCountList?.metadata.length != 0 ? idVerifyCountList?.metadata[0].total : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {/* confirm reset dialogue */}
        <Dialog
          fullScreen={fullScreen}
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title" className='m-auto'>
            <h4 className="app_text_20_semibold">are you sure id verification limit in reset!</h4>
          </DialogTitle>
          <DialogActions className='m-auto mb-2'>
            <Button className="theme_button_view" variant="contained" autoFocus onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button className="theme_button" variant="contained" onClick={() => resetLimit()} autoFocus>
              reset
            </Button>
          </DialogActions>
        </Dialog>
        {/* trust level dialogue */}
        <Modal
          open={openTrustModal}
          onClose={handleCloseTrustModal}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="modal_card modal_lg">
            <div className="modal_card_header">
              <div className="left_part">
                <h4>trust level</h4>
              </div>
              <div className="right_part">
                <Button className="dashboard_light_bg_icon_btn" onClick={handleCloseTrustModal} aria-label="delete">
                  <CloseIcon />
                </Button>
              </div>
            </div>
            <div className="modal_card_body">
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group mb-4">
                    image
                  </div>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                  <div className="form-group mb-4">
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="image"
                        defaultValue={trustLevelImage}
                        onChange={(e) => setTrustLevelImage(e.target.value)}
                      >
                        <FormControlLabel value="1" control={<Radio />} label="pending" />
                        <FormControlLabel value="2" control={<Radio />} label="invalid" />
                        <FormControlLabel value="3" control={<Radio />} label="accept" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>
                <div className="col-lg-6 ">
                  <div className="form-group mb-4">
                    id number
                  </div>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                  <div className="form-group mb-4">
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="id"
                        defaultValue={trustLevelIdNumber}
                        onChange={(e) => setTrustLevelIdNumber(e.target.value)}
                      >
                        <FormControlLabel value="1" control={<Radio />} label="pending" />
                        <FormControlLabel value="2" control={<Radio />} label="invalid" />
                        <FormControlLabel value="3" control={<Radio />} label="accept" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group mb-4">
                    reference
                  </div>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                  <div className="form-group mb-4">
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="reference"
                        defaultValue={trustLevelReference}
                        onChange={(e) => setTrustLevelReference(e.target.value)}
                      >
                        <FormControlLabel value="1" control={<Radio />} label="pending" />
                        <FormControlLabel value="2" control={<Radio />} label="invalid" />
                        <FormControlLabel value="3" control={<Radio />} label="accept" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group mb-4">
                    home address
                  </div>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                  <div className="form-group mb-4">
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="address"
                        defaultValue={trustLevelHomeAddress}
                        onChange={(e) => setTrustLevelHomeAddress(e.target.value)}
                      >
                        <FormControlLabel value="1" control={<Radio />} label="pending" />
                        <FormControlLabel value="2" control={<Radio />} label="invalid" />
                        <FormControlLabel value="3" control={<Radio />} label="accept" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="col-md-8 m-auto">
                <Button
                  onClick={trustLevelUpdate}
                  fullWidth
                  variant="contained"
                  className="my-3 text-lowercase text-white app_bg_primary app_text_16_semibold app_btn_lg"
                >
                  submit
                </Button>
              </div>
            </div>
            <div className="modal_card_footer"></div>
          </Box>
        </Modal>
      </>
      }
    </>
  )
}