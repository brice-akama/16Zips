'use client'

import Link from 'next/link';
import { useState } from 'react';

const faqs = [
  {
    question: "What products does 16Zips offer?",
    answer: `At 16Zips, we offer a wide variety of cannabis products, including high-quality flower, edibles, concentrates, tinctures, and accessories. Our product range is carefully selected to ensure customers get only the best available in the market. Whether you're a new user or a seasoned enthusiast, we have something for everyone.

    Our cannabis products are sourced from reputable growers and manufacturers who adhere to strict quality control standards. We make it a priority to offer both recreational and medicinal cannabis products to cater to different needs.

    For a full listing of all our products, please visit our product catalog or contact our customer support team for personalized recommendations.`,
  },
  {
    question: "Is shipping discreet?",
    answer: `Yes, we offer secure and discreet shipping for all of our products. We understand the importance of privacy when it comes to cannabis purchases, so we package all orders in plain, unmarked packaging. Our shipping methods ensure your order reaches you securely and without any identifiable labels related to the contents.

    Our discreet shipping service is available for both domestic and international orders, so you can shop with confidence no matter where you are. Rest assured, your privacy is always a priority for us.

    If you have any specific concerns about packaging or shipping, feel free to reach out to our customer service team, and we'll be happy to assist you.`,
  },
  {
    question: "Is 16Zips an online-only store?",
    answer: `Yes, 16Zips operates exclusively online, allowing us to provide customers across the nation with convenient access to a wide range of cannabis products. Our platform offers easy browsing, secure purchasing, and direct-to-door delivery.

    By maintaining an online-only presence, we are able to keep overhead costs low, which allows us to pass those savings onto our customers through competitive pricing and regular promotions. You can shop with us from the comfort of your home or anywhere that suits you.

    We also provide comprehensive customer support online, ensuring that any questions or issues you have are addressed quickly and efficiently.`,
  },
  {
    question: "Are your products tested for quality?",
    answer: `Absolutely. All of the products available at 16Zips undergo rigorous testing for quality and safety. We prioritize the health and satisfaction of our customers, so we only offer products that meet high-quality standards and legal requirements.

    Our products are tested by third-party labs to ensure purity, potency, and consistency. Test results are available for customers to review, so you can be confident that you're purchasing safe, reliable, and effective cannabis products.

    If you'd like to view the test results for any of our products, they are readily available on the product pages or upon request through our customer service team.`,
  },
  {
    question: "How can I contact customer support?",
    answer: `You can reach our customer support team by email, live chat, or phone. We strive to provide timely assistance, whether you need help with your order, have questions about our products, or need guidance in choosing the right items.

    Our email support is available 24/7, and we typically respond within a few hours. If you need immediate assistance, our live chat feature on the website is the fastest way to get in touch with a representative.

    For phone support, simply call our customer service number, and one of our friendly team members will assist you. We are committed to ensuring your experience with 16Zips is seamless and enjoyable.`,
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
     <div className="mt-20 lg:mt-40">
      {/* Full-width black section */}
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black uppercase">FAQS</h1>
        
      </div>
    <div className="px-4 py-10 space-y-8">
      <div
  role="heading"
  aria-level={1}
  className="text-3xl font-bold text-center text-green-700  lg:mt-20"
>
  Frequently Asked Questions
</div>


      
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-gray-300 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 cursor-pointer" onClick={() => toggleAnswer(index)}>
              {faq.question}
            </h2>
            <button
              onClick={() => toggleAnswer(index)}
              className="text-green-700 text-2xl focus:outline-none"
            >
              {openIndex === index ? '-' : '+'}
            </button>
          </div>
          
          {openIndex === index && (
            <div className="mt-4 text-gray-600 space-y-4">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}

      {/* Transparent Button linking to the shop page */}
      <div className="text-center mt-8">
        <Link
          href="/shop"
          className="inline-block px-6 py-3 text-green-700 border-2 border-green-700 rounded-md bg-transparent hover:bg-green-700 hover:text-white transition duration-300"
        >
          Visit Our Shop
        </Link>
      </div>
    </div>
    </div>
  );
}
