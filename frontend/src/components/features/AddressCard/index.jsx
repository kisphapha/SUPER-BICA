import { React, useState, useRef, useEffect } from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddressPopup from '../AddressPopup/AddressPopup'
import { Button, TextField } from '@mui/material'
import axios from 'axios'
import Popup from 'reactjs-popup'

export default function AddressCard({ id, city, district, ward, street, fetchAddress , user}) {
    async function handleDelete() {
        await axios.delete(`http://localhost:3000/address/delete/${id}/${user.Id}`, {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        console.log(id)
        alert('Địa chỉ đã được xoá')
        fetchAddress()
    }
    //Popup ở đây dùng để update
    return (
        <div id="adr-item">
            <div className="adr-item-detail">
                <div className="adr-grp">
                    <span className="adr-comp">{street}</span>
                    <br />
                    <span className="adr-comp">{city}, </span>
                    <span className="adr-comp">{district}, </span>
                    <span className="adr-comp">{ward}</span>
                </div>
                <div className="ftn">
                    <span className="edit-adr">
                        <Popup
                            trigger={
                                <button style={{ marginLeft: '50px' }}>
                                    <ModeEditIcon fontSize="medium" />
                                </button>
                            }
                            position="right center"
                            modal
                        >
                            {(close) => (
                                <div className="popup-address">
                                    <h1>Cập nhật địa chỉ</h1>
                                    <AddressPopup user={user} fetchAddresses={fetchAddress} close={close}
                                        address={{
                                            id: id,
                                            city: city,
                                            district: district,
                                            ward: ward,
                                            street: street
                                        }} />
                                </div>
                            )}
                        </Popup>
                    </span>
                    <span className="delete-adr">
                        <button onClick={() => handleDelete()} style={{ marginLeft: '10px' }}>
                            <DeleteIcon fontSize="medium" />
                        </button>
                    </span>
                </div>
            </div>
        </div>
    )
}
