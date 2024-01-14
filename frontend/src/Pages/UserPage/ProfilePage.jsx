import React, { useContext } from 'react'
import Profile from "../../components/common/Profile";
import UserUtilities from "../../components/common/UserUtilities";
import { UserContext } from '../../UserContext';
import "./styles.css"
import { UserProvider } from '../../UserContext';
import Header from '../../components/common/Header';
import Navbar from '../../components/common/Navbar';
import CategoryNav from '../../components/features/CategoryNav';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    return (

        <div className="user-page">
            <UserProvider>
                <Header />
                <Navbar />
                <CategoryNav
                    parents={[
                        { "name": "Trang chủ", "link": "/" }
                    ]}
                    current="Hồ sơ"></CategoryNav>
                <div className="user-container">
                {user != null ?(<UserUtilities user={user} />) : (<div>Loading...</div>)}
                <div className="user-view">
                        {user != null ? (<Profile user={user} />) : (navigate("/login"))}
                </div>
                </div>
            </UserProvider>
        </div>
    )
}

export default ProfilePage