import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

export const useBookStore = create(
    persist((set) => ({
        is_guest: false,
        authorized: true,
        selected_chat: null,
        create_group_tab: false,
        popup: false,
        textRef: null,
        siteError: null,
        mobileView: window.innerWidth < 768,
        setGuest: (bool) => set({is_guest: bool}),  
        setAuthorized: (bool) => set(() => ({authorized: bool})),
        setSelectedChat: (user) => set(() => ({selected_chat: user})),
        setCreateGroupTab: (bool) => set(() => ({create_group_tab: bool})),
        setPopup: (bool) => set(() => ({popup: bool})), 
        setTextEditor: (item) => set(() => ({textRef: item})),
        setSiteError: (error) => set(() => ({siteError: error ? error : null}))
    }),
    {
        name: 'bookStorage',
        partialize: (state) => ({
            is_guest: state.is_guest
        }),
        storage: createJSONStorage(() => localStorage)
    })
);