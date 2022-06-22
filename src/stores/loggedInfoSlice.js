import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    logged: false
};

export const loggedInfoStore = createSlice({
    name: "loggedInfoStore",
    initialState,
    reducers: { // здесь redux аналог useState setState
        setLoggedInfo: (state, action) => {
            state.logged = action.payload.logged;
        },
    },
});

export const { setLoggedInfo } = loggedInfoStore.actions;

export default loggedInfoStore.reducer;