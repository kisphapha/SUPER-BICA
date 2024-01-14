import React from 'react'
import Header from '../../../components/common/Header.jsx'
import Navbar from '../../../components/common/Navbar.jsx'
import { UserProvider } from '../../../UserContext.jsx'
import CategoryNav from '../../../components/features/CategoryNav/index.jsx'
import logo from '../../../image/icons/logo.png'
class About extends React.Component {
     render() {
          return (
               <div>
                    <UserProvider>
                         <Header />
                         <Navbar />
                    </UserProvider>
                    <CategoryNav parents={[{ name: 'Trang chủ', link: '/' }]} current="Giới thiệu"></CategoryNav>
                    <div className="row row-main" style={{ padding: '2em 15em 10em' }}>
                         <div className="large-12 col">
                              <div className="col-inner">
                                   <h1 style={{ fontSize: '30px', textAlign: 'center', color: 'red' }}>
                                        <b>Giới thiệu</b>
                                   </h1>
                                   <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <img src={logo} style={{ height: "500px", width: "500px", padding: "0 30px" }} />
                                        <div>
                                             <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                                  <b>1. Giới thiệu về trang web của chúng tôi</b>
                                             </h2>
                                             <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                                  Lồng chim là một vật dụng quan trọng trong việc nuôi chim cảnh. Một chiếc lồng đẹp, chất lượng sẽ giúp chim cảnh của bạn có không gian sống thoải mái và an toàn.
                                                  Trang web bán lồng chim của chúng tôi chính là một địa chỉ uy tín, cung cấp đa dạng các loại lồng chim với chất lượng tốt, giá cả phải chăng.
                                             </ul>
                                             <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                                  <b>2. Ưu điểm của trang web bán lồng chim</b>
                                             </h2>
                                             <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                                  Trang web của chúng tôi có nhiều ưu điểm nổi bật như:
                                                  <li style={{ marginLeft: '30px' }} aria-level="1">Đa dạng các loại lồng chim với chất lượng tốt, giá cả phải chăng.</li>
                                                  <li style={{ marginLeft: '30px' }} aria-level="1">Giao hàng nhanh chóng, thuận tiện.</li>
                                                  <li style={{ marginLeft: '30px' }} aria-level="1">Chính sách bảo hành, đổi trả rõ ràng.</li>
                                             </ul>
                                             <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                                  <b>3. Tìm kiếm lồng chim trên trang web</b>
                                             </h2>
                                             <ul style={{ listStyleType: 'disc', marginLeft: '30px', fontWeight: 400 }}>
                                                  Để tìm kiếm lồng chim trên trang web, bạn có thể sử dụng các cách sau:
                                                  <li style={{ marginLeft: '30px' }} aria-level="1">Tìm kiếm theo loại lồng chim: Bạn có thể chọn loại lồng chim mà bạn muốn mua từ danh sách các loại lồng chim được cung cấp trên trang web.</li>
                                                  <li style={{ marginLeft: '30px' }} aria-level="1">Tìm kiếm theo loại chim: Bạn có thể chọn loại chim mà bạn muốn từ danh sách được cung cấp trên trang web.</li>
                                             </ul>
                                             <br/>Hy vọng với những thông tin trên, bạn đã có thêm thông tin về trang web bán lồng chim. Hãy truy cập trang web ngay hôm nay để lựa chọn cho mình những chiếc lồng chim đẹp và chất lượng.
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          )
     }
}

export default About
