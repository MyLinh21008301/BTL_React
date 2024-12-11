import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        setCartItems((prevItems) => [...prevItems, item]);
    };

    const getCartQuantity = () => {
        return cartItems.length;
    };

    const removeFromCart = (itemId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    };
    return (
        <CartContext.Provider value={{ cartItems, addToCart, getCartQuantity, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
}
