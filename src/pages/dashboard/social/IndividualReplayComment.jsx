import {
  Box,
  IconButton,
  List,
  ListItem,
  Rating,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
// import CommentIcon from "src/svgComponents/CommentIcon";
// import ReplyIcon from "src/svgComponents/ReplyIcon";
import StarIcon from "@mui/icons-material/Star";
// import avatartest from "../../assets/images/post_img.png";
// import LikeIcon from "src/svgComponents/LikeIcon";
import files from "src/helpers/helpers";
// import CommentInput from "../post/CommentInput";
import { withTranslation } from "react-i18next";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import UserAvatar from "src/components/common/UserAvatar";
import LikeIcon from "src/assets/svgs/LikeIcon";
import moment from "moment";
// import { useMutation } from "react-query";
// import { SOCIAL_MEDIA_URL } from "src/api/axios";

const IndividualReplayComment = (props) => {
  const {
    permissionVisibility,
    comment,
    userName,
    userImage,
    trust,
    likeCount,
    isCommentLike,
    createdAt
  } = props;

  const [totalLikes, setTotalLikes] = useState(likeCount);


  useEffect(() => {
    setTotalLikes(likeCount);
  }, [props]);

  return (
    <>
      <ListItem>
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "start", gap: "8px" }}>
            <UserAvatar
              diameter={40}
              alternateSrc={userName}
              imgSrc={
                permissionVisibility?.picture ? files(userImage, "image") : ""
              }
            />
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography component={"h5"} className="app_text_14_500">
                  {userName}
                </Typography>
                <Rating
                  size="small"
                  name="read-only"
                  max={5}
                  precision={0.5}
                  value={trust ?? 0}
                  readOnly
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }} gap={"8px"}>
                <Typography className="app_text_14">{comment}</Typography>
                <Box
                  className=""
                  sx={{ display: "flex", alignItems: "center" }}
                  gap={"8px"}
                >
                  <Typography component={"p"} className="app_text_14">
                    {moment(createdAt).fromNow()}
                  </Typography>
                  <Box className="d-flex align-items-center">
                    <IconButton
                      sx={{
                        minHeight: "unset",
                        p: 0,
                        "&:hover": { backgroundColor: "transparent" },
                      }}
                      aria-label="add to favorites"
                    >
                      {<LikeIcon isLiked={totalLikes > 0 ? true : false} size={20} />}
                    </IconButton>
                    <span className="ms-1 app_text_14_500 app_text_black_2">{totalLikes}</span>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </ListItem>
    </>
  );
};

export default withTranslation()(IndividualReplayComment);
