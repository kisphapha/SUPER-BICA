import React, { useState, useEffect } from 'react'
import Header from '../../components/common/Header'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import './styles.css'
import CardList from '../../components/features/CardList'
import CardListExtend from '../../components/features/CardListExtend'
import Card from '../../components/features/Card'
import axios from 'axios'
import { UserProvider } from '../../UserContext'
import banner from '../../image/banner/banner.png'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const [cates, setCate] = useState([])
    // const [searchResults, setSearchResults] = useState([]);
    // const handleSearch = async (query) => {
    //     const response = await axios.post('http://localhost:3000/products/search/', { query });
    //     setSearchResults(response.data);
    //     console.log(response.data)
    // }
    useEffect(() => {
        async function fetchCate() {
            const response = await axios.get('http://localhost:3000/category/')
            setCate(response.data)
        }
        window.scrollTo(0, 0)
        fetchCate()
    }, [])

    const navigate = useNavigate()

    const handleButtonClick = (path) => {
        navigate(path)
    }

    return (
        <div id="page_home">
            <UserProvider>
                <Header />
                <Navbar />
            </UserProvider>

            <main id="body">
                <div className="body-logo">
                    <img className="w-full h-auto" src={banner} onClick={() => handleButtonClick('/Custom')} />
                </div>
                <div className="body-bottom"></div>
                {cates.map((cate) => (
                    <CardList key={cate.id} categoryId={cate.id} category={cate.name} />
                ))}
            </main>
        </div>
    )
}
