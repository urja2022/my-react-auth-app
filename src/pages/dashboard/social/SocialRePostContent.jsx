import { Box, Rating, Typography } from "@mui/material";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import files from "src/helpers/helpers";
import { withTranslation } from "react-i18next";
import moment from "moment";
import _ from "lodash";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import UserAvatar from "src/components/common/UserAvatar";
import EarthIcon from "src/assets/svgs/EarthIcon";
import LocationPin from "src/svgComponents/LocationPin";
import LockIcon from "src/assets/LockIcon";

const SocialRePostContent = (props) => {
  const {
    userName,
    userImage,
    userTrust,
    visibility,
    address,
    createdAt,
    businessName,
    businessImage,
    businessId
  } = props;

  return (
    <>
      <Box
        className=""
        sx={{
          marginBottom: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display={"flex"} alignItems={"start"} gap={"14px"}>
          <UserAvatar
            diameter={40}
            imgSrc={
              files(businessId ? businessImage : userImage, "image")
            }
            alternateSrc={businessId ? businessName : userName}
          />
          <Box className="">
            <Typography
              component={"h5"}
              className="app_text_16 mb-0 app_text_transform "
              sx={{ lineHeight: 1 }}
            >
              {businessId ? businessName : userName}
            </Typography>
            {businessId ?
              <></>
              :
              <Box
                display={"flex"}
                alignItems={"center"}
                gap={"8px"}
                className="mt-1"
              >
                <Typography
                  component={"span"}
                  className="app_text_14 app_text_transform "
                >
                  trust level
                </Typography>
                <Rating
                  size="small"
                  name="read-only"
                  max={5}
                  precision={0.5}
                  value={userTrust}
                  readOnly
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
              </Box>
            }
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {visibility ? <LockIcon /> : <EarthIcon />}
              {!_.isEmpty(address?.name) ? (
                <>
                  <LocationPin w="16" h="16" />
                  <Typography
                    component={"span"}
                    className="text_limit_150 app_text_14 app_text_transform "
                  >
                    {address?.name}
                  </Typography>
                </>
              ) : (
                <></>
              )}
              <Typography
                component={"span"}
                className="app_text_14 app_text_transform ms-1"
              >
                <FiberManualRecordIcon sx={{ width: "10px", height: "10px" }} /> {moment(createdAt).fromNow()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default withTranslation()(SocialRePostContent);
