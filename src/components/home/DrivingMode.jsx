import React, { useEffect, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
const DrivingMode = ({
  showMap,
  drivingModeDuration,
  handleCloseDrivingMode,
}) => {
  const [selectedMode, setSelectedMode] = useState("driving");

  useEffect(() => showMap(selectedMode), [selectedMode]);
  return (
    <Box className="map_side_box driving_mode_box">
      <div className="d-flex flex-column justify-content-between h-100">
        <div className="d-flex justify-content-between align-items-center">
          <span className="app_text_14_500 app_text_black">
            {drivingModeDuration.distance && drivingModeDuration.duration
              ? `${drivingModeDuration?.distance?.text} (${drivingModeDuration?.duration?.text})`
              : ""}
          </span>
          <Button className="app_null_btn" onClick={handleCloseDrivingMode}>
            <CloseOutlinedIcon style={{ color: "#c4c4c4", fontSize: 18 }} />
          </Button>
        </div>
        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => setSelectedMode("driving")}
            startIcon={<DirectionsCarFilledOutlinedIcon />}
            className={`${
              selectedMode === "driving"
                ? "theme_button"
                : "theme_button-inactive app_text_gray text-capitalize"
            }`}
            variant={selectedMode === "driving" ? "contained" : "outlined"}
          >
            Driving{" "}
          </Button>
          <Button
            onClick={() => setSelectedMode("bicycling")}
            startIcon={<TwoWheelerOutlinedIcon />}
            className={`${
              selectedMode === "bicycling"
                ? "theme_button"
                : "theme_button-inactive app_text_gray text-capitalize"
            }`}
            variant={selectedMode === "bicycling" ? "contained" : "outlined"}
          >
            Two Wheelers{" "}
          </Button>
          <Button
            onClick={() => setSelectedMode("walking")}
            startIcon={<DirectionsWalkOutlinedIcon />}
            className={`${
              selectedMode === "walking"
                ? "theme_button"
                : "theme_button-inactive app_text_gray text-capitalize"
            }`}
            variant={selectedMode === "walking" ? "contained" : "outlined"}
          >
            Walking{" "}
          </Button>
          <Button
            onClick={() => setSelectedMode("transit")}
            startIcon={<DirectionsTransitIcon />}
            className={`${
              selectedMode === "transit"
                ? "theme_button"
                : "theme_button-inactive app_text_gray text-capitalize"
            }`}
            variant={selectedMode === "transit" ? "contained" : "outlined"}
          >
            Transit{" "}
          </Button>
        </Stack>
      </div>
    </Box>
  );
};

export default DrivingMode;
