import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    text: '',
    show: false
};

export const snackBarStore = createSlice({
    name: "snackBarStore",
    initialState,
    reducers: { // здесь redux аналог useState setState
        setSnackBarData: (state, action) => {
            state.text = action.payload.text;
            state.show = action.payload.show;
        },
    },
});

export const { setSnackBarData } = snackBarStore.actions;

export default snackBarStore.reducer;