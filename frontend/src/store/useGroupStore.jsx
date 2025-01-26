import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useGroupStore = create((set, get) => ({
    groupData: null,
    groupMessages: [],
    selectedGroup: null,
    isGroupsLoading: false,
    selectedMessage: null,
    isMessagesLoading: false,
    isUpdatingGroupProfile: false,
    isUpdatingGroupDesc: false,

    setSelectedGroup: (group) => set({ selectedGroup: group }),
    setSelectedMessage: (selectedMessage) => set({ selectedMessage }),

    updateReaction: async (reactionData) => {
        const { selectedMessage, groupMessages } = get();  // Get the selected message and the messages list from the state
        if (!selectedMessage) return toast.error("No message selected for reaction.");  // Error if no message is selected

        try {
            // Make a PUT request to the backend to update the reaction on the selected message
            const res = await axiosInstance.put(`/groups/reaction/${selectedMessage._id}`, reactionData);

            // Update the local state by replacing the reaction on the selected message
            const updatedMessages = groupMessages.map((message) =>
                message._id === selectedMessage._id
                    ? { ...message, reaction: res.data.reaction }  // Replace the reaction of the selected message with the updated one
                    : message
            );

            // Update the state with the new messages list
            set({ groupMessages: updatedMessages });

            // Show a success toast
            toast.success("Reaction updated successfully.");
        } catch (error) {
            console.error("Error in updating reaction:", error);
            // Show an error toast with the backend message
            toast.error(error.response?.data?.message || "Error updating reaction");
        }
    },

    createGroup: async (groupData) => {
        try {
            const response = await axiosInstance.post('/groups/create-group', groupData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // if you use token-based authentication
                },
            });

            //console.log('Group created successfully:', response.data.group);
            toast.success('Group created successfully');
            return response.data.group;
        } catch (error) {
            console.error('Error creating group:', error.response?.data?.message || error.message);
            toast.error('Error creating group');
        }
    },
    fetchUserGroups: async () => {
        try {
            const response = await axiosInstance.get('/groups/fetch-groups', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // if you use token-based authentication
                },
            });
            set({ groups: response.data.groups })
            //console.log('Fetched groups successfully:', response.data.groups);
            return response.data.groups;
        } catch (error) {
            console.error('Error fetching groups:', error.response?.data?.message || error.message);
            toast.error('Error fetching groups');
        }
    },


    fetchGroupMessages: async (groupId) => {
        const { selectedMessage, groupMessages } = get();
        set({ isMessagesLoading: true });
        try {

            const token = localStorage.getItem('token'); // Assuming you use token-based authentication

            const response = await axiosInstance.get(`/groups/get/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ groupMessages: response.data });
            return response.data; // Return the fetched messages
        } catch (error) {
            console.error("Error fetching group messages:", error);
            return null; // You can handle errors appropriately here
        }
        finally {
            set({ isMessagesLoading: false });
        }
    },

    sendGroupMessage: async (groupId, senderId, text, image) => {
        const { selectedMessage, groupMessages } = get();
        try {
            const token = localStorage.getItem('token');

            // Prepare the message data
            const messageData = {
                senderId,
                text: text || undefined,  // If text is empty, don't send it
                image: image || undefined,  // If image is empty, don't send it
            };

            // Send the message to the backend
            const response = await axiosInstance.post(`/groups/send/${groupId}`, messageData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            //console.log(response.data);
            set({ groupMessages: [...groupMessages, response.data] });
            return response.data;  // Return the newly created message
        } catch (error) {
            console.error("Error sending message:", error);
            return null; // You can handle errors appropriately here
        }
    },

    updateGroupProfilePic: async (profilePicData) => {
        const { selectedGroup } = get();  // Get selectedGroup from state
        set({ isUpdatingGroupProfile: true });

        if (!selectedGroup) {
            return toast.error("No group selected for profile picture update.");
        }

        try {
            const response = await axiosInstance.put(`/groups/update-GroupProfile/${selectedGroup._id}`, profilePicData);

            // Update selectedGroup profilePic
            set({
                selectedGroup: {
                    ...selectedGroup,
                    profilePic: response.data.profilePic
                }
            });

            toast.success("Group profile picture updated successfully.");
        } catch (error) {
            console.error("Error in updating group profile picture:", error);
            toast.error(error.response?.data?.message || "Error updating group profile picture.");
        } finally {
            set({ isUpdatingGroupProfile: false });
        }
    },
    updateGroupDescription: async (descriptionData) => {
        const { selectedGroup } = get();  // Get selectedGroup from state
        set({ isUpdatingGroupDescription: true });

        if (!selectedGroup) {
            return toast.error("No group selected for description update.");
        }

        try {
            const response = await axiosInstance.put(`/groups/update-GroupDesc/${selectedGroup._id}`, descriptionData);

            // Update selectedGroup description
            set({
                selectedGroup: {
                    ...selectedGroup,
                    description: response.data.description
                }
            });

            toast.success("Group description updated successfully.");
        } catch (error) {
            console.error("Error in updating group description:", error);
            toast.error(error.response?.data?.message || "Error updating group description.");
        } finally {
            set({ isUpdatingGroupDescription: false });
        }
    },

    fetchGroupWithMembers: async () => {
        const { selectedGroup, groupData } = get();
        try {
            const response = await axiosInstance.get(`/groups/get-membersInfo/${selectedGroup._id}`);
            set({ groupData: response.data });

        } catch (error) {
            console.error("Error fetching group with members:", error);
        }
    },


    // subscribeToGroupMessages
    subscribeToGroupMessages: () => {
        const { selectedGroup } = get();  // Get the selected group from the state
        if (!selectedGroup) return;

        const socket = useAuthStore.getState().socket;

        // Listen for new group messages
        socket.on("newGroupMessage", (newGroupMessage) => {
            // Check if the message is from the selected group
            const isMessageFromSelectedGroup = newGroupMessage.groupId === selectedGroup._id;

            if (!isMessageFromSelectedGroup) return;

            // Update state with the new message
            set({
                groupMessages: [...get().groupMessages, newGroupMessage],
            });
        });
    },

    // unsubscribeFromGroupMessages
    unsubscribeFromGroupMessages: () => {
        const socket = useAuthStore.getState().socket;

        // Stop listening for new group messages
        socket.off("newGroupMessage");
    },



}))