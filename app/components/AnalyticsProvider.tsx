"use client";

import { useEffect } from "react";
import { trackEvent } from "../lib/analytics";

// Custom UUID generator (replaces crypto.randomUUID)
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const AnalyticsProvider = () => {
  useEffect(() => {
    // 1️⃣ Track Page Views
    trackEvent("page_view", { url: window.location.href });

    // 2️⃣ Track Button Clicks
    const handleButtonClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "BUTTON") {
        trackEvent("button_click", { buttonText: target.innerText, url: window.location.href });
      }
    };

    // 3️⃣ Track Form Submissions
    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      trackEvent("form_submission", { formId: form.id, url: window.location.href });
    };

    // 4️⃣ Track User Session (Start Time)
    const sessionStart = Date.now();
    trackEvent("session_start", { sessionId: sessionStart });

    // 5️⃣ Track User Session Duration (On Page Leave)
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - sessionStart;
      trackEvent("session_duration", { sessionId: sessionStart, duration: sessionDuration });
    };

    // 6️⃣ Track Unique & Returning Visitors (Fix for crypto.randomUUID issue)
    let visitorId = localStorage.getItem("visitorId");

    if (!visitorId) {
      visitorId = generateUUID();
      localStorage.setItem("visitorId", visitorId);
    }

    trackEvent("visitor", { visitorId, isNew: !localStorage.getItem("visitorId") });

    // 7️⃣ Track Organic Traffic & Keyword Performance
    const referrer = document.referrer;
    const isOrganic = referrer.includes("google") || referrer.includes("bing") || referrer.includes("yahoo");
    if (isOrganic) {
      trackEvent("organic_traffic", { referrer });
    }

    // Attach event listeners
    document.addEventListener("click", handleButtonClick);
    document.addEventListener("submit", handleFormSubmit);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("click", handleButtonClick);
      document.removeEventListener("submit", handleFormSubmit);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null; // No UI needed
};

export default AnalyticsProvider;