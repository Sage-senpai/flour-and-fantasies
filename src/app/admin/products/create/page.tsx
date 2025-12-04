'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUpload from '@/components/ImageUpload';
import styles from './createProduct.module.scss';

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    category: 'Cakes',
    description: 'describe flavour and design',
    image: '',
    stock: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') }),
    }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      toast.error('Please upload a product image');
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (!res.ok) throw new Error('Failed to create product');

      toast.success('Product created successfully! 🎂');
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createProduct}>
      <Button variant="outline" onClick={() => router.back()}>
        ← Back to Products
      </Button>

      <h1>Create New Product</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Product Image *</label>
          <ImageUpload
            value={formData.image}
            onChange={handleImageChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Product Name *</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Rose Velvet Cake"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Slug *</label>
          <Input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            placeholder="Auto-generated from name"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Price ($) *</label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Stock *</label>
            <Input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              placeholder="0"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="Cakes">Cakes</option>
            <option value="Pastries">Pastries</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className={styles.textarea}
            rows={4}
            placeholder="Describe your product..."
          />
        </div>

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Creating...' : 'Create Product'}
        </Button>
      </form>
    </div>
  );
}