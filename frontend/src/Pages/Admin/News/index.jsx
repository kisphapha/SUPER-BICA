import {
    Button,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TextField,
    Avatar
} from '@mui/material'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import Popup from 'reactjs-popup'
import { UserContext } from '../../../UserContext'
import CategoryNav from '../../../components/features/CategoryNav'

export default function News() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const [newsList, setNewsList] = useState([])
    const [unseenMessage, setUnseenMessage] = useState([0,0])

    const steps = ['Hệ thống', 'Dành cho tôi']

    const [activeButton, setActiveButton] = useState(1)

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName)
    }

    const fetchNews = async () => {
        const counting = [0,0]
        const system = await axios.get('http://localhost:3000/notification/', {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        const personal = await axios.get('http://localhost:3000/notification/' + user.Id, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        if (system.data) {
            system.data.map((noti) => {
                if (!noti.View_status) counting[0] += 1
            })
            if (activeButton == 0) setNewsList(system.data)
        }
        if (personal.data) {
            personal.data.map((noti) => {
                if (!noti.View_status) counting[1] += 1
            })
            if (activeButton == 1) setNewsList(personal.data)
        }
        setUnseenMessage(counting)

    }
    const handleClickNotify = async (noti, view) => {
        await axios.patch(`http://localhost:3000/notification/seen`, {
            Id: noti.Id
        }, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
        if (view) navigate(noti.RefUrl)
    }
    const handleDeleteNotify = async (noti) => {
        await axios.delete(`http://localhost:3000/notification/0/${noti.Id}`, {
            headers: {
                Authorization: 'Bearer ' + import.meta.env.VITE_SERVER_KEY
            }
        })
    }

    useEffect(() => {
        fetchNews()
    })

    return (
        <div className="px-2 py-2 w-full mb-96">
            <div onClick={() => alert("abcxyz")}>
                <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }, { name: 'Bảng điều khiển', link: '/admin' }]}
                    current="Thông tin"
                    margin={0}
                />
            </div>
            <div className="mt-8 mb-8 font-bold text-2xl">Trung tâm tin tức</div>
            <div className="flex mb-4">
                {steps.map((step, index) => (
                    <div key={index}>
                        <button
                            className={`pt-2 pb-2 pl-16 pr-16 rounded-t-md relative ${activeButton === index ? 'bg-white' : 'bg-slate-300'}`}
                            onClick={() => handleButtonClick(index)}
                        >
                            {step}
                            {unseenMessage[index] > 0 && (
                                <div className="rounded-full bg-red-600 w-6 h-6 text-white text-center absolute top-1 right-2">
                                    {unseenMessage[index]}
                                </div>
                            )}
                        </button>
                    </div>
                ))}
            </div>
            {newsList.map((news) => (
                <div key={news.Id} className={"pt-8 pl-8 pr-8 pb-2 mb-4 rounded-2xl shadow-lg " + (news.View_status ? "bg-white" : "bg-blue-100")}>
                    <div className="flex">
                        <Avatar src={news.RefPicture} />
                        <div className="ml-4 flex flex-col gap-2">
                            <div className="">{news.content}</div>
                            <div className="text-sm  text-gray-400">{"Ngày " + news.Time_stamp.substr(0, 10) + ' lúc ' + news.Time_stamp.substr(11, 8)}</div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button onClick={() => handleClickNotify(news, true)}>XEM</Button>
                        <Button onClick={() => handleDeleteNotify(news)}>XOÁ</Button>
                    </div>
                </div>
            ))} 
        </div>
    )
}
