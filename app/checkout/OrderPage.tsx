'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useCart } from "@/app/context/CartContext";

import { FaPaypal, FaBitcoin, FaApple, FaCcVisa } from "react-icons/fa";
import { SiCashapp, SiVenmo, SiZelle } from "react-icons/si";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { useLanguage } from "@/app/context/LanguageContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import QRCodeWrapper from "../components/components/QRCodeWrapper";




interface AddressDetails {
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

interface BillingDetails extends AddressDetails {
  createAccount?: boolean;
  shipToDifferentAddress?: boolean;
  orderNotes?: string;
  password?: string; 
}

type ShippingOption = {
  label: string;
  cost: number;
};

interface AddressFormProps {
  data: AddressDetails;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ data, onChange }) => (
  <div className="space-y-4">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <label className="block font-medium mb-1">First name <span className="text-red-700">*</span></label>
        <input
          type="text"
          name="firstName"
          value={data.firstName}   // ✅ use the prop
          onChange={onChange}      // ✅ use the prop
          className="w-full border border-gray-300 px-3 py-2 rounded-full"
        />
      </div>
      <div className="flex-1">
        <label className="block font-medium mb-1">Last name <span className="text-red-700">*</span></label>
        <input
          type="text"
          name="lastName"
          value={data.lastName}   // ✅ use the prop
          onChange={onChange}     // ✅ use the prop
          className="w-full border border-gray-300 px-3 py-2 rounded-full"
          required
        />
      </div>
    </div>

    <div>
      <label className="block font-medium mb-1">Company name (optional)</label>
      <input
        type="text"
        name="companyName"
        value={data.companyName}
        onChange={onChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-full"
      />
    </div>

    <div>
      <label className="block font-medium mb-1">Email <span className="text-red-700">*</span></label>
      <input
        type="email"
        name="email"
        value={data.email}
        onChange={onChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-full"
        required
      />
    </div>

    <div>
      <label className="block font-medium mb-1">Phone <span className="text-red-700">*</span></label>
      <input
        type="tel"
        name="phone"
        value={data.phone}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-full"
        required
      />
    </div>

    <div>
      <label className="block font-medium mb-1">Country / Region <span className="text-red-700">*</span></label>
      <input
        type="text"
        name="country"
        value={data.country}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-full"
        required
      />
    </div>

    <div>
      <label className="block font-medium mb-1">Street Address <span className="text-red-700">*</span></label>
      <input
        type="text"
        name="streetAddress"
        value={data.streetAddress}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-full"
        required
      />
    </div>

    <div>
      <label className="block font-medium mb-1">City <span className="text-red-700">*</span></label>
      <input
        type="text"
        name="city"
        value={data.city}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-full"
        required
      />
    </div>

    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <label className="block font-medium mb-1">State <span className="text-red-700">*</span></label>
        <input
          type="text"
          name="state"
          value={data.state}
          onChange={onChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-full"
          required
        />
      </div>
      <div className="flex-1">
        <label className="block font-medium mb-1">ZIP Code <span className="text-red-700">*</span></label>
        <input
          type="text"
          name="zipCode"
          value={data.zipCode}
          onChange={onChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-full"
          required
        />
      </div>
    </div>
  </div>
);





const CheckOutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<'Cash App' | 'Paypal' | 'Zelle' | 'Apple Pay' | 'Venmo' | 'crypto' | ''>('');

  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [cryptoWarning, setCryptoWarning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
 
  const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const router = useRouter();
    const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { cartItems, totalPrice, selectedShipping, setSelectedShipping } = useCart();
  const effectiveShippingCost = selectedShipping?.cost ?? 40; // default $40 if no shipping selected

  



 

  const {  language } = useLanguage();
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
    zipCode: '',
    createAccount: false,
    shipToDifferentAddress: false,
    orderNotes: '',
    
  });
  const [shippingDetails, setShippingDetails] = useState<AddressDetails>({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Recalculate subtotal, tax, and total whenever quantities change
  const subtotal = cartItems.reduce((acc, item) => {
  const qty = quantities[item.slug] || 1;
  return acc + Number(item.price) * qty; // convert price to number
}, 0);



const freeShippingThreshold = 400;
const remaining = freeShippingThreshold - totalPrice;

const salesTaxAmount = subtotal * 0.07;
const total = subtotal + (shippingCost || 0) + salesTaxAmount - discount;

  const calculateShipping = () => {
  if (subtotal > 2000) {
    setShippingCost(200); // heavy items like engines
  } else if (subtotal > 500) {
    setShippingCost(100); // smaller transmissions
  } else {
    setShippingCost(50);  // small parts
  }
};
React.useEffect(() => {
  calculateShipping();
}, [subtotal]);




const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch("/api/secure-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginDetails),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message || "Logged in successfully");
      setShowLogin(false);
      // Optionally: set user in context or localStorage
    } else {
      toast.error(data.error || "Invalid email or password");
    }
  } catch (err) {
    console.error(err);
    toast.error("Login failed. Try again.");
  }
};


const handleRegister = async ({ email, password }: { email: string, password: string }) => {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      toast.success(data.message || "Account created successfully");
      setBillingDetails(prev => ({ ...prev, createAccount: false }));
      // Optionally log them in automatically
    } else {
      toast.error(data.error || "Registration failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to register. Try again.");
  }
};


useEffect(() => {
  const savedShipping = localStorage.getItem("selectedShipping");
  if (savedShipping) {
    const parsed = JSON.parse(savedShipping);
    setSelectedShipping(parsed.label);
    setShippingCost(parsed.cost);
  }
}, []);


// Coupon application
const applyCoupon = async () => {
  if (!couponCode) return;

  try {
    const response = await fetch("/api/cart/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponCode }),
    });

    const data = await response.json();

    if (data.success) {
      setDiscount(data.cart.discount || 0);
      alert(`Coupon applied! You saved $${data.cart.discount?.toFixed(2) || 0}`);
    } else {
      setDiscount(0);
      // Show server message (like minOrderValue requirement)
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    setDiscount(0);
    alert("Error applying coupon. Please try again.");
  }
};



  
  // Generic input change for billing & shipping
const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  type: 'billing' | 'shipping' = 'billing'
) => {
  const { name, value, type: inputType } = e.target;

  if (inputType === 'checkbox') {
    const checked = (e.target as HTMLInputElement).checked;
    if (type === 'billing') {
      setBillingDetails(prev => ({ ...prev, [name]: checked }));
    } else {
      setShippingDetails(prev => ({ ...prev, [name]: checked }));
    }
  } else {
    // Only update text / textarea values here
    if (type === 'billing') {
      setBillingDetails(prev => ({ ...prev, [name]: value }));
    } else {
      setShippingDetails(prev => ({ ...prev, [name]: value }));
    }
  }
};




  const [showLogin, setShowLogin] = useState(false);
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  
  // Add this inside your component
const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setLoginDetails(prev => ({ ...prev, [name]: value }));
};

