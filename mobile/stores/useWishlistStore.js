import { create } from "zustand";
import api from "../lib/axios"

export const useWishlistStore = create((set, get) => ({
    wishlist: [],
    wishlistCount: 0,
    isLoading: false,
    isAddingToWishlist: false,
    isRemovingFromWishlist: false,

    getWishlist: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get("/api/users/wishlist");

            set({
                wishlist: data.wishlist.map(p => p._id),
                wishlistCount: data.wishlistCount,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    addToWishlist: async (productId) => {
        set({ isAddingToWishlist: true });
        try {
            await api.post("/api/users/wishlist", { productId });

            set(state => ({
                wishlist: [...state.wishlist, productId],
                wishlistCount: state.wishlistCount + 1,
            }));
        } finally {
            set({ isAddingToWishlist: false });
        }
    },

    removeFromWishlist: async (productId) => {
        set({ isRemovingFromWishlist: true });
        try {
            await api.delete(`/api/users/wishlist/${productId}`);

            set(state => ({
                wishlist: state.wishlist.filter(id => id !== productId),
                wishlistCount: state.wishlistCount - 1,
            }));
        } finally {
            set({ isRemovingFromWishlist: false });
        }
    },

    isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
    },

    toggleWishlist: async (productId) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();

        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    },
}));
