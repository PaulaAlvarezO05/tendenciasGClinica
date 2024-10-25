import React, { createContext, useState, useEffect } from 'react';
import { login, getUser } from '../api/Clinica.api';
import { jwtDecode } from 'jwt-decode';
import { Construction } from 'lucide-react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
    const [rol, setRol] = useState(null);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            const decodedToken = jwtDecode(storedToken);
            setRol(decodedToken.rol);
            getUser(decodedToken.user_id).then(response => {
                setName(response.nombres);
                setLastName(response.apellidos);
            });
        }
    }, []);

    const loginUser = async (credentials) => {
        console.log("Intentando iniciar sesión con las credenciales:", credentials);
        
        const { accessToken, refreshToken } = await login(credentials);
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem('refreshToken', refreshToken);
        console.log("token", accessToken, refreshToken)
        console.log("refreshToken", refreshToken)
        const decodedToken = jwtDecode(accessToken);
        const userRole = decodedToken.rol;
        setRol(userRole);

        const user_id = decodedToken.user_id;
        const userResponse = await getUser(user_id);
        setName(userResponse.nombres);
        setLastName(userResponse.apellidos);
    };

    const logout = () => {
        console.log("Cerrando sesión...");
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setToken(null);
        setRefreshToken(null);
        setRol(null);
        setName("");
        setLastName("");
        console.log("Sesión cerrada. Token y rol restablecidos.");
    };

    return (
        <AuthContext.Provider value={{ token, rol, name, lastName, loginUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
