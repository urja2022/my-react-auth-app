import { Box, ListItemButton, ListItemIcon, Stack } from "@mui/material";
import _ from "lodash";
import moment from "moment";
import React from "react";
import files from "src/helpers/helpers";
import LocationPinCircleBase from "src/svgComponents/LocationPinCircleBase";
import imgNot from "../../assets/images/imageNot.png";

const EventFeedItem = ({ onClickFunc,eventData }) => {
  const startData = new Date(eventData?.startDate);
  const startDay = moment(startData).format('ddd');
  const startDate = moment(startData).format('DD MMM YYYY');

  return (
    <ListItemButton onClick={() => onClickFunc(eventData?._id)} className="map_event_feed_listItem">
      <Box className="event_feed_card">
        <Stack className="w-100" direction={"row"} spacing={2}>
          <Box className="event_img_container">
              {!_.isEmpty(eventData?.image?.[0]) ?
                <img src={files(eventData?.image?.[0],"image")} alt="event" />
                :
                !_.isEmpty(eventData?.video) ?
                <video controls style={{height:80, width:65}}>
                    <source src={files(eventData?.video,"video")}></source>
                </video>
                :
                <img src={imgNot} alt="event" />
            }
          </Box>
          <Box className="w-100">
            <Stack>
              <span className="app_text_primary app_text_12_fw500 text-wrap">
                {`${startDay}, ${startDate} at ${eventData?.startTime}`}
              </span>
              <span className="app_text_18_semibold text_limit_200">
                {eventData?.name}
              </span>
              <span className="app_text_14_semibold app_text_gray">
                {eventData?.userName}
              </span>
              {eventData?.address && 
                <span className="d-flex align-items-center app_text_black_2">
                  <ListItemIcon sx={{ minWidth: "unset", marginRight: 1 }}>
                    <LocationPinCircleBase />
                  </ListItemIcon>
                  <span className="app_text_12_fw500">{`${eventData?.address.substring(0,35)}...`}</span>
                </span>
              }
            </Stack>
          </Box>
        </Stack>
      </Box>
    </ListItemButton>
  );
};

export default EventFeedItem;
