import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Stack, TextField } from "@mui/material"
import imageExtensions from 'image-extensions';
import AppTooltip from "src/components/common/AppTooltip";
import { Box, Typography } from '@material-ui/core';

const ContactUsView = () => {
    const [contactUsDetail, setContactUsDetail] = useState();
    const { state } = useLocation();
    console.log(state,'333');

    useEffect(() => {
        setContactUsDetail(state)
    }, [state])

    return (
        <>
            <div className='row'>
                <div className="col-md-6">
                    <h4 className="app_text_20_semibold ps-3 d-flex align-items-center">contact us details</h4>
                </div>
            </div>
            <Card className='shadow border border-1 mt-4'>
                <List sx={{ alignItems: 'center' }}>
                    <ListItem>
                        <ListItemText
                            sx={{ flex: '0 0 120px' }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", width: '100%' }}>
                                <Typography component={"h6"} className="app_text_14_600" sx={{ flexGrow: 1 }}>
                                    username:
                                </Typography>
                                <Typography component={"span"} className="app_text_14_500 flex-shrink-0">
                                    {contactUsDetail?.name ? contactUsDetail?.name : '-'}
                                </Typography>
                            </Box>
                        </ListItemText>


                    </ListItem>
                    <ListItem>
                        <ListItemText
                            sx={{ flex: '0 0 120px' }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", width: '100%' }}>
                                <Typography component={"h6"} className="app_text_14_600" sx={{ flexGrow: 1 }}>
                                   email:
                                </Typography>
                                <Typography component={"span"} className="app_text_14_500 flex-shrink-0">
                                    {contactUsDetail?.email ? contactUsDetail?.email : '-'}
                                </Typography>
                            </Box>
                        </ListItemText>


                    </ListItem>
                    <ListItem>
                        <ListItemText sx={{ flex: '0 0 120px' }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", width: '100%' }}>
                                <Typography component={"h6"} className="app_text_14_600" sx={{ flexGrow: 1 }}>
                                    subject:</Typography>
                                <Typography component={"span"} className="app_text_14_500 flex-shrink-0">
                                    {contactUsDetail?.subject ? contactUsDetail?.subject : '-'}
                                </Typography>
                            </Box>
                        </ListItemText>
                    </ListItem>

                    <ListItem>
                        <ListItemText sx={{ flex: '0 0 120px' }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", width: '100%' }}>
                                <Typography component={"h6"} className="app_text_14_600" sx={{ flexGrow: 1 }}>
                                    message: </Typography>
                                <Typography component={"span"} className="app_text_14_500 flex-shrink-0">
                                    {contactUsDetail?.message ? contactUsDetail?.message : '-'}
                                </Typography>
                            </Box>
                        </ListItemText>
                    </ListItem>
                
                    <ListItem>
                        <ListItemText sx={{ flex: '0 0 120px' }}>

                            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", width: '100%' }}>
                                <Typography component={"h6"} className="app_text_14_600" sx={{ flexGrow: 1 }}>
                                    ticket number:</Typography>
                                <Typography component={"span"} className="app_text_14_500 flex-shrink-0">
                                    {contactUsDetail?.ticketNumber ? contactUsDetail.ticketNumber : "-"}
                                </Typography>
                            </Box>

                        </ListItemText>
                    </ListItem>
                </List>
            </Card >

        </>
    )
}

export default ContactUsView