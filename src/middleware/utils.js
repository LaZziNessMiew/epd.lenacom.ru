import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
const SECRET_KEY = process.env.JWTKEY;

// params {jwtToken} берется из кукисов клиента
// return {object} возвращает id, expire time
export function verifyToken(jwtToken) {
    try {
        return jwt.verify(jwtToken, SECRET_KEY);
    } catch (e) {
        //console.log('e:', e);
        return null;
    }
}

export function setLogout() {
    Cookies.remove('token')
}
