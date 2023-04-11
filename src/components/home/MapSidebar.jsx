import React, { useRef, useState } from "react";
import { Backdrop, Box, Button, List } from "@mui/material";
import MapSearchbar from "./MapSearchbar";
import { useEffect } from "react";
import MapFeedItem from "./MapFeedItem";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import AppTooltip from "../common/AppTooltip";
import { useQueryClient } from "react-query";
import { authStore } from "src/contexts/AuthProvider";

const MapSidebar = ({
  handleDirection,
  userLocationData,
  handleSearchUser,
  handleFiltering,
  userLocation,
  handleResetFiltering,
  filteredData,
}) => {
  const [selectedFeed, setSelectedFeed] = useState();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDashboardSidebar, setShowDashboardSidebar] = useState(false);
  const [activeFiltering, setActiveFiltering] = useState("");
  const sidebarContentBoxRef = useRef(null);
  const sidebarHeaderRef = useRef(null);
  const queryClient = useQueryClient();
  const { _id: profileId } = authStore(state => state.user)

  const openDashboardOnClick = () => {
    setShowDashboardSidebar(true);
    queryClient.invalidateQueries(["userProfileSidebar"]);
  };
  const closeDashboardOnClick = () => {
    setShowDashboardSidebar(false);
  };
  const handleSidebar = () => {
    setShowSidebar(true);
  };
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

  const handleListItemClick = (index) => {
    setSelectedFeed(index);
  };

  const handleActiveFiltering = (flag) => {
    setActiveFiltering(flag);
    if (!flag) {
      handleResetFiltering();
      userLocation();
    }
  };

  return (
      <div className='position-absolute top-0 left-0'>
          <Box ref={sidebarHeaderRef} className='sidebar_header'>
              <MapSearchbar
                  handleSidebar={handleSidebar}
                  onSidebarBtnClick={openDashboardOnClick}
                  handleSearchUser={handleSearchUser}
                  handleFiltering={handleFiltering}
                  userLocation={userLocation}
                  handleActiveFiltering={handleActiveFiltering}
              />
          </Box>
          <div className={`map_sidebar_wrapper ${showSidebar ? "" : "hide"}`}>
              <div ref={sidebarContentBoxRef} className='sidebar_content_box'>
                  <Box className='map_sidebar_feed_box'>
                      <List>
                          {!activeFiltering && filteredData.length === 0
                              ? userLocationData &&
                                userLocationData.length > 0 &&
                                userLocationData.map((item, i) => {
                                    return (
                                        <MapFeedItem
                                            key={i}
                                            feedData={item}
                                            onFeedSelect={handleListItemClick}
                                            selectedFeed={selectedFeed}
                                            handleDirection={() => handleDirection(item)}
                                            profileId={profileId}
                                        />
                                    );
                                })
                              : filteredData &&
                                filteredData.length > 0 &&
                                filteredData.map((item, i) => {
                                    return (
                                        <MapFeedItem
                                            key={i}
                                            feedData={item}
                                            onFeedSelect={handleListItemClick}
                                            selectedFeed={selectedFeed}
                                            handleDirection={() => handleDirection(item)}
                                            profileId={profileId}
                                        />
                                    );
                                })}
                      </List>
                  </Box>
              </div>
              <AppTooltip title={!showSidebar ? "expand side panel" : "collapse side panel"} placement={"right"}>
                  <Button onClick={() => setShowSidebar(!showSidebar)} className='map_sidebar_wrapper_expand_btn'>
                      {showSidebar ? <ArrowLeftRoundedIcon style={{ color: "#70757a" }} /> : <ArrowRightRoundedIcon style={{ color: "#70757a" }} />}
                  </Button>
              </AppTooltip>
          </div>          
          {showDashboardSidebar && (
              <Backdrop open={showDashboardSidebar} className='dashboard_sidebar_backdrop' onClick={() => setShowDashboardSidebar(false)}></Backdrop>
          )}
      </div>
  );
};

// export default MapSidebar
export default React.memo(MapSidebar);
