import { ModdedSnackbar } from './moddedMui'
import React, { useEffect, useState } from 'react';
// redux
import { useSelector, useDispatch } from "react-redux";
import { setSnackBarData } from "../stores/snackBarSlice";

export default function SnackBar(props) {
    const dispatch = useDispatch(); // redux
    const snackBarData = useSelector((state) => state.snackBarStore); // redux

    const closeSnackBar = () => {
        dispatch(setSnackBarData({ text: '', show: false })); // redux
    };

    return (
        <ModdedSnackbar
            open={snackBarData.show}
            autoHideDuration={3000}
            message={snackBarData.text}
            onClose={closeSnackBar}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
            }}
        />
    )
}