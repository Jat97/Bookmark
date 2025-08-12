import {create} from 'zustand';

export const bookStore = create((set) => ({
    authorized: true,
    siteError: null,
    setAuthorized: (bool) => set(() => ({authorized: bool})),
    setSiteError: (error) => set(() => ({siteError: error ? error : null}))
}));