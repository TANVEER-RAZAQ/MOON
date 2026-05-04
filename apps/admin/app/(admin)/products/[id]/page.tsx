'use client';

import { use, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  useGetAdminProductsQuery,
  useUpdateAdminProductMutation,
  useUploadProductImagesMutation,
  useUpdateProductImagesArrayMutation,
} from '@/lib/store/services/admin-api';
import type { ProductImage } from '@/lib/store/services/admin-api';

type Props = { params: Promise<{ id: string }> };

export default function ProductEditPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const { data: products } = useGetAdminProductsQuery();
  const [updateProduct, { isLoading: isSaving }] = useUpdateAdminProductMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadProductImagesMutation();
  const [updateImagesArray] = useUpdateProductImagesArrayMutation();

  const product = products?.find((p) => p.id === id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState('');
  const [theme, setTheme] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setDescription(product.description ?? '');
    setPrice(String(product.price));
    setDiscountPrice(product.discount_price != null ? String(product.discount_price) : '');
    setCategory(product.category ?? '');
    setTheme(product.theme ?? '');
    setMetaTitle(product.meta_title ?? '');
    setMetaDescription(product.meta_description ?? '');
    setIsActive(product.is_active ?? true);
    setImages([...(product.images ?? [])].sort((a, b) => a.order - b.order));
  }, [product]);

  const handleSave = async () => {
    setSaveSuccess(false);
    await updateProduct({
      id,
      patch: {
        name: name.trim() || undefined,
        description: description.trim() || undefined,
        price: price ? Number(price) : undefined,
        discount_price: discountPrice ? Number(discountPrice) : null,
        category: category.trim() || undefined,
        theme: theme.trim() || undefined,
        meta_title: metaTitle.trim() || undefined,
        meta_description: metaDescription.trim() || undefined,
        is_active: isActive,
      },
    }).unwrap();
    await updateImagesArray({ id, images }).unwrap();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError('');
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('images', file));
    try {
      const result = await uploadImages({ productId: id, formData }).unwrap();
      const startOrder = images.length;
      const newImages = result.images.map((img, i) => ({ ...img, order: startOrder + i }));
      setImages((prev) => [...prev, ...newImages]);
    } catch {
      setUploadError('Upload failed. Check file size (max 5 MB per image, max 5 images).');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove('border-[#454e90]', 'bg-[#454e90]/5');
    handleFiles(e.dataTransfer.files);
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= images.length) return;
    const updated = [...images];
    [updated[index], updated[next]] = [updated[next], updated[index]];
    setImages(updated.map((img, i) => ({ ...img, order: i })));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i })));
  };

  const updateImageAlt = (index: number, alt: string) => {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, alt } : img)));
  };

  if (!product) {
    return (
      <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-slate-100" />
        <div className="h-40 rounded-xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => router.push('/products')}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Back to products"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
        </button>
        <h1 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900 truncate">{product.name}</h1>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">Basic Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#454e90]/20 focus:border-[#454e90]/50 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#454e90]/20 focus:border-[#454e90]/50 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#454e90]/20 focus:border-[#454e90]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Discount Price (₹) — optional</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Leave empty to remove"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#454e90]/20 focus:border-[#454e90]/50 outline-none placeholder-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#454e90]/20 focus:border-[#454e90]/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Theme</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#454e90]/20 focus:border-[#454e90]/50 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive((v) => !v)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#454e90]/20 ${
                isActive ? 'bg-[#454e90]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  isActive ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className="text-sm text-slate-600 font-medium">{isActive ? 'Active' : 'Inactive'}</span>
          </div>
        </section>

        {/* SEO */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">SEO</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              maxLength={255}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#454e90]/20 focus:border-[#454e90]/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Meta Description</label>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              maxLength={500}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#454e90]/20 focus:border-[#454e90]/50 outline-none resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">{metaDescription.length}/500</p>
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">Images</h2>

          <div
            ref={dropZoneRef}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); dropZoneRef.current?.classList.add('border-[#454e90]', 'bg-[#454e90]/5'); }}
            onDragLeave={() => dropZoneRef.current?.classList.remove('border-[#454e90]', 'bg-[#454e90]/5')}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl py-10 px-6 text-center cursor-pointer hover:border-[#454e90]/40 hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl text-slate-300 block mb-2">cloud_upload</span>
            <p className="text-sm font-medium text-slate-500">
              {isUploading ? 'Uploading…' : 'Drop images here or click to select'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Up to 5 images · 5 MB each · JPEG / PNG / WebP</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {uploadError && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{uploadError}</p>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, index) => (
                <div key={img.url} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <div className="aspect-square">
                    <Image
                      src={img.url}
                      alt={img.alt || 'Product image'}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                      className="w-6 h-6 rounded-md bg-white/90 shadow text-slate-600 flex items-center justify-center disabled:opacity-30"
                      aria-label="Move left"
                    >
                      <span className="material-symbols-outlined text-xs">chevron_left</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 1)}
                      disabled={index === images.length - 1}
                      className="w-6 h-6 rounded-md bg-white/90 shadow text-slate-600 flex items-center justify-center disabled:opacity-30"
                      aria-label="Move right"
                    >
                      <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="w-6 h-6 rounded-md bg-white/90 shadow text-red-500 flex items-center justify-center"
                      aria-label="Remove image"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                  {index === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-[#454e90] text-white px-1.5 py-0.5 rounded-md">
                      Primary
                    </span>
                  )}
                  <div className="p-1.5">
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => updateImageAlt(index, e.target.value)}
                      placeholder="Alt text"
                      className="w-full text-xs border-0 bg-transparent outline-none text-slate-500 placeholder-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Save */}
        <div className="flex items-center gap-3 pb-8">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#454e90] text-white text-sm font-semibold hover:bg-[#3a4280] disabled:opacity-60 transition-colors"
          >
            <span className="material-symbols-outlined text-base">{isSaving ? 'hourglass_empty' : 'save'}</span>
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
