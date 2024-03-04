import {
    Button,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TextField
} from '@mui/material'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import Popup from 'reactjs-popup'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import CategoryNav from '../../../components/features/CategoryNav'
import logo from '../../../image/icons/logo.png'
import { UserContext } from '../../../UserContext'

export default function CustomOrder() {
    const { user } = useContext(UserContext)
    const [openPopup, setOpenPopup] = useState(false)
    const [cards, setCards] = useState([])
    const [order, setOrder] = useState('')
    const [rows, setRows] = useState([])
    const navigate = useNavigate()

    const handleRowClick = async (id) => {
        navigate(''+id)
    }

    async function fetchCustomOrder() {
        const response = await axios.get(`http://localhost:3000/custom`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.loginedUser
            }
        })
        if (response.data) {
            setCards(response.data)
        }
    }

    useEffect(() => {
        fetchCustomOrder()
    }, [])


    //step
    const buttonState = ['Duyệt', 'Đã bàn giao cho Shipper', 'Giao hoàn tất']
    const steps = ['Chờ duyệt','Xác nhận thanh toán','Đang thi công', 'Đang chuẩn bị', 'Đang giao', 'Đã giao']
    const getActiveStep = (status) => {
        return steps.indexOf(status)
    }

    function getButtonStatus(status) {
        return buttonState[steps.indexOf(status)]
    }
    ///active button
    const [activeButton, setActiveButton] = useState(0)

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName)
    }

    return (
        <div className="px-2 py-2 w-full mb-96">
            <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }, { name: 'Bảng điều khiển', link: '/admin' }]}
                current="Đơn hàng custom"
                margin={0}
            />
            <div className="mt-8 mb-8 font-bold text-2xl">Thông tin đơn hàng</div>
            <div className="pb-10 h-screen">
                <div className="flex">
                    {steps.map((step,index) => (
                        <div key={index }>
                            <button
                                className={`p-2 rounded-t-md ${activeButton === index ? 'bg-white' : 'bg-slate-300'}`}
                                onClick={() => handleButtonClick(index)}
                            >
                                {step}
                            </button>
                        </div>
                    )) }
                </div>
                <div>
                    <TableContainer className="" component={Paper}>
                        <TableHead>
                            <TableRow>
                                <TableCell className="w-12">ID</TableCell>
                                <TableCell className="w-1/6">Người mua</TableCell>
                                {activeButton >  1 && (
                                    <>
                                        <TableCell>Ảnh sản phẩm</TableCell>
                                        <TableCell>Địa chỉ</TableCell>
                                        <TableCell>Số điện thoại</TableCell>
                                    </>
                                )}
                                <TableCell>Ngày đặt hàng</TableCell>
                                <TableCell>Thanh toán</TableCell>     
                                <TableCell>Tổng số tiền</TableCell>
                                <TableCell>Thời gian ước tính</TableCell>
                                {activeButton <= 1 && (
                                    <TableCell>Tình trạng</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cards
                                .filter((card) => {
                                    if (activeButton === 0) {
                                        return card.Status_shipping === 'Chờ duyệt'
                                    }
                                    if (activeButton === 1) {
                                        return card.Status_shipping === 'Xác nhận thanh toán' && (card.StaffID == user.Id || user.Role == "Admin")
                                    }
                                    if (activeButton === 2) {
                                        return card.Status_shipping === 'Đang thi công' && (card.StaffID == user.Id || user.Role == "Admin")
                                    }
                                    if (activeButton === 3) {
                                        return card.Status_shipping === 'Đang chuẩn bị' && (card.StaffID == user.Id || user.Role == "Admin")
                                    }
                                    if (activeButton === 4) {
                                        return card.Status_shipping === 'Đang giao' && (card.StaffID == user.Id || user.Role == "Admin")
                                    }
                                    if (activeButton === 5) {
                                        return card.Status_shipping === 'Đã giao' && (card.StaffID == user.Id || user.Role == "Admin")
                                    }
                                    return true // Show all by default
                                })
                                .map((card) => (
                                    <TableRow
                                        className={(card.StaffID != user.Id && card.Status_shipping != 'Chờ duyệt') ? "bg-red-100" : ""}
                                        key={card.ID}
                                        onClick={() => {
                                            handleRowClick(card.ID)
                                        }}
                                    >
                                        <TableCell>{card.ID}</TableCell>
                                        <TableCell>{card.Name}</TableCell>
                                        {activeButton > 1 && (
                                            <>
                                                <TableCell>
                                                    <img className="w-32 h-32" src={card.Final_img ? card.Final_img : logo}></img>
                                                </TableCell>
                                                <TableCell>{card.Address}</TableCell>
                                                <TableCell>{card.PhoneNumber}</TableCell>
                                            </>
                                        )}
                                        <TableCell>{card.Order_date ? card.Order_date.substr(0, 10) : ''}</TableCell>
                                        <TableCell>{card.Status_Paid}</TableCell>
                                        <TableCell>{card.Price_final.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</TableCell>
                                        <TableCell>{card.Final_time} ngày</TableCell>
                                        {activeButton <= 1 && (
                                            <TableCell>{card.Shop_respond ? 'Đã phản hồi' : 'Chưa phản hồi'}</TableCell>
                                        )}
                                        <TableCell></TableCell>
                                    </TableRow>
                                ))}                            
                        </TableBody>
                    </TableContainer>
                </div>
            </div>
        </div>
    )
}
