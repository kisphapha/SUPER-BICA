import React from 'react'
import Header from '../../../components/common/Header.jsx'
import Navbar from '../../../components/common/Navbar.jsx'
import { UserProvider } from '../../../UserContext.jsx'
import CategoryNav from '../../../components/features/CategoryNav/index.jsx'

class SecurePolicy extends React.Component {
    render() {
        return (
            <div>
                <UserProvider>
                    <Header />
                    <Navbar />
                </UserProvider>
                <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }]} current="Chính Sách Bảo Mật"></CategoryNav>
                <div className="row row-main" style={{ padding: '2em 15em 10em' }}>
                    <div className="large-12 col">
                        <div className="col-inner">
                            <h1 style={{ fontSize: '30px', textAlign: 'center', color: 'red' }}>
                                <b>Chính Sách Bảo Mật</b>
                            </h1>
                            <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                <b>1. Thu thập thông tin cá nhân</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản
                                trên website chúng tôi. Thông tin cá nhân mà chúng tôi thu thập bao gồm:
                                <li style={{ marginLeft: '30px' }} aria-level="1">Họ tên, email, số điện thoại, địa chỉ.</li>
                                <li style={{ marginLeft: '30px' }} aria-level="1">Thông tin về hoạt động của bạn trên website chúng tôi, bao gồm số lần truy cập, số trang bạn xem, các liên kết bạn click,...</li>
                            </ul>
                            <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                <b>2. Sử dụng thông tin cá nhân</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                Chúng tôi sử dụng thông tin cá nhân của bạn để:
                                <li style={{ marginLeft: '30px' }} aria-level="1">Hỗ trợ bạn khi mua sản phẩm, giải đáp thắc mắc của bạn.</li>
                                <li style={{ marginLeft: '30px' }} aria-level="1">Cung cấp cho bạn thông tin mới nhất về sản phẩm và dịch vụ của chúng tôi.</li>
                                <li style={{ marginLeft: '30px' }} aria-level="1">Xem xét và nâng cấp nội dung và giao diện của website.</li>
                                <li style={{ marginLeft: '30px' }} aria-level="1">Thực hiện các bản khảo sát khách hàng.</li>
                                <li style={{ marginLeft: '30px' }} aria-level="1">Thực hiện các hoạt động quảng bá liên quan đến các sản phẩm và dịch vụ của chúng tôi</li>
                            </ul>
                            <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                <b>3. Chia sẻ thông tin cá nhân</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                Chúng tôi cam kết sẽ không chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba nào, trừ các trường hợp sau:
                                <li style={{ marginLeft: '30px' }} aria-level="1">Khi có yêu cầu của cơ quan pháp luật.</li>
                                <li style={{ marginLeft: '30px' }} aria-level="1">Trong trường hợp chúng tôi tin rằng điều đó sẽ giúp chúng tôi bảo vệ quyền lợi chính đáng của mình trước pháp luật.</li>
                                <li style={{ marginLeft: '30px' }} aria-level="1">Tình huống khẩn cấp và cần thiết để bảo vệ quyền an toàn cá nhân của các thành viên khác.</li>
                            </ul>
                            <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                <b>4. Bảo mật thông tin cá nhân</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                Chúng tôi sử dụng nhiều công nghệ bảo mật thông tin khác nhau để bảo vệ thông tin cá nhân của bạn, bao gồm: Chuẩn quốc tế PCI, SSL,...
                                <tr/>Tuy nhiên, do hạn chế về mặt kỹ thuật, không một dữ liệu nào có thể được truyền trên đường truyền internet mà có thể được bảo mật 100%. Do vậy, chúng tôi không thể đưa ra một cam kết chắc chắn rằng thông tin cá nhân của bạn sẽ được bảo mật một cách tuyệt đối an toàn.
                            </ul>
                            <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                <b>5. Thay đổi về chính sách</b>
                            </h2>
                            <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                Chúng tôi có thể thay đổi nội dung chính sách này mà không cần thông báo trước. Khi cập nhật nội dung chính sách, chúng tôi sẽ chỉnh sửa lại thời gian &quot;Cập nhật lần cuối&quot; bên dưới.
                                <tr/><p style={{ color: 'red', fontWeight: "bold"}}>Bằng việc sử dụng website chúng tôi, bạn đã đồng ý với các điều khoản của chính sách bảo mật này.</p>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SecurePolicy
