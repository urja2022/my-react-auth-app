import { axiosPrivate } from "../api/axios";
import { useEffect ,useState } from "react";
import useStore, { authStore,refreshStore } from "../contexts/AuthProvider";

let loop = 0;
const useAxiosPrivate = (props) => {
    const state = useStore();        

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${state?.accessToken}`;
                }
                switch (props?.type) {
                    case "business":
                        config.headers['businessid'] = state?.businessId;
                        break;
                    default:
                        break;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent &&  !refreshStore.getState().isRefreshing) {
                    refreshStore.setState({isRefreshing:true})
                    prevRequest.sent = true;
                    const newAccessToken = await state.refreshToken();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    refreshStore.setState({isRefreshing:false})
                    return axiosPrivate(prevRequest);
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [state])

    return axiosPrivate;
}

export default useAxiosPrivate;