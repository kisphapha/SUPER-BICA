import React from 'react'
import Header from '../../../components/common/Header.jsx'
import Navbar from '../../../components/common/Navbar.jsx'
import { UserProvider } from '../../../UserContext.jsx'
import CategoryNav from '../../../components/features/CategoryNav/index.jsx'

class ReturnPolicy extends React.Component {
    render() {
        return (
            <div>
                <UserProvider>
                    <Header />
                    <Navbar />
                </UserProvider>
                <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }]} current="Chính Sách Đổi Trả"></CategoryNav>
                <div className="row row-main" style={{ padding: '2em 15em 10em' }}>
                    <div className="large-12 col">
                        <div className="col-inner">
                            <h1 style={{ fontSize: '30px', textAlign: 'center', color: 'red' }}>
                                <b>Chính Sách Đổi Trả</b>
                            </h1>
                            <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                <b>1. Trường hợp đổi trả do lỗi của chúng tôi</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                <li aria-level="1">Nếu sản phẩm giao không đúng đơn đặt hàng, khách hàng vui lòng liên hệ với chúng tôi trong vòng 3 ngày kể từ khi nhận hàng. Chúng tôi sẽ thay thế đúng mặt hàng khách yêu cầu (khi có hàng).</li>
                            </ul>
                            <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                <b>2. Trường hợp đổi trả do ý muốn của khách hàng</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                <li aria-level="1">Khách hàng có thể trả hàng khi không vừa ý trong vòng 3 ngày kể từ ngày nhận hàng. Chúng tôi sẽ đổi sản phẩm cho khách.</li>
                                <li aria-level="1">Khách hàng chịu chi phí vận chuyển lắp đặt.</li>
                            </ul>
                            <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                <b>3. Trường hợp đổi trả do lỗi của sản phẩm</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                <li aria-level="1">Khách hàng vui lòng kiểm tra sản phẩm trước khi thanh toán. Trong trường hợp sản phẩm bị hư hại trong quá trình vận chuyển, khách hàng vui lòng từ chối và gửi lại sản phẩm cho chúng tôi.</li>
                                <li aria-level="1">Trong thời hạn bảo hành, sản phẩm hư hỏng nhiều lần, khách hàng được đổi hoặc trả máy miễn phí với sản phẩm đồng giá hoặc bù thêm tiền khi đổi sản phẩm có giá trị cao hơn.</li>
                            </ul>
                            <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                <b>4. Điều kiện đổi trả hàng</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                <li aria-level="1">Điều kiện về thời gian đổi trả: trong vòng 3 ngày kể từ khi nhận được hàng.</li>
                                <li aria-level="1">
                                    Điều kiện về sản phẩm:
                                    <ol style={{ listStyleType: 'circle', marginLeft: '30px' }}>
                                        <li>Hàng hóa còn đầy đủ các bộ phận, không có dấu hiệu sử dụng quá nhiều hoặc hỏng hóc.</li>
                                        <li>Có đầy đủ các giấy tờ kèm theo (hóa đơn mua hàng hoặc phiếu bảo hành) và các linh kiện, tặng phẩm kèm theo (nếu có).</li>
                                        <li>Khách hàng chịu chi phí vận chuyển cho việc đổi, trả hàng.</li>
                                    </ol>
                                </li>
                                <li aria-level="1">Trường hợp không đủ các điều kiện trên thì quyền quyết định đổi, trả hàng thuộc về chúng tôi.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ReturnPolicy
