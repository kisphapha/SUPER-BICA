import React, { useEffect, useState } from 'react';
import { UserProvider } from '../../UserContext';
import Header from '../../components/common/Header';
import Navbar from '../../components/common/Navbar';
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Table } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

export default function Compare() {
    const [product, setProduct] = useState([]);
    const navigate = useNavigate()

    const fetchProduct = async (id) => {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        return response.data;
    };

    const getProList = async () => {
        window.scrollTo(0, 0);
        const compareList = JSON.parse(sessionStorage.getItem('compareList')) || [];
        const products = await Promise.all(compareList.map(async (compareId) => {
            return await fetchProduct(compareId.productId);
        }));
        setProduct(products);
    };

    const handleDeleteAll = () => {
        // Clear all compared products
        sessionStorage.removeItem('compareList');
        setProduct([]);
    };

    const handleDelete = (productId) => {
        // Remove a specific product from the compared list
        const compareList = JSON.parse(sessionStorage.getItem('compareList')) || [];
        const updatedCompareList = compareList.filter((item) => item.productId != productId);
        sessionStorage.setItem('compareList', JSON.stringify(updatedCompareList));
        // Fetch updated product list based on the updated compare list
        getProList();
    };

    useEffect(() => {
        getProList();
    }, []);

    return (
        <div>
            <UserProvider>
                <Header />
                <Navbar />
            </UserProvider>
            <div className="font-bold text-xl text-center my-4">So sánh sản phẩm</div>
            <div className="w-5/6 mx-auto mt-4 mb-8 pb-72 flex-row text-center ">
                <TableContainer component={Paper}>
                    <Table>
                        <colgroup>
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '30%' }} />
                            <col style={{ width: '30%' }} />
                            <col style={{ width: '30%' }} />
                        </colgroup>
                    <TableBody>
                        {product.length > 0 && (
                            <>
                                {/* ... (existing code) */}
                                {/* Data rows for the specified fields */}
                                {["Ảnh", "Tên sản phẩm", "Mô tả", "Hình dáng", "Chất Liệu", "Giá", "Loại chim", "Kích thước", ""].map((key) => (
                                    <TableRow key={key} className=''>
                                        <TableCell>{key}</TableCell>
                                        {product.map((pro) => (
                                            <TableCell key={pro.Id}>
                                                {key === "Ảnh" ? (
                                                    <div className='mx-12 ml-32'>
                                                        <img className="w-40 h-40" src={pro.Url} alt={pro.Name} />
                                                    </div>
                                                ) : key === "Tên sản phẩm" ? (
                                                    <div className='  mx-12 text-center'>
                                                        {pro.Name}
                                                    </div> 
                                                ) : key === "Mô tả" ? (
                                                    <div className='  mx-12 text-left'>
                                                        {pro.Description}
                                                    </div>
                                                ) : key === "Hình dáng" ? (
                                                    <div className='  mx-12 text-center'>
                                                        {pro.Shape}
                                                    </div>
                                                ) : key === "Chất Liệu" ? (
                                                    <div className='  mx-12 text-center'>
                                                        {pro.material}
                                                    </div>
                                                ) : key === "Giá" ? (
                                                    <div className='mx-12 text-center'>
                                                        {parseInt((pro.Price * (100 - pro.discount)) / 100).toLocaleString("vi", {
                                                            style: "currency",
                                                            currency: "VND"
                                                        })}
                                                    </div>
                                                ) : key === "Loại chim" ? (
                                                    <div className='  mx-12 text-center'>
                                                        {pro.SuitableBird}
                                                    </div>
                                                ) : key === "Kích thước" ? (
                                                    <div className='  mx-12 text-center'>
                                                        {pro.Size}
                                                    </div>
                                                ) : (
                                                     <div className='mx-12 text-center flex gap-2 ml-24'>
                                                        <div>
                                                            <Button className='' variant='contained' onClick={() => {navigate('/products/'+pro.Id)}}>Mua Ngay</Button>
                                                        </div>
                                                        <div>
                                                            {/* Pass the removeProductFromCompare function and product ID */}
                                                            <Button variant='outlined' onClick={() => handleDelete(pro.Id)}>
                                                                <DeleteIcon />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                    </Table>
                </TableContainer>
                {product.length !== 0 && (
                    <div className='m-2'>
                        <Button variant='outlined' onClick={() => handleDeleteAll()}>xóa tất cả</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
