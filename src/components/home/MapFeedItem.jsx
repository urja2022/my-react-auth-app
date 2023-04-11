import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardActions, CardContent, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material";
import ScrollContainer from "react-indiana-drag-scroll";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import files, { helperMessageArray } from "src/helpers/helpers";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import LinkingPopup from "../user/LinkingPopup";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { useMutation, useQueryClient } from "react-query";
import { BUSINESS_API_URL, USER_API_URL } from "src/api/axios";
import useStore, { authStore } from "src/contexts/AuthProvider";
import { UserRole } from "src/utils/enum";
import UserAvatarWithNameIdTrust from "../common/UserAvatarWithNameIdTrust";
import LocationPinCircleBase from "src/svgComponents/LocationPinCircleBase";
import EditPencilCircle from "src/svgComponents/EditPencilCircle";
import BeemzUserIcon from "src/svgComponents/BeemzUserIcon";
import ChatFilled from "src/svgComponents/ChatFilled";
import BeemzLocationIcon from "src/svgComponents/BeemzLocationIcon";
import AppTooltip from "../common/AppTooltip";
import ChatIcon from "@mui/icons-material/Chat";
import CreateIcon from "@mui/icons-material/Create";
import UserAvatar from "../common/UserAvatar";
import _ from "lodash";
import { useSnackbar } from "notistack";
import MapIcon from '@mui/icons-material/Map';
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import EmployeePopup from "../user/EmployeePopup";
import UserColoredIcon from "src/svgComponents/UserColoredIcon";
import UserPlusColoredIcon from "src/svgComponents/UserPlusColoredIcon";
import MapEditIcon from "src/svgComponents/MapEditIcon";
import DirectionsIcon from "@mui/icons-material/Directions";
import TodayIcon from '@mui/icons-material/Today';
import moment from "moment";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const MapFeedItem = ({ feedData, onFeedSelect, selectedFeed, handleDirection, profileId }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [feedItemColor, setFeedItemColor] = useState("");
  const [openLinkPopup, setOpenLinkPopup] = useState(false);
  const [requestId, setRequestId] = useState();
  const role = authStore((state) => state.role);
  const setIsGuestContinue = authStore((state) => state.setIsGuestContinue);
  const [helpPopupOpen, setHelpPopupOpen] = useState(false);
  const [googlePhoto, setGooglePhoto] = useState("");
  const permissionsData = useStore((state) => state.permissions);
  const [openEmployeePopup, setOpenEmployeePopup] = useState(false);
  const [BusinessId, setBusinessId] = useState();
  const [isLightBg, setIsLightBg] = useState(false);

  const handleClickLinkPopupOpen = (dataId) => {
    setOpenLinkPopup(true);
    setRequestId(dataId);
  };

  const handleLinkPopupClose = (value) => {
    setOpenLinkPopup(false);
  };



  const FriendButton = ({ userId, status }) => {
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const { mutateAsync: friendRequest } = useMutation(
      async (data) => {
        return await axiosPrivate.post(USER_API_URL.friendRequest + data);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["userLocation"]);
        },
      }
    );

    const { mutateAsync: friendRequestBusiness } = useMutation(
      async (data) => {
        return await axiosPrivate.post(BUSINESS_API_URL.friendRequestBusiness + data);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["userLocation"]);
        },
      }
    );

    const addFriend = async (data) => {
      if (data.business) {
        friendRequestBusiness(data.reqID);
      } else {
        await friendRequest(data.reqID);
      }
    };
    switch (status) {
      case 2:
      case 1:
        return (
          <AppTooltip title={"pending request"} placement={"bottom"}>
            <Button variant="contained" disabled={role === UserRole.GUEST ? true : false} className={`${feedItemColor} map_sidebar_card_btn`}>
              <WatchLaterIcon style={{ color: "#4a4c4e", fontSize: "18px" }} />
            </Button>
          </AppTooltip>
        );

      case 4:
      case 0:
        return (
          <AppTooltip title={"add friend"} placement={"bottom"}>
            <Button variant="contained" disabled={role === UserRole.GUEST ? true : false} onClick={() => addFriend({ business: feedData.isBusiness, reqID: feedData.id || feedData.userId })} className={`${feedItemColor} map_sidebar_card_btn`}>
              <PersonAddAltRoundedIcon style={{ color: "#4a4c4e", fontSize: "18px" }} />
            </Button>
          </AppTooltip>
        );

      case 3:
        return (
          <AppTooltip title={"friend"} placement={"bottom"}>
            <Button variant="contained" disabled={role === UserRole.GUEST ? true : false} className={`${feedItemColor} map_sidebar_card_btn`}>
              <HowToRegIcon style={{ color: "#4a4c4e", fontSize: "18px" }} />
            </Button>
          </AppTooltip>
        );
      default:
        return "";
    }
  };

  const handleLinkClick = (ev) => {
    if (role === UserRole.GUEST) {
      setIsGuestContinue(true);
      ev.preventDefault();
      return false;
    }
  };

  useEffect(() => {
    if (feedItemColor !== "person" && feedItemColor !== "business_employee" && feedItemColor !== "user_employee" && feedItemColor !== "user_map") {
      setIsLightBg(true);
    } else {
      setIsLightBg(false);
    }
  }, [feedItemColor]);

  const MemberProfileList = ({ members, admins }) => {
    return (
      <Box display={"flex"} flexDirection="column" sx={{ marginTop: 2 }}>
        <span className={`app_text_14_500 my-1 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>chat members</span>
        <ScrollContainer horizontal hideScrollbars={false} style={{ display: "flex", cursor: "grab" }}>
          {admins.length
            ? admins.map((m) => (
              <Box sx={{ width: "80px", p: 1, m: 1, boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }} className="d-flex flex-column align-items-center">
                <UserAvatar diameter={36} alternateSrc={m.name.charAt(0)} imgSrc={files(m.image, "image")} />
                <Box display={"flex"} flexDirection="column" marginTop={1}>
                  <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>{m.name}</span>
                  <span className="app_text_12_fw500 app_text_primary">(admin)</span>
                  {m._id === profileId && <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>(you)</span>}
                </Box>
              </Box>
            ))
            : null}
          {members.length
            ? members.map((m) => (
              <Box className="d-flex flex-column align-items-center" sx={{ width: "80px", p: 1, m: 1, boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                <UserAvatar diameter={36} alternateSrc={m.name.charAt(0)} imgSrc={files(m.image, "image")} />
                <Box display={"flex"} flexDirection="column" marginTop={1}>
                  <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>{m.name}</span>
                  {m._id === profileId && <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>(you)</span>}
                </Box>
              </Box>
            ))
            : null}
        </ScrollContainer>
      </Box>
    );
  };

  useEffect(() => {
    if (feedData?.isBusiness) {
      setFeedItemColor("business");
    } else if (!_.isEmpty(feedData?.employee)) {
      setFeedItemColor("employee");
    } else if (feedData?.isGroup) {
      setFeedItemColor("group");
    } else if (feedData?.location?.type === "geo") {
      setFeedItemColor("google");
    } else if ((!_.isEmpty(feedData?.eventAddress))) {
      setFeedItemColor("event");
    }
    else {
      setFeedItemColor("person");
    }
  }, [feedData]);

  const handleRequestUserEdit = () => {
    navigate(PATH_DASHBOARD.general.userEdit, { state: { User_id: feedData?.userId } });
  };

  const handleRequestBusinessEdit = () => {
    navigate(PATH_DASHBOARD.general.businessUpdate, { state: { businessId: feedData?.id } });
  };

  const handleClickEmployeePopupOpen = (dataId) => {
    setOpenEmployeePopup(true);
    setBusinessId(dataId);
  };

  const handleEmployeePopupClose = (value) => {
    setOpenEmployeePopup(false);
    setBusinessId(false);
  };
  return (
    <ListItem className="map_feed_listItem">
      <Card className={`${feedItemColor} app_card`}>
        <CardContent className="pb-2">
          <UserAvatarWithNameIdTrust
            imgSrc={files(feedData.profilePic ?? feedData.image ?? feedData?.eventImage?.[0], "image")}
            avatarSize={60}
            userFullName={feedData?.fullName || feedData?.name || feedData?.title}
            userId={feedData?.name}
            description={feedData?.description}
            trustRating={feedData?.averageTrust}
            isLightBg={isLightBg}
          />
          <List className="mt-3" dense>

            {feedData?.category?.name && (
              <ListItem className="px-0">
                <ListItemIcon className="list_item_icon_modify me-2">
                  <HomeWorkIcon style={{ fontSize: 16 }} />
                </ListItemIcon>
                <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>{`${feedData?.category?.name}`}</span>
              </ListItem>
            )}

            {feedData?.isGroup && (

              <>
                <ListItem className="px-0">
                  <ListItemIcon className="list_item_icon_modify me-2">
                    <ChatIcon style={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>group chat</span>
                </ListItem>
                <ListItem className="px-0">
                  <ListItemIcon className="list_item_icon_modify me-2">
                    <CreateIcon style={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>created By {feedData.createdBy?.name}</span>
                </ListItem>
              </>
            )}
            {feedData?.address ?

              <ListItem className="px-0">
                <ListItemIcon className="list_item_icon_modify me-2">
                  <LocationPinCircleBase w={16} h={16} />
                </ListItemIcon>
                <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>{feedData?.address}</span>
              </ListItem>
              : <></>}

            {feedData?.event_id ?

              <ListItem className="px-0">
                <ListItemIcon className="list_item_icon_modify me-2">
                  <LocationPinCircleBase w={16} h={16} />
                </ListItemIcon>
                <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>{feedData?.eventAdress?.physicalAddress || '-'}</span>
              </ListItem>
              : <></>}
            {feedData?.event_id ?

              <ListItem className="px-0">
                <ListItemIcon className="list_item_icon_modify me-2">
                  <EditPencilCircle w={14} h={14} />
                </ListItemIcon>
                <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>
                  {moment(feedData?.eventStartDate).format("MMM DD YYYY")
                    + '-' + feedData?.startTime || '-'}</span>
              </ListItem>
              : <></>}
            {feedData?.event_id ?
              <ListItem className="px-0">
                <ListItemIcon className="list_item_icon_modify me-2">
                  <EditPencilCircle w={14} h={14} />
                </ListItemIcon>
                <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>{moment(feedData?.createsOn).format("MMM DD YYYY")
                  || '-'}</span>
              </ListItem>
              : <></>}
            {feedData?.event_id ?
              <ListItem className="px-0">
                <ListItemIcon className="list_item_icon_modify me-2">
                  <AccessTimeIcon w={5} h={5} />
                </ListItemIcon>
                <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>{feedData?.duration ?? '-'}</span>
              </ListItem>
              : <></>}

            {feedData?.location?.coordinates[0] ?
              <ListItem className="px-0">
                <ListItemIcon className="list_item_icon_modify me-2">
                  <MapIcon style={{ fontSize: 16 }} />
                </ListItemIcon>
                <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>{`${parseInt(feedData?.location?.coordinates[1])}.${String(feedData?.location?.coordinates[1]).split(".")[1].substring(0, 5)}`} , {`${parseInt(feedData?.location?.coordinates[0])}.${String(feedData?.location?.coordinates[0]).split(".")[1].substring(0, 5)}`}</span>
              </ListItem>
              : <></>}

            {feedData?.isGroup && <MemberProfileList members={feedData?.members} admins={feedData?.admins} />}

            {!_.isEmpty(feedData?.phone_data) && (
              <ListItem className="px-0">
                <ListItemIcon className="list_item_icon_modify me-2">
                  <PhoneInTalkIcon style={{ fontSize: 16 }} />
                </ListItemIcon>
                <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>{`${feedData.phone_data}`}</span>
              </ListItem>
            )}

            {feedData.userStatus && (
              <ListItem className="px-0">
                <ListItemIcon className="list_item_icon_modify me-2">
                  <EditPencilCircle w={14} h={14} />
                </ListItemIcon>
                <span className={`app_text_12_fw500 ${isLightBg ? "app_text_black" : "app_text_gray"}`}>{feedData.userStatus}</span>
              </ListItem>
            )}
          </List>
        </CardContent>
        <CardActions className="pt-1 pb-3 px-3">
          {(!feedData?.isGroup && !feedData?.event_id) && (
            <Stack direction={"row"} spacing={2}>
              {permissionsData?.users?.substring(3, 4) == "1" ? (
                <AppTooltip title={"edit"} placement={"bottom"}>
                  <Button className={`${feedItemColor} map_sidebar_card_btn`} variant="contained" onClick={feedData?.isBusiness ? () => handleRequestBusinessEdit() : () => handleRequestUserEdit()}>
                    <MapEditIcon />
                  </Button>
                </AppTooltip>
              ) : (
                <></>
              )}
              <AppTooltip title={"linked list"} placement={"bottom"}>
                <Button className={`${feedItemColor} map_sidebar_card_btn`} onClick={() => handleClickLinkPopupOpen(feedData.id || feedData.userId)} variant="contained">
                  <UserColoredIcon />
                </Button>
              </AppTooltip>
              {feedData.isBusiness ? (
                <AppTooltip title={"employee"} placement={"bottom"}>
                  <Button className={`${feedItemColor} map_sidebar_card_btn`} onClick={() => handleClickEmployeePopupOpen(feedData?.id)} variant="contained">
                    <UserPlusColoredIcon />
                  </Button>
                </AppTooltip>
              ) : (
                <></>
              )}

            </Stack>
          )}
        </CardActions>
      </Card>

      <LinkingPopup newLinkId={requestId} open={openLinkPopup} onClose={handleLinkPopupClose} />
      <EmployeePopup newBusinessId={BusinessId} open={openEmployeePopup} onClose={handleEmployeePopupClose} />
    </ListItem>
  );
};

export default MapFeedItem;
