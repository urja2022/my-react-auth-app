import React, { useEffect, useState } from 'react'
import { Close } from '@mui/icons-material'
import { Avatar, AvatarGroup, Box, Button, Chip, Divider, IconButton } from '@mui/material'
import { useRef } from 'react'
import UserAvatarWithNameAndRating from '../common/UserAvatarWithNameAndRating'
import AddLinkIcon from '@mui/icons-material/AddLink';
import AppTooltip from '../common/AppTooltip'
import TodayIcon from '@mui/icons-material/Today';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import DirectionsIcon from '@mui/icons-material/Directions';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate'
import { EVENT_API_URL } from 'src/api/axios'
import { useQuery } from 'react-query'
import files from 'src/helpers/helpers'
import moment from 'moment'
import _ from 'lodash'
import imgNot from "../../assets/images/imageNot.png";

const MapEventDetailSidebar = ({ onCloseFunc,eventDataId }) => {
    const mapSidebarEventContentBoxRef = useRef(null);
    const axiosPrivate = useAxiosPrivate();
    const [mapSidebarEventHeaderClassName, setMapSidebarEventHeaderClassName] = useState("");
    const { data: userSingleEventData, refetch: userRefetchEventSingleData } = useQuery(
        ["userEventSingleData", eventDataId],
        async ({ signal }) => {
            if(eventDataId){
                return await axiosPrivate
                .get(EVENT_API_URL.getSignleEventDetails + eventDataId, {
                  signal,
                })
                .then((res) => res.data);
            }
        },
        { refetchOnWindowFocus: false }
      );
console.log(userSingleEventData);
    const startData = new Date(userSingleEventData?.startDate);
    const startDay = moment(startData).format('ddd');
    const startDate = moment(startData).format('DD MMMM YYYY');
    useEffect(() => {
        const scrollEvent = () => {
            if (mapSidebarEventContentBoxRef.current.scrollTop > 5) {
                setMapSidebarEventHeaderClassName("scrolling");
            } else {
                setMapSidebarEventHeaderClassName("");
            }
        };
        const scrollConst = mapSidebarEventContentBoxRef?.current;
        scrollConst.addEventListener("scroll", scrollEvent);
        return () => {
            scrollConst.removeEventListener("scroll", scrollEvent);
        };
    }, []);

    return (
        <div className='map_event_detail_sidebar_wrapper'>
            <EventHeader className={mapSidebarEventHeaderClassName} onCloseFunc={onCloseFunc} eventTitle={userSingleEventData?.name}/>
            <Box ref={mapSidebarEventContentBoxRef} className="map_sidebar_event_content">
                <EventBanner bannerImage={userSingleEventData?.image?.[0]} bannerVideo={userSingleEventData?.video}/>
                <EventTitle eventTitle={userSingleEventData?.name} eventVisblity={userSingleEventData?.visibility}/>
                <EventDivider />
                <EventDescription eventDescription={userSingleEventData?.description}/>
                <EventDivider />
                <EventCreatedBy userImage={userSingleEventData?.userImage} userName={userSingleEventData?.userName} />
                <EventDivider />
                <EventSchedule startDay={startDay} startDate={startDate} startTime={userSingleEventData?.startTime} endTime={userSingleEventData?.endTime}/>
                <EventDivider />
                <EventLocation address={userSingleEventData?.address} lat={userSingleEventData?.location?.coordinates[0]} long={userSingleEventData?.location?.coordinates[1]}/>
            </Box>
        </div>
    )
}
export default MapEventDetailSidebar

const EventDivider = () => <Divider sx={{ borderBottom: "1px solid rgb(218,220,224)" }} />

const EventHeader = ({ className, onCloseFunc,eventTitle }) => {
    return <Box className={`map_event_detail_sidebar_header ${className}`}>
        <h4 className='app_text_16_semibold app_text_black mx-auto text-center pt-1 w-100 mb-0 mt-1 text_limit_250 app_text_transform title'>{eventTitle}</h4>
        <IconButton onClick={() => onCloseFunc()} className='close_btn'><Close /></IconButton>
    </Box>
}

const EventBanner = ({bannerImage,bannerVideo}) => {
    return <Box className='map_event_sidebar_banner_image_container'>
        {!_.isEmpty(bannerImage) ?
            <img src={files(bannerImage,"image")} alt="event" />
            :
            !_.isEmpty(bannerVideo) ?
            <video controls>
                <source src={files(bannerVideo,"video")}></source>
            </video>
            :
            <img src={imgNot} alt="event" />
        }
    </Box>
}

