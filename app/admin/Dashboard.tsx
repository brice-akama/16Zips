"use client";

// app/admin/components/Dashboard.tsx
import { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, LineChart, Line } from "recharts";

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    orderStatus: { pending: 0, completed: 0, canceled: 0 },
    totalProducts: 0,
  });

  const [chartExampleData, setChartExampleData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes, orderStatusRes, productsRes, revenueRes] = await Promise.all([
          fetch('/api/register').then((res) => res.json()),
          fetch('/api/orders').then((res) => res.json()),
          fetch('/api/orders/status').then((res) => res.json()),
          fetch('/api/products').then((res) => res.json()),
          fetch('/api/revenue').then((res) => res.json()),
        ]);
  
        setChartData({
          totalUsers: usersRes.total,
          totalOrders: ordersRes.total,
          totalRevenue: revenueRes.reduce((total: number, data: any) => total + data.revenue, 0),
          orderStatus: {
            pending: orderStatusRes.pending,
            completed: orderStatusRes.completed,
            canceled: orderStatusRes.canceled,
          },
          totalProducts: productsRes.total,
        });
  
        setChartExampleData(
          revenueRes.map((item: any) => ({
            name: item.month,
            revenue: item.revenue,
            orders: ordersRes.monthly?.find((order: any) => order.month === item.month)?.orders || 0,
            users: usersRes.total || 0, // Instead of accessing usersRes.monthly
          }))
        );
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>

      {/* Total Users BarChart */}
      <Card>
        <CardContent>
          <Typography variant="h6">Total Users</Typography>
          <BarChart width={500} height={300} data={chartExampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#8884d8" />
          </BarChart>
        </CardContent>
      </Card>

      {/* Order Status PieChart */}
      <Card>
        <CardContent>
          <Typography variant="h6">Order Status Breakdown</Typography>
          <PieChart width={400} height={400}>
            <Pie
              data={[
                { name: "Pending", value: chartData.orderStatus.pending },
                { name: "Completed", value: chartData.orderStatus.completed },
                { name: "Canceled", value: chartData.orderStatus.canceled },
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#82ca9d"
              label
            />
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>

      {/* Total Orders */}
      <Card>
        <CardContent>
          <Typography variant="h6">Total Orders</Typography>
          <Typography variant="h4">{chartData.totalOrders}</Typography>
        </CardContent>
      </Card>

      {/* Total Products */}
      <Card>
        <CardContent>
          <Typography variant="h6">Total Products</Typography>
          <Typography variant="h4">{chartData.totalProducts}</Typography>
        </CardContent>
      </Card>

      {/* Total Revenue LineChart */}
      <Card>
        <CardContent>
          <Typography variant="h6">Total Revenue</Typography>
          <LineChart width={500} height={300} data={chartExampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
          </LineChart>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;