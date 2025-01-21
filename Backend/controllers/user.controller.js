import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/dataUri.js';
import Post from '../models/post.model.js';


const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                msg: "Please fill in all fields.",
                success: false
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "User already exists.",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            username,
            email,
            password: hashedPassword
        })
        return res.status(200).json({
            message: "User registered successfully.",
            success: true
        })
    } catch (error) {
        console.log(error.message);

    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill in all the fields",
                success: false,
            });
        }

        // Find the user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false,
            });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid password",
                success: false,
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Populate posts created by the user (if needed)
        const populatedPosts = await Promise.all(
            user.post.map(async (postId) => {
                const post = await Post.findById(postId);
                return post && post.auther.equals(user._id) ? post : null;
            })
        ).then(posts => posts.filter(post => post)); // Filter out null values

        // Construct user response object
        const userResponse = {
            userId: user._id,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic,
            profilebio: user.profilebio,
            posts: populatedPosts,
            followers: user.followers,
            following: user.following,
        };

        // Send token as a secure cookie
        return res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict", // For better security
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        })
        .json({
            message: `Welcome back, ${user.username}!`,
            success: true,
            user: userResponse,
        });

    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};


const logout = async (req, res) => {
    try {
        return res.cookie('token', "", { maxAge: 0 }).json({
            message: "Logged out",
            success: true
        })
    } catch (error) {
        console.log(error.message);

    }
}
const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("this is params");

        // console.log(req.params._id);


        // Find user by ID
        const user = await User.findById(userId).select("-password");

        // Handle case where user is not found
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // If user is found, send success response
        return res.status(200).json({
            message: "Profile fetched successfully",
            success: true,
            user,
        });
    } catch (error) {
        console.error(error.message);

        // Send error response
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilepic = req.file
        let cloudResponse;

        if (profilepic) {

            const fileUri = getDataUri(profilepic)
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        if (bio) user.profilebio = bio;
        if (gender) user.gender = gender;
        if (profilepic) user.profilepic = cloudResponse.secure_url;
        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        })


    } catch (error) {
        console.log(error.message);

    }
}
const suggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password")
        if (!suggestedUsers) {
            return res.status(404).json({
                message: "Cant find other usrs",
                success: false
            })
        }
        return res.status(200).json({
            message: "Suggested users fetched successfully",
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error.message);

    }
}
const followUnfollow = async (req, res) => {
    try {
        const follower = req.id
        const following = req.params.id

        if (follower === following) {
            return res.status(400).json({
                message: "You can't follow yourself",
                success: false
            })
        }

        const user = await User.findById(follower)
        const targatedUser = await User.findById(following)

        if (!user || !targatedUser) {
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }

        const isFollowing = user.following.includes(following);

        if (isFollowing) {
            // Unfollow logic
            await Promise.all([
                User.updateOne({ _id: follower }, { $pull: { following: following } }),
                User.updateOne({ _id: following }, { $pull: { followers: follower } }),
            ]);

            return res.status(200).json({
                message: "Unfollowed successfully",
                success: true,
            });
        } else {
            // Follow logic
            await Promise.all([
                User.updateOne({ _id: follower }, { $push: { following: following } }),
                User.updateOne({ _id: following }, { $push: { followers: follower } }),
            ]);

            return res.status(200).json({
                message: "Followed successfully",
                success: true,
            });
        }
    } catch (error) {
        console.log(error.message);

    }
}



export {
    register,
    login,
    logout,
    getProfile,
    editProfile,
    suggestedUsers,
    followUnfollow

}