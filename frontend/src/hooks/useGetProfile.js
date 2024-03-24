import axios from "axios";
import { apiurl } from "../apiurl";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMyProfile } from "../redux/slice";

const useGetProfile = (id) => {
    const dispatch = useDispatch();

    const fetchMyProfile = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(apiurl + `getmyprofile/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                withCredentials: true
            });
            // console.log(response.data.user);
            dispatch(getMyProfile(response.data.user));
        } catch (error) {
            console.log("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        fetchMyProfile();
    }, [id, dispatch]);

    return fetchMyProfile; // Return the fetch function if needed outside the hook
};

export default useGetProfile;
