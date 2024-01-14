import React, { useState, useEffect } from 'react';
import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Rating } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import logo from '../../../image/icons/logo.png'
import { ToastContainer, toast } from 'react-toastify'
import Popup from 'reactjs-popup'
import { TextField } from '@mui/material'
import VNPay from '../../../image/icons/VNPay.svg'
import COD from '../../../image/icons/COD.svg'
import AddressPopup from '../../../components/features/AddressPopup/AddressPopup'

const steps = ['Chờ duyệt','Xác nhận thanh toán', 'Đang thi công', 'Đang chuẩn bị', 'Đang giao', 'Đã giao'];

const OrderListCustom = (props) => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [vouchers, setVouchers] = useState([])
    const [paymentMethod, setPaymentMethod] = useState('COD') // Default to 'onDelivery'
    const [orderAddress, setOrderAddress] = useState('')
    const [orderVoucher, setOrderVoucher] = useState('')
    const [voucherValue, setVoucherValue] = useState(0)
    const [voucherMax, setVoucherMax] = useState(0)
    const [addressList, setAddressList] = useState([])
    const [phoneNumber, setPhoneNumber] = useState('')
    const [checkValidation, setCheckValidation] = useState(true)
    const [checkAddress, setCheckAddress] = useState(true)
    const [checkNumChar, setCheckNumChar] = useState(true)
    const [orderDetail, setOrderDetail] = useState({})
    const [isPopup, setPopup] = useState(false)
    const [viewRecipe, setViewRecipe] = useState(false)
     
    const gotoEdit = (id) => {
        navigate('/custom', { state: { orderId: id } })
        window.scrollTo(0,0)
    }

    const handleAddressChange = (event) => {
        setCheckAddress(true)
        setOrderAddress(event.target.value)
    }
    async function fetchDetails(id) {
        const response = await axios.get(`http://localhost:3000/custom/order/${id}`, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        setOrderDetail(response.data)
        console.log(response.data)
    }
    async function fetchAddresses() {
        const response = await axios.get(`http://localhost:3000/address/${props.user.Id}`, {
            headers: {
                Authorization: 'Bearer ' + props.user.token
            }
        })
        setAddressList(response.data)
    }

    const checkPattern = (inputValue, pattern) => {
        const regex = new RegExp(pattern)
        return regex.test(inputValue)
    }

    const handlePhoneChange = (event) => {
        let inputPhoneNumber = event.target.value

        // Regular expression pattern for a valid phone number. You can adjust it as needed.
        const phonePattern =
            '(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}'

        if (!checkPattern(inputPhoneNumber, phonePattern)) {
            setCheckValidation(false)
        } else {
            setCheckValidation(true)
            if (inputPhoneNumber.length > 9 && inputPhoneNumber.length <= 11) {
                setCheckNumChar(true)
            } else {
                setCheckNumChar(false)
            }
        }
        setPhoneNumber(event.target.value)
    }

    const checkUserPhoneNum = () => {
        if (props.user.PhoneNumber) {
            setPhoneNumber(props.user.PhoneNumber)
        }
    }

    const handleKeyDown = (event) => {
        const forbiddenKeys = ['e', '+', '-', '.'];

        // Prevent the characters "e", "+", and "-" from being entered.
        if (forbiddenKeys.includes(event.key)) {
            event.preventDefault();
        }

        // Prevent input when the length is 11 and the key pressed is not delete, backspace, or arrow keys.
        if (event.target.value.length >= 11 && !['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
    }
    async function fetchVouchers() {
        const response = await axios.get(`http://localhost:3000/users/getVoucher/${props.user.Id}`, {
            headers: {
                Authorization: 'Bearer ' + props.user.token
            }
        })
        setVouchers(response.data)
    }

    async function handleCancelOrder(id,name, status_, staffId_) {
        const confirm = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này")
        if (confirm) {
            await axios.patch(`http://localhost:3000/custom/cancel`, {
                id : props.user.Id,
                orderId : id
            }, {
                headers: {
                    Authorization: 'Bearer ' + props.user.token
                }
            })
            await axios.patch('http://localhost:3000/notification/', {
                content: `Bạn đã hủy đơn lồng tùy chỉnh '${name}'`,
                Id: id + 'co',
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            await axios.post('http://localhost:3000/notification/', {
                userId: staffId_,
                content: `${props.user.Name} đã hủy lồng custom mã ${id} ('${name}') khi đang trạng thái '${status_}'`,
                refId: null,
                refUrl: "/admin/CustomOrders",
                refPic: props.user.Picture
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            fetchCustomOrder()
        }
    }
    async function handleDelete(id) {
        await axios.delete(`http://localhost:3000/custom/${props.user.Id}/${id}`, {
            headers: {
                Authorization: 'Bearer ' + props.user.token
            }
        })
        fetchCustomOrder()
    }

    const calculateCouponPice = () => {
        if (voucherValue == 0) return 0
        let total = orderDetail.other.Price_final
        let coupon = total - (total * (100 - voucherValue) / 100)
        if (coupon > voucherMax) coupon = voucherMax
        return coupon
    }

    const calculateGrandTotal = () => {
        let total = orderDetail.other.Price_final
        total -= calculateCouponPice()
        return total
    }

    const getActiveStep = (status) => {
        return steps.indexOf(status);
    };

    async function fetchCustomOrder() {
        const response = await axios.get(`http://localhost:3000/custom/user/${props.user.Id}`, {
            headers: {
                Authorization: 'Bearer ' + props.user.token
            }
        });
        setCards(response.data);
    }

    const handlePayment = async (id, name, staffId_, close) => {
        try {
            if (orderAddress) {
                if (phoneNumber && checkNumChar) {
                    if (checkValidation) {
                        const res = await axios.post('http://localhost:3000/custom/pay', {
                            orderId : id,
                            addressID: orderAddress,
                            phoneNumber: ''+phoneNumber,
                            method: paymentMethod,
                            voucherID: orderVoucher,
                            Point : orderDetail.other.Price_final / 1000,
                            id : props.user.Id
                        }, {
                            headers: {
                                Authorization: 'Bearer ' + props.user.token
                            }
                        })

                     
                        await axios.post('http://localhost:3000/users/updateVoucher', {
                            Id: orderVoucher
                        }, {
                            headers: {
                                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                            }
                        })
                        await axios.post('http://localhost:3000/notification/', {
                            userId: staffId_,
                            content: `${props.user.Name} đã thanh toán lồng tùy chỉnh '${name}' vào ngày ${new Date(Date.now()).toLocaleDateString()} với phương thức ${paymentMethod}`,
                            refId: null,
                            refUrl: "/admin/CustomOrders",
                            refPic: props.user.Picture
                        }, {
                            headers: {
                                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                            }
                        })

                        if (paymentMethod == 'vnpay') {
                            const response = await axios.post('http://localhost:3000/payment/create_payment_url', {
                                amount: calculateGrandTotal(),
                                bankCode: '',
                                language: 'vn',
                                email: props.user.Email,
                                phoneNumber: phoneNumber,
                                orderid: id,
                                type : "Custom"
                            })

                            // console.log(response.data.url)
                            window.location.href = response.data.url

                        } else {                      
                            toast.dismiss()
                            toast.success('Đặt hàng thành công', {
                                position: 'bottom-left',
                                autoClose: 1000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: true,
                                progress: undefined,
                                theme: 'colored'
                            })
                            close()
                        }
                        setOrderAddress('')
                        setPhoneNumber('')
                        alert("Đặt hàng thành công")
                        fetchCustomOrder()
                    } else {
                        setCheckValidation(false)
                    }
                } else {
                    setCheckValidation(false)
                }
            } else {
                setCheckAddress(false)
                if (!phoneNumber) {
                    setCheckValidation(false)
                }
            }        
        } catch (error) {
            console.error('Lỗi thanh toán:', error)
        }
    }

    const displayVoucher = (Id) => {
        let voucher = vouchers.find(voucher => voucher.ID == Id)
        return voucher ? voucher.discount + '%, Giảm tối đa ' + voucher.MaxAmount / 1000 + "k" : "Không áp dụng"
    }

    useEffect(() => {
        fetchCustomOrder();
        fetchVouchers();
    }, []);

    return (
        <>
            <div className="form-header">
                <h1>Đơn Hàng Của Tôi</h1>
                <p>Những đơn hàng bạn đã đặt</p>
            </div>
            <hr />
            <Popup
                open={isPopup}
                onOpen={() => {
                    fetchAddresses()
                    checkUserPhoneNum()
                }}
                closeOnDocumentClick={false}
                position="right center"
                modal
                onClose={() => setPopup(false)}
            >
                {(close) => (
                    <div>
                        <h1>Thông tin người nhận</h1>
                        <div className="container">
                            <div className="adr-container">
                                <div className="w-3/4">
                                    <TextField
                                        select
                                        required
                                        fullWidth
                                        label="Chọn địa chỉ của bạn"
                                        className="user-input"
                                        id="adrress"
                                        size="small"
                                        SelectProps={{
                                            native: true
                                        }}
                                        onChange={handleAddressChange}
                                        error={!checkAddress}
                                        helperText={!checkAddress ? "Xin hãy chọn địa chỉ của bạn" : ""}
                                    >
                                        <option value="" selected></option>
                                        {addressList.map((adr) => (
                                            <option key={adr} value={adr.ID}>
                                                {adr.SoNha + ', ' + adr.PhuongXa + ', ' + adr.QuanHuyen + ', ' + adr.TinhTP}
                                            </option>
                                        ))}
                                    </TextField>
                                </div>
                                <div>
                                    <Popup trigger={<Button variant="contained">Thêm</Button>} position="right center" modal>
                                        {(close) => (
                                            <div className="popup-address">
                                                <h1>Thêm địa chỉ</h1>
                                                <AddressPopup user={props.user} fetchAddresses={fetchAddresses} close={close} />
                                            </div>
                                        )}
                                    </Popup>
                                </div>
                            </div>
                            <div className="phone-container w-3/4">
                                <TextField
                                    type="number"
                                    required
                                    fullWidth
                                    label="Số điện thoại"
                                    className="user-input"
                                    id="phoneNumber"
                                    size="small"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    onKeyDown={handleKeyDown}
                                    error={!checkValidation || !checkNumChar}
                                    helperText={(!checkValidation || !checkNumChar) ? (!phoneNumber ? 'Xin hãy nhập số điện thoại' : 'Số điện thoại không hợp lệ') : ('')}
                                ></TextField>
                                {/* </div>
                                                        <hr className="border  border-slate-100 my-2 mx-10" /> */}
                                {/* <h1>Sản phẩm</h1>
                                                        */}
                            </div>
                        </div>
                        <div className=" border-gray-300 rounded   ">
                            <div className="flex place-content-between">
                                <TextField
                                    select
                                    label="Chọn phiếu giảm giá"
                                    className="user-input"
                                    id="voucher"
                                    size="small"
                                    SelectProps={{
                                        native: true,
                                    }}
                                    InputLabelProps={{ shrink: true }}

                                    onChange={(event) => {
                                        const selectedValue = event.target.value;
                                        const [voucherId, voucherDiscount, voucherMax] = selectedValue.split(',');
                                        setVoucherValue(voucherDiscount.trim());
                                        setOrderVoucher(voucherId.trim());
                                        setVoucherMax(voucherMax)
                                    }}
                                >
                                    <option value={["", 0]} selected>
                                        <em>Không sử dụng phiếu giảm giá</em>
                                    </option>

                                    {vouchers.map((voucher) =>
                                        voucher.UsedAt == null && (
                                            <option key={voucher.ID} value={[voucher.ID, voucher.discount, voucher.MaxAmount]}>
                                                {voucher.discount + '%, Giảm tối đa ' + voucher.MaxAmount / 1000 + 'K, Hết hạn ' + voucher.ExpireAt.substr(0, 10)}
                                            </option>
                                        )
                                    )}
                                </TextField>

                            </div>
                            {orderDetail.general && ( 
                                <>
                                    <div className="font-bold flex place-content-end">
                                        <div className="mr-4">Được giảm giá:</div>
                                        <div className="text-xl">
                                            {calculateCouponPice().toLocaleString('vi', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}
                                        </div>
                                    </div>
                                    <div className="font-bold flex place-content-end">
                                        <div className="mr-4">Số điểm bonus sẽ tích được:</div>
                                        <div className="text-xl">{orderDetail.other.Price_final / 1000}</div>
                                    </div>
                                    <hr></hr>
                                    <div className="font-bold flex place-content-end ">
                                        <div className="text-xl font-bold mr-4">THANH TOÁN:</div>
                                        <div className="text-4xl font-bold mr-4 text-red-400">
                                            {calculateGrandTotal().toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                        </div>
                                    </div>
                                </>
                            ) }
                           
                        </div>
                        <div className="flex place-content-between mt-4">
                            <div>
                                <div className="flex mb-2">
                                    <label className="flex">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={() => setPaymentMethod('COD')}
                                        />
                                        <div className="flex align-middle items-center text-lg">
                                            Thanh toán khi nhận hàng
                                            <img className="w-1/12 mx-2" src={COD} alt="" />
                                        </div>
                                    </label>
                                </div>

                                <div className="flex">
                                    <label className="flex">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="vnpay"
                                            checked={paymentMethod === 'vnpay'}
                                            onChange={() => setPaymentMethod('vnpay')}
                                        />
                                        <div className="flex items-center text-lg">
                                            Thanh toán nhanh cùng VNPay
                                            <img className="w-2/12 m-2" src={VNPay} alt="" />
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center ">
                                {/* <button className="decision" onClick={close}></button> */}
                                <div>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            handlePayment(orderDetail.general.ID, orderDetail.general.Name, orderDetail.other.StaffID, close)
                                        }}
                                    >
                                        Đặt hàng
                                    </Button>
                                    <ToastContainer />
                                </div>
                                <div>
                                    <Button variant="contained" onClick={close}>
                                        Hủy
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>
            <Popup
                open={viewRecipe}
                position="right center"
                modal
                onClose={() => setViewRecipe(false)}
            >
                {(close) => (
                    <div className="overflow-y-scroll bg-slate-100" style={{ height : '600px' }}>
                        {orderDetail.general && (
                        <>
                            <div className="text-xl font-bold mt-8">
                                Chi tiết đơn hàng
                            </div>
                                <div>
                                    <div className="italic text-lg">Chung</div>
                                    <table className="w-full">
                                        <thead></thead>
                                        <tbody>
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Người đặt hàng</td>
                                                <td className="my-4 py-4  bg-white pl-4">{orderDetail.general.User_name}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Hình dáng</td>
                                                <td className="my-4 py-4  bg-white pl-4">{orderDetail.general.Shape_name}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            {orderDetail.general.Shape == "CT" && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Hình ảnh hình dáng</td>
                                                        <td className="my-4 py-4  bg-white pl-4">
                                                            <img className="w-64 h-64" src={orderDetail.general.Shape_picture}></img>
                                                        </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                </>

                                            )}
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chiều dài</td>
                                                <td className="my-4 py-4  bg-white pl-4">{orderDetail.general.Length} cm</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chiều rộng</td>
                                                <td className="my-4 py-4  bg-white pl-4">{orderDetail.general.Width} cm</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chiều cao</td>
                                                <td className="my-4 py-4  bg-white pl-4">{orderDetail.general.Height} cm</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <div className="italic text-lg">Chung</div>
                                    <table className="w-full">
                                        <thead></thead>
                                        <tbody>
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mức độ tỉ mỉ</td>
                                                <td className="my-4 py-4  bg-white pl-4 text-4xl font-bold">{orderDetail.other.Detail} / 100</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Vật liệu chung</td>
                                                <td className="my-4 py-4  bg-white pl-4">{orderDetail.general.Material}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            {orderDetail.general.Color && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Màu sắc chung</td>
                                                        <td className="my-4 py-4  bg-white pl-4">
                                                            <input className="w-64 h-16" type="color" value={orderDetail.general.Color} readOnly />
                                                        </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                </>

                                            )}
                                            {orderDetail.general.Shape.trim() == "LS" && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Độ phồng</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.general.InflateLevel} </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Vị trí phồng</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.general.InflatePosition} </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                </>
                                            )}
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Loại chim</td>
                                                <td className="my-4 py-4  bg-white pl-4">{orderDetail.other.BirdType} </td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả khác</td>
                                                <td className="my-4 py-4  bg-white pl-4">{orderDetail.other.Other_description} </td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                        </tbody>
                                    </table>
                                </div>
                                {(orderDetail.general.Shape.trim() == "LV" || orderDetail.general.Shape.trim() == "LG") && (
                                <>
                                    <div>
                                        <div className="italic text-lg">Viền</div>
                                        <table className="w-full">
                                            <thead></thead>
                                            <tbody>
                                                <hr className="border border-r-violet-400" />
                                                <tr className="">
                                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Họa tiết viền</td>
                                                    <td className="my-4 py-4  bg-white pl-4">{orderDetail.general.Outline_Pattern}</td>
                                                </tr>
                                                {orderDetail.general.Outline_Pattern == "Tùy chỉnh" && (
                                                    <>
                                                        <tr className="">
                                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Hình ảnh họa tiết</td>
                                                            <td className="my-4 py-4  bg-white pl-4">
                                                                <img className="w-64 h-64" src={orderDetail.general.Outline_pattern_img}></img>
                                                            </td>
                                                        </tr>
                                                        <hr className="border border-r-violet-400" />
                                                        <tr className="">
                                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả</td>
                                                            <td className="my-4 py-4  bg-white pl-4">{orderDetail.general.Outline_pattern_desc}</td>
                                                        </tr>
                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <div className="italic text-lg">Góc</div>
                                        <table className="w-full">
                                            <thead></thead>
                                            <tbody>
                                                <hr className="border border-r-violet-400" />
                                                <tr className="">
                                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Họa tiết góc</td>
                                                    <td className="my-4 py-4  bg-white pl-4">{orderDetail.general.Corner_Pattern}</td>
                                                </tr>
                                                    {orderDetail.general.Corner_Pattern == "Tùy chỉnh" && (
                                                    <>
                                                        <tr className="">
                                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Hình ảnh họa tiết</td>
                                                            <td className="my-4 py-4  bg-white pl-4">
                                                                <img className="w-64 h-64" src={orderDetail.general.Corner_pattern_img}></img>
                                                            </td>
                                                        </tr>
                                                        <hr className="border border-r-violet-400" />
                                                        <tr className="">
                                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả</td>
                                                            <td className="my-4 py-4  bg-white pl-4">{orderDetail.general.Corner_pattern_desc}</td>
                                                        </tr>
                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                                )}
                                <div>
                                    <div className="italic text-lg">Móc</div>
                                    <table className="w-full">
                                        <thead></thead>
                                        <tbody>
                                            {orderDetail.hook ? (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Kích thước móc</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.hook.Hook_size} cm</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Kiểu cách</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.hook.Hook_Style}</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chất liệu</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.hook.Hook_Material}</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    {orderDetail.hook.Hook_Color && (
                                                        <>
                                                            <tr className="">
                                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Màu sắc</td>
                                                                <td className="my-4 py-4  bg-white pl-4">
                                                                    <input className="w-64 h-16" type="color" value={orderDetail.hook.Hook_Color} readOnly />
                                                                </td>
                                                            </tr>
                                                            <hr className="border border-r-violet-400" />
                                                        </>
                                                    )}
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.hook.Hook_Pattern}</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    {orderDetail.hook.Hook_Pattern == "Tùy chỉnh" && (
                                                        <>
                                                            <tr className="">
                                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Ảnh họa tiết</td>
                                                                <td className="my-4 py-4  bg-white pl-4">
                                                                    <img className="w-64 h-64" src={orderDetail.hook.Hook_pattern_img}></img>
                                                                </td>
                                                            </tr>
                                                            <hr className="border border-r-violet-400" />
                                                            <tr className="">
                                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả họa tiết</td>
                                                                <td className="my-4 py-4  bg-white pl-4">{orderDetail.hook.Hook_pattern_description} cm</td>
                                                            </tr>
                                                            <hr className="border border-r-violet-400" />
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <tr className="">
                                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Custom</td>
                                                    <td className="my-4 py-4  bg-white pl-4">Không custom</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <div className="italic text-lg">Cửa</div>
                                    <table className="w-full">
                                        <thead></thead>
                                        <tbody>
                                            {orderDetail.door ? (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chiều ngang</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.door.Door_size_x} cm</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chiều dọc</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.door.Door_size_y} cm</td>
                                                    </tr>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Kiểu cách</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.door.Door_Style}</td>
                                                    </tr>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Cơ chế</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.door.Door_Mode}</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chất liệu</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.door.Door_Material}</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    {orderDetail.door.Door_color && (
                                                        <>
                                                            <tr className="">
                                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Màu sắc</td>
                                                                <td className="my-4 py-4  bg-white pl-4">
                                                                    <input className="w-64 h-16" type="color" value={orderDetail.door.Door_color} readOnly />
                                                                </td>
                                                            </tr>
                                                            <hr className="border border-r-violet-400" />
                                                        </>
                                                    )}
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.door.Door_Pattern}</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    {orderDetail.door.Door_Pattern == "Tùy chỉnh" && (
                                                        <>
                                                            <tr className="">
                                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Ảnh họa tiết</td>
                                                                <td className="my-4 py-4  bg-white pl-4">
                                                                    <img className="w-64 h-64" src={orderDetail.door.Door_pattern_img}></img>
                                                                </td>
                                                            </tr>
                                                            <hr className="border border-r-violet-400" />
                                                            <tr className="">
                                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả họa tiết</td>
                                                                <td className="my-4 py-4  bg-white pl-4">{orderDetail.door.Door_pattern_description}</td>
                                                            </tr>
                                                            <hr className="border border-r-violet-400" />
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <tr className="">
                                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Custom</td>
                                                    <td className="my-4 py-4  bg-white pl-4">Không custom</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <div className="italic text-lg">Nắp</div>
                                    <table className="w-full">
                                        <thead></thead>
                                        <tbody>
                                            {orderDetail.top ? (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Kiểu cách</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.top.Top_Style}</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chất liệu</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.top.Top_Material}</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    {orderDetail.top.Top_color && (
                                                        <>
                                                            <tr className="">
                                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Màu sắc</td>
                                                                <td className="my-4 py-4  bg-white pl-4">
                                                                    <input className="w-64 h-16" type="color" value={orderDetail.top.Top_color} readOnly />
                                                                </td>
                                                            </tr>
                                                            <hr className="border border-r-violet-400" />
                                                        </>
                                                    )}
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.top.Top_Pattern}</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    {orderDetail.top.Top_Pattern == "Tùy chỉnh" && (
                                                        <>
                                                            <tr className="">
                                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Ảnh họa tiết</td>
                                                                <td className="my-4 py-4  bg-white pl-4">
                                                                    <img className="w-64 h-64" src={orderDetail.top.Top_pattern_img}></img>
                                                                </td>
                                                            </tr>
                                                            <hr className="border border-r-violet-400" />
                                                            <tr className="">
                                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả họa tiết</td>
                                                                <td className="my-4 py-4  bg-white pl-4">{orderDetail.top.Top_pattern_description}</td>
                                                            </tr>
                                                            <hr className="border border-r-violet-400" />
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <tr className="">
                                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Custom</td>
                                                    <td className="my-4 py-4  bg-white pl-4">Không custom</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <div className="italic text-lg">Đế</div>
                                    <table className="w-full">
                                        <thead></thead>
                                        <tbody>
                                            {orderDetail.bottom ? (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Độ nghiêng</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.bottom.Bottom_tilt} độ</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Kiểu cách</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.bottom.Bottom_Style}</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chất liệu</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.bottom.Bottom_Material}</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    {orderDetail.bottom.Bottom_color && (
                                                        <>
                                                            <tr className="">
                                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Màu sắc</td>
                                                                <td className="my-4 py-4  bg-white pl-4">
                                                                    <input className="w-64 h-16" type="color" value={orderDetail.bottom.Bottom_color} readOnly />
                                                                </td>
                                                            </tr>
                                                            <hr className="border border-r-violet-400" />
                                                        </>
                                                    )}
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{orderDetail.bottom.Bottom_Pattern}</td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    {orderDetail.bottom.Bottom_Pattern == "Tùy chỉnh" && (
                                                        <>
                                                            <tr className="">
                                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Ảnh họa tiết</td>
                                                                <td className="my-4 py-4  bg-white pl-4">
                                                                    <img className="w-64 h-64" src={orderDetail.bottom.Bottom_pattern_img}></img>
                                                                </td>
                                                            </tr>
                                                            <hr className="border border-r-violet-400" />
                                                            <tr className="">
                                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả họa tiết</td>
                                                                <td className="my-4 py-4  bg-white pl-4">{orderDetail.bottom.Bottom_pattern_description}</td>
                                                            </tr>
                                                            <hr className="border border-r-violet-400" />
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <tr className="">
                                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Custom</td>
                                                    <td className="my-4 py-4  bg-white pl-4">Không custom</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            <div className="mt-4">
                                <div className="italic text-lg">Nan</div>
                                <table className="w-full">
                                    <thead></thead>
                                    <tbody>
                                        {orderDetail.spokes ? (
                                            <>
                                                <tr className="">
                                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Số nan dọc</td>
                                                    <td className="my-4 py-4  bg-white pl-4">{orderDetail.spokes.Spoke_amount_ver} độ</td>
                                                </tr>
                                                <hr className="border border-r-violet-400" />
                                                <tr className="">
                                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Số nan ngang</td>
                                                    <td className="my-4 py-4  bg-white pl-4">{orderDetail.spokes.Spoke_amount_hor}</td>
                                                </tr>
                                                <hr className="border border-r-violet-400" />
                                                <tr className="">
                                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chất liệu</td>
                                                    <td className="my-4 py-4  bg-white pl-4">{orderDetail.spokes.Spoke_material}</td>
                                                </tr>
                                                <hr className="border border-r-violet-400" />
                                                {orderDetail.spokes.Spoke_Color && (
                                                    <>
                                                        <tr className="">
                                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Màu sắc</td>
                                                            <td className="my-4 py-4  bg-white pl-4">
                                                                <input className="w-64 h-16" type="color" value={orderDetail.spokes.Spoke_Color} readOnly />
                                                            </td>
                                                        </tr>
                                                        <hr className="border border-r-violet-400" />
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Custom</td>
                                                <td className="my-4 py-4  bg-white pl-4">Không custom</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4">
                                <div className="italic text-lg">Thông tin khác</div>
                                <table className="w-full">
                                    <thead></thead>
                                    <tbody>
                                        <tr className="">
                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Địa chỉ nhận hàng</td>
                                            <td className="my-4 py-4  bg-white pl-4">{orderDetail.other.Address}</td>
                                        </tr>
                                        <hr className="border border-r-violet-400" />
                                        <tr className="">
                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Số điện thoại liên hệ</td>
                                            <td className="my-4 py-4  bg-white pl-4">{orderDetail.other.PhoneNumber}</td>
                                        </tr>
                                        <hr className="border border-r-violet-400" />
                                        <tr className="">
                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Voucher áp dụng</td>
                                            <td className="my-4 py-4  bg-white pl-4">{orderDetail.other.Voucher_value ? orderDetail.other.Voucher_value + ' %' : 'Không áp dụng'}</td>
                                        </tr>
                                        <hr className="border border-r-violet-400" />
                                        <tr className="">
                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Ngày đặt hàng</td>
                                            <td className="my-4 py-4  bg-white pl-4">{orderDetail.other.Order_date.substr(0, 10) + ' ' + orderDetail.other.Order_date.substr(11, 8)}</td>
                                        </tr>
                                        <hr className="border border-r-violet-400" />
                                        <tr className="">
                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Ngày thanh toán</td>
                                            <td className="my-4 py-4  bg-white pl-4">
                                                {orderDetail.other.Payment_date ? orderDetail.other.Payment_date.substr(0, 10) + ' ' + orderDetail.other.Payment_date.substr(11, 8) : ''}</td>
                                        </tr>
                                        <hr className="border border-r-violet-400" />
                                        <tr className="">
                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Lần cuối chỉnh sửa</td>
                                            <td className="my-4 py-4  bg-white pl-4">
                                                {orderDetail.other.Updated_at ? orderDetail.other.Updated_at.substr(0, 10) + ' ' + orderDetail.other.Updated_at.substr(11, 8) : ''}</td>
                                        </tr>
                                        <hr className="border border-r-violet-400" />
                                        <tr className="">
                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Trạng thái</td>
                                            <td className="my-4 py-4  bg-white pl-4">{orderDetail.other.Status_shipping}</td>
                                        </tr>
                                        <hr className="border border-r-violet-400" />
                                        <tr className="">
                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Thanh toán</td>
                                            <td className="my-4 py-4  bg-white pl-4">{orderDetail.other.Status_paid}</td>
                                        </tr>
                                        <hr className="border border-r-violet-400" />
                                        <tr className="">
                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Phương thức thanh toán</td>
                                            <td className="my-4 py-4  bg-white pl-4">{orderDetail.other.Payment_method}</td>
                                        </tr>
                                        <hr className="border border-r-violet-400" />
                                    </tbody>
                                </table>
                            </div>
                        </>
                        )}
                    </div>
                )}
            </Popup>
            {cards.map((card) => (
                <div className=" flex-col bg-slate-50 m-2 p-2 rounded-lg" key={card.ID}>
                    <div className="px-4 my-4">
                        <div className="flex">
                            <div className="px-2">Mã đơn hàng: {card.ID} </div>
                            <div>|</div>
                            <div className="px-2">Ngày đặt mua: {(card.Order_date + '').substr(0, 10)} </div>
                            <div>|</div>
                            <div className="px-2">Ngày cập nhật: {(card.Updated_at + '').substr(0, 10)} </div>
                            <div>|</div>
                            <div className="px-2">Ngày thanh toán: {(card.Payment_date + '').substr(0, 10)} </div>
                        </div>
                        <div className="flex mt-4">
                            <Stepper activeStep={getActiveStep(card.Status_shipping)}>
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </div>
                    </div>
                    <hr className="border  border-slate-300 my-2 w-full " />

                    {card.Status_shipping != "Đã hủy" ? (
                        <div className="flex-row w-full">
                            <div className="flex place-content-between">
                                <div>
                                    <div className="text-left mx-8 my-4 text-xl font-bold">{card.Name}</div>

                                    <div className="text-left mx-8 my-4 text-xl">{card.Status_Paid}</div>
                                    <div className='flex'>
                                        <div className='text-left ml-8 my-4'>Voucher áp dụng: </div>
                                        <div className='text-left mx-2 my-4 text-red-500 font-bold'>
                                            {displayVoucher(card.VoucherID) }
                                        </div>
                                    </div>
                                    <div className='flex text-left ml-8'>Nhân viên phụ trách :
                                        <div className="text-blue-500 font-bold">{card.Staff_Name}</div>
                                    </div>
                                    <div className='flex text-left ml-8'>Số điện thoại :
                                        <div className="font-bold">{card.Staff_Phone}</div>
                                    </div>
                                </div>
                                {card.Final_img ? (
                                    <div className="mr-8 mt-8">
                                        <img className="w-48 h-48" src={card.Final_img}></img>
                                    </div>
                                ) : (
                                    <div className="mr-8 mt-8 italic text-center">
                                        <img className="w-48 h-48" src={logo} ></img>
                                        Ảnh is commming soon
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-4xl text-red-500 font-bold ml-8">
                            ĐÃ HỦY
                        </div>
                    )}
                    
                    <div className="flex place-content-between mt-4">
                        <div >
                            <div className="text-left ml-8 font-bold">Lời nhắn của Shop : </div>
                            {card.Shop_respond && (
                                <>
                                    <div className="text-left ml-8 italic">Cập nhật lúc {card.Response_date.substr(11, 8)} ngày {card.Response_date.substr(0, 10)}</div>
                                    <div className="text-left ml-8">{card.Shop_respond}</div>
                                </>
                            ) }
                        </div>
                        <div>
                            <div className='flex m-6 justify-end'>
                                <div className='text-right text-xl mr-2'>Giá tiền: </div>
                                <div className="text-right text-red-500 text-2xl font-bold">
                                    {parseInt(card.Price_final).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                </div>
                            </div>
                            <div className='flex m-6 justify-end'>
                                <div className='text-right text-xl mr-2'>Thời gian làm: </div>
                                <div className="text-right text-blue-500 text-2xl font-bold">
                                    {card.Final_time}
                                </div>
                                <div className='italic text-right text-xl ml-2'>(ngày)</div>
                            </div>
                            <div className='flex m-6 justify-end'>
                                {(card.Status_shipping == "Chờ duyệt" || card.Status_shipping == "Xác nhận thanh toán") && (
                                    <Button variant="outlined" onClick={() => handleCancelOrder(card.ID, card.Name, card.Status_shipping, card.StaffID)}>HỦY BỎ</Button>
                                )}
                                {(card.Status_shipping == "Đã hủy") && (
                                    <Button variant="outlined" onClick={() => handleDelete(card.ID)}>XÓA</Button>
                                )}
                                {card.Status_shipping == "Chờ duyệt" ? (
                                    <Button variant="contained" onClick={() => gotoEdit(card.ID) }>CHỈNH SỬA</Button>
                                ) : (
                                    <>
                                        <Button onClick={() => {
                                            fetchDetails(card.ID)
                                            setViewRecipe(true)
                                        }} variant="outlined" >XEM CÔNG THỨC</Button>
                                        {card.Status_shipping == "Xác nhận thanh toán" && (
                                            <Button onClick={() => {
                                                fetchDetails(card.ID)
                                                setPopup(true)
                                            }} variant="contained">THANH TOÁN</Button>
                                        )}
                                    </>

                                )}                               
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
        </>
    );
};

export default OrderListCustom;

