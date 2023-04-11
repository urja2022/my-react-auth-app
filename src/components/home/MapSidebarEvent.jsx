import React, { useEffect, useRef, useState } from "react";
import {
  Backdrop,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  List,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AppTooltip from "../common/AppTooltip";
import EventFeedItem from "./EventFeedItem";
import { Close } from "@mui/icons-material";
import EventFilterPopup from "../user/EventFilterPopup";
import MapEventDetailSidebar from "./MapEventDetailSidebar";

const MapSidebarEvent = ({ closeFunc,userEventAllData }) => {
  const [showDashboardSidebar, setShowDashboardSidebar] = useState(false);
  const [eventFilterPopup, setEventFilterPopup] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [eventDataId, setEventDataId] = useState("");
  const sidebarContentBoxRef = useRef(null);
  const sidebarHeaderRef = useRef(null);

  const openDashboardOnClick = () => {
    setShowDashboardSidebar(true);
  };
  const closeDashboardOnClick = () => {
    setShowDashboardSidebar(false);
  };
  const eventFilterPopupClose = () => {
    setEventFilterPopup(false);
  }

  const handleEventDetailOnEventFeedClick = (eventId) => {
    setEventDataId(eventId);
    setShowEventDetail(true);
  }
  const handleEventDetailOnCloseClick = () => {
    setShowEventDetail(false);
  }
  //   Event scrolling style functionality
  useEffect(() => {
    const scrollEvent = () => {
      if (sidebarContentBoxRef.current.scrollTop > 10) {
        sidebarContentBoxRef.current.classList.add("scrolling");
        sidebarHeaderRef.current.classList.add("shadow");
      } else {
        sidebarContentBoxRef.current.classList.remove("scrolling");
        sidebarHeaderRef.current.classList.remove("shadow");
      }
    };
    const scrollConst = sidebarContentBoxRef?.current;
    scrollConst.addEventListener("scroll", scrollEvent);
    return () => {
      scrollConst.removeEventListener("scroll", scrollEvent);
    };
  }, []);

  return (
    <>
      <div className="sidebar_event_wrapper">
        <Box ref={sidebarHeaderRef} className="sidebar_event_header">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "2px 4px",
              width: "356px",
              backgroundColor: "#fff",
            }}
          >
            <div className="d-flex align-items-center">
              <AppTooltip title={"menu"} placement={"bottom"}>
                <IconButton
                  onClick={() => openDashboardOnClick()}
                  sx={{ p: 0, "&:hover": { background: "transperent" } }}
                  aria-label="menu"
                >
                  <MenuIcon />
                </IconButton>
              </AppTooltip>
              <h4 className="app_text_16_semibold app_text_black ms-3">event</h4>
            </div>
            <AppTooltip title={"close event"} placement={"bottom"}>
              <Button onClick={() => closeFunc()} sx={{ minWidth: "unset", p: 0, marginTop: "-8px" }}>
                <Close style={{ fontSize: 18, color: "#2d3748" }} />
              </Button>
            </AppTooltip>
          </Box>
          <Box className="mt-2">
            <Paper
              component="form"
              className="map_search_box_event"
              onSubmit={(e) => { }}
            >
              <AppTooltip title={"search"} placement={"bottom"}>
                <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </AppTooltip>
              <InputBase
                sx={{
                  ml: 1,
                  flex: 1,
                  fontFamily: "Google Sans",
                  lineHeight: 1,
                }}
                placeholder="explore events"
                inputProps={{ "aria-label": "explore events" }}
                onChange={(e) => { }}
              />
              <Divider
                sx={{ height: 28, m: 0.5, borderColor: "#000" }}
                orientation="vertical"
              />
              <AppTooltip title={"filter"} placement={"bottom"}>
                <IconButton
                  onClick={() => setEventFilterPopup(true)}
                  sx={{ p: "10px" }}
                  aria-label="directions"
                >
                  <Badge
                    color="error"
                    variant="dot"
                    overlap="circular"
                    invisible={false}
                  >
                    <FilterAltOutlinedIcon />
                  </Badge>
                </IconButton>
              </AppTooltip>
            </Paper>
          </Box>
        </Box>
          <Box ref={sidebarContentBoxRef} className="sidebar_event_content">
            {userEventAllData && userEventAllData?.length > 0 ? 
              <>
                {userEventAllData?.map((event,index) => (
                  <List disablePadding className="event_feed_list">
                    <EventFeedItem onClickFunc={handleEventDetailOnEventFeedClick} eventData={event}/>
                  </List>
                ))}
              </>
            :
              <h4 className="app_text_16_semibold app_text_black ms-3">there are no event in this area.</h4>
            }
          </Box>

        {showDashboardSidebar && (
          <Backdrop
            open={showDashboardSidebar}
            className="dashboard_sidebar_backdrop"
            onClick={() => setShowDashboardSidebar(false)}
          ></Backdrop>
        )}
        {showEventDetail && <MapEventDetailSidebar eventDataId={eventDataId} onCloseFunc={handleEventDetailOnCloseClick} />}
      </div>
      <EventFilterPopup open={eventFilterPopup} onClose={eventFilterPopupClose} />
    </>
  );
};

export default MapSidebarEvent;
