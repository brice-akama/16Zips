"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  CreateProps,
  useNotify,
  useRedirect,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import MediaModal from "./MediaModal";
import { Button } from "@mui/material";
import type Quill from "quill"; // Import Quill type for typing

const BlogPostCreate: React.FC<CreateProps> = (props) => {
  const [file, setFile] = useState<File | null>(null);
  const [openMediaModal, setOpenMediaModal] = useState(false);
  const quillRef = useRef<any>(null); // Ref to access the Quill instance

  const notify = useNotify();
  const redirect = useRedirect();

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files) {
      setFile(event.target.files[0]);
    }
  };

  // Insert selected image as URL at cursor position
  const handleSelectImage = (imageUrl: string) => {
    const editor: Quill = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection();
      if (range) {
        editor.insertEmbed(range.index, "image", imageUrl);
      }
    }
    setOpenMediaModal(false);
  };

  // Handle paste event for images
  const handlePaste = (e: ClipboardEvent) => {
    const editor: Quill = quillRef.current?.getEditor();
    if (!editor) return;

    const items = e.clipboardData?.items;
    if (items) {
      // Loop through the items to find image data
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = function (event) {
              const imageUrl = event.target?.result as string;
              const range = editor.getSelection();
              if (range) {
                editor.insertEmbed(range.index, "image", imageUrl);
              }
            };
            reader.readAsDataURL(blob); // Convert the image to base64 URL and insert
          }
        }
      }
    }
  };

  // Add event listener for paste
  useEffect(() => {
  const editor = quillRef.current?.getEditor();
  if (!editor) return;

  editor.root.addEventListener("paste", handlePaste);

  return () => {
    editor.root.removeEventListener("paste", handlePaste);
  };
}, []);


  // Submit form data
  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content); // Will contain image URLs
    formData.append("author", values.author);
    formData.append("category", values.category);
    formData.append("metaTitle", values.metaTitle || "");
formData.append("metaDescription", values.metaDescription || "");

    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        notify("Blog post created successfully", { type: "success" });
        redirect("/blog");
      } else {
        throw new Error("Failed to create blog post");
      }
    } catch (error) {
      notify("Error creating blog post", { type: "error" });
    }
  };

  return (
    <Create {...props}>
      <SimpleForm onSubmit={handleSubmit}>
        <TextInput source="title" label="Title" required />
        <TextInput source="author" label="Author" required />
        <TextInput source="category" label="Category" required />
        <TextInput source="metaTitle" label="Meta Title" fullWidth />
<TextInput source="metaDescription" label="Meta Description" multiline fullWidth />


        {/* Rich Text with Insert Image */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <RichTextInput
            source="content"
            label="Content (Rich Text)"
            fullWidth
            ref={quillRef} // Get Quill instance
          />
          <Button variant="outlined" onClick={() => setOpenMediaModal(true)}>
            Insert Image
          </Button>
        </div>

        {/* Media Modal */}
        <MediaModal
          open={openMediaModal}
          onClose={() => setOpenMediaModal(false)}
          onSelectImage={handleSelectImage}
        />

        {/* Optional file input for thumbnail */}
        <label>Upload Blog Thumbnail:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {file && <p>Selected file: {file.name}</p>}

        <DateInput source="createdAt" label="Created At" defaultValue={new Date()} />
        <button type="submit">Create Blog Post</button>
      </SimpleForm>
    </Create>
  );
};

export default BlogPostCreate;