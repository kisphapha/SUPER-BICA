import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Cart from './Pages/Cart'
import Custom from './Pages/CustomBetter'
import Test from './Pages/Test'
import ProductDetails from './Pages/ProductDetail'
import FilteredPage from './Pages/FilteredPage'
import { UserProvider } from './UserContext'
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import NewProduct from './Pages/Admin/NewProduct'
import Products from './Pages/Admin/Products'
import NewCoupon from './Pages/Admin/NewCoupon'
import Dashboard from './Pages/Admin/Dashboard'
import Categories from './Pages/Admin/Categories'
import CustomOrder from './Pages/Admin/CustomOrders'
import SettingStuffs from './Pages/Admin/SettingStuffs'
import DetailedCustom from './Pages/Admin/DetailedCustom'
import News from './Pages/Admin/News'
import Order from './Pages/Admin/Order'
import Users from './Pages/Admin/User'
import Coupons from './Pages/Admin/Coupons'
import ProfilePage from './Pages/UserPage/ProfilePage'
import AddressPage from './Pages/UserPage/AddressPage'
import PurchasePage from './Pages/UserPage/PurchasePage'
import BicaCoinPage from './Pages/UserPage/BicaCoinPage'
import LoginCard from './components/features/LoginCard'
import VNPaySuccess from './Pages/VNPay/Success'

import GeneralPolicy from './Pages/NaviFooter/Policy/GeneralPolicy'
import PaymentPolicy from './Pages/NaviFooter/Policy/PaymentPolicy'
import ReturnPolicy from './Pages/NaviFooter/Policy/ReturnPolicy'
import SecurePolicy from './Pages/NaviFooter/Policy/SecurePolicy'
import About from './Pages/NaviFooter/Information/About'
import Contact from './Pages/NaviFooter/Information/Contact'
import Shipper from './Pages/ShipperPage'
import Compare from './Pages/Compare'
import VoucherPage from './Pages/UserPage/VoucherPage'
import CustomPurchasePage from './Pages/UserPage/CustomPurchasePage'
function App() {
    return (
        <div>
            <Routes>
                <Route element={<UserLayout />} path="/">
                    <Route element={<Home />} path="" />
                    <Route element={<Shipper />} path="/shipper" />
                    <Route element={<LoginCard />} path="/login" />
                    <Route
                        element={
                            <UserProvider>
                                <ProductDetails />
                            </UserProvider>
                        }
                        path="/products/:productId"
                    />
                    <Route element={<About />} path="/About" />
                    <Route element={<Contact />} path="/Contact" />
                    <Route element={<GeneralPolicy />} path="/GeneralPolicy" />
                    <Route element={<PaymentPolicy />} path="/PaymentPolicy" />
                    <Route element={<ReturnPolicy />} path="/ReturnPolicy" />
                    <Route element={<SecurePolicy />} path="/SecurePolicy" />
                    <Route
                        element={
                            <UserProvider>
                                <ProfilePage />
                            </UserProvider>
                        }
                        path="/user/profile"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <AddressPage />
                            </UserProvider>
                        }
                        path="/user/address"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <PurchasePage />
                            </UserProvider>
                        }
                        path="/user/purchase"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <CustomPurchasePage />
                            </UserProvider>
                        }
                        path="/user/customPurchase"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <VoucherPage />
                            </UserProvider>
                        }
                        path="/user/voucher"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <Cart />
                            </UserProvider>
                        }
                        path="cart"
                    />

                    <Route
                        element={
                            <UserProvider>
                                <BicaCoinPage />
                            </UserProvider>
                        }
                        path="/user/bicacoin"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <Cart />
                            </UserProvider>
                        }
                        path="cart"
                    />
                    <Route element={<FilteredPage />} path="/filter/:filter/:keyword" />
                    <Route
                        element={
                            <UserProvider>
                                <Custom />
                            </UserProvider>
                        }
                        path="/Custom"
                    />
                    <Route element={<VNPaySuccess />} path="/test" />
                    <Route element={<Custom />} path="/custom" />
                    <Route element={<Compare />} path="/Compare" />
                </Route>

                <Route
                    element={
                        <UserProvider>
                            <AdminLayout />
                        </UserProvider>
                    }
                    path="/admin"
                >
                    <Route
                        element={
                            <UserProvider>
                                <Dashboard />
                            </UserProvider>
                        }
                        path=""
                    />
                    <Route
                        element={
                        <UserProvider>
                            <NewCoupon />
                        </UserProvider>
                        } path="NewCoupon" />
                    <Route
                        element={
                            <UserProvider>
                                <NewProduct />
                            </UserProvider>
                        } path="NewProduct" />
                    <Route
                        element={
                            <UserProvider>
                                <Products />
                            </UserProvider>
                        }
                        path="Products"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <Categories />
                            </UserProvider>
                        }
                        path="Categories"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <Order />
                            </UserProvider>
                        }
                        path="Orders"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <CustomOrder />
                            </UserProvider>
                        }
                        path="CustomOrders"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <SettingStuffs />
                            </UserProvider>
                        }
                        path="customSettings"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <DetailedCustom />
                            </UserProvider>
                        }
                        path="CustomOrders/:orderId"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <Users />
                            </UserProvider>
                        }
                        path="Users"
                    />
                    <Route
                        element={
                            <UserProvider>
                                <News />
                            </UserProvider>
                        }
                        path="news"
                    />
                    <Route element={<Coupons />} path="Coupons" />
                </Route>
            </Routes>
        </div>
    )
}

export default App
