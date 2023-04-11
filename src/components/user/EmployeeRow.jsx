import React from 'react'
import { Card, CardContent, List, ListItem, ListItemIcon } from '@mui/material'
import UserAvatarWithNameIDAndDesignation from '../common/UserAvatarWithNameIDAndDesignation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import moment from 'moment';

const EmployeeRow = ({ workHours, userPic, designation, address, name, businessName }) => {
    return (
        <Card className='app_card border mb-3'>
            <CardContent className='pb-2'>
                <UserAvatarWithNameIDAndDesignation
                    userImg={userPic ? process.env.REACT_APP_PROFILE_URL + userPic : ""}
                    avatarSize={48}
                    userFullName={name}
                    userId={businessName}
                    designation={designation}
                />
                <List disablePadding className='mt-3' dense>
                    <ListItem sx={{ px: 0 }} className="d-flex align-items-center">
                        <ListItemIcon sx={{ minWidth: 0, pr: 1 }}><AccessTimeFilledIcon sx={{ color: "#97A8BE" }} />
                        </ListItemIcon>
                        <h4 className="app_text_primary app_text_14 mb-0"> {moment(workHours?.startTime).format('hh:mm a')} to {moment(workHours?.endTime).format('hh:mm a')}  </h4>
                    </ListItem>
                    {(address && <ListItem sx={{ px: 0 }} className="d-flex align-items-start">
                        <ListItemIcon sx={{ minWidth: 0, pr: 1 }}>
                            <LocationOnIcon sx={{ color: "#97A8BE" }} />
                        </ListItemIcon>
                        <h4 className='app_text_14 mb-0'>{address?.name}</h4>
                    </ListItem>)}
                </List>
            </CardContent>
        </Card>
    )
}

export default EmployeeRow