import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Button, TextField } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "./AddressPopup.css"

function AddressPopup(props) {
    const [cityList, setCityList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [wardList, setWardList] = useState([])

    const [tinhTP, setTinhTP] = useState("Chọn tỉnh thành")
    const [quanHuyen, setQuanHuyen] = useState("Chọn quận huyện")
    const [phuongXa, setPhuongXa] = useState("Chọn phường xã")
    const [soNha, setSoNha] = useState('')

    const [districtIdx, setDistrictIdx] = useState(0)
    const [cityIdx, setCityIdx] = useState(0)
    const [loadAddress, setLoadAddress] = useState(true)

    const host = 'https://provinces.open-api.vn/api/?depth=3'

    async function fetchCity() {
        const response = await axios.get(host)
        setCityList(response.data)
    }

    async function fetchDistrict(city_code) {
        const response = await axios.get(host)
        setDistrictList(response.data[city_code].districts)
    }

    async function fetchWard(city_code, district_code) {
        const response = await axios.get(host)
        setWardList(response.data[city_code].districts[district_code].wards)
    }
    async function handleUpdate(event) {
        if (tinhTP != 'Chọn tỉnh thành' && quanHuyen != 'Chọn quận huyện' && phuongXa != 'Chọn phường xã' && soNha != '') {
            const json = {
                id: props.user.Id,
                adrId: props.address.id,
                location: soNha,
                ward: phuongXa,
                district: quanHuyen,
                city: tinhTP
            }
            await axios.post(`http://localhost:3000/address/edit`, json, {
                headers: {
                    Authorization: 'Bearer ' + props.user.token
                }
            })
            alert('Địa chỉ được cập nhật')
            props.fetchAddresses()
        } else {
            alert('Xin vui lòng điền đầy đủ thông tin')
        }
    }


    async function handleSubmit(event, fetchAddresses,close) {
        if (tinhTP != 'Chọn tỉnh thành' && quanHuyen != 'Chọn quận huyện' && phuongXa != 'Chọn phường xã' && soNha != '') {
            await axios.post(
                `http://localhost:3000/address/new`, {
                    city : tinhTP,
                    district : quanHuyen,
                    ward : phuongXa,
                    location : soNha,
                    id : props.user.Id 
                }, {
                    headers: {
                        Authorization: 'Bearer ' + props.user.token
                    }
                })
            toast.dismiss()
            toast.success('Thêm địa chỉ thành công', {
                position: 'bottom-left',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            })
            fetchAddresses()
            close()
        } else {
            alert('Xin vui lòng điền đầy đủ thông tin')
        }
    }

    function handleClose() {
        setDistrictList([])
        setWardList([])
        setTinhTP('Chọn tỉnh thành')
        setQuanHuyen('Chọn quận huyện')
        setPhuongXa('Chọn phường xã')
        setSoNha('')
    }

    async function setUp() {
        if (props.address && loadAddress) {
            //fetchDistrict()
            //fetchWard()
            let c_code
            setTinhTP(props.address.city)
            if (cityList) {
                c_code = cityList.findIndex((c) => c.name == props.address.city)
                await fetchDistrict(c_code)
            }
            if (districtList) {
                setQuanHuyen(props.address.district)
                await fetchWard(c_code,districtList.findIndex((d) => d.name == props.address.district))
            }
            if (wardList) {
                setPhuongXa(props.address.ward)
                setLoadAddress(false)
            }
            setSoNha(props.address.street)
        }
    }

    useEffect(() => {
        fetchCity()
    }, [])

    useEffect(() => {
        setUp()
    })

    return (
        <div>
            <div className="location">
                <TextField
                    fullWidth
                    select
                    label="Chọn tỉnh thành"
                    id="city"
                    size="small"
                    SelectProps={{
                        native: true
                    }}
                    value={tinhTP}
                    onChange={(event) => {
                        setCityIdx(event.target.selectedIndex - 1)
                        fetchDistrict(event.target.selectedIndex - 1)
                        setQuanHuyen('Chọn quận huyện')
                        setPhuongXa('Chọn phường xã')
                        setWardList([])
                        setTinhTP(event.target.value)
                    }}
                >
                    <option value="Chọn tỉnh thành" selected>Chọn tỉnh thành</option>
                    {cityList.map((city, index) => (
                        <option key={city.code} value={city.name}>
                            {city.name}
                        </option>
                    ))}
                </TextField>
            </div>
            <div className="location">
                <TextField
                    fullWidth
                    select
                    label="Chọn quận huyện"
                    id="district"
                    size="small"
                    SelectProps={{
                        native: true
                    }}
                    value={quanHuyen}
                    onChange={(event) => {
                        setDistrictIdx(event.target.selectedIndex - 1)
                        fetchWard(cityIdx, event.target.selectedIndex - 1)
                        setQuanHuyen(event.target.value)
                        setPhuongXa('Chọn phường xã')
                    }}
                >
                    <option value="Chọn quận huyện" selected>Chọn quận huyện</option>
                    {districtList.map((district, index) => (
                        <option key={district.code} value={district.name}>
                            {district.name}
                        </option>
                    ))}
                </TextField>
            </div>
            <div className="location">
                <TextField
                    fullWidth
                    select
                    label="Chọn phường xã"
                    className="location"
                    id="ward"
                    size="small"
                    SelectProps={{
                        native: true
                    }}
                    value={phuongXa}
                    onChange={(event) => {
                        setPhuongXa(event.target.value)
                    }}
                >
                    <option value="Chọn phường xã" selected>Chọn phường xã</option>
                    {wardList.map((ward, index) => (
                        <option key={ward.code} value={ward.name}>
                            {ward.name}
                        </option>
                    ))}
                </TextField>
            </div>
            <div className="location">
                <TextField
                    fullWidth
                    className="location"
                    size="small"
                    type="text"
                    placeholder="Số nhà"
                    value={soNha}
                    onChange={(event) => {
                        setSoNha(event.target.value)
                    }}
                ></TextField>
            </div>
            <div className="buttons">
                {/* <button className="decision" onClick={close}></button> */}
                <Button variant="contained" onClick={props.close}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={(event) => {
                        if (props.address)
                            handleUpdate(event);
                        else
                            handleSubmit(event, props.fetchAddresses, props.close, handleClose);
                    }}
                >
                    Ok
                </Button>
            </div>
        </div>
    )
}

export default AddressPopup
