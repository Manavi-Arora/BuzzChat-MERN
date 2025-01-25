import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getGroupMessages,sendGroupMessage,updateGroupReaction,updateGroupDescription,updateGroupProfilePic,fetchUserGroups,createGroup,getGroupWithMembers} from "../controllers/group.controller.js"


const router = express.Router();
router.get("/get/:groupId",protectRoute, getGroupMessages);
router.post("/send/:groupId",protectRoute, sendGroupMessage);
router.put("/reaction/:messageId", protectRoute, updateGroupReaction);

router.get("/fetch-groups", protectRoute, fetchUserGroups);
router.post("/create-group", protectRoute, createGroup);
router.put("/update-GroupProfile/:groupId", protectRoute, updateGroupProfilePic);
router.put("/update-GroupDesc/:groupId", protectRoute, updateGroupDescription);
router.get('/get-membersInfo/:groupId', getGroupWithMembers);
export default router;