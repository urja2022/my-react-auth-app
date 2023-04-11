import React, { useEffect, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";

const LiveLocation = ({ userData, handleCloseLiveLocation }) => {

    return (
        <Box className="map_side_box live_location_box">
            <div className="d-flex flex-column justify-content-between h-100">
                <div className="d-flex justify-content-between align-items-center">
                    <span className="app_text_20_bold text-white">
                        {userData && userData.fullName ? userData.fullName + ' Live Location' : ''} 
                    </span>
                    <Button className="app_null_btn" onClick={handleCloseLiveLocation}>
                        <CloseOutlinedIcon style={{ color: "#c4c4c4", fontSize: 18 }} />
                    </Button>
                </div>
            </div>
        </Box>
    );
};

export default LiveLocation;
