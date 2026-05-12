'use client';

import { use, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  useGetAdminProductsQuery,
  useUpdateAdminProductMutation,
  useUploadProductImagesMutation,
  useUpdateProductImagesArrayMutation,
  useCreateAdminProductMutation,
} from '@/lib/store/services/admin-api';
import type { ProductImage } from '@/lib/store/services/admin-api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Btn } from '@/components/ui/Btn';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { MoonInput } from '@/components/ui/Input';
import { MoonTextarea } from '@/components/ui/Textarea';
import { Toggle } from '@/components/ui/Toggle';
import { Icon } from '@/components/ui/Icon';

type Props = { params: Promise<{ id: string }> };

const MAX_UPLOAD_FILES = 5;
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_UPLOAD_MB = Math.round(MAX_UPLOAD_BYTES / 1024 / 1024);

function getApiErrorMessage(error: unknown) {
  const maybeError = error as { data?: { message?: string }; error?: string; message?: string };
  return maybeError?.data?.message ?? maybeError?.message ?? maybeError?.error ?? null;
}

function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function ProductEditPage({ params }: Props) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();

  const { data: products } = useGetAdminProductsQuery();
  const [updateProduct, { isLoading: isSaving }] = useUpdateAdminProductMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadProductImagesMutation();
  const [updateImagesArray] = useUpdateProductImagesArrayMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateAdminProductMutation();

  const product = isNew ? null : products?.find((p) => p.id === id);

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
  const [fallbackImages, setFallbackImages] = useState<Array<{ url: string; alt: string; order: number }>>([]);
  const [uploadError, setUploadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew || !product) return;
    setName(product.name);
    setDescription(product.description ?? '');
    setPrice(String(product.price));
    setDiscountPrice(product.discount_price != null ? String(product.discount_price) : '');
    setCategory(product.category ?? '');
    setTheme(product.theme ?? '');
    setMetaTitle(product.meta_title ?? '');
    setMetaDescription(product.meta_description ?? '');
    setIsActive(product.is_active ?? true);
    const allImages = [...(product.images ?? [])].sort((a, b) => a.order - b.order);
    const real = allImages.filter((img: any) => !img.isFallback);
    const fallback = allImages.filter((img: any) => img.isFallback);
    setImages(real);
    setFallbackImages(fallback);
  }, [product, isNew]);

  const handleSave = async () => {
    setSaveError('');
    setSaveSuccess('');

    if (!name.trim()) {
      setSaveError('Product name is required.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setSaveError('Price must be greater than 0.');
      return;
    }

    try {
      if (isNew) {
        // Create new product
        const result = await createProduct({
          name: name.trim(),
          description: description.trim() || undefined,
          price: Number(price),
          discount_price: discountPrice ? Number(discountPrice) : null,
          category: category.trim() || undefined,
          theme: theme.trim() || undefined,
          meta_title: metaTitle.trim() || undefined,
          meta_description: metaDescription.trim() || undefined,
          is_active: isActive,
        }).unwrap();
        setSaveSuccess('Product created successfully!');
        // Navigate to the edit page of the newly created product
        setTimeout(() => router.push(`/products/${result.id}`), 800);
      } else {
        // Update existing product
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
        setSaveSuccess('Changes saved!');
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? 'Save failed.';
      setSaveError(msg);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (isNew) {
      setUploadError('Save the product first, then upload images.');
      return;
    }

    const selectedFiles = Array.from(files);
    if (selectedFiles.length > MAX_UPLOAD_FILES) {
      setUploadError(`Upload a maximum of ${MAX_UPLOAD_FILES} images at a time.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const oversized = selectedFiles.filter((file) => file.size > MAX_UPLOAD_BYTES);
    if (oversized.length > 0) {
      const names = oversized.map((file) => `${file.name} (${formatBytes(file.size)})`).join(', ');
      setUploadError(`These images are too large: ${names}. Max ${MAX_UPLOAD_MB} MB each.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadError('');
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('images', file));
    try {
      const result = await uploadImages({ productId: id, formData }).unwrap();
      const startOrder = images.length;
      const newImages = result.images.map((img, i) => ({ ...img, order: startOrder + i }));
      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      setUploadError(getApiErrorMessage(error) ?? `Upload failed. Check file size (max ${MAX_UPLOAD_MB} MB per image, max ${MAX_UPLOAD_FILES} images).`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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

  if (!isNew && !product) return <div className="p-10 text-[var(--ink-3)]">Loading...</div>;

  const isBusy = isSaving || isCreating;

  return (
    <div className="anim-fade-in flex flex-col gap-6 max-w-[1000px]">
      <PageHeader
        eyebrow={isNew ? 'New Product' : 'Editing Product'}
        title={isNew ? 'Create product' : product!.name}
        actions={[
          <Btn key="cancel" variant="secondary" onClick={() => router.push('/products')}>Cancel</Btn>,
          <Btn key="save" variant="primary" icon="check" onClick={handleSave} disabled={isBusy}>
            {isBusy ? 'Saving...' : isNew ? 'Create product' : 'Save changes'}
          </Btn>,
        ]}
      />

      {/* Status messages */}
      {saveError && (
        <div className="py-3 px-[18px] rounded-[10px] bg-[rgba(181,87,58,0.08)] border border-[var(--terracotta)] text-[var(--terracotta)] text-[13px]">{saveError}</div>
      )}
      {saveSuccess && (
        <div className="py-3 px-[18px] rounded-[10px] bg-[var(--sage-soft)] border border-[var(--sage)] text-[var(--sage)] text-[13px]">{saveSuccess}</div>
      )}

      <div className="grid grid-cols-[1fr_340px] gap-6 items-start">
        {/* Left Col - Main details */}
        <div className="flex flex-col gap-6">
          <Card title="Basic Info">
            <div className="flex flex-col gap-[18px] mt-4">
              <Field label="Product Title" hint="Used everywhere. Keep it clear and concise.">
                <MoonInput value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Pure Saffron Elixir" />
              </Field>
              <Field label="Description" hint="Appears on the product detail page. Supports markdown.">
                <MoonTextarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your product..." />
              </Field>
              <div className="flex gap-4">
                <Field label="Price (₹)">
                  <MoonInput type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
                </Field>
                <Field label="Compare-at price" hint="Shows a strikethrough price">
                  <MoonInput type="number" step="0.01" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} placeholder="Optional" />
                </Field>
              </div>
            </div>
          </Card>

          <Card title="Media" subtitle={isNew ? 'Save the product first, then upload images.' : images.length > 0 ? 'Product imagery. First image is the hero.' : 'Upload images or use stock previews below.'}>
            <div className="mt-4">
              {images.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 mb-4">
                  {images.map((img, idx) => {
                    const validSrc = (() => { try { new URL(img.url); return img.url; } catch { return null; } })();
                    return (
                      <div key={img.url || idx} className="relative aspect-square rounded-[10px] overflow-hidden border border-[var(--line)] group">
                        {validSrc ? (
                          <Image src={validSrc} alt={img.alt || 'img'} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[var(--bg-sunk)] flex items-center justify-center"><Icon name="broken_image" /></div>
                        )}
                        <div className="absolute top-1.5 right-1.5 flex gap-1 bg-[var(--bg-elev)] rounded-md p-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <button title="Move left" onClick={() => moveImage(idx, -1)} disabled={idx===0} className="p-1 cursor-pointer border-none bg-transparent"><Icon name="chevron_left" size={14} /></button>
                          <button title="Move right" onClick={() => moveImage(idx, 1)} disabled={idx===images.length-1} className="p-1 cursor-pointer border-none bg-transparent"><Icon name="chevron_right" size={14} /></button>
                          <button title="Remove image" onClick={() => removeImage(idx)} className="p-1 cursor-pointer border-none bg-transparent text-[var(--terracotta)]"><Icon name="close" size={14} /></button>
                        </div>
                        {idx === 0 && <div className="absolute bottom-1.5 left-1.5 bg-[var(--saffron)] text-white text-[10px] py-0.5 px-1.5 rounded font-medium">Primary</div>}
                      </div>
                    );
                  })}
                </div>
              )}
              
              <button
                type="button"
                onClick={() => isNew ? setSaveError('Save the product first before uploading images.') : fileInputRef.current?.click()}
                className={`w-full border border-dashed border-[var(--line-strong)] rounded-[10px] p-8 flex flex-col items-center gap-2 bg-[var(--bg-sunk)] text-[var(--ink-2)] transition-opacity ${isNew ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'}`}
              >
                <Icon name="add_photo_alternate" size={24} />
                <span className="text-[13px] font-medium">{isUploading ? 'Uploading...' : 'Add images'}</span>
                <span className="text-[11.5px] text-[var(--ink-3)]">Max {MAX_UPLOAD_FILES} images, {MAX_UPLOAD_MB} MB each</span>
              </button>
              <input aria-label="Upload image" ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
              {uploadError && <div className="mt-2 text-[var(--terracotta)] text-xs">{uploadError}</div>}

              {/* Stock fallback preview — shown only when no real images uploaded */}
              {images.length === 0 && fallbackImages.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Icon name="photo_library" size={14} />
                    <span className="text-xs font-medium text-[var(--ink-2)]">Stock photos (shown until you upload)</span>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
                    {fallbackImages.map((img, idx) => {
                      const validSrc = (() => { try { new URL(img.url); return img.url; } catch { return null; } })();
                      return (
                        <div key={img.url || idx} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--line)] opacity-75">
                          {validSrc ? (
                            <Image src={validSrc} alt={img.alt || 'Stock'} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[var(--bg-sunk)] flex items-center justify-center"><Icon name="broken_image" /></div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] text-center py-0.5 font-semibold tracking-wider">STOCK</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card title="Search engine optimization">
            <div className="flex flex-col gap-[18px] mt-4">
              <Field label="Meta Title" suffix={`${metaTitle.length}/60`}>
                <MoonInput value={metaTitle} onChange={e => setMetaTitle(e.target.value)} maxLength={60} placeholder="Page title for search engines" />
              </Field>
              <Field label="Meta Description" suffix={`${metaDescription.length}/160`}>
                <MoonTextarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} maxLength={160} placeholder="Brief summary for search results" />
              </Field>
            </div>
          </Card>
        </div>

        {/* Right Col - Metadata */}
        <div className="flex flex-col gap-6">
          <Card title="Status">
            <div className="mt-4 flex items-center gap-3">
              <Toggle checked={isActive} onChange={setIsActive} />
              <div className="text-[13px] font-medium text-[var(--ink)]">{isActive ? 'Active on store' : 'Draft mode'}</div>
            </div>
          </Card>

          <Card title="Organization">
            <div className="flex flex-col gap-[18px] mt-4">
              <Field label="Category" hint="Assign to a collection taxonomy.">
                <MoonInput value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Skincare" />
              </Field>
              <Field label="Theme / Collection" hint="Visual grouping for the storefront.">
                <MoonInput value={theme} onChange={e => setTheme(e.target.value)} placeholder="e.g. Saffron" />
              </Field>
            </div>
          </Card>

          {!isNew && product && (
            <Card title="Activity">
              <div className="mt-4 text-[13px] text-[var(--ink-3)] flex flex-col gap-3">
                <div className="flex justify-between">
                  <span>Created</span> <span className="mono">{product.updated_at ? new Date(product.updated_at).toLocaleDateString() : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last updated</span> <span className="mono">{product.updated_at ? new Date(product.updated_at).toLocaleDateString() : '—'}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
