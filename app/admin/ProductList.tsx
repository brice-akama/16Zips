// ProductList.tsx
// ProductList.tsx
"use client";

import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ImageField,
  NumberField,
  ListProps,
  EditButton,
  DeleteButton,
  SimpleList,
  Pagination,
  FunctionField,
  RaRecord,
} from "react-admin";
import { useMediaQuery, Divider, Box, Typography } from "@mui/material";

// Helper function to remove HTML tags and truncate text
const sanitizeAndTruncate = (description: string, maxLength: number = 50): string => {
  if (typeof description !== "string") return "";
  const cleanedDescription = description.replace(/<\/?[^>]+(>|$)/g, "");
  return cleanedDescription.length > maxLength
    ? cleanedDescription.substring(0, maxLength) + "..."
    : cleanedDescription;
};

// Normalize price from MongoDB formatted data
const normalizePrice = (price: any) => {
  if (price && price.hasOwnProperty('$numberInt')) {
    return parseInt(price.$numberInt, 10); // Convert the MongoDB formatted price to a number
  }
  return price; // If it's already a number, just return it
};

// Define the product type
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  mainImage: string;
}

// Custom FunctionField Component for truncation
const CustomTruncatedTextField = ({ source }: { source: keyof Product }) => (
  <FunctionField
    source={source}
    render={(record: Product) => sanitizeAndTruncate(String(record[source]), 60)}
  />
);

const ProductList: React.FC<ListProps<Product>> = (props) => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  return (
    <List {...props} perPage={10} pagination={<Pagination rowsPerPageOptions={[10, 20, 50, 100, 150, 200]} />}>
      {isSmallScreen ? (
        <SimpleList
          primaryText={(record: Product) => (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {sanitizeAndTruncate(record.name ?? "", 40)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {sanitizeAndTruncate(record.description ?? "", 60)}
              </Typography>
              <Typography variant="body2">Price: ${normalizePrice(record.price)}</Typography>
              <Typography variant="body2">Category: {record.category}</Typography>
            </Box>
          )}
          secondaryText={(record: Product) => (
            <Box display="flex" gap={1} mt={1}>
              <EditButton record={record} />
              <DeleteButton record={record} />
            </Box>
          )}
        />
      ) : (
        <Datagrid>
          <TextField label="Product Name" source="name" />
          <NumberField source="price" label="Price" />
          <CustomTruncatedTextField source="description" />
          <TextField source="category" label="Category" />
          <ImageField source="mainImage" label="Image" />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      )}
      {/* Horizontal line separator */}
      {isSmallScreen && <Divider sx={{ my: 2 }} />}
    </List>
  );
};

export default ProductList;