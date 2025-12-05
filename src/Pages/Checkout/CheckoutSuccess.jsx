import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  House,
  ArrowRight,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import Container from "Components/Container/Container";
import { useAuth } from "context/AuthContext";
import { useCart } from "context/CartContext";
import useFetch from "Hooks/useFetch";
import useAuthenticatedPost from "Hooks/useAuthenticatedPost";
import { useToast } from "Components/Toast/Toast";

const CheckoutSuccess = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { setCart } = useCart();
  const { fetchData } = useFetch();
  const { postData } = useAuthenticatedPost();
  const { showToast, ToastComponent } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Clear the cart when checkout is successful
    setCart({ products: [], total: 0 });

    // Load order details
    const loadOrderDetails = async () => {
      try {
        setLoading(true);
        // You would need to create an endpoint to get order by order number
        // For now, we'll just show success without order details
        setLoading(false);
      } catch (error) {
        // Error loading order details
        setLoading(false);
      }
    };

    if (orderNumber) {
      loadOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderNumber, isLoggedIn, navigate, fetchData, setCart]);

  const resendConfirmationEmail = async () => {
    if (!orderNumber) {
      showToast("Order number is required to resend email", "error");
      return;
    }

    try {
      setResendingEmail(true);
      const response = await postData(
        `/orders/resend-confirmation/${orderNumber}`
      );

      if (response.success) {
        showToast("Confirmation email has been resent", "success");
      } else {
        showToast(
          response.message || "Failed to resend confirmation email",
          "error"
        );
      }
    } catch (error) {
      console.error("Error resending confirmation email:", error);
      showToast("Failed to resend confirmation email", "error");
    } finally {
      setResendingEmail(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" weight="fill" />
            </div>
            <h1 className="text-3xl font-light text-gray-800 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600">
              Thank you for your order. We'll send you a confirmation email
              shortly.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                Order Confirmation
              </h2>
              {orderNumber && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Order Number:</span>{" "}
                  {orderNumber}
                </div>
              )}
              <div className="text-sm text-gray-600">
                <span className="font-medium">Order Date:</span>{" "}
                {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* What's Next */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800 mb-3">
                What happens next?
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package size={16} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    Order Processing
                  </div>
                  <div className="text-sm text-gray-600">
                    We're preparing your order for delivery
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">
                    Confirmation Call
                  </div>
                  <div className="text-sm text-gray-600">
                    Our team will contact you to confirm delivery details
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck size={16} className="text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Delivery</div>
                  <div className="text-sm text-gray-600">
                    Your order will be delivered to your specified address
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="font-medium text-gray-800 mb-3">Payment Method</h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Truck size={20} className="text-gray-600" />
              <div>
                <div className="font-medium text-gray-800">
                  Cash on Delivery
                </div>
                <div className="text-sm text-gray-600">
                  Pay when your order arrives
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-white text-primary border-2 border-primary py-3 px-6 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <House size={16} />
              Continue Shopping
            </button>

            {/* <button
              onClick={resendConfirmationEmail}
              disabled={resendingEmail}
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {resendingEmail ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <EnvelopeSimple size={16} />
              )}
              Resend Confirmation Email
            </button> */}
          </div>

          {/* Contact Info */}
          <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Need help?</strong> Contact our support team if you have
              any questions about your order.
            </p>
          </div>
        </div>
      </Container>
      <ToastComponent />
    </div>
  );
};

export default CheckoutSuccess;
