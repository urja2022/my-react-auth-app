// import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";
// import CommentIcon from "src/svgComponents/CommentIcon";
// import ReplyIcon from "src/svgComponents/ReplyIcon";
// import LikeIcon from "src/svgComponents/LikeIcon";
// import UserAvatar from "../common/UserAvatar";
// import SocialPostHeader from "./SocialPostHeader";
// import SocialPostImage from "./SocialPostImage";
// import postImage from "../../assets/images/post_img1.png";
// import CommentInput from "../post/CommentInput";
import { useState } from "react";
// import ShowCommentsPopUp from "./ShowCommentsPopUp";
import { withTranslation } from "react-i18next";
// import RepostIcon from "src/svgComponents/RepostIcon";
// import RePostConfirmPopup from "../user/RePostConfirmPopup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
// import { SOCIAL_MEDIA_URL } from "src/api/axios";
// import SocialRePostContent from "./SocialRePostContent";
// import PostLikesPopup from "./PostLikesPopup";
import _ from "lodash";
import { Box, Button, IconButton, Typography } from "@material-ui/core";
import SocialPostHeader from "./SocialPostHeader";
import SocialPostImage from "./SocialPostImage";
import SocialRePostContent from "./SocialRePostContent";
import LikeIcon from "src/assets/svgs/LikeIcon";
import CommentIcon from "src/svgComponents/CommentIcon";
import ShowCommentsPopUp from "./ShowCommentsPopUp";
import PostLikesPopup from "./PostLikesPopup";
import { POST_API_URL } from "src/api/axios";
// import { GifBox } from "@mui/icons-material";
// import files from "src/helpers/helpers";

