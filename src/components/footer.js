import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router"
// redux
import { useSelector, useDispatch } from "react-redux"
import { setLoggedInfo } from "../stores/loggedInfoSlice";
import Link from 'next/link'


export default function Footer(props) {
    const dispatch = useDispatch(); // redux   
    const router = useRouter();

    return (
        <div className='footer globFont'>
            <div className="footerMainContent">
                <div className={router.pathname.split('/')[1] != '' ? "footerChildContent footerChildContentWrapped" : "footerChildContent"}>
                    <span>{'© Lenacom.ru 2022 | '}
                        <Link href="/banner" onClick={(e) => { e.preventDefault() }} passHref>
                            <a>Каталог компаний</a>
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    )
}