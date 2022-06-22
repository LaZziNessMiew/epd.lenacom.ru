import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
// jwt
import cookies from 'next-cookies'
import Cookies from 'js-cookie';
import { verifyToken } from '../middleware/utils';
import $ from "jquery";

// bootstrap
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

//mui
import TextField from '@mui/material/TextField';
import { FormControl, IconButton } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from "../middleware/themes";
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// redux snackbar
import { useDispatch } from "react-redux";
import { setSnackBarData } from "../stores/snackBarSlice";
import { setLoggedInfo } from "../stores/loggedInfoSlice";

export default function Auth(props) {
    const dispatch = useDispatch(); //redux

    const router = useRouter()
    const isSoloContent = router.pathname == '/auth' ? true : false
    const [email, setEmail] = useState(null)
    const [login, setLogin] = useState(null)
    const [pass, setPass] = useState(null)
    const [code, setCode] = useState(null)
    const [smsAuth, setSmsAuth] = useState(false)
    const [secondPass, setSecondPass] = useState(null)
    const [pageRegister, setPageRegister] = useState(props.regMode)
    const [viewsPass, setViewsPass] = useState(false)
    // refs
    const authForm = useRef(null)

    useEffect(() => {
        setPageRegister(props.regMode)
    }, [props])
    const smenitPageRegister = async () => {
        if ((router.pathname.split('/')[1] != 'auth')) {
            router.push('/auth?m=reg')
        } else {
            if (pageRegister == false) {
                router.push('/auth?m=reg')
            } else {
                router.push('/auth')
            }
            setPageRegister(!pageRegister)
        }
        authForm.current.reset();
    }
    const smenitSmsAuth = async () => {
        setSmsAuth(!smsAuth)
    }
    const avtorizacia = async (e) => { // edk
        e.preventDefault()
        if (authForm.current.reportValidity()) {
            let req = await fetch(`/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, pass })
            })
            let msg
            if (req.status != 502) {
                if (req.status == 203) {
                    authForm.current.reset();
                    smenitSmsAuth()
                    $('#txtFieldLoginAuth').focus()
                }
                let res = await req.json()
                if (res.logged) {
                    Cookies.set('token', res.token);
                    if (router.pathname == '/auth') {
                        if (props.withRedirect == false) {
                            router.push('/')
                        } else {
                            router.push(props.withRedirect)
                        }
                    }
                    dispatch(setLoggedInfo({ logged: true })); // redux
                }
                msg = res.msg


            } else {
                msg = 'Проверьте интернет соединение'
            }
            dispatch(setSnackBarData({ text: msg, show: true })); //redux
        }
    }
    const registracia = async (e) => { // epd
        e.preventDefault()
        if (authForm.current.reportValidity()) {
            let req = await fetch(`/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, login, pass, secondPass })
            })
            let msg
            if (req.status != 502) {
                let res = await req.json()
                msg = res.msg
                if (req.status == 200) {
                    smenitSmsAuth()
                }
            } else {
                msg = 'Проверьте интернет соединение'
            }
            dispatch(setSnackBarData({ text: msg, show: true })); //redux
        }
    }
    const proverkaCode = async (e) => { // epd
        e.preventDefault()
        let req = await fetch(`/api/users/codes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, code })
        })
        let msg
        if (req.status != 502) {
            let res = await req.json()
            msg = res.msg
            if (req.status == 200) {
                authForm.current.reset();
                setSmsAuth(false)
                setPageRegister(false)
                $('#txtFieldCode').focus()
            }
        } else {
            msg = 'Проверьте интернет соединение'
        }
        dispatch(setSnackBarData({ text: msg, show: true })); //redux
    }

    return (
        <ThemeProvider theme={muiTheme}>
            <div className={`authContent ${isSoloContent && 'authSoloContent'} globFont`}>
                <div className="authForm">
                    {isSoloContent ?
                        <Link href="/" onClick={(e) => { e.preventDefault() }} passHref>
                            <a>
                                <Image
                                    src=
                                    "/images/logo_mid.png"
                                    style={{ width: "50%", marginBottom: "20px" }}
                                    onClick={() => { router.push('/') }}
                                />
                            </a>
                        </Link > : null}

                    <Form className="w-100" ref={authForm} autoComplete="off">
                        {smsAuth ?
                            <>
                                <FormControl
                                    sx={{
                                        width: '100%',
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        id="txtFieldCode"
                                        sx={{
                                            marginBottom: '5px',
                                        }}
                                        required
                                        label="Код активации"
                                        variant="outlined"
                                        size="small"
                                        autoComplete="off"
                                        type='text'
                                        helperText="мы отправили на вашу почту код"
                                        InputProps={{
                                            style: {
                                                height: "36px",
                                            }
                                        }}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                </FormControl>
                                <button className="bigBlueButton fullWidthBBB" onClick={(e) => { proverkaCode(e) }}>Подтвердить</button>
                            </>
                            :
                            (!pageRegister
                                ?
                                <>
                                    <FormControl
                                        sx={{
                                            width: '100%',
                                        }}
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <TextField
                                            id='txtFieldLoginAuth'
                                            required
                                            label="Логин или почта"
                                            variant="outlined"
                                            size="small"
                                            type="login"
                                            sx={{
                                                marginBottom: "10px",
                                            }}
                                            InputProps={{
                                                style: {
                                                    height: "36px",
                                                }
                                            }}
                                            onChange={(e) => setLogin(e.target.value)}

                                        />
                                        <TextField
                                            id='txtFieldPassAuth'
                                            sx={{
                                                marginBottom: '10px',
                                            }}
                                            required
                                            label="Пароль"
                                            variant="outlined"
                                            size="small"
                                            type={viewsPass ? 'text' : 'password'}
                                            onChange={(e) => setPass(e.target.value)}
                                            InputProps={{
                                                style: {
                                                    height: "36px"
                                                },
                                                endAdornment:
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={(e) => { setViewsPass(!viewsPass) }}
                                                        >
                                                            {!viewsPass ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                            }}
                                        />
                                    </FormControl>

                                    <Container fluid="md" className="p-0">
                                        <Row>
                                            <Col>
                                                <button className="bigBlueButton fullWidthBBB" onClick={(e) => { avtorizacia(e) }}>Войти</button>
                                            </Col>
                                            <Col>
                                                <button className="bigBlueButton fullWidthBBB grayColor" onClick={(e) => { smenitPageRegister(e) }}>Регистрация</button>
                                            </Col>
                                        </Row>
                                    </Container>
                                </>
                                :
                                <>
                                    <Form.Group>
                                        <Form.Control
                                            autoComplete="off"
                                            style={{
                                                opacity: '0',
                                                position: 'absolute',
                                                height: '0',
                                                width: '0',
                                                padding: '0',
                                                margin: '0'
                                            }}
                                            tabIndex="-2" />
                                    </Form.Group>

                                    <FormControl
                                        sx={{
                                            width: '100%',
                                        }}
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <TextField
                                            id='txtFieldEmailReg'
                                            sx={{
                                                marginBottom: '8px',
                                            }}
                                            required
                                            label="Электронная почта"
                                            variant="outlined"
                                            size="small"
                                            type="email"
                                            helperText="Только сервисы:  mail.ru, gmail, yandex"
                                            InputProps={{
                                                style: {
                                                    height: "36px",
                                                }
                                            }}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <TextField
                                            id='txtFieldLoginReg'
                                            sx={{
                                                marginBottom: '8px',
                                            }}
                                            required
                                            label="Логин"
                                            variant="outlined"
                                            size="small"
                                            type="login"
                                            helperText="Строчные латинские буквы и цифры"
                                            InputProps={{
                                                style: {
                                                    height: "36px",
                                                }
                                            }}
                                            onChange={(e) => setLogin(e.target.value)}
                                        />
                                        <TextField
                                            id='txtFieldPassReg'
                                            sx={{
                                                marginBottom: '8px',
                                            }}
                                            required
                                            label="Пароль"
                                            variant="outlined"
                                            size="small"
                                            type={viewsPass ? 'text' : 'password'}
                                            helperText="Ваш пароль будет зашифрован и записан вот в таком виде: $2a$10$3ExDKurzlALsieExyrpOxuARf..."
                                            onChange={(e) => setPass(e.target.value)}
                                            InputProps={{
                                                style: {
                                                    height: "36px",
                                                },
                                                endAdornment:
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={(e) => { setViewsPass(!viewsPass) }}
                                                        >
                                                            {!viewsPass ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                            }}
                                        />
                                        <TextField
                                            id='txtFieldPass2Reg'
                                            sx={{
                                                marginBottom: '10px',
                                            }}
                                            required
                                            className={!viewsPass ? "authSecuredText" : null}
                                            label="Повторите пароль"
                                            variant="outlined"
                                            size="small"
                                            autoComplete="new-password"
                                            type='text'
                                            onChange={(e) => setSecondPass(e.target.value)}
                                            InputProps={{
                                                style: {
                                                    height: "36px",
                                                },
                                                endAdornment:
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={(e) => { setViewsPass(!viewsPass) }}
                                                        >
                                                            {!viewsPass ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                            }}
                                        />
                                    </FormControl>
                                    <Container fluid="md" className="p-0">
                                        <Row>
                                            <Col>
                                                <button className="bigBlueButton fullWidthBBB" onClick={(e) => { registracia(e) }}>Зарегистрироваться</button>
                                            </Col>
                                            <Col>
                                                <button className="bigBlueButton fullWidthBBB grayColor" onClick={smenitPageRegister}>Авторизация</button>
                                            </Col>
                                        </Row>
                                    </Container>
                                </>
                            )
                        }
                    </Form>
                </div>
            </div>
        </ThemeProvider >
    )
}

export async function getServerSideProps(ctx) {
    let regMode = false
    let withRedirect = false
    if (ctx.query.m) {
        if (ctx.query.m == 'reg') {
            regMode = true
        }
    }
    if (ctx.query.l) {
        if (typeof ctx.query.l != 'undefined') {
            withRedirect = ctx.query.l
        }
    }
    //если авторизован, то редиректить на главную
    const parsedCookies = cookies(ctx);
    if (verifyToken(parsedCookies.token)) {
        return {
            redirect: {
                destination: '/',
            },
        }
    }
    return {
        props: {
            regMode,
            withRedirect
        }
    }
}