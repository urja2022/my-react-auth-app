import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Link, List, ListItem, ListItemIcon, ListItemText, Stack, TextField } from "@mui/material"
import imageExtensions from 'image-extensions';
import AppTooltip from "src/components/common/AppTooltip";
import { Box, Typography } from '@material-ui/core';

const ReportView = () => {
    const [reportData, setReportData] = useState();
    const { state } = useLocation();

    useEffect(() => {
        setReportData(state?.reportData)
    }, [state])

    function getExtension(filename) {
        return filename.toString().split('.').pop()
    }
    return (
        <>
            <div className='row'>
                <div className="col-md-6">
                    <h4 className="app_text_20_semibold ps-3 d-flex align-items-center">report details</h4>
                </div>
            </div>
            <Card className='shadow border border-1 mt-4'>
                <List sx={{ alignItems: 'center' }}>
                    <ListItem>
                        <ListItemText
                            sx={{ flex: '0 0 120px' }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", width: '100%' }}>
                                <Typography component={"h6"} className="app_text_14_600" sx={{ flexGrow: 1 }}>
                                    user name:
                                </Typography>
                                <Typography component={"span"} className="app_text_14_500 flex-shrink-0">
                                    {reportData?.user?.name ? reportData?.user?.name : '-'}
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
                                    {reportData?.message ? reportData?.message : '-'}
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
                                    {reportData?.subject ? reportData?.subject : '-'}
                                </Typography>
                            </Box>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText sx={{ flex: '0 0 120px' }}>

                            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", width: '100%' }}>
                                <Typography component={"h6"} className="app_text_14_600" sx={{ flexGrow: 1 }}>
                                    report type:</Typography>
                                <Typography component={"span"} className="app_text_14_500 flex-shrink-0">
                                    {reportData?.subject ? reportData.reportType == 1 ? "common" : reportData.reportType == 2 ? "user" : reportData.reportType == 3 ? "business" : reportData.reportType == 4 ? "group" : reportData.reportType == 5 ? "feed" : reportData.reportType == 6 ? "event" : "social media" : '-'}
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
                                    {reportData?.ticketNumber ? reportData.ticketNumber : "-"}
                                </Typography>
                            </Box>

                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText sx={{ flex: '0 0 120px' }}>

                            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", width: '100%' }}>
                                <Typography component={"h6"} className="app_text_14_600" sx={{ flexGrow: 1 }}>
                                    report response:</Typography>
                                <Typography component={"span"} className="app_text_14_500 flex-shrink-0">
                                    {reportData?.replyMessage ? reportData?.replyMessage : "-"}
                                </Typography>
                            </Box>

                        </ListItemText>
                    </ListItem>
                </List>
            </Card >
            {reportData?.files?.map((val) => {
                if (imageExtensions.includes(getExtension(val))) {
                    return <>
                        <Card sx={{ display: 'flex', px: 2, py: 1, mt: 5, width: 'fit-content' }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 200, objectFit: 'cover', borderRadius: 4, objectPosition: 'center', boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;' }}
                                image={`${process.env.REACT_APP_USER_DOC_URL}${val}`}
                                // image="https://mymodernmet.com/wp/wp-content/uploads/2021/04/Nature-Sounds-For-Well-Being-03.jpg"
                                alt="report image"
                            />
                        </Card>
                    </>
                } else {
                    return <div className='col-2 my-3'>
                        <Button fullWidth className="theme_button_view" variant='contained' href={`${process.env.REACT_APP_USER_DOC_URL}${val}`} target="_blank" >{getExtension(val)}</Button>
                    </div>
                }
            })}
        </>
    )
}

export default ReportView