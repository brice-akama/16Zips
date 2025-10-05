"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AgeVerification() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already verified their age
    const ageVerified = localStorage.getItem("age-verified");
    if (!ageVerified) {
      setIsVisible(true); // Show popup if not verified
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("age-verified", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Store the decline for tracking (optional)
    localStorage.setItem("age-verified", "declined");
    
    // Try to close the browser tab (only works if opened by script)
    window.close();
    
    // Fallback: If window.close() doesn't work, redirect
    setTimeout(() => {
      window.location.href = "https://www.google.com";
    }, 100);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0   z-50 flex items-center justify-center p-4">
        {/* Modal - Reduced Height */}
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header with Gradient - Reduced Padding */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-4xl">🔞</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Age Verification Required
            </h2>
            <p className="text-white/90 text-sm">
              You must be 18+ to enter
            </p>
          </div>

          {/* Content - Reduced Padding */}
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm mb-3">
                By entering, you confirm you are at least{" "}
                <span className="font-bold text-gray-900">18 years old</span> and 
                agree to our{" "}
                <Link href="/terms" className="text-purple-600 hover:underline font-semibold">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-purple-600 hover:underline font-semibold">
                  Privacy Policy
                </Link>.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                YES, I'M 18+
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300"
              >
                NO, EXIT
              </button>
            </div>

            {/* Footer Warning - Reduced Size */}
            <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
              <p className="text-amber-800 text-xs">
                <span className="font-bold">Warning:</span> Products may be regulated in your area. Verify local laws before purchasing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}