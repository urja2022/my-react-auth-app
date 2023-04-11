import React, { useEffect, useState } from "react";
import { Card, Table, TableBody, TableCell, TableContainer, TableRow } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import { useQuery } from 'react-query';
import { USER_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import Stack from '@mui/material/Stack';
import { useSnackbar } from "notistack";
import LoadingScreen from 'src/components/LoadingScreen'
import moment from 'moment'
import Button from '@mui/material/Button';
import useStore from 'src/contexts/AuthProvider'
import AppTooltip from "src/components/common/AppTooltip";

const _ = require('lodash');

export default function UserDocument() {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
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
    { id: 'email', label: 'email', alignRight: false },
    { id: 'document type', label: 'document type', alignRight: false },
    { id: 'createdAt', label: 'date', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];

  async function getTraceRequest(filterName) {
    const response = await axiosPrivate.get(USER_API_URL.userDocList, { params: { search: filterName } })
    return response.data;
  }

  const { isLoading, data: userDocList, refetch } = useQuery(['userDocList', filterName], () => getTraceRequest(filterName), { keepPreviousData: true, })

  useEffect(() => {
    if (userDocList) {
      setTableData(userDocList.data ? [] : userDocList);
      setRowsPerPage(10);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [userDocList])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userDocList?.data?.length) : 0;
  const filteredUsers = tableData;
  if (isLoading) return <LoadingScreen />

  async function updateTraceRequest(status, id) {
    const response = await axiosPrivate.put(USER_API_URL.updateUserRequest, { result: status, userId: id })
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
    updateTraceRequest(status, id);
  }

  return (
    <>
      {loding ? <LoadingScreen /> : <>
        <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">user request</h4>
        <div className="dashboard_header mb-4">
        </div>
        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={userDocList?.data?.length}
                onRequestSort={handleRequestSort}
              />

              {tableData.length > 0 ?
                <TableBody>
                  {tableData.length != 0 && tableData?.map((row) => {
                    return (
                      <StyledTableRow key={row._id}>
                        <TableCell component="th" scope="row">
                          {row.fullName}
                        </TableCell>
                        <TableCell align="left"> {row.email}</TableCell>
                        <TableCell align="left"> {row.document.docType}</TableCell>
                        <TableCell align="left"> {moment(row.createdAt).format("MMM DD YYYY h:mm A")}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            {permissionsData?.users?.substring(3, 4) == "1"
                              ? <>
                                <AppTooltip title="accept user request" placement="bottom"><Button className="theme_button" variant="contained" onClick={(e) => onRequest(1, row._id)}>accept</Button></AppTooltip>
                                <AppTooltip title="reject user request" placement="bottom"><Button className="invalid_button" variant="contained" onClick={(e) => onRequest(0, row._id)}>reject</Button></AppTooltip>
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
        </Card>
      </>
      }
    </>
  )
}