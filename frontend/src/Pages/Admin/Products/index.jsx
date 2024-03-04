/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import {
    Button,
    ButtonBase,
    FormControl,
    FormControlLabel,
    FormLabel,
    Paper,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import MenuItem from '@mui/material/MenuItem'
import Axios from 'axios'
import Popup from 'reactjs-popup'
import EditProductForm from '../EditProductForm/index'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'
import { UserContext } from '../../../UserContext'
import CategoryNav from '../../../components/features/CategoryNav'

export default function Products() {
    const { user } = useContext(UserContext)

    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [pageList, setPageList] = useState([])

    const [cate, setCate] = useState([])
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [upperPrice, setUpperPrice] = useState('')
    const [lowerPrice, setLowerPrice] = useState('')
    const [upperStock, setUpperStock] = useState('')
    const [lowerStock, setLowerStock] = useState('')
    const [prostatus, setProStatus] = useState('')
    const handleIdChange = (event) => {
        setId(event.target.value)
    }
    const handleNameChange = (event) => {
        setName(event.target.value)
        setPage(1)
    }

    const handleCategoryChange = (event) => {
        setCategory(event.target.value)
        setPage(1)
    }

    const handleUpperPriceChange = (event) => {
        setUpperPrice(event.target.value)
        setPage(1)
    }

    const handleLowerPriceChange = (event) => {
        setLowerPrice(event.target.value)
        setPage(1)
    }

    const handleUpperStockChange = (event) => {
        setUpperStock(event.target.value)
        setPage(1)
    }

    const handleLowerStockChange = (event) => {
        setLowerStock(event.target.value)
        setPage(1)
    }

    const handleStatusChange = (event) => {
        setProStatus(event.target.value)
        setPage(1)
    }
    const handleSwitchPage = (page) => {
        setPage(page)
    }
    async function handleDelete(id) {
        await axios.delete(`http://localhost:3000/products/` + id, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.loginedUser
            }
        })
        alert('Product deleted')
        handleFilter()
    }

    const handleFilter = async () => {
        const json = {
            id: id,
            name: name,
            category: category,
            upper_price: upperPrice,
            lower_price: lowerPrice,
            upper_stock: upperStock,
            lower_stock: lowerStock,
            status: prostatus,
            page: page
        }
        Axios.post('http://localhost:3000/products/filter/', json)
            .then((response) => {
                setProducts(response.data.data)
                setMaxPage(Math.ceil(response.data.lines.Count / 10))
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }
    async function fetchCates() {
        Axios.get('http://localhost:3000/category')
            .then((response) => {
                setCate(response.data)
            })
            .catch((error) => {
                console.error('Error fetching category data:', error)
            })
    }

    useEffect(() => {
        setPageList(Array.from({ length: maxPage }))
    }, [maxPage])

    useEffect(() => {
        handleFilter()
        fetchCates()
    })
    const status = [
        {
            value: 'All',
            label: 'All'
        },
        {
            value: 'Enable',
            label: 'Enable'
        },
        {
            value: 'Disable',
            label: 'Disable'
        }
    ]

    return (
        <div className="px-2 py-2 w-full  mb-96">
            <CategoryNav
                parents={[
                    { name: 'Trang chủ', link: '/' },
                    { name: 'Bảng điều khiển', link: '/admin' }
                ]}
                current="Danh sách sản phẩm"
                margin={0}
            />
            <div className="flex-col">
                <div className="my-5 text-2xl font-bold">Danh sách sản phẩm</div>
                {/* <Button onClick={() => '/admin/NewProduct'}>New Product</Button> */}
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <div className="flex-row">
                                    <div className="font-bold text-lg ">Mã SP</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-lg ">Ảnh</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-lg ">Tên sản phẩm</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-lg ">Giá</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-lg ">Số lượng</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-lg ">Phân loại</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-bold text-lg "> Trạng thái</div>
                                </div>
                            </TableCell>
                            {user && user.Role == 'Admin' && (
                                <TableCell>
                                    <div className="font-bold text-lg "> Chỉnh sửa</div>
                                </TableCell>
                            )}
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div className="flex-row">
                                    <div>
                                        <TextField
                                            className="w-16"
                                            id="outlined-basic"
                                            placeholder="###"
                                            variant="standard"
                                            onChange={handleIdChange}
                                        />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div></div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div>
                                        <TextField
                                            className="w-64"
                                            id="outlined-basic"
                                            placeholder="Nhập tên"
                                            variant="standard"
                                            onChange={handleNameChange}
                                        />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="flex">
                                        <div className="w-16">
                                            <TextField
                                                className="w-12"
                                                id="outlined-basic"
                                                placeholder="From"
                                                variant="standard"
                                                onChange={handleLowerPriceChange}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                className="w-12"
                                                id="outlined-basic"
                                                placeholder="To"
                                                variant="standard"
                                                onChange={handleUpperPriceChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="flex">
                                        <div className="w-16">
                                            <TextField
                                                className="w-12"
                                                id="outlined-basic"
                                                placeholder="From"
                                                variant="standard"
                                                onChange={handleLowerStockChange}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                className="w-12"
                                                id="outlined-basic"
                                                placeholder="To"
                                                variant="standard"
                                                onChange={handleUpperStockChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div>
                                        <TextField
                                            className="w-64"
                                            select
                                            label="Loại"
                                            variant="filled"
                                            onChange={handleCategoryChange}
                                            defaultValue="All"
                                        >
                                            <MenuItem value={'All'}>All</MenuItem>
                                            {cate.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div>
                                        <TextField
                                            className="w-32 text-left"
                                            select
                                            label="Status"
                                            variant="filled"
                                            onChange={handleStatusChange}
                                            defaultValue="All"
                                        >
                                            {status.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-right">Sửa/xóa</div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow>
                                <TableCell>
                                    <div className="text-base"> {product.Id}</div>
                                </TableCell>
                                <TableCell>
                                    <img className="w-16 h-16   " src={product.Url} />
                                </TableCell>
                                <TableCell>
                                    <div className="text-base">{product.Name}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-base text-right">
                                        {product.Price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-base text-center">{product.Stock}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-base">{product.Shape}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-base text-center">{product.Status}</div>
                                </TableCell>
                                {user && user.Role == 'Admin' && (
                                    <TableCell>
                                        {' '}
                                        <div className="flex justify-end">
                                            <Popup
                                                trigger={
                                                    <button className="">
                                                        <ModeEditIcon fontSize="medium" />
                                                    </button>
                                                }
                                                position="right center"
                                                modal
                                                closeOnDocumentClick={false}
                                                closeOnEscape={false}
                                            >
                                                {(close) => (
                                                    <div>
                                                        <div className="flex place-content-between ">
                                                            <div className="m-4 font-bold text-lg">Chỉnh sửa sản phẩm </div>
                                                            <div>
                                                                <Button variant="outlined" className="" onClick={close}>
                                                                    X
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <EditProductForm productId={product.Id} close={close} handleFilter={handleFilter} user={user} />
                                                    </div>
                                                )}
                                            </Popup>
                                            <Popup
                                                trigger={
                                                    <button onClick={() => handleDelete(product.Id)}>
                                                        <DeleteIcon fontSize="medium" />
                                                    </button>
                                                }
                                                position="right center"
                                                modal
                                            >
                                                {(close) => (
                                                    <>
                                                        <div className="flex justify-center">Bạn có chắc chắn muốn xóa lồng này không?</div>
                                                        <div className="flex justify-center">
                                                            <Button
                                                                variant="contained"
                                                                onClick={() => {
                                                                    handleDelete(product.Id)
                                                                    close()
                                                                }}
                                                            >
                                                                Có
                                                            </Button>
                                                            <Button variant="outlined" onClick={close}>
                                                                Không
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            </Popup>
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="flex justify-center my-4">
                {pageList.map((pg, index) => (
                    <td key={index}>
                        <div className="items-center">
                            <Button variant={index + 1 === page ? 'contained' : 'outlined'} onClick={() => handleSwitchPage(index + 1)}>
                                {index + 1}
                            </Button>
                        </div>
                    </td>
                ))}
            </div>
        </div>
    )
}
