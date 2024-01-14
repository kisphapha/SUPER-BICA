import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Paper,
    Radio,
    RadioGroup,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import Popup from 'reactjs-popup'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'user', headerName: 'Người mua', width: 130 },
    { field: 'orderDate', headerName: 'Ngày đặt hàng', width: 130 },
    { field: 'status', headerName: 'Thanh toán', width: 130 },
    { field: 'shipping', headerName: 'Trạng thái', width: 130 },

    {
        field: 'address',
        headerName: 'Địa chỉ',
        width: 150
    },
    {
        field: 'phone',
        headerName: 'Số điện thoại',
        // description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 130
        // valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
    },
    { field: 'total', headerName: 'Tổng tiền', width: 130 },
    // { field: 'updateAt', headerName: 'Ngày chỉnh sửa', width: 130 },
    { field: 'note', headerName: 'Ghi chú', width: 130 }
]

export default function Shipper() {
    const [openPopup, setOpenPopup] = useState(false)
    const [cards, setCards] = useState([])
    const [customCards, setCustomCards] = useState([])
    const [order, setOrder] = useState('')
    const [orderItem, setOrderItem] = useState([])
    const [rows, setRows] = useState([])

    const [sortModel, setSortModel] = useState([
        { field: 'shipping', sort: 'desc' } // Sort by 'shipping' field in ascending order
    ])
    const handleRowClick = async (id) => {
        console.log(id)
        const order = await getAnOrder(id)
        const detail = await fetchOrderItems(id)
        setOrder(order)
        setOrderItem(detail)
        setOpenPopup(true)
    }

    async function getAnOrder(id) {
        const response = await axios.get(`http://localhost:3000/order/${id}`, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        return response.data
    }
    async function fetchOrderItems(id) {
        const response = await axios.get(`http://localhost:3000/order/list/${id}`, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        return response.data
    }
    async function fetchOrder() {
        const response = await axios.get(`http://localhost:3000/shipper/order`, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        if (response.data) {
            const jsonData = response.data
            const ordersWithItems = []

            for (const order of jsonData) {
                if (order.Status_Shipping == 'Đang giao' || order.Status_Shipping == 'Đã giao') {
                    const items = await fetchOrderItems(order.OrderId)
                    const orderWithItems = { ...order, items }
                    ordersWithItems.push(orderWithItems)
                }
            }
            // sdasd
            setCards(ordersWithItems)
            console.log(ordersWithItems)
        }
    }

    async function changeState(order) {
        const status = steps[parseInt(getActiveStep(order.Status_Shipping)) + 1]
        await axios.post(`http://localhost:3000/shipper/change`, {
            orderId: order.Id,
            status: status
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        if (status == "Đã giao"){
            await axios.get(`http://localhost:3000/order/paidstatus/` + order.Id, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })

        }
        await axios.post('http://localhost:3000/users/updatePoint', {
            id: order.UserID,
            point: order.Point
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        await axios.patch('http://localhost:3000/notification/', {
            content: "Đơn hàng số " + order.Id + " của bạn đặt ngày " + new Date(order.OrderDate).toLocaleDateString()
                + " đã hoàn tất giao hàng và bạn đã tích được " + order.Point + " điểm",
            Id: order.Id + 'o',
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        let productsList = ""
        orderItem.map((item) => {
            productsList += item.Name + " x" + item.Quantity +", "
        })
        await axios.post('http://localhost:3000/notification/', {
            userId: null,
            content: `Đơn hàng số ${order.Id} gồm ${productsList} đã hoàn tất giao hàng'`,
            refId: null,
            refUrl: "/admin/CustomOrders",
            refPic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfahmrt0LwkCuWn6ADavrJCm4BCH1QfvFIxUzcZw5gCn6tcvAFoseGmH0ixauU1OST5Bc&usqp=CAU"
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        alert('Order is updated')
        fetchOrder()
    }

    async function changeStateCustom(order) {
        await axios.post(`http://localhost:3000/shipper/delivery`, {
            orderId: order.ID,
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        await axios.patch('http://localhost:3000/notification/', {
            content: "Lồng tùy chỉnh '" + order.Name + "' của bạn đã hoàn tất giao hàng và bạn đã tích được " + order.Point + " điểm",
            Id: order.ID + 'co',
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        await axios.post('http://localhost:3000/users/updatePoint', {
            id: order.UserID,
            point: order.Point
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        await axios.post('http://localhost:3000/notification/', {
            userId: null,
            content: "Lồng tùy chỉnh mã " + order.ID + " (" + order.Name + ") đã hoàn tất giao hàng!",
            refId: null,
            refUrl: "/admin/CustomOrders",
            refPic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfahmrt0LwkCuWn6ADavrJCm4BCH1QfvFIxUzcZw5gCn6tcvAFoseGmH0ixauU1OST5Bc&usqp=CAU"
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        alert("Đã giao thành công Nigga!")  
        fetchCustomOrder()
    }
    async function fetchCustomOrder() {
        const response = await axios.get(`http://localhost:3000/shipper/custom`, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        });
        setCustomCards(response.data);
    }


    useEffect(() => {
        fetchOrder()
        fetchCustomOrder()
    }, [])

    useEffect(() => {
        const data = []
        cards.map((card) => {
            data.push({
                id: card.OrderId,
                user: card.Name,
                orderDate: card.OrderDate ? card.OrderDate.substr(0, 10) : '',
                status: card.Status_Paid,
                shipping: card.Status_Shipping,
                address: card.Address,
                phone: card.PhoneNumber,
                total: card.TotalAmount,
                note: card.Note,
                updateAt: card.UpdateAt ? card.UpdateAt.substr(0, 10) : ''
            })
        })
        setRows(data)
    }, [cards])

    //step
    const buttonState = ['Duyệt', 'Đã bàn giao cho Shipper', 'Hoàn tất giao hàng']
    const steps = ['Chờ duyệt', 'Đang chuẩn bị', 'Đang giao', 'Đã giao']
    const getActiveStep = (status) => {
        return steps.indexOf(status)
    }

    function getButtonStatus(status) {
        return buttonState[steps.indexOf(status)]
    }

    useEffect(() => {
        fetchOrderItems()
    }, [])

    ///active button
    const [activeButton, setActiveButton] = useState(0)

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName)
    }
    return (
        <div className="w-full flex flex-col">
            <div className="m-10 font-bold pl-10 text-2xl">Thông tin đơn hàng</div>
            <div className="mx-10 pb-10 h-screen">
                <div className="flex">
                    <div>
                        <button
                            className={`p-2 rounded-t-md ${activeButton === 0 ? 'bg-white' : 'bg-slate-300'}`}
                            onClick={() => handleButtonClick(0)}
                        >
                            Đang giao
                        </button>
                    </div>
                    <div>
                        <button
                            className={`p-2 rounded-t-md ${activeButton === 1 ? 'bg-white' : 'bg-slate-300'}`}
                            onClick={() => handleButtonClick(1)}
                        >
                            Đang giao custom
                        </button>
                    </div>
                </div>
                <div>
                    <TableContainer className="" component={Paper}>                     
                        <TableHead>
                            <TableRow>
                                <TableCell className="w-12">ID</TableCell>
                                <TableCell>Người mua</TableCell>
                                {activeButton == 1 && (
                                    <TableCell>Tên sản phẩm</TableCell>
                                )}
                                <TableCell>Ngày đặt hàng</TableCell>
                                <TableCell>Thanh toán</TableCell>
                                <TableCell>Địa chỉ</TableCell>
                                <TableCell>Số điện thoại</TableCell>
                                <TableCell>Tổng số tiền</TableCell>
                                <TableCell>Ghi chú</TableCell>
                               
                                <TableCell>...</TableCell>
                            </TableRow>
                        </TableHead>
                        {activeButton == 0 ? (
                            <TableBody>
                                {cards
                                    .filter((card) => {
                                        return card.Status_Shipping === 'Đang giao'
                                    })
                                    .map((card) => (
                                        <TableRow
                                            key={card.OrderId}
                                            onClick={() => {
                                                handleRowClick(card.OrderId)
                                            }}
                                        >
                                            <TableCell className="w-12">{card.OrderId}</TableCell>
                                            <TableCell>{card.Name}</TableCell>
                                            <TableCell>{card.OrderDate ? card.OrderDate.substr(0, 10) : ''}</TableCell>
                                            <TableCell>{card.Status_Paid}</TableCell>
                                            {/* <TableCell>{card.Status_Shipping}</TableCell> */}
                                            <TableCell>{card.Address}</TableCell>
                                            <TableCell>{card.PhoneNumber}</TableCell>
                                            <TableCell>{card.TotalAmount.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</TableCell>
                                            <TableCell>
                                                <Button variant="outlined">Giao hàng</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                <Popup
                                    open={openPopup}
                                    onClose={() => setOpenPopup(false)}
                                    position="right center"
                                    closeOnDocumentClick={false}
                                    closeOnEscape={false}
                                    modal
                                >
                                    {(close) => (
                                        <div className="">
                                            <div>
                                                {order && (
                                                    <div className="">
                                                        <div>
                                                            <div className="flex place-content-between align-middle">
                                                                <div className="flex m-2">
                                                                    <div className="px-2">Mã đơn hàng: {order.Id} </div>
                                                                    <div>|</div>
                                                                    <div className="px-2">Ngày đặt mua: {(order.OrderDate + '').substr(0, 10)} </div>
                                                                </div>
                                                                <div className="m-2">
                                                                    <Stepper activeStep={getActiveStep(order.Status_Shipping)}>
                                                                        {steps.map((label, index) => {
                                                                            const stepProps = {}
                                                                            const labelProps = {}

                                                                            return (
                                                                                <Step key={label} {...stepProps}>
                                                                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                                                                </Step>
                                                                            )
                                                                        })}
                                                                    </Stepper>
                                                                </div>
                                                            </div>
                                                            <div className="overflow-y-scroll h-96">
                                                                {orderItem.map((item) => (
                                                                    <div key={item.Id} className="">
                                                                        <hr />
                                                                        <div className="flex my-2 place-content-between">
                                                                            <div className="flex">
                                                                                <img className="h-30 w-20 mx-4" src={item.Url} alt={item.Name} />
                                                                                <div className="">
                                                                                    <div className="font-bold">{item.Name}</div>
                                                                                    <div className="pl-2">Phân loại: {item.Shape}</div>
                                                                                    <div className="pl-2">x{item.Quantity}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="">
                                                                                <div className="mx-8 text-right  text-red-500 ">
                                                                                    {' '}
                                                                                    {item.Price.toLocaleString('vi', {
                                                                                        style: 'currency',
                                                                                        currency: 'VND'
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <hr />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="text-right mx-8 my-4  flex justify-end ">
                                                            <div className="text-xl font-bold   ">Tổng cộng:</div>
                                                            <div className="mx-2"></div>
                                                            <div className="text-red-500 text-xl">
                                                                {order.TotalAmount.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex mx-2 place-content-between">
                                                <div className="flex gap-4">
                                                    {getActiveStep(order.Status_Shipping) < 3 && (
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() => {
                                                                changeState(order)
                                                                close()
                                                            }}
                                                        >
                                                            {getButtonStatus(order.Status_Shipping)}
                                                        </Button>
                                                    )}
                                                </div>

                                                <div>
                                                    <Button variant="contained" onClick={close}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Popup>
                            </TableBody>
                        ) : (
                            <TableBody>
                                {customCards
                                    .filter((card) => {
                                        return card.Status_shipping === 'Đang giao'
                                    })
                                    .map((card) => (
                                        <TableRow key={card.ID}>
                                            <TableCell className="w-12">{card.ID}</TableCell>
                                            <TableCell>{card.User_name}</TableCell>
                                            <TableCell>{card.Name}</TableCell>
                                            <TableCell>{card.Order_date ? card.Order_date.substr(0, 10) : ''}</TableCell>
                                            <TableCell>{card.Status_Paid}</TableCell>
                                            <TableCell>{card.Address}</TableCell>
                                            <TableCell>{card.PhoneNumber}</TableCell>
                                            <TableCell>{card.Price_final.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</TableCell>
                                            <TableCell>...</TableCell>
                                            <TableCell>
                                                <Button variant="outlined" onClick={() => { changeStateCustom(card) } }>Giao hàng</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        )}
                    </TableContainer>
                </div>
            </div>
        </div>
    )
}
