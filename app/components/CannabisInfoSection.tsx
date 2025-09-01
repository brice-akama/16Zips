// app/components/CannabisInfoSection.tsx
"use client";

import React from "react";

const CannabisInfoSection: React.FC = () => {
  const texts = {
    whyChooseHeading: "Why Buying Cannabis Products Online at 16zips Is Different",
    intro:
      "We’re not your average cannabis shop. Here’s what sets us apart:",

    expertiseTitle: "Expertise You Can Trust",
    expertiseText:
      "Our team includes growers, researchers, and long-time cannabis advocates. We know our products inside and out—from flower and pre-rolls to edibles, concentrates, tinctures, and vape cartridges.",

    qualityTitle: "Quality First",
    qualityText:
      "Every product in our 16zips store is lab-tested and sourced responsibly. We don’t cut corners or compromise on safety.",

    

    qualityAssuranceTitle: "How We Ensure Quality and Safety",
    qualityAssuranceItems: [
      "Lab Testing: Every batch is tested by independent labs for potency, purity, and safety.",
      "Responsible Sourcing: We work with trusted suppliers who share our commitment to quality and ethics.",
      "Clear Labelling: Every product comes with clear usage instructions and safety information.",
      "Consumption Guidelines: We provide comprehensive guides on safe use, dosing, and responsible cannabis consumption.",
    ],

    valuesHeading: "Our Values: Trust, Safety, and Community",
    valuesItems: [
      { title: "Trust", text: "We earn your trust by being honest, transparent, and reliable." },
      { title: "Safety", text: "Your safety is our top priority. We test every product and provide clear usage and safety guidelines." },
      { title: "Community", text: "We’re here to support you, whether you’re a first-time user or a seasoned enthusiast." },
      { title: "Education", text: "We provide accurate, up-to-date information about cannabis products, safety, and wellness." },
      { title: "Responsibility", text: "We promote responsible use and harm reduction at every step." },
    ],

    faqHeading: "FAQ About Buying Cannabis Online at 16zips",
    faqItems: [
      {
        question: "What products do you sell at 16zips?",
        answer:
          "We sell cannabis flower, pre-rolls, edibles, concentrates, tinctures, vapes, and more—all lab-tested for quality and safety.",
      },
      {
        question: "Are your cannabis products safe?",
        answer:
          "Yes, every product is tested by independent labs for potency and purity. We also provide clear usage and safety guidelines.",
      },
      {
        question: "How do you ensure quality?",
        answer:
          "We work with trusted suppliers, test every batch, and provide transparent product information.",
      },
      {
        question: "Do you ship worldwide?",
        answer:
          "Yes, we ship to most locations with fast and discreet delivery.",
      },
    ],
  };

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Column */}
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-bold mb-6">{texts.whyChooseHeading}</h2>
          <p className="mb-4 text-lg text-gray-700">{texts.intro}</p>

          <h3 className="text-xl font-semibold mb-2">{texts.expertiseTitle}</h3>
          <p className="mb-4 text-lg text-gray-700">{texts.expertiseText}</p>

          <h3 className="text-xl font-semibold mb-2">{texts.qualityTitle}</h3>
          <p className="text-lg text-gray-700">{texts.qualityText}</p>
        </div>

        <div>
          

          <div role="heading" aria-level={3} className="text-xl font-semibold mt-10">
            {texts.qualityAssuranceTitle}
          </div>
          <ul className="space-y-4 list-disc list-inside text-lg text-gray-700">
            {texts.qualityAssuranceItems?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-12">
        <div>
          <h2 className="text-3xl font-bold mb-6 whitespace-nowrap">{texts.valuesHeading}</h2>
          <ul className="space-y-4 list-disc list-inside text-lg text-gray-700">
            {texts.valuesItems?.map((item: any, idx: number) => (
              <li key={idx}>
                <strong>{item.title}:</strong> {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">{texts.faqHeading}</h2>
          <ul className="space-y-4 list-disc list-inside text-lg text-gray-700">
            {texts.faqItems?.map((item: any, idx: number) => (
              <li key={idx}>
                <strong>{item.question}</strong> {item.answer}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CannabisInfoSection;
