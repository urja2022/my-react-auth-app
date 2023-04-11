import { Box, Button, Menu, MenuItem, Rating, Typography } from '@mui/material'
import React, { useState } from 'react'
import StarIcon from '@mui/icons-material/Star';
import files from 'src/helpers/helpers';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { withTranslation } from 'react-i18next';
import EarthIcon from 'src/assets/svgs/EarthIcon';
import FollowIcon from 'src/assets/svgs/FollowIcon';
import LocationPin from 'src/assets/svgs/FollowIcon';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { authStore } from 'src/contexts/AuthProvider';
import _ from 'lodash';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { useMutation, useQueryClient } from 'react-query';
import { SOCIAL_MEDIA_URL } from 'src/api/axios';
import FollowingIcon from 'src/assets/svgs/FollowingIcon';
import AppTooltip from 'src/components/common/AppTooltip';
import UserAvatar from 'src/components/common/UserAvatar';
import LockIcon from 'src/assets/LockIcon';

const SocialPostHeader = (props) => {
    const { userName, userImage, userTrust, businessName, businessImage, businessId, isFollow, visibility, address, createdAt, permission, postId, postTitle, postUserId, repost } = props;
    const { _id: profileId } = authStore((state) => state.user);
    const [anchorEl, setAnchorEl] = useState(null);
    const [deletePostOpenPopup, setDeletePostOpenPopup] = useState(false)
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const navigate = useNavigate()

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const ITEM_HEIGHT = 48;

    const deletePostOpenPopupClick = () => {
        setDeletePostOpenPopup(true)
        handleClose();
    }

    const deletePostClosePopupClick = () => {
        setDeletePostOpenPopup(false)
    }

    const reportPostClick = () => {
        navigate(PATH_DASHBOARD.general.report, { state: { subjecType: 5 } })
        handleClose();
    }

    // const userFollowClick = async(data) => {
    //     await userFollow(data)
    //   }

    //   const { mutateAsync: userFollow } = useMutation(
    //     async (data) => {
    //       return await axiosPrivate.post(
    //         SOCIAL_MEDIA_URL.userFollow,
    //         JSON.stringify(data)
    //       );
    //     },
    //     {
    //       onSuccess: (res) => {
    //         queryClient.invalidateQueries(["fetchPosts"]);
    //       },
    //       onError: (error) => {

    //       },
    //     }
    //   );

    return (
        <>
            <Box className='' sx={{ marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box display={"flex"} alignItems={"start"} gap={"14px"}>
                    <UserAvatar
                        diameter={40}
                        imgSrc={permission?.visibility?.picture ? files(businessId ? businessImage : userImage, "image") : ""}
                        alternateSrc={businessId ? businessName : userName}
                    />
                    <Box className=''>
                        <Typography component={"h5"} className='app_text_16 mb-0 app_text_transform ' sx={{ lineHeight: 1 }}>
                            {businessId ? businessName : userName}
                        </Typography>
                        {businessId ?
                            <></>
                            :
                            <Box display={"flex"} alignItems={"center"} gap={"8px"} className="mt-1">
                                <Typography component={"span"} className='app_text_14 app_text_transform '>
                                    trust level
                                </Typography>
                                <Rating size="small" name="read-only" max={5} precision={0.5} value={userTrust} readOnly emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
                            </Box>
                        }
                        {_.isEmpty(repost) ?
                            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {visibility ? <LockIcon /> : <EarthIcon />}
                                {!_.isEmpty(address?.name) && !permission?.location?.notShared ?
                                    <>
                                        <LocationPin w="16" h="16" />
                                        <Typography component={"span"} className="text_limit_150 app_text_14 app_text_transform ">
                                            {address?.name}
                                        </Typography>
                                    </>
                                    :
                                    <></>
                                }
                                <Typography component={"span"} className="app_text_14 app_text_transform ms-1">
                                    <FiberManualRecordIcon sx={{ width: "10px", height: "10px" }} /> {moment(createdAt).fromNow()}
                                </Typography>
                            </Box>
                            :
                            <></>
                        }
                    </Box>
                </Box>

            </Box>
        </>
    )
}

export default withTranslation()(SocialPostHeader)