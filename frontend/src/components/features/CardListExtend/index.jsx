import React, { useState, useEffect } from 'react'
import './styles.css'
import Card from '../Card'
import axios from 'axios'
import Carousel from 'react-elastic-carousel'

export default function CardListExtend({ categoryId, proList }) {
    const breakPoints = [
        { width: 200, itemsToShow: 1 },
        { width: 400, itemsToShow: 2 },
        { width: 600, itemsToShow: 3 },
        { width: 800, itemsToShow: 4 },
        { width: 1000, itemsToShow: 5 }
    ]

    return (
        <>
            <div id="ex-item-container">
                <div className="item-list">
                    <Carousel breakPoints={breakPoints} >
                        {proList.map((card) => (
                            <Card
                                key={card}
                                percent={card.discount}
                                discount={parseInt((card.Price * (100 - card.discount)) / 100).toLocaleString('vi', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}
                                image={card.Url}
                                itemId={card.Id}
                                material={card.material}
                                price={parseInt(card.Price).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                shape={card.Shape}
                                title={card.Name}
                            />
                        ))}
                    </Carousel>
                </div>
            </div>
        </>
    )
}
