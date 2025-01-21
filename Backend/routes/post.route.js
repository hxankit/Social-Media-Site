import Router from 'express';
import { addNewPost, getAllPosts,getUserPosts,likePost,disLikePost,addComment, getCommentsOfPost,deletePost, bookmarkPost} from '../controllers/post.controller.js';
    import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router=Router();
router.route("/addpost").post(isAuthenticated ,upload.single("image"),addNewPost);
router.route("/feedposts").get(isAuthenticated,getAllPosts)
router.route("/alluserposts").get(isAuthenticated,getUserPosts)
router.route("/:id/like").post(isAuthenticated,likePost)
router.route("/:id/dislike").post(isAuthenticated,disLikePost)
router.route("/:id/comment").post(isAuthenticated,addComment)
router.route("/:id/postcomments").get(isAuthenticated,getCommentsOfPost)
router.route("/:id/delete").get(isAuthenticated,deletePost) 
router.route("/:id/bookmark").post(isAuthenticated,bookmarkPost)


 

export default router;