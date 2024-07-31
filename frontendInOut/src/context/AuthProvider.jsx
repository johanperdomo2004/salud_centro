import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../components/config/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLogout, setIsLogout] = useState(false)
    const [expire, setExpire] = useState(false)
    const [user, setUser] = useState(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                return jwtDecode(token);
            } catch (error) {
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser(decoded);
                }
                else {
                    setExpire(true);
                    setUser(null)
                    Cookies.remove('token');
                }
            } catch (error) {
                swal({
                    title: "Error",
                    text: error.response.data.message,
                    icon: `warning`,
                    buttons: true,
                    timer: 2000,
                });
                setUser(null);
            }
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axiosClient.post('validate/validar', credentials);
            const { token } = response.data;
            Cookies.set('token', token);
            const decoded = jwtDecode(token);
            setUser(decoded);
            return decoded
        } catch (error) {
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: `warning`,
                buttons: true,
                timer: 2000,
            });
        }
    };

    const logout = async () => {
        try {
            Cookies.remove('token');
            setUser(null);
            setIsLogout(true)
        } catch (error) {
            swal({
                title: "Error",
                text: error.message,
                icon: `warning`,
                buttons: true,
                timer: 2000,
            });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLogout, setIsLogout, expire, setExpire }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
