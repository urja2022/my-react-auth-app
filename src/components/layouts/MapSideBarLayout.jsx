import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { EVENT_API_URL, INDIVIDUAL_API_URL, USER_API_URL } from "src/api/axios";
import useStore, { authStore } from "src/contexts/AuthProvider";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { UserRole } from "src/utils/enum";
import MapSidebar from "../home/MapSidebar";
import { getDistanceInKm } from "src/helpers/helpers";
import { useSnackbar } from "notistack";
import mapStore from "src/contexts/mapStore";
import MapCategories from "../home/MapCategories.jsx";
import MapSidebarEvent from "../home/MapSidebarEvent";

export default function MapSideBarLayout({ filterLatLong, isNewSearch }) {
  const [lattitudeData, setLattitudeData] = useState(-26.204444);
  const [longitudeData, setLongitudeData] = useState(28.045556);
  const [lattitude, setLattitude] = useState(-26.204444);
  const [longitude, setLongitude] = useState(28.045556);
  const check = mapStore((state) => state.updateUserLocation);
  const setPolylineData = mapStore((state) => state.setPolylineData);
  const setShowPolyline = mapStore((state) => state.setShowPolyline);

  const userData = useStore((state) => state.user);
  const axiosPrivate = useAxiosPrivate();
  const role = authStore((state) => state.role);

  const [categoryList, setcategoryList] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [searchValue, setSearchValue] = useState("");
  const [searchUserData, setSearchUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMapOption, setSelectedMapOption] = useState("all");
  const [showMapEvents, setShowMapEvents] = useState(false);

  // const geoLocation = () => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     setLattitude(position.coords.latitude);
  //     setLongitude(position.coords.longitude);
  //   });
  // };
  // useEffect(() => {
  //   geoLocation();
  // }, []);


  const toastMessage = (message, variant) => {
    enqueueSnackbar(message, {
      variant: variant,
      anchorOrigin: { vertical: "top", horizontal: "right" },
      autoHideDuration: 2000,
    });
  };

  useEffect(() => {
    if (isNewSearch) {
      if (filterLatLong) {
        setLattitudeData(filterLatLong.lat);
        setLongitudeData(filterLatLong.lng);
      }
    }
  }, [filterLatLong, isNewSearch]);

  useEffect(() => {
    if (filteredData.length > 0) {
      check(filteredData);
    } else {
      check(searchUserData);
    }
  }, [searchUserData, check, filteredData]);

  const { data: userProfileData } = useQuery(
    "userProfileSetting",
    async ({ signal }) => {
      if (role !== UserRole.GUEST) {
        return await axiosPrivate
          .get(INDIVIDUAL_API_URL.profile, { signal })
          .then((res) => res.data);
      }
      return {};
    },
    { refetchOnWindowFocus: false }
  );

  const handlePolyline = (user) => {
    if (lattitude && longitude) {
      setTimeout(() => {
        setShowPolyline(true);
      }, 1000);
    } else {

      toastMessage("We can not fetch your location!", "error");
    }
  };

  const handleSearchUser = (value) => setSearchValue(value.toString().replace(" ", ""));

  const handleDirection = (user) => {
    if (userProfileData?.permissions?.location?.notShared) {
      enqueueSnackbar("give location permission to use the function.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 2000,
      });
    } else {
      setPolylineData(user);
      handlePolyline(user);
    }
  };

  const { data: userLocationData, refetch: userLocation } = useQuery(
    ["userLocation", longitudeData, lattitudeData],
    async ({ signal }) => {
      if (!searchValue) return false;
      return await axiosPrivate
        .get(USER_API_URL.getLocationAdmin, {
          signal,
          params: {
            // long: Number(longitudeData),
            // lat: Number(lattitudeData),
            // range: 30,
            skipId: userData?._id,
            type: ["all", "people", "group","event"].includes(selectedMapOption) ? selectedMapOption : "business",
            categoryId: ["all", "people", "group","event"].includes(selectedMapOption) ? null : selectedMapOption,
            search: searchValue ? searchValue : "",
          },
        })
        .then((res) => res.data);
    },
    { refetchOnWindowFocus: false }
  );

  const { data: userEventAllData, refetch: userRefetchEventAllData } = useQuery(
    ["userEventAllData", longitudeData, lattitudeData],
    async ({ signal }) => {
      return await axiosPrivate
        .get(EVENT_API_URL.getAllEvent, {
          signal,
          params: {
            lat: 21.1874998,
            long: 72.8627684,
            range: 10000000000
          },
        })
        .then((res) => res.data);
    },
    { refetchOnWindowFocus: false }
  );
  // const { mutateAsync: searchPlace } = useMutation(
  //   async (data) => {
  //     if (data) return await axiosPrivate.post(USER_API_URL.searchPlace, data);
  //   },
  //   {
  //     onSuccess: (res) => {
  //       if (res) {
  //         let array = [];
  //         res.data &&
  //           res.data.length > 0 &&
  //           res.data.map((item) => {
  //             const distance = getDistanceInKm(
  //               userProfileData?.address?.location?.coordinates[1],
  //               userProfileData?.address?.location?.coordinates[0],
  //               item.geometry?.location?.lat ?? 0.0,
  //               item.geometry?.location?.lng ?? 0.0
  //             );
  //             array.push({
  //               id: item.place_id,
  //               address: item.vicinity,
  //               location: {
  //                 type: "geo",
  //                 coordinates: [
  //                   item.geometry?.location?.lng ?? 0.0,
  //                   item.geometry?.location?.lat ?? 0.0,
  //                 ],
  //               },
  //               image: item.icon ?? "",
  //               name: item.name ?? "",
  //               phone_data:item.phone_data ?? "",
  //               photos:item.photos ?? "",
  //               averageTrust: item.rating ?? 0,
  //               userStatus: "",
  //               selfAsContact: false,
  //               status: 0,
  //               distance: distance ?? 0.0,
  //             });
  //           });
  //         if (array) {
  //           if (searchUserData) {
  //             setSearchUserData([...searchUserData, ...array]);
  //           }
  //         }
  //       }
  //     },
  //     onError: (error) => {
  //       if (error?.response) toastMessage(error?.response?.data?.message, "error");
  //     },
  //   }
  // );
  // const nearbySearch = async () => {
  //   if (userProfileData && userProfileData?.address?.location) {
  //     let location = `${userProfileData?.address?.location?.coordinates[1]},${userProfileData?.address?.location?.coordinates[0]}`;
  //     let obj = { location: location, keyword: searchValue };
  //     setTimeout(() => {
  //       searchPlace(obj);
  //     }, 1000);
  //   }
  // };
  useEffect(() => {
    setSearchUserData(userLocationData);
    if (userLocationData) {
      const cate = userLocationData
        .filter((categoryData) => categoryData.category)
        .map((catData, index) => {
          return catData.category;
        });
      // userLocationData.filter((data) => data.userId && cate.unshift({ _id: "people", name: "People" }));
      const filterCat = cate.filter((cat) => Object.keys(cat).length !== 0);
      let unique = filterCat.filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i);
      if (categoryList.length === 0) setcategoryList(unique);
      setcategoryList(unique);
    }
  }, [userLocationData]);

  useEffect(() => {
    userLocation();
    setTimeout(() => {
      // nearbySearch();
    }, 1000);
  }, [searchValue]);

  const handleFiltering = (data) => {
    let filterArray = [];
    if (data && data.distance && data.trustLevel.length > 0) {
      filterArray = searchUserData.filter(
        (item) =>
          item.distance <= data.distance &&
          data.trustLevel.includes(item.averageTrust)
      );
    } else if (data && data.distance) {
      filterArray = searchUserData.filter(
        (item) => item.distance <= data.distance
      );
    } else if (data && data.trustLevel.length > 0) {
      filterArray = searchUserData.filter((item) =>
        data.trustLevel.includes(item.averageTrust)
      );
    }
    setFilteredData(filterArray);
  };

  const handleResetFiltering = () => {
    setFilteredData([]);
  };
  const handleMapOnCatOnChange = (cat) => {
    setSelectedMapOption(cat);
  };
  const handleMapEventCategory = () => {
    setShowMapEvents(true);
  };
  const mapCatData = {
    categoryList: categoryList,
    selectedMapOption: selectedMapOption,
    mapCatUpdateFunc: handleMapOnCatOnChange,
    userDataLength: userLocationData?.length,
    mapShowEventfunc: handleMapEventCategory,
  };

  useEffect(() => {
    if (selectedMapOption) {
      userLocation();
    }
  }, [selectedMapOption]);

  const handleEventSidebarClose = () => {
    setShowMapEvents(false);
  };

  return (
    <div className="map_sidebar_layout_wrapper">
      {showMapEvents ? (
        <MapSidebarEvent userEventAllData={userEventAllData} closeFunc={handleEventSidebarClose} />
      ) : (
        <MapSidebar
          userLocationData={searchUserData}
          handleDirection={handleDirection}
          handleSearchUser={handleSearchUser}
          handleFiltering={handleFiltering}
          userLocation={userLocation}
          filteredData={filteredData}
          handleResetFiltering={handleResetFiltering}
        />
      )}
      <MapCategories {...mapCatData} userLocationData={searchUserData}  type ={selectedMapOption}/>
 
    </div>
  );
}
