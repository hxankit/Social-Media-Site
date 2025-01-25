import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSuggesstedUsers, setuserProfile } from "@/redux/authSlice";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    
    // const [userProfile,setuserProfile]=useState(null)
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/v1/user/${userId}/profile`,
                    { withCredentials: true }
                );

                if (res.data.success) {
                    // console.log(res.data);
                    
                    dispatch(setuserProfile(res.data.user));
                }
            } catch (error) {
                console.error("Error fetching posts:", error.response?.data || error.message);
            }
        };

        fetchUserProfile();
    }, [userId]);
};

export default useGetUserProfile;
