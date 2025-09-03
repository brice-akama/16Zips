// SupportPage.tsx
"use client";

import React, { useState } from "react";

const SupportPage = () => {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [statusMessage, setStatusMessage] = useState(""); // To show success or error message

  const toggleQuestion = (question: string) => {
    setActiveQuestion((prev) => (prev === question ? null : question));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage("Your message has been sent successfully.");
        setFormData({ name: "", email: "", message: "" }); // Clear form after success
      } else {
        setStatusMessage(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      setStatusMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="mt-20 lg:mt-40">
      {/* Full-width black section */}
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black uppercase">support</h1>
        
      </div>
    <div className="max-w-7xl mx-auto px-4 py-8 ">
      {/* Hero Section */}
      <section className="text-center ">
        <h1 className="text-3xl font-bold text-gray-900">How can we assist you?</h1>
        <p className="text-lg text-gray-600">
          Find answers to your questions or learn more about payment methods, order tracking, returns, and account management.
        </p>
      </section>

      {/* Payment Information Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Information</h2>
        <p className="text-lg text-gray-600 mb-4">
          At 16Zips, we accept a variety of secure payment methods to make your shopping experience smooth and easy. You can pay via:
        </p>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Credit and Debit Cards (Visa, MasterCard, American Express)</li>
          <li>PayPal</li>
          <li>Bitcoin</li>
        </ul>
        <p className="mt-4 text-gray-600">
          All payments are processed securely to ensure your information is protected. You will receive a confirmation email once your payment is successfully processed.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <button
              onClick={() => toggleQuestion("order-tracking")}
              className="w-full text-left font-medium text-gray-700"
            >
              How do I track my order?
            </button>
            {activeQuestion === "order-tracking" && (
              <p className="mt-2 text-gray-600">
                You can track your order by logging into your account and visiting the "Orders" section. Each order has a tracking number that will be updated once it's shipped.
              </p>
            )}
          </div>
          <div className="border-b pb-4">
            <button
              onClick={() => toggleQuestion("return-policy")}
              className="w-full text-left font-medium text-gray-700"
            >
              What is your return policy?
            </button>
            {activeQuestion === "return-policy" && (
              <p className="mt-2 text-gray-600">
                We accept returns within 30 days of purchase for most products. To initiate a return, please contact our support team with your order details.
              </p>
            )}
          </div>
          <div className="border-b pb-4">
            <button
              onClick={() => toggleQuestion("update-account")}
              className="w-full text-left font-medium text-gray-700"
            >
              How can I update my account information?
            </button>
            {activeQuestion === "update-account" && (
              <p className="mt-2 text-gray-600">
                To update your account information, log into your account and navigate to the "Profile" section. You can update your email, shipping address, and payment methods there.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="bg-gray-100 p-6 rounded-lg shadow-lg mb-12 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Support</h2>
        <p className="text-lg text-gray-600 mb-4">
          If you have any further questions, feel free to reach out to our customer support team.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Your Email"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Your Message"
            rows={4}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md"
          >
            Submit
          </button>
        </form>

        {statusMessage && (
          <p className="mt-4 text-center text-green-600 font-medium">{statusMessage}</p>
        )}
      </section>
    </div>
    </div>
  );
};

export default SupportPage;
