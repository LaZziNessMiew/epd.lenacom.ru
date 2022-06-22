import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router"
import Auth from '../pages/auth'
// bootstrap
import Image from 'react-bootstrap/Image'
// redux
import { useSelector, useDispatch } from "react-redux"
import { setLoggedInfo } from "../stores/loggedInfoSlice";
// front-cookies
import Cookies from 'js-cookie';
import Link from 'next/link'
import LinearProgress from '@mui/material/LinearProgress';

import { setLogout } from '../middleware/utils'

export default function TopBar(props) {
    const dispatch = useDispatch(); // redux   
    const router = useRouter();
    // states
    const [pageLoaded, setPageLoaded] = useState(false)
    const [show, setShow] = useState(router.pathname.split('/')[1] == 'auth' ? false : true);

    const loggedInfo = useSelector((state) => state.loggedInfoStore); // redux
    const [userLogin, setUserLogin] = useState('')

    const [showAuthBlock, setShowAuthBlock] = useState(false);
    const [showUserWindow, setShowUserWindow] = useState(false);
    const [showLinearProgress, setShowLinearProgress] = useState(false);

    useEffect(() => {
        setShow(router.pathname.split('/')[1] == 'auth' ? false : true)
        setShowAuthBlock(false)
        setShowUserWindow(false)
    }, [props])

    useEffect(() => {
        getUserLogin()
    }, [loggedInfo])

    const getUserLogin = async () => {
        if (typeof Cookies.get('token') != 'undefined') {
            let req = await fetch(`/api/users/getUser?token=${Cookies.get('token')}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            let msg
            if (req.status != 502) {
                let res = await req.json()
                if (req.status == 200) {
                    setUserLogin(res.data.login.substr(0, 1).toUpperCase())
                }
            } else {
                msg = 'Проверьте интернет соединение'
            }
        }
    }
    useEffect(() => {
        router.events.on('routeChangeStart', () => { setShowLinearProgress(true) })
        router.events.on('routeChangeComplete', () => { setShowLinearProgress(false) })

        dispatch(setLoggedInfo({ logged: typeof Cookies.get('token') != 'undefined' ? true : false })); // redux
        setPageLoaded(true)
        getUserLogin()
    }, [])

    const inputButtonAutorization = () => {
        setShowAuthBlock(!showAuthBlock)
    };

    const goTo = (link) => {
        router.push(link)
    }

    const openCloseShowUserWindow = () => {
        setShowUserWindow(!showUserWindow)
    }
    const logout = () => {
        dispatch(setLoggedInfo({ logged: false })); // redux
        setLogout()
    }

    // кнопка добавить пост EPD
    const isPageNew = router.pathname.split('/')[2] == 'new' ? true : false
    const goCreatePost = async () => {
        router.push('/social/new')
    }
    const goCreateForum = async () => {
        router.push({
            pathname: '/forum/new',
            query: 'forum=' + router.query.nametag
        })
    }
    const goCreateRek = async () => {
        router.push('/banner/new')
    }

    function logoComponent() {
        if (router.pathname.split('/')[1].split('?')[0] == 'smi') {
            return (
                <>
                    <Link href="/" onClick={(e) => { e.preventDefault() }} passHref>
                        <a>
                            <Image
                                src=
                                "/images/logo/logo_lena.png"
                                className='mainLogo'
                                onClick={() => { goTo('/') }}
                            />
                        </a>
                    </Link>
                    <Link href="/smi" onClick={(e) => { e.preventDefault() }} passHref>
                        <a>
                            <Image
                                src=
                                "/images/logo/logo_smi.png"
                                className='subLogo'
                                onClick={() => { goTo('/smi') }}
                            />
                        </a>
                    </Link>
                </>
            )
        } else if (router.pathname.split('/')[1].split('?')[0] == 'social') {
            return (
                <>
                    <Link href="/" onClick={(e) => { e.preventDefault() }} passHref>
                        <a>
                            <Image
                                src=
                                "/images/logo/logo_lena.png"
                                className='mainLogo'
                                onClick={() => { goTo('/') }}
                            />
                        </a>
                    </Link>
                    <Link href="/social" onClick={(e) => { e.preventDefault() }} passHref>
                        <a>
                            <Image
                                src=
                                "/images/logo/logo_social.png"
                                className='subLogo'
                                onClick={() => { goTo('/social') }}
                            />

                        </a>
                    </Link >
                </>
            )
        } else if (router.pathname.split('/')[1].split('?')[0] == 'forum') {
            return (
                <>
                    <Link href="/" onClick={(e) => { e.preventDefault() }} passHref>
                        <a>
                            <Image
                                src=
                                "/images/logo/logo_lena.png"
                                className='mainLogo'
                                onClick={() => { goTo('/') }}
                            />
                        </a>
                    </Link>
                    <Link href="/forum" onClick={(e) => { e.preventDefault() }} passHref>
                        <a>
                            <Image
                                src=
                                "/images/logo/logo_forum.png"
                                className='subLogo'
                                onClick={() => { goTo('/forum') }}
                            />
                        </a>
                    </Link>
                </>
            )
        } else if (router.pathname.split('/')[1].split('?')[0] == 'poleznoe') {
            return (
                <>
                    <Link href="/" onClick={(e) => { e.preventDefault() }} passHref>
                        <a>
                            <Image
                                src=
                                "/images/logo/logo_lena.png"
                                className='mainLogo'
                                onClick={() => { goTo('/') }}
                            />
                        </a>
                    </Link>
                    <Link href="/poleznoe" onClick={(e) => { e.preventDefault() }} passHref>
                        <a>
                            <Image
                                src=
                                "/images/logo/logo_polezno.png"
                                className='subLogo'
                                onClick={() => { goTo('/poleznoe') }}
                            />
                        </a>
                    </Link>
                </>
            )
        } else if (router.pathname.split('/')[1].split('?')[0] == 'yaknet') {
            return (
                <>
                    <Link href="/" onClick={(e) => { e.preventDefault() }} passHref>
                        <a>
                            <Image
                                src=
                                "/images/logo/logo_lena.png"
                                className='mainLogo'
                                onClick={() => { goTo('/') }}
                            />
                        </a>
                    </Link>
                    <Link href="/yaknet" onClick={(e) => { e.preventDefault() }} passHref>
                        <a>
                            <Image
                                src=
                                "/images/logo/logo_yaknet.png"
                                className='subLogo'
                                onClick={() => { goTo('/yaknet') }}
                            />
                        </a>
                    </Link>
                </>
            )
        } else if (router.pathname.split('/')[1].split('?')[0] == 'banner') {
            return (
                <>
                    <Link href="/" onClick={(e) => { e.preventDefault() }} passHref>
                        <a>
                            <Image
                                src=
                                "/images/logo/logo_lena.png"
                                className='mainLogo'
                                onClick={() => { goTo('/') }}
                            />
                        </a>
                    </Link>
                    <Link href="/banner" onClick={(e) => { e.preventDefault() }} passHref>
                        <a>
                            <Image
                                src=
                                "/images/logo/logo_banner.png"
                                className='subLogo'
                                onClick={() => { goTo('/banner') }}
                            />
                        </a>
                    </Link>
                </>
            )
        } else {
            return (
                <Link href="/" onClick={(e) => { e.preventDefault() }} passHref>
                    <a>
                        <Image
                            src=
                            "/images/logo/logo.png"
                            className='mainLogo'
                            onClick={() => { goTo('/') }}
                        />
                    </a>
                </Link>
            )
        }
    }

    return (
        <div className={`topBar ${!show && 'hidden'}`}>
            <div className="topbarFixed">
                {showLinearProgress ? <LinearProgress sx={{ position: "fixed", left: "0px", top: "0px", width: "100vw", height: "1px" }} /> : null}
                {logoComponent()}
                {pageLoaded ? (!loggedInfo.logged) ?
                    <>
                        <button className="bigBlueButton topbarButton" onClick={inputButtonAutorization}>Войти</button>
                        {showAuthBlock ? <div className="topbarMenuHiddenArea"><div className="topbarAuthBlock"><Auth /></div></div> : null}
                    </> :
                    <>

                        {isPageNew ? null : <div className='topbarUser' onClick={openCloseShowUserWindow} >{userLogin}</div>}
                        {isPageNew ? null : !showUserWindow ? null :
                            <div className="topbarMenuHiddenArea">
                                <div className='topbarUserMenuBlock'>
                                    {/*<div className="topbarUserMenuBlockChild" onClick={logout}><span>Настройки</span></div>*/}
                                    <div className="topbarUserMenuBlockChild" onClick={logout}><span>Выйти</span></div>
                                </div>
                            </div>
                        }

                    </>
                    :
                    null
                }
                {pageLoaded ?
                    <>
                        {isPageNew ? null : (router.pathname.split('/')[1] == 'forum' && typeof router.pathname.split('/')[2] != 'undefined') ? <button className="bigBlueButton topbarButton" onClick={goCreateForum}>Создать</button> : null}
                        {isPageNew ? null : router.pathname.split('/')[1] == 'banner' ? <button className="bigBlueButton topbarButton" onClick={goCreateRek}>Добавить</button> : null}
                    </>
                    :
                    null
                }
            </div>
        </div>
    )
}
