import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

function PieChart({user }) {
    const [data, setData] = useState([]);

    function getOrderNumber() {
        const orderNums = []
        data.map((element) => {
            orderNums.push(element.Cages)
        })
        console.log(orderNums)
        return orderNums;
    }
    function getCates() {
        const cates = []
        data.map(element => {
            cates.push(element.name)
        })
        console.log(cates)

        return cates;
    }

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('http://localhost:3000/order/pieChartData', {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.loginedUser
                }
            })
            if (res.data) {
                setData(res.data);
                console.log(res.data)
            }
        }

        fetchData();
    }, [])
  // const [pendingOrder, setPendingOrder] = useState([]);
  // const [approvedOrder, setApprovedOrder] = useState([]);
  // const [completedOrder, setCompletedOrder] = useState([]);

  // useEffect(() => {
  //   const spOrder = [];
  //   const saOrder = [];
  //   const scOrder = [];

  //   const getOrderData = async() =>{
  //     const response = await fetch("http://localhost:3000/api/order");
  //     const data = await response.json();
  //     data.forEach(element => {
  //       if(element.status === "Pending"){
  //         spOrder.push(element);
  //       }
  //       else if(element.status === "Approved"){
  //         saOrder.push(element);
  //       }
  //       else if(element.status === "Completed"){
  //         scOrder.push(element);
  //       }
  //     });
  //     setPendingOrder(spOrder);
  //     setApprovedOrder(saOrder);
  //     setCompletedOrder(scOrder);
  //   }
  //   getOrderData();
  // },[]);

  return (
    <React.Fragment>
      <div className="container-fluid">
        <Chart
        type="pie"
        // height={200}

        series={getOrderNumber()}

        

        options={{
          plotOptions: {
            pie: {expandOnClick: true}
          },

          legend:{
            position: "bottom",
            horizontalAlign: "center",
          },

          yaxis:{
            labels: {
              maxWidth: "812",
            },
          },
          title: {
            text: "Sản phẩm được mua",
            align: "center"
          },

          noData:{text: "Hello? Data?"},

        labels:getCates()
        
        }}
        >

        </Chart>
      </div>
    </React.Fragment>
  )
}

export default PieChart
