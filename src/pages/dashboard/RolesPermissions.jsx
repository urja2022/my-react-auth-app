import React, { useEffect, useState } from "react";
import { Card, Table, TableBody, TableCell, TableContainer, TableRow, Switch, Box, Paper, IconButton } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { ROLE_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import EditPenIcon from 'src/svgComponents/EditPenIcon'
import Stack from '@mui/material/Stack';
import { Button, Modal, TextField, InputBase } from "@mui/material";
import { useNavigate } from "react-router";
import SearchIcon from "src/svgComponents/SearchIcon";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment'
import LoadingScreen from 'src/components/LoadingScreen'
import useStore from 'src/contexts/AuthProvider'
import AppTooltip from "src/components/common/AppTooltip";

const _ = require('lodash');

export default function RolesPermissions() {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [modelTitle, setmodelTitle] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [permissions, setPermissions] = useState(['users', 'category','chat_category', 'sub_admin', 'roles', 'trust_level', 'trace_request', 'trace_history', 'configurable_fields', 'business_request', 'group_chat_admin', 'employee_request', 'employee_history' , 'event','posts']);
  const [filterName, setFilterName] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [Id, setId] = useState("");
  const [permissionsObj, setPermissionsObj] = useState({});
  const permissionsData = useStore(state => state.permissions);
  const [loding, setLoding] = useState(true);

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
    { id: 'createdAt', label: 'date', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];

  const TABLE_HEAD_ROLE = [
    { id: 'Permissions', label: 'permissions', alignRight: false },
    { id: 'All', label: 'all', alignRight: false },
    { id: 'List', label: 'list', alignRight: false },
    { id: 'Add', label: 'add', alignRight: false },
    { id: 'Delete', label: 'delete', alignRight: false },
    { id: 'Update', label: 'update', alignRight: false },
    { id: 'Export', label: 'export', alignRight: false },
  ];

  async function getRoleData() {
    const response = await axiosPrivate.get(ROLE_API_URL.getRoleList)
    return response.data;
  }

  const { isLoading, data: roleData, refetch } = useQuery(['roleData'], () => getRoleData(), { keepPreviousData: true, })

  useEffect(() => {
    if (roleData) {
      setTableData(roleData.data ? [] : roleData);
      setRowsPerPage(10);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [roleData])

  const handleFilterByName = (event) => {
    setFilterName(event.target.value.trim());
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roleData?.data?.length) : 0;

  const filteredUsers = tableData;
  const isUserNotFound = filteredUsers?.length === 0;

  const completedSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "name can set of between 2 and 50 characters!")
      .max(50, "name can set of between 2 and 50 characters!")
      .required("role name is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      admin_email: '',
    },
    validationSchema: completedSchema,
    onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
      const informationObj = {
        name: values.name,
        users: permissionsObj.users,
        category: permissionsObj.category,
        sub_admin: permissionsObj.sub_admin,
        roles: permissionsObj.roles,
        trust_level: permissionsObj.trust_level,
        trace_request: permissionsObj.trace_request,
        trace_history: permissionsObj.trace_history,
        configurable_fields: permissionsObj.configurable_fields,
        business_request: permissionsObj.business_request
      };
      if (Id == '') {
        await addRole(informationObj);
      } else {
        await updateRole(informationObj);
      }
      resetForm();
      setSubmitting(false);
    },
  });

  const { mutateAsync: updateRole } = useMutation(
    async (data) => {
      return await axiosPrivate.put(ROLE_API_URL.updateRole + Id, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("Role Update successfully ", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        handleCloseModal();
      },
      onError: (error) => {
        const errorData = error.response.data.errors;

        Object.keys(errorData).forEach((key) => {
          if (key === "name") {
            setFieldError("name", errorData[key]);
          } else {
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );

  const { mutateAsync: addRole } = useMutation(
    async (data) => {
      return await axiosPrivate.post(ROLE_API_URL.addRole, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("Role add successfully ", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        handleCloseModal();
      },
      onError: (error) => {
        const errorData = error.response.data.errors;

        Object.keys(errorData).forEach((key) => {
          if (key === "name") {
            setFieldError("name", errorData[key]);
          } else {
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );
  function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }
  const handleChangeRole = (event, index, name) => {
    permissionsObj[name] = setCharAt(permissionsObj[name], index, event.target.checked ? "1" : "0");
    setPermissions(['users', 'category','chat_category', 'sub_admin', 'roles', 'trust_level', 'trace_request', 'trace_history', 'configurable_fields', 'business_request','group_chat_admin', 'employee_request', 'employee_history','event','posts']);
  };
  const handleChangeRoleAll = (event, name) => {
    permissionsObj[name] = event.target.checked ? "11111" : "00000";
    setPermissions(['users', 'category', 'chat_category','sub_admin', 'roles', 'trust_level', 'trace_request', 'trace_history', 'configurable_fields', 'business_request','group_chat_admin', 'employee_request', 'employee_history','event','posts']);
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModalAdd = () => {
    setFieldValue('name', "")
    setmodelTitle('add')
    setId('')
    setPermissionsObj({
      users: "00000",
      category: "00000",
      sub_admin: "00000",
      trust_level: "00000",
      roles: "00000",
      trace_request: "00000",
      trace_history: "00000",
      configurable_fields: "00000",
      business_request: "00000"
    })
    setOpenModal(true);
  };

  const handleOpenModalUpdate = (row) => {
    setPermissionsObj(row.permission);
    setFieldValue('name', row.name)
    setId(row._id)
    setmodelTitle('update')
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
              placeholder="search role..."
              onChange={(e) => handleFilterByName(e)}
            />
          </Paper>
          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
            {permissionsData?.roles?.substring(1, 2) == "1"
              ? <AppTooltip title="add role" placement="bottom"><Button className="dashboard_light_bg_icon_btn" onClick={handleOpenModalAdd}><AddCircleOutlineOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip> : ''}
            <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>
          </Stack>
        </div>
        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={roleData?.data?.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {tableData.length != 0 && tableData?.filter(user => user?.name?.toLowerCase().includes(filterName.toLowerCase())).map((row) => {
                  return (
                    <StyledTableRow key={row._id}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left"> {moment(row.createdAt).format("MMM DD YYYY h:mm A")}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={3}>
                          {permissionsData?.roles?.substring(3, 4) == "1"
                            ? <AppTooltip title="role edit" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                              onClick={() => handleOpenModalUpdate(row)}
                              variant="text" className="user_list_row_btn"><EditPenIcon /></Button></AppTooltip> : ''}
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  )
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
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
                <h4>{modelTitle}</h4>
              </div>
              <div className="right_part">
                <Button className="dashboard_light_bg_icon_btn" onClick={handleCloseModal} aria-label="delete">
                  <CloseIcon />
                </Button>
              </div>
            </div>
            <div className="modal_card_body custom_scrollbar max_hight500">
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group mb-4">
                        <TextField
                          label='role name'
                          autoComplete='off'
                          fullWidth
                          variant='outlined'
                          {...getFieldProps("name")}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </div>
                    </div>
                  </div>
                  <TableContainer>
                    <Table>
                      <UserListHead
                        headLabel={TABLE_HEAD_ROLE}
                        rowCount="7"
                        onRequestSort={handleRequestSort}
                      />
                      <TableBody>
                        {permissions.map((item, i) => {
                          return (
                            <StyledTableRow key={i}>
                              <TableCell component="th" scope="row">{item}</TableCell>
                              <TableCell align="left"> <Switch
                                checked={permissionsObj[item] == "11111" ? true : false}
                                onChange={(e) => handleChangeRoleAll(e, item)}
                              /></TableCell>
                              <TableCell align="left"> <Switch
                                checked={permissionsObj[item]?.substring(0, 1) == "1" ? true : false}
                                onChange={(e) => handleChangeRole(e, 0, item)}
                              /></TableCell>
                              <TableCell align="left"> <Switch
                                checked={permissionsObj[item]?.substring(1, 2) == "1" ? true : false}
                                onChange={(e) => handleChangeRole(e, 1, item)}
                              /></TableCell>
                              <TableCell align="left"> <Switch
                                checked={permissionsObj[item]?.substring(2, 3) == "1" ? true : false}
                                onChange={(e) => handleChangeRole(e, 2, item)}
                              /></TableCell>
                              <TableCell align="left"> <Switch
                                checked={permissionsObj[item]?.substring(3, 4) == "1" ? true : false}
                                onChange={(e) => handleChangeRole(e, 3, item)}
                              /></TableCell>
                              <TableCell align="left"> <Switch
                                checked={permissionsObj[item]?.substring(4, 5) == "1" ? true : false}
                                onChange={(e) => handleChangeRole(e, 4, item)}
                              /></TableCell>
                            </StyledTableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
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

