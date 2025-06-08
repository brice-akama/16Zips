"use client";
import React, { useState, useEffect, useMemo } from "react";
import { SimpleForm, TextInput, DateInput, SelectInput, useNotify, useRedirect } from "react-admin";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const ReviewCreate: React.FC = (props) => {
  const [rating, setRating] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const notify = useNotify(); // To show success or error messages
  const redirect = useRedirect(); // To redirect after successful submission

  // Fetch products when component mounts (no pagination required)
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products"); // Assuming your backend supports filtering by slug
        const data = await res.json();
        setProducts(data.data); // Assuming the data returned is an array of products
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error loading products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this effect runs once on mount

  // Memoize product choices to prevent unnecessary re-renders
  const productChoices = useMemo(() => {
    return products.length > 0
      ? products.map((product) => ({
          slug: product.slug, // ✅ use slug instead of id
          name: product.name || "Unnamed Product",
        }))
      : [{ slug: "", name: "No products available" }];
  }, [products]);
  
  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  // Handle form submission
  const handleSubmit = async (data: any) => {
    try {
      console.log("Raw form data received in handleSubmit:", data);
      console.log("Rating value:", rating);
  
      const reviewPayload = {
        ...data,
        rating,
        slug: data.slug, // Expecting this to be the selected product slug
      };
  
      console.log("Review payload to be sent:", reviewPayload);
  
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewPayload),
      });
  
      if (response.ok) {
        console.log("Review successfully submitted!");
        notify("Review submitted successfully!", { type: "success" });
        redirect("/review");
      } else {
        const errorText = await response.text();
        console.error("Error submitting review:", errorText);
        notify("Failed to submit review.", { type: "error" });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      notify("Error submitting review. Please try again.", { type: "error" });
    }
  };
  
  return (
    <SimpleForm {...props} onSubmit={handleSubmit}>
      <TextInput label="Customer Name" source="customerName" />

      {/* Product selection dropdown for the admin */}
      <SelectInput
  label="Product"
  id="slug" // Changed from 'productSlug' to 'slug'
  source="slug" // Changed from 'productSlug' to 'slug'
  choices={productChoices}
  optionText="name"
  optionValue="slug" // This should now be 'slug' instead of 'id'
  disabled={products.length === 0} // Disable if no products are available
/>


      <TextInput label="Content" source="reviewContent" multiline />

      {/* Rating component for review */}
      <div>
        <label>Rating</label>
        <Rating value={rating} onChange={setRating} style={{ maxWidth: 150 }} />
      </div>

      <DateInput label="Date" source="date" defaultValue={new Date()} />
    </SimpleForm>
  );
};

export default ReviewCreate;