'use client';

import { useGetAdminProductsQuery } from '@/lib/store/services/admin-api';

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useGetAdminProductsQuery();

  if (isLoading) return <div className="p-8 text-slate-500">Loading products…</div>;
  if (isError) return <div className="p-8 text-red-500">Failed to load products.</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-slate-900 mb-6">Products</h1>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Slug</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Price</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(products ?? []).map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-900 font-medium">{product.name}</td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{product.slug}</td>
                <td className="px-4 py-3 text-slate-700">₹{product.price}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                    product.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
