import { createContext, useContext, useState, useEffect } from "react";
import { checkUserAuth, checkSellerAuth, logoutUser, logoutSeller } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [loading, setLoading] = useState(true);

    const initAuth = async () => {
        setLoading(true);
        try {
            const userRes = await checkUserAuth();
            if (userRes.data.success) setUser(userRes.data.user);
            
            const sellerRes = await checkSellerAuth();
            if (sellerRes.data.success) setIsSeller(true);
        } catch (err) {
            console.log("Auth check failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { initAuth(); }, []);

    const logout = async (type = "user") => {
        try {
            if (type === "seller") {
                await logoutSeller();
                setIsSeller(false);
            } else {
                await logoutUser();
                setUser(null);
            }
            window.location.href = "/login";
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isSeller, setIsSeller, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);