import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import StarsIcon from "@mui/icons-material/Stars";
import AppTooltip from "../common/AppTooltip";
import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import TrustLevelFilter from "./TrustLevelFilter";
import { useEffect } from "react";
import DoubleLocationMarker from "src/svgComponents/DoubleLocationMarker";
import BeemzLocationIcon from "src/svgComponents/BeemzLocationIcon";
import LocationPinCircleBase from "src/svgComponents/LocationPinCircleBase";

const MapSearchbar = ({
  onSidebarBtnClick,
  handleSearchUser,
  handleSidebar,
  handleFiltering,
  userLocation,
  handleActiveFiltering,
}) => {
  const [mapFilterPopup, setMapFilterPopup] = useState(false);
  const [applayFilterBadge, setApplayFilterBadge] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredTrustLevel, setFilteredTrustLevel] = useState(
    new Array(5).fill(true)
  );
  const [selectedDistance, setSelectedDistance] = useState(3);
  const [customDistance, setCustomDistance] = useState(0.5);
  const [selectedTrustLevel, setSelectedTrustLevel] = useState([1, 2, 3, 4, 5]);

  const handleFilterDistanceChange = (event, type) => {
    if (type == "input") {
      setCustomDistance(event.target.value);
    } else {
      setSelectedDistance(event.target.value);
    }
  };

  // Map Search Functionality
  const handleSearch = (e) => {
    e.preventDefault();
    handleSearchUser(searchValue);
    handleSidebar();
  };

  // Map Filter Functionality
  const handleMapFilterPopupOnClose = () => {
    setMapFilterPopup(false);
  };
  const handleMapFilterPopupOnOpen = () => {
    setMapFilterPopup(true);
  };
  const handleTrustLevelFilterOnChange = (position) => {
    const updatedFilteredTrustLevel = filteredTrustLevel.map((item, index) =>
      index === position ? !item : item
    );
    setFilteredTrustLevel(updatedFilteredTrustLevel);
    if (selectedTrustLevel.includes(position + 1)) {
      let index = selectedTrustLevel.indexOf(position + 1);
      selectedTrustLevel.splice(index, 1);
    } else {
      selectedTrustLevel.push(position + 1);
    }
  };

  const handleApplyFiltering = () => {
    let obj = {
      distance:
        selectedDistance === "custom" ? customDistance : selectedDistance,
      trustLevel: selectedTrustLevel,
    };
    handleFiltering(obj);
    setMapFilterPopup(false);
    handleSidebar();
    handleActiveFiltering(true);
    setApplayFilterBadge(true);
  };

  const handleResetFiltering = () => {
    setSelectedDistance(3);
    setFilteredTrustLevel(new Array(5).fill(true));
    setCustomDistance(0.5);
    setSelectedTrustLevel([1, 2, 3, 4, 5]);
    userLocation();
    handleActiveFiltering(false);
    setApplayFilterBadge(false);
  };

  return (
    <>
      <Paper
        component="form"
        className="map_search_box"
        onSubmit={(e) => handleSearch(e)}
      >

        <InputBase
          sx={{ ml: 1.5, flex: 1, fontFamily: "Google Sans", lineHeight: 1 }}
          placeholder="search beemz network"
          inputProps={{ "aria-label": "search beemz network" }}
          onChange={(e) => setSearchValue(e.target.value.trim())}
        />
        <AppTooltip title={"search"} placement={"bottom"}>
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </AppTooltip>
        <Divider
          sx={{ height: 28, m: 0.5, borderColor: "#000" }}
          orientation="vertical"
        />
        <AppTooltip title={"filter"} placement={"bottom"}>
          <IconButton
            onClick={handleMapFilterPopupOnOpen}
            sx={{ p: "10px" }}
            aria-label="directions"
          >
            {applayFilterBadge ? (
              <Badge
                color="error"
                variant="dot"
                overlap="circular"
                invisible={false}
              >
                <FilterAltOutlinedIcon />
              </Badge>
            ) : (
              <FilterAltOutlinedIcon />
            )}
          </IconButton>
        </AppTooltip>
      </Paper>

      {/* Filter Popup */}

      <Dialog
        onClose={handleMapFilterPopupOnClose}
        open={mapFilterPopup}
        className="map_filter_box_popup"
      >
        <DialogTitle
          sx={{
            px: 2,
            py: 3,
            boxShadow:
              "0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)",
          }}
          className="d-flex align-items-center w-100"
        >
          <Button
            onClick={() => handleMapFilterPopupOnClose()}
            className="app_null_btn"
          >
            <ArrowBackIcon style={{ color: "#2d3748" }} />
          </Button>
          <span className="app_text_18_semibold app_text_black w-100 ms-4 app_text_transform">
            Filters
          </span>
          <div className="d-flex align-items-center">
            <Button
              className="theme_button app_text_transform"
              variant="contained"
              onClick={() => handleApplyFiltering()}
            >
              Apply
            </Button>
            <Button
              className="theme_button ms-3 app_text_transform"
              variant="outlined"
              onClick={() => handleResetFiltering()}
            >
              Reset
            </Button>
          </div>
        </DialogTitle>
        <DialogContent sx={{ px: 0 }}>
          <Box sx={{ px: 2, pt: 2, pb: 1, border: "1px solid #CCD4DF" }}>
            <h4 className="app_text_14_semibold app_text_transform">
              <span className="me-2">
                <StarsIcon style={{ color: "#6200ee" }} />
              </span>
              Trust level
            </h4>
            <Box className="py-3">
              <Stack
                className="justify-content-center"
                direction={"row"}
                spacing={2}
              >
                {filteredTrustLevel.map((star, index) => (
                  <TrustLevelFilter
                    key={index}
                    index={index}
                    selected={star}
                    onChange={handleTrustLevelFilterOnChange}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <h4 className="app_text_14_semibold app_text_transform">
              <DoubleLocationMarker />
              <span className="ms-2 app_text_transform">Select Distance</span>
            </h4>
            <FormControl fullWidth className="mt-4">
              <Select
                value={selectedDistance}
                sx={{
                  "& legend": { display: "none" },
                  "& fieldset": { top: 0 },
                }}
                onChange={(e) => handleFilterDistanceChange(e, "dropdown")}
                variant="outlined"
                name="distance"
              >
                <MenuItem value={0}>select distance</MenuItem>
                <MenuItem value={1}>1 Km</MenuItem>
                <MenuItem value={3}>3 Km</MenuItem>
                <MenuItem value={5}>5 Km</MenuItem>
                <MenuItem value={10}>10 Km</MenuItem>
                <MenuItem value={30}>30 Km</MenuItem>
                <MenuItem value={"custom"}>custom distance...</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {selectedDistance === "custom" && (
            <>
              <Box sx={{ px: 2, pt: 2, pb: 1, mt: 2 }}>
                <h4
                  className={`app_text_14_semibold app_text_transform`}
                  style={{
                    color:
                      selectedDistance !== "custom" ? "#dedede" : "#2d3748",
                  }}
                >
                  <LocationPinCircleBase
                    w={18}
                    h={18}
                    color={
                      selectedDistance !== "custom" ? "#dedede" : "#6200ee"
                    }
                  />
                  <span className="ms-2 app_text_transform">
                    Custom Distance
                  </span>
                </h4>
                <TextField
                  disabled={selectedDistance !== "custom"}
                  sx={{
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                    mt: 2,
                  }}
                  variant="outlined"
                  fullWidth
                  placeholder="Enter custom distance"
                  onChange={(e) => handleFilterDistanceChange(e, "input")}
                  value={customDistance}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">km</InputAdornment>
                    ),
                  }}
                />
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default MapSearchbar;
