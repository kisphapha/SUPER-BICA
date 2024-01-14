import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import CategoryNav from '../../../components/features/CategoryNav'
import { UserContext } from '../../../UserContext'
import CustomMenu from './customMenu'
import CustomPrice from './customPrice'
import Materials from './material'
export default function SettingStuffs() {
    const { user } = useContext(UserContext)

    //step
    const steps = ['Các danh mục custom','Bảng giá custom', 'Vật liệu']

    const [activeButton, setActiveButton] = useState(0)

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName)
    }

    return (
        <div className="px-2 py-2 w-full mb-96">
            <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }, { name: 'Bảng điều khiển', link: '/admin' }]}
                current="Cài đặt linh tinh"
                margin={0}
            />
            <div className="pb-10 h-screen mt-12">
                <div className="flex">
                    {steps.map((step, index) => (
                        <div key={index}>
                            <button
                                className={`p-2 rounded-t-md ${activeButton === index ? 'bg-white' : 'bg-slate-300'}`}
                                onClick={() => handleButtonClick(index)}
                            >
                                {step}
                            </button>
                        </div>
                    ))}
                </div>
                {activeButton === 0 && (
                    <CustomMenu user={user }/>
                )}
                {activeButton === 1 && (
                    <CustomPrice user={user} />
                )}
                {activeButton === 2 && (
                    <Materials user={user} />
                )}
            </div>      
        </div>
    )
}
