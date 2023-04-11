import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { withTranslation } from "react-i18next";
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import files from "src/helpers/helpers";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import getDataURL from "src/components/map/imgToMarker";
import InfoWindowContent from "src/components/home/InfoWindowContent";
import { Box, Button, Typography } from "@material-ui/core";
import { List, ListItem } from "@mui/material";
import TodayIcon from '@mui/icons-material/Today';
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LocationLogPinPopup = (props) => {
  const { onClose, open, locationData, centerPoint, googleMarker } = props;

  const [centerPointData, setCenterPointData] = useState({ lat: -26.204444, lng: 28.045556 });
  const googleMapKey = process.env.REACT_APP_GOOGLE_MAP_LEY;
  const [libraries] = useState(["places"]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  // const [googleMarkerPin, setGoogleMarkerPin] = useState()
  const handleClickClose = () => {
    setCenterPointData({ lat: -26.204444, lng: 28.045556 });
    onClose();
  }
  useEffect(() => {
    if (centerPoint) {
      locationData?.[0]
        ?.map((user, index) => {
          setCenterPointData({ lat: user?.location?.location?.coordinates?.[1], lng: user?.location?.location?.coordinates?.[0] })
        })
    }
    // setGoogleMarkerPin(googleMarker?.[0]?.image?.profilePic)
  }, [centerPoint, locationData])

  const onmouseleave = () => {
    setSelectedCenter(null)
  }

  return (
    <>
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <AppBar sx={{ position: "relative" }} style={{ backgroundColor: "#6E3FC6" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClickClose}
              aria-label="close"
              sx={{
                position: 'absolute',
                right: 25,
                top: 12,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <LoadScript googleMapsApiKey={googleMapKey} libraries={libraries}>
          <GoogleMap
            mapContainerClassName="w-100 h-100 position-relative"
            options={{
              streetViewControl: false,
              scaleControl: true,
              mapTypeControl: false,
              panControl: false,
              zoomControl: true,
              rotateControl: false,
            }}
            keyboardShortcuts={false}
            draggable={true}
            zoom={13}
            center={centerPointData}
          >
            {
              centerPoint == true ? locationData?.[0]?.map((loc, index) => (
                <Marker
                  key={index}
                  icon={{ url: googleMarker }}

                  position={{
                    lat: loc?.location?.location?.coordinates?.[1],
                    lng: loc?.location?.location?.coordinates?.[0],

                  }
                  }
                  onMouseOver={() => setSelectedCenter(loc)}
                />

              )) :
                locationData?.map((loc, index) => (
                  <Marker
                    key={index}
                    icon={{ url: googleMarker }}

                    position={{
                      lat: loc?.location?.location?.coordinates?.[1],
                      lng: loc?.location?.location?.coordinates?.[0],
                    }}
                    onMouseOver={() => setSelectedCenter(loc)}
                    onClick={() => setSelectedCenter(loc)}
                  />
                ))
            }
            <>
              {
                selectedCenter &&

                <InfoWindow
                  position={{
                    lng: selectedCenter
                      ? selectedCenter?.location?.location?.coordinates?.[0]
                      : selectedCenter?.location?.location?.coordinates?.[0],
                    lat: selectedCenter
                      ? selectedCenter?.location?.location?.coordinates?.[1]
                      : selectedCenter?.location?.location?.coordinates?.[1],
                  }}
                >

                  <div className="info_window_container" onMouseLeave={onmouseleave} >
                    <List>
                      <ListItem sx={{ paddingLeft: "10px" }}>
                        <Button
                          className="app_blank_btn d-flex align-items-start app_close_float_btn_topRight"
                          sx={{ height: "40px", width: "40px" }}
                          variant="text"
                        >
                          <TodayIcon style={{ color: "#6200ee" }} />
                        </Button>
                      </ListItem>
                    </List>
                    <List className="info_window_info_container">
                      <ListItem className="app_text_16_semibold">{moment(selectedCenter?.createdAt).format("DD-MM-YYYY")}</ListItem>
                      <ListItem className="app_text_16_semibold">{moment(selectedCenter?.createdAt).format("hh:mm A")}</ListItem>
                      <ListItem className="app_text_12_fw500 app_text_gray">
                        {selectedCenter?.location?.address}
                      </ListItem>
                    </List>
                  </div>
                </InfoWindow>

              }
            </>
          </GoogleMap>
        </LoadScript>
      </Dialog>


    </>
  );
};

LocationLogPinPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withTranslation()(LocationLogPinPopup);
