'use client'

export default function ContactUsWithMap() {
  return (
    <div className="px-4 py-10 mt-20">
      <h1 className="text-3xl font-bold text-center text-green-700 mt-8 sm:mt-10 md:mt-20 lg:mt-20">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">Our Location</h2>
          <p className="text-gray-600 mb-4">We are located in [City, State]. Come visit us or reach out with any questions!</p>
          <p className="text-gray-600 mb-4">Phone: 1-800-123-4567</p>
          <p className="text-gray-600 mb-4">Email: support@16zips.com</p>
        </div>

        {/* Google Map Section */}
        <div className="w-full h-64 md:h-96 mt-8 sm:mt-5 md:mt-20 lg:mt-10">
        <iframe
   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16440112.758650055!2d-89.36792084999999!3d37.431573849999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b0f4b2c8327f39%3A0x60b7b80fd4388f90!2sVirginia%2C%20USA!5e0!3m2!1sen!2sus!4v1713948400000!5m2!1sen!2sus"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
/>

        </div>
      </div>
    </div>
  );
}
