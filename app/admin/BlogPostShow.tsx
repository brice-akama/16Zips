'use client';

import { Show, SimpleShowLayout, TextField, DateField, RichTextField, ImageField } from 'react-admin';

const BlogPostShow: React.FC = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="title" label="Title" />
        <TextField source="author" label="Author" />
        <TextField source="category" label="Category" />
        <RichTextField source="content" label="Content" />
        <DateField source="createdAt" label="Created At" />

        {/* Display Image */}
        <ImageField source="imageUrl" label="Image" />
      </SimpleShowLayout>
    </Show>
  );
};

export default BlogPostShow;