// app/components/ReviewsSection.tsx
"use client";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";


type Review = {
  product: string;
  rating: number;
  text: string;
  author: string;
  location: string;
};

const reviewsStatic: Review[] = [
  {
    product: "Blue Dream Flower",
    rating: 5,
    text: "High-quality buds with a smooth smoke. Great for relaxing after a long day. Highly recommend!",
    author: "Sophia L.",
    location: "Toronto, ON",
  },
  {
    product: "Sour Diesel Flower",
    rating: 4,
    text: "Energetic and uplifting. The aroma is strong and fresh. Perfect for daytime use.",
    author: "Liam P.",
    location: "Vancouver, BC",
  },
  {
    product: "Cannabis Gummies - Strawberry",
    rating: 5,
    text: "Tasty and effective. The dosage was just right for a calm and happy experience.",
    author: "Emma R.",
    location: "Montreal, QC",
  },
  {
    product: "Indica Vape Cartridge",
    rating: 4,
    text: "Smooth hits and strong relaxation. Great for evenings, but a bit pricey.",
    author: "Noah S.",
    location: "Calgary, AB",
  },
  {
    product: "Hybrid CBD Oil",
    rating: 5,
    text: "Excellent quality CBD oil. Helped with stress and sleep. Very fast delivery.",
    author: "Ava M.",
    location: "Ottawa, ON",
  },
  {
    product: "OG Kush Flower",
    rating: 5,
    text: "Potent and fragrant. Burns evenly and gives a nice mellow high. Will reorder.",
    author: "Ethan T.",
    location: "Edmonton, AB",
  },
  {
    product: "Sativa Vape Cartridge",
    rating: 4,
    text: "Good energy boost and creativity. Flavors are smooth. Works exactly as described.",
    author: "Mia K.",
    location: "Vancouver, BC",
  },
  {
    product: "Cannabis Chocolate Bar",
    rating: 5,
    text: "Delicious and effective. Great for socializing or relaxing at home. Easy to dose.",
    author: "Lucas B.",
    location: "Toronto, ON",
  },
  {
    product: "Pre-Roll Pack - Mixed Strains",
    rating: 5,
    text: "Convenient and high-quality pre-rolls. Perfect for on-the-go use. Tastes amazing.",
    author: "Charlotte W.",
    location: "Montreal, QC",
  },
  {
    product: "THC Gummies - Mango",
    rating: 4,
    text: "Tasty gummies with a strong effect. Good for stress relief. Slightly sweet for some tastes.",
    author: "Benjamin H.",
    location: "Calgary, AB",
  },
  {
    product: "Hash Concentrate",
    rating: 5,
    text: "Very potent and pure. Works well in a dab rig or vape. High quality, no complaints.",
    author: "Isabella F.",
    location: "Ottawa, ON",
  },
  {
    product: "Cannabis Lotion - Relaxing",
    rating: 5,
    text: "Perfect for sore muscles. Absorbs quickly and smells great. Noticeable calming effect.",
    author: "William G.",
    location: "Edmonton, AB",
  },
   {
    product: "Northern Lights Flower",
    rating: 5,
    text: "Smooth and relaxing. Perfect for unwinding in the evening. The buds were dense and aromatic.",
    author: "Olivia R.",
    location: "Toronto, ON",
  },
  {
    product: "Pineapple Express Flower",
    rating: 4,
    text: "Energetic and uplifting. Great for social gatherings or daytime activities. Aroma was amazing.",
    author: "Ethan S.",
    location: "Vancouver, BC",
  },
  {
    product: "Blueberry Vape Cartridge",
    rating: 5,
    text: "Delicious flavor with smooth hits. Works quickly and helps with stress relief.",
    author: "Sophia L.",
    location: "Montreal, QC",
  },
  {
    product: "CBD Relax Balm",
    rating: 4,
    text: "Soothing on sore muscles. Smells pleasant and absorbs quickly. Very happy with it.",
    author: "Liam P.",
    location: "Calgary, AB",
  },
  {
    product: "Mango Kush Flower",
    rating: 5,
    text: "Perfectly potent and flavorful. Burns evenly and gives a calm, happy high.",
    author: "Emma K.",
    location: "Ottawa, ON",
  },
  {
    product: "Hybrid THC Gummies - Watermelon",
    rating: 5,
    text: "Tasty gummies with an effective, balanced effect. Ideal for relaxing or socializing.",
    author: "Noah H.",
    location: "Edmonton, AB",
  },
  {
    product: "Indica Vape Cartridge - OG",
    rating: 4,
    text: "Strong relaxation and smooth hits. Great for evenings. Flavors are excellent.",
    author: "Ava T.",
    location: "Vancouver, BC",
  },
  {
    product: "CBD Oil Tincture",
    rating: 5,
    text: "High quality and fast-acting. Helped with stress and sleep. Very satisfied with delivery.",
    author: "Lucas M.",
    location: "Toronto, ON",
  },
  {
    product: "Pre-Roll Pack - Sativa Blend",
    rating: 5,
    text: "Convenient and potent pre-rolls. Perfect for on-the-go use. Tastes great.",
    author: "Charlotte F.",
    location: "Montreal, QC",
  },
  {
    product: "THC Chocolate Bar - Mint",
    rating: 4,
    text: "Delicious and discreet. Works well for a relaxed, happy mood. Perfect for sharing.",
    author: "Benjamin W.",
    location: "Calgary, AB",
  },
  {
    product: "Hash Concentrate - Lemon Haze",
    rating: 5,
    text: "Very pure and potent. Works perfectly in a dab rig or vape. Excellent quality.",
    author: "Isabella J.",
    location: "Ottawa, ON",
  },
  {
    product: "Cannabis Body Lotion - Energizing",
    rating: 5,
    text: "Smells amazing and absorbs quickly. Great for sore muscles and refreshing feeling.",
    author: "William K.",
    location: "Edmonton, AB",
  },
];

