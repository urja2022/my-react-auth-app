import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import UserAvatar from "../common/UserAvatar";
import TrackRequestListItem from "./TrackRequestListItem";
import TrackHistoryListItem from "./TrackHistoryListItem";
import { useMutation, useQuery } from "react-query";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { USER_API_URL } from "src/api/axios";
import { useSnackbar } from "notistack";
import moment from "moment";
import SearchIcon from "src/svgComponents/SearchIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkedListItem from "./LinkedListItem";
import useStore, { authStore } from "src/contexts/AuthProvider";
import { UserRole } from "src/utils/enum";
// import { SocketContext } from "src/contexts/socketProvide";
import { useContext } from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: "16px", py: "16px" }}>{children}</Box>}
    </div>
  );
}

const TrackRequest = ({
  handleTrackBack,
  traceRequestData,
  userLinkListData,
  traceHistoryData,
  handleDirection,
  userTracing,
  handleSearchUserData,
  traceRequestList,
  traceHistoryList,
  userRefechLinkListData,
  userProfileData,
  handleTraceRequest,
  handleUserLiveLocation,
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const storeData = useStore();
  const axiosPrivate = useAxiosPrivate();
  const role = authStore((state) => state.role);
  const { enqueueSnackbar } = useSnackbar();
  const [traceId, setTraceId] = useState();
  const [activePart, setActivePart] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [linkListSearchText, setLinkListSearchText] = useState("");
  const [anchorElForSearchMenu, setAnchorElForSearchMenu] =
    React.useState(null);
  const [selectedIndexForSearchMenu, setSelectedIndexForSearchMenu] =
    React.useState(0);
  const openSearchByMenu = Boolean(anchorElForSearchMenu);
  // const { chatClient: socket } = useContext(SocketContext);

  const handleClickListItem = (event) => {
    setAnchorElForSearchMenu(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndexForSearchMenu(index);
    setAnchorElForSearchMenu(null);
  };

  const handleClose = () => {
    setAnchorElForSearchMenu(null);
  };

  const handleTabOnChange = (event, newValue) => setActiveTab(newValue);

  const sidebarContentBoxRef2 = useRef(null);

  useEffect(() => {
    sidebarContentBoxRef2.current.addEventListener("scroll", () => {
      if (sidebarContentBoxRef2.current.scrollTop > 10) {
        sidebarContentBoxRef2.current.classList.add("scrolling");
      } else {
        sidebarContentBoxRef2.current.classList.remove("scrolling");
      }
    });
  });

  const { mutateAsync } = useMutation(
    async (data) => {
      if (traceId)
        return await axiosPrivate.put(
          USER_API_URL.traceApprove + traceId,
          JSON.stringify(data)
        );
    },
    {
      onSuccess: ({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        traceRequestList();
      },
      onError: (error) =>
        enqueueSnackbar("Something went wrong!", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        }),
    }
  );

  const { data: searchUserData, refetch: searchUserList } = useQuery(
    "userList",
    async ({ signal }) => {
      if (searchText) {
        if (selectedIndexForSearchMenu === 0) {
          let param = "";
          if (role === UserRole.USER) {
            param = `?search=${searchText}&skipId=${userProfileData._id}&lat=${userProfileData?.address?.location?.coordinates[1]}&long=${userProfileData?.address?.location?.coordinates[0]}`;
          } else if (role === UserRole.BUSINESS) {
            param = `?search=${searchText}&skipId=${userProfileData.businessId}&lat=${userProfileData?.address?.location?.coordinates[1]}&long=${userProfileData?.address?.location?.coordinates[0]}`;
          }
          return await axiosPrivate
            .get(USER_API_URL.serchListOfUser + param)
            .then((res) => res.data);
        } else {
          let param = "";
          if (role === UserRole.USER) {
            param = `?search=${searchText}&skipId=${userProfileData._id}`;
          } else if (role === UserRole.BUSINESS) {
            param = `?search=${searchText}&skipId=${userProfileData.businessId}`;
          }
          return await axiosPrivate
            .get(USER_API_URL.searchUserList + param)
            .then((res) => res.data);
        }
      }
    },
    { refetchOnWindowFocus: false }
  );

  const handleAcceptRequest = (trace_id) => {
    setTraceId(trace_id);
    const data = { status: 1 };
    setTimeout(async () => {
      await mutateAsync(data);
    }, 1000);
  };

  const handleRejectRequest = (trace_id) => {
    setTraceId(trace_id);
    const data = { status: 2 };
    setTimeout(async () => {
      await mutateAsync(data);
    }, 1000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchUserList();
    if (searchText.length > 0) setActivePart(1);
    else setActivePart(0);
    setSearchText("");
  };

  const handleSentRequest = (user, from) => {
    let obj = {};
    if (from === "link_list") {
      if (user.id) {
        userTracing(user.id);
      }
    } else if (from === "trace_history") {
      if (user.userId) {
        userTracing(user.userId);
      }
      obj = {
        location: user.location,
        createdAt: user.createdAt,
        fullName: user.fullName,
        userId: user.userId,
      };
      handleSearchUserData(obj);
    }
  };

  const handleLiveLocation = (item) => {
    let userId = userProfileData?._id ?? userProfileData?.userId;
    let jsonData = { to: userId, from: item.userId };
    // socket.emit("requestLocation", jsonData);// TODO::
    handleUserLiveLocation(item);
  };

  const handleActivePart = (part) => {
    if (part === "trace_history") {
      traceHistoryList();
      setActivePart(0);
    } else if (part === "trace_request") {
      traceRequestList();
      setActivePart(1);
    } else if (part === "link_list") {
      userRefechLinkListData();
      setActivePart(2);
    }
  };

  const { mutateAsync: deleteTrace } = useMutation(
    async (data) => {
      return await axiosPrivate.delete(USER_API_URL.traceDelete + data);
    },
    {
      onSuccess: ({ data }) => {
        enqueueSnackbar(data.message, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        });
        traceHistoryList();
        userRefechLinkListData();
      },
      onError: (error) =>
        enqueueSnackbar("Something went wrong!", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 2000,
        }),
    }
  );

  const handleDeleteRequest = (id) => {
    deleteTrace(id);
  };

  return (
    <Box className="map_side_box">
      <div className="p-3">
        <Button
          onClick={() => handleTrackBack()}
          sx={{ minWidth: "unset" }}
          className="app_blank_btn p-0"
        >
          <ArrowBackIcon style={{ color: "#2D3748" }} />
        </Button>
      </div>
      <div className="map_side_box_header">
        <h4 className="app_text_20_bold app_text_black">Track/Trace</h4>
        <p className="app_text_14 app_text_black">
          {"Your track and trace requests & history"}
        </p>
        <Box className="tab_rounded_box">
          <Tabs
            sx={{ width: "100%" }}
            value={activeTab}
            onChange={handleTabOnChange}
          >
            <Tab
              className="app_text_14_semibold text-capitalize app_text_black"
              disableRipple
              sx={{ flex: 1 }}
              label="Track History"
              onClick={() => handleActivePart("trace_history")}
            />
            <Tab
              className="app_text_14_semibold text-capitalize app_text_black"
              disableRipple
              sx={{ flex: 1 }}
              label="Track Requests"
              onClick={() => handleActivePart("trace_request")}
            />
            <Tab
              className="app_text_14_semibold text-capitalize app_text_black"
              disableRipple
              sx={{ flex: 1 }}
              label="Link List"
              onClick={() => handleActivePart("link_list")}
            />
          </Tabs>
        </Box>
      </div>
      <div ref={sidebarContentBoxRef2} className="map_sidebox_container">
        <TabPanel value={activeTab} index={0}>
          <div className="map_side_box_content">
            <List className="track_req_list">
              <Paper
                sx={{ display: "flex", alignItems: "center" }}
                component="form"
                className="linking_popup_searchbox searchbox_with_searchby mb-2"
                onSubmit={(e) => handleSearch(e)}
              >
                <IconButton type="submit" style={{ marginTop: "-2px" }}>
                  <SearchIcon />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search track history"
                  onChange={(e) => setSearchText(e.target.value.trim())}
                />
                <Divider
                  sx={{ height: 50, borderColor: "ActiveBorder" }}
                  orientation="vertical"
                />
                <div>
                  <List
                    disablePadding
                    component="nav"
                    sx={{ bgcolor: "background.paper", width: 100 }}
                  >
                    <ListItem
                      disableRipple
                      button
                      id="lock-button"
                      aria-haspopup="listbox"
                      aria-controls="lock-menu"
                      aria-label="when device is locked"
                      aria-expanded={openSearchByMenu ? "true" : undefined}
                      onClick={handleClickListItem}
                      secondaryAction={
                        <IconButton
                          disableRipple
                          sx={{
                            minHeight: "unset",
                            minWidth: "unset",
                            p: 0,
                            pb: 0.2,
                            marginRight: "-10px",
                          }}
                        >
                          <ExpandMoreIcon
                            style={{
                              transform: openSearchByMenu
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "all 0.1s ease-in-out",
                            }}
                          />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={searchMenuOptions[selectedIndexForSearchMenu]}
                      />
                    </ListItem>
                  </List>
                  <Menu
                    id="lock-menu"
                    anchorEl={anchorElForSearchMenu}
                    open={openSearchByMenu}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "lock-button",
                      role: "listbox",
                    }}
                  >
                    {searchMenuOptions.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndexForSearchMenu}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              </Paper>
              {traceHistoryData &&
                traceHistoryData.length > 0 &&
                activePart === 0 &&
                traceHistoryData.map((item, i) => {
                  let date = moment(item.createdAt).format("DD MMMM YYYY");
                  return (
                    <TrackHistoryListItem
                      key={i}
                      userImg={item.image}
                      userFullname={item.fullName}
                      requestFor={item.userName}
                      historyDate={date}
                      reqStatus={item.status == 0 ? false : true}
                      handleDirection={() =>
                        handleDirection(item, "location_log")
                      }
                      handleLiveLocation={() => handleLiveLocation(item)}
                      handleDeleteRequest={() => handleDeleteRequest(item._id)}
                      handleDirectDirection={() => handleDirection(item)}
                    />
                  );
                })}
              {searchUserData &&
                searchUserData.length > 0 &&
                activePart === 1 &&
                searchUserData.map((item, i) => {
                  var reqStatus = "sent";
                  traceHistoryData.filter((obj) => {
                    if (obj.fullName === item.fullName) {
                      reqStatus = obj.status === 0 ? false : true;
                    }
                  });
                  return (
                    <TrackHistoryListItem
                      key={i}
                      userImg={item.image}
                      userFullname={item.fullName}
                      requestFor={item.userName ?? ""}
                      historyDate={""}
                      reqStatus={reqStatus}
                      handleDirection={() =>
                        handleSentRequest(item, "trace_history")
                      }
                    />
                  );
                })}
            </List>
          </div>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <div className="map_side_box_content">
            <List className="track_req_list">
              {traceRequestData &&
                traceRequestData.length > 0 &&
                traceRequestData.map((item, i) => {
                  return (
                    <TrackRequestListItem
                      key={i}
                      userImg={item.image}
                      userFullname={item.fullName}
                      requestFor={item.userName}
                      onAccept={() => handleAcceptRequest(item._id)}
                      onReject={() => handleRejectRequest(item._id)}
                      status={item.status}
                    />
                  );
                })}
            </List>
          </div>
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <div className="map_side_box_content">
            <List className="link_list">
              <Paper
                sx={{ display: "flex", alignItems: "center" }}
                component="form"
                className="linking_popup_searchbox searchbox_with_searchby mb-2"
                onSubmit={(e) => handleSearch(e)}
              >
                <IconButton type="submit" style={{ marginTop: "-2px" }}>
                  <SearchIcon />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search track history"
                  onChange={(e) => setLinkListSearchText(e.target.value.trim())}
                />
                <Divider
                  sx={{ height: 50, borderColor: "ActiveBorder" }}
                  orientation="vertical"
                />
              </Paper>
              {userLinkListData &&
                userLinkListData.length > 0 &&
                activePart == 2 &&
                userLinkListData
                  .filter((user) =>
                    user?.name
                      ?.toLowerCase()
                      .includes(linkListSearchText.toLowerCase())
                  )
                  .map((user, i) => {
                    var reqStatus = "sent";
                    let trace = {};

                    traceHistoryData &&
                      traceHistoryData.length > 0 &&
                      traceHistoryData.filter((obj) => {
                        if (obj.fullName === user.name) {
                          reqStatus = obj.status === 0 ? false : true;
                          trace = obj;
                        }
                      });
                    return (
                      <LinkedListItem
                        key={i}
                        srno={i}
                        requestId={user.requestId}
                        userId={user.id}
                        name={user.name}
                        businessName={user.businessName}
                        userName={user.userName}
                        userPic={user.image}
                        mobile={user.mobile}
                        permissions={user.permissions}
                        friendStatus={user.friendStatus}
                        contact={user.contact}
                        address={user.address}
                        businessId={user.businessId}
                        handleSentRequest={() =>
                          handleSentRequest(user, "link_list")
                        }
                        handleDirection={() =>
                          handleDirection(trace, "location_log")
                        }
                        handleLiveLocation={() => handleLiveLocation(trace)}
                        reqStatus={reqStatus}
                        handleDeleteRequest={() =>
                          handleDeleteRequest(trace._id)
                        }
                      />
                    );
                  })}
            </List>
          </div>
        </TabPanel>
      </div>
    </Box>
  );
};

export default TrackRequest;

const searchMenuOptions = ["name", "email", "mobile"];
