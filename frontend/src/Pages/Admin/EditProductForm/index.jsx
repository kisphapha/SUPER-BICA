import { ButtonBase, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import { React, useState, useEffect } from 'react'
import { Button } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import ImageUploader from '../../../components/features/ImageUploader/index'
import NewMaterial from '../../../components/features/NewMaterial'

export default function EditProductForm({ productId, close, handleFilter, user }) {
    const [categories, setCategories] = useState([])
    const [materials, setMaterials] = useState([])
    const [product, setProduct] = useState('')
    const [images, setImages] = useState([]);

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
    const [tmpUrls, setUrls] = useState([])
    const [tmpCate, setCate] = useState('')
    const [tmpStatus, setStatus] = useState('')

    const [materialPopup, setMaterialPop] = useState(false)

    async function fetchMaterial() {
        const response = await axios.get('http://localhost:3000/material/')
        if (response.data) {
            setMaterials(response.data)
        }
    }
    async function fetchCategories() {
        const response = await axios.get('http://localhost:3000/category/')
        if (response.data) {
            setCategories(response.data)
        }
    }
    async function fetchMaterials() {
        const response = await axios.get('http://localhost:3000/material/')
        if (response.data) {
            setMaterials(response.data)
        }
    }

    function getImageList(images) {
        const imagesFromUrls = images.map((image) => ({
            data_url: image.Url,
        }));
        return (imagesFromUrls);
    }


    async function fetchImage(id) {
        const response = await axios.get('http://localhost:3000/products/img/' + id)
        if (response.data) {
            setUrls(response.data);
        }
        setImages(getImageList(response.data))
    }

    async function fetchProductDetails(id) {
        const response = await axios.get('http://localhost:3000/products/' + id)
        if (response.data) {
            setProduct(response.data)
        }
        fetchImage(id);
    }
    async function uploadToHost() {
        const API_key = import.meta.env.VITE_IMAGE_API
        const host = "https://api.imgbb.com/1/upload"
        const expiration = 1800000
        const urls = []
        await Promise.all(images.map(async (image) => {
            const response = await axios.postForm(`${host}?expiration=${expiration}&key=${API_key}`, {
                image: image.data_url.substring(image.data_url.indexOf(',') + 1)
            })
            if (response.data) {
                urls.push(response.data.data.url)
            }
        }))
        console.log(urls)
        handleUpdate(urls)
    }

    async function handleUpdate(urls) {
        const _cate = (tmpCate ? tmpCate : product.Category).trim()
        const _size =
            _cate != 'PK' ? (tmpWidth ? tmpWidth : product.Size.split(',')[0]) + ',' + (tmpHeight ? tmpHeight : product.Size.split(',')[1]) : ''
        if (!tmpDiscount) setDiscount(0)
        const json = {
            Id: product.Id,
            Name: tmpName ? tmpName : product.Name,
            Category: _cate,
            material: tmpMaterial ? tmpMaterial : product.material,
            Description: tmpDescription ? tmpDescription : product.Description,
            Price: tmpPrice ? tmpPrice : product.Price,
            Stock: tmpStock ? tmpStock : product.Stock,
            Size: _size,
            SuitableBird: _cate != 'PK' ? (tmpBird ? tmpBird : product.SuitableBird) : '',
            discount: tmpDiscount ? tmpDiscount : product.discount,
            Status: tmpStatus ? tmpStatus : product.Status,
            Url: urls
        }
        console.log(json)
        await axios.post(`http://localhost:3000/products/update`, json, {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        alert('Product updated')
        close()
        handleFilter()
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
        setCate(event.target.value)
    }
    const handleStatusChange = (event) => {
        setStatus(event.target.value)
    }

    useEffect(() => {
        fetchCategories()
        fetchMaterials()
        fetchProductDetails(productId)
    }, [productId])

    return (
        <form action="" className="w-full ">
            {/* <div className="m-4 font-bold text-lg">Chỉnh sửa sản phẩm </div> */}
            {product != '' && (
                <div className=" px-4 ">
                    <div className="">
                        {/* <div>name</div> */}
                        <TextField
                            fullWidth
                            label={'Name'}
                            variant="standard"
                            onChange={handleNameChange}
                            value={tmpName ? tmpName : product.Name}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>
                    <div className="flex place-content-around">
                        <div className="w-1/2 my-2  ">
                            <div className="">
                                {/* <div>material</div> */}
                                <TextField
                                    fullWidth
                                    select
                                    label="Phân loại"
                                    helperText="Chọn phân loại"
                                    variant="filled"
                                    onChange={handleCategoryChange}
                                    value={tmpCate ? tmpCate : product.Category}
                                >
                                    {categories.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div className="">
                                {/* <div>material</div> */}
                                <TextField
                                    fullWidth
                                    select
                                    label="Vật liệu"
                                    helperText="Chọn vật liệu"
                                    variant="filled"
                                    onChange={handleMaterialChange}
                                    value={tmpMaterial ? tmpMaterial : product.materialId}
                                >
                                    <MenuItem value={9999}>Vật liệu khác....</MenuItem>
                                    {materials.map((option) => (
                                        <MenuItem key={option.ID} value={option.ID}>
                                            {option.Name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            {(tmpCate ? tmpCate.trim() : product.Category.trim()) != 'PK' && (
                                <>
                                    <div className="">
                                        {/* <div>bird suitable</div> */}

                                        <TextField
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            label={'Bird Suitable'}
                                            variant="standard"
                                            onChange={handleBirdChange}
                                            value={tmpBird ? tmpBird : product.SuitableBird}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="">
                                {/* <div>price</div> */}
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    label={' Price'}
                                    variant="standard"
                                    onChange={handlePriceChange}
                                    value={tmpPrice ? tmpPrice : product.Price}
                                />
                            </div>
                            <div className="">
                                {/* <div>discount</div> */}
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    label={'Discount'}
                                    variant="standard"
                                    onChange={handleDiscountChange}
                                    value={tmpDiscount ? tmpDiscount : product.discount}
                                />
                            </div>
                            <div className="">
                                {/* <div>description</div> */}
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    label={'Description'}
                                    variant="standard"
                                    multiline
                                    rows={6}
                                    onChange={handleDescriptionChange}
                                    value={tmpDescription ? tmpDescription : product.Description}
                                />
                            </div>
                            
                        </div>
                        <div className="w-1/2 my-2  ml-4">
                            <div className=" flex gap-8 ">
                                {(tmpCate ? tmpCate.trim() : product.Category.trim()) != 'PK' && (
                                    <div className="">
                                        <div className="my-2">Kích thước</div>
                                        <div className="flex gap-4">
                                            <div className="w-12 ">
                                                {/* <div>height</div> */}
                                                <div>
                                                    <TextField
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        label={'Height'}
                                                        variant="standard"
                                                        onChange={handleHeightChange}
                                                        value={tmpHeight ? tmpHeight : product.Size ? product.Size.split(',')[1] : ''}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-12 ">
                                                {/* <div>width</div> */}
                                                <div>
                                                    <TextField
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        label={'Width'}
                                                        variant="standard"
                                                        onChange={handleWidthChange}
                                                        value={tmpWidth ? tmpHeight : product.Size ? product.Size.split(',')[0] : ''}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="w-20 my-2">
                                    <div>Số Lượng</div>
                                    <TextField
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        label={''}
                                        variant="standard"
                                        onChange={handleStockChange}
                                        value={tmpStock ? tmpStock : product.Stock}
                                    />
                                </div>
                                <div className="my-2">
                                    <FormControl>
                                        <FormLabel id="status">
                                            <div className="font-bold">Status</div>
                                        </FormLabel>
                                        <RadioGroup
                                            className=""
                                            aria-labelledby="status"
                                            onChange={handleStatusChange}
                                            defaultValue={product.Status == 'Enable' ? 'Enable' : 'Disable'}
                                        >
                                            <div>
                                                <FormControlLabel value="Enable" control={<Radio />} label="Enable" />
                                            </div>
                                            <div>
                                                <FormControlLabel value="Disable" control={<Radio />} label="Disable" />
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </div>
                            <div>
                                    <ImageUploader images={images} setImages={setImages} maxNumber={6} />

                            </div>
                        </div>
                    </div>

                   
                    
                    
                    <div className="my-2 text-right">
                        <Button onClick={uploadToHost} className="py-full" variant="contained">
                            update
                        </Button>
                    </div>
                </div>
            )}
            <NewMaterial user={user} setMaterial={setMaterial} setMaterialPop={setMaterialPop} materialPopup={materialPopup} refresh={fetchMaterial} />
        </form>
    )
}
