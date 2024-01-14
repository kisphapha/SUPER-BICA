import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    async function checkUser() {
        const storedUser = sessionStorage.getItem('loginedUser');
        if (storedUser) {
            if (storedUser != 0) {
                const parsedUser = JSON.parse(storedUser)
                const userObject = parsedUser.userData
                const check = await axios.get('http://localhost:3000/users/' + userObject.Email)
                if (userObject.Role == check.data.Role) {
                    const token = parsedUser.token
                    console.log(token)
                    const response = await axios.get('http://localhost:3000/users/token', {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    })
                    if (response.data) {
                        if (userObject.Point != check.data.Point) userObject.Point = check.data.Point
                        userObject.token = token
                        console.log(userObject)
                        setUser(userObject);
                    }
                }
            }
        }
    }

    useEffect(() => {
        checkUser()
    }, []);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};