export default function ReviewsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsPerPage, setReviewsPerPage] = useState(12);
  const [showModal, setShowModal] = useState(false); // <-- modal state
  const [newReview, setNewReview] = useState<Review>({
    product: "",
    rating: 0,
    text: "",
    author: "",
    location: "",
  });


   // Fetch reviews from backend
  // Fetch reviews from backend
const fetchReviews = async () => {
  try {
    const res = await fetch("/api/customers-reviews");
    const data = await res.json();

    if (Array.isArray(data)) {
      // static reviews first, backend reviews after
      setReviews([...reviewsStatic, ...data]);
    } else {
      setReviews(reviewsStatic);
    }
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    setReviews(reviewsStatic); // fallback if API fails
  }
};

// Fetch reviews from API + include static ones
useEffect(() => {
  fetchReviews();
}, []);

  // Pagination function with scroll to top
const paginate = (pageNumber: number) => {
  setCurrentPage(pageNumber);
  // Scroll to top of the reviews section smoothly
  const reviewsSection = document.getElementById("reviews-section");
  if (reviewsSection) {
    reviewsSection.scrollIntoView({ behavior: "smooth" });
  }
};


  // Update reviews per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setReviewsPerPage(6); // Phones
      } else {
        setReviewsPerPage(12); // Medium & large devices
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pagination calculations
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  

   // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Submit new review to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/customers-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      setNewReview({ product: "", rating: 0, text: "", author: "", location: "" });
      setShowModal(false);
      fetchReviews(); // Refresh the review list
    } catch (error) {
      console.error(error);
      alert("Failed to submit review. Please try again.");
    }
  };


  return (
    <div className="mt-20 lg:mt-40">
      {/* Full-width black section */}
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black">Reviews</h1>
      </div>

      <section id="reviews-section" className="w-full py-14 px-2 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold mb-4">
            What Our Customers Are Saying – Trusted Reviews from Across Canada, the US, and the UK
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We take pride in delivering high-quality cannabis products with exceptional service—and our customers agree. From coast to coast in the United States to cities across Canada and the UK, our clients consistently share positive experiences about the flavor, potency, and professionalism they’ve come to expect from us.
          </p>
          <p className="text-gray-700 leading-relaxed mt-2">
            Whether it’s their first experience with premium flower, an uplifting vape, a delicious edible, or a soothing topical, our community values the reliability, discretion, and quality of every product we offer.
          </p>
          <p className="text-gray-700 leading-relaxed mt-2">
            Here’s what real customers are saying about their experiences with our cannabis flowers, vapes, edibles, concentrates, and topicals. Each review reflects our commitment to quality and customer care.
          </p>
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
          {currentReviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="font-semibold text-sm text-gray-700 mb-1">
                  <span className="text-gray-800">Product:</span> {review.product}
                </p>
                <blockquote className="italic text-gray-600 mb-6 leading-relaxed">
                  “{review.text}”
                </blockquote>
              </div>
              <div className="flex flex-col items-center mt-2">
                <span className="font-semibold text-gray-800">{review.author}</span>
                <span className="text-xs text-gray-500">{review.location}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-4 py-2 rounded border ${
                currentPage === i + 1
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              } transition`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* LEAVE A REVIEW button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="inline-block bg-rose-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-rose-700 transition text-base"
          >
            LEAVE A REVIEW
          </button>
        </div>
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-8 rounded-lg max-w-lg w-full relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <h3 className="text-xl font-bold mb-4">Submit Your Review</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  name="product"
                  value={newReview.product}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                  required
                  className="border rounded px-3 py-2"
                />
                <input
                  type="number"
                  name="rating"
                  value={newReview.rating}
                  onChange={handleInputChange}
                  placeholder="Rating (1-5)"
                  min={1}
                  max={5}
                  required
                  className="border rounded px-3 py-2"
                />
                <textarea
                  name="text"
                  value={newReview.text}
                  onChange={handleInputChange}
                  placeholder="Write your review..."
                  required
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="author"
                  value={newReview.author}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="location"
                  value={newReview.location}
                  onChange={handleInputChange}
                  placeholder="Your Location"
                  required
                  className="border rounded px-3 py-2"
                />
                <button
                  type="submit"
                  className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition mt-2"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}