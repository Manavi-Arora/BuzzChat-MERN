import express from "express";
import { checkAuth, login, logout, signup, updateProfile, updateBio,updateFriends, fetchFriends,updateStatus,fetchUsersWithStatus,fetchAuthUserStatus,googleLogin,tokenGenerateVideoCall} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google-login",googleLogin);
router.post("/generate-token",tokenGenerateVideoCall);

router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-status", protectRoute, updateStatus);
router.put("/update-bio", protectRoute, updateBio);
router.put("/update-friends", protectRoute, updateFriends);

router.get("/fetch-friends", protectRoute, fetchFriends);
router.get("/fetch-user-status", protectRoute, fetchUsersWithStatus);
router.get("/fetch-authUser-status", protectRoute, fetchAuthUserStatus);
router.get("/check", protectRoute, checkAuth);



export default router;
