import { Button, Rating, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import UserAvatar from "../common/UserAvatar";
import StarIcon from "@mui/icons-material/Star";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import files from "src/helpers/helpers";
import { withTranslation } from "react-i18next";
import CreatePostPopUp from "../post/CreatePostPopUp";

const SocialPageStartingContent = (props) => {
  const { usereData } = props;
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const changeCreateClickClose = (value) => {
    setOpenCreatePopup(false);
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          minHeight: "auto",
          boxShadow:"0 0px 2px rgba(0, 0, 0, 0.4)",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <Box display={"flex"} alignItems={"start"} gap={"14px"}>
          <UserAvatar
            diameter={40}
            imgSrc={files(usereData?.profilePic, "image")}
            alternateSrc={usereData?.fullName}
          />
          <Box className="">
            <Typography component={"h5"} className="app_text_16 mb-0">
              {usereData?.fullName}
            </Typography>
            <Box display={"flex"} alignItems={"center"} gap={"8px"}>
              <Typography component={"span"} className="app_text_14">
                {props.t("comman_label.trust_level")}
              </Typography>
              <Rating
                size="small"
                name="read-only"
                max={5}
                precision={0.5}
                value={usereData?.trust ?? 0}
                readOnly
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
            </Box>
          </Box>
        </Box>
        <Typography
          component={"p"}
          onClick={() => setOpenCreatePopup(true)}
          sx={{
            backgroundColor: "#f9f9f9",
            padding: "10px",
            color: "gray",
            cursor: "pointer",
            borderRadius: "25px",
            boxShadow: "5px 5px 30px rgba(0, 121, 255, 0.02)",
            border: "1px solid #F3F5F9",
            marginTop: "18px",
          }}
        >
          {props.t('social_module.write_something')}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "30px",
          }}
        >
          <Button
            onClick={() => setOpenCreatePopup(true)}
            className="app_row_btn app_bg_primary_light app_text_14_semibold text-black app_text_transform app_text_primary"
            sx={{ minWidth: "110px !important" }}
            startIcon={<PhotoSizeSelectActualIcon sx={{ color: "#6200EE" }} />}
          >
            {props.t("comman_label.photos")}
          </Button>
          <Button
            onClick={() => setOpenCreatePopup(true)}
            className="app_row_btn app_bg_primary_light app_text_14_semibold text-black app_text_transform app_text_primary"
            sx={{ minWidth: "110px !important" }}
            startIcon={<SlideshowIcon sx={{ color: "#6200EE" }} />}
          >
            {props.t("comman_label.videos")}
          </Button>
        </Box>
      </Box>
      <CreatePostPopUp
        open={openCreatePopup}
        onClose={changeCreateClickClose}
      />
    </>
  );
};

export default withTranslation()(SocialPageStartingContent);
