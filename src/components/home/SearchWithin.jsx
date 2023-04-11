import React from "react";
import { IconButton, Paper } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const SearchWithin = ({ onSearch }) => {
  return (
    <Paper className="search_this_area_btn_container">
      <IconButton className="search_this_area_btn" onClick={onSearch}>
        <SearchOutlinedIcon style={{ color: "#1a73e8", fontSize: 18 }} />
        <span className="app_text_12_semibold ms-2">search this area</span>
      </IconButton>
    </Paper>
  );
};

export default SearchWithin;
