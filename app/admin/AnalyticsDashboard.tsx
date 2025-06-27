"use client";

import React, { useEffect, useState } from "react";
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ✅ Custom Card Component (No External Imports)
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold mb-2">{children}</h2>
);

const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

// ✅ TypeScript Interface for Analytics Data (without `keywordPerformance`)
interface AnalyticsData {
  uniqueVisitors: number;
  pageViews: number;
  conversionRate: number;
  totalSales: number;
  averageOrderValue: number;
  organicTraffic: number;
  pageViewsHistory: { date: string; views: number }[];
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics"); // Adjust endpoint as needed
        if (!res.ok) throw new Error("Failed to fetch analytics data");
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {/* Unique Visitors */}
      <Card>
        <CardHeader>Unique Visitors</CardHeader>
        <CardContent>{analytics?.uniqueVisitors}</CardContent>
      </Card>

      {/* Page Views */}
      <Card>
        <CardHeader>Page Views</CardHeader>
        <CardContent>{analytics?.pageViews}</CardContent>
      </Card>

      {/* Conversion Rate */}
      <Card>
        <CardHeader>Conversion Rate</CardHeader>
        <CardContent>{analytics?.conversionRate}%</CardContent>
      </Card>

      {/* Sales & AOV */}
      <Card className="col-span-2">
        <CardHeader>Total Sales & AOV</CardHeader>
        <CardContent>
          <p>Total Sales: ${analytics?.totalSales}</p>
          <p>Average Order Value: ${analytics?.averageOrderValue}</p>
        </CardContent>
      </Card>

      {/* Organic Traffic */}
      <Card>
        <CardHeader>Organic Traffic</CardHeader>
        <CardContent>{analytics?.organicTraffic}</CardContent>
      </Card>

      {/* Keyword Performance (Pie Chart) - Removed */}
      {/* If needed, you can add a fallback or a placeholder */}
      {/* Since `keywordPerformance` is no longer available, we skip this section. */}

      {/* Page Views Over Time (Line Chart) */}
      <Card className="col-span-3">
        <CardHeader>Page Views Over Time</CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.pageViewsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;