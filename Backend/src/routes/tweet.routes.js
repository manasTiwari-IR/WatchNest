import { Router } from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

// unsecure routes

// secure routes
router.use(verifyJWT); // all routes below this will require JWT token
router.route("/get-tweets").get(getUserTweets);
router.route("/create-tweet").post(createTweet);
router.route("/update-tweet/:id").patch(updateTweet);
router.route("/delete-tweet/:id").delete(deleteTweet);

export default router;
