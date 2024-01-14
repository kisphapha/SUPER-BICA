import React from 'react'
import './styles.css'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'

export default function Card({ itemId, shape, material, image, title, price, discount }) {
    const navigate = useNavigate()

    return (
        <div id="item" onClick={() => navigate(`/products/${itemId}`)}>
            <img className="img" src={image} />
            <div className="item-detail">
                <div className="title">{title}</div>
                <div className="price">
                    <div className="cost">{price}</div>
                    <div className="discount">{discount}</div>
                </div>
                <div className="data">
                    <div className="row">
                        <span className="title">Mã Sản Phẩm</span>
                        <span className="info">{itemId}</span>
                    </div>
                    <hr />
                    <div className="row">
                        <span className="title">Hình dáng</span>
                        <span className="info">{shape}</span>
                    </div>
                    <hr />
                    <div className="row">
                        <span className="title">Chất Liệu</span>
                        <span className="info">{material}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
