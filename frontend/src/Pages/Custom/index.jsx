import React, { useContext, useState, useEffect } from 'react'
import CategoryNav from '../../components/features/CategoryNav'
import MenuItem from '@mui/material/MenuItem'
import { UserContext, UserProvider } from '../../UserContext'
import Header from '../../components/common/Header'
import AddressPopup from '../../components/features/AddressPopup/AddressPopup'
import Popup from 'reactjs-popup'
import DeleteIcon from '@mui/icons-material/Delete'
import ClearIcon from '@mui/icons-material/Clear'
import Navbar from '../../components/common/Navbar'
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'


export default function Custom() {
    const { user } = useContext(UserContext)
    const [categories, setCategories] = useState([])
    const [components, setComponents] = useState([])
    const [tmpName, setTempName] = useState('')
    const [tmpDescription, setTempDescription] = useState('')
    const [tmpCount, setTempCount] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [orderAddress, setOrderAddress] = useState('')
    const [addressList, setAddressList] = useState([])
    const [phoneNumber, setPhoneNumber] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('COD')
    const [checkAddress, setCheckAddress] = useState(true)
    const [checkValidation, setCheckValidation] = useState(true)
    const [openPopup, setOpenPopup] = useState(false)
    const [voucherList, setVoucherList] = useState([])
    const [orderVoucher, setOrderVoucher] = useState('')
    const [voucherValue, setVoucherValue] = useState(0)


    async function fetchAddresses() {
        const response = await axios.get(`http://localhost:3000/address/${user.Id}`)
        setAddressList(response.data)
    }
    async function fetchVouchers() {
        const response = await axios.get(`http://localhost:3000/users/getVoucher/${user.Id}`)
        setVoucherList(response.data)
        console.log(voucherList)
    }


    const calculateGrandTotal = () => {
        // let total = calculateTotalPrice()
        total = (total * (100 - voucherValue)) / 100
        return total
    }


    const handlePhoneChange = (event) => {
        let inputPhoneNumber = event.target.value

        // Remove unwanted characters "e", "+", and "-"
        inputPhoneNumber = inputPhoneNumber.replace(/[e+-]/gi, '')

        // Regular expression pattern for a valid phone number. You can adjust it as needed.
        const phonePattern =
            '(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}'

        if (inputPhoneNumber.length <= 11) {
            if (checkPattern(inputPhoneNumber, phonePattern)) {
                setCheckValidation(true)
            } else {
                setCheckValidation(false)
            }
        } else {
            setValid(false)
        }
        setPhoneNumber(event.target.value)
    }

    const checkUserPhoneNum = () => {
        if(user.PhoneNumber) {
            setPhoneNumber(user.PhoneNumber)
            console.log(user.PhoneNumber)
            console.log(phoneNumber)
        }
    }

    const handleCountChangeOnlyNumber = (event) => {
        const forbiddenKeys = ['e', '+', '-', '.'];

        // Prevent the characters "e", "+", and "-" from being entered.
        if (forbiddenKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

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

    const handleNameChange = (event) => {
        setTempName(event.target.value)
    }

    const handleDescriptionChange = (event) => {
        setTempDescription(event.target.value)
    }


    const handleCountChange = (event) => {
        setTempCount(event.target.value)
    }


    const handleAddressChange = (event) => {
        setCheckAddress(true)
        setOrderAddress(event.target.value)
    }


    const componentType = ['Móc', 'Khung', 'Nan', 'Nắp', 'Đáy', 'Bình nước']

    const initialSelectedComponents = componentType.map((type) => ({
        type,
        data: null
    }))

    const [selectedComponents, setSelectedComponents] = useState(initialSelectedComponents)

    const handleChangeCageType = () =>{
        for(const comp of componentType){
            handleRemoveComponent(comp)
        }
    }

    const handleSelectedComponentChange = (event, componentType) => {
        const selectedComponentData = components.find((component) => component.ID === event.target.value)
        setSelectedComponents((prevSelectedComponents) => {
            const updatedSelectedComponents = [...prevSelectedComponents]
            const existingIndex = updatedSelectedComponents.findIndex((comp) => comp.type === componentType)

            if (existingIndex !== -1) {
                updatedSelectedComponents[existingIndex] = {
                    type: componentType,
                    data: selectedComponentData
                }
            } else {
                updatedSelectedComponents.push({
                    type: componentType,
                    data: selectedComponentData
                })
            }
            return updatedSelectedComponents
        })
    }

    async function fetchCategories() {
        const response = await axios.get('http://localhost:3000/category/')
        if (response.data) {
            setCategories(response.data)
        }
    }

    async function fetchComponents(categoryId) {
        const response = await axios.get('http://localhost:3000/component/getAllComponentByCate/' + categoryId)

        if (response.data) {
            setComponents(response.data)
        }
    }

    const checkPattern = (inputValue, pattern) => {
        const regex = new RegExp(pattern)
        return regex.test(inputValue)
    }

    const handlePayment = async (close) => {
        if (sessionStorage.loginedUser != null) {
            if (orderAddress) {
                if (phoneNumber) {
                    console.log("payment")
                    var components1 = []
                    selectedComponents.map(selectedComponents => {
                        components1.push(selectedComponents.data.ID)
                    })
                    const res = await axios.post('http://localhost:3000/order/addCustomProduct', {
                        productName: tmpName,
                        Description: tmpDescription,
                        Price: total,
                        Category: categories[selectedImage - 1].id,
                        Size: null,
                        material: 'Custom',
                        userId: user.Id,
                        AddressID: orderAddress,
                        PhoneNumber: phoneNumber,
                        OrderDate: new Date().toISOString().slice(0, 10),
                        PaymentDate: null,
                        Note: '',
                        VoucherID: orderVoucher,
                        TotalAmount: total,
                        PaymentMethod: paymentMethod,
                        Quantity: 1,
                        ComponentItems: components1
                    })
                    const updatedUser = await axios.post('http://localhost:3000/users/updatePoint', {
                        id: user.Id,
                        point: Math.floor(total / 1000)
                    })

                    await axios.post('http://localhost:3000/users/updateVoucher', {
                        Id: orderVoucher
                    })
                    if (paymentMethod == 'vnpay') {
                        const response = await axios.post('http://localhost:3000/payment/create_payment_url', {
                            amount: 1 * total,
                            bankCode: '',
                            language: 'vn',
                            email: user.Email,
                            phoneNumber: user.PhoneNumber,
                            orderid: res.data.orderid
                        })
                        close()
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
                        sessionStorage.setItem('loginedUser', JSON.stringify(updatedUser.data))
                        close()
                        // sessionStorage.setItem('cart', '{"products":[]}')
                        // window.location.reload(false)
                    }
                    // sessionStorage.setItem('cart', '{"products":[]}')
                } else {
                    setCheckValidation(false)
                }
            } else {
                setCheckAddress(false)
                if(!phoneNumber){
                    setCheckValidation(false)
                }
            }
        } else {
            alert('Đăng nhập để tiến hành thanh toán')
        }
    }

    function calculateTotalPrice(selectedComponents) {
        let total = 0
        selectedComponents.forEach((selectedComponent) => {
            total += selectedComponent.data?.Price
        })
        if (tmpCount > 1) {
            total = total * tmpCount
        }
        return total
    }
    var total = calculateTotalPrice(selectedComponents)

    function calculateTotalTime(selectedComponents) {
        let total = 0
        selectedComponents.forEach((selectedComponent) => {
            total += selectedComponent.data?.CraftTime

        })
        if (tmpCount > 1) {
            total = total * tmpCount
        }
        return total
    }
    const totalTime = calculateTotalTime(selectedComponents)

    useEffect(() => {
        fetchCategories()
        fetchAddresses()
    }, [])

    const defaultImageClass = 'h-64 w-64 m-2 transition-transform transform-gpu rounded-lg'
    const selectedImageClass = 'h-52 w-52 m-2 hover:scale-105 border-2 border-blue-500'

    const typeToColor = {
        Móc: 'lightcoral',
        Khung: 'lightblue',
        Nan: 'lightgreen',
        Nắp: 'lightpink',
        Đáy: 'lightsalmon',
        'Bình nước': 'lightseagreen'
    }

    const handleRemoveComponent = (componentType) => {
        setSelectedComponents((prevSelectedComponents) => {
            const updatedSelectedComponents = prevSelectedComponents.map((comp) => {
                if (comp.type === componentType) {
                    return { type: componentType, data: null } // Clear data in the row
                }
                return comp
            })
            setSelectedComponents(updatedSelectedComponents)
            return updatedSelectedComponents
        })
    }

    return (
        <form action="">
            <div className="w-full">
                <UserProvider>
                    <Header />
                    <Navbar />
                </UserProvider>
                <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }]} current="Lồng tùy chỉnh" />
                <div className="flex-row bg-slate-50 my-8 mx-32">
                    <div className="px-8 py-4 font-bold text-red-500"> Chọn kiểu lồng</div>
                    <div className="grid grid-cols-4 place-items-center">
                        {categories.map((category, index) => {
                            if (category.Allow_customize === true) {
                                return (
                                    <div
                                        className={selectedImage === index + 1 ? selectedImageClass : defaultImageClass}
                                        onClick={() => {
                                            fetchComponents(category.id.trim())
                                            setSelectedImage(index + 1)
                                            handleChangeCageType()
                                        }}
                                        key={index}
                                    >
                                        <img className="max-h-52 mx-auto" src={category.imageUrl} alt="" />
                                        <div className="text-center">
                                            <h1 className="font-bold my-2">{category.name}</h1>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <hr className="border border-slate-300  mx-4" />

                    <div className="flex ">
                        <div className="content-center w-1/4">
                            <div className="m-4 font-bold">Các thành phần của {selectedImage ? categories[selectedImage - 1].name : 'Lồng'}</div>
                            <div className="w-full mx-4  flex-row space-y-4 pb-8 mb-16 bg-white">
                                <div className="w-full pt-2 pl-4 h-20">
                                    <TextField
                                        helperText={`Đặt tên cho sản phẩm`}
                                        fullWidth
                                        required
                                        label="Tên sản phẩm"
                                        variant="standard"
                                        onChange={handleNameChange}
                                        value={tmpName}
                                    />
                                </div>

                                {componentType.map((type) => {
                                    return (
                                        <div key={type} className="w-full h-24 flex place-content-between">
                                            <div className="w-72 pl-4">
                                                <hr className="border" style={{ borderTop: `5px solid ${typeToColor[type] || 'gray'}` }} />

                                                <TextField
                                                    id={type}
                                                    fullWidth
                                                    required
                                                    select
                                                    helperText={`Chọn ${type.toLowerCase()}`}
                                                    label={type}
                                                    variant="filled"
                                                    onChange={(event) => handleSelectedComponentChange(event, type)}
                                                >
                                                    {components.map((component) => {
                                                        if (component.Type === type) {
                                                            return (
                                                                <MenuItem key={component.ID} value={component.ID}>
                                                                    {component.Name}
                                                                </MenuItem>
                                                            )
                                                        }
                                                    })}
                                                </TextField>
                                            </div>

                                            <div className="py-2">
                                                <IconButton>
                                                    <ClearIcon onClick={() => handleRemoveComponent(type)} />
                                                </IconButton>
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                        <div className="w-full m-4 px-2">
                            <div className="font-bold mx-4">Cấu hình lồng của bạn </div>
                            <TableContainer className="m-4" component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Thành phần </TableCell>
                                            <TableCell>Hình ảnh </TableCell>
                                            <TableCell>Mô tả </TableCell>
                                            <TableCell>Thời Gian chế tạo (giờ)  </TableCell>
                                            <TableCell>Giá tiền </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedComponents.map((selectedComponent, index) => (
                                            <TableRow key={index}>
                                                <TableCell style={{ borderLeft: `5px solid ${typeToColor[selectedComponent.type] || 'gray'}` }}>
                                                    {selectedComponent.type}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        {selectedComponent.data?.Picture ? (
                                                            <img className="w-20 h-20" src={selectedComponent.data?.Picture} />
                                                        ) : (
                                                            <div className="h-20"></div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{selectedComponent.data?.Description || ''}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{selectedComponent.data?.CraftTime || 'N/A'}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        {selectedComponent.data?.Price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) ||
                                                            ''}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div className=" flex mx-4 place-content-between">
                                <div className="w-2/4 ">
                                    <TextField
                                        fullWidth
                                        placeholder={'Ghi chú thêm cho cửa hàng'}
                                        variant="standard"
                                        onChange={handleDescriptionChange}
                                        value={tmpDescription}
                                        multiline
                                        rows={6}
                                    />
                                </div>
                                <div className="w-1/6 mt-6 ">
                                    <TextField
                                        type="number"
                                        fullWidth
                                        placeholder={'Số lượng'}
                                        variant="standard"
                                        onChange={handleCountChange}
                                        onKeyDown={handleCountChangeOnlyNumber}
                                        value={tmpCount}
                                    />
                                </div>
                                <div className="mt-8 w-3/8">
                                    <div className="flex place-content-between">
                                        <div className=" font-bold">Thời gian hoàn thành dự kiến:</div>
                                    </div>
                                    <div className="flex place-content-between">
                                        <div className=" font-bold">Tổng cộng:</div>
                                    </div>
                                </div>
                                <div className="mt-8 w-1/8">
                                    <div className="flex place-content-between">
                                        <div className=" font-bold">{totalTime} giờ</div>
                                    </div>
                                    <div className="flex place-content-between">
                                        <div className=" font-bold">{total.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <Button variant="contained" onClick={() => {
                                    var mess;
                                    if (tmpName) {
                                        selectedComponents.map((selectedComponent) => {
                                            if (selectedComponent.data == null) {
                                                mess = `Hãy chọn thành phần ${selectedComponent.type} cho lồng của bạn`
                                            }
                                        })
                                    } else {
                                        mess = "Hãy đặt tên cho lồng của bạn"
                                    }
                                    if (mess) {
                                        alert(mess)
                                    } else {
                                        setOpenPopup(true)
                                    }
                                }}>Đặt hàng</Button>
                                <Popup
                                    open={openPopup}
                                    closeOnDocumentClick={false}
                                    position="right center"
                                    modal
                                    onOpen={() => { fetchAddresses(); fetchVouchers(); checkUserPhoneNum()}}
                                    onClose={() => setOpenPopup(false)}
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
                                                            helperText={!checkAddress ? 'Xin hãy chọn địa chỉ' : ''}
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
                                                        error={!checkValidation}
                                                        helperText={!checkValidation ? 'Số điện thoại không hợp lệ' : ''}
                                                    ></TextField>
                                                </div>
                                                <hr className="border  border-slate-300 my-2 w-full" />
                                                <h1>{tmpName}</h1>
                                            </div>
                                            <div>
                                                <TableContainer className="overflow-y-scroll h-96" component={Paper}>
                                                    <Table aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <div className="text-center  font-bold text-base">Ảnh</div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-center font-bold  text-base">Tên thành phần</div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-center font-bold  text-base">Thời gian chế tác</div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-center font-bold  text-base">Giá</div>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {selectedComponents.map((selectedComponent, index) => (
                                                                <TableRow key={`a${index}`}>
                                                                    <TableCell>
                                                                        <div>
                                                                            {selectedComponent.data?.Picture ? (
                                                                                <img className="w-20 h-20" src={selectedComponent.data?.Picture} />
                                                                            ) : (
                                                                                <div className="h-20"></div>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div>{selectedComponent.data?.Description || ''}</div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div>{selectedComponent.data?.CraftTime || 'N/A'}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div>
                                                                            {selectedComponent.data?.Price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) ||
                                                                                ''}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>

                                            <hr className="border  border-slate-300 my-2 w-full" />
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
                                                        const [voucherId, voucherDiscount] = selectedValue.split(',');
                                                        setVoucherValue(voucherDiscount.trim());
                                                        setOrderVoucher(voucherId.trim());
                                                    }}
                                                >
                                                    <option value={["", 0]} selected>
                                                        <em>Không sử dụng phiếu giảm giá</em>
                                                    </option>

                                                    {voucherList.map((voucher) =>
                                                        voucher.UsedAt == null && (
                                                            <option key={voucher.ID} value={[voucher.ID, voucher.discount]}>
                                                                {voucher.discount + '% , Hết hạn ' + voucher.ExpireAt.substr(0, 10)}
                                                            </option>
                                                        )
                                                    )}
                                                </TextField>
                                                {selectedComponents.length == 6 && (
                                                    <div>
                                                        <div className="font-bold flex place-content-end">
                                                            <div className="mr-4">Được giảm giá:</div>
                                                            <div className="text-xl">
                                                                {((total * voucherValue) / 100).toLocaleString('vi', {
                                                                    style: 'currency',
                                                                    currency: 'VND'
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="font-bold flex place-content-end">
                                                            <div className="mr-4">Số điểm bonus sẽ tích được:</div>
                                                            <div className="text-xl">{Math.floor(total / 1000)}</div>
                                                        </div>
                                                        <hr></hr>
                                                        <div className="font-bold flex place-content-end ">
                                                            <div className="text-xl font-bold mr-4">THANH TOÁN:</div>
                                                            <div className="text-4xl font-bold mr-4 text-red-400">
                                                                {calculateGrandTotal().toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
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
                                                                {/* <img className="w-1/12 mx-2" src={COD} alt="" /> */}
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
                                                                {/* <img className="w-2/12 m-2" src={VNPay} alt="" /> */}
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
                                                            Thanh toán
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
                                </Popup>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
