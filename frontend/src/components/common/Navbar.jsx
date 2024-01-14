import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone'
import HomeIcon from '@mui/icons-material/Home'
import InfoIcon from '@mui/icons-material/Info'
import PhoneIcon from '@mui/icons-material/Phone'
import HandymanIcon from '@mui/icons-material/Handyman'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CompareIcon from '@mui/icons-material/Compare'
import { Badge } from '@mui/material'
import axios from 'axios'

export default function Navbar({getCardListFilter}) {
    const [cartData, setCartData] = useState({ products: [] })
    // const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState([])
    const [cateId, setCateId] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const cartDataFromSession = sessionStorage.getItem('cart')
        if (cartDataFromSession) {
            setCartData(JSON.parse(cartDataFromSession))
        }
        async function fetchCategory() {
            const response = await axios.get(`http://localhost:3000/Category/`)
            setCategory(response.data)
        }
        fetchCategory()
        // setLoading(false)
    }, [])
    

    const totalProductQuantity = () => {
        let total = 0
        cartData.products.forEach((product) => {
            if (product != null) {
                total += product.quantity
            }
        })
        return total
    }
    
    const handleSeeMore = (categoryId) => {
        setCateId(categoryId)
        console.log(cateId)
        navigate('/filter/' + 1 + '/' + categoryId)
        getCardListFilter(1, categoryId)
    }

    return (
        <div id="navbar">
            <div className="menu">
                <div className="menu-button">☰ Danh Mục Sản Phẩm </div>
                <ul className="menu-list">
                    <li className="cage-menu">
                        <div className="cage">Lồng Chim <KeyboardArrowRightIcon/></div>
                        <ul className="cage-list">
                        {category.map((cate) => 
                        cate.id.trim() != "PK" &&(
                            <li key={cate.id} value={cate.id} onClick={() => handleSeeMore(cate.id)}>
                                {cate.name}
                            </li>
                        ))}
                        </ul>
                    </li>
                    <li onClick={() => handleSeeMore("PK")}>Phụ Kiện</li>
                </ul>
            </div>
            <nav className="nav">
                <NavLink to="/" acctiveClassName="active">
                    <div className="nav-content">
                        <HomeIcon className="pb-1" />
                        Trang Chủ
                    </div>
                </NavLink>
                <NavLink to="/About" activeClassName="active">
                    <div className="nav-content">
                        <InfoIcon className="pb-1" />
                        Giới Thiệu
                    </div>
                </NavLink>
                <NavLink to="/Contact" acctiveClassName="active">
                    <div className="nav-content">
                        <PhoneIcon className="pb-1" />
                        Liên Hệ
                    </div>
                </NavLink>
                <NavLink to="/Custom" acctiveClassName="active">
                    <div className="nav-content">
                        <HandymanIcon className="pb-1" />
                        Lồng Tùy Chỉnh
                    </div>
                </NavLink>
                <NavLink to="/Compare" acctiveClassName="active">
                    <div className="nav-content">
                        <CompareIcon className="pb-1" />
                        So sánh sản phẩm
                    </div>
                </NavLink>

                <NavLink to="/cart" className="cart-button" acctiveClassName="active">
                    <div className="nav-content">
                        <Badge badgeContent={totalProductQuantity()} color="error">
                            <ShoppingCartTwoToneIcon sx={{ fontSize: 30 }} />
                        </Badge>
                    </div>
                </NavLink>
            </nav>
        </div>
    )
}
