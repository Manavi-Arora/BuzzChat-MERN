import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getGroupMessages,sendGroupMessage,updateGroupReaction,updateGroupDescription,updateGroupProfilePic} from "../controllers/group.controller.js"


const router = express.Router();
router.get("/groups/get/:groupId",protectRoute, getGroupMessages);
router.post("/groups/send/:groupId",protectRoute, sendGroupMessage);
router.put("/groups/reaction/:messageId", protectRoute, updateGroupReaction);

router.put("/update-GroupProfile", protectRoute, updateGroupProfilePic);
router.put("/update-GroupDesc", protectRoute, updateGroupDescription);
export default router;