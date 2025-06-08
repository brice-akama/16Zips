"use client";
import React, { useState, useEffect } from 'react';
import { Edit, SimpleForm, TextInput, NumberInput, SelectInput, BooleanInput, EditProps, ReferenceArrayInput,useNotify, SelectArrayInput, SimpleFormIterator,ArrayInput, } from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';
import { FiUpload } from 'react-icons/fi';

const categories = [
  { id: 'Microdose Kits', name: 'Microdose Kits' },
  { id: 'Gummies', name: 'Gummies' },
  { id: 'Chocolate Bars', name: 'Chocolate Bars' },
  { id: 'Dried Mushrooms', name: 'Dried Mushrooms' },
  { id: 'Wax', name: 'Wax' },
  { id: 'Shatter', name: 'Shatter' },
  { id: 'Snowball', name: 'Snowball' },
  { id: 'Moon Rock', name: 'Moon Rock' },
  { id: 'Live Resin', name: 'Live Resin' },
    { id: 'Rosin', name: 'Rosin' },
    { id: 'Distillate', name: 'Distillate' },
    { id: 'Hash', name: 'Hash' },
    
    { id: 'Kief', name: 'Kief' },
    { id: 'Crumble', name: 'Crumble' },
    { id: 'Budder', name: 'Budder' },
    { id: 'Edibles Gummies', name: 'Edibles Gummies' },
    { id: 'Chocolates Edibles', name: 'Chocolates Edibles' },
    { id: 'Brownies', name: 'Brownies' },
    { id: 'Hard Candies', name: 'Hard Candies' },
    { id: 'CBD Capsules', name: 'CBD Capsules' },
    { id: 'THC Capsules', name: 'THC Capsules' },
    { id: 'Hybrid Pre Rolls', name: 'Hybrid Pre Rolls' },
    { id: 'Sativa Pre Rolls', name: 'Sativa Pre Rolls' },
    { id: 'Indica Pre Rolls', name: 'Indica Pre Rolls' },
    { id: 'Autoflower Seeds', name: 'Autoflower Seeds' },
    { id: 'Feminized Seeds', name: 'Feminized Seeds' },
    { id: ' Vape Pods', name: ' Vape Pods' },
    { id: 'Sativa', name: 'Sativa' },
    { id: 'Indica', name: 'Indica' },
    { id: 'Disposables  Vapes', name: 'Disposables  Vapes' },
    { id: ' Vape Cartridges', name: ' Vape Cartridges' },
    { id: 'Hybrid', name: 'Hybrid' },
    { id: 'Regular Seeds', name: 'Regular Seeds' },
   
    
];

