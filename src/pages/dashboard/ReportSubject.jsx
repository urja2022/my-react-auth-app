import React, { useEffect, useState } from "react";
import { Card, Table, TableBody, TableCell, TableContainer, TableRow, Box, MenuItem, IconButton } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { USER_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import EditPenIcon from 'src/svgComponents/EditPenIcon'
import BinIcon from 'src/svgComponents/BinIcon'
import { Button, Modal, InputBase, Paper, TextField, Select, FormControl, InputLabel, Stack, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from "@mui/material";
import SearchIcon from "src/svgComponents/SearchIcon";
import CloseIcon from '@mui/icons-material/Close';
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import LoadingScreen from 'src/components/LoadingScreen'
import AppTooltip from "src/components/common/AppTooltip";
import { useTheme } from '@mui/material/styles';
// for csv
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import useStore from "src/contexts/AuthProvider";
const _ = require('lodash');

export default function ReportSubject() {
  const [modelTitle, setmodelTitle] = useState("");
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [reportTypeData, setReportTypeData] = useState("1");
  const [Id, setId] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [loding, setLoding] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteId, setdeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const [CsvData, setCsvData] = useState([]);
  const permissionsData = useStore(state => state.permissions);
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
    { id: 'subject', label: 'subject', alignRight: false },
    { id: 'reportType', label: 'report type', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];
  useEffect(() => {
    var arr = [];
    tableData.map((item) => {
      var obj = {
        "subject": item?.subject ? item?.subject : '-',
        "reportType": item?.reportType == 1 ? 'Common' : item?.reportType == 2 ? "User" : item?.reportType == 3 ? "Business" : item?.reportType == 4 ? "Group" : item?.reportType == 5 ? "Feed" : item?.reportType == 6 ? "Event" : "Social Media",
      }
      arr.push(obj);
    })
    setCsvData(arr)
  }, [tableData]);
  const headers = [

    { label: "subject", key: "subject" },
    { label: "reportType", key: "reportType" },
  ];
  let csvReport = {
    data: CsvData,
    headers: headers,
    filename: 'beemz-report-subject.csv'
  };

  const completedSchema = Yup.object().shape({
    subject: Yup.string()
      .min(2, "subject can set of between 2 and 255 characters!")
      .max(255, "subject can set of between 2 and 255 characters!")
      .required("subject is required"),
  });

  const formik = useFormik({
    initialValues: {
      subject: "",
    },
    validationSchema: completedSchema,
    onSubmit: async (values, { resetForm, setFieldError, setSubmitting }) => {
      const informationObj = {
        subject: values.subject,
        reportType: reportTypeData
      };

      if (Id == "") {
        await subjectAdd(informationObj);
      } else {
        await subjectUpdate(informationObj);
      }
      setReportTypeData("1");
      resetForm();
      setSubmitting(false);
    },
  });
  const { mutateAsync: subjectAdd } = useMutation(
    async (data) => {
      return await axiosPrivate.post(USER_API_URL.addReportSubject, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("report subject add successfully ", {
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
          if (key === "subject") {
            setFieldError("subject", errorData[key]);
          } else {
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );
  const { mutateAsync: subjectUpdate } = useMutation(
    async (data) => {
      return await axiosPrivate.put(USER_API_URL.updateReportSubject + Id, JSON.stringify(data))
    },
    {
      onSuccess: ({ data }) => {
        refetch();
        enqueueSnackbar("report subject update successfully ", {
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
          } else {
            setFieldError(key, errorData[key]);
          }
        });
      },
    }
  );

  async function fetchSeeker() {
    const response = await axiosPrivate.get(USER_API_URL.getReportSubjectList)
    return response.data;
  }

  const { isLoading, data: reportSubjectList, refetch } = useQuery(['reportSubjectList'], () => fetchSeeker(), { keepPreviousData: true, })

  useEffect(() => {
    if (reportSubjectList) {
      setTableData(reportSubjectList);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [reportSubjectList])

  const handleFilterByName = (event) => {
    setFilterName(event.target.value.trim());
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClickOpen = (subjectId) => {
    setdeleteId(subjectId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deletesubject = async () => {
    const response = await axiosPrivate.delete(USER_API_URL.deleteReportSubject + deleteId)
    if (response.status == 200) {
      enqueueSnackbar("report subject delete successfully", {
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

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModalAdd = () => {
    setFieldValue('subject', "")
    setReportTypeData("1");
    setId('')
    setmodelTitle('add')
    setOpenModal(true);
  };
  const handleOpenModalUpdate = (row) => {
    setFieldValue('subject', row.subject)
    setReportTypeData(row.reportType)
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
            <IconButton sx={{ padding: '12px' }}>
              <SearchIcon />
            </IconButton>
            <InputBase
              fullWidth
              sx={{ flex: 1 }}
              placeholder="search report subject..."
              onChange={(e) => handleFilterByName(e)}
            />
          </Paper>
          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
            <AppTooltip title="add subject" placement="bottom"><Button className="dashboard_light_bg_icon_btn" onClick={handleOpenModalAdd}><AddCircleOutlineOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>



            {permissionsData?.report?.substring(1, 2) == "1"
              ?
              <AppTooltip title="export-report-subject" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip> : ''}
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
            {"are you sure you want to delete?"}
          </DialogTitle>
          <DialogContent>
          </DialogContent>
          <DialogActions className='m-auto'>
            <Button className="theme_button_view" variant="contained" autoFocus onClick={handleClose}>
              cancel
            </Button>
            <Button className="theme_button" variant="contained" onClick={() => deletesubject()} autoFocus>
              delete
            </Button>
          </DialogActions>
        </Dialog>
        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {tableData.filter(user => user?.subject?.toLowerCase().includes(filterName.toLowerCase())).map((row, key) => {
                  return (
                    <StyledTableRow key={key}>
                      <TableCell component="th" scope="row">
                        {row.subject}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.reportType == 1 ? "common" : row.reportType == 2 ? "user" : row.reportType == 3 ? "business" : row.reportType == 4 ? "group" : row.reportType == 5 ? "feed" : row.reportType == 6 ? "event" : "social media"}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={3}>
                          <AppTooltip title="subject edit" placement="bottom"><Button sx={{ "&:hover": { bgcolor: "transparent" } }}
                            onClick={() => handleOpenModalUpdate(row)}
                            variant="text" className="user_list_row_btn"><EditPenIcon /></Button></AppTooltip> <AppTooltip title="subject delete" placement="bottom"><Button variant="text" className="user_list_row_btn" onClick={() => handleClickOpen(row._id)} ><BinIcon /></Button></AppTooltip>
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
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
                        <h4 className="app_text_14_semibold mb-0">report subject information</h4>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group mb-4">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">report type</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="report type"
                            defaultValue={reportTypeData}
                            onChange={(e) => setReportTypeData(e.target.value)}
                          >
                            <MenuItem value="1" > comman </MenuItem>
                            <MenuItem value="2" > user </MenuItem>
                            <MenuItem value="3" > business </MenuItem>
                            <MenuItem value="4" > group </MenuItem>
                            <MenuItem value="5" > feed </MenuItem>
                            <MenuItem value="6" > event </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group mb-4">
                        <TextField
                          label='subject'
                          autoComplete='off'
                          fullWidth
                          variant='outlined'
                          {...getFieldProps("subject")}
                          error={Boolean(touched.subject && errors.subject)}
                          helperText={touched.subject && errors.subject}
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