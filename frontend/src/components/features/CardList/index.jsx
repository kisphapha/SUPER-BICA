import React, { useState, useEffect } from 'react'
import './styles.css'
import Card from '../Card'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Carousel from 'react-elastic-carousel'

export default function CardList({ categoryId, category }) {
    const navigate = useNavigate()
    const [cards, setCards] = useState([])

    const breakPoints = [
        {width:200, itemsToShow: 1},
        {width:400, itemsToShow: 2},
        {width:600, itemsToShow: 3},
        {width:800, itemsToShow: 4},
        {width:1000, itemsToShow: 5},
    ]

    useEffect(() => {
        async function fetchCards() {
            const response = await axios.get(`http://localhost:3000/products/cate/${categoryId}`)
            setCards(response.data)
        }
        fetchCards()
    }, [])

    function handleSeeMore() {
        navigate('/filter/' + 1 + '/' + categoryId)
    }

    return (
        <div id="item-container">
            <div className="name">
                <h3>{category}</h3>
                <button className="more" onClick={() => handleSeeMore()}>
                    Tất Cả
                </button>
            </div>
            <div className="item-list">
                <Carousel breakPoints={breakPoints} pagination={false} >
                    {cards.map(
                        (card) =>
                            (
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
                            )
                    )}
                </Carousel>
            </div>
        </div>
    )
}
