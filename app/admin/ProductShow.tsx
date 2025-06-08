"use client";

import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  BooleanField,
  ImageField,
  ArrayField,
  SingleFieldList,
  FunctionField,
} from 'react-admin';
import React from 'react';

// Utility function to strip HTML tags
const stripHtml = (html: string) => {
  return html ? html.replace(/<[^>]*>?/gm, '') : '';
};

export const ProductShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="name" label="Product Name" />

      {/* Sanitized Product Description */}
      <FunctionField
        label="Product Description"
        render={(record) => stripHtml(record.description)}
      />

      <NumberField
        source="price"
        label="Price"
        options={{ style: 'currency', currency: 'USD' }}
      />
      <TextField source="category" label="Category" />
      <BooleanField source="edibles" label="Features Product" />
      <BooleanField source="popularProduct" label="Popular Product" />

      {/* Main Image */}
      <ImageField source="mainImage" label="Main Image" />

      {/* Thumbnails (multiple images) */}
      <ArrayField source="thumbnails" label="Thumbnails">
        <SingleFieldList>
          <ImageField source="src" title="title" />
        </SingleFieldList>
      </ArrayField>

      {/* Sanitized SEO Fields */}
      <FunctionField
        label="SEO Title"
        render={(record) => stripHtml(record.seoTitle)}
      />
      <FunctionField
        label="SEO Description"
        render={(record) => stripHtml(record.seoDescription)}
      />
      <FunctionField
        label="SEO Keywords"
        render={(record) => stripHtml(record.seoKeywords)}
      />
      
      <BooleanField source="isPublished" label="Published" />
    </SimpleShowLayout>
  </Show>
);
