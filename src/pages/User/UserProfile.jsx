import React, { useState } from 'react'
import { Button, Stack } from '@mui/material'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ChatIcon from 'src/svgComponents/ChatIcon'
import ShareIcon from 'src/svgComponents/ShareIcon'
import user_avatar from '../../assets/images/user_avatar.jpg'
import user_bg from "../../assets/images/user_profile_bg.jfif"
// import LinkingPopup from 'src/components/user/LinkingPopup';
import RequestsPopup from 'src/components/user/RequestsPopup';
import RefRequestsPopup from 'src/components/user/ReferenceRequestPopup';
import { useQuery } from 'react-query';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { USER_API_URL } from 'src/api/axios';


const UserProfile = () => {
    // const [openLinkPopup, setOpenLinkPopup] = useState(false);
    const [openReqPopup, setOpenReqPopup] = useState(false);
    const [openRefReqPopup, setOpenRefReqPopup] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    const { data: friendRequestData, refetch:friendRequestList } = useQuery("friendList", async ({ signal }) => {
        return await axiosPrivate.get(USER_API_URL.friendList, { signal}).then(res => res.data)
    },{ refetchOnWindowFocus: false });

    const { data: friendRefRequestData, refetch:friendRefRequestList } = useQuery("friendRefReqList", async ({ signal }) => {
        return await axiosPrivate.get(USER_API_URL.referencesRequest, { signal}).then(res => res.data)
    },{ refetchOnWindowFocus: false });


    // const handleClickLinkPopupOpen = () => {
    //     setOpenLinkPopup(true);
    // };
    const handleClickReqPopupOpen = async() => {
        await friendRequestList();
        setOpenReqPopup(true);
    };
    const handleClickRefReqPopupOpen = async() => {
        await friendRefRequestList();
        setOpenRefReqPopup(true);
    };

    // const handleLinkPopupClose = (value) => {
    //     setOpenLinkPopup(false);
    // };
    const handleRefPopupClose = (value) => {
        setOpenReqPopup(false);
    };
    const handleRefReqPopupClose = (value) => {
        setOpenRefReqPopup(false);
    };
    return (
        <section className='profile_wrapper'>
            <div className='container-fluid p-0'>
                <div className='row'>
                    <div className='col-lg-8'>
                        <div className='profile_header'>
                            <img src={user_bg} alt="background cover" />
                            <div className='user_avatar'>
                                <img src={user_avatar} alt='user avatar' />
                            </div>
                        </div>
                        <div className='profile_content'>
                            <div className='profile_btn_row'>
                                <Stack direction="row" spacing={2}>
                                    <Button variant='outlined app_border_primary app_text_16_semibold text-lowercase app_text_primary'>Edit Profile</Button>
                                    <Button variant='contained app_bg_primary app_text_16_semibold text-white text-lowercase' onClick={handleClickRefReqPopupOpen}>Reference Requests</Button>
                                    <Button variant='contained app_bg_primary app_text_16_semibold text-white text-lowercase' onClick={handleClickReqPopupOpen}>Requests</Button>
                                    {/* <Button variant='contained app_bg_primary app_text_16_semibold text-white text-lowercase' onClick={handleClickLinkPopupOpen}>Link</Button> */}
                                    <Button className='app_shodow_btn'><ChatIcon /></Button>
                                    <Button className='app_shodow_btn'><ShareIcon /></Button>
                                </Stack>
                            </div>
                            <div className='user_bio_container'>

                            </div>
                        </div>
                    </div>
                    <div className='col-lg-3 offset-lg-1'>
                        <div className='profile_sidebar_right'>
                            <Card className="profile_sidebar_card">
                                <CardContent>
                                    <h4 className='app_text_16_semibold mb-3'>Who to follow</h4>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Share</Button>
                                    <Button size="small">Learn More</Button>
                                </CardActions>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            {/* <LinkingPopup open={openLinkPopup} onClose={handleLinkPopupClose} /> */}
            <RequestsPopup friendRequestData={friendRequestData} open={openReqPopup} onClose={handleRefPopupClose} />
            <RefRequestsPopup friendRefRequestData={friendRefRequestData} open={openRefReqPopup} onClose={handleRefReqPopupClose} />
        </section>
    )
}

export default UserProfile