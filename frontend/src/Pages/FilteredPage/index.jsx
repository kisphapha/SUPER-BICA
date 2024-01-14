import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { useParams } from 'react-router-dom'
import Header from '../../components/common/Header'
import Navbar from '../../components/common/Navbar'
import './styles.css'
import CardListExtend from '../../components/features/CardListExtend'
import axios from 'axios'
import { UserProvider } from '../../UserContext'
import CategoryNav from '../../components/features/CategoryNav'

export default function FilteredPage() {
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [pageList, setPageList] = useState([])
    const { filter, keyword } = useParams()
    const [search, setSearch] = useState([])
    const [proList, setProList] = useState([])


    useEffect(() => {
        getCardListFilter(filter, keyword)
    }, [page])

    useEffect(() => {
        setPageList(Array.from({ length: maxPage }))
    }, [maxPage])


    const handleSwitchPage = (page) => {
        setPage(page)
    }
    async function fetchCate() {
        const response = await axios.get(`http://localhost:3000/category/${keyword}`)
        setSearch(response.data[0].Name)
    }

    const getCardListFilter = async (filter, keyword) => {
        window.scrollTo(0, 0)
        if (filter == 1) {
            const response = await axios.post('http://localhost:3000/products/paging/category/', {
                page: page,
                cate: keyword
            })
            setProList(response.data.data)
            setMaxPage(Math.ceil(response.data.lines.Count / 15))
            fetchCate()
        } else if (filter == 2) {
            const response = await axios.post('http://localhost:3000/products/paging/search', {
                page: page,
                name: keyword
            })
            setProList(response.data.data)
            setMaxPage(Math.ceil(response.data.lines.Count / 15))
            setSearch('Kết quả tìm kiếm cho: ' + keyword)
        }
    }

    return (
        <div id="page_filter">
            <UserProvider>
                <Header />
                <Navbar getCardListFilter={getCardListFilter} />
            </UserProvider>

            <main id="body">
                <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }]} current={search}></CategoryNav>
                <CardListExtend categoryId={keyword} proList={proList} />
            </main>
            {/* <div className="flex justify-center">
                {pageList.map((pg, index) => (
                    <td key={index}>
                        <div className="items-center">
                            <Button variant={index + 1 === page ? 'contained' : 'outlined'} onClick={() => handleSwitchPage(index + 1)}>
                                {index + 1}
                            </Button>
                        </div>
                    </td>
                ))}
            </div> */}
        </div>
    )
}
