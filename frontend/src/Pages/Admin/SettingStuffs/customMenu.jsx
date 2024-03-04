import {
    Button,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TextField
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import Popup from 'reactjs-popup'
import ImageUploader from '../../../components/features/ImageUploader'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function CustomMenu({user }) {
    const [openPopup, setOpenPopup] = useState(false)
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [pageList, setPageList] = useState([])
    //Comboboxes
    const [menuList, setMenuList] = useState([])
    const [cateList, setCateList] = useState([])

    const [id, setId] = useState(0)
    const [newName, setNewName] = useState('')
    const [newUrl, setNewUrl] = useState('')
    const [newCategory, setNewCategory] = useState('All')

    const [oldImages, setOldImages] = useState([])
    const [images, setImages] = useState([])

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }
    const handleCategoryChange = (event) => {
        setNewCategory(event.target.value)
    }
    const handleSwitchPage = (page) => {
        setPage(page)
    }

    const handleFilter = async () => {
        const json = {
            name: newName,
            category: newCategory,
            page: page
        }
        axios.post('http://localhost:3000/custom/menu/filter/', json)
            .then((response) => {
                setMenuList(response.data.data)
                setMaxPage(Math.ceil(response.data.lines.Count / 10))
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }

    //const fetchComboBoxes = async () => {
    //    const hookStyles = await axios.get("http://localhost:3000/custom/allItems")
    //    if (hookStyles) {
    //        setMenuList(hookStyles.data)
    //    }
    //}
    async function getUniqueCategories() {
        const hookStyles = await axios.get("http://localhost:3000/custom/allItems")
        if (hookStyles) {
            const categories = new Set();

            (hookStyles.data).forEach((item) => {
                categories.add(item.Category);
            });
            setCateList(Array.from(categories));

        }
    }

    async function uploadToHost(mode) {
        const API_key = import.meta.env.VITE_IMAGE_API
        const host = 'https://api.imgbb.com/1/upload'
        const expiration = 9999999
        const urls = []

        // Use Promise.all to wait for all the asynchronous requests to complete
        await Promise.all(
            images.map(async (image) => {
                const response = await axios.postForm(`${host}?expiration=${expiration}&key=${API_key}`, {
                    image: image.data_url.substring(image.data_url.indexOf(',') + 1)
                })
                if (response.data) {
                    urls.push(response.data.data.url)
                }
            })
        )
        if (mode == 0) handleAdd(urls[0])
        else handleUpdate(urls[0])
    }
    const handleAdd = async (url) => {
        if (!newName || !newCategory) {
            alert("Vui lòng nhập tên và chọn phân loại")
            return
        }
        await axios.post('http://localhost:3000/custom/menu', {
            name: newName,
            category: newCategory,
            picture : url
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.loginedUser
            }
        })
        alert("Đã thêm danh mục")
        resetDefault()
        setNewUrl('')
        handleFilter()
    }
    const handleUpdate = async (url) => {
        if (!newName || !newCategory) {
            alert("Vui lòng nhập tên và chọn phân loại")
            return
        }
        await axios.patch('http://localhost:3000/custom/menu', {
            id : id,
            name: newName,
            category: newCategory,
            picture: url
        }, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.loginedUser
            }
        })
        alert("Đã cập nhật danh mục")
        resetDefault()
        handleFilter()
    }
    const handleDelete = async (id) => {
        const confirm = window.confirm("Bạn muốn xóa danh mục này?")
        if (confirm) {
            await axios.delete('http://localhost:3000/custom/menu/' + id, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.loginedUser
                }
            })
            alert("Đã xóa danh mục")
            handleFilter()
        }
    }
    const handleEdit = (id,name,category,picture) => {
        setId(id)
        setNewName(name)
        setNewCategory(category)
        setNewUrl(picture)
        let oldImage = [{ data_url: picture }]
        if (picture) setImages(oldImage)
        if (picture) setOldImages(oldImage)
        setOpenPopup(true)
    }

    const resetDefault = () => {
        setNewName('')
        setNewCategory('All')
        setImages([])
    }

    useEffect(() => {
        setPageList(Array.from({ length: maxPage }))
    }, [maxPage])

    useEffect(() => {
        getUniqueCategories()
    }, [])

    useEffect(() => {
        handleFilter()
    })

    return (
        <div>
            <div>
                <TableContainer className="" component={Paper}>
                    <div className="mt-8 ml-8 italic text-xl font-bold">Các danh mục custom</div>
                    <Table>
                        <colgroup>
                            <col style={{ width: '30%' }} />
                            <col style={{ width: '30%' }} />
                            <col style={{ width: '30%' }} />
                            <col style={{ width: '10%' }} />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên</TableCell>
                                <TableCell>Loại</TableCell>
                                <TableCell>Ảnh</TableCell>
                                <TableCell>Sửa</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell><TextField fullWidth variant="standard" label="Tên" value={newName} onChange={handleNameChange } /></TableCell>
                                <TableCell>
                                    <TextField select fullWidth variant="filled" label="Loại" value={newCategory} onChange={handleCategoryChange}>
                                        <MenuItem value={"All"}>All</MenuItem>
                                        {cateList.map((cate) => (
                                            <MenuItem key={cate} value={cate}>{cate}</MenuItem>
                                        ))}
                                    </TextField>
                                </TableCell>
                                <TableCell><ImageUploader images={images} setImages={setImages} maxNumber={1} /></TableCell>
                                <TableCell><Button variant="contained" onClick={() => uploadToHost(0)}>THÊM MỚI</Button></TableCell>
                            </TableRow>
                            {menuList.map((menu) => (
                                <TableRow key={menu.Id }>
                                    <TableCell>{menu.Name}</TableCell>
                                    <TableCell>{menu.Category}</TableCell>
                                    <TableCell>{menu.Picture ? <img className="w-32 h-32" src={menu.Picture}></img> : ''}</TableCell>
                                    <TableCell>
                                        <EditIcon onClick={() => handleEdit(menu.Id, menu.Name, menu.Category, menu.Picture)} />
                                        <DeleteIcon onClick={() => handleDelete(menu.Id)} />
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
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
            <Popup
                open={openPopup}
                onClose={() => { setOpenPopup(false); resetDefault() }}
                position="right center"
                modal
                closeOnDocumentClick={false}
                closeOnEscape={false}
                contentStyle={{ width: '500px', height: '550px'}}
            >
                {(close) => (
                    <div>
                        <div className="font-bold text-3xl mb-8">CHỈNH SỬA DANH MỤC</div>
                        <div className="flex flex-col gap-8">
                            <TextField  variant="standard" label="Tên" value={newName} onChange={handleNameChange} />
                            <TextField select variant="filled" label="Loại" value={newCategory} onChange={handleCategoryChange}>
                                {cateList.map((cate) => (
                                    <MenuItem key={cate} value={cate}>{cate}</MenuItem>
                                ))}
                            </TextField>
                            <ImageUploader images={images} setImages={setImages} maxNumber={1} />

                        </div>

                        <div className="flex justify-center gap-4 mt-16">
                            <Button variant="outlined" onClick={close }>ĐÓNG</Button>
                            <Button variant="contained" onClick={
                                () => {
                                    if (oldImages != images) {
                                        uploadToHost(1)
                                    } else {
                                        handleUpdate(newUrl)
                                    }
                                    close()
                                }
                            }>LƯU</Button>
                        </div>
                    </div>
                ) }
            </Popup>

        </div>
    )
}
