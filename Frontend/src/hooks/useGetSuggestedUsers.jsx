import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSuggesstedUsers } from "@/redux/authSlice";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8000/api/v1/user/suggested",
                    { withCredentials: true }
                );

                if (res.data.success) {
                    // console.log(res.data);
                    
                    dispatch(setSuggesstedUsers(res.data.users));
                }
            } catch (error) {
                console.error("Error fetching posts:", error.response?.data || error.message);
            }
        };

        fetchSuggestedUsers();
    }, [dispatch]);
};

export default useGetSuggestedUsers;