const EventTitle = ({eventTitle,eventVisblity}) => {
    return <Box className='map_event_detail_sidebar_title'>
        <h4 className='app_text_18_semibold app_text_black text-wrap app_text-transoform'>{eventTitle}</h4>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Chip className='app_text_14_500 px-2' label={`${eventVisblity === 1 ? "public" : "private"}`} sx={{ color: '#fff', backgroundColor: '#6200ee' }} />
            <AvatarGroup max={4}>
                <Avatar sx={{ width: '32px', height: '32px' }} alt="Remy Sharp" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_ocW9x-t2gGJPKg3iqvoEfm7qJSB9ujqnqA&usqp=CAU"} />
                <Avatar sx={{ width: '32px', height: '32px' }} alt="Travis Howard" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4rsSzLimlQyniEtUV4-1raljzFhS45QBeAw&usqp=CAU"} />
                <Avatar sx={{ width: '32px', height: '32px' }} alt="Agnes Walker" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOOFMe-CzzMAgkPdsGK1wsKLtoF33HXGK98A&usqp=CAU"} />
                <Avatar sx={{ width: '32px', height: '32px' }} alt="Trevor Henderson" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXovt4Pwcx41pFucTy-Dr5ce0jRSPNyrYpNg&usqp=CAU"} />
                <Avatar sx={{ width: '32px', height: '32px' }} alt="Trevor Henderson" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXovt4Pwcx41pFucTy-Dr5ce0jRSPNyrYpNg&usqp=CAU"} />
                <Avatar sx={{ width: '32px', height: '32px' }} alt="Trevor Henderson" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXovt4Pwcx41pFucTy-Dr5ce0jRSPNyrYpNg&usqp=CAU"} />
            </AvatarGroup>
        </Box>
    </Box>
}

const EventDescription = ({eventDescription}) => {
    const [readState, setReadState] = useState("more");
    const [showReadMoreBtn, setShowReadMoreBtn] = useState(false);
    const eventDescRef = useRef(null);

    useEffect(() => {
        let descHeight = eventDescRef.current.clientHeight;
        if (descHeight >= 54) {
            setShowReadMoreBtn(true)
        } else {
            setShowReadMoreBtn(false);
        }
    }, [])

    return <Box sx={{ padding: '1rem 12px' }}>
        <h4 className='app_text_14_semibold app_text_black mb-2'>about this event</h4>
        <p ref={eventDescRef} className={`app_text_12_fw500 app_text_gray ${readState === "less" ? "" : "app_para_lineClamp_3"} mb-0`}> {eventDescription} </p>
        {showReadMoreBtn && <Button className='app_blank_btn app_text_14_semibold app_text_transform app_text_primary' sx={{ minWidth: 'unset', p: 0, display: "inline-block" }} onClick={() => setReadState(prev => prev === "more" ? "less" : 'more')}>{`read ${readState}`}</Button>}
    </Box>
}

const EventCreatedBy = ({userImage, userName}) => {
    return <Box sx={{ padding: '1rem 12px' }}>
        <h4 className='app_text_14_semibold app_text_black mb-3'>event created by</h4>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "flex-start" }}>
            <UserAvatarWithNameAndRating avatarSize={50} imgSrc={files(userImage,"image")} rating={4.5} userFullName={userName} />
            <AppTooltip title={"link with creator"}>
                <Button sx={{ height: '24px', width: '24px', minWidth: 'unset', p: 2 }} className='app_bg_primary text-white app_text_transform'><AddLinkIcon style={{ fontSize: 16 }} /></Button>
            </AppTooltip>
        </Box>
    </Box>
}

const EventSchedule = ({startDay,startDate,startTime,endTime}) => {
    return <Box sx={{ padding: '1rem 12px' }}>
        <Box sx={{ display: 'flex', maxWidth: '650px' }}>
            <Box sx={{ display: 'flex' }}>
                <div className='icon_squarebox app_bg_primary_light'>
                    <TodayIcon style={{ color: '#6200ee' }} />
                </div>
                <div className='d-flex flex-column justify-content-between align-items-start ms-3'>
                    <span className='app_text_16_500 app_text_black'>{startDate}</span>
                    <span className='app_text_14_500 app_text_gray'>{`${startDay}, ${startTime}-${endTime}`}</span>
                </div>
            </Box>
        </Box>
    </Box>
}

const EventLocation = ({address,lat,long}) => {

    const direction = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${long},${lat}`)
    }
    return <Box sx={{ padding: '1rem 12px' }}>
        <Box sx={{ display: 'flex', maxWidth: '650px', alignItems: "flex-start" }}>
            <Box sx={{ display: 'flex', flex: 1 }}>
                <div className='icon_squarebox app_bg_primary_light'>
                    <FmdGoodIcon style={{ color: '#6200ee' }} />
                </div>
                <div className='d-flex flex-column justify-content-between align-items-start ms-3'>
                    {/* <span className='app_text_14_500 app_text_black'>{address}</span> */}
                    <p style={{ maxWidth: '300px', display: "flex", flexWrap: 'wrap', lineHeight: 1.5, paddingRight: '1rem' }} className='mb-0 app_text_16_fw500 app_text_gray'>{address}</p>
                </div>
            </Box>
            <AppTooltip title={"direction"}>
                <Button onClick={direction} sx={{ height: '24px', width: '24px', minWidth: 'unset', p: 2 }} className='app_bg_primary text-white app_text_transform'><DirectionsIcon style={{ fontSize: 16 }} /></Button>
            </AppTooltip>
        </Box>
    </Box>
}
