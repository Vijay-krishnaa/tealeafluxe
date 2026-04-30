import { createContext, useCallback, useContext, useState } from "react";
import { toast } from "../components/Toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((product, quantity = 1) => {
    const pId = product._id || product.id;
    setCartItems((prev) => {
      const existing = prev.find((i) => (i._id || i.id) === pId);
      if (existing) {
        return prev.map((i) =>
          (i._id || i.id) === pId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { ...product, id: pId, quantity }];
    });
    if (quantity === 1) {
      toast({ message: `${product.name} added to cart`, type: "success" });
    } else {
      toast({
        message: `${quantity}× ${product.name} added to cart`,
        type: "success",
      });
    }
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((i) => (i._id || i.id) !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      setCartItems((prev) => prev.filter((i) => (i._id || i.id) !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => ((i._id || i.id) === productId ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
