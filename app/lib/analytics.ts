export const trackEvent = async (eventType: string, eventData: Record<string, any> = {}) => {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType, eventData, timestamp: Date.now() }),
    });
  } catch (error) {
    console.error("Failed to track event:", error);
  }
};