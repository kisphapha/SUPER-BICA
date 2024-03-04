import React, { useState, useEffect, useContext } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, TextField, MenuItem } from '@mui/material'
import { UserContext, UserProvider } from '../../UserContext'
import Header from '../../components/common/Header'
import Navbar from '../../components/common/Navbar'
import CategoryNav from '../../components/features/CategoryNav'
import { useNavigate } from 'react-router-dom'
import Popup from 'reactjs-popup'
import axios from 'axios'
import './style.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AddressPopup from '../../components/features/AddressPopup/AddressPopup'
import VNPay from '../../image/icons/VNPay.svg'
import COD from '../../image/icons/COD.svg'
import voucherImage from '../../image/icons/voucher.png'

export default function Cart() {
    const { user } = useContext(UserContext)
    const [cartData, setCartData] = useState({ products: [] })
    const [loading, setLoading] = useState(true)
    const [paymentMethod, setPaymentMethod] = useState('COD') // Default to 'onDelivery'
    const [orderAddress, setOrderAddress] = useState('')
    const [orderVoucher, setOrderVoucher] = useState('')
    const [voucherValue, setVoucherValue] = useState(0)
    const [addressList, setAddressList] = useState([])
    const [phoneNumber, setPhoneNumber] = useState('')
    const [checkValidation, setCheckValidation] = useState(true)
    const [checkAddress, setCheckAddress] = useState(true)
    const [checkNumChar, setCheckNumChar] = useState(true)
    const [voucherList, setVoucherList] = useState([])
    const [voucherMax, setVoucherMax] = useState(0)
    const navigate = useNavigate()

    const loadCartData = async () => {
        const cartDataFromSession = sessionStorage.getItem('cart')
        if (cartDataFromSession) {
            setCartData(JSON.parse(cartDataFromSession))
        }
        setLoading(false)
    }
    
    const clearCart = () => {
        const emptyCart = { products: [] }
        if(cartData.products.length != 0) {
            setCartData(emptyCart)
            sessionStorage.setItem('cart', JSON.stringify(emptyCart))
            toast.dismiss()
            toast.error('Đã xoá toàn bộ sản phẩm', {
                position: 'bottom-left',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            })
        }else{
            nothingInCart()
        }
    }

    useEffect(() => {
        loadCartData()
        fetchVouchers()
        fetchAddresses()
    }, [])

    const handleDecrement = (productId) => {
        const updatedCart = { ...cartData }
        const productIndex = updatedCart.products.findIndex((product) => product.id === productId)

        if (updatedCart.products[productIndex].quantity >= 1) {
            updatedCart.products[productIndex].quantity -= 1
            sessionStorage.setItem('cart', JSON.stringify(updatedCart))
            setCartData(updatedCart)
        }
        if (updatedCart.products[productIndex].quantity == 0) {
            removeProductFromCart(productId)
        }
    }

    const handleIncrement = (productId) => {
        const updatedCart = { ...cartData }
        const productIndex = updatedCart.products.findIndex((product) => product.id === productId)

        if (updatedCart.products[productIndex].quantity < updatedCart.products[productIndex].stock) {
            updatedCart.products[productIndex].quantity = parseInt(updatedCart.products[productIndex].quantity) + 1
            sessionStorage.setItem('cart', JSON.stringify(updatedCart))
            setCartData(updatedCart)
        }
    }

    const handlePayment = async (close) => {
        try {
            const cartItems = JSON.parse(sessionStorage.getItem('cart')).products

            if (cartItems && cartItems.length > 0) {
                if (sessionStorage.loginedUser != null) {
                    if (orderAddress) {
                        if (phoneNumber && checkNumChar) {
                            if(checkValidation){
                                const res = await axios.post('http://localhost:3000/order/addordertodb', {
                                    UserID: user.Id,
                                    OrderDate: new Date().toISOString().slice(0, 10),
                                    PaymentDate: null,
                                    AddressID: orderAddress,
                                    PhoneNumber: phoneNumber,
                                    Note: '',
                                    TotalAmount: calculateGrandTotal(),
                                    PaymentMethod: paymentMethod,
                                    VoucherID: orderVoucher,
                                    Point: calculateBonus(),
                                    Items: cartItems
                                }, {
                                    headers: {
                                        Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                                    }
                                })

                            

                            await axios.post('http://localhost:3000/users/updateVoucher', {
                                Id : orderVoucher
                            }, {
                                headers: {
                                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                                }
                            })
                            await axios.post('http://localhost:3000/notification/', {
                                userId: user.Id,
                                content: "Đơn hàng số " + res.data.orderid + " của bạn đặt ngày " + new Date(Date.now()).toLocaleDateString() + " đang chờ được duyệt",
                                refId: res.data.orderid + 'o',
                                refUrl: "/user/purchase",
                                refPic: cartData.products[0].url
                            }, {
                                headers: {
                                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                                }
                            })
                            let productsStr = ""
                            cartData.products.map((item) => {
                                productsStr += item.name + ", "
                            })
                            await axios.post('http://localhost:3000/notification/', {
                                userId: null,
                                content: `${user.Name} đã đặt mua ${productsStr} vào ngày ${new Date(Date.now()).toLocaleDateString()} với phương thức ${paymentMethod}`,
                                refId: null,
                                refUrl: "/admin/Orders",
                                refPic: user.Picture
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
                                        email: user.Email,
                                        phoneNumber: user.PhoneNumber,
                                        orderid: res.data.orderid
                                    })

                                    // console.log(response.data.url)
                                    window.location.href = response.data.url
                                    
                                } else {
                                    sessionStorage.setItem('cart', '{"products":[]}')                                
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
                                const emptyCart = { products: [] }
                                setCartData(emptyCart)
                                sessionStorage.setItem('cart', JSON.stringify(emptyCart))
                            }else {
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
                } else {
                    alert('Đăng nhập để tiến hành thanh toán')
                }
            } else {
                alert('Bạn chưa thêm gì vào giỏ hàng')
            }
        } catch (error) {
            console.error('Lỗi thanh toán:', error)
        }
    }

    const calculateTotalPrice = () => {
        let total = 0

        cartData.products.forEach((product) => {
            if (product != null) {
                total += product.price * product.quantity
            }
        })
        return total
    }

    const calculateCouponPice = () => {
        if (voucherValue == 0) return 0
        let total = calculateTotalPrice()
        let coupon = total - (total * (100 - voucherValue) / 100)
        if (coupon > voucherMax) coupon = voucherMax
        return coupon
    }

    const calculateGrandTotal = () => {
        let total = calculateTotalPrice()
        total -= calculateCouponPice()
        return total
    }

    const calculateBonus = () => {
        let bonus = 0

        cartData.products.forEach((product) => {
            if (product != null) {
                bonus += (product.price * product.quantity) / 1000
            }
        })
        return bonus
    }

    const removeProductFromCart = (productId) => {
        const updatedCart = { ...cartData }
        
        const productIndex = updatedCart.products.findIndex((product) => product.id === productId)
        if (productIndex != -1) {
            updatedCart.products.splice(productIndex, 1)
            setCartData(updatedCart)
            sessionStorage.setItem('cart', JSON.stringify(updatedCart))
            console.log(sessionStorage.getItem('cart'))
        }
        toast.dismiss()
        toast.error('Sản phẩm đã được xoá', {
            position: 'bottom-left',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'colored'
        })  
    }

    const nothingInCart = () => {
        toast.dismiss()
        toast.error('Không có gì trong giỏ hàng', {
            position: 'bottom-left',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'colored'
        })
    }

    const handleAddressChange = (event) => {
        setCheckAddress(true)
        setOrderAddress(event.target.value)
    }

    async function fetchAddresses() {
        const response = await axios.get(`http://localhost:3000/address/${user.Id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.loginedUser
            }
        })
        setAddressList(response.data)
    }

    async function fetchVouchers() {
        const response = await axios.get(`http://localhost:3000/users/getVoucher/${user.Id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.loginedUser
            }
        })
        setVoucherList(response.data)
        console.log(voucherList)
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
        if (user.PhoneNumber) {
            setPhoneNumber(user.PhoneNumber)
            console.log(user.PhoneNumber)
            console.log(phoneNumber)
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

    return (
        <div className="relative">
            <style></style>
            <UserProvider>
                <Header />
                <Navbar />
            </UserProvider>
            <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }]} current="Giỏ hàng"></CategoryNav>
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="mt-5 px-40 py-5  bg-white" style={{ minHeight: '71vh' }}>
                    <h2 className="block text-center py-5">
                        <span className="text-4xl border-b-2 border-yellow-300">Giỏ hàng</span>
                    </h2>

                    <table className="w-full border-2 border-slate-200 rounded-md">
                        <tr className=" bg-slate-300">
                            <th className="py-3 px-3 text-left">Ảnh </th>
                            <th className="py-3 text-left">Tên sản phẩm </th>
                            <th className="py-3 ">Giá / sản phẩm </th>
                            <th className="py-3 ">Số lượng </th>
                            <th className="py-3 w-40 ">Tổng cộng </th>
                            <th className="py-3 pr-3 ">Xóa</th>
                        </tr>

                        {cartData.products.map((product) =>
                            product != null ? (
                                <tr key={product.Id} className="border-t-2 border-slate-200">
                                    <td>
                                        <img className="h-full w-32 rounded-md" src={product.url} alt={product.name} />
                                    </td>
                                    <td>
                                        <div>{product.name}</div>
                                    </td>
                                    <td>
                                        <div className="text-center">
                                            {product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex justify-center">
                                            <button type="button" onClick={() => handleDecrement(product.id)} className="quantity-button">
                                                -
                                            </button>
                                            <div className="quantity-show ">{product.quantity}</div>
                                            <button type="button" onClick={() => handleIncrement(product.id)} className="quantity-button">
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        {(product.price * product.quantity).toLocaleString('vi', {
                                            style: 'currency',
                                            currency: 'VND'
                                        })}
                                    </td>
                                    <td className="text-center">
                                        <Button onClick={() => removeProductFromCart(product.id)}>
                                            <DeleteIcon />
                                            <ToastContainer />
                                        </Button>
                                    </td>
                                    {/* <hr className="border  border-slate-300 my-2 w-full" /> */}
                                </tr>
                            ) : (
                                <></>
                            )
                        )}
                        <ToastContainer />
                    </table>
                    <div className=" flex w-full justify-end">
                        <div className=" w-2/6 mr-4 my-4   ">
                            <div className="border border-gray-300 rounded p-4 w-4/5 ml-24">
                                <div className="font-bold flex place-content-between ">
                                    <div className="">Tổng cộng:</div>
                                    <div>{calculateTotalPrice().toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                                </div>

                                <div className="font-bold flex place-content-between">
                                    <div className="">Số điểm bonus sẽ tích được:</div>
                                    <div>{calculateBonus()}</div>
                                </div>
                            </div>

                            <div className=" font-bold ">
                                <div className="flex justify-end gap-4 my-2 ">
                                    {cartData.products.length != 0 ? (
                                        <Popup
                                            trigger={<Button variant="contained">Thanh toán</Button>}
                                            onOpen={()=>{
                                                fetchAddresses()
                                                checkUserPhoneNum()
                                            }}
                                            closeOnDocumentClick={false}
                                            position="right center"
                                            modal
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
                                                                    helperText={!checkAddress ? "Xin hãy chọn địa chỉ của bạn": ""}
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
                                                                            <AddressPopup user={user} fetchAddresses={fetchAddresses} close={close} />
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
                                                            <option value={["",0]} selected>
                                                                <em>Không sử dụng phiếu giảm giá</em>
                                                            </option>

                                                            {voucherList.map((voucher) =>
                                                                voucher.UsedAt == null && (
                                                                    <option key={voucher.ID} value={[voucher.ID, voucher.discount, voucher.MaxAmount]}>
                                                                        {voucher.discount + '%, Giảm tối đa ' + voucher.MaxAmount / 1000 + 'K, Hết hạn ' + voucher.ExpireAt.substr(0, 10)}
                                                                    </option>
                                                                )
                                                            )}
                                                        </TextField>
                                                        
                                                    </div>
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
                                                        <div className="text-xl">{calculateBonus()}</div>
                                                    </div>
                                                    <hr></hr>
                                                    <div className="font-bold flex place-content-end ">
                                                        <div className="text-xl font-bold mr-4">THANH TOÁN:</div>
                                                        <div className="text-4xl font-bold mr-4 text-red-400">
                                                            {calculateGrandTotal().toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                                        </div>
                                                    </div>
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
                                                                        handlePayment(close)
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
                                    ):(
                                        <Button variant="contained" onClick={nothingInCart}>Thanh toán
                                            <ToastContainer />
                                        </Button>
                                    )}
                                    <Button variant="contained" onClick={clearCart} disableRipple>
                                        Xóa tất cả
                                        <ToastContainer />
                                    </Button>
                                    <Button variant="contained" onClick={() => navigate('/')}>
                                        Tiếp tục mua hàng
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
