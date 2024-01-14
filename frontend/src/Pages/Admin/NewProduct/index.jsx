import {
    ButtonBase, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField,
} from '@mui/material'
import { React, useState, useEffect, useContext } from 'react'
import { Button } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import ImageUploader from '../../../components/features/ImageUploader/index'
import CategoryNav from '../../../components/features/CategoryNav'
import NewMaterial from '../../../components/features/NewMaterial'
import { UserContext } from '../../../UserContext'

export default function NewProduct() {
    const { user } = useContext(UserContext)
    const [materials, setMaterials] = useState([])
    const [categories, setCategories] = useState([])
    const [images, setImages] = useState([])
    const maxNumber = 6

    //temp varible
    const [tmpName, setTempName] = useState('')
    const [tmpDescription, setTempDescription] = useState('')
    const [tmpPrice, setTempPrice] = useState(0)
    const [tmpBird, setTempBird] = useState('')
    const [tmpMaterial, setMaterial] = useState('')
    const [tmpDiscount, setDiscount] = useState('')
    const [tmpStock, setStock] = useState('')
    const [tmpHeight, setHeight] = useState('')
    const [tmpWidth, setWidth] = useState('')
    const [tmpCate, setCate] = useState('')
    const [tmpStatus, setStatus] = useState("Enable")

    const [materialPopup, setMaterialPop] = useState(false)
    async function uploadToHost() {
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

        console.log(urls)
        handleAdd(urls)
    }

    async function fetchCategories() {
        const response = await axios.get('http://localhost:3000/category/')
        if (response.data) {
            setCategories(response.data)
        }
    }
    async function fetchMaterial() {
        const response = await axios.get('http://localhost:3000/material/')
        if (response.data) {
            setMaterials(response.data)
        }
    }

    async function handleAdd(urls) {
        const _size = tmpWidth + ',' + tmpHeight
        if (!tmpDiscount) setDiscount(0)
        const json = {
            Name: tmpName,
            Category: tmpCate,
            material: tmpMaterial,
            Description: tmpDescription,
            Price: tmpPrice,
            Stock: tmpStock,
            Size: _size,
            SuitableBird: tmpBird,
            discount: tmpDiscount,
            Status: tmpStatus,
            Urls: urls
        }

        if (json.Stock && json.Name && json.Category && json.Price && json.Status && json.material && json.material != 9999) {
            await axios.post(`http://localhost:3000/products/add`, json, {
                headers: {
                    Authorization: 'Bearer ' + user.token
                }
            })
            alert('Đã thêm sản phẩm')
            window.location.reload()
        } else {
            alert('Vui lòng điền đủ thông tin')
        }
    }

    const handleNameChange = (event) => {
        setTempName(event.target.value)
    }
    const handleBirdChange = (event) => {
        setTempBird(event.target.value)
    }
    const handlePriceChange = (event) => {
        setTempPrice(event.target.value)
    }
    const handleDescriptionChange = (event) => {
        setTempDescription(event.target.value)
    }
    const handleMaterialChange = (event) => {
        setMaterial(event.target.value)
        if (event.target.value == 9999) {
            setMaterialPop(true)
        }
    }
    const handleStockChange = (event) => {
        setStock(event.target.value)
    }
    const handleDiscountChange = (event) => {
        setDiscount(event.target.value)
    }
    const handleHeightChange = (event) => {
        setHeight(event.target.value)
    }
    const handleWidthChange = (event) => {
        setWidth(event.target.value)
    }
    const handleCategoryChange = (event) => {
        setCate(event.target.value.trim())
    }
    const handleStatusChange = (event) => {
        setStatus(event.target.value)
    }

    useEffect(() => {
        fetchCategories()
        fetchMaterial()
    }, [])

    return (
        <form action="" className="w-full mb-96">
            <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }, { name: 'Bảng điều khiển', link: '/admin' }]}
                current="Thêm sản phẩm"
                margin={0}
            />
            <div className="text-xl font-bold mt-8 flex justify-center">Thêm mới sản phẩm </div>
            <div className="flex mx-60 my-2 gap-4">
                <div className="px-4 flex flex-col basis-1/2 items-center gap-4 py-10 justify-start bg-white    rounded-lg  mx-2">
                    <div className="w-3/4">
                        {/* <div>name</div> */}
                        <TextField fullWidth label={'Tên sản phẩm'} variant="standard" onChange={handleNameChange} value={tmpName} />
                    </div>
                    <div className="w-3/4">
                        {/* <div>material</div> */}
                        <TextField fullWidth select label="Phân loại" helperText="Chọn phân Loại" variant="filled" onChange={handleCategoryChange}>
                            {categories.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className="w-3/4">
                        {/* <div>material</div> */}
                        <TextField fullWidth select label="Vật liệu" helperText="Chọn vật liệu" variant="filled" onChange={handleMaterialChange} value={tmpMaterial}>
                            <MenuItem value={9999}>Vật liệu khác....</MenuItem>
                            {materials.map((option) => (
                                <MenuItem key={option.ID} value={option.ID}>
                                    {option.Name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    {tmpCate != 'PK' && (
                        <>
                            <div className="w-3/4">
                                {/* <div>bird suitable</div> */}

                                <TextField fullWidth label={'Loại chim'} variant="standard" onChange={handleBirdChange} value={tmpBird} />
                            </div>
                        </>
                    )}
                    <div className="w-3/4">
                        {/* <div>price</div> */}
                        <TextField fullWidth label={'Giá'} variant="standard" onChange={handlePriceChange} value={tmpPrice} />
                    </div>
                    <div className="w-3/4">
                        {/* <div>discount</div> */}
                        <TextField fullWidth label={'Discount'} variant="standard" onChange={handleDiscountChange} value={tmpDiscount} />{' '}
                    </div>
                    <div className="w-3/4">
                        {/* <div>description</div> */}
                        <TextField
                            fullWidth
                            label={'Mô tả'}
                            variant="standard"
                            onChange={handleDescriptionChange}
                            value={tmpDescription}
                            multiline
                            rows={6}
                        />
                    </div>
                    <div className="w-3/4">
                        {/* <div>description</div> */}
                        {/*<TextField*/}
                        {/*    fullWidth*/}
                        {/*    label={'Link ảnh'}*/}
                        {/*    variant="standard"*/}
                        {/*    onChange={handleUrlChange}*/}
                        {/*    value={tmpUrl }*/}
                        {/*/>*/}
                    </div>
                </div>
                <div className="px-4 pl-40 flex flex-col basis-1/2 items-start gap-4 py-10 bg-white rounded-lg mx-2">
                    <div>Hình ảnh </div>
                    <ImageUploader images={images} setImages={setImages} maxNumber={maxNumber} />
                    <div>
                        {tmpCate != 'PK' && (
                            <>
                                <div>Size </div>
                                <div className="flex-col my-2">
                                    <div className="">
                                        {/* <div>height</div> */}
                                        <div>
                                            <TextField fullWidth label={'Dài'} variant="standard" onChange={handleWidthChange} value={tmpWidth} />
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        {/* <div>width</div> */}
                                        <div>
                                            <TextField fullWidth label={'Cao'} variant="standard" onChange={handleHeightChange} value={tmpHeight} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="mt-12">
                            <FormControl>
                                <FormLabel id="status">Trạng thái</FormLabel>
                                <RadioGroup aria-labelledby="Trạng thái" defaultValue="Enable" onChange={handleStatusChange}>
                                    <FormControlLabel value="Enable" control={<Radio />} label="Enable" onClick={() => setStatus('Enable')} />
                                    <FormControlLabel value="Disable" control={<Radio />} label="Disable" onClick={() => setStatus('Disable')} />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>

                    <div>
                        <div className="mt-12">
                            <TextField fullWidth label={'Tồn kho'} variant="standard" onChange={handleStockChange} value={tmpStock} />
                        </div>
                    </div>
                    <Button
                        variant="contained"
                        onClick={() => {
                            uploadToHost()
                        }}
                    >
                        {' '}
                        update
                    </Button>
                </div>
            </div>
            <NewMaterial user={user} setMaterial={setMaterial} setMaterialPop={setMaterialPop} materialPopup={materialPopup} refresh={fetchMaterial} />
        </form>
    )
}
