"use client";


import React, { useState, useEffect } from "react";
import { Edit, SimpleForm, TextInput, DateInput, useNotify, useRedirect, useRefresh } from "react-admin";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useParams } from "react-router-dom";

const ReviewEdit: React.FC = (props) => {
  const { id } = useParams();
  const [review, setReview] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const notify = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh();

  useEffect(() => {
    if (id) {
      const fetchReview = async () => {
        try {
          const response = await fetch(`/api/review?id=${id}`);
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            setReview(data.data[0]);
            setRating(data.data[0].rating);
          }
        } catch (error) {
          console.error("Error fetching review:", error);
        }
      };
      fetchReview();
    }
  }, [id]);

  if (!review) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (values: any) => {
    try {
      const updatedReview = { ...review, ...values, rating };

      const response = await fetch(`/api/review?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReview),
      });

      console.log("Backend response status:", response.status);


      if (response.ok) {
        notify("Review updated successfully", { type: "success" });
        refresh();
        redirect("/review");
      } else {
        throw new Error("Failed to update review");
      }
    } catch (error) {
      notify("Error updating review", { type: "error" });
    }
  };

  return (
    <Edit {...props}>
      <SimpleForm onSubmit={handleSubmit}>
        <TextInput label="Customer Name" source="customerName" defaultValue={review.customerName} />
        <TextInput label="Content" source="reviewContent" defaultValue={review.reviewContent} multiline />
        <div>
          <label>Rating</label>
          <Rating value={rating} onChange={setRating} style={{ maxWidth: 120 }} />
        </div>
        <DateInput label="Date" source="createdAt" defaultValue={review.createdAt} />
      </SimpleForm>
    </Edit>
  );
};

export default ReviewEdit;