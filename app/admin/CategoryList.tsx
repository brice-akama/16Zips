"use client";

import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ImageField,
  EditButton,
  ShowButton,
  DeleteButton,
} from "react-admin";

const CategoryList = () => (
  <List>
    <Datagrid rowClick="show">
      
      <TextField source="name" />
      <TextField source="slug" />
      <ImageField source="imageUrl" title="Image" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default CategoryList;