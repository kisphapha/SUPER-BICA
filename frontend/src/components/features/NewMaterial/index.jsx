import {
    TextField,
    TableCell, Table,
    TableRow,
} from '@mui/material'
import { React, useState, useEffect } from 'react'
import { Button } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import Popup from 'reactjs-popup'

export default function NewMaterial({setMaterial, materialPopup, setMaterialPop, user, refresh}) {
    const [materials, setMaterials] = useState([])

    //material adding
    const [materialPrice, setMaterialPrice] = useState(0)
    const [materialCate, setMaterialCate] = useState(0)
    const [bigCates, setBigCates] = useState([])
    const [materialName, setMaterialName] = useState('')
    const [materialAllowCustomize, setMaterialAllowCustomize] = useState(true)
    const [materialUnit, setMaterialUnit] = useState('')

    const handleMaterialPriceChange = (event) => {
        setMaterialPrice(event.target.value)
    }
    const handleMaterialNameChange = (event) => {
        setMaterialName(event.target.value)
    }
    const handleMaterialUnitChange = (event) => {
        setMaterialUnit(event.target.value)
    }
    const handleMaterialCategoryChange = (event) => {
        setMaterialCate(event.target.value)
    }
    const handleAllowCustomizeChange = (event) => {
        setMaterialAllowCustomize(event.target.value)
    }
    const handleAddMaterial = async () => {
        try {
            if (materialCate == 0 || !materialName || materialPrice <= 0) {
                alert("Vui lòng nhập thông tin chính xác")
                return
            }
            const response = await axios.post('http://localhost:3000/material', {
                name: materialName,
                cate: materialCate,
                unit: materialUnit,
                customize: materialAllowCustomize,
                price: materialPrice
            }, {
                headers: {
                    Authorization: 'Bearer ' + user.token
                }
            })
            alert("Đã thêm vật liệu")
            if (response.data) {
                refresh()
                setMaterialPop(false)
                setMaterial(response.data[0].ID)
            }
        } catch (e) {
            alert("Có lỗi xảy ra : " + e.message)
        }
    }
    async function fetchMaterial() {
        const response = await axios.get('http://localhost:3000/material/')
        if (response.data) {
            setMaterials(response.data)
        }
        const categories = new Set();

        response.data.forEach((item) => {
            categories.add(item.Category);
        });
        setBigCates(Array.from(categories));
    }
    useEffect(() => {
        fetchMaterial()
    }, [])

    return (
        <Popup
            open={materialPopup}
            onClose={() => { setMaterialPop(false) }}
            position="right center"
            modal
            closeOnDocumentClick={false}
            closeOnEscape={false}
            contentStyle={{ width: '500px', height: '550px' }}
        >
            {(close) => (
                <div>
                    <div className="font-bold text-3xl mb-8">THÊM MỚI VẬT LIỆU</div>
                    <Table>
                        <TableRow>
                            <TableCell>
                                <TextField variant="standard" value={materialName} onChange={handleMaterialNameChange} label="Tên" />
                            </TableCell>
                            <TableCell>
                                <TextField select fullWidth variant="filled" value={materialCate} onChange={handleMaterialCategoryChange}
                                    defaultValue={0} label="Thể loại">
                                    <MenuItem value={0}>Chọn phân loại</MenuItem>
                                    {bigCates.map((cate) => (
                                        <MenuItem key={cate} value={cate}>{cate}</MenuItem>
                                    ))}
                                </TextField>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <TextField variant="standard" value={materialPrice} onChange={handleMaterialPriceChange} label="Giá" />
                            </TableCell>
                            <TableCell>
                                <TextField variant="standard" value={materialUnit} onChange={handleMaterialUnitChange} label="Đơn vị tính" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <TextField fullWidth select variant="filled" value={materialAllowCustomize} onChange={handleAllowCustomizeChange} defaultValue={true} label="Cho phép custom">
                                    <MenuItem value={true}>Có</MenuItem>
                                    <MenuItem value={false}>Không</MenuItem>
                                </TextField>
                            </TableCell>
                        </TableRow>
                    </Table>
                    <div className="flex gap-16 justify-center mt-32">
                        <div><Button variant="contained" onClick={handleAddMaterial}>THÊM MỚI</Button></div>
                        <div><Button variant="outlined" onClick={close}>HỦY BỎ</Button></div>
                    </div>
                </div>
            )}
        </Popup>
    )
}
