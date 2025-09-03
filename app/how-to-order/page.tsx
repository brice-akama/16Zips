// app/pages/how-to-order/page.tsx
'use client';

import React from 'react';

const HowToOrderPage: React.FC = () => {
  return (
        <div className="mt-20 lg:mt-40">
      {/* Full-width black section */}
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black">How to Order from 16Zips</h1>
        
      </div>

    <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
    

      <p className="text-lg text-gray-700 ">
        Ever wondered how to order cannabis products safely and discreetly online? You’re not alone. 
        At 16Zips, we get lots of questions about the order process, shipping, and what to expect when you shop with us. 
        Here’s everything you need to know about ordering from 16Zips—plain talk, no fluff, just the real deal.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Why Choose 16Zips for Your Cannabis Products?</h2>
        <p className="text-gray-700">
          We’re not just another cannabis store. We’re your trusted source for high-quality cannabis products and expert advice. 
          Every order is handled with care, and we’re always here to answer your questions about our products. 
          We’ve made the order process smooth, safe, and hassle-free, so you can focus on enjoying your cannabis experience.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">How to Place Your Order at 16Zips</h2>
        <ol className="list-decimal list-inside space-y-4 text-gray-700">
          <li>
            <strong>Browse Our Selection of Cannabis Products:</strong> Visit our shop and explore a wide range of cannabis products, including flower, edibles, concentrates, and more. Each product page has detailed info, lab results, and customer reviews so you know exactly what you’re getting.
          </li>
          <li>
            <strong>Add Products to Your Cart:</strong> Found what you want? Click “Add to Cart” on the product page. Adjust quantities or keep shopping to add more items. Your cart updates in real time.
          </li>
          <li>
            <strong>Review Your Cart:</strong> Click the cart icon to review your order. Double-check items, quantities, and total. Make any adjustments before checking out.
          </li>
          <li>
            <strong>Proceed to Checkout:</strong> Click “Checkout” when ready. You’ll be taken to a secure checkout page to enter your details and choose your payment method. We accept major cards and crypto for extra privacy.
          </li>
          <li>
            <strong>Enter Your Shipping and Billing Info:</strong> Fill in your shipping and billing details. Accuracy ensures fast, discreet delivery. We keep your information secure and never share it.
          </li>
          <li>
            <strong>Choose Your Shipping Option:</strong> Select your preferred shipping method. All packages are shipped discreetly with no external indication of contents.
          </li>
          <li>
            <strong>Complete Your Payment:</strong> Review your order one last time and click “Pay Now.” You’ll receive a confirmation email with your order details and updates.
          </li>
          <li>
            <strong>Wait for Your Cannabis Products:</strong> That’s it! Your order is on the way. We provide a tracking number so you can follow your package. Delivery time varies based on location and shipping option.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What to Expect When You Order from 16Zips</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>Fast, Discreet Shipping:</strong> All cannabis products are packed and shipped with privacy in mind. No labels or logos revealing the contents—just a plain, secure package.
          </li>
          <li>
            <strong>Tracking and Updates:</strong> Receive a tracking number as soon as your order ships. Check your email or account for real-time updates.
          </li>
          <li>
            <strong>Customer Support:</strong> Have questions? Our team is ready to help. We care about your cannabis experience and strive to provide the best service possible.
          </li>
        </ul>
      </section>
    </div>
    </div>
  );
};

export default HowToOrderPage;