export const ProductEdit: React.FC<EditProps> = (props) => {
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [seoTitleLength, setSeoTitleLength] = useState(0);
  const [seoDescriptionLength, setSeoDescriptionLength] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<(File | null)[]>([null, null, null, null]);
  const notify = useNotify();
  const { id } = props; 


  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');

  const maxSeoTitleLength = 60;
  const maxSeoDescriptionLength = 160;
  const maxDescriptionLength = 500;

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionLength(event.target.value.length);
  };

  const handleSeoTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeoTitleLength(event.target.value.length);
  };

  const handleSeoDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeoDescriptionLength(event.target.value.length);
  };

  const handleMainImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setMainImage(file);
    }
  };

  const handleThumbnailChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const updatedThumbnails = [...thumbnails];
      updatedThumbnails[index] = file;
      setThumbnails(updatedThumbnails);
    }
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      const products = await fetch('/api/products') // Replace with your actual API endpoint
        .then(res => res.json())
        .then(data => data);
      setRelatedProducts(products);
    };

    fetchRelatedProducts();
  }, []);

  const handleSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("id", data.id); // Add this line to append the ID
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("edibles", data.edibles ? 'true' : 'false');
    formData.append("popularProduct", data.popularProduct ? 'true' : 'false');
    formData.append("seoTitle", data.seoTitle);
    formData.append("seoDescription", data.seoDescription);
    formData.append("seoKeywords", data.seoKeywords);
    formData.append("isPublished", data.isPublished ? 'true' : 'false');

    // Serialize weights and seeds before appending
    if (data.weights && data.weights.length > 0) {
      formData.append("weights", JSON.stringify(data.weights)); // Serialize weights
    }
    if (data.seeds && data.seeds.length > 0) {
      formData.append("seeds", JSON.stringify(data.seeds)); // Serialize seeds
    }
  
    if (mainImage) {
      formData.append("mainImage", mainImage);
    }
  
    // Append thumbnails only if they exist
    thumbnails.forEach((thumbnail) => {
      if (thumbnail) {
        formData.append("thumbnails", thumbnail);
      }
    });
  
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        body: formData,
      });
  
      if (response.ok) {
        notify('Product updated successfully', { type: 'success' });
      } else {
        const errorMessage = await response.text();
        notify(`Failed to update product: ${errorMessage}`, { type: 'error' });
      }
    } catch (error) {
      notify('An error occurred while updating the product', { type: 'error' });
      console.error('Error:', error);
    }
  };
  
  

  return (
    <Edit {...props}>
      <SimpleForm onSubmit={handleSubmit}>
        <TextInput source="name" label="Product Name" onChange={(e) => setProductName(e.target.value)} value={productName} />

        <RichTextInput
          source="description"
          label="Product Description"
          onChange={handleDescriptionChange}
          helperText={`Character limit: ${descriptionLength}/${maxDescriptionLength}`}
        />

        <NumberInput source="price" label="Price" onChange={(e) => setPrice(e.target.value)} value={price} />

        <SelectInput source="category" label="Category" choices={categories} onChange={(e) => setCategory(e.target.value)} value={category} />

        <BooleanInput source="edibles" label="Features Products" />
        <BooleanInput source="popularProduct" label="Popular Product" />

        <label>Main Image:</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="file" accept="image/*" onChange={handleMainImageChange} style={{ display: 'none' }} id="mainImageUpload" />
          <label htmlFor="mainImageUpload" style={{ cursor: 'pointer' }}>
            <FiUpload size={24} />
          </label>
          {mainImage && (
            <img src={URL.createObjectURL(mainImage)} alt="Main" style={{ width: '200px', marginTop: '10px' }} />
          )}
        </div>

        <label>Thumbnails (Max 4):</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {thumbnails.map((thumbnail, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={(event) => handleThumbnailChange(index, event)} style={{ display: 'none' }} id={`thumbnailUpload-${index}`} />
              <label htmlFor={`thumbnailUpload-${index}`} style={{ cursor: 'pointer' }}>
                <FiUpload size={24} />
              </label>
              {thumbnail && (
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt={`Thumbnail ${index + 1}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '5px' }}
                />
              )}
            </div>
          ))}
        </div>

        <ReferenceArrayInput
          label="Related Products"
          source="relatedProducts"
          reference="products"
        >
          <SelectArrayInput
            optionText="name"
            optionValue="id"
          />
        </ReferenceArrayInput>

        <ArrayInput source="weights" label="Weight Options (with Prices)">
                  <SimpleFormIterator>
                    <TextInput source="label" label="Weight (e.g., 1g, 3.5g)" />
                    <NumberInput source="price" label="Price ($)" />
                  </SimpleFormIterator>
                </ArrayInput>
        
                {/* Show seeds options only if category includes 'Seeds' */}
                {category.includes('Seeds') && (
                  <ArrayInput source="seeds" label="Seed Options (with Prices)">
                    <SimpleFormIterator>
                      <TextInput source="label" label="Seeds (e.g., 5 seeds)" />
                      <NumberInput source="price" label="Price ($)" />
                    </SimpleFormIterator>
                  </ArrayInput>
                )}

        <TextInput
          source="seoTitle"
          label="SEO Title"
          onChange={handleSeoTitleChange}
          helperText={`Character limit: ${seoTitleLength}/${maxSeoTitleLength}`}
        />
        <TextInput
          source="seoDescription"
          label="SEO Description"
          onChange={handleSeoDescriptionChange}
          helperText={`Character limit: ${seoDescriptionLength}/${maxSeoDescriptionLength}`}
        />
        <TextInput source="seoKeywords" label="SEO Keywords" />

        <BooleanInput source="isPublished" label="Publish" />
      </SimpleForm>
    </Edit>
  );
};