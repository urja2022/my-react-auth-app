import React, { useEffect, useState } from "react";
import { Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Switch, Modal, Box, Radio, RadioGroup, FormControl, FormControlLabel, TextField, TextareaAutosize, Checkbox } from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import useStore from 'src/contexts/AuthProvider'
import { styled } from '@mui/material/styles';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useMutation, useQuery } from 'react-query';
import { USER_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { PATH_DASHBOARD } from "src/routes/paths";
import EditPenIcon from 'src/svgComponents/EditPenIcon'
import LoadingScreen from 'src/components/LoadingScreen'
import BinIcon from 'src/svgComponents/BinIcon'
import Stack from '@mui/material/Stack';
import { CSVLink } from "react-csv";
import { Button, IconButton, InputBase, Paper } from "@mui/material";
import { useNavigate } from "react-router";
import SearchIcon from "src/svgComponents/SearchIcon";
import StarRateIcon from '@mui/icons-material/StarRate';
import { useSnackbar } from "notistack";
import moment from 'moment'
import AppTooltip from "src/components/common/AppTooltip";
import BusinessIcon from 'src/svgComponents/sidebarIcons/Business'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import TrackUserPopup from 'src/components/user/TrackUserPopup';
import ConnectWithoutContactOutlinedIcon from '@mui/icons-material/ConnectWithoutContactOutlined';
import Trace from 'src/svgComponents/sidebarIcons/Trace'
import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UserColoredIcon from "src/svgComponents/UserColoredIcon";
import LinkingPopup from "src/components/user/LinkingPopup";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

const _ = require('lodash');

export default function UsersList() {
  // const { themeStretch } = useSettings();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [CsvData, setCsvData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [trustLevelImage, setTrustLevelImage] = useState("1");
  const [trustLevelIdNumber, setTrustLevelIdNumber] = useState("1");
  const [trustLevelReference, setTrustLevelReference] = useState("1");
  const [trustLevelHomeAddress, setTrustLevelHomeAddress] = useState("1");
  const [userId, setUserId] = useState('');
  const permissionsData = useStore(state => state.permissions);
  const [loding, setLoding] = useState(true);
  const [openLinkPopup, setOpenLinkPopup] = useState(false);
  const [openLinkUserPopup, setOpenLinkUserPopup] = useState(false);
  const [traceCount, setTraceCount] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setdeleteId] = useState("");
  const [feedItemColor, setFeedItemColor] = useState("");
  const [requestId, setRequestId] = useState();


  const { enqueueSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const label = { inputProps: { 'aria-label': 'Switch demo' } };
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
    // { id: '', label: '', alignRight: false },
    { id: 'userName', label: 'name', alignRight: false },
    { id: 'fullName', label: 'full name', alignRight: false },
    { id: 'email', label: 'email', alignRight: false },
    { id: 'mobile', label: 'mobile number', alignRight: false },
    { id: 'status', label: 'enabled', alignRight: false },
    { id: 'emailVerify', label: 'email verified', alignRight: false },
    { id: 'mobileVerify', label: 'phone verified', alignRight: false },
    { id: 'status', label: 'account status', alignRight: false },
    { id: 'userTrace', label: 'trace count', alignRight: false },
    { id: 'createdAt', label: 'created at', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];

  useEffect(() => {
    var arr = [];
    tableData.map((item) => {
      var obj = {
        "userName": item.userName,
        "email": item.email,
        "status": item.status === 1 ? "Yes" : "No",
        "emailVerify": item.emailVerify === 1 ? "Yes" : "No",
        "mobileVerify": item.mobileVerify === 1 ? "Yes" : "No",
        "id": item.userName,
        "mobile": item.mobile,
        "createdAt": moment(item.createdAt).format("MMM DD YYYY h:mm A"),
      }
      arr.push(obj);
    })
    setCsvData(arr)
  }, [tableData]);

  const headers = [
    { label: "Id", key: "id" },
    { label: "User Name", key: "userName" },
    { label: "Email", key: "email" },
    { label: "Mobile", key: "mobile" },
    { label: "Enabled", key: "status" },
    { label: "Email Verify", key: "emailVerify" },
    { label: "Mobile Verify", key: "mobileVerify" },
    { label: "createdAt", key: "createdAt" }
  ];
  let csvReport = {
    data: CsvData,
    headers: headers,
    filename: 'beemz-users.csv'
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
  async function fetchSeeker(page, filterName) {
    const response = await axiosPrivate.get(USER_API_URL.userList, { params: { type: '1', page: page + 1, search: filterName, limit: rowsPerPage } })

    return response.data[0];
  }


  // send notificatoion 
  const { mutateAsync: notifyUser } = useMutation(
    async (data) => {
      return await axiosPrivate.post(USER_API_URL.sendNotification, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("Notofocation send successfully", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        handleCloseNotificationModal();
      },
      onError: (error) => {
        const errorData = error.response.data.errors;
        if (errorData) {
          Object.keys(errorData).forEach((key) => {
            enqueueSnackbar(errorData[key], {
              variant: "error",
              anchorOrigin: { vertical: "top", horizontal: "right" },
              autoHideDuration: 2000,
            });
          });
        } else {
          enqueueSnackbar(error.response?.data?.message, {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 2000,
          });
        }
      },
    }
  );

  const completedSchema = Yup.object().shape({

    title: Yup.string()
      .required("title is required"),
    description: Yup.string()
      .required("description is required"),

  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: ""
    },
    validationSchema: completedSchema,
    onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
      const data = {
        title: values.title,
        description: values.description,
        userId: userId
      }
      await notifyUser(data);
      resetForm();
      setSubmitting(false);
      refetch();


    },
  });


  const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;



  const { isLoading, data: userSeekerList, refetch } = useQuery(['SeekerData', page, filterName], () => fetchSeeker(page, filterName), { keepPreviousData: true, })

  useEffect(() => {
    if (userSeekerList) {
      setCsvData([]);
      setTableData(userSeekerList?.data);
      setRowsPerPage(userSeekerList?.metadata.length != 0 ? userSeekerList?.metadata[0].limit : 10);
    }
    if (userSeekerList?.metadata.length != 0 && userSeekerList?.metadata[0].hasMoreData == true) {
      fetchSeeker(page + 1);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [userSeekerList])
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
    fetchSeeker(0, filterName)
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRequestBusinessEdit = (User_id) => {
    navigate(PATH_DASHBOARD.general.businessEdit, { state: { User_id: User_id } });
  };
  const handleRequestUserEvent = (data) => {
    navigate(PATH_DASHBOARD.general.userEvent, { state: { User_id: data.id } });
  };

  const handleRequestSocial = (data) => {
    navigate(PATH_DASHBOARD.general.userSocial, { state: { User_id: data.id } });
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userSeekerList?.metadata[0].total) : 0;

  const filteredUsers = applySortFilter(tableData, getComparator(order, orderBy));

  const isUserNotFound = filteredUsers.length === 0;

  const handleRequestEdit = (User_id) => {
    navigate(PATH_DASHBOARD.general.userEdit, { state: { User_id: User_id } });
  };
  const handleRequestView = (User_id) => {
    navigate(PATH_DASHBOARD.general.userView, { state: { User_id: User_id } });
  };

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
      handleCloseModal();
    }

  }
  const handleOpenModal = (data) => {
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
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setUserId('')
  };

  async function handleChangeUserStatus(id) {
    setLoding(true)
    const response = await axiosPrivate.put(USER_API_URL.userRejected + id)
    if (response.status == 200) {
      refetch();
      enqueueSnackbar("status change successfully ", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
      setTimeout(() => {
        setLoding(false);
      }, 1000);
    } else {
      enqueueSnackbar("something went wrong", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
      setLoding(false)
    }
  };
  async function handleChangeBlockUsers(id, trace) {
    setOpenLinkPopup(true);
    setUserId(id);
    setTraceCount(trace)
  };
  const handleLinkPopupClose = (value) => {
    setOpenLinkPopup(false);
    setUserId('')
    setTraceCount(false)

  };
  const handleClickOpen = (userDelId) => {
    setdeleteId(userDelId);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const deleteUser = async () => {
    const response = await axiosPrivate.delete(USER_API_URL.deleteUser + deleteId)
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
  };
  const handleClickLinkPopupOpen = (dataId) => {
    setOpenLinkUserPopup(true);
    setRequestId(dataId);
  };

  const handleCloseLinkPopup = (dataId) => {
    setOpenLinkUserPopup(false);
  };


  // navigate to location list 
  const handleOnClick = (row) => {
    navigate(PATH_DASHBOARD.general.userLocation, { state: { user: row } });
  }


  // open notification modal
  const handleOpenNotificationModal = (row) => {
    setUserId(row?.id);
    setOpenNotificationModal(true)
  }
  const handleCloseNotificationModal = () => {
    setUserId('');
    setOpenNotificationModal(false);
    formik.setTouched({}, false);
  }

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
            {permissionsData?.users?.substring(1, 2) == "1"
              ? <AppTooltip title="add user" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><AddCircleOutlineOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip> : ''}
            {permissionsData?.users?.substring(4, 5) == "1"
              ? <AppTooltip title="export users" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip> : ''}
           
           
            <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>
          </Stack>
        </div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title" className='m-auto'>
            {"Are you sure you want to delete?"}
          </DialogTitle>
          <DialogContent>
          </DialogContent>
          <DialogActions className='m-auto'>
            <Button className="theme_button_view" variant="contained" autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button className="theme_button" variant="contained" onClick={() => deleteUser()} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Card>
          {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} excelData={exportSeekerData} filename={'Seekers'} /> */}
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={userSeekerList?.metadata.length !== 0 ? userSeekerList?.metadata[0].total : 0}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredUsers.map((row, key) => {
                  return (

                    <StyledTableRow key={key}>
                      {/* <Checkbox
                        {...label}
                        defaultChecked
                      sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                      /> */}
                      <TableCell component="th" scope="row"> {row?.userName ?? "-"}</TableCell>
                      <TableCell align="left">  {row?.fullName ?? "-"}</TableCell>
                      <TableCell align="left">  {row?.email ?? "-"}</TableCell>
                      <TableCell align="left">  {row?.mobile ?? "-"}</TableCell>
                      <TableCell align="left">
                        <AppTooltip title="change status" placement="bottom"><Switch
                          checked={row.isUserRejected === 1 ? true : false}
                          onChange={permissionsData?.users?.substring(3, 4) == "1"
                            ? () => handleChangeUserStatus(row.id) : ""}
                          defaultChecked /></AppTooltip>
                      </TableCell>
                      {/* <TableCell align="left">
                        <AppTooltip title="disabled" placement="bottom">
                          <Switch checked={row.emailVerify === 1 ? true : false} />
                        </AppTooltip>
                      </TableCell> */}
                      <TableCell align="left">  {row.email && row.isVerify == 1 ? <Chip label="verified" className="app_status_chip accepted" /> : <Chip label="unverified" className="app_status_chip invalid" />}</TableCell>
                      <TableCell align="left">  {row.mobile && row.isVerify == 1 ? <Chip label="verified" className="app_status_chip accepted" /> : <Chip label="unverified" className="app_status_chip invalid" />}</TableCell>
                      <TableCell align="left">  {row.status == 1 ? <Chip label="active" className="app_status_chip accepted" /> : <Chip label="de-active" className="app_status_chip invalid" />}</TableCell>
                      {/* <TableCell align="left">
                        <AppTooltip title="disabled" placement="bottom">
                          <Switch checked={row.mobileVerify === 1 ? true : false} />
                        </AppTooltip>
                      </TableCell>
                      <TableCell align="left">
                        <AppTooltip title="disabled" placement="bottom">
                          <Switch checked={row.status === 1 ? true : false} />
                        </AppTooltip>
                      </TableCell> */}
                      <TableCell align="left"> {row.userTrace ?? 0} </TableCell>
                      <TableCell align="left"> {moment(row.createdAt).format("MMM DD YYYY h:mm A")} </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={3}>
                          {permissionsData?.users?.substring(3, 4) == "1"
                            ? <AppTooltip title="user edit" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                              onClick={() => handleRequestEdit(row.id)}
                              variant="text" className="user_list_row_btn"><EditPenIcon /></Button></AppTooltip> : ''}
                          {permissionsData?.users?.substring(3, 4) == "1"
                            ? <AppTooltip title="user view" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                              onClick={() => handleRequestView(row.id)}
                              variant="text" className="user_list_row_btn"><VisibilityIcon /></Button></AppTooltip> : ''}
                          {permissionsData?.users?.substring(2, 3) == "1"
                            ? <AppTooltip title="user delete" placement="bottom"><Button variant="text" className="user_list_row_btn" onClick={() => handleClickOpen(row.id)} ><BinIcon /></Button></AppTooltip> : ''}
                          {permissionsData?.users?.substring(2, 3) == "1"
                            ? <AppTooltip title="user event" placement="bottom"><Button variant="text" className="user_list_row_btn" onClick={() => handleRequestUserEvent(row)} ><EventOutlinedIcon /></Button></AppTooltip> : ''}
                          {/* 
                            <AppTooltip title="track user request" placement="bottom"><Button variant="text" className="user_list_row_btn"   onClick={() => handleChangeBlockUsers(row.id)}><PersonPinCircleOutlinedIcon /></Button></AppTooltip>
                          <AppTooltip title="social media posts" placement="bottom"><Button variant="text" className="user_list_row_btn"   onClick={() => handleRequestSocial(row)}><ConnectWithoutContactOutlinedIcon /></Button></AppTooltip> */}
                          <AppTooltip title="track user request" placement="bottom"><Button variant="text" className="user_list_row_btn" onClick={() => handleChangeBlockUsers(row.id, row.userTrace)}><Trace /></Button></AppTooltip>
                          {permissionsData?.users?.substring(3, 4) == "1"
                            ? <AppTooltip title="user trust level" placement="bottom"><Button variant="text" className="user_list_row_btn" onClick={() => handleOpenModal(row)}><StarRateIcon /></Button></AppTooltip> : ''}
                          {permissionsData?.users?.substring(3, 4) == "1"
                            ? <AppTooltip title="business" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                              onClick={() => handleRequestBusinessEdit(row.id)}
                              variant="text" className="user_list_row_btn"><BusinessIcon /></Button></AppTooltip> : ''}
                          {permissionsData?.users?.substring(3, 4) == "1" ?
                            <AppTooltip title="linked list" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                              onClick={() => handleClickLinkPopupOpen(row.id)}
                              variant="text" className="user_list_row_btn"><UserColoredIcon /></Button></AppTooltip> : ''}
                          {permissionsData?.users?.substring(3, 4) == "1" ?
                            <AppTooltip title="location list" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                              onClick={() => handleOnClick(row)}
                              variant="text" className="user_list_row_btn"><MyLocationIcon /></Button></AppTooltip> : ''}
                          {permissionsData?.users?.substring(3, 4) == "1" ?
                            <AppTooltip title="send notification" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                              onClick={() => handleOpenNotificationModal(row)}
                              variant="text" className="user_list_row_btn"><NotificationsIcon /></Button></AppTooltip> : ''}
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  )
                })}
                {/* {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */}
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
            count={userSeekerList?.metadata.length != 0 ? userSeekerList?.metadata[0].total : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <LinkingPopup newLinkId={requestId} open={openLinkUserPopup} onClose={handleCloseLinkPopup} />
          <TrackUserPopup newLinkId={userId} open={openLinkPopup} traceCount={traceCount} onClose={handleLinkPopupClose} />
        </Card>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="modal_card modal_lg">
            <div className="modal_card_header">
              <div className="left_part">
                <h4>trust level</h4>
              </div>
              <div className="right_part">
                <Button className="dashboard_light_bg_icon_btn" onClick={handleCloseModal} aria-label="delete">
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



        {/* notification modal  */}
        <Modal
          open={openNotificationModal}
          onClose={handleCloseNotificationModal}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="modal_card modal_lg db_trust_level_modal_box">
            <div className="modal_card_header">
              <div className="left_part">
                <h4>send notification </h4>
              </div>
              <div className="right_part">
                <Button className="dashboard_light_bg_icon_btn" onClick={handleCloseNotificationModal} aria-label="delete">
                  <CloseIcon />
                </Button>
              </div>
            </div>
            <div className="modal_card_body">
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <div className="row">
                    <div className='col-12'>
                      <div className='user_edit_header mb-4'>
                        <h4 className="app_text_14_semibold mb-0">send notification</h4>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-4">
                        <TextField
                          label='title'
                          autoComplete='off'
                          fullWidth
                          variant='outlined'
                          {...getFieldProps("title")}
                          error={Boolean(touched.title && errors.title)}
                          helperText={touched.title && errors.title}
                        />
                      </div>
                      <div className="form-group mb-4">
                        <TextField
                          label='description'
                          autoComplete='off'
                          fullWidth
                          variant='outlined'
                          {...getFieldProps("description")}
                          error={Boolean(touched.description && errors.description)}
                          helperText={touched.description && errors.description}
                        />

                      </div>
                    </div>

                  </div>
                  <div className="col">
                    <div className="col-md-8 m-auto">
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="my-3 text-lowercase text-white app_bg_primary app_text_16_semibold app_btn_lg"
                      >
                        submit
                      </Button>
                    </div>
                  </div>
                </Form>
              </FormikProvider>
            </div>
            <div className="modal_card_footer"></div>
          </Box>
        </Modal>
      </>
      }
    </>
  )
}