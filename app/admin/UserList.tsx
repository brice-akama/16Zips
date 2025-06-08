"use client";

import { List, Datagrid, TextField, EmailField, DateField, BooleanField, DeleteButton, TextInput } from "react-admin";

const userFilters = [
  
  <TextInput label="Search by Email" source="email" alwaysOn />,
];

export const UserList = () => (
  <List filters={userFilters}>
    <Datagrid rowClick="edit">
      
      
      <EmailField source="email" />
      <TextField source="password" />
      <DateField source="createdAt" label="Registration Date" />
      <BooleanField source="isActive" label="Active Status" />
      
      <DeleteButton />
    </Datagrid>
  </List>
);