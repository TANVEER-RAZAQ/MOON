'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGetAdminProductsQuery, useUpdateAdminProductMutation } from '@/lib/store/services/admin-api';

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useGetAdminProductsQuery();
  const [updateProduct] = useUpdateAdminProductMutation();

  const toggleActive = (id: string, current: boolean) => {
    updateProduct({ id, patch: { is_active: !current } });
  };

  if (isLoading) {
    return (
      <div className="p-8 animate-pulse space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 text-sm">Failed to load products. Check backend connection.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-slate-900">Products</h1>
        <span className="text-xs text-slate-400">{(products ?? []).length} total</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider w-12" />
              <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Category</th>
              <th className="text-right px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Price</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Active</th>
              <th className="text-right px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider w-20">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(products ?? []).map((product) => {
              const thumb = product.images?.[0]?.url || product.image_url;
              const displayPrice = product.discount_price ?? product.price;
              return (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-300 text-lg">image</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900 truncate max-w-[200px]">{product.name}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-[200px]">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {product.category ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {product.category}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-slate-900">₹{Number(displayPrice).toLocaleString('en-IN')}</span>
                    {product.discount_price && (
                      <span className="text-xs text-slate-400 line-through ml-1">₹{Number(product.price).toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleActive(product.id, !!product.is_active)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#454e90]/20 ${
                        product.is_active ? 'bg-[#454e90]' : 'bg-slate-200'
                      }`}
                      aria-label={`Toggle ${product.name} active state`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                          product.is_active ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/products/${product.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#454e90] bg-[#454e90]/8 hover:bg-[#454e90]/15 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(products ?? []).length === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}
