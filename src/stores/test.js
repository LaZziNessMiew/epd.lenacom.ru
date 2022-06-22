import Cookies from 'js-cookie';


var test
fetch(`${process.env.STRURL}/api/users/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        token: Cookies.get('token'),
    })
}).then((res) => res.json()
).then((data) => test = data.success
).then(() => console.log(test))
console.log("INITIAL FETCH", test)

export default function Test(props) {
    return (
        <>
        </>
    )
}