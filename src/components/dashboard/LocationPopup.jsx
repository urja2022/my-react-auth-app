import React, { useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Button, } from '@mui/material'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Geocode from "react-geocode";

const LocationPopup = (props) => {
    const googleMapKey = process.env.REACT_APP_GOOGLE_MAP_LEY;
    const [lattitudeData, setLattitudeData] = useState();
    const [longitudeData, setLongitudeData] = useState();
    const popupClose = () => {
        document.getElementById("locationPopup").classList.remove("show");
        document.body.removeAttribute('style');
    }

    const center = {
        lat: -14.306030397015958,
        lng: -59.62628605787748
    };

    const handleClickMap = (event) => {
        var lat = event.latLng.lat().toString();
        var lng = event.latLng.lng().toString();
        setLongitudeData(lng);
        setLattitudeData(lat);
        const address = "Abc Xyz";
        props.addressData({lat,lng,address})
        // Geocode.setApiKey(googleMapKey);
        
        // Geocode.fromLatLng(lat, lng).then(
        //     (response) => {
        //         const address = response.results[0].formatted_address;
        //     },
        //     (error) => {
        //       console.error(error);
        //     }
        //   );
    }

    return (
        <section id='locationPopup' className='location_popup_overlay'>
            <div className='container position-relative'>
                <Button onClick={() => popupClose()} className='app_blank_btn popup_close_btn' variant='outlined'>
                    <CloseOutlinedIcon />
                </Button>
                <div className='location_box'>
                    <div className="location_map">
                        <LoadScript
                            googleMapsApiKey={googleMapKey}
                            id="script-loader"
                            >
                            <GoogleMap
                                mapContainerClassName='w-100 h-100'
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
                                zoom={5}
                                center={center}
                                onClick={e => handleClickMap(e)}
                            >
                                <Marker
                                    key={"Location 1"}
                                    position={{ lat: Number(lattitudeData), lng: Number(longitudeData) }} 
                                 />
                            </GoogleMap>
                        </LoadScript>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LocationPopup