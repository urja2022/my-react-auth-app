import { IconButton, InputBase, Paper } from '@mui/material'
import React from 'react'
import AppTooltip from './AppTooltip'
import SearchIcon from "@mui/icons-material/Search";


const SearchBox = ({ placeholder, onChange, value }) => {

    return (
        <Paper className="map_search_box">
            <InputBase
                sx={{ ml: 1, flex: 1, fontFamily: "Google Sans", lineHeight: 1 }}
                placeholder={placeholder}
                inputProps={{ "aria-label": placeholder }}
                value={value}
                onChange={onChange}
            />
            <AppTooltip title={"search"} placement={"bottom"}>
                <IconButton type="submit" sx={{ p: "10px", flex: 0 }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </AppTooltip>
        </Paper>
    )
}

export default SearchBox