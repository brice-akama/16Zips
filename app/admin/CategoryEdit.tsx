"use client";
import { Edit, SimpleForm, TextInput, useNotify, useRedirect, required, EditProps } from 'react-admin';
import { InputLabel, Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useState, useEffect } from 'react';

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

interface CategoryFormValues {
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
}

const CategoryEdit: React.FC<EditProps> = (props) => {
  const [file, setFile] = useState<File | null>(null);
  const [slug, setSlug] = useState<string>('');
  const { record } = props; // You can directly access `record` from the `props` here.
  const notify = useNotify();
  const redirect = useRedirect();

  useEffect(() => {
    if (record?.slug) {
      setSlug(record.slug);
    }
  }, [record]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files) {
      setFile(event.target.files[0]);
    }
  };

  // Handle the form submission
  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('slug', slug);
    formData.append('description', values.description || '');
    formData.append('metaTitle', values.metaTitle || '');
    formData.append('metaDescription', values.metaDescription || '');

    if (file) {
      formData.append('image', file);
    }

    try {
      const response = await fetch(`/api/category?id=${values.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        notify('Category updated successfully', { type: 'success' });
        redirect('/category');
      } else {
        throw new Error('Failed to update category');
      }
    } catch (error) {
      notify('Error updating category', { type: 'error' });
    }
  };

  return (
    <Edit {...props}>
      <SimpleForm onSubmit={handleSubmit}>
        <TextInput
          source="name"
          validate={required()}
          onChange={(e) => setSlug(generateSlug(e.target.value))}
        />
        <TextInput source="slug" validate={required()} value={slug} disabled />
        <TextInput source="description" multiline />
        <TextInput source="metaTitle" />
        <TextInput source="metaDescription" multiline />

        <InputLabel style={{ marginTop: '1em' }}>
          Upload New Category Image:
        </InputLabel>
        <Button component="label" variant="outlined" startIcon={<UploadIcon />}>
          Choose File
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
        {file && <p style={{ marginTop: 8 }}>Selected: {file.name}</p>}

        <button type="submit">Update Category</button>
      </SimpleForm>
    </Edit>
  );
};

export default CategoryEdit;