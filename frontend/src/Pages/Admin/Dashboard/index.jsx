import React, { useEffect, useState, useContext } from 'react'
// import { LineChart } from '@mui/x-charts/LineChart'
// import { PieChart } from '@mui/x-charts/PieChart'
// import Chart from 'react-apexcharts'
import LineChart from '../../../components/features/LineChart/LineChart'
import PieChart from '../../../components/features/PieChart/PieChart'
import './styles.css'
import Axios from 'axios'
import { UserContext } from '../../../UserContext'
import CategoryNav from '../../../components/features/CategoryNav'

function Dashboard() {
    const { user } = useContext(UserContext)

    const [bestSellers, setBellSeller] = useState([])

    async function fetchBestSellers() {
        const response = await Axios.get(`http://localhost:3000/admin/getBestSelling`, {
            headers: {
                Authorization: 'Bearer ' + user.token
            }
        })
        if (response.data) {
            const jsonData = response.data
            const results = []

            for (const sell of jsonData) {
                const productDetail = await fetchProductDetail(sell.Id)
                const result = { ...sell, productDetail }
                results.push(result)
            }
            console.log(results)
            setBellSeller(results)
        }
    }

    const fetchProductDetail = async (id) => {
        const response = await Axios.get('http://localhost:3000/products/'+id)
        if (response.data) {
            return (response.data)
        }
    }



    useEffect(() => {
        fetchBestSellers()
    })

    return (
        <div className="dashboard ">
            {user && (
                <>
                    <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }]}
                        current='Bảng điều khiển'
                        margin={0}
                    />
                    <div className="mt-8 text-4xl font-bold">
                        Chào mừng {user.Name}
                        <div className="absolute right-8 top-8 ">
                            <img className="w-32 h-32 rounded-full" src={user.Picture}></img>
                        </div>
                    </div>
                    
                    <div className="text-xl font-bold">Dashboard</div>
                    {user.Role == "Admin" && (
                        <>
                            <div className="dashboard-detail my-8">
                                <div className="chart-container">
                                    <LineChart user={user} />
                                </div>
                                <div className="chart-container">
                                    <PieChart user={user} />
                                </div>
                            </div>
                            <div className="leaderboard-container ml-80 bg-white w-1/2">
                                {/* <div className="flex-col items-center  justify-center    ">
                                    <h1 className="pl-8 my-8 ">Best Sellers</h1>
                                    <div className="px-64 my-8"></div>
                                </div> */}
                                <table className="best-seller">
                                    <caption><b>Sản phẩm bán chạy nhất</b></caption>
                                    <tr>
                                        <th style={{width: '15%'}}>Ảnh</th>
                                        <th style={{width: '55%'}}>Tên lồng</th>
                                        <th style={{width: '15%', textAlign: 'center'}}>Giá</th>
                                        <th style={{width: '15%', textAlign: 'center'}}>Tổng bán được</th>
                                    </tr>
                                    {bestSellers.map((sell, index) => (
                                        index < 5 && (
                                            <tr key={sell.id}>
                                                <td>
                                                    <img
                                                        className="w-20 h-20"
                                                        src={sell.productDetail.Url}
                                                    />
                                                </td>
                                                <td>{sell.productDetail.Name}</td>
                                                <td style={{textAlign: 'center'}}>{parseInt(sell.productDetail.Price).toLocaleString('vi', {
                                                                        style: 'currency',
                                                                        currency: 'VND'
                                                                    })}{' '}</td>
                                                <td style={{textAlign: 'center'}}>{sell.total_quantity_sold}</td>
                                            </tr>
                                        )
                                        //await 
                                    ))}
                                </table>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default Dashboard

// const chartOptions = {
//     series: [
//         {
//             name: 'Monthly income',
//             data: [40, 70, 20, 90, 36, 80, 30, 91, 60]
//         } //, {
//         //      name: 'Store Customers',
//         //      data: [40,30,70,80,40,16,40,20,51,10]
//         // }
//     ],
//     option: {
//         color: ['#6ab04c', '#2980b9'],
//         chart: {
//             background: 'transparent'
//         },
//         dataLabels: {
//             enabled: false
//         },
//         stroke: {
//             curve: 'smooth'
//         },
//         xaxis: {
//             categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
//         },
//         legend: {
//             position: 'bottom'
//         },
//         grid: {
//             show: true
//         }
//     }
// }
// export default function Dashboard() {

//     return (
//         <div className="w-full mb-52 pb-96 flex flex-col">
//             <div className="m-12">DashBoard</div>
//             <div className="flex items-center  justify-center  ">
//                 <div className=" bg-slate-200 mx-12 ">
//                     <div className="pl-12 py-4 font-bold">Sale Statistics</div>
//                     <div className="mb-8">
//                         <Chart options={chartOptions.option} series={chartOptions.series} type="line" height={400} width={700} />
//                     </div>
//                     {/* width={600}
//                             height={300} */}
//                 </div>
//                 <div className=" bg-slate-200 ">
//                     <div className="pl-12 py-6 font-bold">Best of Categories Sellers</div>
//                     <div className="mx-12 mb-8">
//                         <PieChart
//                             series={[
//                                 {
//                                     data: [
//                                         { id: 0, value: 10, label: 'LV        ' },
//                                         { id: 1, value: 15, label: 'PK        ' },
//                                         { id: 2, value: 20, label: 'L2T       ' }
//                                     ]
//                                 }
//                             ]}
//                             width={700}
//                             height={400}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
