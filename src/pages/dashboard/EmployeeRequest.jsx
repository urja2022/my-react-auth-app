import React, { useEffect, useState } from "react";
import { Card, Table, InputBase, TableBody, Paper, TableCell, IconButton, TableContainer, TablePagination, TableRow } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import { useQuery } from 'react-query';
import { EMPLOYEE_API_URL, TRACE_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import Stack from '@mui/material/Stack';
import { useSnackbar } from "notistack";
import LoadingScreen from 'src/components/LoadingScreen'
import moment from 'moment'
import Button from '@mui/material/Button';
import useStore from 'src/contexts/AuthProvider'
import AppTooltip from "src/components/common/AppTooltip";
import SearchIcon from "src/svgComponents/SearchIcon";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
// for csv
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';


const _ = require('lodash');

export default function EmployeeRequest() {
   const [tableData, setTableData] = useState([]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [order, setOrder] = useState('asc');
   const [orderBy, setOrderBy] = useState('name');
   const [filterName, setFilterName] = useState('');
   const [CsvData, setCsvData] = useState([]);
   const permissionsData = useStore(state => state.permissions);
   const axiosPrivate = useAxiosPrivate();
   const { enqueueSnackbar } = useSnackbar();
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
      { id: 'fullName', label: 'name', alignRight: false },
      { id: 'requestedEmployee', label: 'number of request', alignRight: false },
      { id: 'createdAt', label: 'date', alignRight: false },
      { id: 'action', label: 'action', alignRight: false },
   ];

   useEffect(() => {
      var arr = [];
      tableData.map((item) => {
         var obj = {
            "name": item?.fullName ? item?.fullName : '-',
            "requestedEmployee": item?.requestedEmployee ? item?.requestedEmployee : '-',
            "createdAt": item?.createdAt ? moment(item.createdAt).format("MMM DD YYYY h:mm A") : '-',
         }
         arr.push(obj);
      })
      setCsvData(arr)
   }, [tableData]);
   const headers = [
      { label: "name", key: "name" },
      { label: "requestedEmployee", key: "requestedEmployee" },
      { label: "createdAt", key: "createdAt" },
   ];
   let csvReport = {
      data: CsvData,
      headers: headers,
      filename: 'beemz-employee-request.csv'
   };

   async function getEmployeeRequest(page, filterName) {
      const response = await axiosPrivate.get(EMPLOYEE_API_URL.getEmployeeRequest, { params: { page: page + 1, search: filterName, limit: rowsPerPage } })
      return response.data[0];
   }

   const { isLoading, data: employeeRequestList, refetch } = useQuery(['employeeRequestList', filterName], () => getEmployeeRequest(page, filterName), { keepPreviousData: true, })
   useEffect(() => {
      if (employeeRequestList) {
         setTableData(employeeRequestList.data);
         setRowsPerPage(10);
      }
      setTimeout(() => {
         setLoding(false);
      }, 1800);
   }, [employeeRequestList])
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
      getEmployeeRequest(page, filterName);
   };

   const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
   };

   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employeeRequestList?.data?.length) : 0;
   const filteredUsers = tableData;
   const isUserNotFound = filteredUsers?.length === 0;
   if (isLoading) return <LoadingScreen />

   async function updateEmployeeRequest(status, id) {
      const response = await axiosPrivate.put(EMPLOYEE_API_URL.updateRejectEmpRequest + id, { status: status })
      if (response.status == 200) {
         enqueueSnackbar("status change successfully ", {
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

   const onRequest = (status, id) => {
      updateEmployeeRequest(status, id);
   }

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
                  {permissionsData?.employee_request?.substring(1, 2) == "1"
                     ?
                     <AppTooltip title="export employee request" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip> : ''}
               </Stack>
            </div>
            <Card>
               <TableContainer>
                  <Table>
                     <UserListHead
                        headLabel={TABLE_HEAD}
                        rowCount={employeeRequestList?.data?.length}
                        onRequestSort={handleRequestSort}
                     />

                     {tableData.length > 0 ?
                        <TableBody>
                           {tableData.length != 0 && tableData?.map((row) => {
                              return (
                                 <StyledTableRow key={row._id}>
                                    <TableCell component="th" scope="row">
                                       {row.fullName ?? "-"}
                                    </TableCell>
                                    <TableCell align="left"> {row.requestedEmployee}</TableCell>
                                    <TableCell align="left"> {moment(row.createdAt).format("MMM DD YYYY h:mm A")}</TableCell>
                                    <TableCell>
                                       <Stack direction="row" spacing={3}>
                                          {permissionsData?.trace_request?.substring(3, 4) == "1"
                                             ? <>
                                                <AppTooltip title="accept trace request" placement="bottom"><Button className="theme_button" variant="contained" onClick={(e) => onRequest(1, row.userId)}>accept</Button></AppTooltip>
                                                <AppTooltip title="reject trace request" placement="bottom"><Button className="invalid_button" variant="contained" onClick={(e) => onRequest(2, row.userId)}>reject</Button></AppTooltip>
                                             </> : ''}
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
               <TablePagination
                  component="div"
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  count={employeeRequestList?.metadata?.length != 0 ? employeeRequestList?.metadata[0]?.total : 0}
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