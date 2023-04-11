import { Button, Card, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, styled } from '@material-ui/core';
import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { CONTACT_US_API_URL } from 'src/api/axios';
import LoadingScreen from 'src/components/LoadingScreen';
import AppTooltip from 'src/components/common/AppTooltip';
import UserListHead from 'src/components/user/UserListHead';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { PATH_DASHBOARD } from 'src/routes/paths';
import SearchIcon from 'src/svgComponents/SearchIcon';
// for csv
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import useStore from "src/contexts/AuthProvider";
import moment from 'moment';



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
const ContactUs = () => {


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [tableData, setTableData] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [loding, setLoding] = useState(true);
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
    { id: 'email', label: 'email', alignRight: false },
    { id: 'ticketNumber', label: 'ticket number', alignRight: false },
    { id: 'createdAt', label: 'create on', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];

  useEffect(() => {
    var arr = [];
    tableData.map((item) => {
      var obj = {
        "name": item?.name ? item?.name : '-',
        "email": item?.email ? item?.email : '-',
        "message": item?.message ? item?.message : '-',
        "subject": item?.subject ? item?.subject : '-',
        "ticketNumber": item?.ticketNumber ? item?.ticketNumber : '-',
        "createOn": item?.createdAt ? moment(item?.createdAt).format('DD MMM YYYY') : "-"
      }
      arr.push(obj);
    })
    setCsvData(arr)
  }, [tableData]);
  const headers = [
    { label: "name", key: "name" },
    { label: "name", key: "email" },
    { label: "message", key: "message" },
    { label: "subject", key: "subject" },
    { label: "ticket number", key: "ticketNumber" },
    { label: "createOn", key: "createOn" },
  ];
  let csvReport = {
    data: CsvData,
    headers: headers,
    filename: 'beemz-contact-us.csv'
  };

  async function fetchContactUs(page, filterName) {
    const response = await axiosPrivate.get(CONTACT_US_API_URL.contactUsList, { params: { page: page + 1, search: filterName, limit: rowsPerPage } })

    return response.data[0];
  }

  const { isLoading, data: contactUsList, refetch } = useQuery(['contactUsList', page, filterName], () => fetchContactUs(page, filterName), { keepPreviousData: true, })

  useEffect(() => {
    if (contactUsList) {
      setTableData(contactUsList?.data);
      setRowsPerPage(contactUsList?.metadata.length != 0 ? contactUsList?.metadata[0].limit : 10);
    }
    if (contactUsList?.metadata.length != 0 && contactUsList?.metadata[0].hasMoreData == true) {
      fetchContactUs(page + 1);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [contactUsList])




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
    fetchContactUs(page, filterName);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRequestView = (data) => {
    navigate(PATH_DASHBOARD.general.contactUsView, { state: data })
  }

  const filteredUsers = applySortFilter(tableData, getComparator(order, orderBy));
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
              placeholder="search username..."
              onChange={(e) => handleFilterByName(e)}
            />
          </Paper>
          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>

            {/* csv */}

            <AppTooltip title="export-contact-us" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip>
          </Stack>
        </div>
        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={contactUsList?.metadata.length !== 0 ? contactUsList?.metadata[0].total : 0}
                onRequestSort={handleRequestSort}
              />
              {filteredUsers.length > 0 ?
                <TableBody>
                  {filteredUsers.map((row, key) => {
                    return (
                      <StyledTableRow key={key}>
                        <TableCell component="th" scope="row">
                          {row?.name || '-'}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row?.email || '-'}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row?.ticketNumber || '-'}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {moment(row?.createdAt).format('DD MMM YYYY') ?? "-"}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            <AppTooltip title="view contact-us details" placement="bottom"><Button className="theme_button_view" variant="contained" onClick={(e) => handleRequestView(row)} >view</Button></AppTooltip>

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
            count={contactUsList?.metadata.length != 0 ? contactUsList?.metadata[0].total : 0}
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

export default ContactUs