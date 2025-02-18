const { create } = require("zustand");

export const useRefreshStore = create((set)=>({
    refresh : 0,
    setRefresh : (refresh) => set((state) => {
        return {
            refresh
        }
    })
}));