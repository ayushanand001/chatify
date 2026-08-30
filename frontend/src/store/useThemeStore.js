import {create} from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('theme') || 'coffee',
    toggleTheme: (data) => {
        localStorage.setItem('theme', data)
        set({theme: data})
    }
}));