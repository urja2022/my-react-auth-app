/* eslint-disable no-undef */
import React, { useEffect, useState, useContext } from "react";
import { LoadScript, Marker, InfoWindow, Polyline } from "@react-google-maps/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { USER_API_URL } from "src/api/axios";
import InfoWindowContent from "src/components/home/InfoWindowContent";
import useStore, { authStore } from "src/contexts/AuthProvider";
import { UserRole } from "src/utils/enum";
import Google from "src/components/map/Google";
import LocationLogs from "src/components/home/LocationLogs";
import TrackRequest from "src/components/home/TrackRequest";
import moment from "moment";
import { useSnackbar } from "notistack";
import mapMarkerPerson from "../../assets/svgs/markers/map1.svg";
import startingPoint from "../../assets/svgs/starting point.svg";
import { useLocation, useNavigate } from "react-router";
import files, { decodePolyline } from "src/helpers/helpers";
import DrivingMode from "src/components/home/DrivingMode";
import SearchWithin from "src/components/home/SearchWithin";
import { MapContext } from "src/components/layouts/MainContent";
import mapStore from "src/contexts/mapStore";
import getDataURL from "src/components/map/imgToMarker";
import { getDistance } from "geolib";
import * as geolib from 'geolib';
import LiveLocation from "src/components/home/LiveLocation";


const center = {
    lat: -26.204444,
    lng: 28.045556,
};

