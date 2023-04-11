import { Box, Button, Card, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import { useLocation } from 'react-router'
import { USER_API_URL } from 'src/api/axios';
import useAxiosPrivate from 'src/hooks/useAxiosPrivate';
import NearMeIcon from "@mui/icons-material/NearMe";
import LoadingScreen from 'src/components/LoadingScreen';
import LocationLogPinPopup from './LocationLogPinPopup';
import _ from "lodash";
import getDataURL from 'src/components/map/imgToMarker';
import files from 'src/helpers/helpers';
import { CSVLink } from 'react-csv';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';



const UserLocation = () => {
    const { state } = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const [locationData, setLocationData] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [centerPoint, setCenterPoint] = useState(false);
    const [locationLogPopup, setLocationLogPopup] = useState(false)
    const [googleMarker, setGoogleMarker] = useState();
    const [CsvData, setCsvData] = useState([]);

    const { isLoading, data: locationLogs } = useQuery(
        "locationData",
        async () => {
            return await axiosPrivate
                .get(USER_API_URL.userLocation + state?.user?.id)
                .then((res) => res.data);
        },
        { refetchOnWindowFocus: false }
    );

    const groupedLocations = _.groupBy(locationLogs, 'date');
    const getLocObj = Object.keys(groupedLocations).map((date) => {
        return {
            date,
            location: groupedLocations[date]
        };
    });

    useEffect(() => {
        var arr = [];
        getLocObj?.map((item) => {
            item?.location?.map((loc) => {
                var obj = {
                    date: loc?.createdAt ? moment(loc?.createdAt).format("MMM DD YYYY h:mm A") : '',
                    address: loc?.location?.address ? loc?.location?.address : '',
                    coordinates: loc?.location?.location?.coordinates ? loc?.location?.location?.coordinates?.[1] + '-' + loc?.location?.location?.coordinates?.[0] : ''
                }
                arr.push(obj);
            });

        })
        setCsvData(arr)
    }, [locationLogs]);

    const headers = [
        { label: "date", key: "date" },
        { label: "address", key: "address" },
        { label: "coordinates", key: "coordinates" },

    ];
    let csvReport = {
        data: CsvData,
        headers: headers,
        filename: 'beemz-users-location-logs.csv'
    };
    const handleLocationClick = (data) => {
        setLocationData(data?.user)
        setCenterPoint(data?.center);
        setLocationLogPopup(true);
        const myPromise = new Promise((resolve, reject) => {
            if (!_.isEmpty(data?.user)) {
                data?.user?.map((image) => {
                    resolve(
                        getDataURL(
                            files(image?.userData?.photos, "image")
                            ,
                            "#6200ee"
                        )
                    );
                })

            } else {
                reject("error");
            }
        });
        myPromise.then(
            function (value) {
                setGoogleMarker(value);
            },
            function (error) {
            }
        );
    }
    const locationLogPopupClose = () => {
        setLocationLogPopup(false);
        setCenterPoint(false);
        setLocationData([]);
    };

    return (
        <>
            {isLoading ? <LoadingScreen />
                :
                <>
                    <div className="dashboard_header mb-4">
                        <h4 className="app_text_20_semibold mb-0 d-flex align-items-center">user locations</h4>
                    </div>
                    <Card>
                        <div className="row">
                            <div className="col-lg-8">
                                <List sx={{ width: "100%", mt: 2, bgcolor: "background.paper" }}>
                                    {getLocObj?.length > 0 ?
                                        getLocObj?.map((v) => {
                                            const labelId = `checkbox-list-label-${v?.location?._id}`;
                                            return (
                                                <ListItem
                                                    key={v.date}
                                                    secondaryAction={
                                                        <IconButton
                                                            onClick={() =>
                                                                handleLocationClick({ center: true, user: [v?.location] })
                                                            }
                                                            edge="end"
                                                            aria-label="comments"
                                                        >
                                                            <NearMeIcon sx={{ color: "#6200EE" }} />
                                                        </IconButton>
                                                    }
                                                    sx={{ py: 0.8, borderBottom: "1px solid gainsboro" }}
                                                    disablePadding
                                                >
                                                    <ListItemButton role={undefined} dense>
                                                        <ListItemText
                                                            id={labelId}
                                                            primary={moment(v?.date).format("DD/MM/YYYY")}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            );
                                        })
                                        : "user location not found"}
                                </List>
                                <Box
                                    sx={{
                                        mt: 3,
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    {

                                        locationLogs?.length > 0 ?
                                            <>
                                                <Button
                                                    onClick={() =>
                                                        handleLocationClick({
                                                            center: false, user: locationLogs
                                                        })
                                                    }
                                                    className="app_text_transform"
                                                    variant="contained"
                                                    sx={{ bgcolor: "#6200EE", "&:hover": { bgcolor: "#6200EE" }, marginInline: '2px' }}
                                                >
                                                    show on map
                                                </Button>
                                                <CSVLink  {...csvReport} >
                                                    <Button className="app_text_transform"
                                                        variant="contained"
                                                        sx={{ bgcolor: "#6200EE", "&:hover": { bgcolor: "#6200EE" } }}>
                                                        export location logs
                                                        <FileUploadOutlinedIcon style={{ fontSize: 18, color: "whitesmoke", margin: '2px' }} />
                                                    </Button></CSVLink>


                                            </>
                                            : ''
                                    }

                                </Box>
                            </div>
                        </div>
                    </Card>
                </>

            }
            <LocationLogPinPopup
                googleMarker={googleMarker}
                centerPoint={centerPoint}
                locationData={locationData}
                open={locationLogPopup}
                onClose={locationLogPopupClose}
            />
        </>

    )


}

export default UserLocation