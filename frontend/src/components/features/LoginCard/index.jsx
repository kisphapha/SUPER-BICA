import React, { useEffect, useState } from 'react'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import logo from '../../../image/icons/logo.png'

function LoginCard() {
    const [email, setEmail] = useState('')
    const [googleUser, setGoogleUser] = useState('')
    //const [credential, setCredential] = useState('')

    async function handlecallbackResponse(response) {
        //console.log('Encoded JWT ID Token: ' + response.credential)
        //var userObject = jwtDecode(response.credential)
        //setGoogleUser(userObject)
        //console.log(userObject)
        //setCredential(response)
        const user = await axios.post('http://localhost:3000/users/login', {
            credential: response.credential
        })
        sessionStorage.setItem('loginedUser', response.credential)
        if (!user.data) {
            console.log(user)
            const googleUser = jwtDecode(response.credential)
            await axios.post(
                'http://localhost:3000/users/new/', {
                    name : googleUser.name,
                    email: googleUser.email,
                    picture: googleUser.picture,
                    secretKey: googleUser.sub
                }
            )
        }
        window.location.reload()
    }

    useEffect(() => {
        /*global google*/

        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_API,
            callback: handlecallbackResponse
        })

        google.accounts.id.renderButton(document.getElementById('google'), {
            theme: 'outline',
            size: 'larger'
        })
    })

    //useEffect(() => {
    //    async function fetchUsers() {
    //        const json = {
    //            email: email,
    //            secretKey: googleUser.sub
    //        }

    //        console.log(json)
    //        const response = await axios.post('http://localhost:3000/users/login', json)

    //        //if (response.data.message != "Invalid user") {
    //        //    if (response.data.Status == "Inactive") {
    //        //        alert("Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên lạc ban quản lý để được hỗ trợ"
    //        //            + "\nLý do : " + response.data.ReasonBlocked)
    //        //    } else {
    //        //    }
    //        //} else {
    //        //    await axios.post(
    //        //        'http://localhost:3000/users/new/', {
    //        //            name : googleUser.name,
    //        //            email: googleUser.email,
    //        //            picture: googleUser.picture,
    //        //            secretKey: googleUser.sub
    //        //        }
    //        //    )
    //        //    await fetchUsers()
    //        //}
    //        //window.location.reload()
    //    }

    //    if (email != '') {
    //        fetchUsers()
    //    }
    //})

    return (
        <div
            className="login-item"
            style={{
                paddingTop: '23px',
                justifyContent: 'space-between'
            }}
        >
            <div
                className="shop"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <img src={logo} style={{ height: '128px', width: '128px' }} />
                <h1>Đăng nhập</h1>
            </div>
            <div
                className="alt-login"
                id="google"
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            ></div>
        </div>
    )
}

export default LoginCard

