import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { UserContext, UserProvider } from '../../UserContext'
import Header from '../../components/common/Header'
import Navbar from '../../components/common/Navbar'
import CategoryNav from '../../components/features/CategoryNav'
import UserUtilities from '../../components/common/UserUtilities'
import voucherImage from '../../image/icons/voucher.png'
import { Button } from '@mui/material'

export default function VoucherPage() {
    const { user } = useContext(UserContext)
    const [voucher, setVoucher] = useState([])

    async function fetchVoucher() {
        const response = await axios.get(`http://localhost:3000/users/getVoucher/${user.Id}`, {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        setVoucher(response.data)
    }

    useEffect(() => {
        fetchVoucher()
    },[])

    return (
        <div className="user-page">
            <UserProvider>
                <Header />
                <Navbar />
            </UserProvider>
            <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }]} current="Hồ sơ"></CategoryNav>
            <div className="user-container">
                {user != null ? <UserUtilities user={user} /> : <div>Loading...</div>}
                
                <div className="user-view">
                    <div>
                        <div className="form-header">
                            <h1>Mã giảm giá của tôi</h1>
                            <p>Áp dụng ngay nào </p>
                        </div>
                        {voucher.map((voucher) => (
                            voucher.UsedAt == null &&  (
                            <div key={voucher.Id }  className="flex-col bg-slate-50 m-2 p-2 rounded-lg">
                                <div>Hết hạn : {voucher.ExpireAt.substr(0,10)} </div>
                                <div className="flex place-content-between">
                                    <div className=" flex my-2">
                                        <div className="w-32">
                                            <img src={voucherImage} alt="" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex text-center" >
                                            <div className="mr-2 text-xl">
                                            Mã giảm giá:
                                            </div>
                                            <div className="text-xl">
                                                <span className="font-bold">{voucher.discount} %</span>
                                            </div>
                                        </div>
                                        <div className="text-xl">
                                            Giảm tối đa <span className="font-bold">{voucher.MaxAmount / 1000 + "K "} </span>VND
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))) }
                       
                    </div>
                </div>
            </div>
        </div>
    )
}
