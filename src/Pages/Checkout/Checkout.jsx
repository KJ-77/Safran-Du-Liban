import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Truck,
  Lock,
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  ChatText,
} from "@phosphor-icons/react";
import Container from "Components/Container/Container";
import { useAuth } from "context/AuthContext";
import { useCart } from "context/CartContext";
import { useToast } from "Components/Toast/Toast";
import useAuthenticatedPost from "Hooks/useAuthenticatedPost";
import { IMAGE_URL } from "Utilities/BASE_URL";

const Checkout = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { cart, getCartTotal, getCartItemsCount } = useCart();
  const { showToast, ToastComponent } = useToast();
  const { postData } = useAuthenticatedPost();

  // Form state
  const [formData, setFormData] = useState({
    contactName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    specialInstructions: "",
    preferredDeliveryTime: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if not logged in or not verified
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!user?.verified) {
      navigate("/verify-email", { state: { email: user?.email } });
      return;
    }

    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/cart");
      return;
    }
  }, [isLoggedIn, user, cart, navigate]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        contactName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
      }));
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        deliveryInfo: formData,
        paymentMethod,
      };

      const response = await postData("/orders/checkout", orderData);

      if (response.success) {
        showToast("Order placed successfully!", "success");
        navigate(`/checkout/success/${response.data.orderNumber}`);
      } else {
        showToast(response.message || "Failed to place order", "error");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showToast("Failed to place order. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (!cart || !cart.products || cart.products.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={18} />
              <span>Back to Cart</span>
            </button>
            <h1 className="text-3xl font-light text-gray-800">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Delivery Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Truck size={16} className="text-primary" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-800">
                      Delivery Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contact Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${errors.contactName
                            ? "border-red-500"
                            : "border-gray-200"
                          }`}
                        placeholder="Enter your full name"
                      />
                      {errors.contactName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactName}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${errors.phoneNumber
                              ? "border-red-500"
                              : "border-gray-200"
                            }`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Street Address */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${errors.street ? "border-red-500" : "border-gray-200"
                          }`}
                        placeholder="Street address, apartment, etc."
                      />
                    </div>
                    {errors.street && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${errors.city ? "border-red-500" : "border-gray-200"
                          }`}
                        placeholder="Enter city"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                        placeholder="Enter state/province"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Postal Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                        placeholder="Enter postal code"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${errors.country ? "border-red-500" : "border-gray-200"
                          }`}
                        placeholder="Enter country"
                      />
                      {errors.country && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.country}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Delivery Instructions
                    </label>
                    <div className="relative">
                      <ChatText
                        size={16}
                        className="absolute left-3 top-3 text-gray-400"
                      />
                      <textarea
                        name="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-none"
                        placeholder="Any special instructions for delivery..."
                      />
                    </div>
                  </div>

                  {/* Preferred Delivery Time */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Delivery Time
                    </label>
                    <div className="relative">
                      <Clock
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="preferredDeliveryTime"
                        value={formData.preferredDeliveryTime}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                        placeholder="e.g., Morning (9AM-12PM), Afternoon (1PM-5PM)"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <CreditCard size={16} className="text-primary" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-800">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {/* Cash on Delivery */}
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === "cash_on_delivery"
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                        }`}
                      onClick={() => setPaymentMethod("cash_on_delivery")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash_on_delivery"
                            checked={paymentMethod === "cash_on_delivery"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-primary"
                          />
                          <div>
                            <div className="font-medium text-gray-800">
                              Cash on Delivery
                            </div>
                            <div className="text-sm text-gray-500">
                              Pay when your order arrives
                            </div>
                          </div>
                        </div>
                        <Truck size={20} className="text-gray-400" />
                      </div>
                    </div>

                    {/* Online Payment - Disabled */}
                    <div className="border-2 border-gray-200 rounded-lg p-4 opacity-50 cursor-not-allowed bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="online_payment"
                            disabled
                            className="w-4 h-4 text-primary"
                          />
                          <div>
                            <div className="font-medium text-gray-800">
                              Online Payment
                            </div>
                            <div className="text-sm text-gray-500">
                              Available soon
                            </div>
                          </div>
                        </div>
                        <CreditCard size={20} className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-3">
                    <Lock
                      size={16}
                      className="text-blue-600 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-sm text-blue-800">
                      <strong>Secure Checkout:</strong> Your personal
                      information is protected and encrypted.
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-lg font-medium text-lg hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Lock size={20} />
                      Place Order • {formatPrice(getCartTotal())}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-medium text-gray-800 mb-6">
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cart.products.map((item, index) => (
                    <div key={item._id || index} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={`${IMAGE_URL}/${item.image}`}
                          alt={item.productName || "Product"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6'/%3E%3Ctext x='32' y='32' font-family='Arial' font-size='8' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">
                          {item.productName ||
                            item.productId?.name ||
                            "Unknown Product"}
                        </h3>
                        <div className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </div>
                        <div className="font-medium text-gray-800">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getCartItemsCount()} items)</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-medium text-gray-800">
                      <span>Total</span>
                      <span>{formatPrice(getCartTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <ToastComponent />
    </div>
  );
};

export default Checkout;
