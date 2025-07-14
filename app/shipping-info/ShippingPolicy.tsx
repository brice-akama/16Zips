'use client';

import Head from "next/head";


const ShippingPolicy = () => {
  return (
    <main className="max-w-4xl mx-auto p-6 mt-20">
      <Head>
        <title>Shipping Policy | 16Zips</title>
        <meta
          name="description"
          content="Learn about our shipping methods, delivery timelines, and policies for 16Zips cannabis products."
        />
      </Head>
      <div
  role="heading"
  aria-level={1}
  className="text-3xl font-bold text-gray-900 mt-8 sm:mt-10 md:mt-20 lg:mt-20"
>
Shipping Policy
</div>


       
      <p className="text-gray-600 mt-4">
        This Shipping Policy outlines how 16Zips handles shipping and delivery for all cannabis-related products purchased through our website.
      </p>

      {/* 1. Processing Time */}
      <section className="mb-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800"> Order Processing</h2>
        <p className="text-gray-600">
          Orders are processed within 1–2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
        </p>
      </section>

      {/* 2. Shipping Restrictions */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Shipping Restrictions</h2>
        <p className="text-gray-600">
  We offer secure and discreet shipping to all states within the U.S. and internationally, regardless of local laws. Your privacy is our top priority, and we ensure a confidential shipping process. Please note that while we ship to all locations, it is the customer's responsibility to ensure compliance with their local laws regarding the products ordered. We do not ship to P.O. Boxes.
</p>
        <p className="text-gray-600 mt-2">
          If you have any questions about shipping restrictions in your area, please contact our customer support team.
        </p>
      </section>

      {/* 3. Shipping Rates & Estimates */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Shipping Rates & Delivery Estimates</h2>
        <p className="text-gray-600">
          Shipping charges for your order will be calculated and displayed at checkout. We offer standard and expedited shipping options based on your location.
        </p>
      </section>

      {/* 4. Order Tracking */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Order Tracking</h2>
        <p className="text-gray-600">
          Once your order is shipped, you will receive a tracking number via email. Please allow 24–48 hours for the tracking information to update.
        </p>
      </section>

      {/* 5. Lost, Stolen, or Damaged Packages */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Lost, Stolen, or Damaged Packages</h2>
        <p className="text-gray-600">
          16Zips is not responsible for packages lost or stolen after delivery is confirmed by the carrier. If your package arrives damaged, please contact us immediately with photo evidence and your order number.
        </p>
      </section>

      {/* 6. Contact Us */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions or concerns about shipping, please reach out to our support team at{" "}
          <a href="mailto:info@16zip.com" className="text-green-600 hover:underline">
            info@16zip.com
          </a>.
        </p>
      </section>
    </main>
  );
};

export default ShippingPolicy;
