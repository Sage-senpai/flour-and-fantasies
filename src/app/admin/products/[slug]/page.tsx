// src/app/admin/products/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUpload from '@/components/ImageUpload';
import Loader from '@/components/ui/Loader';
import styles from './editProduct.module.scss';

interface ProductForm {
  name: string;
  slug: string;
  price: string;
  category: string;
  description: string;
  image: string;
  stock: string;
  couponEligible: boolean;
  couponPrice: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [/*productId */, setProductId] = useState('');
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    slug: '',
    price: '',
    category: 'Cakes',
    description: '',
    image: '',
    stock: '',
    couponEligible: false,
    couponPrice: '',
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Fetch by slug to get product data
        const res = await fetch(`/api/products/${params.slug}`);
        if (!res.ok) throw new Error('Product not found');
        
        const product = await res.json();
        //setProductId(product.id); // Save ID for updates
        setFormData({
          name: product.name,
          slug: product.slug,
          price: product.price.toString(),
          category: product.category,
          description: product.description,
          image: product.image,
          stock: product.stock.toString(),
          couponEligible: product.couponEligible || false,
          couponPrice: product.couponPrice?.toString() || '',
        });
      } catch (error) {
        console.error(error);
        toast.error('Product not found');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

    if (formData.couponEligible && !formData.couponPrice) {
      toast.error('Please set a coupon price for this product');
      return;
    }
    
    setSaving(true);
    const loadingToast = toast.loading('Updating product...');

    try {
      // Update using slug endpoint
      const res = await fetch(`/api/products/${params.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          price: parseFloat(formData.price),
          category: formData.category,
          description: formData.description,
          image: formData.image,
          stock: parseInt(formData.stock),
          couponEligible: formData.couponEligible,
          couponPrice: formData.couponEligible && formData.couponPrice 
            ? parseFloat(formData.couponPrice) 
            : null,
        }),
      });

      if (!res.ok) throw new Error('Failed to update product');

      toast.dismiss(loadingToast);
      toast.success('Product updated successfully! 🎂');
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setSaving(true);
    const loadingToast = toast.loading('Deleting product...');

    try {
      const res = await fetch(`/api/products/${params.slug}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete product');

      toast.dismiss(loadingToast);
      toast.success('Product deleted successfully!');
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error('Failed to delete product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.editProduct}>
      <Button variant="outline" onClick={() => router.push('/admin/products')}>
        ← Back to Products
      </Button>

      <h1>Edit Product</h1>

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
            placeholder="rose-velvet-cake"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Price (₦) *</label>
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
              step="1"
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

        <div className={styles.couponSection}>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="couponEligible"
              name="couponEligible"
              checked={formData.couponEligible}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <label htmlFor="couponEligible" className={styles.checkboxLabel}>
              🎟️ This product can be purchased with coupons
            </label>
          </div>

          {formData.couponEligible && (
            <div className={styles.formGroup}>
              <label>Coupon Price (₦) *</label>
              <Input
                type="number"
                name="couponPrice"
                value={formData.couponPrice}
                onChange={handleChange}
                step="0.01"
                placeholder="Enter coupon price in Naira"
              />
              <span className={styles.hint}>
                Amount of coupon credits needed to purchase this item
              </span>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button type="submit" fullWidth disabled={saving}>
            {saving ? 'Updating...' : 'Update Product'}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            fullWidth 
            disabled={saving}
            onClick={handleDelete}
          >
            Delete Product
          </Button>
        </div>
      </form>
    </div>
  );
}