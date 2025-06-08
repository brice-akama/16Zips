'use client';

import Head from "next/head";
import Link from "next/link";

const RefundPolicy = () => {
  return (
    <main className="max-w-4xl mx-auto p-6 mt-20">
      <Head>
        <title>Refund & Return Policy | 16Zips</title>
        <meta
          name="description"
          content="Read our return and refund policy for cannabis products purchased from 16Zips."
        />
      </Head>

      <h1 className="text-3xl font-bold text-gray-900 mt-8 sm:mt-10 md:mt-20 lg:mt-20">Refund & Return Policy</h1>
      <p className="text-gray-600 mt-4">
        At 16Zips, we prioritize your satisfaction while complying with cannabis regulations. Please review our refund and return policy carefully before making a purchase.
      </p>

      {/* 1. All Sales Are Final */}
      <section className="mb-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800"> All Sales Are Final</h2>
        <p className="text-gray-600">
          Due to the nature of cannabis products and regulatory guidelines, all purchases made through 16Zips are considered final. We do not accept returns or offer refunds on any cannabis or cannabis-related items once they are shipped.
        </p>
      </section>

      {/* 2. Exceptions for Damaged or Incorrect Items */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Damaged or Incorrect Orders</h2>
        <p className="text-gray-600">
          If your order arrives damaged or you received the wrong item, please contact us within 48 hours of delivery. Include your order number, a clear description of the issue, and photo evidence. We’ll review your claim and offer a resolution where appropriate.
        </p>
      </section>

      {/* 3. Refund Eligibility */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Refunds (if applicable)</h2>
        <p className="text-gray-600">
          Approved refunds will be processed back to your original payment method within 5–7 business days. You will be notified via email once your refund is issued. Please note: shipping charges are non-refundable.
        </p>
      </section>

      {/* 4. Order Cancellations */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Order Cancellations</h2>
        <p className="text-gray-600">
          Orders cannot be canceled once they are processed and fulfilled. If you need to make changes to your order, contact us immediately at{" "}
          <a href="mailto:support@16zips.com" className="text-green-600 hover:underline">
            support@16zips.com
          </a>, and we’ll do our best to accommodate your request if the order hasn’t shipped yet.
        </p>
      </section>

      {/* 5. Contact Info */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Contact Us</h2>
        <p className="text-gray-600">
          For questions regarding refunds or returns, please email{" "}
          <Link href="mailto:support@16zips.com" className="text-green-600 hover:underline">
            support@16zips.com
          </Link>. We’re here to help!
        </p>
      </section>
    </main>
  );
};

export default RefundPolicy;
