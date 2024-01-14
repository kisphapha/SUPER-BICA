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
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import Popup from 'reactjs-popup'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { UserContext } from '../../../UserContext'
import CategoryNav from '../../../components/features/CategoryNav'

export default function Order() {
    const { user } = useContext(UserContext)
    const [openPopup, setOpenPopup] = useState(false)
    const [openPopupRefund, setOpenPopupRefund] = useState(false)
    const [cards, setCards] = useState([])
    const [refunds, setRefunds] = useState([])
    const [order, setOrder] = useState('')
    const [orderItem, setOrderItem] = useState([])
    const [refundItem, setRefundItem] = useState({})
    const [refundOrder, setRefundOrder] = useState({})
    const [message, setMessage] = useState('')
    const [rows, setRows] = useState([])

    const handleRowClick = async (id) => {
        console.log(id)
        const order = await getAnOrder(id)
        const detail = await fetchOrderItems(id)
        setOrder(order)
        setOrderItem(detail)
        setOpenPopup(true)
    }

    const handleRefundRowClick = async (item) => {
        setRefundItem(item)
        setRefundOrder(await getAnOrder(item.OrdersId))
        setOpenPopupRefund(true)
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
    async function fetchRefund() {
        const response = await axios.get(`http://localhost:3000/order/refund/${user.Id}`, {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        console.log(response.data)
        setRefunds(response.data)
    }

    async function fetchOrder() {
        const response = await axios.get(`http://localhost:3000/order`, {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        if (response.data) {
            const jsonData = response.data
            const ordersWithItems = []

            for (const order of jsonData) {
                const items = await fetchOrderItems(order.OrderId)
                const orderWithItems = { ...order, items }
                ordersWithItems.push(orderWithItems)
            }
            const sortedArray = [...ordersWithItems];

            sortedArray.sort((a, b) => {
                if (a.StaffID === user.Id && b.StaffID !== user.Id) {
                    return -1; // a comes before b
                } else if (a.StaffID !== user.Id && b.StaffID === user.Id) {
                    return 1; // b comes before a
                } else {
                    return 0; // a and b maintain their relative order
                }
            });
            setCards(sortedArray)
        }
    }

    async function changeState(order) {
        const status = steps[parseInt(getActiveStep(order.Status_Shipping)) + 1]
        await axios.post(`http://localhost:3000/shipper/change`, {
            orderId: order.Id,
            status: status,
          
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        if (status == "Đang chuẩn bị") {
            await axios.patch(`http://localhost:3000/order/staff`, {
                Id: order.Id,
                staffId: user.Id
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            let proStr = ""
            orderItem.map((item) => {
                proStr += item.Name + " x" + item.Quantity + ", "
            })
            await axios.post('http://localhost:3000/notification/', {
                userId: user.Id,
                content: `Bạn đã đảm nhiệm đơn hàng số ${order.Id} gồm ${proStr}`,
                refId: order.Id + 'og',
                refUrl: "/admin/Orders",
                refPic: orderItem[0].Url
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
        }
        if (status == "Đã giao"){
            await axios.get(`http://localhost:3000/order/paidstatus/` + order.Id, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })

        }
        await axios.patch('http://localhost:3000/notification/', {
            content: "Đơn hàng số " + order.Id + " của bạn đặt ngày " + new Date(order.OrderDate).toLocaleDateString() + " đã cập nhật trạng thái thành '" + status + "'",
            Id: order.Id + 'o',
            userId: order.UserID,
            refUrl: "/user/purchase",
            refPic: orderItem[0].Url
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
       
        alert('Order is updated')
        fetchOrder()
    }
    useEffect(() => {
        fetchOrder()
        fetchRefund()
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
    const buttonState = ['Duyệt', 'Đã bàn giao cho Shipper', 'Giao hoàn tất']
    const steps = ['Chờ duyệt', 'Đang chuẩn bị', 'Đang giao', 'Đã giao']
    const cases = ['Hoàn tiền nhưng không cần trả sản phẩm','Đổi sản phẩm khác','Trả sản phẩm và hoàn tiền']
    const getActiveStep = (status) => {
        return steps.indexOf(status)
    }

    function getButtonStatus(status) {
        return buttonState[steps.indexOf(status)]
    }
    const handleNo = async (close) => {
        await axios.patch('http://localhost:3000/order/clear', {
            Id: refundItem.ItemID
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        await axios.post('http://localhost:3000/notification/', {
            userId: refundOrder.UserID,
            content: "Yêu cầu đổi trả mặt hàng " + refundItem.ItemID + " (" + refundItem.Name + ") đã bị từ chối."
                + "Lời nhắn :" + message,
            refId: refundItem.Id + 'ue',
            refUrl: "/user/purchase",
            refPic: refundItem.Url
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        close()
        alert("Đã từ chối")
        fetchRefund()
    }
    const handleYes = async (close) => {
        console.log(refundOrder)
        if (refundItem.refund_type == 0) {
            await axios.patch('http://localhost:3000/order/clear', {
                Id: refundItem.ItemID,
                status : "Đã hoàn tiền"
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.post('http://localhost:3000/notification/', {
                userId: refundOrder.UserID,
                content: "Yêu cầu hoàn tiền mặt hàng " + refundItem.ItemID + " (" + refundItem.Name + ") thành công. Bạn không cần trả lại sản phẩm"
                    + "Lời nhắn :" + message,
                refId: refundItem.Id + 'ht',
                refUrl: "/user/purchase",
                refPic: refundItem.Url
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.patch('http://localhost:3000/order/total', {
                Id: refundOrder.Id,
                total: refundItem.Price * (refundItem.DiscountRate)
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.post('http://localhost:3000/notification/', {
                userId: null,
                content: "Mặt hàng " + refundItem.ItemID + " (" + refundItem.Name + ") đã phải hoàn tiền",
                refId: refundItem.Id + 'sht',
                refUrl: "/user/purchase",
                refPic: refundItem.Url
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            alert("Hoàn tất! Mặt hàng đã được hoàn tiền")
        } else if (refundItem.refund_type == 1) {        
            await axios.patch('http://localhost:3000/order/clear', {
                Id: refundItem.ItemID,
                status: "Đang chờ trả về"
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.post('http://localhost:3000/notification/', {
                userId: user.Id,
                content: "Mặt hàng " + refundItem.ItemID + " đã được đồng ý đổi và đang chờ DVVC lấy hàng của bạn về",
                refId: refundItem.Id + 'e',
                refUrl: "/admin/Orders",
                refPic: refundItem.Url
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.post('http://localhost:3000/notification/', {
                userId: refundOrder.UserID,
                content: "Yêu cầu đổi trả mặt hàng " + refundItem.ItemID + " (" + refundItem.Name + ") đã được phê duyệt và đang chờ DVVC đến."
                    +"Lời nhắn :" + message,
                refId: refundItem.Id + 'ue',
                refUrl: "/user/purchase",
                refPic: refundItem.Url
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            alert("Hoàn tất!")
        } else if (refundItem.refund_type == 2) {
            await axios.patch('http://localhost:3000/order/clear', {
                Id: refundItem.ItemID,
                status: "Đang chờ trả về"
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.post('http://localhost:3000/notification/', {
                userId: refundOrder.UserID,
                content: "Yêu cầu hoàn tiền và trả lại mặt hàng " + refundItem.ItemID + " (" + refundItem.Name + ") thành công."
                    + "Lời nhắn :" + message,
                refId: refundItem.Id + 'rt',
                refUrl: "/user/purchase",
                refPic: refundItem.Url
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            
            alert("Hoàn tất! Mặt hàng đã được hoàn tiền sẽ được DVVC đưa về")
        } else {
            alert("Chưa có tính năng này")
        }
        fetchOrder()
        fetchRefund()
        close()
    }
    const handleRecievedReturn = async (close) => {
        if (refundItem.refund_type == 1) {
            const res = await axios.post('http://localhost:3000/order/split', {
                ItemID: refundItem.ItemID,
                UserID: refundOrder.UserID,
                OrderDate: refundOrder.OrderDate,
                PaymentDate: refundOrder.PaymentDate,
                AddressID: refundOrder.AddressID,
                PhoneNumber: refundOrder.PhoneNumber,
                Note: '',
                TotalAmount: refundItem.Price * (refundItem.DiscountRate),
                PaymentMethod: refundOrder.PaymentMethod,
                VoucherID: refundOrder.VoucherID,
                Point: 0,
                StaffID: refundOrder.StaffID,
                oldOrder: refundOrder.Id,
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.patch(`http://localhost:3000/order/clear`, {
                Id: refundItem.ItemID
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.post('http://localhost:3000/notification/', {
                userId: refundOrder.UserID,
                content: "Đơn hàng số" + res.data.orderId + "đã được tạo tự động để đổi trả và đã cập nhật trạng thái thành 'Đang chuẩn bị'",
                refId: res.data.orderId + 'o',
                refUrl: "/user/purchase",
                refPic: refundItem.Url
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
        }
        if (refundItem.refund_type == 2) {
            await axios.patch(`http://localhost:3000/order/clear`, {
                Id: refundItem.ItemID,
                status: "Đã hoàn tiền"
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.patch('http://localhost:3000/order/total', {
                Id: refundOrder.Id,
                total: refundItem.Price * (refundItem.DiscountRate)
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.patch('http://localhost:3000/products/stock', {
                Id: refundItem.Id,
                Quantity: refundItem.Quantity
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.post('http://localhost:3000/notification/', {
                userId: null,
                content: "Mặt hàng " + refundItem.ItemID + " (" + refundItem.Name + ") đã bị trả về",
                refId: refundItem.Id + 'srt',
                refUrl: "/user/purchase",
                refPic: refundItem.Url
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
        }   
        alert("Đã cập nhật")
        fetchRefund()
        fetchOrder()
        close()
    }
    const handleRecieveFailed = async (close) => {
        await axios.patch('http://localhost:3000/order/clear', {
            Id: refundItem.ItemID
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        await axios.post('http://localhost:3000/notification/', {
            userId: refundOrder.UserID,
            content: "Yêu cầu đổi trả mặt hàng " + refundItem.ItemID + " (" + refundItem.Name + ") đã bị hủy do lấy hàng thất bại."
                + "Lời nhắn :" + message,
            refId: refundItem.Id + 'ue',
            refUrl: "/user/purchase",
            refPic: refundItem.Url
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        close()
        alert("Đã cập nhật")
        fetchRefund()
    }

    useEffect(() => {
        fetchOrder()
        fetchRefund()
    }, [])

    ///active button
    const [activeButton, setActiveButton] = useState(0)

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName)
    }
    const getRowStyle = (card) => {
        if (card.Status_Shipping != "Chờ duyệt" && card.StaffID != user.Id) return "bg-blue-100"
        return ""
    }

    return (
        <div className="px-2 py-2 w-full mb-96">
            <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }, { name: 'Bảng điều khiển', link: '/admin' }]}
                current="Đơn hàng"
                margin={0}
            />
            <div className="mt-8 mb-8 font-bold text-2xl">Thông tin đơn hàng</div>
            <div className="pb-10 h-screen">
                <div className="flex place-content-between">
                    <div className="flex">
                        {steps.map((step, index) => (
                            <div key={ index }>
                                <button
                                    className={`p-2 rounded-t-md ${activeButton === index ? 'bg-white' : 'bg-slate-300'}`}
                                    onClick={() => handleButtonClick(index)}
                                >
                                    {step}
                                </button>
                            </div>
                        ))}              
                    </div>
                    <div>
                        <button
                            className={`p-2 rounded-t-md ${activeButton === 69 ? 'bg-white' : 'bg-slate-300'}`}
                            onClick={() => handleButtonClick(69)}
                        >
                            Đổi trả / hoàn tiền
                        </button>
                    </div>
                </div>               
            <div>
                <TableContainer className="" component={Paper}>
                    <TableHead>
                        <TableRow>
                            <TableCell className="w-12">ID</TableCell>
                            <TableCell>Người mua</TableCell>
                            {activeButton != 69 ? (
                                <>
                                    <TableCell>Ngày đặt hàng</TableCell>
                                    <TableCell>Thanh toán</TableCell>
                                    <TableCell>Địa chỉ</TableCell>
                                    <TableCell>Số điện thoại</TableCell>
                                    <TableCell>Tổng số tiền</TableCell>
                                    <TableCell>Ghi chú</TableCell>
                                    {activeButton > 0 && (
                                        <TableCell>Nhân viên phụ trách</TableCell>)}
                                    </>
                            ) : (
                                <>
                                    <TableCell>Ngày giao hàng</TableCell>
                                    <TableCell>Ảnh sản phẩm</TableCell>
                                    <TableCell>Tên sản phẩm</TableCell>
                                    <TableCell>Số điện thoại</TableCell>
                                    <TableCell>Giá gốc</TableCell>
                                    <TableCell>Nếu hoàn tiền <br/>(trừ hao Voucher)</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Nhân viên phụ trách</TableCell>
                                </>
                            ) }                           
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {activeButton != 69 ? (
                                cards
                                    .filter((card) => {
                                    return card.Status_Shipping === steps[activeButton]
                                })
                                    .map((card) => (
                                        <TableRow
                                            key={card.OrderId}
                                            onClick={() => {
                                                handleRowClick(card.OrderId)
                                            }}
                                            className={getRowStyle(card)}
                                        >
                                            <TableCell className="w-12">{card.OrderId}</TableCell>
                                            <TableCell>{card.Name}</TableCell>
                                            <TableCell>{card.OrderDate ? card.OrderDate.substr(0, 10) : ''}</TableCell>
                                            <TableCell>{card.Status_Paid}</TableCell>
                                            {/* <TableCell>{card.Status_Shipping}</TableCell> */}
                                            <TableCell>{card.Address}</TableCell>
                                            <TableCell>{card.PhoneNumber}</TableCell>
                                            <TableCell>{card.TotalAmount.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</TableCell>
                                            <TableCell>{card.Note}</TableCell>
                                            {activeButton > 0 && (
                                                <TableCell>{card.Staff_name}</TableCell>
                                            )}
                                        </TableRow>
                                    ))
                            ) : (
                                refunds.filter((card) => {
                                    return card.refund_status != "Đã hoàn tiền"
                                }).map((refund) => (

                                    <TableRow
                                        key={refund.ItemID}
                                        onClick={() => {
                                            handleRefundRowClick(refund)
                                        }}
                                    >
                                        <TableCell className="w-12">{refund.ItemID }</TableCell>
                                        <TableCell>{refund.User_name}</TableCell>
                                        <TableCell>{refund.UpdateAt ? refund.UpdateAt.substr(0, 10) : ''}</TableCell>
                                        <TableCell><img className="w-24 h-24" src={refund.Url }/></TableCell>
                                        <TableCell>{refund.Name}</TableCell>
                                        <TableCell>{refund.refund_phone}</TableCell>
                                        <TableCell> {(refund.Price).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</TableCell>
                                        <TableCell>
                                            <div className="text-red-500 text-xl font-bold">
                                                {(refund.Price * (refund.DiscountRate)).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                            </div>
                                        </TableCell>
                                        <TableCell>{refund.refund_status}</TableCell>
                                        <TableCell>{refund.Staff_name}</TableCell>
                                    </TableRow>
                                ))
                            )
                        }
                    </TableBody>
                </TableContainer>
            </div>
            </div>
            <Popup

                open={openPopup}
                onClose={() => setOpenPopup(false)}
                position="right center"
                closeOnDocumentClick={false}
                closeOnEscape={false}
                modal
            >
                {(close) => (
                    <div>
                        {order && (
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
                                    <hr />
                                    
                                </div>
                                <hr />
                                <div className="mt-3 mb-3">
                                    Voucher áp dụng :
                                    <span className="font-bold text-red-500">
                                        {order.discount ? " " + order.discount + " %, Giảm tối đa " + order.MaxAmount / 1000 + "k" : "Không áp dụng"}
                                    </span>
                                </div>
                                <div className="overflow-y-scroll h-96">
                                    {orderItem.map((item) => (
                                        <div key={item.Id}>
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
                                                        {item.Price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-right mx-8 my-4  flex justify-end ">
                                    <div className="text-xl font-bold   ">Tổng cộng:</div>
                                    <div className="mx-2"></div>
                                    <div className="text-red-500 text-xl">
                                        {order.TotalAmount.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                    </div>
                                </div>
                                <div className="flex mx-2 place-content-between">
                                    <div className="flex gap-4">
                                        {getActiveStep(order.Status_Shipping) < 2 && (
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
                    </div>
                )}
            </Popup>
            <Popup

                open={openPopupRefund}
                onClose={() => setOpenPopupRefund(false)}
                position="right center"
                closeOnDocumentClick={false}
                closeOnEscape={false}
                modal
            >
                {(close) => (
                    <div>
                        <div className="text-xl font-bold">ĐỀ NGHỊ ĐỔI TRẢ</div>
                        <div className="">Mã mặt hàng :
                            <span className="font-bold">
                                {refundItem.ItemID}
                            </span>
                        </div>
                        <div className="flex place-content-between">
                            <div className="">Người đề nghị :
                                <span className="font-bold">
                                    {refundItem.User_name}
                                </span>
                            </div>
                            <div className="">Email :
                                <span className="font-bold">
                                    {refundItem.Email}
                                </span>
                            </div>
                            <div className="">Số điện thoại :
                                <span className="font-bold">
                                    {refundItem.refund_phone}
                                </span>
                            </div>
                        </div>
                        <hr />
                        <div className="flex mb-3 mt-3">
                            <div>Yêu cầu :
                                <span className="font-bold ml-4">{cases[refundItem.refund_type]}</span>
                            </div>
                        </div>
                        <hr />
                        <div className="overflow-y-scroll h-96">
                            <div className="flex">
                                <div className="w-1/2">
                                    Lý do :
                                    <div className="italic">
                                        {refundItem.refund_reason }
                                    </div>
                                </div>
                                <div className="w-1/2 flex flex-wrap">
                                    {refundItem.images && (
                                        refundItem.images.map((image) => (
                                            <a key={image.Id} href={image.Url} target="_blank" rel="noreferrer">
                                                <img className="w-48 h-48" src={image.Url} />
                                            </a>
                                        )) 
                                    )}
                                </div>
                            </div>
                            
                        </div>
                        <div className="mt-2 flex">
                            <TextField className="w-2/3" label="Tin nhắn tới khách hàng" multiline rows={4}
                                onChange={(event) => setMessage(event.target.value)} />
                            <div className="ml-8 w-1/3">
                                {refundItem.refund_type != 1 ? (
                                    <>
                                        <div className="text-xl font-bold">Số tiền hoàn lại :</div>
                                        <div className="text-2xl font-bold text-red-500">
                                            {(refundItem.Price * (refundItem.DiscountRate)).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                        </div>
                                    </>
                                ): (
                                    <div className="text-lg font-bold">Đổi sản phẩm, không hoàn tiền</div>
                                )}
                                
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-2">
                            {refundItem.refund_status == "Chờ duyệt" && (
                                <>
                                    <Button variant="contained" onClick={() => handleYes(close)}>
                                        Đồng ý
                                    </Button>
                                    <Button variant="contained" onClick={() => handleNo(close)}>
                                        Từ chối
                                    </Button>
                                </>
                            )}       
                            {refundItem.refund_status == "Đang chờ trả về" && (
                                <Button variant="outlined" onClick={() => { handleRecievedReturn(close) }}>
                                    Đã nhận lại hàng
                                </Button>
                            )}        
                            {refundItem.refund_status && (
                                <>
                                    {refundItem.refund_status.substr(0, 8) == "Đang chờ" && (
                                        <Button variant="outlined" onClick={() => { handleRecieveFailed(close) }}>
                                            Nhận hàng thất bại
                                        </Button>
                                    )}
                                </>
                                
                                )
                            }            
                            <Button variant="outlined" onClick={close}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    )
}
