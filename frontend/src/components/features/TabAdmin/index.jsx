import { Category, Dashboard, Inventory, Person, Reorder, Settings, Notifications } from '@mui/icons-material'
import React, { useState, useEffect } from 'react'
import { Button, Tabs } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import './styles.css'
import AddIcon from '@mui/icons-material/Add'
import InventoryIcon from '@mui/icons-material/Inventory'
import CategoryIcon from '@mui/icons-material/Category'
import axios from 'axios'
import logo from '../../../image/icons/logo.png'
import LogoutIcon from '@mui/icons-material/Logout'

export default function TabAdmin({ user }) {
    const navigate = useNavigate()
    const [activeButton, setActiveButton] = useState('/admin')
    const [unreadNews, setUnreadNews] = useState([])

    const fetchNews = async () => {
        const response = await axios.get('http://localhost:3000/notification/', {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        const personal = await axios.get('http://localhost:3000/notification/' + user.Id, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        let news_num = 0
        if (response.data) {
            response.data.map((news) => {
                if (!news.View_status) {
                    news_num += 1
                }
            })
        }
        if (personal.data) {
            personal.data.map((news) => {
                if (!news.View_status) {
                    news_num += 1
                }
            })
        }
        setUnreadNews(news_num)
    }

    const handleButtonClick = (path) => {
        navigate(path)
        setActiveButton(path)
    }
    function handleSignOut(e) {
        sessionStorage.removeItem('loginedUser')
        navigate('/')
        window.location.reload()
    }

    useEffect(() => {
        setActiveButton(location.pathname);
    }, []);

    useEffect(() => {
        fetchNews()
    })


    return (
        <Tabs className="bg-white w-64 fixed left-0 top-0 h-full">
            <div className="bg-white w-60 h-full">
                <div className="flex justify-center items-center m-4">
                    <img className="rounded-2xl w-24 " src={logo} onClick={() => handleButtonClick('/')} />
                </div>
                <div className="flex flex-col pl-4 gap-4">
                    <Button
                        startIcon={<Dashboard />}
                        onClick={() => handleButtonClick('/admin')}
                        fullWidth
                        classes={{ root: activeButton === '/admin' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                        DashBoard
                    </Button>
                    <Button
                        startIcon={<Notifications />}
                        onClick={() => handleButtonClick('/admin/news')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/news' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                        Trung tâm tin tức
                        {unreadNews > 0 && (
                            <div className="rounded-full bg-red-600 w-6 h-6 text-white text-center absolute right-2">{unreadNews}</div>
                        )}
                    </Button>
                    {user.Role == 'Admin' && (
                        <>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleButtonClick('/admin/NewProduct')}
                                fullWidth
                                classes={{ root: activeButton === '/admin/NewProduct' ? 'active-dashboard' : '' }}
                                style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                            >
                                Thêm sản phẩm
                            </Button>
                        </>
                    )}
                    {/* <Button
                        onClick={() => handleButtonClick('/admin/NewCoupon')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/NewCoupon' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                        disabled
                    >
                        Thêm khuyến mãi
                    </Button> */}

                    <Button
                        startIcon={<Inventory />}
                        onClick={() => handleButtonClick('/admin/Products')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/Products' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                        Danh sách sản phẩm
                    </Button>
                    <Button
                        startIcon={<Category />}
                        onClick={() => handleButtonClick('/admin/Categories')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/Categories' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                        Danh mục sản phẩm
                    </Button>
                    <Button
                        startIcon={<Person />}
                        onClick={() => handleButtonClick('/admin/Users')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/Users' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                        // disabled
                    >
                        Người dùng
                    </Button>

                    <Button
                        startIcon={<Reorder />}
                        onClick={() => handleButtonClick('/admin/Orders')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/Orders' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                        Đơn hàng
                    </Button>
                    <Button
                        startIcon={<Reorder />}
                        onClick={() => handleButtonClick('/admin/CustomOrders')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/CustomOrders' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                        Đơn hàng custom
                    </Button>
                    {user.Role == 'Admin' && (
                        <Button
                            startIcon={<Settings />}
                            onClick={() => handleButtonClick('/admin/customSettings')}
                            fullWidth
                            classes={{ root: activeButton === '/admin/customSettings' ? 'active-dashboard' : '' }}
                            style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                        >
                            Cài đặt
                        </Button>
                    )}
                    <Button
                        onClick={(e) => handleSignOut(e)}
                        startIcon={<LogoutIcon />}
                        fullWidth
                        // classes={{ root: activeButton === '/admin/Coupons' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                        // disabled
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </Tabs>
    )
}
