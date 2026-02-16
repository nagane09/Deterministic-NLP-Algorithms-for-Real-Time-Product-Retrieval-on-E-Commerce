import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "../../context/CartContext";
import { createOrder, confirmPayment } from "../../api/orders";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ShieldCheck, CreditCard, Lock } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const initializeCheckout = async () => {
    if (!cart?.items?.length) return;
    try {
      const res = await createOrder("Stripe");
      if (res.data.success) {
        setClientSecret(res.data.clientSecret);
      }
    } catch (err) {
      toast.error("Failed to connect to Payment Gateway");
    }
  };

  useEffect(() => {
    initializeCheckout();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);
    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (result.error) {
      toast.error(result.error.message);
      setIsProcessing(false);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        try {
          const confirmRes = await confirmPayment(result.paymentIntent.id);
          if (confirmRes.data.success) {
            toast.success("Order Successful!");
            await refreshCart();
            navigate("/my-orders");
          }
        } catch (err) {
          toast.error("Critical: Payment succeeded but order not synced.");
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border-2 border-gray-100 rounded-2xl bg-gray-50">
        <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <CreditCard size={18} /> Card Information
        </label>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
      </div>
      <button
        disabled={isProcessing || !stripe || !clientSecret}
        className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all disabled:opacity-50"
      >
        {isProcessing ? "Verifying Transaction..." : `Confirm Payment - ₹${cart?.finalAmount}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Secure Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl">
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
            <h3 className="font-bold text-green-800 mb-2">Safe & Secure</h3>
            <p className="text-sm text-green-600">Your data is protected by AES-256 encryption. We never store your card details.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;