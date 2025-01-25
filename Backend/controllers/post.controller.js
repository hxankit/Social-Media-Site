import Post from '../models/post.model.js';
import sharp from 'sharp';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import cloudinary from '../utils/cloudinary.js';

const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        // console.log(typeof image);
        // console.log(req.body);
        const autherId = req.id;
        // console.log(autherId);


        if (!image) {
            return res.status(400).json({
                message: "Please upload an image",
                success: false,
            });

        }

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
        // console.log(fileUri);
        
        const cloudResponce = await cloudinary.uploader.upload(fileUri);
        // console.log(cloudResponce);
        // console.log(caption);
        // console.log(autherId);
        

        
        
        const post = await Post.create({
            caption,
            image: cloudResponce.secure_url,
            auther: autherId,
        });

        const user = await User.findById(autherId);
        if (user) {
            user.post.push(post._id);
            await user.save();
        }

        await post.populate({ path: "auther", select: "-password" })

        return res.status(201).json({
            message: "Post created successfully",
            success: true,
            post,
        });
    } catch (error) {
        console.error("Error creating post:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ 
                path: "auther", 
                select: "username profilepic" 
            })
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } },
                populate: { 
                    path: "auther", 
                    select: "username profilepic" 
                },
            });

        if (!posts || posts.length === 0) {
            return res.status(404).json({
                message: "No posts found",
                success: false,
            });
        }

        res.status(200).json({
            message: "All posts fetched successfully",
            success: true,
            posts, // Use "posts" to match with the expected JSON response structure
        });
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
const getUserPosts = async (req, res) => {
    try {
        const autherId = req.id;
        const post = await Post.find({ auther: autherId })
            .sort({ createdAt: -1 })
            .populate({
                path: "auther",
                select: "username,profilepic"
            })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "auther",
                    select: "username,profilepic"
                }
            })
        res.status(200).json({
            message: "All posts fetched successfully",
            success: true,
            post
        })
    } catch (error) {
        console.log(error.message);

    }
}
const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }
        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();

        return res.status(200).json({
            message: "Post liked successfully",
            success: true,

        })
    }
    catch (error) {
        console.log(error.message);

    }
}
const disLikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }
        await post.updateOne({ $pull: { likes: userId } });
        await post.save();

        return res.status(200).json({
            message: "Post disliked ",
            success: true,

        })
    }
    catch (error) {
        console.log(error.message);

    }
}
const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const { text } = req.body;

        // Validate the comment text
        if (!text) {
            return res.status(400).json({
                message: "Please add a comment",
                success: false,
            });
        }

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        // Create the comment
        const comment = await Comment.create({
            text,
            auther: userId,
            post: postId,
        });

        // Populate the author field
        await comment.populate({ path: "auther", select: "username profilepic" });

        // Add the comment to the post's comments array
        post.comments.push(comment._id);
        await post.save();

        return res.status(200).json({
            message: "Comment added successfully",
            success: true,
            comment, // This will now include the populated fields
        });
    } catch (error) {
        console.error("Error adding comment:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        // Fetch comments and populate author details
        const comments = await Comment.find({ post: postId }).populate({
            path: "auther",
            select: "username profilepic",
        });

        // Check if comments array is empty
        if (comments.length === 0) {
            return res.status(404).json({
                message: "No comments found for this post",
                success: false,
            });
        }

        // Return the comments
        return res.status(200).json({
            message: "All comments fetched successfully",
            success: true,
            comments,
        });
    } catch (error) {
        console.error("Error fetching comments:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id
        const autherId = req.id;
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }
        if (post.auther.toString() !== autherId) {
            return res.status(401).json({
                message: "You are not authorized to delete this post",
                success: false
            })
        }
        
        // 
         // Delete the post
         await post.deleteOne();

         // Find the user
         const user = await User.findById(autherId);
         if (!user) {
             console.error("User not found while deleting post");
             return res.status(404).json({
                 message: "User not found",
                 success: false,
             });
         }
 
         // Remove the post from the user's posts array
         user.post = user.post.filter((id) => id.toString() !== postId);
         await user.save();
 
         // Delete all comments related to the post
         await Comment.deleteMany({ post: postId });
        return res.status(200).json({
            message: "Post deleted successfully",
            success: true
        })
    } catch (error) {
        console.log(error.message);

    }
}
const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }
        const user = await User.findById(userId);
        if (user.bookmarks.includes(postId._id)) {
            await user.updateOne({ $pull: { bookmarks: post_id } });
            await user.save();
            return res.status(200).json({
                type: "unsaved",
                message: "Post removed from bookmarks",
                success: true
            })}
        else {
            await user.updateOne({ $addToSet: { bookmarks: post_id } });
            await user.save();
            return res.status(200).json({
                type: "saved",
                message: "Post bookmarked",
                success: true
            })
        }

    } catch (error) {

    }
}


export {
    addNewPost,
    getAllPosts,
    getUserPosts,
    likePost,
    disLikePost,
    addComment,
    getCommentsOfPost,
    deletePost,
    bookmarkPost
}