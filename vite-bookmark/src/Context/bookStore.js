import {create} from 'zustand';

export const bookStore = create((set) => ({
    authorized: true,
    selected_chat: null,
    siteError: null,
    setAuthorized: (bool) => set(() => ({authorized: bool})),
    setSelectedChat: (user) => set(() => ({selected_chat: user})),
    setSiteError: (error) => set(() => ({siteError: error ? error : null}))
}));