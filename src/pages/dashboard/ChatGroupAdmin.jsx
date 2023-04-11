import React, { useEffect, useState } from "react";
import {
  Card,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import useStore from "src/contexts/AuthProvider";
import { styled } from "@mui/material/styles";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { useMutation, useQuery } from "react-query";
import { CHAT_API_URL, USER_API_URL } from "src/api/axios";
import UserListHead from "src/components/user/UserListHead";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import LoadingScreen from "src/components/LoadingScreen";
import Stack from "@mui/material/Stack";
import EditPenIcon from "src/svgComponents/EditPenIcon";
import { CSVLink } from "react-csv";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import {
  Avatar,
  Box,
  Button,
  DialogContent,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  Paper,
} from "@mui/material";
import SearchIcon from "src/svgComponents/SearchIcon";
import { useSnackbar } from "notistack";
import AppTooltip from "src/components/common/AppTooltip";
import CloseIcon from "@mui/icons-material/Close";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  useMediaQuery,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BinIcon from "src/svgComponents/BinIcon";
import UserImagePlaceholder from "../../assets/images/img_placeholder_circle.png";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import files from "src/helpers/helpers";
import ChatConfigPopup from "src/components/dashboard/ChatConfigPopup";
import UserAvatar from "src/components/common/UserAvatar";

export default function ChatGroupAdmin() {
  // const { themeStretch } = useSettings();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editGroupInfo, setEditGroupInfo] = useState(false);
  const [deleteGroup, setDeleteGroup] = useState(false);
  const [openGroupMemberModal, setOpenGroupMemberModal] = useState(false);
  const [groupMembersData, setGroupMembersData] = useState([]);
  const [serchDataGroupMember, setSerchDataGroupMember] = useState("");
  const [openGroupAdminModal, setOpenGroupAdminModal] = useState(false);
  const [removeMemberModal, setRemoveMemberModal] = useState(false);
  const [groupAdminData, setGroupAdminData] = useState([]);
  const [serchDataGroupAdmin, setSerchDataGroupAdmin] = useState("");
  const [groupData, setGroupData] = useState("");
  const [groupId, setGroupId] = useState(false);
  const [memberId, setMemberId] = useState(false);
  const [CsvData, setCsvData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const permissionsData = useStore((state) => state.permissions);
  const [loding, setLoding] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: "#ffffff",
    },
    "&:nth-of-type(even)": {
      background:
        "linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), #F4F5F7",
    },
    // hide last border
    "& td, & th": {
      border: 0,
    },
  }));
  const TABLE_HEAD = [
    { id: "name", label: "name", alignRight: false },
    { id: "createdBy", label: "group created by", alignRight: false },
    { id: "status", label: "group status", alignRight: false },
    { id: "groupMember", label: "group member", alignRight: false },
    { id: "groupAdmin", label: "group admin", alignRight: false },
    { id: "groupActive", label: "group active/inactive", alignRight: false },
    { id: "action", label: "action", alignRight: false },
  ];

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
    return order === "desc"
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
  async function getidChatGroupListData(page, filterName) {
    const response = await axiosPrivate.get(USER_API_URL.getChatGroup, {
      params: {
        type: "1",
        page: page + 1,
        search: filterName,
        limit: rowsPerPage,
      },
    });
    return response.data[0];
  }

  const {
    isLoading,
    data: chatGroupList,
    refetch,
  } = useQuery(
    ["chatGroupList", page, filterName],
    () => getidChatGroupListData(page, filterName),
    { keepPreviousData: true }
  );
  useEffect(() => {
    if (chatGroupList) {
      setTableData(chatGroupList?.data);
      setRowsPerPage(
        chatGroupList?.metadata.length != 0
          ? chatGroupList?.metadata[0].limit
          : 10
      );
    }
    if (
      chatGroupList?.metadata.length != 0 &&
      chatGroupList?.metadata[0].hasMoreData == true
    ) {
      getidChatGroupListData(page + 1);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [chatGroupList]);



  useEffect(() => {
    var arr = [];
    tableData.map((item) => {
      const member_name = item?.members.map(item => item.name).join(' , ');
      const group_admins = item?.admins.map(item => item.name).join(' , ');
      var obj = {
        "name": item?.name ? item.name : '-',
        "createdBy": item?.createdBy?.name || '-',
        "status": item.private === true ? "Private" : "Public",
        "groupMember": member_name ? member_name : '-',
        "groupAdmin": group_admins ? group_admins : '-',
        "groupActive": item.isActive ? "Active group" : 'Inactive group',
      }
      arr.push(obj);
    })
    setCsvData(arr)
  }, [tableData]);
  if (isLoading) return <LoadingScreen />;

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
    setFilterName(event.target.value.trim().replace("+", ""));
    getidChatGroupListData(0, filterName);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredUsers = applySortFilter(
    tableData,
    getComparator(order, orderBy)
  );

  const isUserNotFound = filteredUsers.length === 0;
  const handleOpenModal = (data) => {
    setGroupId(data);
    setOpenModal(true);
  };

  const handleGroupDeleteOpanModal = (data) => {
    setGroupId(data);
    setDeleteGroup(true);
  };

  const handleGroupDeleteCloseModal = () => {
    setDeleteGroup(false);
  };

  const handleGroupInfoOpanModal = (data) => {
    setGroupData(data);
    setEditGroupInfo(true);
  };

  const handleGroupInfoCloseModal = () => {
    setEditGroupInfo(false);
  };

  const handleViewGroupMemberOpenModal = (data) => {
    setGroupMembersData(data?.members);
    setGroupId(data?.groupId);
    setOpenGroupMemberModal(true);
  };

  const handleViewGroupAdminOpenModal = (data) => {
    setGroupAdminData(data);
    setOpenGroupAdminModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseViewGroupAdminModal = () => {
    setOpenGroupAdminModal(false);
  };

  const handleCloseViewGroupMemberModal = () => {
    setOpenGroupMemberModal(false);
  };

  const handleSearchMember = (e) => {
    setSerchDataGroupMember(e.target.value.trim());
  };
  const handleSearchAdmin = (e) => {
    setSerchDataGroupAdmin(e.target.value.trim());
  };

  const inactiveGroup = async () => {
    const response = await axiosPrivate.post(
      CHAT_API_URL.inactiveGroup.replace(":groupid", groupId)
    );
    if (response.status == 200) {
      enqueueSnackbar("change group status successfull", {
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
    handleCloseModal();
  };

  const deleteGroupAdmin = async () => {
    const response = await axiosPrivate.delete(
      CHAT_API_URL.deleteGroup.replace(":groupid", groupId)
    );
    if (response.status == 200) {
      enqueueSnackbar("group delete successfull", {
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
    handleGroupDeleteCloseModal();
  };

  const removeMemberOpenModal = (data) => {
    setMemberId(data);
    setRemoveMemberModal(true)
    setOpenGroupMemberModal(false);
  }

  const removeMemberCloseModal = (data) => {
    setRemoveMemberModal(false)
  }

  const exitMemberClick = async () => {
    const response = await axiosPrivate.delete(
      CHAT_API_URL.deleteGroupMembers.replace(":groupid", groupId).replace(":memberId", memberId)
    );
    if (response.status == 200) {
      enqueueSnackbar("group member exit successfull", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
      refetch();
      setOpenGroupMemberModal(false);
      setRemoveMemberModal(false)
    } else {
      enqueueSnackbar("please try again!", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
    }
  }


  // Export report 


  const headers = [
    // { label: "Id", key: "id" },
    { label: "name", key: "name" },
    { label: "createdBy", key: "createdBy" },
    { label: "status", key: "status" },
    { label: "groupMember", key: "groupMember" },
    { label: "groupAdmin", key: "groupAdmin" },
    { label: "groupActive", key: "groupActive" },
    // { label: "createdAt", key: "createdAt" }
  ];
  let csvReport = {
    data: CsvData,
    headers: headers,
    filename: 'beemz-chat-group.csv'
  };
  return (
    <>
      {loding ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="dashboard_header mb-4">
            {/* <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">Users</h4> */}
            <Paper className="dashboard_searchbox col-lg-4">
              <IconButton>
                <SearchIcon />
              </IconButton>
              <InputBase
                fullWidth
                sx={{ flex: 1 }}
                placeholder="search users..."
                onChange={(e) => handleFilterByName(e)}
              />
            </Paper>
            <Stack
              direction={"row"}
              className="d-flex align-items-center"
              spacing={2}
            >
              {/* export button */}
              {permissionsData?.group_chat_admin?.substring(4, 5) == "1"
                ?
                <AppTooltip title="export-chat-group" placement="bottom"><Button className="dashboard_light_bg_icon_btn" ><CSVLink {...csvReport}><FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200ee" }} /></CSVLink></Button></AppTooltip>
                : ''}

              <AppTooltip title="refresh" placement="bottom">
                <Button className="dashboard_light_bg_icon_btn">
                  <RefreshOutlinedIcon
                    style={{ fontSize: 18, color: "#6200ee" }}
                  />
                </Button>
              </AppTooltip>
            </Stack>
          </div>
          <Card>
            <TableContainer>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD}
                  rowCount={
                    chatGroupList?.metadata.length !== 0
                      ? chatGroupList?.metadata[0].total
                      : 0
                  }
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers.map((row, key) => {
                    return (
                      <StyledTableRow key={key}>
                        <TableCell component="th" scope="row">
                          {" "}
                          {row?.name ?? "-"}
                        </TableCell>
                        <TableCell align="left">
                          {" "}
                          {row?.createdBy?.name ?? "-"}
                        </TableCell>
                        <TableCell align="left">
                          {" "}
                          {row.private === true ? (
                            <Chip
                              label="private"
                              className="app_status_chip accepted"
                            />
                          ) : (
                            <Chip
                              label="public"
                              className="app_status_chip invalid"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            {permissionsData?.users?.substring(3, 4) == "1" && (
                              <Button
                                className="app_text_12_fw500 app_text_transform app_text_primary theme_button_light"
                                variant="contained"
                                onClick={() =>
                                  handleViewGroupMemberOpenModal({ groupId: row._id, members: row.members })
                                }
                              >
                                view group members
                              </Button>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            {permissionsData?.users?.substring(3, 4) == "1" ? (
                              <Button
                                className="app_text_12_fw500 app_text_transform app_text_primary theme_button_light"
                                variant="contained"
                                onClick={() =>
                                  handleViewGroupAdminOpenModal(row.admins)
                                }
                              >
                                view group admin
                              </Button>
                            ) : (
                              <></>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            {permissionsData?.users?.substring(3, 4) == "1" ? (
                              // <Switch />
                              <Button
                                className="app_text_12_fw500 app_text_transform app_text_primary theme_button_light"
                                variant="contained"
                                onClick={() => handleOpenModal(row._id)}
                              >
                                {row?.isActive
                                  ? "inactive group"
                                  : "active group"}
                              </Button>
                            ) : (
                              <></>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={3}>
                            {permissionsData?.users?.substring(3, 4) == "1" ? (
                              <AppTooltip
                                title="edit group info"
                                placement="bottom"
                              >
                                <Button
                                  sx={{ "&:hover": { bgcolor: "transparent" } }}
                                  variant="text"
                                  className="user_list_row_btn"
                                  onClick={() => handleGroupInfoOpanModal(row)}
                                >
                                  <EditPenIcon />
                                </Button>
                              </AppTooltip>
                            ) : (
                              ""
                            )}
                            {permissionsData?.users?.substring(2, 3) == "1" ? (
                              <AppTooltip
                                title="delete group"
                                placement="bottom"
                              >
                                <Button
                                  variant="text"
                                  className="user_list_row_btn"
                                  onClick={() =>
                                    handleGroupDeleteOpanModal(row._id)
                                  }
                                >
                                  <BinIcon />
                                </Button>
                              </AppTooltip>
                            ) : (
                              ""
                            )}
                          </Stack>
                        </TableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <span className="app_text_16_semibold">
                          no data found
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              rowsPerPageOptions={[10, 20, 50, 100]}
              count={
                chatGroupList?.metadata.length != 0
                  ? chatGroupList?.metadata[0].total
                  : 0
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>

          {/* active inactive group dialog */}
          <Dialog
            fullScreen={fullScreen}
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title" className="m-auto">
              <h4 className="app_text_20_semibold">
                are you sure status change this group!
              </h4>
            </DialogTitle>
            <DialogActions className="m-auto mb-2">
              <Button
                className="theme_button_view"
                variant="contained"
                autoFocus
                onClick={handleCloseModal}
              >
                cancel
              </Button>
              <Button
                className="theme_button"
                variant="contained"
                onClick={() => inactiveGroup()}
                autoFocus
              >
                yes
              </Button>
            </DialogActions>
          </Dialog>

          {/* View members dialog */}
          <Dialog
            fullScreen={fullScreen}
            open={openGroupMemberModal}
            onClose={handleCloseViewGroupMemberModal}
            className="request_popup_wrapper linked_list_popup"
          >
            <DialogTitle className="px-3 pt-0 d-flex justify-content-between">
              <span className="app_text_20_500 app_text_transform">
                group member
              </span>
              <IconButton
                aria-label="close"
                onClick={handleCloseViewGroupMemberModal}
                sx={{
                  position: "absolute",
                  right: 4,
                  top: 0,
                  height: "20px",
                  width: "20px",
                  p: 1,
                  color: (theme) => theme.palette.grey[500],
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <CloseIcon style={{ fontSize: 20 }} />
              </IconButton>
            </DialogTitle>
            <DialogContent className="px-0 pb-0">
              {groupMembersData && groupMembersData.length > 0 ? (
                <>
                  <Paper className="linking_popup_searchbox mx-3">
                    <IconButton style={{ marginTop: "-2px" }}>
                      <SearchIcon />
                    </IconButton>
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="search"
                      onChange={handleSearchMember}
                    />
                  </Paper>
                  <List className="linkList mt-3 mx-3" sx={{ pt: 0 }}>
                    {groupMembersData
                      .filter((member) =>
                        member?.name
                          .toLowerCase()
                          .includes(serchDataGroupMember.toLowerCase())
                      )
                      .map((member, index) => (
                        <ListItem key={index} className="">
                          <Box
                            display={"flex"}
                            alignItems="center"
                            flexGrow={1}
                          >
                            <ListItemAvatar className="linkList_avatar_container">
                              <UserAvatar
                                diameter={40}
                                alternateSrc={member?.name}
                                imgSrc={files(member?.image, "image")}
                              />
                            </ListItemAvatar>
                            <h4 className="app_text_14_500">{member?.name}</h4>
                          </Box>
                          <Box display={"flex"} flexWrap="nowrap" flexGrow={0}>
                            {/* <AppTooltip
                              title="delete member"
                              placement={"bottom"}
                            >
                              <Button
                                variant="contained"
                                className="user_list_card_btn ms-2"
                              >
                                <DeleteForeverIcon
                                  style={{ color: "6200EE", fontSize: "20px" }}
                                />
                              </Button>
                            </AppTooltip> */}
                            <AppTooltip
                              title="exit member"
                              placement={"bottom"}
                            >
                              <Button
                                variant="contained"
                                className="user_list_card_btn ms-2"
                                onClick={() => removeMemberOpenModal(member?._id)}
                              >
                                <PersonOffIcon
                                  style={{ color: "#6200EE", fontSize: "20px" }}
                                />
                              </Button>
                            </AppTooltip>
                          </Box>
                        </ListItem>
                      ))}
                  </List>
                </>
              ) : (
                <List className="linkList mt-3 mx-3" sx={{ pt: 0 }}>
                  <Box display={"flex"} alignItems="center" flexGrow={1}>
                    <span className="app_text_20_semibold app_text_transform">
                      no group members
                    </span>
                  </Box>
                </List>
              )}
            </DialogContent>
          </Dialog>

          {/* view group admin dialog */}
          <Dialog
            fullScreen={fullScreen}
            open={openGroupAdminModal}
            onClose={handleCloseViewGroupAdminModal}
            className="request_popup_wrapper linked_list_popup"
          >
            <DialogTitle className="px-3 pt-0 d-flex justify-content-between">
              <span className="app_text_20_500 app_text_transform">
                group admin
              </span>
              <IconButton
                aria-label="close"
                onClick={handleCloseViewGroupAdminModal}
                sx={{
                  position: "absolute",
                  right: 4,
                  top: 0,
                  height: "20px",
                  width: "20px",
                  p: 1,
                  color: (theme) => theme.palette.grey[500],
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <CloseIcon style={{ fontSize: 20 }} />
              </IconButton>
            </DialogTitle>
            <DialogContent className="px-0 pb-0">
              {groupAdminData && groupAdminData.length > 0 ? (
                <>
                  <Paper className="linking_popup_searchbox mx-3">
                    <IconButton style={{ marginTop: "-2px" }}>
                      <SearchIcon />
                    </IconButton>
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="search"
                      onChange={handleSearchAdmin}
                    />
                  </Paper>
                  <List className="linkList mt-3 mx-3" sx={{ pt: 0 }}>
                    {groupAdminData
                      .filter((admin) =>
                        admin?.name
                          .toLowerCase()
                          .includes(serchDataGroupAdmin.toLowerCase())
                      )
                      .map((admin, index) => (
                        <ListItem key={index} className="">
                          <Box
                            display={"flex"}
                            alignItems="center"
                            flexGrow={1}
                          >
                            <ListItemAvatar className="linkList_avatar_container">
                              <UserAvatar
                                diameter={40}
                                alternateSrc={admin?.name}
                                imgSrc={files(admin?.image, "image")}
                              />
                            </ListItemAvatar>
                            <h4 className="app_text_14_500">{admin?.name}</h4>
                          </Box>
                        </ListItem>
                      ))}
                  </List>
                </>
              ) : (
                <List className="linkList mt-3 mx-3" sx={{ pt: 0 }}>
                  <Box display={"flex"} alignItems="center" flexGrow={1}>
                    <span className="app_text_20_semibold app_text_transform">
                      no group admin
                    </span>
                  </Box>
                </List>
              )}
            </DialogContent>
          </Dialog>

          {/* delete group dialog */}
          <Dialog
            fullScreen={fullScreen}
            open={deleteGroup}
            onClose={handleGroupDeleteCloseModal}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title" className="m-auto">
              <h4 className="app_text_20_semibold">
                are you sure delete this group!
              </h4>
            </DialogTitle>
            <DialogActions className="m-auto mb-2">
              <Button
                className="theme_button_view"
                variant="contained"
                autoFocus
                onClick={handleGroupDeleteCloseModal}
              >
                cancel
              </Button>
              <Button
                className="theme_button"
                variant="contained"
                onClick={() => deleteGroupAdmin()}
                autoFocus
              >
                yes
              </Button>
            </DialogActions>
          </Dialog>

          {/* group edit information dialog */}
          <ChatConfigPopup
            open={editGroupInfo}
            onClose={handleGroupInfoCloseModal}
            groupData={groupData}
          />

          {/* remove member group dialog */}
          <Dialog
            fullScreen={fullScreen}
            open={removeMemberModal}
            onClose={removeMemberCloseModal}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title" className="m-auto">
              <h4 className="app_text_20_semibold">
                are you sure exit member this group!
              </h4>
            </DialogTitle>
            <DialogActions className="m-auto mb-2">
              <Button
                className="theme_button_view"
                variant="contained"
                autoFocus
                onClick={removeMemberCloseModal}
              >
                cancel
              </Button>
              <Button
                className="theme_button"
                variant="contained"
                onClick={() => exitMemberClick()}
                autoFocus
              >
                yes
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
}
