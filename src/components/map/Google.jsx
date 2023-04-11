/* eslint-disable no-undef */
import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { getDistance } from 'geolib';
import * as geolib from 'geolib';

const containerStyle = {
  width: "100%",
  height: "100%",
};

function MyMap({ children, center, handleOnDragEnd,centerLatLng, distanceAllKm, options }) {

  const [mapref, setMapRef] = useState(null);
  const [lattitudeData, setLattitudeData] = useState(center.lat);
  const [longitudeData, setLongitudeData] = useState(center.lng);

  const handleOnLoad = map => {
    setMapRef(map);
  };

  const handleCenterChanged = () => {
    if (mapref) {
      const newCenter = mapref.getCenter();
      var lat = newCenter.lat();
      var lng = newCenter.lng();
      setLongitudeData(lng);
      setLattitudeData(lat);
      handleOnDragEnd({ lat: lat, lng: lng })
    }
  };

  const distance = getDistance(
    { latitude: centerLatLng ? centerLatLng.lat : center.lat, longitude: centerLatLng ? centerLatLng.lng : center.lng },
    { latitude: lattitudeData, longitude: longitudeData }
  );

  const distanceKm = geolib.convertDistance(distance, 'km');

  useEffect(() => {
    distanceAllKm({ distanceKm: distanceKm, latitude: lattitudeData, longitude: longitudeData });
  }, [distance, distanceKm]);

  return (
    <GoogleMap mapContainerStyle={containerStyle} onLoad={handleOnLoad} onCenterChanged={handleCenterChanged} options={options} center={center} zoom={13}>
      {children}
    </GoogleMap>
  );
}

export default React.memo(MyMap);