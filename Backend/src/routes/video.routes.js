import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getAllUserVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  getisVideoLiked,
} from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").get(getAllVideos);
//   .get("/user", getAllUserVideos) // Assuming this is for getting videos by a specific user
router.route("/upload").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/:username/:userId").get(getAllUserVideos);

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

router.route("/check/isLiked/:videoId").get(getisVideoLiked);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
