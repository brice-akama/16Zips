'use client'

export default function ContactUsWithMap() {
  return (
    <div className="px-4 py-10 mt-20">

      <div
  role="heading"
  aria-level={1}
  className="text-3xl font-bold text-center text-green-700 mt-8 sm:mt-10 md:mt-20 lg:mt-20"
>
Contact Us
</div>

      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">Our Location</h2>
          <p className="text-gray-600 mb-4">We are located in 1601 S Soto St, Los Angeles, CA 90023. Come visit us or reach out with any questions!</p>
          <p className="text-gray-600 mb-4">Phone: +1 (626) 658-7663</p>
          <p className="text-gray-600 mb-4">
  Email:{" "}
  <a href="mailto:info@16zip.com" className="text-blue-600 hover:underline">
    info@16zip.com
  </a>
</p>

        </div>

        {/* Google Map Section */}
        <div className="w-full h-64 md:h-96 mt-8 sm:mt-5 md:mt-20 lg:mt-10">
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.0726069263143!2d-118.2167497!3d34.0223431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c7d0b03dbe1d%3A0x6f2c5b7025de9d6b!2s1601%20S%20Soto%20St%2C%20Los%20Angeles%2C%20CA%2090023%2C%20USA!5e0!3m2!1sen!2sus!4v1719437800000!5m2!1sen!2sus"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>


        </div>
      </div>
    </div>
  );
}
