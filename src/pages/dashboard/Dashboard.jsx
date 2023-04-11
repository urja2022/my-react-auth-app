import { useEffect, useState } from "react";
import UserCircleIcon from "src/svgComponents/DashboardCardIcons/UesrCircle";
import SubAdminIcon from "src/svgComponents/DashboardCardIcons/SubAdmin"
import TraceIcon from "src/svgComponents/DashboardCardIcons/Trace"
import CategoryIcon from "src/svgComponents/DashboardCardIcons/Category"
import ReportIcon from "src/svgComponents/DashboardCardIcons/Roles"
import EventIcon from "src/svgComponents/DashboardCardIcons/Event"
import LoadingScreen from 'src/components/LoadingScreen'
import { useQuery } from 'react-query';
import { TRACE_API_URL, USER_API_URL, BUSINESS_API_URL } from "src/api/axios";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { Card, Table, TableBody, TableCell, TableContainer, TableRow, Box } from "@material-ui/core";
import UserListHead from "src/components/user/UserListHead";
import { styled } from "@mui/styles";
import moment from "moment";
import { Button, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from 'src/routes/paths'
import useStore from 'src/contexts/AuthProvider'
import AppTooltip from "src/components/common/AppTooltip";
import { NavLink } from 'react-router-dom'
import { Modal, TextField, FormControl, InputLabel, Chip } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from "react-query";

const Dashboard = () => {
   const axiosPrivate = useAxiosPrivate();
   const [loding, setLoding] = useState(true);
   const [tableData, setTableData] = useState([]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [businessCount, setbusinessCount] = useState(0);
   const permissionsData = useStore(state => state.permissions);
   const [Id, setId] = useState("");
   const { enqueueSnackbar } = useSnackbar();
   const navigate = useNavigate();

   const { data: DashboardData, refetch } = useQuery(
      "DashboardData",
      async ({ signal }) => {
         return await axiosPrivate
            .get(USER_API_URL.dashboard, { signal })
            .then((res) => res.data);
      },
      { refetchOnWindowFocus: false }
   );
   useEffect(() => {
      setTimeout(() => {
         setLoding(false);
      }, 1800);
   }, [DashboardData])

   async function getBusinessData() {
      const response = await axiosPrivate.get(BUSINESS_API_URL.getBusinessList, { params: { page: 1, limit: 5 } })
      return response.data[0];
   }

   const { isLoading, data: businessList, refetch: businessRefetch } = useQuery(['businessList'], () => getBusinessData(), { keepPreviousData: true, })

   useEffect(() => {
      if (businessList) {
         setTableData(businessList?.data);
         setbusinessCount(businessList?.metadata?.[0]?.total);
      }
   }, [businessList])

   const TABLE_HEAD = [
      { id: 'name', label: 'name', alignRight: false },
      { id: 'userId', label: 'name of user', alignRight: false },
      { id: 'isApprove', label: 'status', alignRight: false },
      { id: 'createdAt', label: 'date', alignRight: false },
      { id: 'action', label: 'action', alignRight: false },
   ];

   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - businessList?.data?.length) : 0;

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

   async function updateRequest(status, id) {
      const response = await axiosPrivate.put(BUSINESS_API_URL.businessApprove + id, { isApprove: status })
      if (response.status == 200) {
         enqueueSnackbar("Status change successfully ", {
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
      businessRefetch();
   }

   const handleRequestBusiness = () => {
      navigate(PATH_DASHBOARD.general.business);
   };

   const handleRequestView = (data) => {
      navigate(PATH_DASHBOARD.general.businessView, { state: { businessData: data } });
   };
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
         businessRefetch();
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

   const { errors, touched, setFieldValue, handleSubmit, setFieldError, getFieldProps } = formik;

   return (
      <>
         {loding ? <LoadingScreen /> : <>
            <h4 className="app_text_20_semibold">dashboard</h4>
            <div className="container-fluid mt-4 px-0">
               <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4  g-4">
                  <div className="col">
                     <NavLink className="text-decoration-none" to={permissionsData?.users?.substring(0, 1) == "1" ? PATH_DASHBOARD.general.users : "/"}>
                        <div className="admin_dashboard_card">
                           <div className="card_icon"><UserCircleIcon /></div>
                           <div className="d-flex flex-column">
                              <span className="app_text_36_bold app_text_black">{DashboardData?.User ?? 0 ?? 0}</span>
                              <span className="app_text_14_500 app_text_black">users</span>
                           </div>
                        </div>
                     </NavLink>
                  </div>
                  <div className="col">
                     <NavLink className="text-decoration-none" to={permissionsData?.business_request?.substring(0, 1) == "1" ? PATH_DASHBOARD.general.business : "/"}>
                        <div className="admin_dashboard_card">
                           <div className="card_icon"><SubAdminIcon /></div>
                           <div className="d-flex flex-column">
                              <span className="app_text_36_bold app_text_black">{DashboardData?.Business ?? 0}</span>
                              <span className="app_text_14_500 app_text_black">business</span>
                           </div>
                        </div>
                     </NavLink>
                  </div>
                  <div className="col">
                     <NavLink className="text-decoration-none" to={permissionsData?.category?.substring(0, 1) == "1" ? PATH_DASHBOARD.general.categorys : "/"}>
                        <div className="admin_dashboard_card">
                           <div className="card_icon"><CategoryIcon /></div>
                           <div className="d-flex flex-column">
                              <span className="app_text_36_bold app_text_black">{DashboardData?.Category ?? 0}</span>
                              <span className="app_text_14_500 app_text_black">categories</span>
                           </div>
                        </div>
                     </NavLink>
                  </div>
                  <div className="col">
                     <NavLink className="text-decoration-none" to={permissionsData?.trace_request?.substring(0, 1) == "1" ? PATH_DASHBOARD.general.traceRequest : "/"}>
                        <div className="admin_dashboard_card">
                           <div className="card_icon"><TraceIcon /></div>
                           <div className="d-flex flex-column">
                              <span className="app_text_36_bold app_text_black">{DashboardData?.TraceRequest ?? 0}</span>
                              <span className="app_text_14_500 app_text_black">trace requests</span>
                           </div>
                        </div>
                     </NavLink>
                  </div>
                  <div className="col">
                     <NavLink className="text-decoration-none" to={PATH_DASHBOARD.general.event}>
                        <div className="admin_dashboard_card">
                           <div className="card_icon"><EventIcon /></div>
                           <div className="d-flex flex-column">
                              <span className="app_text_36_bold app_text_black">{DashboardData?.Event ?? 0}</span>
                              <span className="app_text_14_500 app_text_black">events</span>
                           </div>
                        </div>
                     </NavLink>
                  </div>
                  <div className="col">
                     <NavLink className="text-decoration-none" to={permissionsData?.business_request?.substring(0, 1) == "1" ? PATH_DASHBOARD.general.business : "/"}>
                        <div className="admin_dashboard_card">
                           <div className="card_icon"><SubAdminIcon /></div>
                           <div className="d-flex flex-column">
                              <span className="app_text_36_bold app_text_black">{DashboardData?.BusinessRequest ?? 0}</span>
                              <span className="app_text_14_500 app_text_black">business requests</span>
                           </div>
                        </div>
                     </NavLink>
                  </div>
                  <div className="col">
                     <NavLink className="text-decoration-none" to={PATH_DASHBOARD.general.report}>
                        <div className="admin_dashboard_card">
                           <div className="card_icon"><ReportIcon /></div>
                           <div className="d-flex flex-column">
                              <span className="app_text_36_bold app_text_black">{DashboardData?.ReportIssue ?? 0}</span>
                              <span className="app_text_14_500 app_text_black">reports</span>
                           </div>
                        </div>
                     </NavLink>
                  </div>
                  <div className="col">
                     <NavLink className="text-decoration-none" to={PATH_DASHBOARD.general.userDeleteReq}>
                        <div className="admin_dashboard_card">
                           <div className="card_icon"><UserCircleIcon /></div>
                           <div className="d-flex flex-column">
                              <span className="app_text_36_bold app_text_black">{DashboardData?.DeleteRequest ?? 0}</span>
                              <span className="app_text_14_500 app_text_black">delete requests</span>
                           </div>
                        </div>
                     </NavLink>
                  </div>
               </div>
               {/* <div className="row mt-5">

                  <h4 className="app_text_20_semibold">business request ({businessCount})</h4>
                  <div className="col-lg-6">
                     <Card>
                        <TableContainer>
                           <Table>
                              <UserListHead
                                 headLabel={TABLE_HEAD}
                              />
                              {tableData.length > 0 ?
                                 <TableBody>
                                    {tableData.length != 0 && tableData?.map((row, i) => {
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

                                    <TableRow style={{ height: 53 * emptyRows }}>
                                       <TableCell colSpan={6} />
                                    </TableRow>

                                 </TableBody>
                                 :
                                 <TableBody>
                                    <TableRow>
                                       <TableCell align="center" colSpan={4} sx={{ py: 5 }}>
                                          <span className="app_text_16_semibold">no data found</span>
                                       </TableCell>
                                    </TableRow>
                                 </TableBody>}
                           </Table>
                        </TableContainer>
                     </Card>
                     {businessCount > 5 ? <Button variant="contained" onClick={() => handleRequestBusiness()} className="mt-4 theme_button">view all</Button> : ""}
                  </div>
                  <div className="col-lg-6"></div>
               </div> */}
            </div>
            {/* <Modal
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
            </Modal> */}
         </>
         }
      </>
   )
}

export default Dashboard