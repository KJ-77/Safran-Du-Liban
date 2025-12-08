import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import useAuthenticatedPost from "Hooks/useAuthenticatedPost";
import BASE_URL from "Utilities/BASE_URL";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isLoggedIn } = useAuth();
  const { postData } = useAuthenticatedPost();

  // Load cart when user logs in
  useEffect(() => {
    if (isLoggedIn && user?.verified) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [isLoggedIn, user?.verified]);

  // Load cart from backend
  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCart(result.data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to load cart");
      }
    } catch (err) {
      setError(err.message);
      // Cart loading error
    } finally {
      setLoading(false);
    }
  };

  // Add product to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postData("/cart/add", {
        itemId: productId,
        quantity: quantity,
      });

      if (response.success) {
        await loadCart(); // Reload cart to get updated data
        return { success: true, message: "Product added to cart successfully" };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update product quantity
  const updateQuantity = async (productId, quantity) => {
    if (!cart || !cart.products)
      return { success: false, message: "Cart not loaded" };

    // Store original cart for rollback if needed
    const originalCart = { ...cart };

    try {
      setError(null);

      // Optimistic update - update local state immediately
      setCart((prevCart) => {
        const updatedProducts = prevCart.products.map((product) => {
          // Check if productId exists and has _id property
          if (product.productId && typeof product.productId === 'object' && product.productId._id) {
            if (product.productId._id === productId) {
              const updatedProduct = { ...product, quantity };
              return updatedProduct;
            }
          } else if (product.productId === productId) {
            // Check if productId is a string/number that matches directly
            const updatedProduct = { ...product, quantity };
            return updatedProduct;
          }
          return product;
        });

        // Recalculate total
        const newTotal = updatedProducts.reduce(
          (total, product) => total + product.price * product.quantity,
          0
        );

        return {
          ...prevCart,
          products: updatedProducts,
          total: newTotal,
        };
      });

      // Make API call in background
      const response = await postData("/cart/update-quantity", {
        itemId: productId,
        quantity: quantity,
      });

      if (response.success) {
        return { success: true };
      } else {
        // Rollback on failure
        setCart(originalCart);
        return {
          success: false,
          message: response.message || "Failed to update quantity",
        };
      }
    } catch (err) {
      // Rollback on error
      setCart(originalCart);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Remove product from cart
  const removeFromCart = async (productId) => {
    if (!cart || !cart.products)
      return { success: false, message: "Cart not loaded" };

    // Store original cart for rollback if needed
    const originalCart = { ...cart };

    try {
      setError(null);

      // Optimistic update - remove product immediately
      setCart((prevCart) => {
        const updatedProducts = prevCart.products.filter(
          (product) => {
            // Check if productId exists and has _id property
            if (product.productId && typeof product.productId === 'object' && product.productId._id) {
              return product.productId._id !== productId;
            }
            // Check if productId is a string/number that matches directly
            return product.productId !== productId;
          }
        );

        // Recalculate total
        const newTotal = updatedProducts.reduce(
          (total, product) => total + product.price * product.quantity,
          0
        );

        return {
          ...prevCart,
          products: updatedProducts,
          total: newTotal,
        };
      });

      // Make API call in background
      const response = await postData("/cart/remove", {
        itemId: productId,
      });

      if (response.success) {
        return { success: true };
      } else {
        // Rollback on failure
        setCart(originalCart);
        return {
          success: false,
          message: response.message || "Failed to remove product",
        };
      }
    } catch (err) {
      // Rollback on error
      setCart(originalCart);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await loadCart();
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get product quantity in cart
  const getProductQuantity = (productId) => {
    if (!cart || !cart.products) return 0;
    const product = cart.products.find(
      (p) => {
        // Check if productId exists and has _id property
        if (p.productId && typeof p.productId === 'object' && p.productId._id) {
          return p.productId._id === productId;
        }
        // Check if productId is a string/number that matches directly
        return p.productId === productId;
      }
    );
    return product ? product.quantity : 0;
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return getProductQuantity(productId) > 0;
  };

  // Get cart items count
  const getCartItemsCount = () => {
    if (!cart || !cart.products) return 0;
    return cart.products.reduce(
      (total, product) => total + product.quantity,
      0
    );
  };

  // Get cart total
  const getCartTotal = () => {
    return cart?.total || 0;
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    getProductQuantity,
    isInCart,
    getCartItemsCount,
    setCart,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
