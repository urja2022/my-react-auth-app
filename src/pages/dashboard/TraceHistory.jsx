import React, { useEffect, useState } from "react";
import { Card, Table, Button, InputBase, TableBody, Paper, TableCell, IconButton, TableContainer, TablePagination, TableRow } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import { useQuery } from 'react-query';
import { TRACE_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import Stack from '@mui/material/Stack';
import { useSnackbar } from "notistack";
import LoadingScreen from 'src/components/LoadingScreen'
import moment from 'moment'
import { Chip } from "@mui/material";
import SearchIcon from "src/svgComponents/SearchIcon";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import AppTooltip from "src/components/common/AppTooltip";
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import useStore from "src/contexts/AuthProvider";
const _ = require('lodash');

export default function TraceHistory() {
   const [tableData, setTableData] = useState([]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [order, setOrder] = useState('asc');
   const [orderBy, setOrderBy] = useState('name');
   const [filterName, setFilterName] = useState('');
   const permissionsData = useStore(state => state.permissions);
   const axiosPrivate = useAxiosPrivate();
   const { enqueueSnackbar } = useSnackbar();
   const [loding, setLoding] = useState(true);
   const [CsvData, setCsvData] = useState([]);

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
      { id: 'requestedTrace', label: 'number of request', alignRight: false },
      { id: 'createdAt', label: 'date', alignRight: false },
      { id: 'status', label: 'status', alignRight: false },
   ];

   useEffect(() => {
      var arr = [];
      tableData.map((item) => {
         const createdAt = new Date(item?.createdAt).toLocaleString();
         var obj = {
            "fullName": item?.fullName ? item?.fullName : '-',
            "requestedTrace": item?.requestedTrace ? item?.requestedTrace : '-',
            "createdAt": createdAt ?? '-',
            "status": item?.status == 1 ? 'Accepted' : 'Rejected',
         }
         arr.push(obj);
      })
      setCsvData(arr)
   }, [tableData]);
   const headers = [
      { label: "fullName", key: "fullName" },
      { label: "requestedTrace", key: "requestedTrace" },
      { label: "createdAt", key: "createdAt" },
      { label: "status", key: "status" },
   ];
   let csvReport = {
      data: CsvData,
      headers: headers,
      filename: 'beemz-trace-history.csv'
   };
   async function getTraceHistory(page, filterName) {
      const response = await axiosPrivate.get(TRACE_API_URL.getTraceHistory, { params: { page: page + 1, search: filterName, limit: rowsPerPage } })
      return response.data[0];
   }

   const { isLoading, data: traceHistoryList, refetch } = useQuery(['traceHistoryList', filterName], () => getTraceHistory(page, filterName), { keepPreviousData: true, })

   useEffect(() => {
      if (traceHistoryList) {
         setTableData(traceHistoryList.data);
         setRowsPerPage(10);
      }
      getTraceHistory(page, filterName);
      setTimeout(() => {
         setLoding(false);
      }, 1800);
   }, [traceHistoryList])
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
      getTraceHistory(page, filterName);
   };

   const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
   };

   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - traceHistoryList?.data?.length) : 0;
   const filteredUsers = tableData;
   const isUserNotFound = filteredUsers?.length === 0;
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
                     placeholder="search user name..."
                     onChange={(e) => handleFilterByName(e)}
                  />
               </Paper>
               <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
                  <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>

                  {permissionsData?.trace_history?.substring(1, 2) == "1"
                     ?
                     <AppTooltip title="export-trace-request-history" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip> : ''}
               </Stack>
            </div>
            <Card>
               <TableContainer>
                  <Table>
                     <UserListHead
                        headLabel={TABLE_HEAD}
                        rowCount={traceHistoryList?.data?.length}
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
                                    <TableCell align="left"> {row.requestedTrace}</TableCell>
                                    <TableCell align="left"> {moment(row.createdAt).format("MMM DD YYYY h:mm A")}</TableCell>
                                    <TableCell>
                                       <Stack direction="row" spacing={3}>
                                          {
                                             row.status == 1 ? <Chip variant="contained" label="Accepted" className="app_status_chip accepted" /> : <Chip variant="contained" className="app_status_chip invalid" label="Rejected" />
                                          }
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
               <TablePagination
                  component="div"
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  count={traceHistoryList?.metadata?.length != 0 ? traceHistoryList?.metadata[0]?.total : 0}
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