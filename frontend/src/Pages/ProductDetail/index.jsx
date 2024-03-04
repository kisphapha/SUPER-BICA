import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import './styles.css'
import { UserContext, UserProvider } from '../../UserContext'
import Header from '../../components/common/Header'
import Navbar from '../../components/common/Navbar'
import CategoryNav from '../../components/features/CategoryNav'
import AddressPopup from '../../components/features/AddressPopup/AddressPopup'
import LoginCard from '../../components/features/LoginCard'
import Popup from 'reactjs-popup'
import { Button, TextField, Rating, Avatar, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import { useContext } from 'react'
import VNPay from '../../image/icons/VNPay.svg'
import COD from '../../image/icons/COD.svg'

export default function ProductDetails() {
    const { user } = useContext(UserContext)
    const [imgList, setImgList] = useState([])
    const [focusUrl, setFocusUrl] = useState('')
    const { productId } = useParams()
    const [quantity, setQuantity] = useState(1)
    const [product, setProduct] = useState([])
    const [ratingsData, setRatingsData] = useState([])
    const [paymentMethod, setPaymentMethod] = useState('COD')
    const [addressList, setAddressList] = useState([])
    const [orderAddress, setOrderAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [checkValidation, setCheckValidation] = useState(true)
    const [checkNumChar, setCheckNumChar] = useState(true)
    const [checkAddress, setCheckAddress] = useState(true)
    const [orderVoucher, setOrderVoucher] = useState('')
    const [voucherValue, setVoucherValue] = useState(0)
    const [voucherMax, setVoucherMax] = useState(0)
    const [voucherList, setVoucherList] = useState([])
    const [replyContent, setReplyContent] = useState('')

    window.addEventListener('popstate', function () {
        // This function will be triggered when the window is unloaded, including when it's reloaded.
        sessionStorage.setItem('quantity', 1)
    })
    const handleReplyContent = (event) => {
        setReplyContent(event.target.value)
    }

    const fetchRatings = async () => {
        const response = await axios.get(`http://localhost:3000/products/rating/${productId}`)
        setRatingsData(response.data)
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        const sesQuantity = parseInt(sessionStorage.getItem('quantity'))
        const fetchProduct = async () => {
            const response = await axios.get(`http://localhost:3000/products/${productId}`)
            setProduct(response.data)
        }
        
        const fetchImage = async () => {
            const response = await axios.get(`http://localhost:3000/products/img/${productId}`)
            setImgList(response.data)
            setFocusUrl(response.data[0].Url)
        }

        fetchProduct()
        fetchRatings()
        fetchImage()
        sesQuantity ? setQuantity(sesQuantity) : setQuantity(1)
    }, [productId])

    const calculateTotalPrice = () => {
        let total = 0
        total += (100 - product.discount) / 100 * product.Price * quantity
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
        bonus += product.Price * quantity / 1000
        return bonus
    }

    async function fetchVouchers() {
        if (user) {
            const response = await axios.get(`http://localhost:3000/users/getVoucher/${user.Id}`, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.loginedUser
                }
            })
            setVoucherList(response.data)
        }
    }
    async function fetchAddresses() {
        if (user) {
            const response = await axios.get(`http://localhost:3000/address/${user.Id}`, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.loginedUser
                }
            })
            setAddressList(response.data)
        }
    }

    const getFeedback = (rating) => {
        if (user) {
            if (rating.ReplyContent == null) {
                if (user.Role === 'Admin' || user.Role === 'Staff') {
                    return (
                        <div className="flex ml-8 my-2 pl-8">
                            <TextField className="text-left"
                                fullWidth
                                variant="standard"
                                label="Trả lời nhận xét"
                                multiline
                                rows={3}
                                onChange={handleReplyContent} />
                            <div>
                                <Button variant="contained" onClick={() => handleReply(rating.Id, rating.UserID)}>Save</Button>
                            </div>
                        </div>                      
                    )
                }
            } else {
                return (
                    <div className="my-4 ml-12 flex bg-gray-100 pt-4 pb-4">
                        <div>
                            <Avatar className="rounded-2xl h-24 w-24 m-2" src={rating.ReplierPicture} />
                        </div>
                        <div className="">
                            <div className="">
                                <div className="flex">
                                    <h4 className="font-bold ">{rating.ReplierName}</h4>
                                </div>

                                <div className="text-sm flex">
                                    <div className="text-sm text-center flex align-middle">
                                        {new Date(rating.ReplyDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4">{rating.ReplyContent}</p>
                        </div>
                    </div>
                )
            }
        }
    }

    const handleReply = async (id, userId) => {
        await axios.post(`http://localhost:3000/products/reply`, {
            id: user.Id,
            FeedbackId: id,
            Content: replyContent
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.loginedUser
            }
        })
        await axios.post('http://localhost:3000/notification/', {
            userId: userId,
            content: `Shop đã phản hồi về đánh giá đơn hàng '${product.Name}' của bạn`,
            refId: '',
            refUrl: "/user/purchase",
            refPic: user.Picture
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        alert("Đã gửi phản hồi")
        fetchRatings()
    }

    const checkUserPhoneNum = () => {
        if(user.PhoneNumber) {
            setPhoneNumber(user.PhoneNumber)
            console.log(user.PhoneNumber)
            console.log(phoneNumber)
        }
    }

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity((prevCount) => prevCount - 1)
        }
        sessionStorage.setItem('quantity', quantity - 1)
    }

    const handleIncrement = () => {
        let cart = sessionStorage.getItem('cart')

        if (!cart) {
            cart = {
                products: []
            }
        } else {
            cart = JSON.parse(cart)
        }

        const existingProduct = cart.products.find((product) => product.id === productId)


        if(product.Stock > 0){
            if (existingProduct){
                if (quantity < product.Stock && quantity < (product.Stock - existingProduct.quantity)) {
                    // Change this condition to quantity < 10
                    setQuantity((prevCount) => prevCount + 1)
                }
            } else {
                if (quantity < product.Stock) {
                    // Change this condition to quantity < 10
                    setQuantity((prevCount) => prevCount + 1)
                }
            }
            sessionStorage.setItem('quantity', quantity)
        }else{
            toast.dismiss()
            toast.error('Sản phẩm này đã hết', {
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
    }

    const checkPattern = (inputValue, pattern) => {
        const regex = new RegExp(pattern)
        return regex.test(inputValue)
    }

    const handleAddressChange = (event) => {
        setCheckAddress(true)
        setOrderAddress(event.target.value)
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

    const handleZeroStock = () =>{
        toast.dismiss()
        toast.error('Sản phẩm này đã hết', {
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

    const addToCart = () => {
        let cart = sessionStorage.getItem('cart')

        if (!cart) {
            cart = {
                products: []
            }
        } else {
            cart = JSON.parse(cart)
        }

        const existingProduct = cart.products.find((product) => product.id === productId)

        if (!existingProduct) {
            cart.products.push({
                id: productId,
                name: product.Name,
                stock: product.Stock,
                quantity: quantity,
                url: product.Url,
                price: (product.Price * (100 - product.discount)) / 100
            })
            // Store the updated cart in sessionStorage
            sessionStorage.setItem('cart', JSON.stringify(cart))
                toast.dismiss()
                toast.success('Thêm vào giỏ hàng thành công', {
                    position: 'bottom-left',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored'
                })
        } else if(existingProduct.quantity < existingProduct.stock) {
            existingProduct.quantity = existingProduct.quantity + quantity
            sessionStorage.setItem('cart', JSON.stringify(cart))
            toast.dismiss()
            toast.success('Thêm vào giỏ hàng thành công', {
                position: 'bottom-left',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            })
        } else if(existingProduct.quantity >= existingProduct.stock) {
            toast.dismiss()
            toast.error('Đã vượt quá giới hạn số lượng mặt hàng', {
                position: 'bottom-left',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            })
        } else {
            toast.dismiss()
            toast.error('Đã đạt giới hạn số lượng mặt hàng', {
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
    }

    const handlePayment = async (close) => {
        try {
            if (sessionStorage.loginedUser != null) {
                if (orderAddress) {
                    if (phoneNumber!=null) { 
                        if (checkValidation && checkNumChar) {
                            console.log(phoneNumber)
                            const res = await axios.post('http://localhost:3000/order/addordertodb', {
                                UserID: user.Id,
                                OrderDate: new Date().toISOString().slice(0, 10),
                                PaymentDate: null,
                                AddressID: orderAddress,
                                PhoneNumber: phoneNumber,
                                Note: '',
                                TotalAmount: calculateGrandTotal(),
                                PaymentMethod: paymentMethod,
                                Status: 'UNPAID',
                                VoucherID: orderVoucher,
                                Point: ((product.Price * (100 - product.discount)) / 100) * quantity / 1000,
                                Items: [
                                    {
                                        id: product.Id,
                                        name: product.Name,
                                        quantity: quantity,
                                        url: product.Url,
                                        price: ((product.Price * (100 - product.discount)) / 100) * quantity
                                    }
                                ]
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
                                refPic: imgList[0].Url
                            }, {
                                headers: {
                                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                                }
                            })
                            await axios.post('http://localhost:3000/notification/', {
                                userId: null,
                                content: `${user.Name} đã đặt mua ${product.Name} x ${quantity} vào ngày ${new Date(Date.now()).toLocaleDateString()} với phương thức ${paymentMethod}`,
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
                                // setTimeout(() => {
                                //     alert('Đang chuyển tiếp đến VNPay')
                                // }, 2000)
                                close()
                                setOrderAddress('')
                                setPhoneNumber('')
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
                                setOrderAddress('')
                                setPhoneNumber('')
                            }
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
            }
        } catch (error) {
            console.error('Lỗi thanh toán:', error)
        }
    }

    const handleCompare = () => {
        let compareList = sessionStorage.getItem('compareList')

        if (!compareList) {
            compareList = []
        } else {
            compareList = JSON.parse(compareList)
        }
        const duplicate = compareList.some(compareItem => compareItem.productId === productId);
        if (compareList.length < 3) {
            if (!duplicate) {
                compareList.push({
                    productId
                })
                // Store the updated cart in sessionStorage
                sessionStorage.setItem('compareList', JSON.stringify(compareList))
                toast.dismiss()
                toast.success('Đã thêm vào danh sách so sánh', {
                    position: 'bottom-left',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored'
                })
            } else {
                alert("Đã thêm sản này vào danh sách so sánh")
            }
        } else {
            alert("Không thể so sánh quá 3 sản phẩm")
        }
    }

    return (
        <div id="page-product">
            <UserProvider>
                <Header />
                <Navbar />
            </UserProvider>
            <CategoryNav
                parents={[
                    { name: 'Trang chủ', link: '/' },
                    { name: product.Shape, link: '/filter/1/' + product.Category }
                ]}
                current={product.Name}
            ></CategoryNav>

            <div className="product-container">
                <div className="product rounded-lg">
                    <div className="img-container">
                        <div className="img-main">
                            <img className="big-img" src={focusUrl} />
                        </div>
                        <div className="img-more ">
                            {imgList.map((image) => (
                                // eslint-disable-next-line react/jsx-key
                                <img onClick={() => setFocusUrl(image.Url)} className="img" src={image.Url} />
                            ))}
                        </div>
                    </div>
                    <div className="product-detail">
                        <div className="name">{product.Name}</div>
                        <div className="price">
                            <div className="cost">{parseInt(product.Price).toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                            <div className="discount">
                                {parseInt((product.Price * (100 - product.discount)) / 100).toLocaleString('vi', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}
                            </div>
                        </div>
                        <div className="data">
                            <div className="row">
                                <span className="title">Mã Sản Phẩm</span>
                                <span className="info">{productId}</span>
                            </div>
                            <hr className="border border-slate-300 " />
                            <div className="row">
                                <span className="title">Hình dáng</span>
                                <span className="info">{product.Shape}</span>
                            </div>
                            <hr className="border border-slate-300 " />
                            <div className="row">
                                <span className="title">Chất Liệu</span>
                                <span className="info">{product.material}</span>
                            </div>
                            <hr className="border border-slate-300 " />
                            <div className="row">
                                <span className="title">Còn</span>
                                <span className="info">{product.Stock}</span>
                            </div>
                            <hr className="border border-slate-300 " />
                        </div>
                        <div className="option flex place-content-between">
                            <div className="quantity">
                                <button type="button" onClick={handleDecrement} className="button">
                                    -
                                </button>
                                <div className="quantity-show">{quantity}</div>
                                <button type="button" onClick={handleIncrement} className="button">
                                    +
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outlined" onClick={handleCompare}>So sánh</Button>
                                <div>
                                    {product.Stock > 0 ? (
                                        user == null ? (
                                            <Popup
                                                contentStyle={{ width: '500px', height: '250px', borderRadius: '10px' }}
                                                trigger={<Button variant="contained">Thêm vào giỏ hàng</Button>}
                                                position="center"
                                                modal
                                            >
                                                {(close) => (
                                                    <div className="login-popup">
                                                        <LoginCard />
                                                    </div>
                                                )}
                                            </Popup>
                                        ) : (
                                            <div>
                                                <Button variant="contained" className="add-cart" onClick={() => { addToCart(), close() }}>
                                                    Thêm vào giỏ hàng
                                                </Button>
                                                <ToastContainer />
                                            </div>
                                        )
                                    ):(
                                        <div>
                                            <Button variant="contained" className="add-cart" onClick={handleZeroStock}>
                                                Thêm vào giỏ hàng
                                            </Button>
                                            <ToastContainer />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                        {product.Stock > 0 ? (
                            user == null ? (
                                <Popup
                                    contentStyle={{ width: '500px', height: '250px', borderRadius: '10px' }}
                                    trigger={
                                        <div className="buy">
                                            <p className="t1">MUA NGAY</p>
                                            <p className="t2">Gọi điện xác nhận và giao hàng tận nơi</p>
                                        </div>
                                    }
                                    position="center"
                                    onClose={() => {
                                        setCheckNumChar(true);
                                        setCheckValidation(true)
                                    }}
                                    onOpen={fetchAddresses}
                                    modal
                                >
                                    {(close) => (
                                        <div className="login-popup" >
                                            <LoginCard />
                                        </div>
                                    )}
                                </Popup>
                            ) : (
                                <Popup
                                    trigger={
                                        <div className="buy">
                                            <p className="t1">MUA NGAY</p>
                                            <p className="t2">Gọi điện xác nhận và giao hàng tận nơi</p>
                                        </div>
                                    }
                                    onOpen={() => {
                                        fetchAddresses()
                                        fetchVouchers()
                                        setCheckValidation(true)
                                        setCheckNumChar(true)
                                        checkUserPhoneNum()
                                    }}
                                    position="right center"
                                    modal
                                    closeOnDocumentClick={false}
                                // closeOnEscape={false}
                                >
                                    {(close) => (
                                        <div className="popup-order">
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
                                                        onChange={handlePhoneChange}
                                                        onKeyDown={handleKeyDown}
                                                        value={phoneNumber}
                                                        error={!checkValidation || !checkNumChar}
                                                        helperText={(!checkValidation || !checkNumChar) ? (!phoneNumber ? 'Xin hãy nhập số điện thoại' : 'Số điện thoại không hợp lệ') : ('')}
                                                    ></TextField>
                                                </div>

                                                <hr className="border  border-slate-300 my-2 w-full" />
                                                <h1>Sản phẩm</h1>
                                            </div>
                                            <div>
                                                <TableContainer className=" " component={Paper}>
                                                    <Table aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <div className="text-center  font-bold text-base">Ảnh</div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-center font-bold  text-base">Tên sản phẩm</div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-center font-bold  text-base">Giá</div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-center font-bold  text-base">Số lượng</div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-center font-bold  text-base">Tổng</div>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <div className="flex justify-center">
                                                                        <img className="h-full w-16 rounded-md" src={product.Url} alt={product.name} />
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-center text-base">{product.Name}</div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-center text-base">
                                                                        {parseInt((product.Price * (100 - product.discount)) / 100).toLocaleString('vi', {
                                                                            style: 'currency',
                                                                            currency: 'VND'
                                                                        })}{' '}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-center text-base">{quantity}</div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-center text-base">
                                                                        {parseInt(
                                                                            ((product.Price * (100 - product.discount)) / 100) * quantity
                                                                        ).toLocaleString('vi', {
                                                                            style: 'currency',
                                                                            currency: 'VND'
                                                                        })}{' '}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>

                                            <hr className="border  border-slate-300 my-2 w-full" />
                                            <div className="flex place-content-between">
                                                <div>
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
                                                            const [voucherId, voucherDiscount, voucherAmount] = selectedValue.split(',');
                                                            setVoucherValue(voucherDiscount.trim());
                                                            setOrderVoucher(voucherId.trim());
                                                            setVoucherMax(voucherAmount);
                                                        }}
                                                    >
                                                        <option value={["", 0]} selected>
                                                            <em>Không sử dụng phiếu giảm giá</em>
                                                        </option>

                                                        {voucherList.map((voucher) =>
                                                            voucher.UsedAt == null && (
                                                                <option key={voucher.ID} value={[voucher.ID, voucher.discount, voucher.MaxAmount]}>
                                                                    {voucher.discount + '%, Giảm tối đa ' + voucher.MaxAmount/1000 + 'K, Hết hạn ' + voucher.ExpireAt.substr(0, 10)}
                                                                </option>
                                                            )
                                                        )}
                                                    </TextField>
                                                </div>
                                                <div className=" border-gray-300 rounded   ">

                                                    <div className="font-bold flex place-content-end">
                                                        <div className="mr-4">Được giảm giá:</div>
                                                        <div className="text-xl">
                                                            {(calculateCouponPice()).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
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
                                            </div>
                                            <div className="flex place-content-between">
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
                                </Popup>//here
                            ) 
                            ) : (
                                <div className="buy" onClick={handleZeroStock}>
                                    <p className="t1">MUA NGAY</p>
                                    <p className="t2">Gọi điện xác nhận và giao hàng tận nơi</p>
                                    {/* <ToastContainer /> */}
                                </div>
                            )
                    }
                    </div>
                </div>
                <div className="description rounded-lg">
                    <div>
                        <div className="font-bold text-xl my-4">Mô tả</div>
                        <div className="mb-4">{product.Description}</div>
                    </div>
                    <hr className="border border-slate-300" />
                    <div className="my-4">
                        <div className="font-bold text-xl my-2">Thông số</div>
                        <table className="w-full">
                            <thead></thead>
                            <tbody>
                                <tr className="">
                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Tên sản phẩm</td>
                                    <td className="my-4 py-4  bg-white pl-4">{product.Name}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                                <tr className="">
                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Phân loại</td>
                                    <td className="my-4 py-4  bg-white pl-4">{product.Shape}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                                <tr className="">
                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Kích thước: dài , rộng</td>
                                    <td className="my-4 py-4  bg-white pl-4">{product.Size}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                                <tr className="">
                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Loại chim phù hợp</td>
                                    <td className="my-4 py-4  bg-white pl-4">{product.SuitableBird}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                                <tr className="">
                                    <td className="my-4 py-4 w-1/6 pl-4 bg-slate-300">Chất Liệu</td>
                                    <td className="my-4 py-4  bg-white pl-4">{product.material}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="feedback rounded-lg">
                    <div className="font-bold my-4 text-xl ">Đánh giá sản phẩm </div>

                    <hr className="border border-slate-300  mt-1" />
                    <div className="bg-white w-full ">
                        {ratingsData.map((rating, index) => (
                            <div key={index} className=" mb-2 ">
                                <div className="">
                                    <div className="flex">
                                        <div>
                                            <Avatar className="rounded-2xl h-24 w-24 m-2" src={rating.Picture} />
                                        </div>
                                        <div className="mx-4">
                                            <div className="">
                                                <div className="flex">
                                                    <h4 className="font-bold ">{rating.Name}</h4>
                                                </div>

                                                <div className="text-sm flex">
                                                    <Rating name="hover-feedback " size="small" value={rating.StarPoint} precision={1} readOnly />
                                                    <div className="mx-4"></div>
                                                    <div className="text-sm text-center flex align-middle">
                                                        {new Date(rating.CreateAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="mt-4">{rating.Content}</p>
                                        </div>
                                    </div>
                                    <div className="mx-8">{getFeedback(rating)}</div>
                                    <hr className="border border-slate-300 mt-4 mx-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
