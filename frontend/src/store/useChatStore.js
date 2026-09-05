import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';
import {useAuthStore} from './useAuthStore';

export const useChatStore = create((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    isMessagesLoading: false,
    isUsersLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const user = await axiosInstance.get("/message/users");
            set({users: user.data}) 
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async (id) => {
        set({isMessagesLoading: true});
        try {
            const messages = await axiosInstance.get(`/message/${id}`);
            set({messages: messages.data});
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async(messageData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]});
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    subscribeToNewMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");

        socket.on("newMessage", (message) => {
            const selectedUser = get().selectedUser;
            if (!selectedUser) return;

            const isMessageSentFromSelectedUser = message.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, message]
            });
        });
    },

    unsubscribeFromNewMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
        }
    },

    setSelectedUser: (selectedUser) => set({selectedUser})

}))