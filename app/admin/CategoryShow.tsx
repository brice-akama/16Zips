"use client";

import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ImageField,
} from "react-admin";

const CategoryShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="slug" />
      <TextField source="description" />
      <TextField source="metaTitle" />
      <TextField source="metaDescription" />
      <ImageField source="imageUrl" title="Category Image" />
    </SimpleShowLayout>
  </Show>
);

export default CategoryShow;