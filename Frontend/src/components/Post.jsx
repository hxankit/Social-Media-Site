import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { setPosts, setselectedPost } from '@/redux/postSlice';
import CommentDialog from './CommentDialog';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { Badge } from './ui/badge';

const Post = ({ post }) => {
    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const { posts } = useSelector((store) => store.posts);
    const [liked, setLiked] = useState(Array.isArray(post.likes) && user?.userId ? post.likes.includes(user.userId) : false);
    const [postLikeCount, setPostLikeCount] = useState(post.likes?.length || 0);
    const [comment, setComment] = useState(post.comments)

    // Handle input change for comments
    const changeEventHandler = (e) => {
        setText(e.target.value);
    };
    const commentHandler = async () => {
        const trimmedText = text.trim(); // Trim input before sending
        if (!trimmedText) {
            toast.error("Comment cannot be empty.");
            return;
        }
        try {
            // Send the POST request to add the comment
            const res = await axios.post(
                `http://localhost:8000/api/v1/post/${post._id}/comment`,
                { text },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);

                // Update comments locally
                const newComment = res.data.comment; // Assuming the server returns the new comment
                const updatedCommentData = [...comment, newComment];
                setComment(updatedCommentData);

                // Update Redux state
                const updatedPostData = posts.map((p) =>
                    p._id === post._id
                        ? { ...p, comments: updatedCommentData }
                        : p
                );
                dispatch(setPosts(updatedPostData));
                setText("")
            }
        } catch (error) {
            console.error("Error while adding comment:", error);
            toast.error("Failed to add comment.");
        }
    };

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(
                `http://localhost:8000/api/v1/post/${post._id}/delete`,
                { withCredentials: true }
            );
            if (res.data.success) {
                const updatedPosts = posts.filter((p) => p._id !== post._id);
                dispatch(setPosts(updatedPosts));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error deleting post:", error.message);
            toast.error("Failed to delete post.");
        }
    };

    // Like or dislike handler
    const likeDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';


            const res = await axios.get(
                `http://localhost:8000/api/v1/post/${post._id}/${action}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                const updatedLikesCount = liked ? postLikeCount - 1 : postLikeCount + 1;
                setPostLikeCount(updatedLikesCount);
                setLiked(!liked);
                // console.log(liked);


                // Update the post in the Redux store
                const updatedPosts = posts.map((p) =>
                    p._id === post._id
                        ? {
                            ...p,
                            likes: liked
                                ? p.likes.filter((id) => id !== user.userId)
                                : [...p.likes, user.userId],
                        }
                        : p
                );
                console.log("Updated Posts:", updatedPosts);
                dispatch(setPosts(updatedPosts));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error during like/dislike:", error.message);
            toast.error("Failed to update like status.");
        }
    };


    return (
        <div className="my-8 w-full max-w-sm mx-auto">
            {/* Post Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={post.auther?.profilepic} alt="post_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className='font-semibold'>{post.auther?.username}</h1>
                    {user?.userId===post?.auther?._id &&<Badge className="border=none" variant="secondry">Auther</Badge>}
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-center">
                        <Button variant="ghost" className="cursor-pointer w-fit text-[#ed4956] font-bold">
                            Unfollow
                        </Button>
                        <Button variant="ghost" className="cursor-pointer w-fit">
                            Add To Favorites
                        </Button>
                        {user?.userId === post.auther?._id && (
                            <Button
                                variant="ghost"
                                className="cursor-pointer w-fit text-[#ed4956] font-bold"
                                onClick={deletePostHandler}
                            >
                                Delete
                            </Button>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Post Image */}
            <img
                className="rounded-sm my-2 w-full aspect-square object-cover"
                src={post.image}
                alt="post_image"
            />

            {/* Post Actions */}
            <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-2">
                    {liked ? (
                        <FaHeart
                            size="22px"
                            className="cursor-pointer text-red-500"
                            onClick={likeDislikeHandler}
                        />
                    ) : (
                        <FaRegHeart
                            size="22px"
                            className="cursor-pointer hover:text-gray-600"
                            onClick={likeDislikeHandler}
                        />
                    )}
                    <MessageCircle onClick={() => {
                        dispatch(setselectedPost(post))
                        setOpen(true)
                    }} className="cursor-pointer hover:text-gray-600" />
                    <Send className="cursor-pointer hover:text-gray-600" />
                </div>
                <Bookmark className="cursor-pointer hover:text-gray-600" />
            </div>

            {/* Post Likes and Caption */}
            <span className="font-medium block mb-2">{postLikeCount} {postLikeCount === 1 ? "Like" : "Likes"}</span>
            <p>
                <span className="font-medium mr-2">{post.auther?.username}</span>
                {post.caption}
            </p>
            <span onClick={() => {
                dispatch(setselectedPost(post))
                setOpen(true)
            }} className="cursor-pointer text-sm text-gray-500">
                View all {post.comments?.length} {post.comments?.length === 1 ? "Comment" : "Comments"}

                {/* {console.log(post.comments?.length)} */}

            </span>

            {/* Comment Dialog */}
            <CommentDialog open={open} setOpen={setOpen} />

            {/* Add Comment Input */}
            <div className="flex items-center justify-between mt-2">
                <input
                    type="text"
                    placeholder="Add a comment"
                    value={text}
                    onChange={changeEventHandler}
                    className="outline-none text-sm w-full"
                />
                {text && <span onClick={commentHandler} className="text-[#38ADF8] cursor-pointer">Post</span>}
            </div>
        </div>
    );
};

export default Post;
