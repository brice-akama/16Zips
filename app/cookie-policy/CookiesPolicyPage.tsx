"use client"
import React from 'react';

export const metadata = {
  title: 'Cookies Policy | 16Zips',
  description: 'Learn how 16Zips uses cookies to improve your experience on our cannabis e-commerce website.',
};

export default function CookiesPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 mt-20">
        <div role="heading"
  aria-level={1}
  className="text-3xl font-bold text-center text-green-700 sm:mt-10 md:mt-20 lg:mt-20">
     Cookies Policy
        </div>
      
      <p className="mb-4">Effective Date: Updated June 22, 2025</p>


      <p className="mb-4">
        At <strong>16Zips</strong>, your privacy is important to us. This Cookies Policy explains how and why we use
        cookies and similar tracking technologies when you visit our website (the "Site")—whether you’re browsing our
        cannabis products or placing an order. By using our Site, you consent to the use of cookies as described below.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. What Are Cookies?</h2>
      <p className="mb-4">
        Cookies are small text files placed on your device when you visit a website. They help us remember your
        preferences, enhance performance, and analyze traffic. Cookies can be:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Session Cookies</strong> – Deleted when you close your browser.</li>
        <li><strong>Persistent Cookies</strong> – Stored on your device until they expire or are deleted manually.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Why 16Zips Uses Cookies</h2>
      <p className="mb-4">
        We use cookies for the following purposes:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Essential:</strong> Required for core site functionality such as login, cart, and checkout.</li>
        <li><strong>Analytics:</strong> Help us understand how users interact with our site.</li>
        <li><strong>Functionality:</strong> Save preferences like language, location, and display settings.</li>
        <li><strong>Marketing:</strong> Show relevant cannabis product ads and promotions across other platforms.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Types of Cookies We Use</h2>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Cookie Type</th>
              <th className="border px-4 py-2 text-left">Purpose</th>
              <th className="border px-4 py-2 text-left">Example Tools</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Essential</td>
              <td className="border px-4 py-2">Login, cart session, checkout</td>
              <td className="border px-4 py-2">Internal</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Analytics</td>
              <td className="border px-4 py-2">Measure traffic & behavior</td>
              <td className="border px-4 py-2">Google Analytics</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Functional</td>
              <td className="border px-4 py-2">Save preferences</td>
              <td className="border px-4 py-2">Next.js config</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Marketing</td>
              <td className="border px-4 py-2">Retargeting & promotions</td>
              <td className="border px-4 py-2">Facebook Pixel, Google Ads</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Managing Cookies</h2>
      <p className="mb-4">
        You can manage or disable cookies via your browser settings:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Chrome: <code>chrome://settings/cookies</code></li>
        <li>Firefox: <code>about:preferences#privacy</code></li>
        <li>Safari: Go to Preferences &gt; Privacy</li>
        <li>Edge: Settings &gt; Cookies and site permissions</li>
      </ul>
      <p className="mb-4">
        Disabling cookies may affect site performance and your ability to log in or complete a purchase.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Third-Party Cookies</h2>
      <p className="mb-4">
        We may allow third-party services to place cookies for analytics, ads, or enhanced functionality. These services
        have their own privacy and cookie policies.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Changes to This Policy</h2>
      <p className="mb-4">
        16Zips may update this policy periodically to reflect changes in laws or operations. We'll notify you of major
        changes on our site.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Contact Us</h2>
      <p className="mb-4">
        Have questions? Contact us at:
      </p>
      <ul className="list-none pl-4">
        <li><strong>Email:</strong> info@16zips.com</li>
        <li><strong>Phone:</strong> + 1 626 658 7663</li>
        <li><strong>Address:</strong> 1601 S Soto St, Los Angeles,CA 90023</li>
      </ul>

      <hr className="my-10" />

      <h2 className="text-lg font-semibold mt-8 mb-2">🔧 Developer Note</h2>
      <p className="text-sm text-gray-700">
        Since this site uses Next.js App Router and TypeScript:
        <br />
        - Use the `cookies()` API from `next/headers` to set or retrieve cookies.
        <br />
        - Store user consent in a cookie before loading external tracking scripts.
        <br />
        - A cookie consent banner should be conditionally rendered based on consent.
      </p>
    </main>
  );
}
