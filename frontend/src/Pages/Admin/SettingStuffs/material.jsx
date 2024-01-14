import {
    Button,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TextField,
    MenuItem
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Materials({ user }) {
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [pageList, setPageList] = useState([])
    //Comboboxes
    const [materialList, setMaterialList] = useState([])
    const [id, setId] = useState(0)
    const [newPrice, setNewPrice] = useState(0)
    const [newCategory, setNewCategory] = useState(0)
    const [bigCates, setBigCates] = useState([])
    const [newName, setName] = useState('')
    const [allowCustomize, setAllowCustomize] = useState(-1)
    const [newUnit, setUnit] = useState('')

    const handleNewPriceChange = (event) => {
        setNewPrice(event.target.value)
    }
    const handleNewNameChange = (event) => {
        setName(event.target.value)
    }
    const handleNewUnitChange = (event) => {
        setUnit(event.target.value)
    }
    const handleCategoryChange = (event) => {
        setNewCategory(event.target.value)
    }
    const handleAllowCustomizeChange = (event) => {
        setAllowCustomize(event.target.value)
    }

    const fetchPrice = async () => {
        const hookStyles = await axios.get("http://localhost:3000/material")
        if (hookStyles) {
            getUniqueCategories(hookStyles.data)
        }
    }
    function getUniqueCategories(array) {
        const categories = new Set();

        array.forEach((item) => {
            categories.add(item.Category);
        });
        setBigCates(Array.from(categories));

    }

    const handleSwitchPage = (page) => {
        setPage(page)
    }

    const resetDefault = () => {
        setId(0)
        setNewPrice('')
        setName('')
        setUnit('')
        setNewCategory(0)
        setAllowCustomize(-1)
    }

    const handleFilter = async () => {
        if (id == 0) {
            const json = {
                name: newName,
                cate: newCategory,
                unit: newUnit,
                customize: allowCustomize,
                page: page
            }
            axios.post('http://localhost:3000/material/filter/', json)
                .then((response) => {
                    setMaterialList(response.data.data)
                    setMaxPage(Math.ceil(response.data.lines.Count / 10))
                })
                .catch((error) => {
                    console.error('Error fetching data:', error)
                })
        }
       
    }

    const handleEdit = (materialId,name, price,unit,category) => {
        setNewPrice(price)
        setName(name)
        setUnit(unit)
        setNewCategory(category)
        setId(materialId)
    }
    const handleAdd = async () => {
        try {
            if (newCategory == 0 || allowCustomize == -1 || !newName || newPrice <= 0) {
                alert("Vui lòng nhập thông tin chính xác")
                return
            }
            await axios.post('http://localhost:3000/material', {
                name: newName,
                cate: newCategory,
                unit: newUnit,
                customize: allowCustomize,
                price: newPrice
            }, {
                headers: {
                    Authorization: 'Bearer ' + user.token
                }
            })
            alert("Đã thêm vật liệu")
            resetDefault()
            handleFilter()
        } catch (e) {
            alert("Có lỗi xảy ra : " + e.message)
        }
    }
    const handleUpdate = async () => {
        try {
            await axios.patch('http://localhost:3000/material', {
                id: id,
                name: newName,
                cate: newCategory,
                unit: newUnit,
                customize: allowCustomize,
                price: newPrice
            }, {
                headers: {
                    Authorization: 'Bearer ' + user.token
                }
            })
            alert("Đã cập nhật vật liệu")
            resetDefault()
            handleFilter()
        } catch (e) {
            alert("Có lỗi xảy ra : " + e.message)
        }
    }
    const handleDelete = async (material) => {
        try {
            const confirm = window.confirm("Bạn có chắc chắn muốn xóa vật liệu này không?")
            if (confirm) {
                await axios.delete('http://localhost:3000/material/'+material, {
                    headers: {
                        Authorization: 'Bearer ' + user.token
                    }
                })
                alert("Đã xóa vật liệu")
                resetDefault()
                handleFilter()
            }
        } catch (e) {
            alert("Có lỗi xảy ra : " + e.message)
        }
    }

    useEffect(() => {
        handleFilter();
        fetchPrice()
    })
    useEffect(() => {
        setPageList(Array.from({ length: maxPage }))
    }, [maxPage])

    return (
        <div>
            <div>
                <TableContainer className="" component={Paper}>
                    <div className="mt-8 ml-8 italic text-xl font-bold">Bảng vật liệu</div>
                    <div className="mt-2 ml-8 italic text-lg">Những tiêu chí này sẽ được áp dụng để tạm tính tiền lồng tùy chỉnh</div>
                    <Table>
                        <colgroup>
                            <col style={{ width: '19%' }} />
                            <col style={{ width: '19%' }} />
                            <col style={{ width: '19%' }} />
                            <col style={{ width: '19%' }} />
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '12%' }} />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên</TableCell>
                                <TableCell>Loại</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Đơn vị tính</TableCell>
                                <TableCell>Cho phép custom</TableCell>
                                <TableCell>Sửa</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <TextField variant="standard" value={newName} onChange={handleNewNameChange} label="Tên" />
                                </TableCell>
                                <TableCell>
                                    <TextField select fullWidth variant="filled" value={newCategory}  onChange={handleCategoryChange}
                                        defaultValue={0} label="Thể loại">
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {bigCates.map((cate) => (
                                            <MenuItem key={cate} value={cate}>{cate}</MenuItem>
                                        ))}
                                    </TextField>        
                                </TableCell>
                                <TableCell>
                                    <TextField variant="standard" value={newPrice} onChange={handleNewPriceChange} label="Giá" />
                                </TableCell>
                                <TableCell>
                                    <TextField variant="standard" value={newUnit} onChange={handleNewUnitChange} label="Đơn vị tính" />
                                </TableCell>
                                <TableCell>
                                    <TextField fullWidth select variant="filled" value={allowCustomize} onChange={handleAllowCustomizeChange} defaultValue={-1} label="Cho phép custom">
                                        <MenuItem value={-1}>Tất cả</MenuItem>
                                        <MenuItem value={true}>Có</MenuItem>
                                        <MenuItem value={false}>Không</MenuItem>
                                    </TextField>
                                </TableCell>
                                <TableCell><Button variant="contained" onClick={handleAdd}>THÊM MỚI</Button></TableCell>
                            </TableRow>
                            {materialList.map((menu) => (
                                <TableRow key={menu.ID }>
                                    <TableCell>
                                        {(id == 0 || id != menu.ID) ? (
                                             menu.Name
                                        ) : (
                                            <TextField variant="standard" onChange={handleNewNameChange} defaultValue={menu.Name} label="Tên mới"></TextField>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {(id == 0 || id != menu.ID) ? (                                          
                                            menu.Category
                                        ) : (                                          
                                            <TextField select fullWidth variant="filled" onChange={handleCategoryChange}
                                                defaultValue={menu.Category} label="Thể loại">
                                                {bigCates.map((cate) => (
                                                    <MenuItem key={cate} value={cate}>{cate}</MenuItem>
                                                ))}
                                            </TextField>                                                                               
                                        )}
                                    </TableCell>
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
                                            menu.Unit
                                        ) : (
                                            <TextField variant="standard" onChange={handleNewUnitChange} defaultValue={menu.Unit} label="Đơn vị tính"></TextField>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {(id == 0 || id != menu.ID) ? (
                                            menu.Allow_customize ? "Có" : "Không"
                                        ) : (
                                            <TextField fullWidth select variant="filled" onChange={handleAllowCustomizeChange} defaultValue={menu.Allow_customize} label="Cho phép custom">
                                                <MenuItem value={true}>Có</MenuItem>
                                                <MenuItem value={false}>Không</MenuItem>
                                            </TextField>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {(id == 0 || id != menu.ID) ? (
                                            <>
                                                <Button onClick={() => { handleEdit(menu.ID, menu.Name, menu.Price, menu.Unit, menu.Category) }} ><EditIcon /></Button>
                                                <Button onClick={() => { handleDelete(menu.ID) }} ><DeleteIcon /></Button>
                                            </>
                                        ) : (
                                             <div className="flex gap-4">
                                                <Button onClick={handleUpdate} variant="contained">XONG</Button>
                                                <Button onClick={resetDefault} variant="outlined">HỦY</Button>
                                            </div>
                                        )}
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
        </div>
    )
}
