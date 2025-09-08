import {create} from 'zustand';

export const useBookStore = create((set) => ({
    authorized: true,
    selected_chat: null,
    textRef: null,
    siteError: null,
    setAuthorized: (bool) => set(() => ({authorized: bool})),
    setSelectedChat: (user) => set(() => ({selected_chat: user})),
    setTextEditor: (item) => set(() => ({textRef: item})),
    setSiteError: (error) => set(() => ({siteError: error ? error : null}))
}));