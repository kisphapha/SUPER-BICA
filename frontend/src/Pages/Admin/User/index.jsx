import {
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import React, { useState, useEffect, useContext } from 'react'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import Popup from 'reactjs-popup'
import { UserContext } from '../../../UserContext'
import CategoryNav from '../../../components/features/CategoryNav'
import { useNavigate } from 'react-router-dom';
export default function Users() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate();

    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [pageList, setPageList] = useState([])

    const [users, setUsers] = useState([])
    const [ban, setBan] = useState()
    const [role, setRole] = useState('')
    const [reason, setReason] = useState()

    const [txtName, setName] = useState('')
    const [txtEmail, setEmail] = useState('')
    const [txtPhone, setPhone] = useState('')
    const [txtDob, setDob] = useState('')
    const [txtUpperPoint, setUpperPoint] = useState('')
    const [txtUpperCreate, setUpperCreate] = useState('')
    const [txtLowerPoint, setLowerPoint] = useState('')
    const [txtRole, setTxtRole] = useState('')
    const [txtStatus, setTxtStatus] = useState('')

    useEffect(() => {
        handleButtonClick('Người dùng', 'User')
    }, [])

    useEffect(() => {
        setPageList(Array.from({ length: maxPage }))
    }, [maxPage])

    useEffect(() => {
        handleFilter()
    })

    const updateUser = async (userId) => {
        const json = {
            userId: userId,
            role: role,
            status: ban,
            ReasonBlock: reason
        }
        if (userId != user.Id) {
            const response = await axios.post(`http://localhost:3000/admin/updateUser`, json, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.loginedUser
                }
            })
            setUsers(response.data)
            alert('Đã cập nhật người dùng')
        } else {
            alert('Bạn không thể thao tác với tài khoản của mình')
        }
    }

    const fetchUserInfo = async (email) => {
        const response = await axios.get(`http://localhost:3000/users/${email}`)
        if (response.data) {
            //if (hack == 1) hackAcc(response.data)
            return (response.data)
        }
    }

    //const hackAcc = async (obj) => {
    //    await axios.post(`http://localhost:3000/users/logout`, {
    //        id: user.Id
    //    }, {
    //        headers: {
    //            Authorization: 'Bearer ' + sessionStorage.loginedUser
    //        }
    //    })
    //    const json = {
    //        email: obj.Email,
    //        secretKey: "a"
    //    }
    //    console.log(json)
    //    const response = await axios.post('http://localhost:3000/users/login', json)
    //    sessionStorage.setItem("loginedUser", JSON.stringify(response.data))
    //    navigate('/')
    //    window.location.reload()
    //}

    const handleSwitchPage = (page) => {
        setPage(page)
    }



    const handleRole = (event) => {
        setRole(event.target.value)
        setPage(1)
    }
    const handleStatus = (event) => {
        setBan(event.target.value)
        setPage(1)
    }
    const handleReasoon = (event) => {
        setReason(event.target.value)
        setPage(1)
    }
    const handleNameChange = (event) => {
        setName(event.target.value)
        setPage(1)
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
        setPage(1)
    }

    const handlePhoneChange = (event) => {
        setPhone(event.target.value)
        setPage(1)
    }

    const handleDobChange = (event) => {
        setDob(event.target.value)
        setPage(1)
    }

    const handleUpperPointChange = (event) => {
        setUpperPoint(event.target.value)
        setPage(1)
    }

    const handleUpperCreateChange = (event) => {
        setUpperCreate(event.target.value)
        setPage(1)
    }

    const handleLowerPointChange = (event) => {
        setLowerPoint(event.target.value)
        setPage(1)
    }

    const handleRoleChange = (role) => {
        setTxtRole(role)
        setPage(1)
    }

    const handleStatusChange = (event) => {
        setTxtStatus(event.target.value)
        setPage(1)
    }

    const handleChange = (status, reason, role) => {
        setBan(status)
        setReason(reason)
        setRole(role)
    }

    const handleOk = (userid, close) => {
        updateUser(userid)
        setReason()
        close()
        handleFilter()
    }

    const handleFilter = async () => {
        const json = {
            name: txtName,
            email: txtEmail,
            phone: txtPhone,
            dob: txtDob,
            role: txtRole,
            upper_point: txtUpperPoint,
            lower_point: txtLowerPoint,
            create: txtUpperCreate,
            status: txtStatus,
            page: page
        }
        axios
            .post('http://localhost:3000/users/filter/', json, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.loginedUser
                }
            })
            .then((response) => {
                setUsers(response.data.data)
                setMaxPage(Math.ceil(response.data.lines.Count / 10))
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }

    const status = [
        {
            value: 'All',
            label: 'All'
        },
        {
            value: 'Active',
            label: 'Active'
        },
        {
            value: 'Inactive',
            label: 'Inactive'
        }
    ]
    const roles = [
        {
            value: 'Admin',
            label: 'Admin'
        },
        {
            value: 'Staff',
            label: 'Nhân viên'
        },
        {
            value: 'User',
            label: 'Người dùng'
        }
    ]

    ///active button
    const [activeButton, setActiveButton] = useState(null)

    const handleButtonClick = (buttonName, role) => {
        setActiveButton(buttonName)
        handleRoleChange(role)
    }

    return (
        <div className="px-2 py-2 w-full  mb-96">
            <div className="flex-col">
                <CategoryNav
                    parents={[
                        { name: 'Trang chủ', link: '/' },
                        { name: 'Bảng điều khiển', link: '/admin' }
                    ]}
                    current="Người dùng"
                    margin={0}
                />
                <div className="my-5 text-2xl font-bold">Danh sách người dùng</div>
                {/* <Button onClick={() => '/admin/NewProduct'}>New Product</Button> */}
            </div>
            <div className="flex align-bottom ">
                {/* <div className="mx-2 ">Lồng</div> */}
                <div className="flex">
                    {roles.map((role, index) => (
                        <div key={index}>
                            <button
                                className={`p-2 rounded-t-lg ${activeButton === role.label ? 'bg-white' : 'bg-slate-300'}`}
                                onClick={() => handleButtonClick(role.label, role.value)}
                            >
                                {role.label}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <colgroup>
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '10%' }} />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <div className="font-bold text-lg"></div>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold text-lg">Tên</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold text-lg">Email</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold text-lg">SĐT </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold text-lg">Ngày sinh </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold text-lg">Điểm số </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold text-lg ">Ngày tạo </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold text-lg">Trạng thái</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold text-lg">Tổng tiền đã mua</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold text-lg"> Sửa</div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>
                                <TextField className="" id="outlined-basic" placeholder="Full Name " variant="standard" onChange={handleNameChange} />
                            </TableCell>
                            <TableCell>
                                <TextField className="" id="outlined-basic" placeholder="Email" variant="standard" onChange={handleEmailChange} />
                            </TableCell>

                            <TableCell>
                                <TextField className="" id="outlined-basic" placeholder="Phone" variant="standard" onChange={handlePhoneChange} />
                            </TableCell>
                            <TableCell>
                                <TextField className="" id="outlined-basic" placeholder="DateOfBirth" variant="standard" onChange={handleDobChange} />
                            </TableCell>
                            <TableCell>
                                <TextField className="w-16" id="outlined-basic" label="From" variant="standard" onChange={handleLowerPointChange} />
                                <TextField className="w-16" id="outlined-basic" label="To" variant="standard" onChange={handleUpperPointChange} />
                            </TableCell>

                            <TableCell>
                                <TextField
                                    className="w-16"
                                    id="outlined-basic"
                                    placeholder="Ngày tạo"
                                    variant="standard"
                                    onChange={handleUpperCreateChange}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    className="text-left"
                                    fullWidth
                                    select
                                    placeholder="Status"
                                    variant="filled"
                                    defaultValue="All"
                                    onChange={handleStatusChange}
                                >
                                    {status.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </TableCell>
                            <TableCell> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users &&
                            users.map((_user) => (
                                <>
                                    <TableRow>
                                        <TableCell>
                                            <img className="w-16 h-16" src={_user.Picture} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="">
                                                <div className="text-lg">{_user.Name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="truncate text-lg">{_user.Email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-lg">{_user.PhoneNumber}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-lg">{_user.DateOfBirth ? _user.DateOfBirth.substr(0, 10) : ''}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-lg">{_user.Point}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-lg">{_user.CreatedAt ? _user.CreatedAt.substr(0, 10) : ''} </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-lg">{_user.Status == 'Active' ? 'Hoạt động' : 'Không hoạt động'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-lg font-bold">{_user.Spent ? _user.Spent.toLocaleString('vi', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }) : ''}</div>
                                        </TableCell>
                                        {user && user.Role == 'Admin' && (
                                            <TableCell>
                                                <div className="text-right mr-2">
                                                    <Popup
                                                        trigger={
                                                            <button>
                                                                <SettingsIcon fontSize="large" />
                                                            </button>
                                                        }
                                                        position="right center"
                                                        closeOnDocumentClick={false}
                                                        closeOnEscape={false}
                                                        modal
                                                        onOpen={() => handleChange(_user.Status, _user.ReasonBlocked, _user.Role)}
                                                    >
                                                        {(close) => (
                                                            <div className="p-4">
                                                                <div className="text-xl font-bold mb-8 mt-8">CẬP NHẬT VAI TRÒ</div>
                                                                <div>
                                                                    <TextField
                                                                        className="text-left w-1/2"
                                                                        select
                                                                        label="Vai trò"
                                                                        variant="filled"
                                                                        defaultValue={_user.Role}
                                                                        onChange={handleRole}
                                                                    >
                                                                        {roles.map((role) => (
                                                                            <MenuItem key={role.value} value={role.value}>
                                                                                {role.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </TextField>
                                                                </div>
                                                                <hr />

                                                                <div className="text-xl font-bold mb-8 mt-8">CẬP NHẬT TRẠNG THÁI</div>
                                                                <div>
                                                                    <TextField
                                                                        className="text-left w-1/2"
                                                                        select
                                                                        placeholder="Trạng thái"
                                                                        variant="filled"
                                                                        defaultValue={_user.Status}
                                                                        onChange={handleStatus}
                                                                    >
                                                                        <MenuItem value="Active">Active</MenuItem>
                                                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                                                    </TextField>
                                                                </div>
                                                                {ban == 'Inactive' && (
                                                                    <div>
                                                                        <TextField
                                                                            className="text-left"
                                                                            fullWidth
                                                                            variant="standard"
                                                                            placeholder="Lí do vô hiệu hóa tài khoản này"
                                                                            multiline
                                                                            rows={6}
                                                                            onChange={handleReasoon}
                                                                            defaultValue={reason}
                                                                        ></TextField>
                                                                    </div>
                                                                )}
                                                                {/*<div className="m-8">*/}
                                                                {/*    <Button variant="contained" onClick={async() => { hackAcc(await fetchUserInfo(_user.Email)) }}>Truy cập tài khoản này</Button>*/}
                                                                {/*</div>*/}
                                                                <div className="flex justify-end">
                                                                    <Button variant="outlined" onClick={close}>
                                                                        Cancel
                                                                    </Button>
                                                                    <Button variant="outlined" onClick={() => handleOk(_user.Id, close)}>
                                                                        OK
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Popup>
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                </>
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
