import React, { useEffect, useState } from "react";
import { IconButton, InputBase, Paper, Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Box, Select, MenuItem } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { BUSINESS_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { Stack } from "@mui/material";
import SearchIcon from "src/svgComponents/SearchIcon";
import { useSnackbar } from "notistack";
import useStore from 'src/contexts/AuthProvider'
import LoadingScreen from 'src/components/LoadingScreen'
import moment from 'moment'
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import AppTooltip from "src/components/common/AppTooltip";
import { Button, Modal, TextField, FormControl, InputLabel, Chip } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from "react-query";
import EmployeePopup from "src/components/user/EmployeePopup";
// for csv
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

const _ = require('lodash');

export default function Business() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [loding, setLoding] = useState(true);
  const [businessType, setBusinessType] = useState(3);
  const [Id, setId] = useState("");
  const [BusinessId, setBusinessId] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const permissionsData = useStore(state => state.permissions);
  const navigate = useNavigate();
  const [openEmployeePopup, setOpenEmployeePopup] = useState(false);
  const [CsvData, setCsvData] = useState([]);


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
    { id: 'name', label: 'name', alignRight: false },
    { id: 'userId', label: 'name of user', alignRight: false },
    { id: 'isApprove', label: 'status', alignRight: false },
    { id: 'createdAt', label: 'date', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];
  // For csv

  useEffect(() => {
    var arr = [];
    tableData.map((item) => {
      const createdAt = new Date(item?.createdAt).toLocaleString();
      var obj = {
        "name": item?.name ? item?.name : '-',
        "userId": item?.userName ? item?.userName : '-',
        "isApprove": item?.isApprove == 1 ? 'Accepted' : item?.isApprove == 2 ? 'Rejected' : "Pending",
        "createdAt": createdAt || '-',
      }
      arr.push(obj);
    })
    setCsvData(arr)
  }, [tableData]);
  const headers = [
    { label: "name", key: "name" },
    { label: "userId", key: "userId" },
    { label: "isApprove", key: "isApprove" },
    { label: "createdAt", key: "createdAt" },
  ];
  let csvReport = {
    data: CsvData,
    headers: headers,
    filename: 'beemz-buisnesses.csv'
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
  async function getBusinessData(page, filterName, businessType) {
    const response = await axiosPrivate.get(BUSINESS_API_URL.getBusinessList, { params: { type: businessType == 3 ? false : businessType, page: page + 1, search: filterName, limit: rowsPerPage } })
    return response.data[0];
  }

  const { isLoading, data: businessList, refetch } = useQuery(['businessList', page, filterName, businessType], () => getBusinessData(page, filterName, businessType), { keepPreviousData: true, })

  useEffect(() => {
    if (businessList) {
      setTableData(businessList?.data);
      setRowsPerPage(businessList?.metadata.length != 0 ? businessList?.metadata[0].limit : 10);
    }
    if (businessList?.metadata.length != 0 && businessList?.metadata[0].hasMoreData == true) {
      getBusinessData(page + 1);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [businessList])

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
    getBusinessData(page, filterName, businessType);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredUsers = applySortFilter(tableData, getComparator(order, orderBy));

  async function updateRequest(status, id) {
    const response = await axiosPrivate.put(BUSINESS_API_URL.businessApprove + id, { isApprove: status })
    if (response.status == 200) {
      enqueueSnackbar("business accepted successfully", {
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

  const completedSchema = Yup.object().shape({
    rejectReason: Yup.string()
      .min(2, "reason can set of between 2 and 255 characters!")
      .max(255, "reason can set of between 2 and 255 characters!")
      .required("reason is required"),
  });
  const formik = useFormik({
    initialValues: {
      rejectReason: "",
    },
    validationSchema: completedSchema,
    onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
      const informationObj = {
        rejectReason: values.rejectReason,
        isApprove: 2
      };
      rejectRequest(informationObj)
      resetForm();
      setSubmitting(false);
      refetch();
    },
  });
  const { mutateAsync: rejectRequest } = useMutation(
    async (data) => {
      return await axiosPrivate.put(BUSINESS_API_URL.businessApprove + Id, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("business rejected successfully", {
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
        } else {
          Object.keys(errorData).forEach((key) => {
            if (key === "rejectReason") {
              setFieldError("rejectReason", errorData[key]);
            } else {
              setFieldError(key, errorData[key]);
            }
          });
        }
      },
    }
  );

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModalUpdate = (row) => {
    setId(row.id)
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const typeFunction = (type) => {
    setBusinessType(type);
    refetch();
  };
  const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;

  if (isLoading) return <LoadingScreen />
  const handleRequestView = (data) => {
    navigate(PATH_DASHBOARD.general.businessView, { state: { businessData: data } });
  };

  const handleClickEmployeePopupOpen = (dataId) => {
    setOpenEmployeePopup(true);
    setBusinessId(dataId);
  };

  const handleEmployeePopupClose = (value) => {
    setOpenEmployeePopup(false);
    setBusinessId(false)
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
              placeholder="search business name..."
              onChange={(e) => handleFilterByName(e)}
            />
          </Paper>
          <div className="form-group w-25">
            <FormControl fullWidth>
              {/* <InputLabel id="demo-simple-select-label">filter</InputLabel> */}
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="filter"
                defaultValue={businessType}
                onChange={(e) => typeFunction(e.target.value)}
              >
                <MenuItem value="3">  all </MenuItem>
                <MenuItem value="1" >  accept </MenuItem>
                <MenuItem value="2" >  reject </MenuItem>
                <MenuItem value="0" >  pending </MenuItem>
              </Select>
            </FormControl>
          </div>
          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>

            <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>

            {permissionsData?.business_request?.substring(1, 2) == "1"
              ?
              <AppTooltip title="export Business" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip>
              : ''}
          </Stack>
        </div>

        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={businessList?.metadata.length !== 0 ? businessList?.metadata[0].total : 0}
                onRequestSort={handleRequestSort}
              />
              {tableData.length > 0 ?
                <TableBody>
                  {tableData.map((row, i) => {
                    return (
                      <StyledTableRow key={i}>
                        <TableCell component="th" scope="row">
                          {row.name ?? "-"}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.userName ?? "-"}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.isApprove === 1 ? <Chip label="accepted" className="app_status_chip accepted" /> : row.isApprove === 2 ? <Chip label="rejected" className="app_status_chip invalid" /> : <Chip label="pending" className="app_status_chip pending" />}
                        </TableCell>



                        <TableCell align="left"> {moment(row.createdAt).format("MMM DD YYYY h:mm A")}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            <AppTooltip title="view business details" placement="bottom"><Button className="theme_button_view" variant="contained" onClick={(e) => handleRequestView(row)}>view</Button></AppTooltip>
                            <AppTooltip title="employee list" placement="bottom"><Button className="theme_button_view" variant="contained" onClick={() => handleClickEmployeePopupOpen(row?.id)}>employee</Button></AppTooltip>
                            {permissionsData?.business_request?.substring(3, 4) == "1" && row.isApprove === 0 ?
                              <>
                                <AppTooltip title="accept business request" placement="bottom"><Button className="theme_button" variant="contained" onClick={(e) => updateRequest(1, row.id)}>accept</Button></AppTooltip>
                                <AppTooltip title="reject business request" placement="bottom"><Button className="invalid_button" variant="contained" onClick={() => handleOpenModalUpdate(row)}
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
                    <TableCell align="center" colSpan={5} sx={{ py: 5 }}>
                      <span className="app_text_16_semibold">no data found</span>
                    </TableCell>
                  </TableRow>
                </TableBody>}

            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 20, 50, 100]}
            count={businessList?.metadata.length != 0 ? businessList?.metadata[0].total : 0}
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
                <h4>rejected reason </h4>
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
                        <h4 className="app_text_14_semibold mb-0">rejected reason information</h4>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-4">
                        <TextField
                          label='reason'
                          autoComplete='off'
                          fullWidth
                          variant='outlined'
                          {...getFieldProps("rejectReason")}
                          error={Boolean(touched.rejectReason && errors.rejectReason)}
                          helperText={touched.rejectReason && errors.rejectReason}
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
        <EmployeePopup newBusinessId={BusinessId} open={openEmployeePopup} onClose={handleEmployeePopupClose} />
      </>
      }
    </>
  )
}