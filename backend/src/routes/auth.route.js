import express from "express";
import { checkAuth, login, logout, signup, updateProfile, updateBio,updateFriends, fetchFriends} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { fetchUserGroups, createGroup} from "../controllers/group.controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-bio", protectRoute, updateBio);
router.put("/update-friends", protectRoute, updateFriends);

router.get("/fetch-friends", protectRoute, fetchFriends);
router.get("/check", protectRoute, checkAuth);

router.get("/fetch-groups", protectRoute, fetchUserGroups);
router.post("/create-group", protectRoute, createGroup);


export default router;
