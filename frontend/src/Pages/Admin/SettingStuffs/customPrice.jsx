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
import axios from 'axios'
import EditIcon from '@mui/icons-material/Edit';

export default function CustomPrice({user }) {
    //Comboboxes
    const [priceList, setPriceList] = useState([])
    const [id, setId] = useState(0)
    const [newPrice, setNewPrice] = useState('')

    const handleNewPriceChange = (event) => {
        setNewPrice(event.target.value)
    }

    const fetchPrice = async () => {
        const hookStyles = await axios.get("http://localhost:3000/custom/pricing")
        if (hookStyles) {
            setPriceList(hookStyles.data)
        }
    }

    const handleEdit = (priceId, price) => {
        setNewPrice(price)
        setId(priceId)
    }

    const handleUpdate = async () => {
        if (!newPrice && !isNaN(newPrice)){
            alert("Vui lòng nhập giá đúng")
            return
        }
        await axios.patch('http://localhost:3000/custom/pricing', {
            id : id,
            price: newPrice
        }, {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        alert("Đã cập nhật giá")
        setNewPrice(0)
        setId(0)
        fetchPrice()
    }


    useEffect(() => {
        fetchPrice()
    })

    return (
        <div>
            <div>
                <TableContainer className="" component={Paper}>
                    <div className="mt-8 ml-8 italic text-xl font-bold">Bảng giá Custom</div>
                    <div className="mt-2 ml-8 italic text-lg">Những tiêu chí này sẽ được áp dụng để tạm tính tiền lồng tùy chỉnh</div>
                    <Table>
                        <colgroup>
                            <col style={{ width: '45%' }} />
                            <col style={{ width: '45%' }} />
                            <col style={{ width: '10%' }} />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Sửa</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {priceList.map((menu) => (
                                <TableRow key={menu.ID }>
                                    <TableCell>{menu.Name}</TableCell>
                                    <TableCell>
                                        {(id == 0 || id != menu.ID) ? (
                                            menu.Price.toLocaleString('vi', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })
                                        ) : (
                                            <TextField variant="standard" onChange={handleNewPriceChange} defaultValue={menu.Price} label="Giá mới"></TextField>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {(id == 0 || id != menu.ID) ? (
                                            <Button onClick={() => { handleEdit(menu.ID, menu.Price) }} ><EditIcon /></Button>
                                        ) : (
                                            <Button onClick={handleUpdate } variant="contained">XONG</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
          
        </div>
    )
}
