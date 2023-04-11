import React, { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, Button, DialogContent, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventIcon from '@mui/icons-material/Event';
import IconButton from "@mui/material/IconButton";
import DateRangePopup from "./DateRangePopup";
import moment from "moment";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

const EventFilterPopup = (props) => {
    const { onClose, open } = props;
    const [eventOfLocation, setEventOfLocation] = useState("");
    const [eventOfRange,setEventOfRange] = useState("5-10");
    const [dateRateRangePopup,setDateRangePopup] = useState(false);
    const [eventType,setEventType] = useState(true);
    const [dobRangeValue,setDobRangeValue] = useState();
    const dateRangePopupClose =()=>{
      setDateRangePopup(false);
    }
    
  const dobRangeStEn = (val) => {
    const startDate = moment(val[0].startDate).format("DD/MM/YYYY");
    const endDate = moment(val[0].endDate).format("DD/MM/YYYY")
    setDobRangeValue(startDate + " - " + endDate);
  }
  return (
    <>
    <Dialog onClose={onClose} open={open} className="map_filter_box_popup">
      <DialogTitle sx={{px: 2,py: 3, boxShadow:"0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)", }} className="d-flex align-items-center w-100" >
        <Button onClick={onClose} className="app_null_btn" >
          <ArrowBackIcon style={{ color: "#2d3748" }} />
        </Button>
        <span className="app_text_18_semibold app_text_black w-100 ms-4 app_text_transform">
          Filters
        </span>
        <div className="d-flex align-items-center">
            <Button className="theme_button app_text_transform" variant="contained">Apply</Button>
            <Button className="theme_button ms-3 app_text_transform" variant="outlined">Reset</Button>
          </div>
      </DialogTitle>
      <DialogContent sx={{ px: 0 }}>
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <h4 className="app_text_14 app_text_transform">area</h4>
          <FormControl fullWidth className="mt-4">
              <InputLabel id="event-location-select-label">location of event</InputLabel>
              <Select
                labelId="event-location-select-label"
                value={eventOfLocation}
                label="location of event"
                onChange={(e) => setEventOfLocation(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="surat">surat</MenuItem>
                <MenuItem value="rajkot">rajkot</MenuItem>
                <MenuItem value="ahmdabad">ahmdabad</MenuItem>
              </Select>
            </FormControl>
        </Box>
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <h4 className="app_text_14 app_text_transform">area range</h4>
          <FormControl fullWidth className="mt-4">
              <InputLabel id="event-area-select-label">area range</InputLabel>
              <Select
                labelId="event-area-select-label"
                value={eventOfRange}
                label="area range"
                onChange={(e) => setEventOfRange(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="5-10">5-10km</MenuItem>
                <MenuItem value="10-20">10-20km</MenuItem>
                <MenuItem value="20-30">20-30km</MenuItem>
              </Select>
            </FormControl>
        </Box>
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <h4 className="app_text_14 app_text_transform">date range</h4>
          <FormControl fullWidth className="mt-4">
          <TextField
            className="app_text_transform"
            variant="outlined"
            fullWidth
            value={dobRangeValue}
            label="start date - end date"
            id="profileEmail"
            autoComplete="off"
            onClick={() => setDateRangePopup(true)}
            disabled={true}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                    <IconButton
                      color="primary"
                      sx={{ p: "10px" }}
                      aria-label="directions"
                      disabled
                    >
                      <EventIcon style={{ color: '#97A8BE', fontSize: 18 }} />
                    </IconButton>
                </InputAdornment>
              )
            }}
          />
          </FormControl>
        </Box>
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <h4 className="app_text_14 app_text_transform">event type</h4>
          <FormControl fullWidth className="mt-2">
            <RadioGroup name="ad-permission" sx={{ display: "flex", flexDirection: "row" }}>
              <FormControlLabel
                onChange={() => setEventType(true)}
                control={ <Radio checked={ eventType === true } /> }
                className="app_text_gray"
                label="public"
              />
              <FormControlLabel
                onChange={() => setEventType(false)}
                control={ <Radio checked={ eventType === false } /> }
                className="app_text_gray"
                label="private"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>
    </Dialog>
    <DateRangePopup dobRangeVal={dobRangeStEn} open={dateRateRangePopup} onClose={dateRangePopupClose}/>
    </>
  );
};

export default EventFilterPopup;
