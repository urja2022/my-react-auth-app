import React, { useEffect, useState } from "react";
import { Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Switch, Box, MenuItem } from "@material-ui/core";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { USER_API_URL, ROLE_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import EditPenIcon from 'src/svgComponents/EditPenIcon'
import BinIcon from 'src/svgComponents/BinIcon'
import Stack from '@mui/material/Stack';
import { Button, IconButton, Modal, InputBase, Paper, TextField, InputAdornment, Select, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { useNavigate } from "react-router";
import SearchIcon from "src/svgComponents/SearchIcon";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import CloseIcon from '@mui/icons-material/Close';
import PhoneInput from 'react-phone-input-2';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LoadingScreen from 'src/components/LoadingScreen'
import useStore from 'src/contexts/AuthProvider'
import AppTooltip from "src/components/common/AppTooltip";

const _ = require('lodash');

export default function SubAdmin() {
  const [tableData, setTableData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [page, setPage] = useState(0);
  const [modelTitle, setmodelTitle] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneErrorText, setPhoneErrorText] = useState(null);
  const [roleError, setRoleError] = useState(null);
  const [Id, setId] = useState("");
  const permissionsData = useStore(state => state.permissions);
  const [loding, setLoding] = useState(true);
  const [deleteId, setdeleteId] = useState("");
  const [open, setOpen] = useState(false);
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
  const [passwordInput, setPasswordInput] = useState({
    password: '',
    showPassword: false,
  });
  const TABLE_HEAD = [
    { id: 'name', label: 'name', alignRight: false },
    { id: 'email', label: 'email', alignRight: false },
    { id: 'mobile', label: 'mobile number', alignRight: false },
    { id: 'status', label: 'enabled', alignRight: false },
    { id: 'role', label: 'role', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];

  async function fetchSeeker(filterName) {
    const response = await axiosPrivate.get(USER_API_URL.adminList, { params: { search: filterName } })
    return response.data;
  }

  const { isLoading, data: subAdminList, refetch } = useQuery(['subAdminList', filterName], () => fetchSeeker(filterName), { keepPreviousData: true, })

  async function fetchRole() {
    const response = await axiosPrivate.get(ROLE_API_URL.getRoleList)
    return response.data;
  }

  const { isLoading: isLoadingRole, data: roleList, refetch: refetchRole } = useQuery(['roleList'], () => fetchRole(), { keepPreviousData: true, })

  useEffect(() => {
    if (subAdminList) {
      setTableData(subAdminList.data ? [] : subAdminList);
      setRowsPerPage(10);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [subAdminList])

  useEffect(() => {
    if (roleList) {
      setRoleData(roleList.data ? [] : roleList);
    }
  }, [roleList])

  const handleFilterByName = (event) => {
    setFilterName(event.target.value.trim());
    fetchSeeker(filterName);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subAdminList?.data?.length) : 0;

  const filteredUsers = tableData;
  const isUserNotFound = filteredUsers?.length === 0;

  const completedSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "name can set of between 2 and 50 characters!")
      .max(50, "name can set of between 2 and 50 characters!")
      .required("name is required"),
    admin_email: Yup.string()
      .email("email must be a valid email address")
      .required("email is required"),
    admin_password: Yup.string().required('password is required')

  });

  const formik = useFormik({
    initialValues: {
      name: '',
      admin_email: '',
    },
    validationSchema: completedSchema,
    onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
      const informationObj = {
        username: values.name,
        email: values.admin_email,
        adminrole: role,
        mobile: phoneNumber != "" ? "+" + phoneNumber : null,
      };
      if (Id == '') {
        informationObj.password = values.admin_password;
        await subAdminAdd(informationObj);
      } else {
        informationObj.admin_id = Id;
        await subAdminUpdate(informationObj);
      }
      resetForm();
      setRoleError(null);
      setPhoneErrorText(null);
      setSubmitting(false);
    },
  });

  const { mutateAsync: subAdminUpdate } = useMutation(
    async (data) => {
      return await axiosPrivate.put(USER_API_URL.subAdminUpdate, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("sub admin update successfully ", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        handleCloseModal();
      },
      onError: (error) => {
        const errorData = error.response.data.errors;
        if (error.response?.data?.message) {
          setRoleError(error.response.data.message);
        }
        Object.keys(errorData).forEach((key) => {
          if (key === "username") {
            setFieldError("name", errorData[key]);
          } else if (key === "email") {
            setFieldError("admin_email", errorData[key]);
          } else if (key === "password") {
            setFieldError("admin_password", errorData[key]);
          } else if (key === "mobile") {
            setPhoneErrorText(errorData[key]);
          } else if (key === "adminrole") {
            setRoleError(errorData[key]);
          } else {
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );

  const { mutateAsync: subAdminAdd } = useMutation(
    async (data) => {
      return await axiosPrivate.post(USER_API_URL.subAdmin, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("sub admin add successfully ", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        handleCloseModal();
      },
      onError: (error) => {
        const errorData = error.response.data.errors;
        if (error.response?.data?.message) {
          setRoleError(error.response.data.message);
        }
        Object.keys(errorData).forEach((key) => {
          if (key === "username") {
            setFieldError("name", errorData[key]);
          } else if (key === "email") {
            setFieldError("admin_email", errorData[key]);
          } else if (key === "password") {
            setFieldError("admin_password", errorData[key]);
          } else if (key === "mobile") {
            setPhoneErrorText(errorData[key]);
          } else if (key === "adminrole") {
            setRoleError(errorData[key]);
          } else {
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );
  const handleClickShowPassword = () => {
    setPasswordInput({
      ...passwordInput,
      showPassword: !passwordInput.showPassword,
    });
  };

  const handleChange = (prop) => (event) => {
    setPasswordInput({ ...passwordInput, [prop]: event.target.value });
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModalAdd = () => {
    setFieldValue('name', "")
    setFieldValue('admin_email', "")
    setPhoneNumber("")
    setmodelTitle('add')
    setRole('')
    setId('')
    setFieldValue('admin_password', "")
    setOpenModal(true);
  };

  const handleOpenModalUpdate = (row) => {
    setFieldValue('name', row.name)
    setFieldValue('admin_email', row.email)
    setFieldValue('admin_password', "123456")
    setPhoneNumber(row.mobile.replace('+', ''))
    setRole(row?.adminrole?.id)
    setId(row._id)
    setmodelTitle('update')
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClickOpen = (categoryId) => {
    setdeleteId(categoryId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteSubAdmin = async () => {
    const response = await axiosPrivate.delete(USER_API_URL.deleteAdmin + deleteId)
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

  const handleChangeAdminStatus = async (id) => {
    setLoding(true)
    const response = await axiosPrivate.put(USER_API_URL.adminInactive + id)
    if (response.status == 200) {
      refetch();
      enqueueSnackbar("status change successfully.", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
      setTimeout(() => {
        setLoding(false);
      }, 1000);
    } else {
      enqueueSnackbar("something went wrong.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
      setLoding(false)
    }
  }

  const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;
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
              placeholder="search sub admin..."
              onChange={(e) => handleFilterByName(e)}
            />
          </Paper>
          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
            {permissionsData?.sub_admin?.substring(1, 2) == "1"
              ? <AppTooltip title="add sub-admin" placement="bottom"><Button className="dashboard_light_bg_icon_btn" onClick={handleOpenModalAdd}><AddCircleOutlineOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip> : ''}
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
            <Button className="theme_button" variant="contained" onClick={() => deleteSubAdmin()} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={subAdminList?.data?.length}
                onRequestSort={handleRequestSort}
              />
              {tableData.length > 0 ?
                <TableBody>
                  {tableData.length != 0 && tableData.map((row) => {
                    return (
                      <StyledTableRow key={row._id}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="left">  {row.email}</TableCell>
                        <TableCell align="left">  {row.mobile}</TableCell>
                        <TableCell align="left">
                          {/* <FormGroup>
                          <FormControlLabel control={row.status == "Active" ? <Switch defaultChecked /> : <Switch />} />
                        </FormGroup> */}
                          <AppTooltip title="change status" placement="bottom"><Switch
                            checked={row.status == "Active" ? true : false}
                            onChange={permissionsData?.sub_admin?.substring(3, 4) == "1"
                              ? () => handleChangeAdminStatus(row.id) : ""}
                            defaultChecked /></AppTooltip>
                        </TableCell>
                        <TableCell align="left">  {row?.adminrole?.name}
                        </TableCell>
                        {/* <TableCell align="left">  {row.about}</TableCell> */}
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            {permissionsData?.sub_admin?.substring(3, 4) == "1"
                              ? <AppTooltip title="sub-admin edit" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                                onClick={() => handleOpenModalUpdate(row)}
                                variant="text" className="user_list_row_btn"><EditPenIcon /></Button></AppTooltip> : ''}
                            {permissionsData?.sub_admin?.substring(2, 3) == "1"
                              ? <AppTooltip title="sub-admin delete" placement="bottom"><Button variant="text" onClick={() => handleClickOpen(row._id)} className="user_list_row_btn"><BinIcon /></Button></AppTooltip> : ''}
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

        </Card>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="child-modal-title"
          disableScrollLock="false"
          aria-describedby="child-modal-description"
        >
          <Box className="modal_card modal_lg">
            <div className="modal_card_header">
              <div className="left_part">
                <h4>{modelTitle}</h4>
              </div>
              <div className="right_part">
                <Button className="dashboard_light_bg_icon_btn" onClick={handleCloseModal} aria-label="delete">
                  <CloseIcon />
                </Button>
              </div>
            </div>
            <div className="modal_card_body">
              <div className="custom_scrollbar">
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <div className="row">
                      <div className='col-12'>
                        <div className='user_edit_header mb-4'>
                          <h4 className="app_text_14_semibold mb-0">sub admin information</h4>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group mb-4">
                          <TextField
                            label='name'
                            autoComplete='off'
                            fullWidth
                            variant='outlined'
                            {...getFieldProps("name")}
                            error={Boolean(touched.name && errors.name)}
                            helperText={touched.name && errors.name}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group mb-4">
                          <TextField
                            label='email'
                            type='email'
                            autoComplete='off'
                            fullWidth
                            variant='outlined'
                            {...getFieldProps("admin_email")}
                            error={Boolean(touched.admin_email && errors.admin_email)}
                            helperText={touched.admin_email && errors.admin_email}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group mb-4">
                          <PhoneInput
                            inputProps={{
                              style: { width: "100%" },
                              name: "phone1",
                              required: true,
                            }}
                            value={phoneNumber}
                            country={"za"}
                            specialLabel="mobile number"
                            onChange={(phone) => setPhoneNumber(phone)}
                          />
                          <FormHelperText error={phoneErrorText ? true : false}>
                            {phoneErrorText}
                          </FormHelperText>
                        </div>
                      </div>{modelTitle == "add" ? <div className="col-lg-6">
                        <div className="form-group mb-4">
                          <TextField
                            id='outlined-adornment-password'
                            fullWidth
                            autoComplete="off"
                            type={passwordInput.showPassword ? "text" : "password"}
                            label='password'
                            value={passwordInput.password}
                            onChange={handleChange("admin_password")}
                            {...getFieldProps("admin_password")}
                            error={Boolean(touched.admin_password && errors.admin_password)}
                            helperText={touched.admin_password && errors.admin_password}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <IconButton
                                    sx={{ "&:hover": { bgcolor: "transparent" } }}
                                    disableRipple
                                    aria-label='toggle password visibility'
                                    onClick={handleClickShowPassword}
                                    edge='end'>
                                    {!passwordInput.showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      </div> : ''}
                      <div className="col-lg-12">
                        <div className="form-group mb-4">
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">role</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="role"
                              defaultValue={role}
                              onChange={(e) => setRole(e.target.value)}
                            >
                              {roleData.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item._id}>{item.name}</MenuItem>
                                )
                              })}
                            </Select>
                          </FormControl>
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
            </div>
            <div className="modal_card_footer"></div>
          </Box>
        </Modal>
      </>
      }
    </>
  )
}

