import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar,getMessages,sendMessages,updateReaction } from "../controllers/message.controller.js";


const router = express.Router();
router.get("/users",protectRoute,getUsersForSidebar)
router.get("/:id",protectRoute,getMessages)

router.post("/send/:id",protectRoute,sendMessages)
router.put("/reaction/:messageId", protectRoute, updateReaction);


// Route to get all messages for a specific group
//router.get("/groups/get/:groupId",protectRoute, getGroupMessages);

// Route to send a new message to a group
//router.post("/groups/send/:groupId",protectRoute, sendGroupMessage);
//router.put("/groups/reaction/:messageId", protectRoute, updateGroupReaction);

export default router;
/*POST is used when you're creating a new resource or performing an action 
that results in a new resource being created. 
In the case of sending a message, you're initiating an action where a new message is created and sent to the recipient. This aligns with the behavior of a POST request.

PUT, on the other hand, is used when you want to update an existing resource. 
If you were modifying an existing message (e.g., editing or updating the content of a message), then a PUT request would make more sense. 
However, since sending a message is considered a creation of a new entity (a new message), POST is more appropriate.*/