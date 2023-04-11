import { Button, Card, CardActions, CardContent, List, ListItem, ListItemIcon, Stack } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import EditPencilCircle from 'src/svgComponents/EditPencilCircle';
import LocationPinCircleBase from 'src/svgComponents/LocationPinCircleBase';
import AppTooltip from '../common/AppTooltip';
import TrustLevelReadOnly from '../common/TrustLevelReadOnly';
import UserAvatar from '../user/UserAvatar';
import UserColoredIcon from 'src/svgComponents/UserColoredIcon'
import UserPlusColoredIcon from 'src/svgComponents/UserPlusColoredIcon'
import { PATH_DASHBOARD } from "src/routes/paths";
import LinkingPopup from '../user/LinkingPopup';
import MapEditIcon from 'src/svgComponents/MapEditIcon';
import EmployeePopup from '../user/EmployeePopup';
import useStore from 'src/contexts/AuthProvider';

const MapFeedItem = ({ feedData }) => {
    const navigate = useNavigate()
    const [openLinkPopup, setOpenLinkPopup] = useState(false);
    const [requestId, setRequestId] = useState();
    const [openEmployeePopup, setOpenEmployeePopup] = useState(false);
    const [BusinessId, setBusinessId] = useState();
    const permissionsData = useStore(state => state.permissions);

    const handleRequestUserEdit = () => {
        navigate(PATH_DASHBOARD.general.userEdit, { state: { User_id: feedData?.userId } });
    };

    const handleRequestBusinessEdit = () => {
        navigate(PATH_DASHBOARD.general.businessUpdate, { state: { businessId: feedData?.id } });
    };

    const handleClickEmployeePopupOpen = (dataId) => {
        setOpenEmployeePopup(true);
        setBusinessId(dataId);
    };

    const handleEmployeePopupClose = (value) => {
        setOpenEmployeePopup(false);
        setBusinessId(false)
    };

    const handleClickLinkPopupOpen = (dataId) => {
        setOpenLinkPopup(true);
        setRequestId(dataId);
    };

    const handleLinkPopupClose = (value) => {
        setOpenLinkPopup(false);
        setRequestId(false)
    };

    return (
        <ListItem className="map_feed_listItem">
            <Card className='app_card'>
                <CardContent className='pb-2'>
                    <div className='d-flex align-items-center'>
                        <UserAvatar diameter={60} imgSrc={process.env.REACT_APP_USER_DOC_URL + (feedData?.profilePic || feedData?.image)} alternateSrc={Array.from(feedData?.fullName || feedData?.name)[0]} />
                        <Stack direction="column" className='ms-3 w-100' spacing={0.3}>
                            <span className='app_text_16_500 app_text_black text_limit_180 lh_20'>{feedData?.fullName || feedData?.name}</span>
                            <span className='app_text_12 app_text_gray'>{`@${feedData?.name}`}</span>
                            {feedData?.averageTrust && <TrustLevelReadOnly rating={feedData?.averageTrust} maxStar={5} />}
                        </Stack>
                    </div>
                    <List className='mt-3' dense>
                        <ListItem className='px-0'>
                            <ListItemIcon className='list_item_icon_modify me-2'><LocationPinCircleBase w={16} h={16} /></ListItemIcon>
                            <span className="app_text_12_fw500 app_text_gray">{`${feedData.distance} km`}</span>
                        </ListItem>
                        {feedData.userStatus && <ListItem className='px-0'>
                            <ListItemIcon className='list_item_icon_modify me-2'><EditPencilCircle w={14} h={14} /></ListItemIcon>
                            <span className="app_text_12_fw500 app_text_gray">{feedData.userStatus}</span>
                        </ListItem>}
                    </List>
                </CardContent>
                <CardActions className='pt-1 pb-3 px-3'>
                    <Stack direction={"row"} spacing={2}>
                        {permissionsData?.users?.substring(3, 4) == "1"
                            ? <AppTooltip title={"edit"} placement={'bottom'}>
                                <Button className='map_sidebar_card_btn' variant='contained'
                                    onClick={feedData?.isBusiness ? () => handleRequestBusinessEdit() : () => handleRequestUserEdit()}><MapEditIcon /></Button>
                            </AppTooltip> : ''}
                        <AppTooltip title={"linked list"} placement={'bottom'}>
                            <Button className='map_sidebar_card_btn'
                                onClick={() => handleClickLinkPopupOpen(feedData.id || feedData.userId)}
                                variant='contained'><UserColoredIcon /></Button>
                        </AppTooltip>
                        {feedData.isBusiness ? <AppTooltip title={"employee"} placement={'bottom'}>
                            <Button className='map_sidebar_card_btn'
                                onClick={() => handleClickEmployeePopupOpen(feedData?.id)}
                                variant='contained'><UserPlusColoredIcon /></Button>
                        </AppTooltip> : ""}
                    </Stack>
                </CardActions>
            </Card>
            <LinkingPopup newLinkId={requestId} open={openLinkPopup} onClose={handleLinkPopupClose} />
            <EmployeePopup newBusinessId={BusinessId} open={openEmployeePopup} onClose={handleEmployeePopupClose} />
        </ListItem>
    )
}

export default MapFeedItem