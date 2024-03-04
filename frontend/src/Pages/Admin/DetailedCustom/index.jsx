import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { UserContext } from '../../../UserContext'
import CategoryNav from '../../../components/features/CategoryNav'
import ImageUploader from '../../../components/features/ImageUploader'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import {
    Button, TextField, Rating, Avatar, 
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'

function DetailedCustom() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const { orderId } = useParams()
    const [order, setOrder] = useState({})
    const [finalPrice, setFinalPrice] = useState(0)
    const [finalTime, setFinalTime] = useState(0)
    const [message, setMessage] = useState('')
    const [isEdit, setEdit] = useState(false)
    const [finalImages, setFinalImages] = useState([])

    const [changedMessage, setChangedMessage] = useState(false)
    const [changedPicture, setChangedPicture] = useState(false)

    const steps = ['Chờ duyệt', 'Xác nhận thanh toán', 'Đang thi công', 'Đang chuẩn bị', 'Đang giao', 'Đã giao'];

    async function uploadToHost() {
        const API_key = import.meta.env.VITE_IMAGE_API
        const host = 'https://api.imgbb.com/1/upload'
        const expiration = 9999999
        const urls = []

        // Use Promise.all to wait for all the asynchronous requests to complete
        await Promise.all(
            finalImages.map(async (image) => {
                const response = await Axios.postForm(`${host}?expiration=${expiration}&key=${API_key}`, {
                    image: image.data_url.substring(image.data_url.indexOf(',') + 1)
                })
                if (response.data) {
                    urls.push(response.data.data.url)
                }
            })
        )
        handleUpdateImage(urls[0])
    }

    function getImageList(images) {
        const imagesFromUrls = images.map((image) => ({
            data_url: image,
        }));
        return (imagesFromUrls);
    }

    const handleUpdateImage = async (url) => {
        await Axios.post('http://localhost:3000/custom/image', {
            final_image: url,
            orderId: orderId
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.loginedUser
            }
        })
        await Axios.patch('http://localhost:3000/notification/img', {
            image : url,
            Id: order.general.ID + 'co',
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        await Axios.post('http://localhost:3000/notification/', {
            userId: order.general.User_id,
            content: `Shop đã cập nhật ảnh cho lồng tùy chỉnh '${order.general.Name}' của bạn`,
            refId: order.general.ID + 'i',
            refUrl: "/user/customPurchase",
            refPic: url
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        alert("Đã cập nhật ảnh")
        setChangedPicture(false)
    }

    const fetchCustomDetail = async () => {
        const response = await Axios.get('http://localhost:3000/custom/order/' + orderId, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        if (response.data) {
            setOrder(response.data)
            setFinalPrice(response.data.other.Price_final)
            setFinalTime(response.data.other.Final_time)
            setMessage(response.data.other.Shop_respond)
            if (response.data.other.Final_img) setFinalImages(getImageList([response.data.other.Final_img]))
        }
    }

    const handleSendMessage = async () => {
        console.log(message)
        await Axios.post('http://localhost:3000/custom/message/', {
            orderId: orderId,
            message: message,
            id: user.Id
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.loginedUser
            }
        })
        if (order.other.Shop_respond) {
            await Axios.patch('http://localhost:3000/notification/', {
                content: `Shop đã gửi 1 phản hồi về lồng tủy chỉnh '${order.general.Name}' của bạn`,
                Id: order.general.ID + 'm',
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
        }
        else{
            await Axios.post('http://localhost:3000/notification/', {
                userId: order.general.User_id,
                content: `Shop đã gửi 1 phản hồi về lồng tủy chỉnh '${order.general.Name}' của bạn`,
                refId: order.general.ID + 'm',
                refUrl: "/user/customPurchase",
                refPic: user.Picture
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
        }
        alert('Đã gửi phản hồi')
        fetchCustomDetail()
    }
    const handleChangeStatus = async (status, message) => {
        var confirm = window.confirm(message[0])
        if (status == 3 && finalImages.length == 0) {
            confirm = false
            alert("Vui lòng cập nhật ảnh sản phẩm cuối cùng cho khách hàng")
        }
        if (confirm) {
            const status_label = steps[status]
            await Axios.post('http://localhost:3000/custom/status/', {
                orderId: orderId,
                status: status_label,
                id: user.Id,
                final_price: finalPrice,
                final_time: finalTime
            }, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.loginedUser
                }
            })
            await Axios.patch('http://localhost:3000/notification/', {
                content: "Lồng tùy chỉnh  " + order.general.Name + " của bạn đặt ngày " + new Date(order.other.Order_date).toLocaleDateString() +
                    " đã cập nhật trạng thái thành '" + status_label + "'",
                Id: orderId + 'co',
                userId: order.general.User_id,
                refUrl: "/user/customPurchase",
                refPic: order.other.Final_img
            }, {
                headers: {
                    Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                }
            })
            if (changedMessage) await handleSendMessage()
            if (status == 3 && changedPicture) await uploadToHost()
            if (status == 1) {
                await Axios.post('http://localhost:3000/notification/', {
                    userId: user.Id,
                    content: `Bạn đã đảm nhiệm lồng custom mã ${orderId} (${order.general.Name}) của ${order.general.User_name}`,
                    refId: orderId + 'cg',
                    refUrl: "/admin/CustomOrders",
                    refPic: user.Picture
                }, {
                    headers: {
                        Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
                    }
                })
            }
            alert(message[1])
            window.scrollTo(0,0)
            navigate('/admin/CustomOrders')       
        }
    }
    const handleMessageChange = async (event) => {
        setMessage(event.target.value)
        setChangedMessage(true)
    }

    const handleFinalPriceChange = (event) => {
        const input = event.target.value;
        const parsedValue = parseFloat(input.replace(/,/g, '')); // Remove commas and parse as a number
        setFinalPrice(parsedValue);
    }
    const handleFinalTimeChange = (event) => {
        setFinalTime(event.target.value)
    }

    useEffect(() => {
        fetchCustomDetail()
    },[])

    return (
        <div className="px-2 py-2 w-full mb-96">
            {user && order.general && (
                <>
                    <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }, { name: 'Bảng điều khiển', link: '/admin' }, { name: 'Đơn hàng custom', link: '/admin/CustomOrders' }]}
                        current={"Đơn hàng số " + order.general.ID}
                        margin={0}
                    />
                  
                    
                    <div className="text-2xl font-bold mt-8">{order.general.Name}</div>
                    {order.other.Status_shipping == 'Chờ duyệt' && (
                        <div className="text-xl font-bold mt-8">
                            Chỉ số ước tính
                            <TableContainer className=" " component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <div className="text-center  font-bold text-base">Giá ước tính</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-center font-bold  text-base">Thời gian tự ước tính (ngày)</div>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <div className="text-center font-bold text-red-500 text-3xl">
                                                    {(order.other.Price_calculated).toLocaleString('vi', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    })}{' '}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-center font-bold text-blue-500 text-3xl">{order.other.Time_estimated}</div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}
                    <div className="text-xl font-bold mt-8">
                        Chốt deal
                        {order.other.Status_shipping == 'Chờ duyệt' && (
                            <Button onClick={() => setEdit(!isEdit)}><ModeEditIcon /></Button>
                        )}
                        <TableContainer className=" " component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <div className="text-center  font-bold text-base">Giá chốt</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-center font-bold  text-base">Thời gian ước tính (ngày)</div>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        {!isEdit ? (
                                            <>
                                                <TableCell>
                                                    <div className="text-center font-bold text-red-500 text-3xl">
                                                        {finalPrice.toLocaleString('vi', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        })}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-center font-bold text-blue-500 text-3xl">{finalTime}</div>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell>
                                                    <div className="flex justify-center">
                                                        <TextField variant="standard" defaultValue={finalPrice}
                                                            onChange={handleFinalPriceChange}
                                                            inputProps={{
                                                                style: {
                                                                    fontWeight: 'bold',
                                                                    fontSize: '1rem',
                                                                    textAlign: 'center', // Center align the text
                                                                },
                                                            }}                                                            ></TextField>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center">                                                        
                                                        <TextField variant="standard" defaultValue={finalTime}
                                                            onChange={handleFinalTimeChange}
                                                            inputProps={{
                                                                style: {
                                                                    fontWeight: 'bold',
                                                                    fontSize: '1rem',
                                                                    textAlign: 'center', // Center align the text
                                                                },
                                                            }}>
                                                        </TextField>
                                                    </div>
                                                </TableCell>
                                            </>
                                        ) }
                                        
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className="text-xl font-bold mt-8">
                        Ảnh sản phẩm hoàn thiện
                        {order.other.Status_shipping == 'Đang thi công' && (
                            <>
                                <ImageUploader images={finalImages}
                                    setImages={setFinalImages}
                                    setChangedPicture={setChangedPicture }
                                    maxNumber={1} />
                                <div className="mt-8">
                                    <Button variant="contained" onClick={uploadToHost}>LƯU THAY ĐỔI</Button>
                                </div>
                            </>
                            
                        )}
                        {(order.other.Status_shipping == 'Đang chuẩn bị' || order.other.Status_shipping == 'Đang giao' || order.other.Status_shipping == 'Đã giao') && (
                            <img className="w-64 h-64" src={order.other.Final_img }></img>
                        )}
                    </div>
                    <div className="text-xl font-bold mt-8">
                        Chi tiết đơn hàng                        
                    </div>
                    <div className="mt-4 flex">
                        <div className="w-1/2 mr-8">
                            <div className="italic text-lg">Chung</div>
                            <table className="w-full">
                                <thead></thead>
                                <tbody>
                                    <tr className="">
                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Người đặt hàng</td>
                                        <td className="my-4 py-4  bg-white pl-4">{order.general.User_name}</td>
                                    </tr>
                                    <hr className="border border-r-violet-400" />
                                    <tr className="">
                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Hình dáng</td>
                                        <td className="my-4 py-4  bg-white pl-4">{order.general.Shape_name}</td>
                                    </tr>
                                    <hr className="border border-r-violet-400" />
                                    {order.general.Shape == "CT" && (
                                        <>
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Hình ảnh hình dáng</td>
                                                <td className="my-4 py-4  bg-white pl-4">
                                                    <img className="w-64 h-64" src={order.general.Shape_picture}></img>
                                                </td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                        </>

                                    )}                              
                                    <tr className="">
                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chiều dài</td>
                                        <td className="my-4 py-4  bg-white pl-4">{order.general.Length} cm</td>
                                    </tr>
                                    <hr className="border border-r-violet-400" />
                                    <tr className="">
                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chiều rộng</td>
                                        <td className="my-4 py-4  bg-white pl-4">{order.general.Width} cm</td>
                                    </tr>
                                    <hr className="border border-r-violet-400" />
                                    <tr className="">
                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chiều cao</td>
                                        <td className="my-4 py-4  bg-white pl-4">{order.general.Height} cm</td>
                                    </tr>
                                    <hr className="border border-r-violet-400" />
                                </tbody>
                            </table>
                        </div>
                        <div className="w-1/2 mr-8">
                            <div className="italic text-lg">Chung</div>
                            <table className="w-full">
                                <thead></thead>
                                <tbody>
                                    <tr className="">
                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mức độ tỉ mỉ</td>
                                        <td className="my-4 py-4  bg-white pl-4 text-4xl font-bold">{order.other.Detail} / 100</td>
                                    </tr>
                                    <hr className="border border-r-violet-400" />
                                    <tr className="">
                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Vật liệu chung</td>
                                        <td className="my-4 py-4  bg-white pl-4">{order.general.Material}</td>
                                    </tr>
                                    <hr className="border border-r-violet-400" />
                                    {order.general.Color && (
                                        <>
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Màu sắc chung</td>
                                                <td className="my-4 py-4  bg-white pl-4">
                                                    <input className="w-64 h-16" type="color" value={order.general.Color} readOnly />
                                                </td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                        </>

                                    )}
                                    {order.general.Shape.trim() == "LS" && (
                                        <>
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Độ phồng</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.general.InflateLevel} </td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Vị trí phồng</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.general.InflatePosition} </td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />                                           
                                        </>
                                    )}
                                    <tr className="">
                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Loại chim</td>
                                        <td className="my-4 py-4  bg-white pl-4">{order.other.BirdType} </td>
                                    </tr>
                                    <hr className="border border-r-violet-400" />
                                    <tr className="">
                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả khác</td>
                                        <td className="my-4 py-4  bg-white pl-4">{order.other.Other_description} </td>
                                    </tr>
                                    <hr className="border border-r-violet-400" />
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {(order.general.Shape.trim() == "LV" || order.general.Shape.trim() == "LG") && (
                        <>
                            <div className="mt-4 flex">
                                <div className="w-1/2 mr-8">
                                    <div className="italic text-lg">Viền</div>
                                    <table className="w-full">
                                        <thead></thead>
                                        <tbody>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Họa tiết viền</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.general.Outline_Pattern}</td>
                                            </tr>
                                            {order.general.Outline_Pattern == 'Tùy chỉnh' && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Hình ảnh họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">
                                                            <img className="w-64 h-64" src={order.general.Outline_pattern_img}></img>
                                                        </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{order.general.Outline_pattern_desc}</td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="w-1/2 mr-8">
                                    <div className="italic text-lg">Góc</div>
                                    <table className="w-full">
                                        <thead></thead>
                                        <tbody>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Họa tiết góc</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.general.Corner_Pattern}</td>
                                            </tr>
                                            {order.general.Corner_Pattern == 'Tùy chỉnh' && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Hình ảnh họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">
                                                            <img className="w-64 h-64" src={order.general.Corner_pattern_img}></img>
                                                        </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{order.general.Corner_pattern_desc}</td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="mt-4 flex">
                        <div className="w-1/2 mr-8">
                            <div className="italic text-lg">Móc</div>
                            <table className="w-full">
                                <thead></thead>
                                <tbody>
                                    {order.hook ? (
                                        <>
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Kích thước móc</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.hook.Hook_size} cm</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Kiểu cách</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.hook.Hook_Style}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chất liệu</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.hook.Hook_Material}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            {order.hook.Hook_Color && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Màu sắc</td>
                                                        <td className="my-4 py-4  bg-white pl-4">
                                                            <input className="w-64 h-16"  type="color" value={order.hook.Hook_Color} readOnly />
                                                        </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                </>
                                            )}
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Họa tiết</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.hook.Hook_Pattern}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            {order.hook.Hook_Pattern == "Tùy chỉnh" && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Ảnh họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">
                                                            <img className="w-64 h-64" src={order.hook.Hook_pattern_img}></img>
                                                        </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{order.hook.Hook_pattern_description} cm</td>
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
                        <div className="w-1/2 mr-8">
                            <div className="italic text-lg">Cửa</div>
                            <table className="w-full">
                                <thead></thead>
                                <tbody>
                                    {order.door ? (
                                        <>
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chiều ngang</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.door.Door_size_x} cm</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chiều dọc</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.door.Door_size_y} cm</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Kiểu cách</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.door.Door_Style}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Cơ chế</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.door.Door_Mode}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chất liệu</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.door.Door_Material}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            {order.door.Door_color && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Màu sắc</td>
                                                        <td className="my-4 py-4  bg-white pl-4">
                                                            <input className="w-64 h-16" type="color" value={order.door.Door_color} readOnly />
                                                        </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                </>
                                            )}
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Họa tiết</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.door.Door_Pattern}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            {order.door.Door_Pattern == "Tùy chỉnh" && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Ảnh họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">
                                                            <img className="w-64 h-64" src={order.door.Door_pattern_img}></img>
                                                        </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{order.door.Door_pattern_description}</td>
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

                    </div>

                    <div className="mt-4 flex">
                        <div className="w-1/2 mr-8">
                            <div className="italic text-lg">Nắp</div>
                            <table className="w-full">
                                <thead></thead>
                                <tbody>
                                    {order.top ? (
                                        <>
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Kiểu cách</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.top.Top_Style}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chất liệu</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.top.Top_Material}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            {order.top.Top_color && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Màu sắc</td>
                                                        <td className="my-4 py-4  bg-white pl-4">
                                                            <input className="w-64 h-16" type="color" value={order.top.Top_color} readOnly />
                                                        </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                </>
                                            )}
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Họa tiết</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.top.Top_Pattern}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            {order.top.Top_Pattern == "Tùy chỉnh" && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Ảnh họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">
                                                            <img className="w-64 h-64" src={order.top.Top_pattern_img}></img>
                                                        </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{order.top.Top_pattern_description}</td>
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
                        <div className="w-1/2 mr-8">
                            <div className="italic text-lg">Đế</div>
                            <table className="w-full">
                                <thead></thead>
                                <tbody>
                                    {order.bottom ? (
                                        <>
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Độ nghiêng</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.bottom.Bottom_tilt} độ</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Kiểu cách</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.bottom.Bottom_Style}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chất liệu</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.bottom.Bottom_Material}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            {order.bottom.Bottom_color && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Màu sắc</td>
                                                        <td className="my-4 py-4  bg-white pl-4">
                                                            <input className="w-64 h-16" type="color" value={order.bottom.Bottom_color} readOnly />
                                                        </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                </>
                                            )}
                                            <tr className="">
                                                <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Họa tiết</td>
                                                <td className="my-4 py-4  bg-white pl-4">{order.bottom.Bottom_Pattern}</td>
                                            </tr>
                                            <hr className="border border-r-violet-400" />
                                            {order.bottom.Bottom_Pattern == "Tùy chỉnh" && (
                                                <>
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Ảnh họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">
                                                            <img className="w-64 h-64" src={order.bottom.Bottom_pattern_img}></img>
                                                        </td>
                                                    </tr>
                                                    <hr className="border border-r-violet-400" />
                                                    <tr className="">
                                                        <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Mô tả họa tiết</td>
                                                        <td className="my-4 py-4  bg-white pl-4">{order.bottom.Bottom_pattern_description}</td>
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
                    </div>
                    <div className="mt-4">
                        <div className="italic text-lg">Nan</div>
                        <table className="w-full">
                            <thead></thead>
                            <tbody>
                                {order.spokes ? (
                                    <>
                                        <tr className="">
                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Số nan dọc</td>
                                            <td className="my-4 py-4  bg-white pl-4">{order.spokes.Spoke_amount_ver} độ</td>
                                        </tr>
                                        <hr className="border border-r-violet-400" />
                                        <tr className="">
                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Số nan ngang</td>
                                            <td className="my-4 py-4  bg-white pl-4">{order.spokes.Spoke_amount_hor}</td>
                                        </tr>
                                        <hr className="border border-r-violet-400" />
                                        <tr className="">
                                            <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Chất liệu</td>
                                            <td className="my-4 py-4  bg-white pl-4">{order.spokes.Spoke_material}</td>
                                        </tr>
                                        <hr className="border border-r-violet-400" />
                                        {order.spokes.Spoke_Color && (
                                            <>
                                                <tr className="">
                                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Màu sắc</td>
                                                    <td className="my-4 py-4  bg-white pl-4">
                                                        <input className="w-64 h-16" type="color" value={order.spokes.Spoke_Color} readOnly />
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
                                    <td className="my-4 py-4  bg-white pl-4">{order.other.Address}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                                <tr className="">
                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Số điện thoại liên hệ</td>
                                    <td className="my-4 py-4  bg-white pl-4">{order.other.PhoneNumber}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                                <tr className="">
                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Voucher áp dụng</td>
                                    <td className="my-4 py-4  bg-white pl-4">{order.other.Voucher_value ? order.other.Voucher_value + ' %' : 'Không áp dụng'}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                                <tr className="">
                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Ngày đặt hàng</td>
                                    <td className="my-4 py-4  bg-white pl-4">{order.other.Order_date.substr(0, 10) + ' ' + order.other.Order_date.substr(11,8) }</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                                <tr className="">
                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Ngày thanh toán</td>
                                    <td className="my-4 py-4  bg-white pl-4">
                                        {order.other.Payment_date ? order.other.Payment_date.substr(0, 10) + ' ' + order.other.Payment_date.substr(11, 8) : ''}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                                <tr className="">
                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Lần cuối chỉnh sửa</td>
                                    <td className="my-4 py-4  bg-white pl-4">
                                        {order.other.Updated_at ? order.other.Updated_at.substr(0, 10) + ' ' + order.other.Updated_at.substr(11, 8) : ''}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                                <tr className="">
                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Trạng thái</td>
                                    <td className="my-4 py-4  bg-white pl-4">{order.other.Status_shipping}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                                <tr className="">
                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Thanh toán</td>
                                    <td className="my-4 py-4  bg-white pl-4">{order.other.Status_paid}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                                <tr className="">
                                    <td className="my-4 py-4  w-1/6 pl-4 bg-slate-300">Phương thức thanh toán</td>
                                    <td className="my-4 py-4  bg-white pl-4">{order.other.Payment_method}</td>
                                </tr>
                                <hr className="border border-r-violet-400" />
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4">
                        <div className="text-xl font-bold mb-2">Lời nhắn tới khách hàng</div>
                        {
                            order.other.Shop_respond && (
                                <div className="italic text-lg mb-2">Cập nhật lúc {order.other.Response_date.substr(11, 8)}  {order.other.Response_date.substr(0, 10) + ' '}
                                    bởi {order.other.Staff_name}</div>
                            )
                        }
                        <TextField fullWidth variant="outlined" label="Phản hồi của shop" multiline
                            rows={6} value={message} onChange={handleMessageChange }></TextField>
                    </div>
                    {(order.other.Status_shipping == 'Chờ duyệt' ||
                        (order.other.Status_shipping != 'Chờ duyệt' && order.other.StaffID == user.Id)) && (
                        <div className="flex justify-end mt-3">
                            <Button onClick={handleSendMessage} variant="outlined" className="w-64">GỬI</Button>
                        </div>
                    )}

                    {(order.other.Status_shipping == 'Chờ duyệt' ||
                        (order.other.Status_shipping == 'Đang thi công' && order.other.StaffID == user.Id) ||
                        (order.other.Status_shipping == 'Đang chuẩn bị' && order.other.StaffID == user.Id)) && (
                        <div className="flex justify-center mt-16">
                            <Button variant="contained" className="w-1/2 h-16"
                                onClick={
                                    () => {
                                        switch (order.other.Status_shipping) {
                                            case 'Chờ duyệt':
                                                handleChangeStatus(1, ['Bạn có chắc chắn về hành động này?. Giá cả và thời gian chốt không thể chỉnh sửa sau đó','Đã duyệt đơn hàng']);
                                                break;
                                            case 'Đang thi công':
                                                handleChangeStatus(3, ['Bạn có chắc chắn đã hoàn thành chiếc lồng này?','Đã cập nhật']);
                                                break;
                                            case 'Đang chuẩn bị':
                                                handleChangeStatus(4, ['Bạn có chắc chắn đã hoàn thành đóng gói và giao cho shipper?', 'Đã cập nhật']);
                                                break;
                                        }
                                    }
                                }>
                                <div className="text-xl font-bold">
                                    {
                                        order.other.Status_shipping == 'Chờ duyệt' && "DUYỆT ĐƠN"
                                    }
                                    {
                                        order.other.Status_shipping == 'Đang thi công' && "HOÀN THÀNH SẢN PHẨM"
                                    }
                                    {
                                        order.other.Status_shipping == 'Đang chuẩn bị' && "ĐÃ BÀN GIAO CHO SHIPPER"
                                    }
                                </div>
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default DetailedCustom
