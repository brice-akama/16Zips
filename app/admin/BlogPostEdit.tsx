"use client";

import React, { useState } from 'react';
import { Edit, SimpleForm, TextInput, DateInput, EditProps, useNotify,useRefresh, useRedirect } from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const BlogPostEdit: React.FC<EditProps> = (props) => {
  const [file, setFile] = useState<File | null>(null);
  const notify = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh(); // Add this hook

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    formData.append('author', values.author);
    formData.append('category', values.category);
    formData.append("metaTitle", values.metaTitle || "");
    formData.append("metaDescription", values.metaDescription || "");
  
    if (file) {
      formData.append('image', file);
    }
  
    try {
      const response = await fetch(`/api/blog?id=${values.id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        notify('Blog post updated successfully', { type: 'success' });
        refresh(); // Refresh data to show updated title and content
        redirect('/blog');
      } else {
        throw new Error('Failed to update blog post');
      }
    } catch (error) {
      notify('Error updating blog post', { type: 'error' });
    }
  };

  return (
    <Edit {...props}>
      <SimpleForm onSubmit={handleSubmit}>
        <TextInput source="title" label="Title" />
        <TextInput source="author" label="Author" />
        <TextInput source="category" label="Category" />
        <RichTextInput source="content" label="Content (Rich Text)" fullWidth />
        <TextInput source="metaTitle" label="Meta Title" fullWidth />
        <TextInput source="metaDescription" label="Meta Description" multiline fullWidth />
        
        

        {/* Custom File Upload */}
        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {file && <p>Selected file: {file.name}</p>}

        <DateInput source="createdAt" label="Created At" />

        <button type="submit">Update Blog Post</button>
      </SimpleForm>
    </Edit>
  );
};

export default BlogPostEdit;
