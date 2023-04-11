import { DialogContent } from '@material-ui/core';
import { Box, Dialog, DialogTitle, IconButton, Link, List, ListItem, Rating, Typography } from '@mui/material';
import { width } from '@mui/system';
import React, { useEffect, useState } from 'react'
import StarIcon from '@mui/icons-material/Star';
// import avatarimage from '../../assets/images/post_img.png';
// import ReplyIcon from 'src/svgComponents/ReplyIcon';
// import CommentIcon from 'src/svgComponents/CommentIcon';
// import IndividualComment from './IndividualComment';
// import LikeIcon from "src/svgComponents/LikeIcon";
// import avatartest from '../../assets/images/post_img.png';
// import CommentInput from '../post/CommentInput';
import { withTranslation } from 'react-i18next';
import files from 'src/helpers/helpers';
import Slider from 'react-slick';
// import demovideo from "../../assets/images/bike_video.mp4"
import _ from 'lodash';
import UserAvatar from 'src/components/common/UserAvatar';
import IndividualComment from './IndividualComment';
import { POST_API_URL, SOCIAL_API_URL } from 'src/api/axios';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { useQuery } from 'react-query';

const ShowCommentsPopUp = (props) => {
    const { onClose, open, postDataId, postDataComment } = props;

    const [hideShowModal, setHideShowModal] = useState(false)
    const handleClose = (event, reason) => {
        onClose();
    };
    const [commentArray, setCommentArray] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const settings = {
        dots: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        // random:(slider)=>{
        //      console.log(slider)
        // }
    };


    //get all post comment list data
    async function fetchPostCommentList(postDataId) {
        const response = await axiosPrivate.get(POST_API_URL.getPostComments + postDataId)
        return response.data[0];
    }

    const { isLoading: loadingCommentList, data: postCommentList, refetch: refetchComments } = useQuery(['postCommentList', postDataId], () => fetchPostCommentList(postDataId), { keepPreviousData: true, })


    useEffect(() => {
        if (postCommentList) {
            setCommentArray(postCommentList?.data);
        }

    }, [postCommentList])


    useEffect(() => {
        if (postDataComment?.image?.length > 0 || postDataComment?.video?.length > 0 || postDataComment?.repost?.image?.length > 0 || postDataComment?.repost?.video?.length > 0) {
            setHideShowModal(true)
        } else {
            setHideShowModal(false)
        }
    }, [postDataComment]);

    return (

        <Dialog
            onClose={handleClose}
            open={open}
            PaperProps={{
                sx: { maxWidth: hideShowModal ? "1000px" : "500px", width: "100%", height: "700px", padding: "20px" }
            }}
        >
            <Box className='' sx={{ width: "100%", height: "100%" }} classes="commets_popsup_dialog_content">
                <Box className='row h-100 g-4'>
                    {
                        hideShowModal ? (<Box className='col-md-6 h-100'>
                            <Box sx={{ width: "100%", height: "100%", position: "relative" }} className="commets_popup_images">
                                {/* <Typography component={"span"} sx={{position:"absolute",top:"15px",right:"15px",padding:"3px 10px",color:"#ffffff",backgroundColor:"#6e6868",borderRadius:"12px",fontSize:"14px",zIndex:"1"}}>
                                  3/10 
                           </Typography> */}

                                {/* TODO : change in api get data of images and videos */}
                                <Slider {...settings}>
                                    {postDataComment?.image?.length > 0 && postDataComment?.image.map((image, index) => (
                                        <Box className='slider_image_wrapper' key={index}>
                                            <img src={files(image, "attachments")} alt="" />
                                        </Box>
                                    ))}
                                    {postDataComment?.video?.length > 0 && postDataComment?.video.map((videos, index) => (
                                        <Box className='slider_image_wrapper' key={index}>
                                            <video src={files(videos?.video, "attachments")} autoPlay controls poster={files(videos?.thumbnail, "thumb")} loop />
                                        </Box>
                                    ))}
                                    {postDataComment?.repost?.image?.length > 0 && postDataComment?.repost?.image.map((image, index) => (
                                        <Box className='slider_image_wrapper' key={index}>
                                            <img src={files(image, "attachments")} alt="" />
                                        </Box>
                                    ))}
                                    {postDataComment?.repost?.video?.length > 0 && postDataComment?.repost?.video.map((videos, index) => (
                                        <Box className='slider_image_wrapper' key={index}>
                                            <video src={files(videos?.video, "attachments")} autoPlay controls poster={files(videos?.thumbnail, "thumb")} loop />
                                        </Box>
                                    ))}
                                </Slider>
                            </Box>
                        </Box>) : (null)
                    }
                    <Box className={`${hideShowModal ? 'col-md-6' : 'col-md-12'} h-100 overflow-auto`}>
                        <Box sx={{ position: "relative", height: "100%" }}>
                            <Box className='post_overview'>
                                <Box display={"flex"} alignItems={"start"} gap={"14px"}>
                                    <UserAvatar diameter={50} alternateSrc={postDataComment?.userName} imgSrc={postDataComment?.permission?.visibility?.picture ? files(postDataComment?.userImage) : ""} on />
                                    <Box className=''>
                                        <Typography component={"h5"} className='app_text_16 mb-0 lh-1'>
                                            {postDataComment?.userName ?? ''}
                                        </Typography>
                                        <Box display={"flex"} alignItems={"center"} gap={"8px"}>
                                            <Typography component={"span"} className='app_text_14'>
                                                trust level
                                            </Typography>
                                            <Rating size="small" name="read-only" max={5} precision={0.5} value={postDataComment?.trust} readOnly emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
                                        </Box>
                                    </Box>
                                </Box>
                                <Typography component={"p"} className="app_text_14_500 mt-3">
                                    {postDataComment?.repost?.description || postDataComment?.description}
                                </Typography>
                            </Box>
                            <Box className='comments_wrapper mt-3' sx={{ maxHeight: "480px", height: "100%", overflowY: "auto", border: "1px solid #97A8BE", borderRadius: "10px", padding: "20px" }}>

                                {commentArray?.length > 0 ?
                                    <>
                                        {commentArray.map((comments, index) => (
                                            <Box className="single_comment_replt_wrapper mb-2" key={index}>
                                                <IndividualComment
                                                    comment={comments?.comment}
                                                    postId={comments?.postId}
                                                    userId={comments?.userId}
                                                    userName={comments?.userName}
                                                    userImage={comments?.userImage}
                                                    comment_Id={comments?._id}
                                                    commentId={comments?.commentId}
                                                    createdAt={comments?.createdAt}
                                                    commentCount={comments?.commnetCount}
                                                    likeCount={comments?.commentLikesCount}
                                                    trust={comments?.trust}
                                                />
                                            </Box>
                                        ))}
                                    </>
                                    :
                                    <>No Comments Found!</>
                                }
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    )
}

export default withTranslation()(ShowCommentsPopUp)