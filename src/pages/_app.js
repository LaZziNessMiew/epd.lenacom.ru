import React from 'react'
import Head from 'next/head'
// global css
import '../styles/custom-bootstrap.scss'
import '../styles/fa-all.css'

import '../styles/A_globals.css'
import '../styles/B_ads.css'
import '../styles/B_forum.css'
import '../styles/B_index.css'
import '../styles/B_retro.css'
import '../styles/B_smi.css'
import '../styles/B_social.css'

// components
import SnackBar from '../components/snackBar'
import TopBar from '../components/topBar'
import Footer from '../components/footer'
// redux для работы глобальных сторов
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import snackBarStore from "../stores/snackBarSlice";
import loggedInfoStore from "../stores/loggedInfoSlice";

const store = configureStore({
    reducer: {
        snackBarStore,
        loggedInfoStore
    },
});

function Lenacom({ Component, pageProps }) {

    return (
        <Provider store={store}>
            <Head>
                <title>Ленаком.ru</title>
            </Head>
            <TopBar />
            <SnackBar />
            <Component {...pageProps} />
            <Footer />
        </Provider >
    )
}

export default Lenacom