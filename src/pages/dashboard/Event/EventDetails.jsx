import { Card, CardContent, Chip, List, ListItem } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import React from "react";
import { useLocation } from "react-router";
import files from "src/helpers/helpers";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';

const EventDetails = () => {

    const { state } = useLocation();
    const eventDetails = state?.eventData;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col'>
                    <div className='user_edit_header'>
                        <h4 className="app_text_14_semibold mb-0">event details</h4>
                    </div>
                    <Box className='mt-4'>
                        <Box className='row'>
                            {eventDetails?.image?.length > 0 ?
                                <Box className='col-md-12'>
                                    <Box className="mt-4">
                                        <div className='user_edit_header'>
                                            <h4 className="app_text_14_semibold mb-0">image</h4>
                                        </div>
                                        <Box className='row'>
                                            {
                                                eventDetails?.image?.map((imageName, i) => {
                                                    return (
                                                        <Box className='col-md-3' key={i}>
                                                            <Box className="img_preview_circle_lg mt-3">
                                                                <img src={files(imageName, "image")} alt="event" />
                                                            </Box>
                                                        </Box>
                                                    )
                                                })
                                            }
                                        </Box>
                                    </Box>
                                </Box> : ''}
                            {eventDetails?.video?.length > 0 ?
                                <Box className='col-md-12'>
                                    <Box className="mt-4">
                                        <div className='user_edit_header'>
                                            <h4 className="app_text_14_semibold mb-0">video</h4>
                                        </div>
                                        <Box className='row'>
                                            {
                                                eventDetails?.video?.map((videoName, i) => {
                                                    return (
                                                        <Box className='col-md-3' key={i}>
                                                            <Box className="img_preview_circle_lg mt-3">
                                                                <video controls> <source src={files(videoName, "video")}></source> </video>
                                                            </Box>
                                                        </Box>
                                                    )
                                                })
                                            }
                                        </Box>
                                    </Box>
                                </Box> : ''}
                        </Box>
                    </Box>
                </div>
            </div>
            <div className="row">
                <div className='col'>
                    <div className='user_edit_header mt-4'>
                        <h4 className="app_text_14_semibold mb-0">Details</h4>
                    </div>
                    <Card sx={{ display: 'flex', mt: 2, width: 'fit-content', padding: "25px", backgroundColor: "#ffffff", border: "1px solid #edf4ff", boxShadow: "4px 4px 30px rgb(69 79 90 / 5%)!important", borderRadius: "15px", maxWidth: "500px", width: '100%' }}>
                        <CardContent sx={{ flex: '1 0 auto', paddingBottom: "0px !important", padding: "0px", width: "100%" }}>
                            <List disablePadding>
                                <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span className='app_text_16_500' style={{ flex: 1 }}>title</span>
                                    <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{eventDetails?.title}</span>
                                </ListItem>
                                <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span className='app_text_16_500' style={{ flex: 1 }}>description</span>
                                    <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{eventDetails?.description}</span>
                                </ListItem>
                                <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span className='app_text_16_500' style={{ flex: 1 }}>event date</span>
                                    <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{moment(eventDetails?.eventDate).format("DD MMM YYYY")}</span>
                                </ListItem>
                                <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span className='app_text_16_500' style={{ flex: 1 }}>event time</span>
                                    <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{moment(eventDetails?.time, 'hh:mm A').format("hh:mm A")}</span>
                                </ListItem>
                                <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span className='app_text_16_500' style={{ flex: 1 }}>duration</span>
                                    <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{eventDetails?.duration ? eventDetails?.duration + ' hours' : ''}</span>
                                </ListItem>
                                <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span className='app_text_16_500' style={{ flex: 1 }}>total no. of guest</span>
                                    <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{eventDetails?.noOfGuest}</span>
                                </ListItem>
                                <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span className='app_text_16_500' style={{ flex: 1 }}>event status</span>
                                    <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>
                                        {
                                            (eventDetails?.isCancle === 1) ? <Chip label="canceled" className="app_status_chip invalid" /> :
                                                (moment().format("MMM DD YYYY hh:mm") < moment(eventDetails?.eventDateTime).format("MMM DD YYYY hh:mm")) ? <Chip label="upcoming" className="app_status_chip accepted" /> : <Chip label="posted" className="app_status_chip posted" />
                                        }
                                    </span>
                                </ListItem>
                                <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span className='app_text_16_500' style={{ flex: 1 }}>event cancel reason</span>
                                    <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{eventDetails?.cancelledReason ? eventDetails?.cancelledReason : '-'}</span>
                                </ListItem>
                                <ListItem sx={{ padding: "0px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span className='app_text_16_500' style={{ flex: 1 }}>status</span>
                                    <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>
                                        {
                                            eventDetails?.status === 1 ? <Chip label="enable" className="app_status_chip accepted" /> : <Chip label="disable" className="app_status_chip invalid" />
                                        }
                                    </span>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </div>
                <div className='col'>
                    <div className='user_edit_header mt-4'>
                        <h4 className="app_text_14_semibold mb-0">location</h4>
                    </div>
                    <Card sx={{ display: 'flex', mt: 2, width: 'fit-content', padding: "25px", backgroundColor: "#ffffff", border: "1px solid #edf4ff", boxShadow: "4px 4px 30px rgb(69 79 90 / 5%)!important", borderRadius: "15px", maxWidth: "500px", width: '100%' }}>
                        <CardContent sx={{ flex: '1 0 auto', paddingBottom: "0px !important", padding: "0px", width: "100%" }}>
                            <List disablePadding>
                                {
                                    eventDetails?.eventAddressData?.map((address) => {
                                        return (
                                            <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                                <span className='app_text_16_500' style={{ flex: 1 }}><LocationOnIcon />  {address}</span>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="row">
                <div className='col'>
                    {eventDetails?.businessId ? <>
                        <div className='user_edit_header mt-4'>
                            <h4 className="app_text_14_semibold mb-0">business details</h4>
                        </div>
                        <Card sx={{ display: 'flex', mt: 2, width: 'fit-content', padding: "25px", backgroundColor: "#ffffff", border: "1px solid #edf4ff", boxShadow: "4px 4px 30px rgb(69 79 90 / 5%)!important", borderRadius: "15px", maxWidth: "500px", width: '100%' }}>
                            <CardContent sx={{ flex: '1 0 auto', paddingBottom: "0px !important", padding: "0px", width: "100%" }}>
                                <List disablePadding>
                                    {eventDetails?.userImages?.profilePic &&
                                        <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                            <span className='app_text_16_500' style={{ flex: 1 }}><ImageOutlinedIcon /></span>
                                            <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>
                                                <div className='d-flex flex-column'>
                                                    <div className="img_preview_circle">
                                                        <img src={files(eventDetails?.businessImage, "image")} alt="profile" />
                                                    </div>
                                                </div>
                                            </span>
                                        </ListItem>}
                                    {eventDetails?.businessName &&
                                        <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                            <span className='app_text_16_500' style={{ flex: 1 }}><BadgeOutlinedIcon /></span>
                                            <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{eventDetails.businessName}</span>
                                        </ListItem>}
                                    {eventDetails?.businessEmail &&
                                        <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                            <span className='app_text_16_500' style={{ flex: 1 }}><EmailOutlinedIcon /></span>
                                            <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{eventDetails.businessEmail}</span>
                                        </ListItem>}
                                    {eventDetails?.businessMobile &&
                                        <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                            <span className='app_text_16_500' style={{ flex: 1 }}><LocalPhoneOutlinedIcon /></span>
                                            <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{eventDetails.businessMobile}</span>
                                        </ListItem>}
                                </List>
                            </CardContent>
                        </Card>
                    </> : <>
                        <div className='user_edit_header mt-4'>
                            <h4 className="app_text_14_semibold mb-0">user details</h4>
                        </div>
                        <Card sx={{ display: 'flex', mt: 2, width: 'fit-content', padding: "25px", backgroundColor: "#ffffff", border: "1px solid #edf4ff", boxShadow: "4px 4px 30px rgb(69 79 90 / 5%)!important", borderRadius: "15px", maxWidth: "500px", width: '100%' }}>
                            <CardContent sx={{ flex: '1 0 auto', paddingBottom: "0px !important", padding: "0px", width: "100%" }}>
                                <List disablePadding>
                                    {eventDetails?.userImages?.profilePic &&
                                        <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                            <span className='app_text_16_500' style={{ flex: 1 }}><ImageOutlinedIcon /></span>
                                            <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>
                                                <div className='d-flex flex-column'>
                                                    <div className="img_preview_circle">
                                                        <img src={files(eventDetails?.userImages?.profilePic, "image")} alt="profile" />
                                                    </div>
                                                </div>
                                            </span>
                                        </ListItem>}
                                    {eventDetails?.userFullName &&
                                        <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                            <span className='app_text_16_500' style={{ flex: 1 }}><BadgeOutlinedIcon /></span>
                                            <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{eventDetails.userFullName}</span>
                                        </ListItem>}
                                    {eventDetails?.userEmail &&
                                        <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                            <span className='app_text_16_500' style={{ flex: 1 }}><EmailOutlinedIcon /></span>
                                            <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{eventDetails.userEmail}</span>
                                        </ListItem>}
                                    {eventDetails?.userMobile &&
                                        <ListItem sx={{ padding: "0px", marginBottom: "10px", display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                            <span className='app_text_16_500' style={{ flex: 1 }}><LocalPhoneOutlinedIcon /></span>
                                            <span className='app_text_16 app_text_gray' style={{ flex: 1 }}>{eventDetails.userMobile}</span>
                                        </ListItem>}
                                </List>
                            </CardContent>
                        </Card> </>}
                </div>
            </div>
        </div>
    )
}

export default EventDetails