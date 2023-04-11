import { Box, IconButton, Button, Rating, Typography, List } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import UserAvatar from 'src/components/common/UserAvatar'
import files from 'src/helpers/helpers'
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import StarIcon from '@mui/icons-material/Star';
import LikeIcon from 'src/assets/svgs/LikeIcon'
import { POST_API_URL } from 'src/api/axios'
import { useQuery } from 'react-query'
import DownWardReplay from 'src/assets/svgs/DownWardReplay'
import IndividualReplayComment from './IndividualReplayComment'
import moment from 'moment'





const IndividualComment = (props) => {
  const { comment, userName, userImage, createdAt, postId, commentId, comment_Id, commentCount, likeCount, trust } = props;

  const [showReplay, setShowReplay] = useState(false);
  const [totalLikes, setTotalLikes] = useState(likeCount)
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setTotalLikes(likeCount);
  }, [props]);

  const replayCountClick = () => {
    setShowReplay(true)
  }
  const { data: fetchCommentsReplayData, refetch: fetchComments } = useQuery(["fetchComments", postId, commentId, showReplay], async ({ signal }) => {
    if (showReplay && postId && comment_Id && commentCount > 0) {
      const response = await axiosPrivate.get(POST_API_URL.fetchComments.replace(":id", postId), { params: { commentId: comment_Id } }, { signal })
      return response?.data
    } else {
      return []
    }
  }, { refetchOnWindowFocus: false });


  return (
    <>
      {
        !commentId &&
        <Box sx={{ display: "flex", marginBottom: "0px" }} gap={"12px"}>
          <UserAvatar diameter={40} alternateSrc={userName} imgSrc={userImage ? files(userImage, "image") : ""} />
          <Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography component={"h5"} className="app_text_16_500">{userName}</Typography>
              <Rating size="small" name="read-only" max={5} precision={0.5} value={trust ?? 0} readOnly emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }} gap={"8px"}>
              <Typography>{comment}</Typography>
              <Box className="" sx={{ display: "flex", alignItems: "self-end" }} gap={"8px"}>
                  <Typography component={"p"} className="app_text_14">{moment(createdAt).fromNow()}</Typography>
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
            {commentCount > 0 && !showReplay ?
              <Button
                onClick={() => replayCountClick()}
                sx={{ textTransform: "lowercase", minWidth: "unset", padding: "0px", fontSize: "unset", fontWeight: "unset" }}>
                <Box sx={{ marginLeft: "14px", display: "flex", alignItems: "center" }}>
                  <DownWardReplay />
                  <Typography component={"span"} className="app_text_14_500 app_text_black_2" sx={{ marginTop: "3px" }}>
                    {commentCount}
                  </Typography>
                </Box>
                <Typography component={"p"} className="app_text_10 fw-bold m-2">show replies</Typography>
              </Button>
              :
              <></>
            }
          </Box>


        </Box>
      }
      <List sx={{ padding: "0px 0px 0px 35px" }}>
        {fetchCommentsReplayData?.length > 0 ?
          <>
            {fetchCommentsReplayData.map((comments, index) => (
              <>
                <IndividualReplayComment
                  // permissionVisibility={comments?.Permission?.visibility}
                  comment={comments?.comment}
                  postId={comments?.postId}
                  userId={comments?.userId}
                  userName={comments?.userName}
                  userImage={comments?.userImage}
                  commentId={comments?._id}
                  indCommentId={commentId}
                  trust={comments?.trust}
                  likeCount={comments?.commentLikeCount}
                  isCommentLike={comments?.isCommentLike}
                  createdAt = {comments?.createdAt}
                />
              </>
            ))}
          </>
          :
          <></>
        }
      </List>
    </>
  )
}

export default withTranslation()(IndividualComment)