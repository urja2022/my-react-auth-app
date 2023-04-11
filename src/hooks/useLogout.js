import { authStore } from "src/contexts/AuthProvider";
import { AUTH_API_URL } from "../api/axios";
import useAxiosPrivate from "./useAxiosPrivate";

const useLogout = () => {    
    const logout_ = authStore(state => state.logout) 
    const axiosPrivate = useAxiosPrivate();
    const logout = async () => {
        logout_()
        try {
            await axiosPrivate.patch(AUTH_API_URL.logout);
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout