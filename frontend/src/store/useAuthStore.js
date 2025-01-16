import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000"
export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isUpdatingBio: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  friends : [],
  showFriendsOnly : false,

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
}));
