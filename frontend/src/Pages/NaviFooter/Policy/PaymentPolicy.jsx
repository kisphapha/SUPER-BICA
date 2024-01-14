import React from 'react'
import Header from '../../../components/common/Header.jsx'
import Navbar from '../../../components/common/Navbar.jsx'
import { UserProvider } from '../../../UserContext.jsx'
import CategoryNav from '../../../components/features/CategoryNav/index.jsx'

class PaymentPolicy extends React.Component {
    render() {
        return (
            <div>
                <UserProvider>
                    <Header />
                    <Navbar />
                </UserProvider>
                <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }]} current="Chính Sách Mua Hàng"></CategoryNav>
                <div className="row row-main" style={{ padding: '2em 15em 10em' }}>
                    <div className="large-12 col">
                        <div className="col-inner">
                            <h1 style={{ fontSize: '30px', textAlign: 'center', color: 'red' }}>
                                <b>Chính Sách Mua Hàng</b>
                            </h1>
                            <h2 style={{color: 'red', fontSize: '23px', lineHeight: '2'}}>
                                <b>1. Thanh toán tại nhà</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400}}>
                                <li aria-level="1">
                                    Bước 1: Truy cập website hoặc ứng dụng của cửa hàng, chọn sản phẩm và đặt hàng.
                                </li>
                                <li aria-level="1">
                                    Bước 2: Chọn phương thức thanh toán &quot;Tiền mặt&quot; và xác nhận đơn hàng.
                                </li>
                                <li aria-level="1">
                                    Bước 3: Cửa hàng sẽ liên hệ xác nhận đơn hàng và giao hàng cho khách hàng.
                                </li>
                                <li aria-level="1">
                                    Bước 4: Khách hàng kiểm tra hàng hóa và thanh toán tiền mặt cho nhân viên giao hàng.
                                </li>
                            </ul>
                            <h2 style={{color: 'red', fontSize: '23px', lineHeight: '2'}}>
                                <b>2. Thanh toán qua Internet Banking</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400}}>
                                <li aria-level="1">
                                    Bước 1: Đăng nhập ứng dụng Mobile Banking của một trong các ngân hàng tích có hợp tính năng QR Pay như BIDV,
                                    VietinBank, Agribank, Vietcombank, ABBANK, SCB, IVB, NCB, SHB, Maritime Bank…
                                </li>
                                <li aria-level="1">
                                    Bước 2: Bạn chọn tính năng chuyển tiền.
                                </li>
                                <li aria-level="1">
                                    Bước 3: nhập thông tin chuyển khoản của chúng tôi:
                                    <ol style={{listStyleType: 'circle',marginLeft: '30px' }}>
                                        <li>Tên TK: Nguyen Van Quang Phat</li>
                                        <li>Tại: Ngân Hàng VietinBank – CN HCM</li>
                                        <li>SỐ TK: 105327747</li>
                                    </ol>
                                </li>
                                <li aria-level="1">
                                    Bước 4: Nhập số tiền thanh toán.
                                </li>
                                <li aria-level="1">
                                    Bước 5: Xác minh giao dịch bằng mật khẩu, vân tay hoặc FaceID. Nhận thông báo giao dịch hoàn thành.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PaymentPolicy
