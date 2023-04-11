import React, { useEffect, useState } from "react";
import { Card, Table, Modal, TableBody, TableCell, TableContainer, TableRow, Switch, MenuItem, TablePagination } from "@material-ui/core";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { USER_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import EditPenIcon from 'src/svgComponents/EditPenIcon'
import Stack from '@mui/material/Stack';
import { Button, IconButton, InputBase, Paper, Select, FormControl, Box, InputLabel, Chip, TextField } from "@mui/material";
import SearchIcon from "src/svgComponents/SearchIcon";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import CloseIcon from '@mui/icons-material/Close';
import LoadingScreen from 'src/components/LoadingScreen'
import useStore from 'src/contexts/AuthProvider'
import AppTooltip from "src/components/common/AppTooltip";
// for csv
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

const _ = require('lodash');

export default function TrustLevel() {
  const [page, setPage] = useState(0);
  const [modelTitle, setmodelTitle] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [disable, setDisable] = useState(false);
  const [trustLevelImage, setTrustLevelImage] = useState("1");
  const [trustLevelIdNumber, setTrustLevelIdNumber] = useState("1");
  const [trustLevelReference, setTrustLevelReference] = useState("1");
  const [trustLevelHomeAddress, setTrustLevelHomeAddress] = useState("1");
  const [CsvData, setCsvData] = useState([]);
  const permissionsData = useStore(state => state.permissions);
  const axiosPrivate = useAxiosPrivate();
  const { enqueueSnackbar } = useSnackbar();
  const [loding, setLoding] = useState(true);

  const [Id, setId] = useState("");

  const TABLE_HEAD = [
    { id: 'name', label: 'name', alignRight: false },
    { id: 'idNumber', label: 'id number', alignRight: false },
    { id: 'image', label: 'image', alignRight: false },
    { id: 'reference', label: 'reference', alignRight: false },
    { id: 'homeAddress', label: 'home address', alignRight: false },
    { id: 'star', label: 'star', alignRight: false },
    { id: 'message', label: 'message', alignRight: false },
    { id: 'isActive', label: 'enabled', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];
  // For csv

  useEffect(() => {
    var arr = [];
    tableData.map((item) => {
      var obj = {
        "name": item?.name ? item?.name : '-',
        "idNumber": item?.idNumber ? item?.idNumber : '-',
        "image": item?.image == 1 ? 'Pending' : item?.image == 2 ? 'Invalid' : 'Accept',
        "reference": item?.reference == 1 ? 'Pending' : item?.reference == 2 ? 'Invalid' : 'Accept',
        "homeAddress": item?.homeAddress == 1 ? 'Pending' : item?.homeAddress == 2 ? 'Invalid' : 'Accept',
        "star": item?.star ? item?.star : 0,
        "message": item?.message ? item?.message : 0,
        "isActive": item?.isActive ? 'Active' : 'In-active',
      }
      arr.push(obj);
    })
    setCsvData(arr)
  }, [tableData]);
  const headers = [
    { label: "name", key: "name" },
    { label: "idNumber", key: "idNumber" },
    { label: "image", key: "image" },
    { label: "reference", key: "reference" },
    { label: "homeAddress", key: "homeAddress" },
    { label: "star", key: "star" },
    { label: "message", key: "message" },
    { label: "isActive", key: "isActive" },
  ];
  let csvReport = {
    data: CsvData,
    headers: headers,
    filename: 'beemz-trust-level.csv'
  };
  async function fetchSeeker(page, filterName) {
    const response = await axiosPrivate.get(USER_API_URL.trustLevelList, { params: { type: '1', page: page + 1, search: filterName, limit: rowsPerPage } })
    return response.data[0];
  }

  const { isLoading, data: trustLevelList, refetch } = useQuery(['trustLevelList', page, filterName], () => fetchSeeker(page, filterName), { keepPreviousData: true, })

  useEffect(() => {
    if (trustLevelList) {
      setTableData(trustLevelList?.data);
      setRowsPerPage(trustLevelList?.metadata && trustLevelList?.metadata.length !== 0 ? trustLevelList?.metadata[0].limit : 10);
    }
    if (trustLevelList?.metadata && trustLevelList?.metadata.length != 0 && trustLevelList?.metadata[0].hasMoreData == true) {
      fetchSeeker(page + 1);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [trustLevelList])

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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value.trim());
    setPage(0);
    fetchSeeker(page, filterName);
  };

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - trustLevelList?.metadata[0].total) : 0;

  const filteredUsers = tableData;
  const isUserNotFound = filteredUsers?.length === 0;

  const completedSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "name can set of between 2 and 50 characters!")
      .max(50, "name can set of between 2 and 50 characters!")
      .required("name is required"),
    message: Yup.string()
      .min(4, "message can set of between 4 and 255 characters!")
      .max(255, "message can set of between 4 and 255 characters!")
      .required("message is required"),
    star: Yup.string()
      .required("star is required")
      .matches(
        /^([0-5])$/g,
        "enter only 0 to 5"
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: completedSchema,
    onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
      const informationObj = {
        "name": values.name,
        "image": trustLevelImage,
        "idNumber": trustLevelIdNumber,
        "reference": trustLevelReference,
        "homeAddress": trustLevelHomeAddress,
        "message": values.message,
        "star": values.star
      };
      if (Id == '') {
        await trustLevelAdd(informationObj);
      } else {
        await trustUpdate(informationObj);
      }
      resetForm();
      setSubmitting(false);
    },
  });

  const { mutateAsync: trustUpdate } = useMutation(
    async (data) => {
      return await axiosPrivate.put(USER_API_URL.trustLevelUpdate + Id, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("trust leval update successfully ", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        handleCloseModal();
      },
      onError: (error) => {
        const errorData = error.response.data.errors;
        if (error.response?.data?.message) {
          enqueueSnackbar(error.response?.data?.message, {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 2000,
          });
        }
        Object.keys(errorData).forEach((key) => {
          if (key === "name") {
            setFieldError("name", errorData[key]);
          } else if (key === "message") {
            setFieldError("message", errorData[key]);
          } else if (key === "star") {
            setFieldError("star", errorData[key]);
          } else {
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );

  const { mutateAsync: trustLevelAdd } = useMutation(
    async (data) => {
      return await axiosPrivate.post(USER_API_URL.trustLevelAdd, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("trust leval add successfully ", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        handleCloseModal();
      },
      onError: (error) => {
        const errorData = error.response.data.errors;
        if (error.response?.data?.message) {
          enqueueSnackbar(error.response?.data?.message, {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 2000,
          });
        }
        Object.keys(errorData).forEach((key) => {
          if (key === "name") {
            setFieldError("name", errorData[key]);
          } else if (key === "message") {
            setFieldError("message", errorData[key]);
          } else if (key === "star") {
            setFieldError("star", errorData[key]);
          } else {
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModalAdd = () => {
    setFieldValue('name', "")
    setFieldValue('message', "")
    setFieldValue('star', "")
    setTrustLevelImage('1');
    setTrustLevelIdNumber('1');
    setTrustLevelReference('1');
    setTrustLevelHomeAddress('1');

    setDisable(false);
    setmodelTitle('add')
    setId('')
    setOpenModal(true);
  };

  const handleOpenModalUpdate = (row) => {
    setFieldValue('name', row.name)
    setFieldValue('message', row.message)
    setFieldValue('star', row.star)
    setTrustLevelImage(row.image);
    setTrustLevelIdNumber(row.idNumber);
    setTrustLevelReference(row.reference);
    setTrustLevelHomeAddress(row.homeAddress);

    setDisable(true);
    setId(row.id)
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
              placeholder="search trust level..."
              onChange={(e) => handleFilterByName(e)}
            />
          </Paper>
          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
            {permissionsData?.trust_level?.substring(1, 2) == "1"
              ? <AppTooltip title="add trust level" placement="bottom"><Button className="dashboard_light_bg_icon_btn" onClick={handleOpenModalAdd}><AddCircleOutlineOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip> : ''}
            {permissionsData?.trust_level?.substring(1, 2) == "1"
              ?
              <AppTooltip title="export trust level" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip>
              : ''}
            <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>
          </Stack>
        </div>

        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={trustLevelList?.data?.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredUsers?.map((row, key) => {
                  return (
                    <StyledTableRow key={key}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">  {row.idNumber == 1 ? <Chip label="pending" className="app_status_chip pending" /> : row.idNumber == 2 ? <Chip label="invalid" className="app_status_chip invalid" /> : <Chip label="accept" className="app_status_chip accepted" />}</TableCell>

                      <TableCell align="left">   {row.image == 1 ? <Chip label="pending" className="app_status_chip pending" /> : row.image == 2 ? <Chip label="invalid" className="app_status_chip invalid" /> : <Chip label="accept" className="app_status_chip accepted" />}</TableCell>

                      <TableCell align="left">  {row.reference == 1 ? <Chip label="pending" className="app_status_chip pending" /> : row.reference == 2 ? <Chip label="invalid" className="app_status_chip invalid" /> : <Chip label="accept" className="app_status_chip accepted" />}</TableCell>


                      <TableCell align="left">  {row.homeAddress == 1 ? <Chip label="pending" className="app_status_chip pending" /> : row.homeAddress == 2 ? <Chip label="invalid" className="app_status_chip invalid" /> : <Chip label="accept" className="app_status_chip accepted" />}</TableCell>

                      <TableCell align="left">  {row.star}</TableCell>
                      <TableCell align="left">  {row.message}</TableCell>
                      <TableCell align="left">
                        <FormGroup>
                          <FormControlLabel control={row.isActive ? <Switch defaultChecked /> : <Switch />} />
                        </FormGroup>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={3}>
                          {permissionsData?.trust_level?.substring(3, 4) == "1"
                            ? <AppTooltip title="edit trust leval" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                              onClick={() => handleOpenModalUpdate(row)}
                              variant="text" className="user_list_row_btn"><EditPenIcon /></Button></AppTooltip> : ''}
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
                    <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
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
            count={trustLevelList?.metadata && trustLevelList?.metadata?.length !== 0 ? trustLevelList?.metadata[0].total : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="modal_card modal_lg db_trust_level_modal_box">
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
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <div className="row">
                    <div className='col-12'>
                      <div className='user_edit_header mb-4'>
                        <h4 className="app_text_14_semibold mb-0">trust level information</h4>
                      </div>
                    </div>
                    <div className="col-lg-9">
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
                    <div className="col-lg-3">
                      <div className="form-group mb-4">
                        <TextField
                          label='star'
                          type='number'
                          autoComplete='off'
                          fullWidth
                          variant='outlined'
                          {...getFieldProps("star")}
                          error={Boolean(touched.star && errors.star)}
                          helperText={touched.star && errors.star}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group mb-4">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">image</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Image"
                            disabled={disable}
                            defaultValue={trustLevelImage}
                            onChange={(e) => setTrustLevelImage(e.target.value)}
                          >
                            <MenuItem value="1"> pending</MenuItem>
                            <MenuItem value="2"> invalid</MenuItem>
                            <MenuItem value="3"> accept</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group mb-4">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">id number</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Id Number"
                            disabled={disable}
                            defaultValue={trustLevelIdNumber}
                            onChange={(e) => setTrustLevelIdNumber(e.target.value)}
                          >
                            <MenuItem value="1"> pending</MenuItem>
                            <MenuItem value="2"> invalid</MenuItem>
                            <MenuItem value="3"> accept</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group mb-4">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">reference</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Reference"
                            disabled={disable}
                            defaultValue={trustLevelReference}
                            onChange={(e) => setTrustLevelReference(e.target.value)}
                          >
                            <MenuItem value="1"> pending</MenuItem>
                            <MenuItem value="2"> invalid</MenuItem>
                            <MenuItem value="3"> accept</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group mb-4">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">home address</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Home Address"
                            disabled={disable}
                            defaultValue={trustLevelHomeAddress}
                            onChange={(e) => setTrustLevelHomeAddress(e.target.value)}
                          >
                            <MenuItem value="1"> pending</MenuItem>
                            <MenuItem value="2"> invalid</MenuItem>
                            <MenuItem value="3"> accept</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group mb-4">
                        <TextField
                          label='message'
                          autoComplete='off'
                          fullWidth
                          variant='outlined'
                          {...getFieldProps("message")}
                          error={Boolean(touched.message && errors.message)}
                          helperText={touched.message && errors.message}
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