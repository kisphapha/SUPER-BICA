import React from 'react'
import Header from '../../../components/common/Header.jsx'
import Navbar from '../../../components/common/Navbar.jsx'
import { UserProvider } from '../../../UserContext.jsx'
import CategoryNav from '../../../components/features/CategoryNav/index.jsx'
import logo from '../../../image/icons/logo.png'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
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
                                        <b>Liên hệ</b>
                                   </h1>
                                   <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <img src={logo} style={{ height: "500px", width: "500px", padding: "0 30px" }} />
                                        <div>
                                             <h2 style={{ color: 'red', fontSize: '23px', lineHeight: '2' }}>
                                                  <b>Liên hệ với chúng tôi</b>
                                             </h2>
                                             <ul style={{ listStyleType: 'disc', fontWeight: 400 }}>
                                                  Trang web của chúng tôi tự hào là nhà phân phối chính hãng các sản phẩm lồng chim, phụ kiện lồng chim từ các làng nghề thủ
                                                  công mỹ nghệ hàng đầu Việt Nam. Với đội ngũ nhân viên năng động, chuyên nghiệp, chúng tôi cam kết mang đến cho
                                                  khách hàng những sản phẩm chất lượng cao, dịch vụ tận tâm và giá cả hợp lý.
                                                  <br/><br/>Nếu có bất kì thắc mắc nào, bạn có thể liên hệ với chúng tôi thông qua các phương thức sau:<br/><br/>
                                                  <li style={{ marginLeft: '30px' }} aria-level="1">
                                                       <PhoneIphoneIcon />0935039353
                                                  </li><br/>
                                                  <li style={{ marginLeft: '30px' }} aria-level="1">
                                                       <EmailIcon />longchimbica@gmail.com
                                                  </li><br/>
                                                  <li style={{ marginLeft: '30px' }} aria-level="1">
                                                       <FacebookIcon />facebook.com/quangphat.nguy
                                                  </li>
                                             </ul>
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
