import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Address.css'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import AddressCard from '../features/AddressCard'
import AddressPopup from '../features/AddressPopup/AddressPopup'
import { ToastContainer } from 'react-toastify'

const Address = (props) => {
    const [addressList, setAddressList] = useState([])
    async function fetchAddresses() {
        const response = await axios.get(`http://localhost:3000/address/${props.user.Id}`, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.loginedUser
            }
        })
        setAddressList(response.data)
    }

    useEffect(() => {
        fetchAddresses()
    }, [])
    //File có popup dùng để create
    return (
        <div>
            <div className="address-header">
                <h1>Địa chỉ của tôi</h1>
                <Popup
                    trigger={
                        <button type="button" className="add-btn">
                            + Thêm địa chỉ mới
                        </button>
                    }
                    position="right center"
                    modal
                    // onClose={handleClose} // Call the handleClose method when the Popup is closed
                >
                    {(close) => (
                        <div className="popup-address">
                            <h1>Thêm địa chỉ</h1>
                            <AddressPopup user={props.user} fetchAddresses={fetchAddresses} close={close}/>
                        </div>
                    )}
                </Popup>
            </div>
            <hr />
            <div className="address-list">
                <h1>Địa chỉ</h1>
                <table className="address-table">
                    {addressList.map((address) => (
                        <tr key={address}>
                            <AddressCard
                                id={address.ID}
                                street={address.SoNha}
                                city={address.TinhTP}
                                district={address.QuanHuyen}
                                ward={address.PhuongXa}
                                fetchAddress={fetchAddresses}
                                user={props.user }
                            />
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    )
}

export default Address
