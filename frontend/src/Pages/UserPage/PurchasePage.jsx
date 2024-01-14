import React, { useContext, useEffect, useState } from 'react'
import UserUtilities from "../../components/common/UserUtilities";
import "./styles.css"
import { UserContext } from '../../UserContext';
import { UserProvider } from '../../UserContext';
import Header from '../../components/common/Header';
import Navbar from '../../components/common/Navbar';
import CategoryNav from '../../components/features/CategoryNav';
import OrderList from '../../components/features/OrderList/index';

const PurchasePage = () => {
    const { user } = useContext(UserContext);

    return (

        <div className="user-page">
            <UserProvider>
                <Header />
                <Navbar />
            </UserProvider>
            <CategoryNav
                parents={[
                    { "name": "Trang chủ", "link": "/" }
                ]}
                current="Hồ sơ"></CategoryNav>
            <div className="user-container">
                {user != null ? (<UserUtilities user={user} />) : (<div>Loading...</div>)}
                <div className="user-view">
                    {user != null ? (<OrderList user={user} />) : (<div>Loading...</div>)}
                </div>
            </div>
        </div>
    )
}

export default PurchasePage