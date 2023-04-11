import React, { useEffect, useState } from "react";
import {
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useQuery } from "react-query";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { USER_API_URL, BUSINESS_API_URL } from "src/api/axios";
import { Button, Stack } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import BuildingEditable from "src/svgComponents/BuildingEditable";
import DoubleUserEditable from "src/svgComponents/DoubleUserEditable";
import CalanderCheckEditable from "src/svgComponents/CalanderCheckEditable";
import LoadingScreen from 'src/components/LoadingScreen'
import useStore, { authStore } from "src/contexts/AuthProvider";
import InfoWindowContent from "src/components/home/InfoWindowContent";
import testImg from "../../assets/images/user_avatar.jpg"
import MapCategories from "src/components/home/MapCategories";
import mapMarkerPerson from "../../assets/svgs/markers/map1.svg";
import mapMarkerBusiness from "../../assets/svgs/markers/map2.svg";
import mapMarkerEvent from "../../assets/svgs/markers/map3.svg";
import SearchWithin from "src/components/home/SearchWithin";
import Google from "../../components/map/Google";

const center = {
  lat: 21.22305573956332,
  lng: 72.83763084435434,
};
const Map = () => {
  const [selectedMapOption, setSelectedMapOption] = useState("all");
  const googleMapKey = process.env.REACT_APP_GOOGLE_MAP_LEY;
  const [lattitudeData, setLattitudeData] = useState(21.220161019286966);
  const [longitudeData, setLongitudeData] = useState(72.83550472672752);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [categoryList, setcategoryList] = useState([]);
  const [userKmData, setUSerKmData] = useState();
  const [latLong, setLatLong] = useState(center);
  const [centerLatLng, setcenterLatLng] = useState();
  const [loding, setLoding] = useState(true);
  const locationStoreData = authStore(state => state.locationStoreData);
  const storeData = useStore();
  const axiosPrivate = useAxiosPrivate();
  // const geoLocation = () => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     setLatLong({ lat: position.coords.latitude, lng: position.coords.longitude })
  //   });
  // };

  // useEffect(() => {
  //   geoLocation();
  // }, []);


  const { data: userLocationData, refetch: userLocation } = useQuery(
    "userLocationData",
    async ({ signal }) => {
      return await axiosPrivate
        .get(USER_API_URL.getLocation, {
          signal,
          params: {
            long: Number(longitudeData),
            lat: Number(lattitudeData),
            range: 30,
            skipId: storeData?.user?.id,
            type: selectedMapOption === 'all' || selectedMapOption === 'people' ? selectedMapOption : 'business',
            categoryId: selectedMapOption === 'all' || selectedMapOption === 'people' ? null : selectedMapOption,
          },
        })
        .then((res) => res.data);
    },
    { refetchOnWindowFocus: true }
  );

  useEffect(() => {
    if (selectedMapOption) {
      userLocation();
      locationStoreData(userLocationData);
    }

  }, [selectedMapOption, userLocationData]);

  useEffect(() => {
    if (userLocationData) {
      // setSearchUserData(userLocationData);
      const cate = userLocationData?.length > 0 && userLocationData?.filter(categoryData => categoryData.category).map((catData, index) => {
        return catData.category
      });
      if(cate){
        let unique = cate.filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i)
        if (categoryList.length == 0 || userLocationData.length == 0) setcategoryList(unique)
      }
    }
    setTimeout(() => {
      setLoding(false);
    }, 1800);
  }, [userLocationData])
  const handleMapOnCatOnChange = (cat) => {
    setSelectedMapOption(cat)
  }

  const mapCatData = {
    categoryList: categoryList,
    selectedMapOption: selectedMapOption,
    mapCatUpdateFunc: handleMapOnCatOnChange
  }

  const userKm = (props) => {
    setUSerKmData(props.distanceKm);
    setLattitudeData(props.latitude);
    setLongitudeData(props.longitude);
  }

  const searchData = () => {
    userLocation();
    const centerLatLng = {
      lat: Number(lattitudeData),
      lng: Number(longitudeData)
    }
    setcenterLatLng(centerLatLng);
  }

  return (
    <>
      {loding ? <LoadingScreen /> : <>
        <div className="home_wrapper">
          {userKmData > 30 ? <SearchWithin onSearch={searchData} /> : <></>}
          {categoryList && <MapCategories {...mapCatData} />}
          <div className="home_map_wrapper">

            <LoadScript googleMapsApiKey={googleMapKey} id="script-loader">
              <Google
                centerLatLng={centerLatLng}
                distanceAllKm={userKm}
                options={{
                  streetViewControl: false,
                  scaleControl: false,
                  mapTypeControl: false,
                  panControl: false,
                  zoomControl: false,
                  rotateControl: false,
                  fullscreenControl: false,
                  minZoom: 3
                }}
                center={latLong}
              >
                {userLocationData && userLocationData.length > 0 ? (
                  <>
                    {userLocationData.map((user, index) => (
                      <Marker
                        key={index}
                        position={{
                          lat: user.location.coordinates[1],
                          lng: user.location.coordinates[0],
                        }}
                        icon={{ url: user?.isBusiness ? mapMarkerBusiness : mapMarkerPerson }}
                        onClick={() => setSelectedCenter(user)}
                        onMouseOver={() => setSelectedCenter(user)}
                      />
                    ))}
                  </>
                ) : (
                  ""
                )}
                {selectedCenter && (
                  <InfoWindow
                    position={{
                      lat: selectedCenter.location.coordinates[1],
                      lng: selectedCenter.location.coordinates[0],
                    }}
                  >
                    <InfoWindowContent
                      userFullName={selectedCenter?.businessName || selectedCenter?.name}
                      userId={selectedCenter?.userId}
                      businessId={selectedCenter?.id}
                      name={selectedCenter?.name}
                      distance={selectedCenter?.distance}
                      selfAsContact={selectedCenter?.selfAsContact}
                      chatPermission={selectedCenter?.chatPermission}
                      selectedMapOption={selectedCenter?.userId ? 'people' : 'other'}
                      status={selectedCenter?.status && selectedCenter?.status}
                      onmouseleave={() => setSelectedCenter(null)}
                      isBusiness={selectedCenter?.isBusiness}
                    />
                  </InfoWindow>
                )}

              </Google>
            </LoadScript>
          </div>
        </div>
      </>
      }
    </>
  );
};

export default Map;