const SocialPost = (props) => {
  const { postsData } = props;

  //  const [commentCount, setCommentCount] = useState(10);
  //   const postCommentfn = async (comment) => {
  //     const { commentCount: serverCommentCount } = await commentPost({ postId, comment })
  //     setCommentCount(serverCommentCount)
  // }
  const [rePostOpenPopup, setRePostOpenPopup] = useState(false);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openLikePopup, setOpenLikePopup] = useState(false);
  const [lottiPlayerLikeLoder, setLottiPlayerLikeLoder] = useState(false);
  const [postId, setPostId] = useState("");
  const [postDataComment, setPostDataComment] = useState("");
  const [isLikeStatus, setIsLikeStatus] = useState(postsData?.isLike);
  const [totalLikes, setTotalLikes] = useState(postsData?.totalLikes);
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();


  const { data: postLikesData, refetch: fetchPostLikesData } = useQuery(["fetchPostLikes", postId], async ({ signal }) => {
    if (postId) {
      const response = await axiosPrivate.get(POST_API_URL.postGetLikes.replace(":postId", postId), { signal })
      return response.data;

    }
  }, { refetchOnWindowFocus: false });



  const likePopupOpenClick = (data) => {
    setLottiPlayerLikeLoder(true)
    setPostId(data);
    setOpenLikePopup(true)
  }

  const LikePopupClose = () => {
    setLottiPlayerLikeLoder(false)
    setPostId("");
    setOpenLikePopup(false)
  }




  // Comment Popup 
  const handleOpenCommentPopup = (row) => {
    setPostId(row?._id)
    setPostDataComment(row)
    setOpenCreatePopup(true);
  }

  const commentPopupCloseClick = () => {
    setOpenCreatePopup(false);
  }


  useEffect(() => {
    if (!_.isEmpty(postLikesData)) {
      setLottiPlayerLikeLoder(false)
    }
  }, [postLikesData]);

  useEffect(() => {
    setIsLikeStatus(postsData?.isLike);
    setTotalLikes(postsData?.totalLikes);
  }, [postsData]);


  return (
    <>
      <Box
        className="social_post_wrapper"
        sx={{
          width: "100%",
          height: "auto",
          // boxShadow: "rgb(0 0 0 / 2%) 0px 1px 3px 0px, rgb(96 98 99 / 15%) 0px 0px 0px 1px",
          boxShadow: "0 0px 2px rgba(0, 0, 0, 0.4)",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: "#fff"
        }}
      >
        <SocialPostHeader
          userName={postsData?.userName ?? ""}
          userImage={postsData?.userImage}
          userTrust={postsData?.trust ?? 0}
          visibility={postsData?.visibility}
          address={postsData?.address[0]}
          createdAt={postsData?.createdAt}
          permission={postsData?.permission}
          postId={postsData?._id}
          postTitle={postsData?.title}
          postUserId={postsData?.userId}
          repost={postsData?.repost}
          isFollow={postsData?.businessId ? postsData?.isFollowBusiness : postsData?.isFollow}
          businessName={postsData?.businessName}
          businessImage={postsData?.businessImage}
          businessId={postsData?.businessId}
          postsData={postsData}
        />
        {/* title */}
        <Box sx={{ margin: "30px 0px 20px 0px" }}>
          <Typography
            component={"p"}
            sx={{ color: "#454F5A" }}
            className="app_text_18_500 mb-2 lh_20"
          >
            {postsData?.title}
          </Typography>

          <Typography
            component={"p"}
            sx={{ color: "#454F5A" }}
            className="app_text_14_500 my-2 lh_20"
          >
            {postsData?.description}
          </Typography>
        </Box>

        {/* post image */}
        {postsData?.image?.length > 0 || postsData?.video?.length > 0 ? (
          <SocialPostImage
            socialImage={postsData?.image}
            socialVideo={postsData?.video}
          />
        ) : (
          <></>
        )}


        {/* Post description */}
        {!_.isEmpty(postsData?.repost) ? (
          <Box
            sx={{
              width: "100%",
              minHeight: "100px",
              border: "1px solid #97A8BE",
              borderRadius: "10px",
              padding: "20px",
              margin: "20px 0px",
            }}
          >
            {postsData?.repost?.image?.length > 0 ||
              postsData?.repost?.video?.length > 0 ? (
              <SocialPostImage
                socialImage={postsData?.repost?.image}
                socialVideo={postsData?.repost?.video}
              />
            ) : (
              <></>
            )}

            {/* Repost post details */}
            <Box sx={{ marginTop: "18px" }}>
              <SocialRePostContent
                userName={postsData?.repost?.fullName}
                userImage={postsData?.repost?.userImage}
                userTrust={postsData?.repost?.averageTrust ?? 0}
                address={postsData?.repost?.repostAddress[0]}
                createdAt={postsData?.repost?.repostCreatedAt}
                permission={postsData?.repost?.repostPermission}
                visibility={postsData?.repost?.visibility}
                businessName={postsData?.repost?.businessName}
                businessImage={postsData?.repost?.businessImage}
                businessId={postsData?.repost?.businessId}
              />
            </Box>
            <Typography
              component={"p"}
              sx={{ color: "#454F5A", wordBreak: "break-all" }}
              className="app_text_18_semibold mb-2 lh_20"
            >
              {postsData?.repost?.title}
            </Typography>
            <Typography
              component={"p"}
              sx={{ color: "#454F5A", wordBreak: "break-all" }}
              className="app_text_14_500 my-2 lh_20"
            >
              {postsData?.repost?.description}
            </Typography>
          </Box>
        ) : (
          <></>
        )}
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={"12px"}
          className="mt-3 mb-2"
        >
          <Box className="d-flex align-items-center">
            <IconButton
              sx={{
                minHeight: "unset",
                p: 0,
                "&:hover": { backgroundColor: "transparent" },
              }}
              aria-label="add to favorites"
              onClick={() => likePopupOpenClick(postsData?._id)}
            >
              {<LikeIcon isLiked={totalLikes > 0 ? true : false} size={20} />}
            </IconButton>
            {/* <span className="ms-1 app_text_14_500 app_text_black_2">{post?.isLike}</span> */}
            <span className="ms-1 app_text_14_500 app_text_black_2">
              {totalLikes}
            </span>
          </Box>
          <Box className="d-flex align-items-center">
            <IconButton
              sx={{
                minHeight: "unset",
                p: 0,
                "&:hover": { backgroundColor: "transparent" },
              }}
              aria-label="show comment"
              onClick={() => handleOpenCommentPopup(postsData)}
            >
              <CommentIcon size={20} color={"#454f5a"} />
            </IconButton>
            {postsData?.isComment === 1 ?
              <span className="ms-1 app_text_14_500 app_text_black_2">
                {postsData?.totalComments}
              </span>
              :
              <></>
            }
          </Box>
        </Box>
      </Box>

      {/* Post like popup */}
      <PostLikesPopup lottiPlayerLikeLoder={lottiPlayerLikeLoder} LikePopuponClose={LikePopupClose} LikePopupOpen={openLikePopup} postLikesData={postLikesData} />
      {/* Comment Popup */}
      <ShowCommentsPopUp
        open={openCreatePopup}
        onClose={commentPopupCloseClick}
        postDataComment={postDataComment}
        postDataId={postId}
      />
    </>
  );
};

export default withTranslation()(SocialPost);
