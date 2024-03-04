import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import axios from 'axios'
import { TextField } from '@mui/material'
import './LineChart.css'
function LineChart({user }) {
    const currentDate = new Date() // Get the current date
    const currMonth = currentDate.getMonth() + 1 // Get the month (0-11, add 1 for human-readable format)
    const currYear = currentDate.getFullYear() // Get the year (e.g., 2023)

    const [data, setData] = useState([])
    const [isMonthly, setIsMonthly] = useState(true)
    const [income, setIncome] = useState([])
    const [timeline, setTimeline] = useState([])
    const [month, setMonth] = useState(currMonth)
    const [year, setYear] = useState(currYear)

    const fetchData = async (month, year) => {
        var res = null
        if (isMonthly) {
            res = await axios.post('http://localhost:3000/admin/statistic', {
                month,
                year
            }, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.loginedUser
                }
            })
        } else {
            res = await axios.post('http://localhost:3000/admin/getMonthLyIncome', {
                year
            }, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.loginedUser
                }
            })
        }
        if (res.data) {
            setData(res.data)
            if (isMonthly) {
                setTimeline(res.data.map((element) => element.MonthDay))
            } else {
                setTimeline(res.data.map((element) => element.Month))
            }
            setIncome(res.data.map((element) => element.TotalAmount))
        }
    }

    useEffect(() => {
        fetchData(month, year)
    }, [isMonthly, month, year]) // Fetch data whenever isMonthly changes

    if (data.length === 0) {
        return <div>Loading...</div>
    }

    return (
        <div className="container-fluid">
            <div className="preriod-picker">
                <div>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        value={month}
                        disabled={!isMonthly}
                        SelectProps={{
                            native: true
                        }}
                        onChange={(event) => {
                            setMonth(event.target.value)
                        }}
                    >
                        <option value="1">Tháng 1</option>
                        <option value="2">Tháng 2</option>
                        <option value="3">Tháng 3</option>
                        <option value="4">Tháng 4</option>
                        <option value="5">Tháng 5</option>
                        <option value="6">Tháng 6</option>
                        <option value="7">Tháng 7</option>
                        <option value="8">Tháng 8</option>
                        <option value="9">Tháng 9</option>
                        <option value="10">Tháng 10</option>
                        <option value="11">Tháng 11</option>
                        <option value="12">Tháng 12</option>
                    </TextField>
                </div>

                <div>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        SelectProps={{
                            native: true
                        }}
                        onChange={(event) => {
                            setYear(event.target.value)
                        }}
                    >
                        <option value={currYear}>{currYear}</option>
                        <option value={currYear - 1}>{currYear - 1}</option>
                        <option value={currYear - 2}>{currYear - 2}</option>
                        <option value={currYear - 3}>{currYear - 3}</option>
                        <option value={currYear - 4}>{currYear - 4}</option>
                    </TextField>
                </div>

                <label class="switch">
                    <input
                        type="checkbox"
                        onClick={() => {
                            setIsMonthly(!isMonthly)
                            fetchData(month, year)
                        }}
                    />
                    <span class="slider">
                        {/* <div class="period">Month</div>
                        <div class="period">Year</div> */}
                    </span>
                </label>
            </div>
            <Chart
                type="line"
                height={400}
                series={[
                    {
                        name: 'Series 1',
                        data: income
                    }
                ]}
                options={{
                    stroke: {
                        curve: 'smooth'
                    },
                    chart: {
                        toolbar: {
                            show: true
                        }
                    },
                    xaxis: {
                        title: { text: isMonthly ? 'Thu nhập tháng' : 'Thu nhập năm' },
                        categories: timeline
                    }
                }}
            />
        </div>
    )
}

export default LineChart
