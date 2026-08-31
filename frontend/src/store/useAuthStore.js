import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    
    checkAuth: async () => {
        try {
            const res = await axiosInstance("/auth/check")
            set({authUser: res.data}) 
        } catch (err) {
            console.log("Error in checkAuth: ", err);
            set({authUser: null})
        } finally {
            set({isCheckingAuth: false})
        }
    },


    signUp: async (formData) => {
        set({isSigningUp: true})
        try {
            const res = await axiosInstance.post("/auth/signup", formData)
            set({authUser: res.data});
            toast.success("Account created successfully")
            
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isSigningUp: false})
        }
    },
    
    LogIn: async (formData) => {
        set({isLoggingIn: true})
        try {
            const res = await axiosInstance.post("/auth/login", formData)
            set({authUser: res.data})
            toast.success("User logged in successfully")
        } catch(error) {
            toast.error(error.response.data.message)
        } finally {
            set({isLoggingIn: false})
        }
    },

    logOut: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser: null})
            toast.success("Logout successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    
    updateProfile: async (profilePic) => {
        set({isUpdatingProfile: true})
        try {
            const res = await axiosInstance.put("/auth/update-profile", profilePic)
            set({authUser: res.data});
            toast.success("Profile pic uploaded successfully")
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            set({isUpdatingProfile: false})
        }
    }

}))