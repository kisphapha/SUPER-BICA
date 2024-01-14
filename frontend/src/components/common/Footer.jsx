import React from 'react'
import './Footer.css'
import logo from '../../image/icons/logo.svg'
import payment from '../../image/icons/payment.svg'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import TwitterIcon from '@mui/icons-material/Twitter'
import TelegramIcon from '@mui/icons-material/Telegram'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
    const navigate = useNavigate()

    return (
        <div id="footer">
            <div className="logo">
                <img src={logo} />
            </div>
            <div className="container">
                <div className="title">THÔNG TIN CÔNG TY</div>
                <ul className="content">
                    <li className="detail" onClick={() => navigate(`/`)}>
                        Trang Chủ
                    </li>
                    <li className="detail" onClick={() => navigate(`/About`)}>
                        Giới Thiệu
                    </li>
                    <li className="detail" onClick={() => navigate(`/Contact`)}>
                        Liên Hệ
                    </li>
                </ul>
            </div>
            <div className="container">
                <div className="title">CHÍNH SÁCH</div>
                <ul className="content">
                    <li className="detail" onClick={() => navigate(`/GeneralPolicy`)}>
                        Chính Sách Chung
                    </li>
                    <li className="detail" onClick={() => navigate(`/PaymentPolicy`)}>
                        Chính Sách Mua Hàng
                    </li>
                    <li className="detail" onClick={() => navigate(`/ReturnPolicy`)}>
                        Chính Sách Đổi Trả
                    </li>
                    <li className="detail" onClick={() => navigate(`/SecurePolicy`)}>
                        Chính Sách Bảo Mật
                    </li>
                </ul>
            </div>
            <div className="container">
                <div className="title">DANH MỤC NỔI BẬT</div>
                <ul className="content">
                    <li
                        className="detail"
                        onClick={() => {
                            navigate('/filter/' + 1 + '/' + 'LK')
                            window.location.reload()
                        }}
                    >
                        Lồng Đặc Biệt
                    </li>
                    <li
                        className="detail"
                        onClick={() => {
                            navigate('/filter/' + 1 + '/' + 'LS')
                            window.location.reload()
                        }}
                    >
                        Lồng Kiểu Singapore
                    </li>
                    <li
                        className="detail"
                        onClick={() => {
                            navigate('/filter/' + 1 + '/' + 'LT')
                            window.location.reload()
                        }}
                    >
                        Lồng Trụ Tròn
                    </li>
                    <li
                        className="detail"
                        onClick={() => {
                            navigate('/filter/' + 1 + '/' + 'LV')
                            window.location.reload()
                        }}
                    >
                        Lồng Vuông
                    </li>
                    <li
                        className="detail"
                        onClick={() => {
                            navigate('/filter/' + 1 + '/' + 'PK')
                            window.location.reload()
                        }}
                    >
                        Phụ Kiện Lồng Chim
                    </li>
                </ul>
            </div>
            <div className="container">
                <div className="title">LIÊN HỆ VỚI CHÚNG TÔI</div>
                <ul className="content">
                    <li className="detail">Hotline: 0935039353</li>
                    <li className="detail">Email: longchimbica@gmail.com</li>
                    <li className="detail">
                        <a href="https://facebook.com/quangphat.nguy" target="_blank" rel="noreferrer noopener">Facebook: facebook.com/quangphat.nguy</a>
                    </li>
                </ul>
            </div>
            <div className="container">
                <div className="title">CHẤP NHẬN THANH TOÁN</div>
                <img src={payment} alt="" />
                <div className="title">KẾT NỐI VỚI CHÚNG TÔI</div>
                <div>
                    <a href="https://facebook.com/quangphat.nguy" target="_blank" rel="noreferrer noopener"><FacebookIcon /></a>
                    <InstagramIcon />
                    <TwitterIcon />
                    <YouTubeIcon />
                    <TelegramIcon />
                </div>
            </div>
        </div>
    )
}
