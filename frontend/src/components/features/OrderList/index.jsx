import React, { useState, useEffect } from 'react'
import './styles.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Rating, Avatar } from '@mui/material'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Popup from 'reactjs-popup'
import ImageUploader from '../ImageUploader'
import moment from 'moment';

const steps = ['Chờ duyệt', 'Đang chuẩn bị', 'Đang giao', 'Đã giao']
const OrderList = (props) => {
    const [cards, setCards] = useState([])
    const [vouchers, setVouchers] = useState([])
    const [rating, setRating] = useState(0)
    const [feedbackContent, setFeedbackContent] = useState('')
    const [openPopup, setOpenPopup] = useState(false)
    const [openPopupView, setOpenPopupView] = useState(false)
    const [openPopupRefund, setOpenPopupRefund] = useState(false)
    //For refund purpose
    const [refundReason, setRefundReason] = useState('')
    const [refundImages, setRefundImages] = useState([])
    const [refundPhone, setRefundPhone] = useState('')
    const [refundType, setRefundType] = useState(0)
    const [staffId, setStaffId] = useState(null)
    //For popup purpose
    const [itemId, setItemId] = useState(0)
    const [itemRate, setItemRate] = useState({})
    const [proId, setProId] = useState(0)
    const [proName, setProName] = useState('')

    const navigate = useNavigate()

    const handleStarPoint = (event) => {
        setRating(event.target.value)
    }
    const handleFeedbackContent = (event) => {
        setFeedbackContent(event.target.value)
    }
    const handleRebuy = (productId) => {
        navigate('/products/' + productId)
    }
    //step
    const getActiveStep = (status) => {
        return steps.indexOf(status)
    }
    const calculateDistanceInDays = (date1, date2) => {
        const momentDate1 = moment(date1);
        const momentDate2 = moment(date2);
        const distanceInDays = momentDate2.diff(momentDate1, 'days');
        return distanceInDays;
    };
    async function fetchOrderItems(id) {
        const response = await axios.get(`http://localhost:3000/order/list/${id}`, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        return response.data
    }
    async function fetchVouchers() {
        const response = await axios.get(`http://localhost:3000/users/getVoucher/${props.user.Id}`, {
            headers: {
                Authorization: 'Bearer ' + props.user.token
            }
        })
        setVouchers(response.data)
    }

    const fetchRatings = async (id) => {
        const response = await axios.get(`http://localhost:3000/order/feedback/${id}`)
        return response.data
    }
    async function submitFeedback(orderItemId, close) {
        const json = {
            id: props.user.Id,
            ProductId: orderItemId,
            StarPoint: rating,
            Content: feedbackContent
        }
        if (json.StarPoint > 0) {
            const res = await axios.post(`http://localhost:3000/products/rating/`, json, {
                headers: {
                    Authorization: 'Bearer ' + props.user.token
                }
            })
            await axios.post('http://localhost:3000/notification/', {
                userId: null,
                content: `${props.user.Name} đã đánh giá ${rating} sao mặt hàng ${proName} vào ngày ${new Date(Date.now()).toLocaleDateString()}`,
                refId: res.data.Id + 'f',
                refUrl: "/products/" + proId,
                refPic: props.user.Picture
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            alert('Chúng tôi đã ghi nhận. Chân thành cảm ơn bạn!')
            fetchOrder()
            close()
        } else {
            alert('Xin vui lòng đánh giá số sao')
        }
    }

    async function handleDelete(Id, close) {
        const res = await axios.delete(`http://localhost:3000/products/rating/${props.user.Id}/${Id}`, {
            headers: {
                Authorization: 'Bearer ' + props.user.token
            }
        })
        await axios.delete(`http://localhost:3000/notification/1/${Id + "f"}`, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        alert('Đã gỡ phản hồi')
        fetchOrder()
        close()           
    }
    async function handleCancelOrder(Id, status, items) {
        const confirm = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác")
        if (confirm) {
            await axios.delete(`http://localhost:3000/order/${Id}/${props.user.Id}`, {
                headers: {
                    Authorization: 'Bearer ' + props.user.token
                }
            })
            await axios.patch('http://localhost:3000/notification/', {
                content: "Bạn đã hủy đơn hàng số " + Id,
                Id: Id + 'o',
                userId: props.user.Id,
                refUrl: "/user/purchase",
                refPic: null
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.post('http://localhost:3000/notification/', {
                userId: staffId ? staffId : null,
                content: `${props.user.Name} đã hủy đơn hàng mã ${Id} khi đang trạng thái '${status}'`,
                refId: null,
                refUrl: "/admin/Orders",
                refPic: props.user.Picture
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            items.map(async (item) => {
                await axios.patch('http://localhost:3000/products/stock', {
                    Quantity : item.Quantity,
                    Id: item.Id
                }, {
                    headers: {
                        Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                    }
                })
            })
            alert('Đã hủy diệt đơn hàng!')
            fetchOrder()
        }       
    }
    async function fetchOrder() {
        const response = await axios.get(`http://localhost:3000/order/user/${props.user.Id}`, {
            headers: {
                Authorization: 'Bearer ' + props.user.token
            }
        })
        if (response.data) {
            const jsonData = response.data;
            const ordersWithItems = [];

            for (const order of jsonData) {
                const items = await fetchOrderItems(order.Id);
                const itemWithRatings = [];

                for (const item of items) {
                    const ratings = await fetchRatings(item.ItemID);
                    const itemWithRating = { ...item, ratings };
                    itemWithRatings.push(itemWithRating);
                }

                const orderWithItems = { ...order, items: itemWithRatings };
                ordersWithItems.push(orderWithItems);
            }
            console.log(ordersWithItems);
            setCards(ordersWithItems);
        }
    }

    const handleFeedbackButtonClick = async (card, item) => {
        setItemId(item.ItemID)
        setProId(item.Id)
        setProName(item.Name)
        if (item.ratings.length > 0) {
            let rate = await fetchRatings(item.ItemID)
            setItemRate(rate[0])
            setOpenPopupView(true);
        } else {
            setOpenPopup(true);
        }
    };

    const handleSendRefundRequest = async (close) => {
        if (!refundPhone) {
            alert("Vui lòng nhập số điện thoại")
            return
        }else if (!refundReason) {
            alert("Vui lòng nhập lý do")
            return
        } else if (refundImages.length == 0) {
            alert("Vui lòng tải ảnh để làm bằng chứng")
            return
        }
        const API_key = import.meta.env.VITE_IMAGE_API
        const host = 'https://api.imgbb.com/1/upload'
        const expiration = -1
        const urls = []

        await Promise.all(
            refundImages.map(async (image) => {
                const response = await axios.postForm(`${host}?expiration=${expiration}&key=${API_key}`, {
                    image: image.data_url.substring(image.data_url.indexOf(',') + 1)
                })
                if (response.data) {
                    urls.push(response.data.data.url)
                }
            })
        )
        await axios.post('http://localhost:3000/order/refund', {
            id: props.user.Id,
            urls : urls,
            phone: refundPhone,
            reason: refundReason,
            type: refundType,
            itemId : itemId
        }, {
            headers: {
                Authorization: 'Bearer ' +props.user.token
            }
        })
        await axios.post('http://localhost:3000/notification/', {
            userId: staffId,
            content: `${props.user.Name} đã gửi 1 yêu cầu đổi trả / hoàn tiền sao mặt hàng ${proName} mã mặt hàng ${itemId}`,
            refId: itemId + 'r',
            refUrl: '/admin/Orders',
            refPic: props.user.Picture
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        alert('Yêu cầu của bạn sẽ được chúng tôi xét duyệt! Cảm ơn bạn!')
        fetchOrder() 
        close()
    }

    const displayVoucher = (Id) => {
        let voucher = vouchers.find(voucher => voucher.ID == Id)
        return voucher ? voucher.discount + '%, Giảm tối đa ' + voucher.MaxAmount/1000 + "k" : "Không áp dụng"      
    }

    useEffect(() => {
        fetchOrder();
        fetchVouchers();
        setRefundPhone(props.user.PhoneNumber)
    }, []);


    return (
        <>
            <div className="form-header">
                <h1>Đơn Hàng Của Tôi</h1>
                <p>Những đơn hàng bạn đã đặt</p>
            </div>
            <hr />
            {/*Loop*/}

            {cards.map((card) => (
                <div className={"flex-col m-2 p-2 rounded-lg bg-slate-100 "}
                     key={card.Id}>
                    <div className=" flex place-content-between px-4 my-4">
                        <div className="flex">
                            <div className="px-2">Mã đơn hàng: {card.Id} </div>
                            <div>|</div>
                            <div className="px-2">Ngày đặt mua: {(card.OrderDate + '').substr(0, 10)} </div>
                        </div>
                        <div className="flex">
                            <Stepper activeStep={getActiveStep(card.Status_Shipping)}>
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
                            {/* <div>|</div> */}
                            {/* <div className="px-2"> Trạng thái đơn hàng: {card.Status} </div> */}
                        </div>
                    </div>
                    <hr className="border  border-slate-300 my-2 w-full " />

                    <div className="flex-row w-full">
                        {card.items.map((item) => (
                            <div key={item.Id} className={item.refund_status == "Đang chờ trả về" ? 'bg-red-100' : ''}>
                                <div className="flex-row w-full">
                                    <div className="flex place-content-between">
                                        <div className="flex">
                                            <Button onClick={() => handleRebuy(item.Id)}>
                                                <img className="h-30 w-20 mx-4  " src={item.Url}></img>
                                            </Button>
                                            <div className="">
                                                <div className="font-bold">{item.Name}</div>
                                                <div className="pl-2">Phân loại: {item.Shape}</div>
                                                <div className="pl-2">x{item.Quantity}</div>
                                            </div>
                                        </div>
                                        {item.refund_status != "Đã hoàn tiền" && (
                                            <div className="">
                                                <div className="mx-8 my-4 text-right line-through text-gray-400 ">
                                                    {parseInt((item.Price * 100) / (100 - item.discount)).toLocaleString('vi', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    })}
                                                </div>
                                                <div className="mx-8 text-right text-red-500 ">
                                                    {' '}
                                                    {item.Price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {!item.refund_status && (
                                        <>
                                            {card.Status_Shipping == "Đã giao" && (
                                            <>
                                                <div className="text-end">
                                                    <Button
                                                        className=""
                                                        variant="contained"
                                                        onClick={() => handleFeedbackButtonClick(card, item)}
                                                    >
                                                        {item.ratings.length > 0
                                                            ? 'Xem Đánh giá'
                                                            : 'Đánh giá'}
                                                    </Button>

                                                </div>
                                                {calculateDistanceInDays(card.UpdateAt, moment()) <= 7 && (
                                                        <div className="text-end mt-4">
                                                        <Button
                                                            color="error"
                                                            variant="outlined"
                                                            onClick={() => {
                                                                setOpenPopupRefund(true)
                                                                setProName(item.Name)
                                                                setItemId(item.ItemID)
                                                                setStaffId(card.StaffID)
                                                                setRefundType(0)
                                                            }
                                                            }
                                                        >
                                                            Đổi trả / hoàn tiền
                                                        </Button>
                                                    </div>
                                                )}
                                                </>
                                            )}
                                        </>
                                    )}
                                    {item.refund_status == "Chờ duyệt" && (
                                        <div className="text-end mt-4">
                                            <Button
                                                color="error"
                                                variant="outlined"   
                                                disabled
                                            >
                                                Đang chờ duyệt đổi trả
                                            </Button>
                                        </div>
                                    )}
                                    {(item.refund_status == "Đang chờ trả về" || item.refund_status == "Đã hoàn tiền") && (
                                        <div className="text-end mt-4">
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                disabled
                                            >
                                                {item.refund_status }
                                            </Button>
                                        </div>
                                    )}
                                    <hr className="border  border-slate-300 my-2 mx-8" />
                                    
                                </div>
                            </div>
                        ))}
                        {(card.Status_Shipping == "Chờ duyệt" || card.Status_Shipping == "Đang chuẩn bị") && card.Status_Paid == "Chưa Thanh Toán" && (
                            <div className="text-end mt-4">
                                <Button
                                    color="error"
                                    variant="contained"
                                    onClick={() => {
                                        setStaffId(card.StaffID)
                                        handleCancelOrder(card.Id, card.Status_Shipping, card.items) }}
                                >
                                    Hủy đơn hàng
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="flex place-content-between ">
                        <div>
                            <div className="text-left mx-8 my-4 text-xl">{card.Status_Paid}</div>
                            <div className='flex'>
                                <div className='text-left ml-8 my-4'>Voucher áp dụng: </div>
                                <div className='text-left mx-2 my-4 text-red-500 font-bold'>
                                    {displayVoucher(card.VoucherID) }
                                </div>
                            </div>
                        </div>

                        <div className='flex m-6'>
                            <div className='text-right text-xl mr-2'>Tổng cộng: </div>
                            <div className="text-right text-red-500 text-xl">
                                {parseInt(card.TotalAmount).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <Popup
                open={openPopup}
                position="right center"
                closeOnDocumentClick={false}
                closeOnEscape={false}
                modal
                onClose={() => setOpenPopup(false)}
            >
                {(close) => (
                    <div className="p-4">
                        <h2>ĐÁNH GIÁ SẢN PHẨM</h2>
                        <hr className="border border-slate-300 mt-4 mx-4" />
                        <h3>{proName}</h3>
                        <div>
                            <Rating name="hover-feedback" precision={1} onChange={handleStarPoint} defaultValue={0} />

                            <TextField
                                className="text-left"
                                fullWidth
                                variant="standard"
                                label="Hãy cho chúng tôi biết cảm nghĩ của bạn về sản phẩm"
                                multiline
                                rows={6}
                                onChange={handleFeedbackContent}
                            ></TextField>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <Button variant="outlined" onClick={close}>
                                Đóng
                            </Button>
                            <Button variant="contained" onClick={() => submitFeedback(itemId, close)}>
                                Lưu
                            </Button>
                        </div>
                    </div>
                )}
            </Popup>
            <Popup
                open={openPopupView}
                position="right center"
                modal
                onClose={() => setOpenPopupView(false)}
            >
                {(close) => (
                    itemRate && (
                        <div className="p-4">
                            <h2>ĐÁNH GIÁ SẢN PHẨM</h2>
                            <h3>{proName}</h3>
                            <hr className="border border-slate-300 mt-4 mx-4" />
                            <div>
                                <div className="flex">
                                    <div>
                                        <Avatar className="rounded-2xl h-24 w-24 m-2" src={props.user.Picture} />
                                    </div>
                                    <div className="mx-4">
                                        <div className="">
                                            <div className="flex">
                                                <h4 className="font-bold ">{props.user.Name}</h4>
                                            </div>

                                            <div className="text-sm flex">
                                                <Rating name="hover-feedback " size="small" value={itemRate.StarPoint} precision={1} readOnly />
                                                <div className="mx-4"></div>
                                                <div className="text-sm text-center flex align-middle">
                                                    {new Date(itemRate.CreateAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mt-4">{itemRate.Content}</p>
                                    </div>
                                </div>
                                <div className="my-4 ml-12 flex bg-gray-100 pt-4 pb-4">
                                    <div>
                                        <Avatar className="rounded-2xl h-24 w-24 m-2" src={itemRate.ReplierPicture} />
                                    </div>
                                    {itemRate.ReplyContent ? (
                                        <div className="">
                                            <div className="">
                                                <div className="flex">
                                                    <h4 className="font-bold ">{itemRate.ReplierName}</h4>
                                                </div>

                                                <div className="text-sm flex">
                                                    <div className="text-sm text-center flex align-middle">
                                                        {new Date(itemRate.ReplyDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="mt-4">{itemRate.ReplyContent}</p>
                                        </div>
                                    ) : (
                                        <div>Đang chờ phản hồi từ shop</div>

                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                {!itemRate.ReplyContent &&
                                    (<Button variant="contained" onClick={() => handleDelete(itemRate.Id, close)} color="error">
                                        XÓA
                                    </Button>
                                )}
                                <Button variant="outlined" onClick={() => handleRebuy(proId)}>
                                    Xem sản phẩm
                                </Button>
                                <Button variant="outlined" onClick={close}>
                                    Đóng
                                </Button>
                            </div>
                        </div>
                    )
                )}
            </Popup>
            <Popup
                open={openPopupRefund}
                position="right center"
                modal
                closeOnDocumentClick={false}
                closeOnEscape={false}
                onClose={() => setOpenPopupRefund(false)}
            >
                {(close) => (
                    <div className="p-4">
                        <h2>ĐỔI TRẢ SẢN PHẨM</h2>
                        <div>{proName}</div>
                        <div>Mã hàng : { itemId}</div>
                        <hr className="border border-slate-300 mt-4 mx-4" />
                        <div className="italic">Sau khi bạn gửi yêu cầu, nhân viên sẽ phê duyệt yêu cầu của bạn. Họ có thể sẽ cần liên
                            hệ với bạn để làm rõ. Nếu hợp lệ, bạn sẽ được đổi trả hoặc hoàn tiền</div>
                        <div className="flex mt-4"> 
                            <TextField className="w-2/3" variant="standard" label="Lí do đổi trả" multiline rows={6}
                                onChange={(event) => setRefundReason(event.target.value)} />
                            <div>
                                Ảnh bằng chứng
                                <ImageUploader setImages={setRefundImages} images={refundImages} maxNumber={4} />
                            </div>
                        </div>
                        <div className="mt-3 flex place-content-between">
                            <TextField  variant="standard" label="Số điện thoại liên hệ" value={refundPhone}
                                onChange={(event) => setRefundPhone(event.target.value)} />
                            <TextField select variant="filled" label="Trường hợp của bạn" defaultValue={0} className="w-1/2"
                                onChange={(event) => setRefundType(event.target.value)}>
                                <MenuItem value={0}>Hoàn tiền nhưng không cần trả sản phẩm</MenuItem>
                                <MenuItem value={1}>Đổi sản phẩm khác</MenuItem>
                                <MenuItem value={2}>Trả sản phẩm và hoàn tiền</MenuItem>
                            </TextField>
                        </div>                   
                        <div className="flex justify-end space-x-3 mt-4">
                            <Button variant="contained" onClick={() => handleSendRefundRequest(close)}>
                                Gửi
                            </Button>
                            <Button variant="outlined" onClick={close}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                )}
            </Popup>
        </>
    )
}

export default OrderList
