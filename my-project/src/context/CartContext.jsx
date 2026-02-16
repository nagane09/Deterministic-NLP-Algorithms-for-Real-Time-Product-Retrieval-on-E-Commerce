import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart, updateCartQuantity, removeFromCart } from "../api/cart";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setCartLoading(true);
    try {
      const res = await getCart();
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const handleAddToCart = async (productId, variantId = null, quantity = 1) => {
    try {
      const res = await addToCart(productId, variantId, quantity);
      if (res.data.success) {
        setCart(res.data.cart);
        toast.success("Added to cart");
        return { success: true };
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
      return { success: false };
    }
  };

  const handleUpdateQuantity = async (productId, variantId, quantity) => {
    if (quantity < 1) return;
    
    try {
      const res = await updateCartQuantity(productId, variantId, quantity);
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      toast.error("Could not update quantity");
    }
  };

  const handleRemoveItem = async (productId, variantId) => {
    try {
      const res = await removeFromCart(productId, variantId);
      if (res.data.success) {
        setCart(res.data.cart);
        toast.success("Item removed");
      }
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        handleAddToCart,
        handleUpdateQuantity,
        handleRemoveItem,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);