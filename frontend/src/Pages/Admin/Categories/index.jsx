import { Radio, TextField } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../../UserContext'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import CategoryNav from '../../../components/features/CategoryNav'
import Popup from 'reactjs-popup'
import ImageUploader from '../../../components/features/ImageUploader/index'

import Axios from 'axios'
import {
    Button,
    ButtonBase,
    FormControl,
    FormControlLabel,
    FormLabel,
    Paper,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'


export default function Categories() {
    const { user } = useContext(UserContext)
    const [categories, setCategories] = useState([])
    const [openPopup, setOpenPopup] = useState(false)
    const [isAdd, setAdd] = useState(false)

    const [selectedCategory, setSelectedCategory] = useState({})
    const [images, setImages] = useState([]);


    //temp varible
    const [tmpName, setTempName] = useState('')
    const [tmpUrl, setTmpUrl] = useState('')
    const [tmpCode, setTmpCode] = useState('')
    const [tmpAllow, setTmpAllow] = useState('')

    useEffect(() => {
        fetchCategories()
    }, [])
    
    async function fetchCategories() {
        const response = await axios.get('http://localhost:3000/category')
        if (response) {
            setCategories(response.data)
        }
    }


    
    function getImageList(images) {
        const imagesFromUrls = images.map((image) => ({
            data_url: image,
        }));
        return (imagesFromUrls);
    }

    async function getCategory(id) {
        const response = await axios.get('http://localhost:3000/category/' + id)
        if (response) {
            setSelectedCategory(response.data[0])
        }
        const img = response.data[0].imageUrl
        setImages(getImageList(img ? [img] : []))
        setOpenPopup(true)

    }
    async function handleDelete(id) {
        try{
            const response = await axios.delete('http://localhost:3000/category/delete/' + id, {
                headers: {
                    Authorization: 'Bearer ' + user.token
                }
            })
            alert("Đã xóa danh mục này")
            fetchCategories()
        } catch {
            alert("Không thể xóa danh mục này")
            fetchCategories()
        }
        
    }

    async function handleClose() {
        setOpenPopup(false)
        setTempName('')
        setTmpAllow('')
        setTmpUrl('')
        setTmpCode('')

    }

    async function handleAdd(url, close) {
        
        try{
            const json = {
                id: tmpCode,
                name: tmpName,
                Allow_Customize: tmpAllow == "Yes" ? true : false,
                imageUrl: url,
                isHide : 0
            }
            console.log(json)
            await axios.post(`http://localhost:3000/category/add`, json, {
                headers: {
                    Authorization: 'Bearer ' + user.token
                }
            })
            alert('Đã thêm Danh mục sản phẩm')
            close()
            handleClose()
            fetchCategories()
        } catch {
            alert("Có lỗi xảy ra khi thêm sản phẩm")
        }  
        
    }



    async function handleUpdate(url, close) {
        const json = {
            Id: tmpCode ? tmpCode : selectedCategory.Id,
            name: tmpName ? tmpName : selectedCategory.Name,
            Allow_Customize: tmpAllow ? (tmpAllow == "Yes" ? true : false) : selectedCategory.Allow_Customize,
            imageUrl: url,
        }
        console.log(json)
        await axios.post(`http://localhost:3000/category/update`, json, {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        alert('Đã cập nhật Danh mục sản phẩm')
        close()
        handleClose()
        fetchCategories()
    }

    async function uploadToHost(close) {
        const API_key = import.meta.env.VITE_IMAGE_API
        const host = "https://api.imgbb.com/1/upload"
        const expiration = 9999999
        const urls = []
        await Promise.all(images.map(async (image) => {
            const response = await axios.postForm(`${host}?expiration=${expiration}&key=${API_key}`, {
                image: image.data_url.substring(image.data_url.indexOf(',') + 1)
            })
            if (response.data) {
                urls.push(response.data.data.url)
            }
        }))
        console.log(urls[0])
        if (isAdd){
            handleAdd(urls[0], close)
        } else {
            handleUpdate(urls[0], close)
        }

    }
    const handleNameChange = (event) => {
        setTempName(event.target.value)
    }
    const  handleCodeChange = (event) => {
        setTmpCode(event.target.value)
    }
    const handleUrlChange = (event) => {
        setTmpUrl(event.target.value)
    }
    const handleAllowChange = (event) => {
        setTmpAllow(event.target.value)
    };

    const status = [
        {
            value: 'False',
            label: 'False'
        },
        {
            value: 'True',
            label: 'True'
        }
    ]
    return (
        <div className="px-2 py-2 w-full  mb-96">
            <div className="flex-col">
                <CategoryNav
                    parents={[
                        { name: 'Trang chủ', link: '/' },
                        { name: 'Bảng điều khiển', link: '/admin' }
                    ]}
                    current="Danh mục sản phẩm"
                    margin={0}
                />
                {/* <Button onClick={() => '/admin/NewProduct'}>New Product</Button> */}
            </div>

            <div className="my-5 text-2xl font-bold">Danh mục sản phẩm</div>
            <Button variant="contained" onClick={() => {
                setAdd(true)
                setImages([])
                setOpenPopup(true)
            }}>
                    THÊM MỚI
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="font-bold">Mã danh mục</TableCell>
                            <TableCell className="">Ảnh</TableCell>
                            <TableCell className="font-bold">Tên danh mục </TableCell>
                            <TableCell className="font-bold ">Được customize</TableCell>
                            <TableCell className="font-bold "></TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="">{category.id}</TableCell>
                                <TableCell className="mr-4">
                                    <img
                                        className="w-12 h-12"
                                        src={
                                            category.imageUrl != null
                                                ? category.imageUrl
                                                : 'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png'
                                        }
                                        alt={category.name}
                                    />
                                </TableCell>
                                <TableCell className="">{category.name}</TableCell>
                                <TableCell className="">{category.Allow_customize ? "Có" : "Không"}</TableCell>
                                <TableCell>
                                    <Button>
                                        <ModeEditIcon fontSize='medium' onClick={() => {
                                            setAdd(false)
                                            getCategory(category.id)
                                        }} />
                                    </Button>
                                    <Popup
                                        trigger={
                                            <Button>
                                                <DeleteIcon fontSize='medium' />
                                            </Button>
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
                                                            handleDelete(category.id)
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

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </TableContainer>
            <Popup
                open={openPopup}
                position="right center"
                modal
                onClose={handleClose}
            >
                {(close) => (
                    <div className=" px-4 ">
                        <div className='text-xl font-bold'>
                            CHỈNH SỬA DANH MỤC SẢN PHẨM
                        </div>
                        <div className="w-1/2">
                            {/* <div>bird suitable</div> */}

                            <TextField
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                label={'Mã'}
                                variant="standard"
                                onChange={handleCodeChange}
                                value={tmpCode || isAdd ? tmpCode : selectedCategory.Id}
                                disabled={!isAdd}
                            />
                        </div>
                        <div className="w-1/2">
                            {/* <div>name</div> */}
                            <TextField
                                fullWidth
                                label={'Tên'}
                                variant="standard"
                                onChange={handleNameChange}
                                value={tmpName || isAdd ? tmpName  : selectedCategory.Name}
                                InputLabelProps={{ shrink: true }}
                            />
                        </div>

                        <div className="my-2">
                            <FormControl>
                                <FormLabel id="status">
                                    <div className="font-bold">Cho phép customize</div>
                                </FormLabel>
                                <RadioGroup
                                    className=""
                                    aria-labelledby="Cho phép customize"
                                    onChange={handleAllowChange}
                                    defaultValue={!isAdd && selectedCategory.Allow_Customize ? "Yes" : "No"}
                                >
                                    <div>
                                        <FormControlLabel value="Yes" control={<Radio />} label="Có" />
                                    </div>
                                    <div>
                                        <FormControlLabel value="No" control={<Radio />} label="Không" />
                                    </div>
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <div>
                            <ImageUploader images={images} setImages={setImages} maxNumber={1} />
                        </div>
                        <div className="my-2 text-right">
                            <Button onClick={() => uploadToHost(close)} className="" variant="contained">
                                XONG
                            </Button>
                            <Button onClick={close} className="" variant="outlined">
                                ĐÓNG
                            </Button>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    )
}
