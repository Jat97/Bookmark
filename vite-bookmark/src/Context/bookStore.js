import {create} from 'zustand';

export const useBookStore = create((set) => ({
    authorized: true,
    selected_chat: null,
    create_group_tab: false,
    textRef: null,
    siteError: null,
    setAuthorized: (bool) => set(() => ({authorized: bool})),
    setSelectedChat: (user) => set(() => ({selected_chat: user})),
    setCreateGroupTab: (bool) => set(() => ({create_group_tab: bool})),
    setTextEditor: (item) => set(() => ({textRef: item})),
    setSiteError: (error) => set(() => ({siteError: error ? error : null}))
}));