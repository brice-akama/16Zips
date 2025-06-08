"use client";

import React from 'react';
import { List, Datagrid, TextField,  EditButton } from 'react-admin';

const SettingsList = () => (
  <List title="Manage Settings">
    <Datagrid>
      <TextField source="siteTitle" label="Site Title" />
     
      
      
     
      <TextField source="metaTitle" label="Meta Title" />
      <TextField source="metaDescription" label="Meta Description" />
      
     
      <TextField source="smtpEmail" label="SMTP Email" />
      <EditButton />
    </Datagrid>
  </List>
);

export default SettingsList;