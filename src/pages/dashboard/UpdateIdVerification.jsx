import React, { useEffect, useState } from "react";
import { IconButton, InputBase, Paper, Card, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Box, FormControl, FormControlLabel, Modal, Radio, RadioGroup } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useQuery } from 'react-query';
import { USER_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { Stack } from "@mui/material";
import SearchIcon from "src/svgComponents/SearchIcon";
import LoadingScreen from 'src/components/LoadingScreen'
import moment from 'moment'
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import AppTooltip from "src/components/common/AppTooltip";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import StarRateIcon from '@mui/icons-material/StarRate';
import CloseIcon from '@mui/icons-material/Close';
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import useStore from "src/contexts/AuthProvider";

const _ = require('lodash');

export default function UpdateIdVerification() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [loding, setLoding] = useState(true);
  const [trustLevelImage, setTrustLevelImage] = useState("1");
  const [trustLevelIdNumber, setTrustLevelIdNumber] = useState("1");
  const [trustLevelReference, setTrustLevelReference] = useState("1");
  const [trustLevelHomeAddress, setTrustLevelHomeAddress] = useState("1");
  const [openTrustModal, setOpenTrustModal] = useState(false);
  const permissionsData = useStore(state => state.permissions);
  const [userId, setUserId] = useState(false);
  const [CsvData, setCsvData] = useState([]);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();


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
    { id: 'userName', label: 'name', alignRight: false },
    { id: 'fullName', label: 'full name', alignRight: false },
    { id: 'email', label: 'email', alignRight: false },
    { id: 'mobile', label: 'mobile number', alignRight: false },
    { id: 'document', label: 'document', alignRight: false },
    // { id: 'isApprove', label: 'status', alignRight: false },
    { id: 'createdAt', label: 'date', alignRight: false },
    { id: 'action', label: 'action', alignRight: false },
  ];

  useEffect(() => {
    var arr = [];
    tableData.map((item) => {
      const createdAt = new Date(item?.createdAt).toLocaleString();
      var obj = {
        "userName": item?.userName ? item?.userName : '-',
        "fullName": item?.fullName ? item?.fullName : '-',
        "email": item?.email ? item?.email : '-',
        "mobile": item?.mobile ? item?.mobile : '-',
        "document": item?.document?.country && item?.document?.docName ? item?.document?.country + ' - ' + item?.document?.docName : 'other',
        "createdAt": createdAt ?? '-',
      }
      arr.push(obj);
    })
    setCsvData(arr)
  }, [tableData]);
  const headers = [
    { label: "fullName", key: "fullName" },
    { label: "userName", key: "userName" },
    { label: "email", key: "email" },
    { label: "mobile", key: "mobile" },
    { label: "document", key: "document" },
    { label: "createdAt", key: "createdAt" },
  ];
  let csvReport = {
    data: CsvData,
    headers: headers,
    filename: 'beemz-updated-id-verification.csv'
  };
  async function getUsersIdVerificationData(page, filterName) {
    const response = await axiosPrivate.get(USER_API_URL.updateIdVerificationList, { params: { page: page + 1, search: filterName, limit: rowsPerPage } })
    return response.data[0];
  }

  const { isLoading, data: updateIdVerificationList, refetch } = useQuery(['updateIdVerificationList', page, filterName], () => getUsersIdVerificationData(page, filterName), { keepPreviousData: true, })

  useEffect(() => {
    if (updateIdVerificationList) {
      setTableData(updateIdVerificationList?.data);
      setRowsPerPage(updateIdVerificationList?.metadata.length != 0 ? updateIdVerificationList?.metadata[0].limit : 10);
    }
    if (updateIdVerificationList?.metadata.length != 0 && updateIdVerificationList?.metadata[0].hasMoreData == true) {
      getUsersIdVerificationData(page + 1);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [updateIdVerificationList])

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
    setFilterName(event.target.value.trim().replace('+', ''));
    getUsersIdVerificationData(page, filterName);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRequestEdit = (User_id) => {
    navigate(PATH_DASHBOARD.general.userEdit, { state: { User_id: User_id } });
  };

  if (isLoading) return <LoadingScreen />

  // trust level update
  const trustLevelUpdate = async () => {

    const response = await axiosPrivate.put(USER_API_URL.userTrustLevelUpdate + userId, {
      "image": trustLevelImage,
      "idNumber": trustLevelIdNumber,
      "reference": trustLevelReference,
      "homeAddress": trustLevelHomeAddress
    })
    if (response.status == 200) {
      enqueueSnackbar("trust level update successfully", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
      refetch();
      handleCloseTrustModal();
    }

  }
  const handleOpenTrustModal = (data) => {
    if (data.trustLevel) {
      setTrustLevelImage(data.trustLevel.image.toString());
      setTrustLevelIdNumber(data.trustLevel.id.toString());
      setTrustLevelReference(data.trustLevel.reference.toString());
      setTrustLevelHomeAddress(data.trustLevel.address.toString());
    } else {
      setTrustLevelImage("1");
      setTrustLevelIdNumber("1");
      setTrustLevelReference("1");
      setTrustLevelHomeAddress("1");
    }
    setUserId(data.id);
    setOpenTrustModal(true);
  };

  const handleCloseTrustModal = () => {
    setOpenTrustModal(false);
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
              placeholder="search users ..."
              onChange={(e) => handleFilterByName(e)}
            />
          </Paper>
          <Stack direction={"row"} className="d-flex align-items-center" spacing={2}>
            <AppTooltip title="refresh" placement="bottom"><Button className="dashboard_light_bg_icon_btn"><RefreshOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></Button></AppTooltip>

            {/* csv */}
            {permissionsData?.users?.substring(1, 2) == "1"
              ?
              <AppTooltip title="export-updated-userId-verification-history" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip> : ''}

          </Stack>
        </div>

        <Card>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={updateIdVerificationList?.metadata.length !== 0 ? updateIdVerificationList?.metadata[0].total : 0}
                onRequestSort={handleRequestSort}
              />
              {tableData.length > 0 ?
                <TableBody>
                  {tableData.map((row, i) => {
                    return (
                      <StyledTableRow key={i}>
                        <TableCell component="th" scope="row">
                          {row.userName ?? "-"}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.fullName ?? "-"}
                        </TableCell>
                        <TableCell align="left">  {row?.email ?? "-"}</TableCell>
                        <TableCell align="left">  {row?.mobile ?? "-"}</TableCell>
                        <TableCell align="left">  {row?.document?.country && row?.document?.docName ? row?.document?.country + "- " + row?.document?.docName : "other"} </TableCell>
                        {/* <TableCell component="th" scope="row">
                          {row?.trustLevel?.id === 1 ? <Chip label="pending" className="app_status_chip pending" /> : row?.trustLevel?.id === 2 ? <Chip label="invalid" className="app_status_chip invalid" /> : <Chip label="accepted" className="app_status_chip accepted" />}
                        </TableCell> */}
                        <TableCell align="left"> {moment(row.createdAt).format("MMM DD YYYY h:mm A")}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            <AppTooltip title="view user details" placement="bottom"><Button className="theme_button_view" variant="contained"
                              onClick={() => handleRequestEdit(row.id)}
                            >view</Button></AppTooltip>


                            <AppTooltip title="user trust level" placement="bottom"><Button variant="text" className="user_list_row_btn" onClick={() => handleOpenTrustModal(row)}><StarRateIcon /></Button></AppTooltip>
                          </Stack>
                        </TableCell>
                      </StyledTableRow>
                    )
                  })}
                </TableBody>
                :
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 5 }}>
                      <span className="app_text_16_semibold">no data found</span>
                    </TableCell>
                  </TableRow>
                </TableBody>}

            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 20, 50, 100]}
            count={updateIdVerificationList?.metadata.length != 0 ? updateIdVerificationList?.metadata[0].total : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>


      </>
      }

      {/* trust level dialogue */}
      <Modal
        open={openTrustModal}
        onClose={handleCloseTrustModal}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box className="modal_card modal_lg">
          <div className="modal_card_header">
            <div className="left_part">
              <h4>trust level</h4>
            </div>
            <div className="right_part">
              <Button className="dashboard_light_bg_icon_btn" onClick={handleCloseTrustModal} aria-label="delete">
                <CloseIcon />
              </Button>
            </div>
          </div>
          <div className="modal_card_body">
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group mb-4">
                  image
                </div>
              </div>
              <div className="col-lg-6 d-flex justify-content-end">
                <div className="form-group mb-4">
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="image"
                      defaultValue={trustLevelImage}
                      onChange={(e) => setTrustLevelImage(e.target.value)}
                    >
                      <FormControlLabel value="1" control={<Radio />} label="pending" />
                      <FormControlLabel value="2" control={<Radio />} label="invalid" />
                      <FormControlLabel value="3" control={<Radio />} label="accept" />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              <div className="col-lg-6 ">
                <div className="form-group mb-4">
                  id number
                </div>
              </div>
              <div className="col-lg-6 d-flex justify-content-end">
                <div className="form-group mb-4">
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="id"
                      defaultValue={trustLevelIdNumber}
                      onChange={(e) => setTrustLevelIdNumber(e.target.value)}
                    >
                      <FormControlLabel value="1" control={<Radio />} label="pending" />
                      <FormControlLabel value="2" control={<Radio />} label="invalid" />
                      <FormControlLabel value="3" control={<Radio />} label="accept" />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group mb-4">
                  reference
                </div>
              </div>
              <div className="col-lg-6 d-flex justify-content-end">
                <div className="form-group mb-4">
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="reference"
                      defaultValue={trustLevelReference}
                      onChange={(e) => setTrustLevelReference(e.target.value)}
                    >
                      <FormControlLabel value="1" control={<Radio />} label="pending" />
                      <FormControlLabel value="2" control={<Radio />} label="invalid" />
                      <FormControlLabel value="3" control={<Radio />} label="accept" />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group mb-4">
                  home address
                </div>
              </div>
              <div className="col-lg-6 d-flex justify-content-end">
                <div className="form-group mb-4">
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="address"
                      defaultValue={trustLevelHomeAddress}
                      onChange={(e) => setTrustLevelHomeAddress(e.target.value)}
                    >
                      <FormControlLabel value="1" control={<Radio />} label="pending" />
                      <FormControlLabel value="2" control={<Radio />} label="invalid" />
                      <FormControlLabel value="3" control={<Radio />} label="accept" />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="col-md-8 m-auto">
              <Button
                onClick={trustLevelUpdate}
                fullWidth
                variant="contained"
                className="my-3 text-lowercase text-white app_bg_primary app_text_16_semibold app_btn_lg"
              >
                submit
              </Button>
            </div>
          </div>
          <div className="modal_card_footer"></div>
        </Box>
      </Modal>
    </>
  )
}