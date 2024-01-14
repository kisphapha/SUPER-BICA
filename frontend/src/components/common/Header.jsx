import * as React from 'react'
import { useContext, useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../UserContext'
import jwtDecode from 'jwt-decode'
import Popup from 'reactjs-popup'
import LoginCard from '../features/LoginCard'
import logo from '../../../src/image/icons/logo.svg'
import './Header.css'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import IconButton from '@mui/material/IconButton'
import { Badge } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import Divider from '@mui/material/Divider';
// import banner from '../../image/banner/banner.png'

function Header() {
    const [notifications, setNotifications] = useState([])
    const [unseenNotify, setUnseenNotify] = useState(0)
    const divRef = useRef(null);

    //useEffect(() => {
    //    async function fetchOrders() {
    //        const userId = JSON.parse(sessionStorage.loginedUser).Id
    //       // const response = await fetch(`http://localhost:3000/order/loadUnseen/${userId}`)
    //        //const orders = await response.json()

    //        //const seen = orders.filter((order) => order.View_Status)
    //        //const unseen = orders.filter((order) => !order.View_Status)
    //        //setSeenMessage(seen)
    //        //setUnseenMessage(unseen)
    //    }

    //    fetchOrders()
    //},[])

    const { user } = useContext(UserContext)
    // const [email, setEmail] = useState('')
    const [keyword, setKeyword] = useState('')
    // const [googleUser, setGoogleUser] = useState('')
    // const [isTriggerClicked, setIsTriggerClicked] = useState(false)
    const navigate = useNavigate()

    async function handleSignOut(e) {
        console.log(user.token)
        await axios.post(`http://localhost:3000/users/logout`, {
            id : user.Id
        }, {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        sessionStorage.removeItem('loginedUser')
        navigate('/')
        window.location.reload()
    }
    async function fetchNotification() {
        const response = await axios.get(`http://localhost:3000/notification/${user.Id}`, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        if (response.data) {
            setNotifications(response.data)
            let notify = 0
            response.data.map((noti) => {
                if (noti.View_status == 0) {
                    notify++
                } 
            })
            setUnseenNotify(notify)
        }
    }

    const handleDeleteNotify = async (noti) => {
        await axios.delete(`http://localhost:3000/notification/0/${noti.Id}`, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
    }

    const handleClickNotify = async (noti) => {
        await axios.patch(`http://localhost:3000/notification/seen`, {
            Id : noti.Id
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        fetchNotification()
        navigate(noti.RefUrl)
    }

    const handleLogin = () => {
        setIsTriggerClicked(true)
    }

    const handleClickto = () => {
        navigate('/')
    }

    const handleKeyword = (event) => {
        setKeyword(event.target.value)
    }

    const handleSearch = () => {
        if (keyword.trim() != '') navigate(`/filter/2/${keyword}`)
    }

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const [isSticky, setIsSticky] = useState(false);
    const [isHideNotify, setHideNotify] = useState(true);

    const divStyle = {
        position: 'fixed',
        maxWidth: '400px',
        zIndex: 2,
        left: '75%',
        top: isSticky ? '0px' : '80px',
    };

    const handleBellClick = () => {
        fetchNotification()
        setHideNotify(!isHideNotify)
    }
    useEffect(() => {
        function handleScroll() {
            setIsSticky(window.scrollY > 40);
        }

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (divRef.current && !divRef.current.contains(event.target) &&
                event.target.tagName !== "svg") {
                setHideNotify(true);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchNotification()
    })

    return (
        <div id="header">
            <section className="header-top">
                <div className="service">
                    <div className="contact">
                        <div>
                            Chăm sóc khách hàng: <Link to="/Contact">0935039353</Link>
                        </div>
                    </div>
                </div>
                {user == null ? (
                    <Popup
                        contentStyle={{ width: '500px', height: '250px', borderRadius: '10px' }}
                        trigger={
                            <button type="button" className="login" onClick={handleLogin}>
                                <span>Đăng nhập</span>
                            </button>
                        }
                        position="center"
                        modal
                    >
                        {(close) => (
                            <div className="login-popup">
                                <LoginCard/>
                            </div>
                        )}
                    </Popup>
                ) : (
                    <div className="user-info">
                        <Link to="/user/profile" className="avatar">
                            <img src={user.Picture} alt="avatar" />
                        </Link>

                        <ul className="user-info-list">
                            {user.Role == 'Admin' || user.Role == 'Staff' ? (
                                <Link to="/admin" className="user-info-suboptions">
                                    <li>Thống kê</li>
                                </Link>
                            ) : (
                                <></>
                            )}
                            <Link to="/user/profile" className="user-info-suboptions">
                                <li>Thông tin cá nhân</li>
                            </Link>
                            <Link to="/user/purchase" className="user-info-suboptions">
                                <li>Đơn hàng của tôi</li>
                            </Link>
                            <Link onClick={(e) => handleSignOut(e)} className="user-info-suboptions">
                                <li>Đăng xuất</li>
                            </Link>
                        </ul>
                    </div>
                )}
            </section>

            <section className="header-bottom">
                <div className="logo" onClick={handleClickto}>
                    <img src={logo} style={{ height: '60px', width: '60px' }} />
                    BICA
                </div>
                <form className="search-container">
                    <input onChange={handleKeyword} className="search-bar" type="text" placeholder="Tìm kiếm" />
                    <button onClick={handleSearch} className="search-button">
                        🔍︎
                    </button>
                </form>
                <div className="text-white">
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <div className="text-white">
                            <Badge badgeContent={unseenNotify} color="error" onClick={handleBellClick}>
                                <NotificationsNoneIcon fontSize="large" />
                            </Badge>
                        </div>
                    </IconButton>
                </div>
            </section>
            {!isHideNotify && notifications.length > 0 && (
                <div ref={divRef} style={divStyle} className="overflow-y-scroll h-96 bg-white rounded-xl">
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 360,
                            bgcolor: 'background.paper',
                        }}
                    >
                        {notifications.map((noti) => (
                            <div key={noti.Id} className={noti.View_status ? "" : "bg-blue-100"}>
                                <div className="flex">
                                    <ListItem
                                        onClick={() => { handleClickNotify(noti) }}>
                                        <ListItemAvatar>
                                            <Avatar src={noti.RefPicture }/>
                                        </ListItemAvatar>
                                        <ListItemText primary={noti.content} secondary={noti.Time_stamp.substr(11, 8) + " ngày " + noti.Time_stamp.substr(0, 10) } />
                                    </ListItem>
                                    <button onClick={() => handleDeleteNotify(noti)}><DeleteIcon /></button>
                                </div>
                                <Divider variant="inset" component="li" />
                            </div>
                        ))}
                    </List>
                </div>
            )}
        </div>
    )
}

export default Header