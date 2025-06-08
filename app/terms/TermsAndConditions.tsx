'use client';

import Head from "next/head";
import Link from "next/link";

const TermsAndConditions = () => {
  return (
    <main className="max-w-4xl mx-auto p-6 mt-20">
      <Head>
        <title>Terms & Conditions | 16Zips</title>
        <meta name="description" content="Read the Terms and Conditions for using 16Zips' cannabis products and website." />
      </Head>

      <h1 className="text-3xl font-bold text-gray-900 mt-8 sm:mt-10 md:mt-20 lg:mt-20">Terms & Conditions</h1>
      <p className="text-gray-600 mt-4">
        These terms outline the rules and regulations for using 16Zips' website and cannabis product-related services.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Acceptance of Terms</h2>
        <p className="text-gray-600">
          By accessing our website and purchasing our cannabis products, you agree to abide by these terms and conditions in full. If you do not accept any part of these terms, you must not use our services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Use of Services</h2>
        <p className="text-gray-600">
          16Zips provides products that are legally available only to users who meet age and legal eligibility requirements in their jurisdiction. Any misuse of our products or services, including unlawful resale or distribution, may result in account termination and possible legal consequences.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Limitation of Liability</h2>
        <p className="text-gray-600">
          16Zips is not responsible for any damages, injuries, or legal issues resulting from the misuse of our cannabis products. All usage is at your own discretion and risk, and it is your responsibility to ensure you are in compliance with local laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Changes to Terms</h2>
        <p className="text-gray-600">
          16Zips reserves the right to update or revise these terms at any time. Continued use of our site and services after changes are made constitutes your acceptance of the revised terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions or concerns about our terms or services, feel free to contact us at{" "}
          <Link href="mailto:support@16zips.com" className="text-green-600 hover:underline">
            support@16zips.com
          </Link>.
        </p>
      </section>
    </main>
  );
};

export default TermsAndConditions;
