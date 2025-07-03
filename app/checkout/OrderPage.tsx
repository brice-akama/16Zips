'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from "@/app/context/CartContext";
import QRCodeWrapper from '../components/components/QRCodeWrapper';








interface BillingDetails {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

const OrderPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<'Cash App' | 'Paypal' | 'crypto' | ''>('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { cartItems, totalPrice } = useCart();
  const [cryptoWarning, setCryptoWarning] = useState(false);
  const [copied, setCopied] = useState(false);


  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handlePlaceOrder = async () => {
    setOrderStatus('idle');
    setCryptoWarning(false); // reset warning
  
    if (paymentMethod === 'crypto') {
      setCryptoWarning(true); // show crypto warning in UI
      return;
    }
  
    const orderData = {
      cartItems,
      totalPrice,
      paymentMethod,
      billingDetails
    };
  
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) throw new Error('Failed to place order');
  
      const data = await response.json();
      console.log('Order placed successfully:', data);
      setOrderStatus('success');
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderStatus('error');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = () => {
  navigator.clipboard.writeText("bc1qvar3m86w6d2s33gq63jrew6a5nqdxg34ytqnwd");
  setCopied(true);
  setTimeout(() => setCopied(false), 2000); // Hide message after 2 seconds
};

  return (
    <div className="max-w-7xl mx-auto p-6 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6 mt-20">

        {/* Left: Billing Details */}
        <div className="lg:col-span-3 space-y-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Billing Details</h2>
          {['firstName', 'lastName', 'companyName', 'email', 'phone', 'country', 'streetAddress', 'city', 'state', 'zipCode'].map((field, index) => (
            <div key={index}>
              <label className="block font-medium">
                {field.replace(/([A-Z])/g, ' $1').replace('Name', ' Name')}
                {field !== 'companyName' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name={field}
                value={billingDetails[field as keyof BillingDetails]}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md"
                required={field !== 'companyName'}
              />
            </div>
          ))}
        </div>

        {/* Right: Cart Summary & Payment */}
        <div className="space-y-4 bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Cart Summary</h2>
          <div>
            {cartItems.map((item) => (
              <div key={item.slug} className="flex items-center gap-4 border-b pb-2">
                <img src={item.mainImage} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm">${item.price} x {item.quantity}</p>
                  <p className="text-sm font-semibold">Total: ${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <p className="mt-2 text-lg font-bold">Grand Total: ${totalPrice.toFixed(2)}</p>
          </div>

          <h3 className="text-lg font-semibold mt-4">Payment Methods</h3>
          <div className="space-y-2">
            {['Cash App', 'Paypal', 'crypto'].map((method) => (
              <label key={method} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method as 'Cash App' | 'Paypal' | 'crypto')}
                />
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </label>
            ))}
          </div>

         {paymentMethod === 'crypto' && (
  <div className="bg-blue-100 p-4 rounded-md text-sm text-gray-700 space-y-3">
    <p><strong>Send BTC to:</strong></p>
    
    <div className="flex items-center justify-between bg-white p-2 rounded border">
      <span className="break-all font-mono text-gray-800">
      bc1qvar3m86w6d2s33gq63jrew6a5nqdxg34ytqnwd
    </span>
    <button
      onClick={handleCopy}
      className="ml-3 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
    </div>

    <p>Or scan QR code:</p>
    <QRCodeWrapper
      value="bitcoin:bc1qvar3m86w6d2s33gq63jrew6a5nqdxg34ytqnwd"
      size={160}
    />
  </div>
)}


          {orderStatus === 'success' && (
            <p className="text-sm text-green-700 bg-green-100 p-2 rounded-md">
              ✅ Your order has been successfully placed and is pending payment via <strong>{paymentMethod}</strong>.
            </p>
          )}

          {orderStatus === 'error' && (
            <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">
              ❌ Something went wrong while placing your order. Please try again.
            </p>
          )}

          <p className="mt-2 text-sm">
            Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
            <Link href="/privacy-policy" className="text-blue-600 underline">privacy policy</Link>.
          </p>

          {cryptoWarning && (
  <p className="text-sm text-orange-700 bg-orange-100 p-2 rounded-md">
   ⚠️ You selected Crypto. Please send the payment to the wallet address above and contact us with a screenshot of your transaction.We will process your order once we verify the payment.
  </p>
)}


          <button
            onClick={handlePlaceOrder}
            className="w-full bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
