import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import './UserUtilities.css'
import { Assignment, CurrencyBitcoin, LocationOn, Person } from '@mui/icons-material'
import LocalActivityIcon from '@mui/icons-material/LocalActivity'
const UserUtilities = (props) => {
    return (
        <div className="user-utilities  ">
            <div className="user-holder">
                <img src={props.user.Picture} />
                <h1>{props.user.Name}</h1>
            </div>
            <hr />
            <div className="utilities">
                <NavLink to="/user/profile" activeClassName="active">
                    <div className="ult-txt">
                        <Person /> Hồ sơ
                    </div>
                </NavLink>
                <NavLink to="/user/purchase" activeClassName="active">
                    <div className="ult-txt">
                        <Assignment /> Đơn mua
                    </div>
                </NavLink>
                <NavLink to="/user/customPurchase" activeClassName="active">
                    <div className="ult-txt">
                        <Assignment /> Đơn mua custom
                    </div>
                </NavLink>
                <NavLink to="/user/address" activeClassName="active">
                    <div className="ult-txt">
                        <LocationOn /> Địa chỉ
                    </div>
                </NavLink>
                <NavLink to="/user/bicacoin" activeClassName="active">
                    <div className="ult-txt">
                        <CurrencyBitcoin /> BiCaCoin
                    </div>
                </NavLink>

                <NavLink to="/user/voucher" activeClassName="active">
                    <div className="ult-txt">
                        <LocalActivityIcon /> Mã giảm giá
                    </div>
                </NavLink>
            </div>
        </div>
    )
}

export default UserUtilities
