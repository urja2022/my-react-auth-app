import React, { useEffect, useState } from "react";
import { IconButton, InputBase, Paper, Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Box, MenuItem, Chip, Select, FormControl } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { USER_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { Stack } from "@mui/material";
import { Button, InputLabel } from "@mui/material";
import { useSnackbar } from "notistack";
import LoadingScreen from 'src/components/LoadingScreen'
import AppTooltip from "src/components/common/AppTooltip";
import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, Modal, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import SearchIcon from "src/svgComponents/SearchIcon";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import CloseIcon from '@mui/icons-material/Close';
// for csv
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import useStore from "src/contexts/AuthProvider";

const _ = require('lodash');

export default function Report() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [tableData, setTableData] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [loding, setLoding] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [deleteId, setdeleteId] = useState("");
  const [Id, setId] = useState("");
  const [reportType, setReportType] = useState(0);
  const permissionsData = useStore(state => state.permissions);
  const [CsvData, setCsvData] = useState([]);
  const navigate = useNavigate();

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
    { id: 'name', label: 'user name', alignRight: false },
    { id: 'message', label: 'message', alignRight: false },
    { id: 'reportType', label: 'report type', alignRight: false },
    { id: 'ticketNumber', label: 'ticket number', alignRight: false },
    { id: 'subject', label: 'subject', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];


  useEffect(() => {
    var arr = [];
    tableData.map((item) => {
      var obj = {
        "name": item?.user ? item?.user?.name : '-',
        "message": item?.message ? item?.message : '-',
        "reportType": item?.reportType == 1 ? 'Common' : item?.reportType == 2 ? "User" : item?.reportType == 3 ? "Business" : item?.reportType == 4 ? "Group" : item?.reportType == 5 ? "Feed" : item?.reportType == 6 ? "Event" : "Social Media",
        "subject": item?.subject ? item?.subject : '-',
      }
      arr.push(obj);
    })
    setCsvData(arr)
  }, [tableData]);
  const headers = [
    { label: "name", key: "name" },
    { label: "message", key: "message" },
    { label: "reportType", key: "reportType" },
    { label: "subject", key: "subject" },
  ];
  let csvReport = {
    data: CsvData,
    headers: headers,
    filename: 'beemz-reports.csv'
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
  async function fetchSeeker(page, filterName, reportType) {
    const response = await axiosPrivate.get(USER_API_URL.getReportList, { params: { type: reportType, page: page + 1, search: filterName, limit: rowsPerPage } })

    return response.data[0];
  }

  const { isLoading, data: reportList, refetch } = useQuery(['reportList', page, filterName, reportType], () => fetchSeeker(page, filterName, reportType), { keepPreviousData: true, })

  useEffect(() => {
    if (reportList) {
      setTableData(reportList?.data);
      setRowsPerPage(reportList?.metadata.length != 0 ? reportList?.metadata[0].limit : 10);
    }
    if (reportList?.metadata.length != 0 && reportList?.metadata[0].hasMoreData == true) {
      fetchSeeker(page + 1);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [reportList])

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
    fetchSeeker(page, filterName, reportType);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredUsers = applySortFilter(tableData, getComparator(order, orderBy));

  const handleClickOpen = (reportId) => {
    setdeleteId(reportId);
    setOpen(true);
  };

  const typeFunction = (type) => {
    setReportType(type);
    refetch();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRequestView = (data) => {
    navigate(PATH_DASHBOARD.general.reportView, { state: { reportData: data } });
  };

  async function deleteRequest() {
    const response = await axiosPrivate.delete(USER_API_URL.deleteReport + deleteId)
    if (response.status == 200) {
      enqueueSnackbar("report deleted successfully ", {
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
    setOpen(false);
    refetch();
  }
  const completedSchema = Yup.object().shape({
    message: Yup.string()
      .min(2, "message can set of between 2 and 255 characters!")
      .max(255, "message can set of between 2 and 255 characters!")
      .required("message is required"),
  });
  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema: completedSchema,
    onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
      const informationObj = {
        message: values.message,
        reportId: Id
      };
      reportResponse(informationObj)
      resetForm();
      setSubmitting(false);
      refetch();
    },
  });
  const { mutateAsync: reportResponse } = useMutation(
    async (data) => {
      return await axiosPrivate.post(USER_API_URL.reportreply, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("response send successfully", {
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
            if (key === "message") {
              setFieldError("message", errorData[key]);
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
    setId(row.reportId)
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
          {/* <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">Users</h4> */}
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
          <div className="form-group w-25">
            <FormControl fullWidth>
              {/* <InputLabel id="demo-simple-select-label">filter</InputLabel> */}
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="filter"
                defaultValue={reportType}
                onChange={(e) => typeFunction(e.target.value)}
              >
                <MenuItem value="0"> all </MenuItem>
                <MenuItem value="1" > comman </MenuItem>
                <MenuItem value="2" > user </MenuItem>
                <MenuItem value="3" > business </MenuItem>
                <MenuItem value="4" > group </MenuItem>
                <MenuItem value="5" > post </MenuItem>
                <MenuItem value="6" > social media </MenuItem>
              </Select>
            </FormControl>
          </div>
          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
            <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>
            {/* csv */}
            {permissionsData?.report?.substring(1, 2) == "1"
              ?
              <AppTooltip title="export-report" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip> : ''}
          </Stack>
        </div>
        {/* <div className="dashboard_header mb-4">
          <div className="form-group w-25">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">filter</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="filter"
                defaultValue={reportType}
                onChange={(e) => typeFunction(e.target.value)}
              >
                <MenuItem value="0"> all </MenuItem>
                <MenuItem value="1" > comman </MenuItem>
                <MenuItem value="2" > user </MenuItem>
                <MenuItem value="3" > business </MenuItem>
                <MenuItem value="4" > group </MenuItem>
                <MenuItem value="5" > post </MenuItem>
                <MenuItem value="6" > social media </MenuItem>
              </Select>
            </FormControl>
          </div>
          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>

            <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>
          </Stack>
        </div> */}
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title" className='m-auto'>
            {"are you sure you want to delete?"}
          </DialogTitle>
          <DialogContent>
          </DialogContent>
          <DialogActions className='m-auto'>
            <Button className="theme_button_view" variant="contained" autoFocus onClick={handleClose}>
              cancel
            </Button>
            <Button className="theme_button" variant="contained" autoFocus onClick={deleteRequest}>
              delete
            </Button>
          </DialogActions>
        </Dialog>
        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={reportList?.metadata.length !== 0 ? reportList?.metadata[0].total : 0}
                onRequestSort={handleRequestSort}
              />
              {filteredUsers.length > 0 ?
                <TableBody>
                  {filteredUsers.map((row, key) => {
                    return (
                      <StyledTableRow key={key}>
                        <TableCell component="th" scope="row">
                          {row.user.name && row.user.name != "" ? row.user.name : "-"}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.message}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.reportType == 1 ? "common" : row.reportType == 2 ? "user" : row.reportType == 3 ? "business" : row.reportType == 4 ? "group" : row.reportType == 5 ? "feed" : row.reportType == 6 ? "event" : "social media"}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row?.ticketNumber || '-'}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.subject || '-'}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            <AppTooltip title="view report details" placement="bottom"><Button className="theme_button_view" variant="contained" onClick={(e) => handleRequestView(row)} >view</Button></AppTooltip>
                            <AppTooltip title="report delete" placement="bottom"><Button className="invalid_button" variant="contained" onClick={(e) => handleClickOpen(row.reportId)}>delete</Button></AppTooltip>
                            {row.isReply !== 1 ? <AppTooltip title="user report response" placement="bottom"><Button className="theme_button_view" variant="contained"
                              onClick={() => handleOpenModalUpdate(row)}
                            >reply</Button></AppTooltip> : ""}
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
            count={reportList?.metadata.length != 0 ? reportList?.metadata[0].total : 0}
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
                <h4>report response </h4>
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
                        <h4 className="app_text_14_semibold mb-0">report response information</h4>
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