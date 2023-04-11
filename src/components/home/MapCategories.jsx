import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import DomainIcon from "@mui/icons-material/Domain";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import AppTooltip from "../common/AppTooltip";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

import { Button } from "@material-ui/core";
import { CSVLink } from "react-csv";
import moment from "moment";

const MapCategories = ({ categoryList, selectedMapOption, mapCatUpdateFunc, userDataLength, mapShowEventfunc, userLocationData, type }) => {
  const [CsvData, setCsvData] = useState([]);
  // csv report
  useEffect(() => {
    var arr = [];
    let obj = {};
    userLocationData &&
      userLocationData?.map((item) => {
        obj = {

          name: item?.name ? item?.name : item?.event_id ? item?.title : '-',
          description: item?.description ? item?.description : '-',
          email: item?.email ? item?.email : '-',
          mobile: item?.mobile ? item?.mobile : '-',
          event_time: item?.eventStartDate && item?.startTime ? moment(item?.eventStartDate).format("MMM DD YYYY") + '-' + item?.startTime : '-',
          event_address: item?.eventAdress ? item?.eventAdress?.physicalAddress : '-',
          category: ["all", "people", "group", "event"].includes(type) ? type : item?.category?.name ? item?.category?.name : "business",
          location: item?.location?.coordinates ? item?.location?.coordinates?.[1] + '-' + item?.location?.coordinates?.[0] : '-',

          averageTrust: item?.averageTrust ? item?.averageTrust : '-'
        }
        arr.push(obj);
      })

    setCsvData(arr)
  }, [userLocationData]);

  const headers = [
    { label: "name", key: "name" },
    { label: "email", key: "email" },
    { label: "mobile", key: "mobile" },
    { label: "event time", key: "event_time" },
    { label: "event address", key: "event_address" },
    { label: "description", key: "description" },
    { label: "average trust", key: "averageTrust" },
    { label: "category", key: "category" },
    { label: "location", key: "location" },
  ];
  let csvReport = {
    data: CsvData,
    headers: headers,
    filename: 'beemz-users-location.csv'
  };

  return (
    <Box className="map_category_wrapper">
      <div className="home_map_options_wrapper">
        <Box
          sx={{
            maxWidth: { xs: 400, md: 500, lg: 800 },
            bgcolor: "transparent",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tabs
            sx={{
              alignItems: "center",
              "& .MuiTabs-flexContainer": {
                alignItems: "center",
                padding: "8px 0",
              },
              "& .MuiTabs-scroller": { display: "flex" },
              "& .MuiTabScrollButton-root": {
                bgcolor: "#fff",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
              },
            }}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ sx: { display: "none" } }}
          >
            <Tab className={`home_map_btn app_text_14_semibold ${selectedMapOption === "all" ? "mapActive" : ""}`} onClick={() => mapCatUpdateFunc("all")} icon={<DoneAllIcon color={selectedMapOption === "all" ? "#fff" : "#626B76"} />} iconPosition="start" label={"all"} />
            {userDataLength && (
              <Tab className={`home_map_btn app_text_14_semibold ${selectedMapOption === "people" ? "mapActive" : ""}`} onClick={() => mapCatUpdateFunc("people")} icon={<PersonIcon color={selectedMapOption === "people" ? "#fff" : "#626B76"} />} iconPosition="start" label={"people"} />
            )}
            {userDataLength && <Tab className={`home_map_btn app_text_14_semibold ${selectedMapOption === "group" ? "mapActive" : ""}`} onClick={() => mapCatUpdateFunc("group")} icon={<GroupIcon color={selectedMapOption === "group" ? "#fff" : "#626B76"} />} iconPosition="start" label={"group"} />}

            {userDataLength && <Tab className={`home_map_btn app_text_14_semibold ${selectedMapOption === "event" ? "mapActive" : ""}`} onClick={() => mapCatUpdateFunc("event")} icon={<GroupIcon color={selectedMapOption === "event" ? "#fff" : "#626B76"} />} iconPosition="start" label={"event"} />}

            {categoryList ? (
              categoryList.map((cate, index) => {
                return (
                  <Tab
                    key={`${Math.random().toString(36).substring(2, 9)}_catBtn${index}`}
                    className={`home_map_btn app_text_14_semibold ${selectedMapOption === cate._id ? "mapActive" : ""}`}
                    onClick={() => mapCatUpdateFunc(cate._id)}
                    icon={<DomainIcon color={selectedMapOption === cate._id ? "#fff" : "#626B76"} />}
                    iconPosition="start"
                    label={cate.name}
                  />
                );
              })

            ) : (
              <></>
            )}

          </Tabs>




        </Box>
        <Tabs
          sx={{
            alignItems: "center",
            "& .MuiTabs-flexContainer": {
              alignItems: "center",
              padding: "8px 0",
            },
            "& .MuiTabs-scroller": { display: "flex" },
            "& .MuiTabScrollButton-root": {
              bgcolor: "#fff",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
            },
          }}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ sx: { display: "none" } }}
        >
          {
            csvReport ?
              <CSVLink {...csvReport}>
                <Button className="app_text_transform"
                  variant="contained"
                  sx={{ bgcolor: "#6200EE", "&:hover": { bgcolor: "#6200EE" } }}>
                  export
                  <FileUploadOutlinedIcon style={{ fontSize: 18, color: "#6200EE", margin: '2px' }} />
                </Button>
              </CSVLink> : ''
          }

        </Tabs>


      </div>
    </Box>
  );
};

export default MapCategories;
