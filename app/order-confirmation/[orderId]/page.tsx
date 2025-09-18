'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any | null>(null);

  // Fetch order data
  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;

      try {
       const res = await fetch(`/api/orders/${orderId}`);

        if (!res.ok) {
          setOrder(null);
          return;
        }

        
        const resData = await res.json();
const data = resData; // no .data, use directly

setOrder({
  id: data._id, // backend gives _id, not id
  date: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "",
  customer: {
    name: `${data.billingDetails.firstName} ${data.billingDetails.lastName}`,
    email: data.billingDetails.email,
  },
  items: (data.cartItems || []).map((item: any) => ({
    id: item.slug,
    name: item.name,
    qty: item.quantity,
    price: item.price,
    mainImage: item.mainImage,
  })),
  total: data.totalPrice,
});

      } catch (error) {
        console.error("Error fetching order:", error);
        setOrder(null);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p>Loading your order...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 mt-40">
      <div className="text-center">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
        <h1 className="text-3xl font-bold mt-4">Thank you for your order!</h1>
        <p className="text-gray-600 mt-2">Your order has been successfully placed.</p>
        <p className="text-gray-500 mt-2">
          A confirmation email with shipping and tracking information has been sent to{" "}
          <a
            href={`mailto:${order.customer.email}`}
            className="text-blue-600 underline font-medium hover:text-blue-800"
          >
            {order.customer.email}
          </a>
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <p>
          <span className="font-medium">Order ID:</span> {order.id}
        </p>
        <p>
          <span className="font-medium">Order Date:</span> {order.date}
        </p>
        <p>
          <span className="font-medium">Customer:</span> {order.customer.name} (
          {order.customer.email})
        </p>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Items</h3>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {item.mainImage && (
                    <img
                      src={item.mainImage}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                </div>
                <span className="font-medium">${item.price}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 text-lg font-bold">
            <span>Total:</span>
            <span>${order.total}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/shop"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
