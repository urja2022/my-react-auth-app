import React, { useState } from "react";
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";
import Dialog from "@mui/material/Dialog";
import { Box, DialogContent } from "@mui/material";

const DateRangePopup =(props) => {
    const {open, onClose,dobRangeVal} = props;
    const [dobValue, setDobValue] = useState([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 0),
        key: 'selection'
      }
    ]);
    dobRangeVal(dobValue);
    return (
      <>
      <Dialog onClose={onClose} open={open}>
        <DialogContent sx={{ px: 0 }}>
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <DateRange
              minDate={new Date()}
              rangeColors={["#6e3fc6"]}
              editableDateInputs={true}
              onChange={item => setDobValue([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dobValue}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
    )
  }

export default DateRangePopup;
