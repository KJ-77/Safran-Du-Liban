import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus } from "@phosphor-icons/react";
import { useAuth } from "context/AuthContext";
import { useCart } from "context/CartContext";
import { useToast } from "Components/Toast/Toast";

const AddToCartButton = ({ product, className = "", color }) => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { addToCart, updateQuantity, getProductQuantity, loading } = useCart();
  const [localLoading, setLocalLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const quantity = product?._id ? getProductQuantity(product._id) : 0;
  const isInCart = quantity > 0;

  // Handle add to cart or authentication redirect
  const handleAddToCart = async () => {
    // Check authentication
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Check verification
    if (!user?.verified) {
      navigate("/verify-email", { state: { email: user?.email } });
      return;
    }

    // Add to cart
    if (!product?._id) {
      showToast("Invalid product data", "error");
      return;
    }

    setLocalLoading(true);
    try {
      const result = await addToCart(product._id, 1);
      if (result.success) {
        showToast(result.message, "success");
      } else {
        showToast(result.message || "Failed to add product to cart", "error");
      }
    } catch (error) {
      showToast("Failed to add product to cart", "error");
    } finally {
      setLocalLoading(false);
    }
  };

  // Handle quantity update
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    if (!product?._id) {
      showToast("Invalid product data", "error");
      return;
    }

    setLocalLoading(true);
    try {
      const result = await updateQuantity(product._id, newQuantity);
      if (!result.success) {
        showToast(result.message || "Failed to update quantity", "error");
      }
    } catch (error) {
      showToast("Failed to update quantity", "error");
    } finally {
      setLocalLoading(false);
    }
  };

  // If product is not in cart, show "Add to Cart" button
  if (!isInCart) {
    return (
      <>
        <button
          onClick={handleAddToCart}
          disabled={loading || localLoading}
          className={`${
            color === "primary"
              ? "bg-secondary text-white"
              : "bg-[#F1F1E9] hover:text-white text-black"
          } hover:bg-primary  w-max mx-auto  px-6 py-3 rounded-md shadow-md hover:bg-opacity-90 transition-all duration-300 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 lg:mt-8 ${className}`}
        >
          {localLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <ShoppingCart size={20} />
              <p className="hidden lg:block "> Add to Cart</p>
            </>
          )}
        </button>
        <ToastComponent />
      </>
    );
  }

  // If product is in cart, show quantity controls
  return (
    <>
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        <div className="flex items-center border border-primary rounded-md">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={loading || localLoading || quantity <= 1}
            className="p-2 text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          <span className="px-4 py-2 font-medium text-primary min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={loading || localLoading}
            className="p-2 text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          onClick={() => navigate("/cart")}
          className="text-primary hover:text-secondary transition-colors font-medium"
        >
          View Cart
        </button>
      </div>
      <ToastComponent />
    </>
  );
};

export default AddToCartButton;
