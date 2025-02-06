import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/"
export const useAuthStore = create((set, get) => ({
  authUserStatus: null,
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isUpdatingBio: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  friends: [],
  showFriendsOnly: false,
  statusUsers: [],
  statusLoading: false,
  token: null,
  calling: false,
  channel: null,
  onlyVoiceCall : null,


  setToken: (token) => set({ token }),
  setCalling: (calling) => set({ calling }),
  setChannel: (channel) => set({ channel }),
  setonlyVoiceCall: (onlyVoiceCall) => set({ onlyVoiceCall }),

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    get().connectSocket();
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    get().connectSocket();
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  handleCredentialResponse: async (response) => {

    const id_token = response.credential;
    try {
      const res = await axiosInstance.post("/auth/google-login", {
        id_token: id_token
      })
      set({ authUser: res.data })
      toast.success("Logged In Successfully")

    } catch (error) {
      console.log("Error in checkAuth", error.message);
      set({ authUser: null })
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  updateBio: async (data) => {
    set({ isUpdatingBio: true });
    try {
      const res = await axiosInstance.put("/auth/update-bio", data);
      set({ authUser: res.data });
      toast.success("Bio updated successfully");
    } catch (error) {
      console.log("error in update bio:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingBio: false });
    }
  },// Add a friend to the user's friends list (mutual friendship)
  addFriend: async (friendId) => {
    try {
      const res = await axiosInstance.put("/auth/update-friends", {
        friendId,
        action: "add",
      });
      // Update the authUser with the new friends data (mutual friendship)
      set({ authUser: res.data.user });
      // Refetch the friends list to ensure it's up to date
      await get().fetchFriends();
      toast.success("Friend added successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Remove a friend from the user's friends list (mutual removal)
  removeFriend: async (friendId) => {
    try {
      const res = await axiosInstance.put("/auth/update-friends", {
        friendId,
        action: "remove",
      });
      // Update the authUser with the new friends data (mutual removal)
      set({ authUser: res.data.user });
      // Refetch the friends list to ensure it's up to date
      await get().fetchFriends();
      toast.success("Friend removed successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },


  fetchFriends: async () => {
    try {
      const res = await axiosInstance.get("/auth/fetch-friends");
      set({ friends: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  toggleShowFriendsOnly: () => set((state) => ({ showFriendsOnly: !state.showFriendsOnly })),

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },


  fetchUsersWithStatus: async () => {
    try {
      const res = await axiosInstance.get("/auth/fetch-user-status");
      set({ statusUsers: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Function to update the current user's status image
  updateStatus: async (statusImage) => {
    set({ statusLoading: true });
    try {
      const res = await axiosInstance.put("/auth/update-status", { statusImage });
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ statusLoading: false });
    }
  },

  fetchAuthUserStatus: async () => {
    try {
      const res = await axiosInstance.get("/auth/fetch-authUser-status");
      set({ authUserStatus: res.data });

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch status");
    }
  },
  fetchToken: async (channelName, uid) => {
    const response = await axiosInstance.post("/auth/generate-token",
      { channelName, uid, userToCallToId: useChatStore.getState().selectedUser._id }
    );
    return response.data.token;
  },
  subscribeToCalls: () => {
    const socket = get().socket

    socket?.on("videoCall", (data) => {
      console.log(data);
      set({
        rchannelName: data.channelName,
        rtoken: data.token,
        calling: true
      })
    });
  },
  unsubscribeFromCalls: () => {
    const socket = get().socket
    socket?.off("videoCall")
  },

}));
