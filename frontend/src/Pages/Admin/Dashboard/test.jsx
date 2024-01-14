import React from 'react'

import Chart from 'react-apexcharts'

import statusCards from '../assets/JsonData/status-card-data.json'

import StatusCard from '../components/status-card/StatusCard'

import Table from '../components/table/Table'

import { Link } from 'react-router-dom'

const chartOptions = {
    series: [
        {
            name: 'Monthly income',
            data: [40, 70, 20, 90, 36, 80, 30, 91, 60]
        } //, {
        //      name: 'Store Customers',
        //      data: [40,30,70,80,40,16,40,20,51,10]
        // }
    ],
    option: {
        color: ['#6ab04c', '#2980b9'],
        chart: {
            background: 'transparent'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
        },
        legend: {
            position: 'bottom'
        },
        grid: {
            show: true
        }
    }
}

const topCustomers = {
    head: ['user', 'total orders', 'total spending'],
    body: [
        {
            username: 'john doe',
            order: '490',
            price: '$15,870'
        },
        {
            username: 'frank iva',
            order: '250',
            price: '$12,251'
        },
        {
            username: 'anthony baker',
            order: '110',
            price: '$9,251'
        },
        {
            username: 'frank iva',
            order: '490',
            price: '$15,870'
        },
        {
            username: 'anthony baker',
            order: '80',
            price: '$8,840'
        }
    ]
}

const renderCustomerHead = (item, index) => <th key={index}>{item}</th>

const renderCustomerBody = (item, index) => (
    <tr key={index}>
        <td>{item.username}</td>
        <td>{item.order}</td>
        <td>{item.price}</td>
    </tr>
)

const Dashboard = () => {
    return (
        <div>
            <h2 className="page-header">Dashboard</h2>
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        {statusCards.map((item, index) => (
                            <div className="col-6">
                                <StatusCard icon={item.icon} count={item.count} title={item.title} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-6">
                    <div className="card full-height">
                        {/* chart */}
                        <Chart options={chartOptions.option} series={chartOptions.series} type="line" height="100%" />
                    </div>
                </div>
                <div className="col-4">
                    <div className="card">
                        <div className="card__header">
                            <h3>Top customers</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={topCustomers.head}
                                renderHead={(item, index) => renderCustomerHead(item, index)}
                                bodyData={topCustomers.body}
                                renderBody={(item, index) => renderCustomerBody(item, index)}
                            />
                        </div>
                        <div className="card__footer">
                            <Link to="/">view all</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
