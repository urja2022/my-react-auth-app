import React, { useEffect, useState } from "react";
import { Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Switch, Box, MenuItem } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { SOCIAL_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import BinIcon from 'src/svgComponents/BinIcon'
import Stack from '@mui/material/Stack';
import { Button, IconButton, Modal, InputBase, Paper } from "@mui/material";
import { useNavigate } from "react-router";
import SearchIcon from "src/svgComponents/SearchIcon";
import { useSnackbar } from "notistack";
import { useTheme } from '@mui/material/styles';
import LoadingScreen from 'src/components/LoadingScreen'
import useStore from 'src/contexts/AuthProvider'
import AppTooltip from "src/components/common/AppTooltip";
import moment from 'moment'
import SocialReportUserPopup from 'src/components/user/SocialReportUserPopup';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import { PATH_DASHBOARD } from "src/routes/paths";

const _ = require('lodash');

export default function SocialMedia() {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const permissionsData = useStore(state => state.permissions);
  const [loding, setLoding] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [openLinkPopup, setOpenLinkPopup] = useState(false);
  const [id, setId] = useState(false);
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
    { id: 'name', label: 'name', alignRight: false },
    { id: 'address', label: 'address', alignRight: false },
    { id: 'comment', label: 'comment', alignRight: false },
    { id: 'like', label: 'like', alignRight: false },
    { id: 'description', label: 'description', alignRight: false },
    { id: 'visibility', label: 'visibility', alignRight: false },
    { id: 'createdAt', label: 'createdAt', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];

  async function fetchSeeker() {
    const response = await axiosPrivate.get(SOCIAL_API_URL.getSocialList)
    return response.data[0];
  }

  const { isLoading, data: socialList, refetch } = useQuery(['socialList'], () => fetchSeeker(), { keepPreviousData: true, })

  useEffect(() => {
    if (socialList) {
      setTableData(socialList?.data);
      setRowsPerPage(socialList?.metadata && socialList?.metadata.length !== 0 ? socialList?.metadata[0].limit : 10);
    }
    if (socialList?.metadata && socialList?.metadata.length != 0 && socialList?.metadata[0].hasMoreData == true) {
      fetchSeeker(page + 1);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [socialList])

  const handleFilterByName = (event) => {
    setFilterName(event.target.value.trim());
    fetchSeeker();
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - socialList?.data?.length) : 0;

  const filteredUsers = tableData;
  const isUserNotFound = filteredUsers?.length === 0;

  async function handleChangePostStatus(id) {
    setLoding(true)
    const response = await axiosPrivate.put(SOCIAL_API_URL.postInactive + id)
    if (response.status == 200) {
      refetch();
      enqueueSnackbar("status change successfully ", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
      setTimeout(() => {
        setLoding(false);
      }, 1000);
    } else {
      enqueueSnackbar("something went wrong", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
      setLoding(false)
    }
  };
  async function handleChangeBlockUsers(id) {
    setOpenLinkPopup(true);
    setId(id);
  };
  const handleLinkPopupClose = (value) => {
    setOpenLinkPopup(false);
    setId(false)
  };
  const handleRequestSocialComment = (post_id) => {
    navigate(PATH_DASHBOARD.general.socialComment, { state: { post_id: post_id } });
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setTimeout(() => {
      refetch();
    }, 500);
  };
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
              placeholder="search social..."
              onChange={(e) => handleFilterByName(e)}
            />
          </Paper>
          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>

            <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>
          </Stack>
        </div>

        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={socialList?.data?.length}
                onRequestSort={handleRequestSort}
              />
              {tableData?.length > 0 ?
                <TableBody>
                  {tableData.length != 0 && tableData?.filter(user => user?.userName?.toLowerCase().includes(filterName.toLowerCase())).map((row) => {
                    return (
                      <StyledTableRow key={row._id}>
                        <TableCell component="th" scope="row">
                          {row.userName}
                        </TableCell>
                        <TableCell align="left"> {row?.address?.name}</TableCell>
                        <TableCell align="left"> {row.totalComments ?? 0}</TableCell>
                        <TableCell align="left"> {row.totalLikes ?? 0}</TableCell>
                        <TableCell align="left"> {row?.description}</TableCell>

                        <TableCell align="left">
                          <AppTooltip title="change status" placement="bottom"><Switch
                            checked={row.isBlockPost === 0 ? true : false}
                            onChange={() => handleChangePostStatus(row._id)}
                            defaultChecked /></AppTooltip>
                        </TableCell>
                        <TableCell align="left">  {moment(row?.createdAt).format("MMM DD YYYY h:mm A")}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>

                            {permissionsData?.sub_admin?.substring(2, 3) == "1"
                              ? <><AppTooltip title="post report user list" placement="bottom"><Button
                                onClick={() => handleChangeBlockUsers(row._id)}
                                variant="text" className="user_list_row_btn"><BlockOutlinedIcon /></Button></AppTooltip>
                                <AppTooltip title="users comments" placement="bottom"><Button
                                  onClick={() => handleRequestSocialComment(row._id)}
                                  variant="text" className="user_list_row_btn"><CommentOutlinedIcon /></Button></AppTooltip></> : ''}
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
                    <TableCell align="center" colSpan={7} sx={{ py: 5 }}>
                      <span className="app_text_16_semibold">no data found</span>
                    </TableCell>
                  </TableRow>
                </TableBody>}
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 20, 50, 100]}
            count={socialList?.metadata && socialList?.metadata?.length !== 0 ? socialList?.metadata[0].total : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <SocialReportUserPopup newLinkId={id} open={openLinkPopup} onClose={handleLinkPopupClose} />
        </Card>
      </>
      }
    </>
  )
}

