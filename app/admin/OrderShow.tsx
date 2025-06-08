"use client";
import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ImageField,
  FunctionField,
  useRecordContext,
} from "react-admin";
import { Box, Typography } from "@mui/material";

const CartItemsField = () => {
  const record = useRecordContext();
  if (!record || !record.cartItems) return null;

  return (
    <Box>
      {record.cartItems.map((item: any, index: number) => (
        <Box key={index} display="flex" gap={2} mb={2}>
          <ImageField
            source={item.mainImage}
            label={item.name}
            sx={{ width: 50 }}
          />
          <Typography variant="body2">
            {item.name} - {item.quantity} x ${item.price}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const OrderShow: React.FC = () => (
  <Show>
    <SimpleShowLayout>
      <TextField label="First Name" source="billingDetails.firstName" />
      <TextField label="Last Name" source="billingDetails.lastName" />
      <TextField label="Phone" source="billingDetails.phone" />
      <TextField label="Email" source="billingDetails.email" />
      <TextField label="Payment Method" source="paymentMethod" />
      <TextField label="Country" source="billingDetails.country" />
      <TextField label="Street Address" source="billingDetails.streetAddress" />
      <TextField label="City" source="billingDetails.city" />
      <TextField label="State" source="billingDetails.state" />
      <TextField label="Status" source="billingDetails.status" />

      <FunctionField label="Cart Items" render={() => <CartItemsField />} />
    </SimpleShowLayout>
  </Show>
);

export default OrderShow;
