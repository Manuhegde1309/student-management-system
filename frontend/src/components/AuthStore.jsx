import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            // Actions
            setUser: (user) => set({ user, isAuthenticated: true }),

            setToken: (token) => {
                set({ token });
                // if (token) {
                //     localStorage.setItem('token', token);
                // } else {
                //     localStorage.removeItem('token');
                // }
            },

            login: (userData, token) => {
                set({
                    user: userData,
                    token: token,
                    isAuthenticated: true,
                    error: null
                });
                // localStorage.setItem('token', token);
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null
                });
                // localStorage.removeItem('token');
            },

            setLoading: (loading) => set({ loading }),

            setError: (error) => set({ error }),

            clearError: () => set({ error: null }),

            // // Initialize auth state from localStorage
            // initializeAuth: () => {
            //     const token = localStorage.getItem('token');
            //     if (token) {
            //         set({ token, isAuthenticated: true });
            //     }
            // }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);

export default useAuthStore;