import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash,
  ShoppingBag,
  ArrowLeft,
} from "@phosphor-icons/react";
import Container from "Components/Container/Container";
import { useAuth } from "context/AuthContext";
import { useCart } from "context/CartContext";
import { useToast } from "Components/Toast/Toast";
import { IMAGE_URL } from "Utilities/BASE_URL";

const Cart = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, loading: authLoading } = useAuth();
  const {
    cart,
    loading: cartLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  } = useCart();
  const { showToast, ToastComponent } = useToast();

  // Local loading states for individual products
  const [productLoading, setProductLoading] = useState({});
  const [removingProduct, setRemovingProduct] = useState({});

  // Redirect if not logged in or not verified (only after auth is loaded)
  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!user?.verified) {
      navigate("/verify-email", { state: { email: user?.email } });
      return;
    }
  }, [isLoggedIn, user, navigate, authLoading]);

  // Handle quantity change
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setProductLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      const result = await updateQuantity(productId, newQuantity);
      if (!result.success) {
        showToast(result.message || "Failed to update quantity", "error");
      }
    } catch (error) {
      showToast("Failed to update quantity", "error");
    } finally {
      setProductLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Handle remove product
  const handleRemoveProduct = async (productId) => {
    setRemovingProduct((prev) => ({ ...prev, [productId]: true }));

    try {
      const result = await removeFromCart(productId);
      if (result.success) {
        showToast("Product removed from cart", "success");
      } else {
        showToast(result.message || "Failed to remove product", "error");
      }
    } catch (error) {
      showToast("Failed to remove product", "error");
    } finally {
      setRemovingProduct((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      const result = await clearCart();
      if (result.success) {
        showToast("Cart cleared successfully", "success");
      } else {
        showToast("Failed to clear cart", "error");
      }
    }
  };

  // Loading state
  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 sm:py-16 md:py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-primary"></div>
        <ToastComponent />
      </div>
    );
  }

  // Empty cart state
  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 sm:py-16 md:py-20 px-4">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 md:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ShoppingCart
                  size={32}
                  weight="light"
                  className="text-primary sm:size-36 md:size-42"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-light text-gray-800 mb-2 sm:mb-3">
                Your cart is empty
              </h1>
              <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
                Looks like you haven't added any products to your cart yet.
              </p>
              <button
                onClick={() => navigate("/our-products")}
                className="bg-primary text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-opacity-90 transition-all 
                  duration-300 font-medium inline-flex items-center gap-2 shadow-sm text-sm sm:text-base"
              >
                <ArrowLeft size={18} className="sm:size-20" />
                Continue Shopping
              </button>
            </div>
          </div>
        </Container>
        <ToastComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <button
              onClick={() => navigate("/our-products")}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-2 sm:mb-4 text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="sm:size-20" />
              <span>Continue Shopping</span>
            </button>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-light text-gray-800">
                Shopping Cart
                <span className="text-base sm:text-lg text-gray-500 ml-2 sm:ml-3">
                  ({getCartItemsCount()}{" "}
                  {getCartItemsCount() === 1 ? "item" : "items"})
                </span>
              </h1>

              {cart?.products?.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Trash size={14} className="sm:size-16" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {cart?.products
                  .filter((item) => item.productId && item.productId._id)
                  .map((item, index, filteredArray) => (
                    <div
                      key={item._id || index}
                      className={`p-4 sm:p-5 md:p-6 ${
                        index !== filteredArray.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      } hover:bg-gray-50 transition-colors`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="w-full sm:w-24 h-40 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={`${IMAGE_URL}/${item?.image}`}
                            alt={item.productId?.name || "Product"}
                            className="w-full h-full object-cover object-center"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                              {item.productId?.name || "Product Name"}
                            </h3>
                            <p className="font-medium text-primary text-sm sm:text-base">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 line-clamp-2">
                            {item.productId?.description?.substring(0, 100) ||
                              "No description available"}
                          </p>

                          {/* Quantity and Actions */}
                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-200 rounded-md">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId._id,
                                    item.quantity - 1
                                  )
                                }
                                className="p-1 sm:p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={
                                  item.quantity <= 1 ||
                                  productLoading[item.productId._id]
                                }
                              >
                                <Minus size={12} className="sm:size-14" />
                              </button>
                              <span className="px-3 sm:px-4 py-1 font-medium min-w-[2rem] sm:min-w-[2.5rem] text-center flex items-center justify-center text-sm sm:text-base">
                                {productLoading[item.productId._id] ? (
                                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.productId._id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-1 sm:p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={productLoading[item.productId._id]}
                              >
                                <Plus size={12} className="sm:size-14" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() =>
                                handleRemoveProduct(item.productId._id)
                              }
                              className="text-gray-400 hover:text-red-500 transition-colors text-xs sm:text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={removingProduct[item.productId._id]}
                            >
                              {removingProduct[item.productId._id] ? (
                                <div className="w-2 h-2 sm:w-3 sm:h-3 border-t-transparent border-2 border-red-500 rounded-full animate-spin mr-1"></div>
                              ) : (
                                <Trash size={12} className="sm:size-14 mr-1" />
                              )}
                              {removingProduct[item.productId._id]
                                ? "Removing..."
                                : "Remove"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-4 order-first lg:order-last mb-6 lg:mb-0">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 md:p-6 sticky top-24">
                <h2 className="text-lg sm:text-xl font-light text-gray-800 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
                  Order Summary
                </h2>

                {/* Order Details */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-800">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium text-gray-800">Free</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="font-medium text-gray-800">$0.00</span>
                  </div>
                  <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800 text-sm sm:text-base">
                        Total
                      </span>
                      <span className="font-semibold text-base sm:text-lg text-primary">
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  className="w-full bg-primary text-white py-2 sm:py-3 rounded-lg hover:bg-opacity-90 transition-all 
                  duration-300 font-medium flex items-center justify-center gap-2 shadow-sm mb-3 text-sm sm:text-base"
                  onClick={() => navigate("/checkout")}
                >
                  <ShoppingBag
                    size={18}
                    className="sm:size-20"
                    weight="regular"
                  />
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <ToastComponent />
    </div>
  );
};

export default Cart;
