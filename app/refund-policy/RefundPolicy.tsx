'use client';

import Head from "next/head";


const RefundPolicy = () => {
  return (
    <div className="mt-20 lg:mt-40">
      {/* Full-width black header section */}
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black">Refund & Return Policy</h1>
       
      </div>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <Head>
          <title>Refund & Return Policy | 16Zips</title>
          <meta
            name="description"
            content="Read our refund and return policy for cannabis products purchased from 16Zips."
          />
        </Head>

        <p className="text-gray-600 mt-4">
          At 16Zips, we prioritize your satisfaction while complying with cannabis regulations. 
          Please review our refund and return policy carefully before making a purchase.
        </p>

        {/* 1. All Sales Are Final */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">All Sales Are Final</h2>
          <p className="text-gray-600">
            Due to the nature of cannabis products and regulatory guidelines, all purchases made through 16Zips are considered final. 
            We do not accept returns or offer refunds on any cannabis or cannabis-related items once they are shipped.
          </p>
        </section>

        {/* 2. Exceptions for Damaged or Incorrect Items */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Damaged or Incorrect Orders</h2>
          <p className="text-gray-600">
            If your order arrives damaged or you received the wrong item, please contact us within 48 hours of delivery. 
            Include your order number, a clear description of the issue, and photo evidence. We’ll review your claim and offer a resolution where appropriate.
          </p>
        </section>

        {/* 3. Refund Eligibility */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Refunds (if applicable)</h2>
          <p className="text-gray-600">
            Approved refunds will be processed back to your original payment method within 5–7 business days. 
            You will be notified via email once your refund is issued. Shipping charges are non-refundable.
          </p>
        </section>

        {/* 4. Order Cancellations */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Cancellations</h2>
          <p className="text-gray-600">
            Orders cannot be canceled once they are processed and fulfilled. If you need to make changes to your order, contact us immediately at{" "}
            <a href="mailto:info@16zip.com" className="text-green-600 hover:underline">
              info@16zip.com
            </a>, and we’ll do our best to accommodate your request if the order hasn’t shipped yet.
          </p>
        </section>

        {/* 5. Quality Assurance */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Quality Assurance</h2>
          <p className="text-gray-600">
            All products sold by 16Zips undergo strict quality control measures to ensure safety and compliance. 
            We guarantee that products are fresh, authentic, and responsibly packaged.
          </p>
        </section>

        {/* 6. Shipping & Discreet Packaging */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Shipping & Discreet Packaging</h2>
          <p className="text-gray-600">
            All orders are shipped discreetly with no branding or indication of cannabis products on the package. 
            We provide tracking information when available and strive for timely delivery.
          </p>
        </section>

        {/* 7. Privacy */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Privacy</h2>
          <p className="text-gray-600">
            Your personal information is safe with us. We do not share customer details with third parties except as required for shipping or legal compliance.
          </p>
        </section>

        {/* 8. FAQs */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Frequently Asked Questions</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><strong>Can I return a product if I change my mind?</strong> No, due to cannabis regulations, we cannot accept returns for change of mind.</li>
            <li><strong>What if my order is lost in shipping?</strong> Contact us immediately; we’ll investigate and provide a resolution.</li>
            <li><strong>How do I get a refund for damaged items?</strong> Provide photos and order details within 48 hours for us to process your claim.</li>
          </ul>
        </section>

        {/* 9. Contact Info */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Us</h2>
          <p className="text-gray-600">
            For questions regarding refunds or returns, please email{" "}
            <a href="mailto:info@16zip.com" className="text-green-600 hover:underline">
              info@16zip.com
            </a>. We’re here to help!
          </p>
        </section>
      </main>
    </div>
  );
};

export default RefundPolicy;
