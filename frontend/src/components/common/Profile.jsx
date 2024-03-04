/* eslint-disable react/no-unescaped-entities */
import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../UserContext'
import { Button, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import './Profile.css'
import axios from 'axios'

const Profile = (props) => {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [checkValidation, setCheckValidation] = useState(true)
    const [checkNumChar, setCheckNumChar] = useState(true)
    const [dob, setDob] = useState('')

    const [tempName, setTempName] = useState('')
    const [tempPhone, setTempPhone] = useState('')
    const [tempDob, setTempDob] = useState('')

    useEffect(() => {
        if (props.user) {
            setName(props.user.Name)
            setPhoneNumber(props.user.PhoneNumber)
            if (props.user.DateOfBirth) {
                setDob(props.user.DateOfBirth.substr(0, 10))
            }
        }
    }, [props.user])

    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const checkPattern = (inputValue, pattern) => {
        const regex = new RegExp(pattern)
        return regex.test(inputValue)
    }

    const handleKeyDown = (event) => {
        const forbiddenKeys = ['e', '+', '-', '.'];

        if (forbiddenKeys.includes(event.key)) {
            event.preventDefault();
        }

        // Prevent input when the length is 11 and the key pressed is not delete, backspace, or arrow keys.
        if (event.target.value.length >= 11 && !['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
    }

    const handleNameKeyDown = (event) => {
        const forbiddenKeys = ['@', '+', '-', '.', '!', '#', '$', '%', '&', '^', '*', ',', '\'', '\"', '`','~'];
    
        // Prevent the characters "e", "+", and "-" from being entered.
        if (forbiddenKeys.includes(event.key) && !['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(event.key) || /\d/.test(event.key)) {
          event.preventDefault();
        }
    
      };

    const handlePhoneNumberChange = (event) => {
        let inputPhoneNumber = event.target.value


        // Regular expression pattern for a valid phone number. You can adjust it as needed.
        const phonePattern =
            '(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}'

        if (!checkPattern(inputPhoneNumber, phonePattern)) {
            setCheckValidation(false)
        } else {
            setCheckValidation(true)
            if (inputPhoneNumber.length > 9 && inputPhoneNumber.length <= 11) {
                setCheckNumChar(true)
            } else {
                setCheckNumChar(false)
            }
        }
        setPhoneNumber(event.target.value)
    }

    const handleDOBChange = (value) => {
        const dateString = value.$y + '-' + (parseInt(value.$M) + 1) + '-' + value.$D
        console.log(dateString)
        setTempDob(dateString)
    }

    const handleSubmit = async () => {
        const _name = tempName ? tempName : name
        const _phone = tempPhone ? tempPhone : phoneNumber
        const _dob = tempDob ? tempDob : dob

        if(checkValidation && checkNumChar){
            if (_name) {
                const response = await axios.patch(
                    'http://localhost:3000/users/update/', {
                        id : props.user.Id,
                        name: _name,
                        email: props.user.Email,
                        phone: _phone,
                        dob: _dob
                    }, {
                        headers: {
                            Authorization: 'Bearer ' + props.sessionStorage.loginedUser
                        }
                    }
                )
                if (response.data) {
                    const newUser = {}
                    newUser.userData = response.data
                    newUser.token = props.sessionStorage.loginedUser
                    sessionStorage.setItem('loginedUser', JSON.stringify(newUser))
                    alert('Đã cập nhật hồ sơ')
                    window.location.reload()
                }
            }else{
                alert('Xin hãy nhập họ và tên của bạn')
                setCheckName(false)
            }
        }else{
            alert('Xin hãy nhập số hợp lệ')
        }
    }

    return (
        <div>
            <div className="form-header">
                <h1>Hồ sơ cá nhân</h1>
                <p>Quản lý hồ sơ của bạn để tăng độ tin cậy</p>
            </div>
            <hr />
            <div className="form-inner">
                {props.user != null && (
                    <table>
                        <tr>
                            <td>Tên</td>
                            <td>
                                <TextField
                                    fullWidth
                                    label={'Họ tên'}
                                    variant="standard"
                                    onChange={handleNameChange}
                                    onKeyDown={handleNameKeyDown}
                                    value={name}
                                    helperText={!name ? 'Xin hãy nhập tên của bạn': ''}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>
                                <TextField fullWidth label={'Email'} variant="standard" value={props.user.Email} readOnly />
                            </td>
                        </tr>
                        <tr>
                            <td>SĐT</td>
                            <td>
                                <TextField
                                    fullWidth
                                    label={'Số điện thoại'}
                                    variant="standard"
                                    onChange={handlePhoneNumberChange}
                                    onKeyDown={handleKeyDown}
                                    value={phoneNumber != null ? phoneNumber : null}
                                    helperText={(!checkValidation || !checkNumChar) ? (!phoneNumber ? 'Xin hãy nhập số điện thoại' : 'Số điện thoại không hợp lệ') : ('')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Ngày sinh</td>
                            <td>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker label="Ngày sinh" value={dayjs(dob)} onChange={(value) => handleDOBChange(value)} />
                                </LocalizationProvider>

                                {/*<input className="props.user-input" type="date" value={tempDob ? tempDob : dob}*/}
                                {/*     />*/}
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <Button variant="contained" onClick={() => handleSubmit()}>
                                    SAVE
                                </Button>
                            </td>
                        </tr>
                    </table>
                )}
            </div>
        </div>
    )
}

export default Profile
