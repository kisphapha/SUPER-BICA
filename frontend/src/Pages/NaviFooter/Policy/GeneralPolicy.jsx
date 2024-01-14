import React from 'react'
import Header from '../../../components/common/Header.jsx'
import Navbar from '../../../components/common/Navbar.jsx'
import { UserProvider } from '../../../UserContext.jsx'
import CategoryNav from '../../../components/features/CategoryNav/index.jsx'

class GeneralPolicy extends React.Component {
    render() {
        return (
            <div>
                <UserProvider>
                    <Header />
                    <Navbar />
                </UserProvider>
                <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }]} current="Chính sách chung"></CategoryNav>
                <div className="row row-main" style={{ padding: '2em 15em 10em' }}>
                    <div className="large-12 col">
                        <div className="col-inner">
                            <h1 style={{ fontSize: '30px', textAlign: 'center', color: 'red' }}>
                                <b>Chính Sách Chung</b>
                            </h1>
                            <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                <b>1. Quyền và trách nhiệm của người bán sản phẩm</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                <li aria-level="1">
                                    Quyền:
                                    <ol style={{ listStyleType: 'circle', marginLeft: '30px' }}>
                                        <li>Cung cấp đúng sản phẩm mà khách hàng đã lựa chọn.</li>
                                        <li>
                                            Yêu cầu khách hàng cung cấp đầy đủ thông tin về nhu cầu, điều kiện sử dụng, điều kiện vận chuyển, điều
                                            kiện bảo hành, đổi trả sản phẩm, chăm sóc khách hàng về sau.
                                        </li>
                                    </ol>
                                </li>
                                <li aria-level="1">
                                    Trách nhiệm:
                                    <ol style={{ listStyleType: 'circle', marginLeft: '30px' }}>
                                        <li>Tư vấn đầy đủ các tính năng, cách sử dụng, giá,... và các yêu cầu khác của khách hàng.</li>
                                        <li>Hướng dẫn khách hàng cách sử dụng và bảo quản sản phẩm sau khi mua và trong suốt quá trình sử dụng.</li>
                                        <li>Có chính sách đổi trả sản phẩm và chăm sóc khách hàng sau khi khách hàng mua sản phẩm tại website của chúng tôi</li>
                                        <li>Cam kết bán hàng đúng chất lượng, hàng có nguồn gốc xuất xứ rõ ràng, hàng có các tiêu chuẩn đo lường chất lượng phù hợp với các quy định của pháp luật Việt Nam.</li>
                                    </ol>
                                </li>
                            </ul>
                            <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                <b>2. Quyền và trách nhiệm của người mua sản phẩm</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                <li aria-level="1">
                                    Quyền:
                                    <ol style={{ listStyleType: 'circle', marginLeft: '30px' }}>
                                        <li>Cung cấp đầy đủ thông tin về nhu cầu, điều kiện sử dụng, điều kiện vận chuyển, điều kiện đổi trả, chăm sóc khách hàng về sau,... và các yêu cầu cần thiết để người bán tư vấn đúng, chính xác các sản phẩm phù hợp nhất với khách hàng.</li>
                                        <li>Yêu cầu người bán cung cấp đầy đủ các hồ sơ, giấy tờ liên quan đến chất lượng, xuất xứ sản phẩm, thành phần để người mua có lựa chọn và hiểu biết rõ về sản phẩm trước khi mua và sử dụng sản phẩm.</li>
                                    </ol>
                                </li>
                                <li aria-level="1">
                                    Trách nhiệm:
                                    <ol style={{ listStyleType: 'circle', marginLeft: '30px' }}>
                                        <li>Cùng thực hiện mọi vấn đề do hai bên thỏa thuận, trên tinh thần hợp tác, tự nguyện.</li>
                                    </ol>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default GeneralPolicy