const [accountDetails, setAccountDetails] = useState({
  email: '',
  password: '',
});

const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setAccountDetails(prev => ({ ...prev, [name]: value }));
};


  
  
const handlePlaceOrder = async () => {
  setOrderStatus('idle');
  setCryptoWarning(false);

  if (paymentMethod === 'crypto') {
    setCryptoWarning(true);
    return;
  }

  const orderData = {
  cartItems,
  subtotal,
  discount,
  shippingCost: effectiveShippingCost, // 👈 Add shipping
  salesTax: salesTaxAmount,            // 👈 Add tax
  grandTotal: subtotal + effectiveShippingCost + salesTaxAmount - discount, // 👈 Add grand total
  paymentMethod,
  billingDetails,
  // 👇 Also send shipping method if needed
  shippingMethod: selectedShipping?.label || "Standard Shipping",
};

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error('Failed to place order');

    // ✅ get backend response (must include orderId)
    const { orderId } = await response.json();

    console.log('Order placed successfully:', orderId);
    setOrderStatus('success');

    // ✅ redirect to confirmation page
    router.push(`/order-confirmation/${orderId}`);

  } catch (error) {
    console.error('Error placing order:', error);
    setOrderStatus('error');
  }
};


  const [showCoupon, setShowCoupon] = useState(false);

  const paymentIcons: Record<string, React.ReactNode> = {
  'Cash App': <SiCashapp className="w-5 h-5" />,
  'Paypal': <FaPaypal className="w-5 h-5" />,
  'Zelle': <SiZelle className="w-5 h-5" />,
  'Apple Pay': <FaApple className="w-5 h-5" />,
  'Venmo': <SiVenmo className="w-5 h-5" />,
  'crypto': <FaBitcoin className="w-5 h-5" />,
};

  

  const handleCopy = () => {
    navigator.clipboard.writeText("bc1qvar3m86w6d2s33gq63jrew6a5nqdxg34ytqnwd");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

   
  return (
    <div className="mt-20 lg:mt-44">
          {/* Full-width black section */}
          <div className="bg-black text-white py-8 text-center w-full">
            
    
            
           {/* Breadcrumb + Shopping Cart link inline on md+ screens */}
    <div className="mt-2 flex justify-center items-center text-sm space-x-2">
      {/* Shopping Cart link only on md+ screens */}
      <Link
        href="/cart-drawer"
        className="hidden md:inline text-white font-bold hover:underline text-4xl"
      >
        shopping Cart
      </Link>
      
      {/* Arrow separator only visible on md+ */}
      <span className="hidden md:inline text-white">→</span>

      {/* Current page */}
      <span className="text-white font-bold text-4xl">Checkout</span>
    </div>
          </div>
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Order Page Header Section */}
          <div className="w-full space-y-3 lg:col-span-3">
<div className="mt-4 relative" >
  <span className="text-gray-700">Returning customer? </span>
  <button
    type="button"
    onClick={() => setShowLogin(!showLogin)}
    className="text-red-700 font-medium underline hover:text-red-700 transition"
  >
    Click here to login
  </button>

  {showLogin && (
    <div className="absolute mt-2 w-full max-w-sm bg-white border border-gray-300 rounded-lg shadow-lg p-6">
      
      {/* Informational text */}
      <p className="text-sm text-gray-700 mb-4">
        If you have shopped with us before, please enter your details below.
        <br />
        If you are a new customer, please proceed to the Billing section.
      </p>

      <form onSubmit={handleLogin}className="space-y-4">
        
        {/* Email */}
        <div  className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
    type="email"
    name="email"
    value={loginDetails.email}
    onChange={handleLoginInputChange}
    className="w-full border border-gray-300 px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    required
    placeholder="Enter your email"
  />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
         <div className="relative mt-3">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={loginDetails.password}
     onChange={handleLoginInputChange}
    className="w-full border border-gray-300 px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
    required
    placeholder="Enter your password"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 px-2"
  >
    {showPassword ? (
      <AiOutlineEyeInvisible className="pointer-events-none" />
    ) : (
      <AiOutlineEye className="pointer-events-none" />
    )}
  </button>
</div>
        </div>

        {/* Remember me and lost password */}
        <div className="flex items-center justify-between text-sm">
          <Link
            href="/forgot-password"   
            className="text-red-700 underline hover:text-red-800 transition"
          >
            Lost your password?
          </Link>
        </div>

        {/* Login button */}
        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition font-medium"
        >
          Login
        </button>
      </form>
    </div>
  )}
</div>

          <div>
  <span className="text-gray-700">Have a coupon? </span>
  <button
    type="button"
    onClick={() => setShowCoupon(!showCoupon)}
    className="text-red-700 font-medium underline hover:text-red-800 transition"
  >
    Click here to enter your code
  </button>
</div>

{/* Coupon Input (only shows when toggled) */}
{showCoupon && (
  <div className="flex space-x-2 mt-3">
    <input
      type="text"
      placeholder="Coupon code"
      onChange={(e) => setCouponCode(e.target.value)}
      className="flex-1 border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="button"
      onClick={applyCoupon}
      className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
    >
      Apply Coupon
    </button>
  </div>
)}
          {/* Divider */}
<hr className="my-3 border-dashed border-gray-300" />

{/* Free shipping bar */}
{totalPrice >= freeShippingThreshold ? (
  <div>
    <span className="font-medium text-gray-800">
      Your order qualifies for free shipping!
    </span>
    <div className="w-full bg-green-200 rounded-full mt-1 h-2">
      <div
        className="bg-red-700 h-2 rounded-full transition-all"
        style={{ width: "100%" }}
      />
    </div>
  </div>
) : (
  <div>
    <span className="font-medium text-gray-800">
      Add ${remaining.toLocaleString()} more to qualify for free shipping.
    </span>
    <div className="w-full bg-red-200 rounded-full mt-1 h-2">
      <div
        className="bg-red-700 h-2 rounded-full transition-all"
        style={{
          width: `${(totalPrice / freeShippingThreshold) * 100}%`,
        }}
      />
    </div>
  </div>
)}

          {/* Billing Details */}
          <div className="w-full space-y-3 lg:col-span-3">
          {/* Billing Details */}
          <div className="space-y-4 p-6 rounded-lg shadow-md mt-6 bg-white">
            <h2 className="text-lg font-bold uppercase mb-6 tracking-wide">Billing Details</h2>
            <AddressForm
              data={billingDetails}
              onChange={(e) => handleInputChange(e, 'billing')}
            />
            {/* Checkboxes */}
            <div className="flex flex-col gap-3 mt-6">
             <label className="inline-flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    name="createAccount"
    checked={billingDetails.createAccount || false}
  onChange={(e) => handleInputChange(e, 'billing')}
    className="form-checkbox accent-blue-600"
  />
  <span className="font-semibold">Create an account?</span>
</label>

{billingDetails.createAccount && (
  <div className="mt-4 space-y-2">
    <input
      type="email"
      name="email"
      value={billingDetails.email || ""}
      onChange={(e) => handleInputChange(e, 'billing')}
      placeholder="Email"
      required
      className="w-full border rounded-full px-3 py-2"
    />
    <input
      type="password"
      name="password"
      value={billingDetails.password || ""}
      onChange={(e) => handleInputChange(e, 'billing')}
      placeholder="Password"
      required
      className="w-full border rounded-full px-3 py-2"
    />
    <button
      type="button"
      onClick={async () => {
        if (!billingDetails.email || !billingDetails.password) {
          toast.error("Email and password are required");
          return;
        }
        await handleRegister({
          email: billingDetails.email,
          password: billingDetails.password
        });
      }}
      className="bg-red-700 text-white px-4 py-2 rounded-md mt-2"
    >
      Create Account
    </button>
  </div>
)}

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="shipToDifferentAddress"
                  checked={billingDetails.shipToDifferentAddress || false}
                  onChange={(e) => handleInputChange(e, 'billing')}
                  className="form-checkbox accent-blue-600"
                />
                <span className="font-semibold">Ship to a different address?</span>
              </label>
            </div>
            {/* Shipping Details */}
            {billingDetails.shipToDifferentAddress && (
              <div className="space-y-4 p-6 rounded-lg shadow-md mt-6 bg-white">
                <h2 className="text-lg font-bold uppercase mb-6 tracking-wide">Shipping Details</h2>
                <AddressForm
                  data={shippingDetails}
                  onChange={(e) => handleInputChange(e, 'shipping')}
                />
              </div>
            )}
            {/* Order notes */}
            <div className="mt-4">
              <label htmlFor="orderNotes" className="block font-medium mb-1">Order notes (optional)</label>
              <textarea
                id="orderNotes"
                name="orderNotes"
                value={billingDetails.orderNotes || ''}
  onChange={(e) => handleInputChange(e, 'billing')}
                rows={4}
                placeholder="Notes about your order, e.g. special notes for delivery."
                className="w-full border border-gray-300 rounded-md px-3 py-2 resize-y"
              />
            </div>
          </div>
        </div>
        </div>
        {/* Right: Cart Summary & Payment */}
{/* Right: Cart Summary & Payment */}
<div className="space-y-6 bg-white border border-gray-200 p-8 rounded-lg shadow-sm lg:col-span-2">
  {/* Order Header */}
  <div className="border-b border-gray-200 pb-4">
    <h2 className="text-2xl font-bold text-gray-800">Your Order</h2>
  </div>

  {/* Order Items */}
  <div className="space-y-4">
    {cartItems.map((item) => {
      const priceNum = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return (
        <div key={item.slug} className="flex items-start gap-4 pb-4 border-b border-gray-100">
          <div className="relative flex-shrink-0">
            <img
              src={item.mainImage}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md border border-gray-200"
            />
            <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
              {item.quantity}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 mb-1">{item.name}</p>
            <p className="text-sm text-gray-600">
              ${priceNum.toFixed(2)} × {item.quantity}
            </p>
            <p className="text-base font-bold text-gray-900 mt-1">
              ${(priceNum * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      );
    })}
  </div>

  {/* Order Summary */}
  <div className="bg-gray-50 p-5 rounded-md space-y-3">
    <div className="flex justify-between text-gray-700">
      <span className="font-medium">Subtotal</span>
      <span className="font-semibold">${subtotal.toFixed(2)}</span>
    </div>

    {discount > 0 && (
      <div className="flex justify-between text-green-600 font-medium">
        <span>Coupon Discount</span>
        <span>−${discount.toFixed(2)}</span>
      </div>
    )}

    {/* Shipping Section */}
    <div className="border-t border-gray-200 pt-3">
      <div className="flex justify-between text-gray-700">
        <span className="font-medium">Shipping</span>
        <div className="text-right">
          <p className="font-semibold">
            {selectedShipping ? selectedShipping.label : "Standard Shipping"}
          </p>
          <p className="text-sm text-red-600 font-bold">
            ${effectiveShippingCost.toFixed(2)}
          </p>
        </div>
      </div>
    </div>

    {/* Sales Tax */}
    <div className="flex justify-between text-gray-700">
      <span className="font-medium">Sales Tax (7%)</span>
      <span className="font-semibold">${salesTaxAmount.toFixed(2)}</span>
    </div>

    {/* Grand Total */}
    <div className="border-t-2 border-gray-300 pt-3">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-red-600">
          ${(subtotal + effectiveShippingCost + salesTaxAmount - discount).toFixed(2)}
        </span>
      </div>
    </div>
  </div>

  {/* Calculate Shipping Button */}
  {shippingCost === null && (
    <button
      type="button"
      onClick={calculateShipping}
      className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold shadow-sm"
    >
      Calculate Shipping
    </button>
  )}

  {/* Payment Methods Section */}
  <div className="border-t border-gray-200 pt-6">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h3>
    <div className="space-y-3 bg-gray-50 p-4 rounded-md">
      {['Cash App', 'Paypal', 'Zelle', 'Apple Pay', 'Venmo', 'crypto'].map((method) => (
        <label
          key={method}
          className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <input
            type="radio"
            name="paymentMethod"
            value={method}
            checked={paymentMethod === method}
            onChange={() =>
              setPaymentMethod(
                method as 'Cash App' | 'Paypal' | 'Zelle' | 'Apple Pay' | 'Venmo' | 'crypto'
              )
            }
            className="w-4 h-4 text-blue-600"
          />
          <span className="flex items-center gap-2 font-medium text-gray-800">
            {paymentIcons[method]}
            {method}
          </span>
        </label>
      ))}
    </div>
  </div>

  {/* Payment Instructions */}
  {paymentMethod === 'Cash App' && (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-md">
      <p className="font-bold text-blue-800 mb-3 text-base">
        Cash App Payment Instructions
      </p>
      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
        <li>Open the Cash App mobile app.</li>
        <li>
          Add "cash" to your "Cash App balance" before making the payment to avoid payment failure.
        </li>
        <li>Enter the amount you want to send.</li>
        <li>Tap "Pay."</li>
        <li>
          Contact us via live chat or email for our cashtag:
          <span className="inline-flex items-center gap-1 ml-1">
            <span className="text-blue-700 font-semibold">info@16zip.com</span>
            <button
              onClick={() => navigator.clipboard.writeText('info@16zip.com')}
              className="text-xs text-gray-500 hover:text-gray-700 px-1"
              title="Copy email"
            >
              📋
            </button>
          </span>
        </li>
        <li>Enter the email address, phone number, or "$Cashtag".</li>
        <li>Enter what you are sending the payment for (e.g., "ORDER #7895").</li>
        <li>Tap "Pay."</li>
      </ol>
      <div className="bg-red-50 border border-red-200 p-3 rounded-md mt-3">
        <p className="text-sm text-red-700">
          <strong>Important:</strong> Do not make Cash App payments to our website email 
          <strong> info@16zip.com</strong>. Contact us via live chat or email for our Cash App info. 
          Payments made to our website email will not be validated.
        </p>
      </div>
    </div>
  )}

  {paymentMethod === 'Paypal' && (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-md">
      <p className="font-bold text-blue-800 mb-3 text-base">
        PayPal Payment Instructions
      </p>
      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
        <li>
          After placing your order, contact us via live chat or email to receive our PayPal payment details:
          <span className="inline-flex items-center gap-1 ml-1">
            <span className="text-blue-700 font-semibold">info@16zip.com</span>
            <button
              onClick={() => navigator.clipboard.writeText('info@16zip.com')}
              className="text-xs text-gray-500 hover:text-gray-700 px-1"
              title="Copy email"
            >
              📋
            </button>
          </span>
        </li>
      </ol>
    </div>
  )}

  {paymentMethod === 'Zelle' && (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-md">
      <p className="font-bold text-blue-800 mb-3 text-base">
        Zelle Payment Instructions
      </p>
      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
        <li>Download the Zelle App to get started.</li>
        <li>All you need is the preferred email address or mobile number of the recipient.</li>
        <li>
          Contact us via live chat or email for our Zelle details:
          <span className="inline-flex items-center gap-1 ml-1">
            <span className="text-blue-700 font-semibold">info@16zip.com</span>
            <button
              onClick={() => navigator.clipboard.writeText('info@16zip.com')}
              className="text-xs text-gray-500 hover:text-gray-700 px-1"
              title="Copy email"
            >
              📋
            </button>
          </span>
        </li>
        <li>After payment, send a screenshot to our live chat or email.</li>
        <li>Your order is valid once we receive payment details with your Order ID.</li>
      </ol>
      <div className="bg-red-50 border border-red-200 p-3 rounded-md mt-3">
        <p className="text-sm text-red-700">
          <strong>Important:</strong> Do not make Zelle payments to our website email. 
          Contact us for Zelle info. Payments to website email will not be validated.
        </p>
      </div>
    </div>
  )}

  {paymentMethod === 'Apple Pay' && (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-md">
      <p className="font-bold text-blue-800 mb-3 text-base">
        Apple Pay Payment Instructions
      </p>
      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
        <li>
          Contact us via live chat or email after placing your order to receive Apple Pay information:
          <span className="inline-flex items-center gap-1 ml-1">
            <span className="text-blue-700 font-semibold">info@16zip.com</span>
            <button
              onClick={() => navigator.clipboard.writeText('info@16zip.com')}
              className="text-xs text-gray-500 hover:text-gray-700 px-1"
              title="Copy email"
            >
              📋
            </button>
          </span>
        </li>
      </ol>
    </div>
  )}

  {paymentMethod === 'Venmo' && (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-md">
      <p className="font-bold text-blue-800 mb-3 text-base">
        Venmo Payment Instructions
      </p>
      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
        <li>
          Contact us via live chat or email after placing your order to receive Venmo payment details:
          <span className="inline-flex items-center gap-1 ml-1">
            <span className="text-blue-700 font-semibold">info@16zip.com</span>
            <button
              onClick={() => navigator.clipboard.writeText('info@16zip.com')}
              className="text-xs text-gray-500 hover:text-gray-700 px-1"
              title="Copy email"
            >
              📋
            </button>
          </span>
        </li>
      </ol>
    </div>
  )}

  {paymentMethod === 'crypto' && (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-l-4 border-purple-500 p-6 rounded-md text-center">
      <p className="font-bold text-gray-800 mb-4">Scan QR Code to Pay</p>
      <div className="inline-block bg-white p-4 rounded-lg shadow-md">
        <QRCodeWrapper
          value="bc1qv8wl5n9pe89qv9hptvnhljc0cg57c4j63nrynm"
          size={180}
        />
      </div>
      <p className="text-xs text-gray-600 mt-3">Bitcoin Wallet Address</p>
    </div>
  )}

  {/* Order Status Messages */}
  {orderStatus === 'success' && (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
      <p className="text-sm text-green-800 font-medium">
        ✓ Your order has been successfully placed and is pending payment via <strong>{paymentMethod}</strong>.
      </p>
    </div>
  )}
  
  {orderStatus === 'error' && (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <p className="text-sm text-red-800 font-medium">
        ✗ Something went wrong while placing your order. Please try again.
      </p>
    </div>
  )}

  {cryptoWarning && (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-md">
      <p className="text-sm text-orange-800">
        ⚠ You selected Crypto. Please send payment to the wallet address above and contact us with a screenshot. 
        We will process your order once payment is verified.
      </p>
    </div>
  )}

  {/* Privacy Policy Notice */}
  <p className="text-xs text-gray-600 leading-relaxed">
    Your personal data will be used to process your order, support your experience throughout this website, 
    and for other purposes described in our{' '}
    <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline font-medium">
      privacy policy
    </Link>.
  </p>

  {/* Terms & Conditions */}
  <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        id="terms"
        checked={agreedToTerms}
        onChange={(e) => setAgreedToTerms(e.target.checked)}
        className="w-5 h-5 mt-0.5 text-blue-600 rounded"
      />
      <span className="text-sm text-gray-700">
        I have read and agree to the website{' '}
        <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline font-medium">
          terms and conditions
        </Link>{' '}
        <span className="text-red-600">*</span>
      </span>
    </label>
  </div>

  {/* Place Order Button */}
  <button
    onClick={() => {
      if (!agreedToTerms) {
        alert("You must agree to the terms and conditions before placing your order.");
        return;
      }
      handlePlaceOrder();
    }}
    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
  >
    Place Order
  </button>
</div>
      </div>
    </div>
    </div>
  );
};

export default CheckOutPage;
