import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

const useGetAllPost = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8000/api/v1/post/feedposts",
                    { withCredentials: true }
                );

                if (res.data.success) {
                    // console.log(res.data);
                    
                    dispatch(setPosts(res.data.posts));
                } else {
                    console.error("Failed to fetch posts:", res.data.message);
                }
            } catch (error) {
                console.error("Error fetching posts:", error.response?.data || error.message);
            }
        };

        fetchAllPost();
    }, [dispatch]);
};

export default useGetAllPost;
