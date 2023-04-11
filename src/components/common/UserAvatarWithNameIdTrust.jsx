import React from "react";
import { Stack } from "@mui/material";
import UserAvatar from "./UserAvatar";
import TrustLevelReadOnly from "./TrustLevelReadOnly";

const UserAvatarWithNameIdTrust = ({ imgSrc, avatarSize, isLightBg, userFullName, userId, trustRating, description }) => {
  return (
    <div className="d-flex align-items-center">
      <UserAvatar diameter={avatarSize} alternateSrc={userFullName} imgSrc={imgSrc} />
      <Stack direction="column" className="ms-3 w-100" spacing={0.3}>
        <span className="app_text_16_500 app_text_black text_limit_180 text-capitalize lh_20">{userFullName}</span>
        {description ? <span className={`app_text_12_fw500 text-lowercase ${isLightBg ? "app_text_black" : "app_text_gray"}`}>{`@${description}`}</span> : userId ? <span className={`app_text_12_fw500 text-lowercase ${isLightBg ? "app_text_black" : "app_text_gray"}`}>{`@${userId}`}</span> : ""}
        {trustRating ? <TrustLevelReadOnly rating={trustRating} maxStar={5} /> : <></>}
      </Stack>
    </div>
  );
};

export default UserAvatarWithNameIdTrust;