const Map = () => {
    const { handleSidebar, updateLatLng, onNewSearch } = useContext(MapContext);
    const userLocationData = mapStore((state) => state.userLocation);
    const polylineData = mapStore((state) => state.polylineData);
    const showPolyline = mapStore((state) => state.showPolyline);
    const setShowPolyline = mapStore((state) => state.setShowPolyline);
    const setPolylineData = mapStore((state) => state.setPolylineData);
    const { state } = useLocation();
    const [lattitudeData, setLattitudeData] = useState(-26.204444);
    const [longitudeData, setLongitudeData] = useState(28.045556);
    const googleMapKey = process.env.REACT_APP_GOOGLE_MAP_LEY;
    const [selectedCenter, setSelectedCenter] = useState(null);
    const storeData = useStore();
    const axiosPrivate = useAxiosPrivate();
    const role = authStore((state) => state.role);
    const [latLong, setLatLong] = useState(center);
    const [userKmData, setUSerKmData] = useState(0);
    const [centerLatLng, setcenterLatLng] = useState();
    const [showActivityLog, setShowActivityLog] = useState(false);
    const [activityList, setActivityList] = useState({});
    const [locationLog, setLocationLog] = useState([]);
    const [selectedActivityLog, setSelectedActivityLog] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [polylinePath, setPolylinePath] = useState([]);
    const [polylineOption, setPolylineOption] = useState({});
    const [drivingModeDuration, setDrivingModeDuration] = useState({});
    const [showTrackBox, setShowTrackBox] = useState(false);
    const [isMapItem, setIsMapItem] = useState(true);
    const [userActivityData, setUserActivityData] = useState([]);
    const [selectedUser, setSelecteduser] = useState({});
    const [searchValue, setSearchValue] = useState("");
    const [searchUserData, setSearchUserData] = useState([]);
    const queryClient = useQueryClient();
    const userLiveLocation = mapStore((state) => state.userLiveLocation);
    const setUserLiveLocation = mapStore((state) => state.setUserLiveLocation);
    const [userLiveLocationData, setUserLiveLocationData] = useState({});
    const [showLiveLocation, setShowLiveLocation] = useState(false);

    const toastMessage = (message, variant) => {
        enqueueSnackbar(message, {
            variant: variant,
            anchorOrigin: { vertical: "top", horizontal: "right" },
            autoHideDuration: 2000,
        });
    };

    async function generateImages(userData) {
        await Promise.all(
            userData.map(async (item, index) => {
                let markerColor = "";
                if (item.hasOwnProperty("employee") && Object.keys(item.employee).length > 0) {
                    markerColor = "#007cee";
                } else if (item.hasOwnProperty("category")) {
                    markerColor = "#00D1EE";
                } else if (item.hasOwnProperty("isGroup")) {
                    markerColor = "#006699";
                } else if (item?.location?.type === "geo") {
                    markerColor = "#34a853";
                }else if(item?.event_id){
                    markerColor = "#B71000";

                }
                
                else {
                    markerColor = "#6200ee";
                }
                item.markerIcon = await getDataURL(files(item.profilePic ?? item.image  ?? item?.eventImage?.[0], "image"), markerColor);
                return item;
            })
        );
    }

    // const { data: events, refetch: refetchAllEvent } = useQuery(
    //     ["events"],
    //     async ({ signal }) => {
    //         if (!searchValue) {
    //             return await axiosPrivate
    //                 .get(USER_API_URL.allEvents, {
    //                     signal,

    //                 })
    //                 .then((res) => res.data);
    //         }

    //     },
    //     { refetchOnWindowFocus: false }
    // );
    // const groupedEvents = _.groupBy(events, '_id');

    // const getEventObj = Object.keys(groupedEvents).map((_id) => {
    //     return {
    //         _id,
    //         events: groupedEvents[_id]
    //     };
    // })

    useEffect(() => {
        if (userLocationData?.length) {
            generateImages(userLocationData);
        }
    }, [userLocationData, searchValue]);

    useEffect(() => {
        setSearchUserData(userLocationData);
        setShowPolyline(false);
    }, [userLocationData]);

    // const geoLocation = () => {
    //     navigator.geolocation.getCurrentPosition((position) => {
    //         setLatLong({
    //             lat: position.coords.latitude,
    //             lng: position.coords.longitude,
    //         });
    //     });
    // };

    // useEffect(() => geoLocation(), []);

    const userKm = (props) => {
        setUSerKmData(props.distanceKm);
        setLattitudeData(props.latitude);
        setLongitudeData(props.longitude);
        onNewSearch(false);
    };
    const searchData = () => {
        queryClient.invalidateQueries(["userLocation"]);
        const centerLatLng = {
            lat: Number(lattitudeData),
            lng: Number(longitudeData),
        };
        setSearchValue(null);
        setcenterLatLng(centerLatLng);
        onNewSearch(true);
    };

    const { mutateAsync: locationId } = useMutation(async (data) => {
        if (data) return await axiosPrivate.get(USER_API_URL.userActivityList + data).then((res) => setUserActivityData(res.data));
    });

    const { mutateAsync } = useMutation(
        async (data) => {
            if (data) return await axiosPrivate.post(USER_API_URL.userTracing + data);
        },
        {
            onSuccess: (res) => {
                if (res) {
                    if (res.data.userTrace === 3) {
                        if (showActivityLog) {
                            handlePolyline(selectedActivityLog ?? selectedUser);
                        } else {
                            handleDirection(selectedActivityLog ?? selectedUser);
                        }
                    } else toastMessage(res.data.message, "success");
                    traceHistoryList();
                }
            },
            onError: (error) => {
                if (error.response) toastMessage(error.response.data.message, "error");
            },
        }
    );

    const { mutateAsync: getDirection } = useMutation(
        async (data) => {
            if (data) return await axiosPrivate.post(USER_API_URL.getDirection, data);
        },
        {
            onSuccess: (response) => {
                if (response) {
                    var result = response.data;
                    if (result.status !== "ZERO_RESULTS") {
                        setDrivingModeDuration(result.routes[0].legs[0]);
                        var arrayOfCoordinate = decodePolyline(result.routes[0]?.overview_polyline?.points);
                        setPolylinePath(arrayOfCoordinate);

                        if (polylinePath.length > 0) {
                            setPolylineOption({
                                strokeColor: "#000000",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: "#000000",
                                fillOpacity: 0.35,
                                clickable: false,
                                draggable: false,
                                editable: false,
                                visible: true,
                                radius: 30000,
                                paths: polylinePath,
                                zIndex: 1,
                            });
                            setShowPolyline(true);
                        }
                    } else {
                        setPolylinePath([]);
                        setPolylineOption({});
                        setDrivingModeDuration({});
                        toastMessage("Not able to fetch route from API", "error");
                    }
                }
            },
            onError: (error) => {
                if (error.response) toastMessage(error.response.data.message, "error");
            },
        }
    );

    const showMap = async (mapDrivingMode = "driving") => {
        if (!polylineData && (!polylineData?.location || !polylineData?.address?.location)) {
            setShowPolyline(false);
            return toastMessage("We can not fetch location!", "error");
        }
        if (latLong.lat && latLong.lng) {
            var origins = `${latLong.lat},${latLong.lng}`;
            var destinations = "";
            if (polylineData?.location) {
                destinations = `${polylineData.location.coordinates[1]},${polylineData.location.coordinates[0]}`;
            } else if (polylineData?.address?.location) {
                destinations = `${polylineData.address.location.coordinates[1]},${polylineData.address.location.coordinates[0]}`;
            }
            let obj = {
                origin: origins,
                destination: destinations,
                mode: mapDrivingMode === "bicycling" ? "driving" : mapDrivingMode,
            };
            getDirection(obj);
        } else {
            return toastMessage("Something went wrong!", "error");
        }
    };

    const handleDirection = (user, flag) => {
        setPolylineData(user);
        setSelecteduser(user);
        setIsMapItem(false);
        setSelectedCenter(null);
        if (showTrackBox && flag && flag === "location_log") {
            setShowActivityLog(true);
        } else {
            handlePolyline(user);
        }
        if ((user.userId || user.id) && showTrackBox) {
            locationId(user.userId ?? user.id);
        }
    };

    useEffect(() => {
        let activityArray = {};
        if (userActivityData && userActivityData.length > 0) {
            userActivityData.map((data, i) => {
                var date = moment(data.createdAt).format("DD-MM-YYYY");
                if (Object.keys(activityArray).length > 0 && activityArray[date]) {
                    activityArray[date].push(data);
                } else {
                    activityArray[date] = [data];
                }
            });
            setActivityList(activityArray);
        }
    }, [userActivityData]);

    const handleLocationLogBack = () => {
        setShowActivityLog(false);
        setLocationLog([]);
        setActivityList({});
        setPolylinePath([]);
        setPolylineOption({});
        setIsMapItem(true);
    };

    const handleLocationLog = (value) => {
        if (value === "all") {
            setLocationLog(userActivityData);
        } else {
            if (value.length > 0) {
                setLocationLog(value);
            }
        }
    };

    const handleActivityLog = () => {
        if (selectedUser && selectedUser?.userId) {
            var id = selectedUser?.userId || selectedUser?.id;
            mutateAsync(id);
        }
    };

    const handleTrackBack = () => {
        setShowTrackBox(false);
        navigate(-1);
        setIsMapItem(true);
    };

    useEffect(() => {
        if (state && state.showTraceBox) {
            setShowTrackBox(true);
            traceRequestList();
            traceHistoryList();
            userRefechLinkListData();
        }
    }, [state]);

    const handleMapFeedItemIcon = (flag) => setIsMapItem(flag);

    const handleCloseDrivingMode = () => {
        setShowPolyline(false);
        setShowTrackBox(false);
        setSelectedActivityLog(null);
        setIsMapItem(true);
        if (showActivityLog) {
            handleLocationLogBack();
        }
        if (showTrackBox) {
            handleTrackBack();
        }
    };

    const handlePolyline = (user) => {
        if (latLong.lat && latLong.lng) {
            setTimeout(() => {
                setShowPolyline(true);
            }, 1000);
        } else {
            toastMessage("We can not fetch your location!", "error");
        }
    };

    const handleSearchUserData = (data) => setSelecteduser(data);

    useEffect(() => {
        handleSidebar(showActivityLog || showTrackBox || showPolyline);
    }, [showActivityLog, showTrackBox, showPolyline, handleSidebar]);

    const handleOnDragEnd = (latlng) => {
        updateLatLng(latlng);
    };

    const handleUserLiveLocation = (user) => {
        setUserLiveLocationData(user);
    }

    useEffect(() => {
        if (showTrackBox && userLiveLocation) {
            if (userLiveLocation.location && userLiveLocationData) {
                const distance = getDistance(
                    { latitude: latLong.lat, longitude: latLong.lng },
                    { latitude: userLiveLocation.location.coordinates[1], longitude: userLiveLocation.location.coordinates[0] }
                );
                const distanceKm = geolib.convertDistance(distance, 'km');
                let obj = {
                    'fullName': (userLiveLocationData?.fullName || userLiveLocationData?.name),
                    'location': userLiveLocation.location,
                    'userId': userLiveLocationData?.userId,
                    '_id': userLiveLocationData?._id,
                    'name': userLiveLocationData?.userName,
                    'distance': distanceKm
                };
                setSearchUserData([obj]);
                setShowLiveLocation(true);
            } else {
                toastMessage("We can not fetch location!", "error");
            }
        }
    }, [userLiveLocation])

    const handleCloseLiveLocation = () => {
        setShowLiveLocation(false);
        setUserLiveLocationData({});
        setUserLiveLocation({});
        setIsMapItem(true);
        if (showTrackBox) {
            handleTrackBack();
        }
    }

    return (
        <>
            <div className='home_wrapper '>
                {/* {userKmData > 30 && !showPolyline && !showActivityLog && !showTrackBox && !showLiveLocation ? <SearchWithin onSearch={searchData} /> : <></>} */}

                {!showPolyline && showActivityLog && activityList && !showLiveLocation && (
                    <LocationLogs
                        activityList={activityList}
                        handleLocationLogBack={() => handleLocationLogBack()}
                        handleLocationLog={handleLocationLog}
                        handleMapFeedItemIcon={handleMapFeedItemIcon}
                    />
                )}

                {state && showTrackBox && !showActivityLog && !showPolyline && !showLiveLocation && (
                    // <TrackRequest
                    //     handleTrackBack={handleTrackBack}
                    //     traceRequestData={traceRequestData}
                    //     traceHistoryData={traceHistoryData}
                    //     userLinkListData={userLinkListData}
                    //     handleDirection={handleDirection}
                    //     userTracing={mutateAsync}
                    //     handleSearchUserData={handleSearchUserData}
                    //     traceRequestList={traceRequestList}
                    //     traceHistoryList={traceHistoryList}
                    //     userRefechLinkListData={userRefechLinkListData}
                    //     userProfileData={userProfileData}
                    //     handleUserLiveLocation={handleUserLiveLocation}
                    // />
                    <></>
                )}

                {showPolyline && (
                    <DrivingMode
                        showMap={showMap}
                        drivingModeDuration={drivingModeDuration}
                        handleCloseDrivingMode={() => handleCloseDrivingMode()}
                    />
                )}

                {showTrackBox && showLiveLocation && <LiveLocation userData={userLiveLocationData} handleCloseLiveLocation={() => handleCloseLiveLocation()} />}

                <div className='home_map_wrapper'>
                    <LoadScript googleMapsApiKey={googleMapKey} id='script-loader'>
                        <Google
                            centerLatLng={centerLatLng}
                            distanceAllKm={userKm}
                            handleOnDragEnd={handleOnDragEnd}
                            options={{
                                streetViewControl: false,
                                scaleControl: false,
                                mapTypeControl: false,
                                panControl: false,
                                zoomControl: false,
                                rotateControl: false,
                                fullscreenControl: false,
                                minZoom: 3,
                            }}
                            center={latLong}>
                            {/* {showPolyline && polylinePath && polylineOption ? (
                                <>
                                    <Polyline path={polylinePath} options={polylineOption} />
                                    <Marker
                                        position={{
                                            lat: polylinePath && polylinePath.length > 0 && polylinePath[0].lat,
                                            lng: polylinePath && polylinePath.length > 0 && polylinePath[0].lng,
                                        }}
                                        icon={{ url: startingPoint }}></Marker>
                                    <Marker
                                        position={{
                                            lat: polylinePath && polylinePath.length > 0 && polylinePath[polylinePath.length - 1].lat,
                                            lng: polylinePath && polylinePath.length > 0 && polylinePath[polylinePath.length - 1].lng,
                                        }}
                                        icon={{ url: mapMarkerPerson }}></Marker>
                                </>
                            ) : (
                                <></>
                            )} */}

                            {locationLog && locationLog.length > 0 ? (
                                <>
                                    {locationLog.map((user, index) => (
                                        <Marker
                                            key={index}
                                            position={{
                                                lat: user.location.coordinates[1],
                                                lng: user.location.coordinates[0],
                                            }}
                                            icon={{ url: mapMarkerPerson }}
                                            onClick={() => setSelectedActivityLog(user)}
                                            onMouseOver={() => setSelectedActivityLog(user)}></Marker>
                                    ))}
                                </>
                            ) : showActivityLog && activityList ? (
                                ""
                            ) : searchUserData && searchUserData.length > 0 ? (

                                <>
                                    {searchUserData.map((user, index) => {
                                        return (
                                            <Marker
                                                key={index}
                                                position={{
                                                    lat: user?.location?.coordinates[1],
                                                    lng: user?.location?.coordinates[0],
                                                }}
                                                icon={{ url: user.markerIcon }}
                                                // icon={{
                                                //   url: user?.isBusiness
                                                //     ? mapMarkerBusiness
                                                //     : mapMarkerPerson,
                                                // }}
                                                onClick={() => setSelectedCenter(user)}
                                                onMouseOver={() => setSelectedCenter(user)}></Marker>
                                        );
                                    })}
                                </>
                            ) : (
                                <></>


                            )}
                            {(selectedCenter || selectedActivityLog) && (
                                <InfoWindow
                                    position={{
                                        lng: selectedActivityLog
                                            ? selectedActivityLog.location.coordinates[0]
                                            : selectedCenter.location?.coordinates[0],
                                        lat: selectedActivityLog
                                            ? selectedActivityLog.location.coordinates[1]
                                            : selectedCenter.location?.coordinates[1],
                                    }}>
                                    <InfoWindowContent
                                        
                                        userFullName={selectedCenter?.fullName || selectedCenter?.name || selectedCenter?.title}
                                        eventId = {selectedCenter?.event_id}
                                        eventStartsOn = {selectedCenter?.eventStartDate}
                                        eventStartTime= {selectedCenter?.startTime}
                                        eventDescription= {selectedCenter?.description}
                                        employeeData={selectedCenter?.employee}
                                        category={selectedCenter?.category?.name}
                                        userId={selectedCenter?.userId}
                                        businessId={selectedCenter?.id}
                                        name={selectedCenter?.name}
                                        distance={selectedCenter?.distance}
                                        selfAsContact={selectedCenter?.selfAsContact}
                                        chatPermission={selectedCenter?.chatPermission}
                                        permission={selectedCenter?.permissions}
                                        selectedMapOption={selectedCenter?.userId ? "people" : "other"}
                                        status={selectedCenter?.status && selectedCenter?.status}
                                        time={selectedActivityLog?.createdAt}
                                        address={selectedActivityLog?.location?.address}
                                        handleDirection={showActivityLog ? handleActivityLog : handleDirection}
                                        onmouseleave={() => (showActivityLog ? setSelectedActivityLog(null) : setSelectedCenter(null))}
                                        isMapItem={isMapItem}
                                        isBusiness={selectedCenter?.isBusiness}
                                        isGroup={selectedCenter?.isGroup}
                                        description={selectedCenter?.description}
                                        trustLevel={selectedCenter?.averageTrust}
                                        locationType={selectedCenter?.location?.type}
                                        phoneData={selectedCenter?.phone_data}
                                    />
                                </InfoWindow>
                            )}
                        </Google>
                    </LoadScript>
                </div>
            </div>
        </>
    );
};

export default Map;
