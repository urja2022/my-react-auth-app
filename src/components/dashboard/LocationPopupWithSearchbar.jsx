import React, { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Button } from "@mui/material";
import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import SearchBox from "../common/SearchBox";
import Geocode from "react-geocode";

const LocationPopupWithSearchbar = (props) => {
  const {
    popupFiled,
    priviousData,
    addressData,
    viewMapData,
    latData,
    longData,
  } = props;
  const googleMapKey = process.env.REACT_APP_GOOGLE_MAP_LEY;
  const [libraries] = useState(["places"]);
  const [autoComplete, setAutoComplete] = useState();
  const [location, setLocation] = useState({});
  const [lattitudeData, setLattitudeData] = useState();
  const [longitudeData, setLongitudeData] = useState();
  const [addressMapData, setAddressMapData] = useState(priviousData);
  const [lattitude, setLattitude] = useState();
  const [longitude, setLongitude] = useState();

  // const geoLocation = () => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     setLattitude(position.coords.latitude);
  //     setLongitude(position.coords.longitude);
  //     setLattitudeData(position.coords.latitude);
  //     setLongitudeData(position.coords.longitude);
  //   });
  // };
  // useEffect(() => {
  //   geoLocation();
  // }, []);

  const onAutoCompleteIsLoad = (inputAutoComplete) => {
    setAutoComplete(inputAutoComplete);
  };
  const onAutoCompletePlaceIsChanged = () => {
    if (autoComplete !== null) {
      var place = autoComplete.getPlace();
      location.lat = place.geometry.location.lat();
      location.lng = place.geometry.location.lng();
      location.address = place.formatted_address;
      setAddressMapData(place.formatted_address);
      setLongitudeData(location.lng);
      setLattitudeData(location.lat);
      setTimeout(() => addressData(location), 1000);
    }
  };
  const handleChange = (event) => {
    setAddressMapData(event.target.value);
  };
  const hadnleLocationPopup = () => {
    const locationPopup = document.getElementById("locationPopup");
    locationPopup.classList.add("show");
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "0px";
  };
  const popupClose = () => {
    document.getElementById("locationPopup").classList.remove("show");
    document.body.removeAttribute("style");
  };
  const center = {
    lat: lattitudeData
      ? Number(lattitudeData)
      : lattitude
      ? lattitude
      : -26.204444,
    lng: longitudeData
      ? Number(longitudeData)
      : longitude
      ? longitude
      : 28.045556,
  };
  const mapViewCenter = {
    lat: latData ? Number(latData) : -26.204444,
    lng: longData ? Number(longData) : 28.045556,
  };
  const handleClickMap = (event) => {
    var lat = event.latLng.lat().toString();
    var lng = event.latLng.lng().toString();
    setLongitudeData(lng);
    setLattitudeData(lat);
    // const address = "Abc Xyz";
    Geocode.setApiKey(googleMapKey);
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        addressData({ lat, lng, address });
        setAddressMapData(address);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey={googleMapKey} libraries={libraries}>
      <div className={`${!popupFiled ? "col-md-8" : "col-12"}`}>
        <Button
          onClick={() => hadnleLocationPopup()}
          fullWidth
          className="app_text_transform app_btn_lg map_select_box"
          variant="outlined"
        >
          select address from map
        </Button>
      </div>
      <section id="locationPopup" className="location_popup_overlay">
        <div className="container position-relative">
          <Button
            onClick={() => popupClose()}
            className="popup_close_btn"
            variant="outlined"
          >
            <CloseOutlinedIcon />
          </Button>
          <div className="location_box position-relative">
            <div className="location_popup_searchbox_container">
              <Autocomplete
                onLoad={onAutoCompleteIsLoad}
                onPlaceChanged={onAutoCompletePlaceIsChanged}
              >
                <SearchBox
                  placeholder="search address"
                  onChange={handleChange}
                  value={addressMapData}
                />
              </Autocomplete>
            </div>
            <div className="location_map">
              <GoogleMap
                mapContainerClassName="w-100 h-100"
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
                center={center}
                onClick={(e) => handleClickMap(e)}
              >
                <Marker
                  key={"Location 1"}
                  position={{
                    lat: Number(lattitudeData),
                    lng: Number(longitudeData),
                  }}
                />
                {/* <Box sx={{ position: 'absolute', right: '10px', bottom: '110px' }}>
                    <IconButton onClick={() => geoLocation()} sx={{ width: 40, height: 40, bgcolor: '#fff', "&:hover": { backgroundColor: '#fff' } }}>
                      <MyLocationOutlinedIcon style={{ color: '#6200ee' }} />
                    </IconButton>
                  </Box> */}
              </GoogleMap>
            </div>
          </div>
        </div>
      </section>
      {viewMapData && viewMapData ? (
        <>
          <div className="col-md-8 my-2 d-flex justify-content-center"></div>
          <div className="col-md-8">
            <div className="location_box_map_view">
              <div className="location_map">
                <GoogleMap
                  mapContainerClassName="w-100 h-100"
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
                  center={mapViewCenter}
                >
                  <Marker
                    key={"Location 1"}
                    position={{
                      lat: latData ? Number(latData) : Number(lattitudeData),
                      lng: longData ? Number(longData) : Number(longitudeData),
                    }}
                  />
                </GoogleMap>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </LoadScript>
  );
};

export default LocationPopupWithSearchbar
