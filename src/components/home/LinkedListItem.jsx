import React from 'react'
import { Button, ListItem, ListItemButton, ListItemIcon, Stack } from '@mui/material'
import DirectionsOutlinedIcon from '@mui/icons-material/DirectionsOutlined';
import UserAvatar from '../common/UserAvatar'
import Chip from '@mui/material/Chip';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import { useMutation, useQueryClient } from 'react-query';
import { USER_API_URL } from 'src/api/axios';
import { useNavigate } from 'react-router';
import AppTooltip from '../common/AppTooltip';
import { PATH_CHAT } from 'src/routes/paths';
import files from 'src/helpers/helpers';
import UserAvatarWithNameAndID from '../user/UserAvatarWithNameAndID';
import LocationPinCheck from 'src/svgComponents/LocationPinCheck';
import Bin from 'src/svgComponents/Bin';
import NewLocationPin from 'src/svgComponents/NewLocationPin';

const LinkedListItem = ({ permissions, name, userPic, userName, handleDirection, handleLiveLocation, reqStatus, handleDeleteRequest, handleSentRequest }) => {

    const UserButtons = () => {
        return (
            <>
                <Stack spacing={1} direction={"row"}>
                    {reqStatus === 'sent' ?
                        <><Button onClick={handleSentRequest} className="app_row_btn app_bg_primary app_text_14_semibold text-white text-capitalize">Request</Button></>
                        : reqStatus ?
                            <>
                                <Button disableRipple className="app_row_btn app_bg_primary_light" onClick={handleLiveLocation}><NewLocationPin size={18} color={"#6200ee"} /></Button>
                                <Button disableRipple className="app_row_btn app_bg_primary_light" onClick={handleDirection}><LocationPinCheck size={18} color={"#6200ee"} /></Button>
                            </>
                            :
                            <><Button className="app_row_btn app_bg_primary_light app_text_12_semibold text-black text-capitalize">Pending</Button></>}
                    {reqStatus !== 'sent' && <Button disableRipple className="app_row_btn app_bg_red_light" onClick={handleDeleteRequest}><Bin size={18} color={"#fd4a4c"} /></Button>}
                </Stack>
            </>
        );
    };
    return (
        <ListItem
            className="w-100"
            secondaryAction={<UserButtons />}
            disablePadding
        >
            <ListItemButton
                disableRipple
                sx={{ my: 0, py: 2 }}
                role={undefined}
            >
                <UserAvatarWithNameAndID
                    userImg={
                        permissions?.visibility?.picture ? files(userPic, "image") : ""
                    }
                    avatarSize={40}
                    userFullName={name}
                    userId={userName}
                />
            </ListItemButton>
        </ListItem>
    );
}

export default LinkedListItem